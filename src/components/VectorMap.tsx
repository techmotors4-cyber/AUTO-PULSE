import React, { useState, useRef, useMemo } from 'react';
import {
  Compass,
  Navigation,
  Plus,
  Minus,
  Maximize2,
  MapPin,
  Building2,
  Train,
  Briefcase,
  ShoppingBag,
  Plane,
  Heart,
  Trees,
} from 'lucide-react';
import {
  CITY_LOCATIONS,
  CITY_ROADS,
  CITY_RIVER,
  RoadSegment,
} from '../data/mockCityData';
import { ActiveRide, DriverInfo, VehicleType } from '../types/ride';

interface VectorMapProps {
  activeRide: ActiveRide | null;
  drivers: DriverInfo[];
  pickupId?: string;
  dropoffId?: string;
  interactiveMode?: 'rider' | 'driver' | 'console';
  routePoints?: { x: number; y: number }[];
  onSelectLocation?: (locationId: string) => void;
  className?: string;
}

export const VectorMap: React.FC<VectorMapProps> = ({
  activeRide,
  drivers,
  pickupId,
  dropoffId,
  routePoints = [],
  onSelectLocation,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.75, z - 0.25));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center on Vehicle if in transit
  const handleCenterVehicle = () => {
    if (activeRide) {
      // Coordinate space 0..1000, map center is 500,500
      const targetX = 500 - activeRide.driverPos.x;
      const targetY = 500 - activeRide.driverPos.y;
      setPan({ x: targetX * 0.5 * zoom, y: targetY * 0.5 * zoom });
      setZoom(1.3);
    }
  };

  // Path SVG string
  const routePathString = useMemo(() => {
    if (routePoints.length < 2) return '';
    return routePoints.reduce(
      (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
      ''
    );
  }, [routePoints]);

  // Driven progress path
  const drivenPathString = useMemo(() => {
    if (!activeRide || routePoints.length < 2) return '';
    const sliceIndex = Math.floor(
      (activeRide.progressPercent / 100) * routePoints.length
    );
    const drivenPoints = routePoints.slice(0, Math.max(2, sliceIndex + 1));
    return drivenPoints.reduce(
      (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
      ''
    );
  }, [activeRide, routePoints]);

  // Get location icon
  const getLocationIcon = (id: string) => {
    switch (id) {
      case 'loc_metro':
        return <Train className="w-3.5 h-3.5 text-blue-600" />;
      case 'loc_techpark':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600" />;
      case 'loc_market':
        return <Building2 className="w-3.5 h-3.5 text-amber-600" />;
      case 'loc_railway':
        return <Train className="w-3.5 h-3.5 text-rose-600" />;
      case 'loc_hospital':
        return <Heart className="w-3.5 h-3.5 text-red-600" />;
      case 'loc_lake':
        return <Trees className="w-3.5 h-3.5 text-emerald-600" />;
      case 'loc_mall':
        return <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />;
      case 'loc_airport':
        return <Plane className="w-3.5 h-3.5 text-sky-600" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  // Render Top-Down Vehicle Sprite
  const renderVehicleSprite = (
    type: VehicleType,
    heading: number,
    isCurrentTrip = false
  ) => {
    if (type === 'auto') {
      // Classic 3-wheeler Auto Rickshaw (Yellow & Black with angled windshield)
      return (
        <g
          transform={`rotate(${heading})`}
          className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
        >
          {/* Wheelbase shadow */}
          <ellipse cx="0" cy="1" rx="14" ry="20" fill="rgba(0,0,0,0.2)" />
          {/* Main Auto Body - iconic 3-wheeler shape: tapered front, wide square rear */}
          <path
            d="M 0 -22 L 10 -10 L 12 16 L -12 16 L -10 -10 Z"
            fill="#0F172A"
            stroke="#F59E0B"
            strokeWidth="2"
          />
          {/* Yellow Hood Roof */}
          <rect
            x="-10"
            y="-6"
            width="20"
            height="18"
            rx="3"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1.5"
          />
          {/* Windshield bar */}
          <rect x="-8" y="-12" width="16" height="4" rx="1" fill="#38BDF8" opacity="0.9" />
          {/* Headlamp */}
          <circle cx="0" cy="-21" r="2.5" fill="#FEF08A" />
          {/* Front Mudguard wheel */}
          <rect x="-2" y="-23" width="4" height="6" rx="1" fill="#1E293B" />
          {/* Rear bumper & taillights */}
          <rect x="-10" y="15" width="20" height="2" fill="#DC2626" />
          {isCurrentTrip && (
            <circle
              cx="0"
              cy="0"
              r="24"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="animate-spin"
            />
          )}
        </g>
      );
    } else if (type === 'e_rickshaw') {
      // E-Rickshaw Eco Green
      return (
        <g
          transform={`rotate(${heading})`}
          className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
        >
          <ellipse cx="0" cy="1" rx="13" ry="19" fill="rgba(0,0,0,0.2)" />
          {/* Green Electric Body */}
          <path
            d="M 0 -20 L 9 -8 L 11 16 L -11 16 L -9 -8 Z"
            fill="#065F46"
            stroke="#10B981"
            strokeWidth="2"
          />
          {/* Eco White/Emerald Canopy */}
          <rect
            x="-9"
            y="-5"
            width="18"
            height="17"
            rx="2.5"
            fill="#ECFDF5"
            stroke="#10B981"
            strokeWidth="1.5"
          />
          {/* Solar/Battery indicator strip */}
          <rect x="-6" y="-1" width="12" height="3" rx="1" fill="#10B981" />
          {/* Windshield */}
          <rect x="-7" y="-10" width="14" height="4" rx="1" fill="#6EE7B7" opacity="0.9" />
          {/* Headlight */}
          <circle cx="0" cy="-19" r="2.5" fill="#A7F3D0" />
          {isCurrentTrip && (
            <circle
              cx="0"
              cy="0"
              r="24"
              fill="none"
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="animate-spin"
            />
          )}
        </g>
      );
    } else {
      // Mini Cab AC (Hatchback 4-Wheeler)
      return (
        <g
          transform={`rotate(${heading})`}
          className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
        >
          <ellipse cx="0" cy="2" rx="15" ry="24" fill="rgba(0,0,0,0.2)" />
          {/* Car body */}
          <rect
            x="-12"
            y="-22"
            width="24"
            height="44"
            rx="6"
            fill="#FFFFFF"
            stroke="#4F46E5"
            strokeWidth="2"
          />
          {/* Windshield front */}
          <path d="M -9 -10 L 9 -10 L 11 -3 L -11 -3 Z" fill="#1E293B" />
          {/* Rear glass */}
          <path d="M -10 12 L 10 12 L 8 16 L -8 16 Z" fill="#1E293B" />
          {/* AC Roof Carrier / Decal */}
          <rect x="-8" y="-1" width="16" height="10" rx="2" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1" />
          {/* Side mirrors */}
          <rect x="-14" y="-11" width="2" height="4" rx="1" fill="#4F46E5" />
          <rect x="12" y="-11" width="2" height="4" rx="1" fill="#4F46E5" />
          {/* Headlamps */}
          <rect x="-10" y="-22" width="4" height="2" fill="#FEF08A" />
          <rect x="6" y="-22" width="4" height="2" fill="#FEF08A" />
          {isCurrentTrip && (
            <circle
              cx="0"
              cy="0"
              r="26"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="animate-spin"
            />
          )}
        </g>
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] bg-slate-900 overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full transform transition-transform duration-75"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          {/* Road gradient */}
          <linearGradient id="routeProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Building pattern */}
          <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#0B132B" />
            <rect x="4" y="4" width="32" height="32" rx="4" fill="#1C2541" opacity="0.35" />
          </pattern>

          {/* Park texture */}
          <pattern id="parkGreen" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#064E3B" opacity="0.4" />
            <circle cx="15" cy="15" r="5" fill="#047857" opacity="0.5" />
          </pattern>
        </defs>

        {/* 1. Base Ground City Grid */}
        <rect width="1000" height="1000" fill="url(#cityGrid)" />

        {/* 2. City River / Waterway */}
        <path
          d={`M ${CITY_RIVER.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`}
          fill="#0284C7"
          opacity="0.3"
        />

        {/* 3. Parks and Greens */}
        <rect x="500" y="800" width="180" height="120" rx="16" fill="url(#parkGreen)" />
        <rect x="150" y="150" width="120" height="100" rx="12" fill="url(#parkGreen)" />

        {/* 4. City Road Infrastructure */}
        {CITY_ROADS.map((road: RoadSegment) => {
          const pathD = road.points.reduce(
            (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
            ''
          );
          const isHwy = road.type === 'highway';
          const isArt = road.type === 'arterial';
          return (
            <g key={road.id}>
              {/* Road Casing / Border */}
              <path
                d={pathD}
                fill="none"
                stroke="#1E293B"
                strokeWidth={isHwy ? 28 : isArt ? 18 : 12}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Road Asphalt Fill */}
              <path
                d={pathD}
                fill="none"
                stroke="#334155"
                strokeWidth={isHwy ? 22 : isArt ? 14 : 8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Center Line Marking */}
              {(isHwy || isArt) && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHwy ? '#FBBF24' : '#E2E8F0'}
                  strokeWidth="1.5"
                  strokeDasharray={isHwy ? '8 8' : '5 6'}
                  opacity="0.6"
                />
              )}
            </g>
          );
        })}

        {/* 5. Planned / Full Ride Route (Underlay) */}
        {routePathString && (
          <path
            d={routePathString}
            fill="none"
            stroke="#6366F1"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 8"
            opacity="0.45"
          />
        )}

        {/* 6. Live Completed Path (Active GPS Gradient) */}
        {drivenPathString && (
          <path
            d={drivenPathString}
            fill="none"
            stroke="url(#routeProgressGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* 7. Nearby Idle Drivers (Simulation) */}
        {drivers.map((drv) => {
          const isCurrentActive = activeRide?.driver.id === drv.id;
          if (isCurrentActive) return null; // Rendered below with live coordinates
          return (
            <g
              key={drv.id}
              transform={`translate(${drv.currentX}, ${drv.currentY})`}
              className="cursor-pointer transition-transform hover:scale-125"
            >
              {renderVehicleSprite(drv.vehicleType, drv.heading, false)}
            </g>
          );
        })}

        {/* 8. Active Ride Live Driver Vehicle */}
        {activeRide && (
          <g
            transform={`translate(${activeRide.driverPos.x}, ${activeRide.driverPos.y})`}
            className="transition-all duration-300"
          >
            {renderVehicleSprite(
              activeRide.vehicleType,
              activeRide.heading,
              true
            )}
            {/* Speed bubble above driver */}
            <g transform="translate(0, -36)">
              <rect
                x="-28"
                y="-10"
                width="56"
                height="18"
                rx="9"
                fill="#0F172A"
                stroke="#F59E0B"
                strokeWidth="1"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill="#FEF3C7"
                fontSize="9"
                fontWeight="700"
                className="font-tabular"
              >
                {activeRide.speedKmph} km/h
              </text>
            </g>
          </g>
        )}

        {/* 9. City Landmark Pins */}
        {CITY_LOCATIONS.map((loc) => {
          const isPickup = activeRide?.pickup.id === loc.id || pickupId === loc.id;
          const isDrop = activeRide?.dropoff.id === loc.id || dropoffId === loc.id;

          return (
            <g
              key={loc.id}
              transform={`translate(${loc.x}, ${loc.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectLocation?.(loc.id)}
            >
              {/* Pulsing ring for selected targets */}
              {isPickup && (
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="#10B981"
                  opacity="0.25"
                  className="animate-ping"
                />
              )}
              {isDrop && (
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="#EF4444"
                  opacity="0.25"
                  className="animate-ping"
                />
              )}

              {/* Pin Base Circle */}
              <circle
                cx="0"
                cy="0"
                r={isPickup || isDrop ? 16 : 10}
                fill={
                  isPickup
                    ? '#10B981'
                    : isDrop
                    ? '#EF4444'
                    : '#1E293B'
                }
                stroke={isPickup || isDrop ? '#FFFFFF' : '#475569'}
                strokeWidth={isPickup || isDrop ? 2.5 : 1.5}
              />

              {/* Target Label */}
              <g transform="translate(0, 24)">
                <rect
                  x="-55"
                  y="-8"
                  width="110"
                  height="16"
                  rx="4"
                  fill="#0F172A"
                  fillOpacity="0.85"
                  stroke="#334155"
                  strokeWidth="0.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={isPickup ? '#6EE7B7' : isDrop ? '#FCA5A5' : '#CBD5E1'}
                  fontSize="8.5"
                  fontWeight={isPickup || isDrop ? '700' : '500'}
                >
                  {isPickup ? '📍 PICKUP' : isDrop ? '🏁 DROP' : loc.name}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Floating HUD Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-transform shadow-md"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-transform shadow-md"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleCenterVehicle}
          title="Track Vehicle"
          className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-transform shadow-md ${
            activeRide
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
              : 'bg-slate-800/90 text-slate-400 border-slate-700/80'
          }`}
        >
          <Navigation className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          title="Reset Map"
          className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-transform shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Live Map Telemetry Kicker (Bottom Overlay) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 flex items-center gap-2 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-medium text-slate-200">
            {activeRide ? activeRide.currentStreet : 'Pollachi Town - New Bus Stand'}
          </span>
          <span className="text-slate-500">·</span>
          <span className="font-tabular text-amber-400 font-semibold">
            {activeRide ? `${activeRide.speedKmph} km/h` : '3 Autos nearby (TN-41)'}
          </span>
        </div>

        {activeRide && (
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 flex items-center gap-2 pointer-events-auto">
            <span className="text-slate-400">ETA:</span>
            <span className="font-tabular font-bold text-emerald-400">
              {activeRide.estimatedMinutesLeft} min
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-tabular text-slate-200">
              {activeRide.distanceRemainingKm} km
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
