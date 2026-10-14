import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActiveRide,
  ChatMessage,
  DriverInfo,
  LocationPoint,
  TripHistoryItem,
  VehicleType,
  FareBreakdown,
} from './types/ride';
import {
  CITY_LOCATIONS,
  DEFAULT_DRIVERS,
  DEFAULT_TRIP_HISTORY,
  FLEET_OPTIONS,
  generateRoutePoints,
  calculateDistanceKm,
  calculateHeading,
} from './data/mockCityData';
import { VectorMap } from './components/VectorMap';
import { RiderView } from './components/RiderView';
import { DriverView } from './components/DriverView';
import {
  SplitConsoleHeader,
  AppViewMode,
} from './components/SplitConsoleHeader';
import { playSound } from './utils/audio';

export default function App() {
  // Global application views & configuration
  const [viewMode, setViewMode] = useState<AppViewMode>('split');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Rider selections
  const [pickup, setPickup] = useState<LocationPoint>(CITY_LOCATIONS[0]); // Pollachi New Bus Stand
  const [dropoff, setDropoff] = useState<LocationPoint>(CITY_LOCATIONS[2]); // Mahalingapuram Roundabout
  const [vehicleType, setVehicleType] = useState<VehicleType>('auto');

  // Driver Fleet Pool
  const [drivers, setDrivers] = useState<DriverInfo[]>(DEFAULT_DRIVERS);
  const activeDriver = drivers.find((d) => d.vehicleType === vehicleType) || drivers[0];

  // Active Ride Central State
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);

  // In-App Chat Messages State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Trip History State
  const [tripHistory, setTripHistory] = useState<TripHistoryItem[]>(DEFAULT_TRIP_HISTORY);

  // Route points array currently being traversed
  const [currentRoutePoints, setCurrentRoutePoints] = useState<{ x: number; y: number }[]>([]);
  const currentStepIndexRef = useRef<number>(0);

  // Helper to calculate upfront fare breakdown
  const calculateFare = useCallback(
    (vType: VehicleType, pLoc: LocationPoint, dLoc: LocationPoint, hasDiscount = false): FareBreakdown => {
      const fleetOpt = FLEET_OPTIONS.find((f) => f.type === vType) || FLEET_OPTIONS[0];
      const dist = calculateDistanceKm(pLoc, dLoc);
      const estMinutes = Math.round(dist * 2.8);
      const baseFare = fleetOpt.baseFare;
      const distanceFare = Math.round(dist * fleetOpt.perKmRate);
      const timeFare = Math.round(estMinutes * fleetOpt.perMinRate);
      const discount = hasDiscount ? 25 : 0;
      const subtotal = baseFare + distanceFare + timeFare - discount;
      const taxes = Math.round(subtotal * 0.05); // 5% GST
      const total = Math.max(30, subtotal + taxes);

      return {
        baseFare,
        distanceKm: dist,
        distanceFare,
        timeMinutes: estMinutes,
        timeFare,
        surgeMultiplier: 1.0,
        discount,
        taxes,
        total,
      };
    },
    []
  );

  // Pre-calculate route line for zero-state map display
  useEffect(() => {
    if (!activeRide) {
      const initialRoute = generateRoutePoints(pickup, dropoff);
      setCurrentRoutePoints(initialRoute);
    }
  }, [pickup, dropoff, activeRide]);

  // Request a Ride (Rider Action)
  const handleRequestRide = (paymentMethod: 'cash' | 'upi' | 'wallet', promoCode: string) => {
    if (!isMuted) playSound.dispatchPing();

    const fare = calculateFare(vehicleType, pickup, dropoff, promoCode === 'DISCOUNT');
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Prepare route from driver current position to pickup point first
    const pathToPickup = generateRoutePoints(
      { x: activeDriver.currentX, y: activeDriver.currentY },
      { x: pickup.x, y: pickup.y }
    );
    setCurrentRoutePoints(pathToPickup);
    currentStepIndexRef.current = 0;
    setChatMessages([]); // Fresh chat thread for new ride

    const newRide: ActiveRide = {
      id: `POL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'SEARCHING',
      vehicleType,
      pickup,
      dropoff,
      driver: { ...activeDriver },
      rider: {
        name: 'Aarav Sharma',
        phone: '+91 98765 43210',
        rating: 4.95,
      },
      otp: randomOtp,
      fare,
      paymentMethod,
      driverPos: { x: activeDriver.currentX, y: activeDriver.currentY },
      heading: activeDriver.heading,
      speedKmph: 0,
      progressPercent: 0,
      estimatedMinutesLeft: 3,
      distanceRemainingKm: 0.8,
      currentStreet: 'Pollachi Bus Stand Circular Road',
      startedAt: Date.now(),
      chatMessages: [],
    };

    setActiveRide(newRide);
  };

  // Send an in-app chat message (exchanged in real time between Rider & Driver)
  const handleSendChatMessage = (sender: 'rider' | 'driver', text: string) => {
    const senderName =
      sender === 'rider'
        ? activeRide?.rider.name || 'Passenger'
        : activeRide?.driver.name || 'Driver';

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender,
      senderName,
      text,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    if (!isMuted) playSound.chatNotification();
  };

  // Driver Accepts Ride
  const handleAcceptRide = () => {
    if (!isMuted) playSound.click();
    if (!activeRide) return;

    setActiveRide((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'ACCEPTED',
        speedKmph: 28,
        currentStreet: 'En route to pickup in Pollachi',
      };
    });

    // Automated greeting from driver
    setTimeout(() => {
      handleSendChatMessage('driver', 'Hello! On my way to your pickup point.');
    }, 1200);
  };

  // Driver Declines Ride
  const handleDeclineRide = () => {
    if (!isMuted) playSound.click();
    setActiveRide(null);
  };

  // Driver Arrives at Pickup
  const handleArrivedPickup = () => {
    if (!isMuted) playSound.dispatchPing();
    if (!activeRide) return;

    // Switch route to dropoff destination
    const pathToDrop = generateRoutePoints(
      { x: activeRide.pickup.x, y: activeRide.pickup.y },
      { x: activeRide.dropoff.x, y: activeRide.dropoff.y }
    );
    setCurrentRoutePoints(pathToDrop);
    currentStepIndexRef.current = 0;

    setActiveRide((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'ARRIVED_PICKUP',
        driverPos: { x: prev.pickup.x, y: prev.pickup.y },
        speedKmph: 0,
        progressPercent: 0,
        distanceRemainingKm: prev.fare.distanceKm,
        estimatedMinutesLeft: prev.fare.timeMinutes,
      };
    });

    // Driver notification message
    handleSendChatMessage('driver', 'I have arrived at your pickup spot.');
  };

  // Driver Verifies OTP and Starts Trip
  const handleVerifyOtpAndStart = (enteredOtp: string): boolean => {
    if (!activeRide) return false;
    if (enteredOtp !== activeRide.otp) {
      return false;
    }

    if (!isMuted) playSound.otpSuccess();

    setActiveRide((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'IN_TRANSIT',
        speedKmph: 34,
        currentStreet: 'Mahalingapuram Main Road',
      };
    });
    return true;
  };

  // Complete Trip & Append to Trip History
  const handleCompleteTrip = () => {
    if (!isMuted) playSound.tripCompleted();
    if (!activeRide) return;

    const completedRide = { ...activeRide };

    setActiveRide((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'COMPLETED',
        driverPos: { x: prev.dropoff.x, y: prev.dropoff.y },
        progressPercent: 100,
        distanceRemainingKm: 0,
        estimatedMinutesLeft: 0,
        speedKmph: 0,
        completedAt: Date.now(),
      };
    });

    // Add this completed trip to trip history
    const historyItem: TripHistoryItem = {
      id: completedRide.id,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pickup: completedRide.pickup,
      dropoff: completedRide.dropoff,
      vehicleType: completedRide.vehicleType,
      vehicleName:
        FLEET_OPTIONS.find((f) => f.type === completedRide.vehicleType)?.title ||
        'Pollachi Auto',
      driverName: completedRide.driver.name,
      driverPhone: completedRide.driver.phone,
      vehiclePlate: completedRide.driver.vehiclePlate,
      fareAmount: completedRide.fare.total,
      paymentMethod: completedRide.paymentMethod,
      distanceKm: completedRide.fare.distanceKm,
      durationMinutes: completedRide.fare.timeMinutes,
      rating: 5,
    };

    setTripHistory((prev) => [historyItem, ...prev]);

    // Update driver shift stats
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === activeDriver.id) {
          return {
            ...d,
            todayEarnings: d.todayEarnings + completedRide.fare.total,
            todayTrips: d.todayTrips + 1,
            currentX: completedRide.dropoff.x,
            currentY: completedRide.dropoff.y,
          };
        }
        return d;
      })
    );
  };

  // Settle Payment & Return Driver to Duty
  const handleSettlePayment = () => {
    if (!isMuted) playSound.click();
    setActiveRide(null);
    setChatMessages([]);
    // Reset route display
    const newRoute = generateRoutePoints(pickup, dropoff);
    setCurrentRoutePoints(newRoute);
  };

  // Rider Rates Trip
  const handleRateTrip = (stars: number, feedback: string) => {
    // Feedback logged
  };

  // Rebook a past route from Trip History
  const handleRebookTrip = (p: LocationPoint, d: LocationPoint, v: VehicleType) => {
    setPickup(p);
    setDropoff(d);
    setVehicleType(v);
  };

  // Toggle Driver Online / Offline Duty
  const handleToggleDriverDuty = () => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === activeDriver.id ? { ...d, isOnline: !d.isOnline } : d))
    );
  };

  // Quick Pollachi Route Scenarios Loader
  const handleLoadScenario = (scenario: 'busstand_mahalingam' | 'bazaar_station' | 'cbe_udumalpet') => {
    if (!isMuted) playSound.click();
    setActiveRide(null);
    setChatMessages([]);

    if (scenario === 'busstand_mahalingam') {
      setPickup(CITY_LOCATIONS[0]); // New Bus Stand
      setDropoff(CITY_LOCATIONS[2]); // Mahalingapuram
      setVehicleType('auto');
    } else if (scenario === 'bazaar_station') {
      setPickup(CITY_LOCATIONS[1]); // Gandhi Statue Bazaar
      setDropoff(CITY_LOCATIONS[3]); // Railway Station
      setVehicleType('e_rickshaw');
    } else {
      setPickup(CITY_LOCATIONS[4]); // Coimbatore Rd Achipatti
      setDropoff(CITY_LOCATIONS[6]); // Udumalpet Rd
      setVehicleType('mini_cab');
    }
  };

  // Full System Reset
  const handleResetAll = () => {
    if (!isMuted) playSound.click();
    setActiveRide(null);
    setChatMessages([]);
    setPickup(CITY_LOCATIONS[0]);
    setDropoff(CITY_LOCATIONS[2]);
    setVehicleType('auto');
    setDrivers(DEFAULT_DRIVERS);
  };

  // Simulation Tick Loop: Moves the driver vehicle along currentRoutePoints
  useEffect(() => {
    if (!activeRide) return;
    if (activeRide.status !== 'ACCEPTED' && activeRide.status !== 'IN_TRANSIT') return;
    if (currentRoutePoints.length < 2) return;

    const intervalTime = Math.max(120, Math.floor(400 / simSpeed));

    const simTimer = setInterval(() => {
      currentStepIndexRef.current += 1;
      const nextIdx = currentStepIndexRef.current;

      if (nextIdx >= currentRoutePoints.length) {
        // Reached waypoint end
        if (activeRide.status === 'ACCEPTED') {
          handleArrivedPickup();
        } else if (activeRide.status === 'IN_TRANSIT') {
          handleCompleteTrip();
        }
        return;
      }

      const prevPt = currentRoutePoints[Math.max(0, nextIdx - 1)];
      const currentPt = currentRoutePoints[nextIdx];
      const heading = calculateHeading(prevPt, currentPt);

      const totalSteps = currentRoutePoints.length;
      const progress = Math.round((nextIdx / totalSteps) * 100);

      // Remaining distance computation
      const targetPt =
        activeRide.status === 'ACCEPTED'
          ? { x: activeRide.pickup.x, y: activeRide.pickup.y }
          : { x: activeRide.dropoff.x, y: activeRide.dropoff.y };
      const distLeft = calculateDistanceKm(currentPt, targetPt);
      const estMin = Math.max(1, Math.round(distLeft * 2.5));

      // Realistic speed fluctuation (28 to 44 km/h)
      const dynamicSpeed = 32 + Math.floor(Math.sin(nextIdx) * 8);

      setActiveRide((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          driverPos: currentPt,
          heading,
          progressPercent: progress,
          distanceRemainingKm: distLeft,
          estimatedMinutesLeft: estMin,
          speedKmph: dynamicSpeed,
          currentStreet:
            nextIdx < totalSteps * 0.3
              ? 'New Bus Stand Circular Rd'
              : nextIdx < totalSteps * 0.7
              ? 'Mahalingapuram Main Road'
              : 'NH 83 Coimbatore Highway Corridor',
        };
      });
    }, intervalTime);

    return () => clearInterval(simTimer);
  }, [
    activeRide?.status,
    currentRoutePoints,
    simSpeed,
    activeRide?.pickup.x,
    activeRide?.dropoff.x,
  ]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 font-sans">
      {/* Universal Top Bar Header */}
      <SplitConsoleHeader
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        simSpeed={simSpeed}
        onChangeSimSpeed={setSimSpeed}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((m) => !m)}
        onLoadScenario={handleLoadScenario}
        onResetAll={handleResetAll}
      />

      {/* Main Multi-Pane Viewport Canvas */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* ========================================================== */}
        {/* PANE 1: RIDER VIEWPORT (Visible in 'split' or 'rider_only')*/}
        {/* ========================================================== */}
        {(viewMode === 'split' || viewMode === 'rider_only') && (
          <section
            className={`flex flex-col h-full z-10 shrink-0 transition-all ${
              viewMode === 'rider_only'
                ? 'w-full lg:w-1/2'
                : 'w-full lg:w-[380px] xl:w-[420px]'
            }`}
          >
            <RiderView
              activeRide={activeRide}
              selectedPickup={pickup}
              selectedDropoff={dropoff}
              selectedVehicleType={vehicleType}
              tripHistory={tripHistory}
              chatMessages={chatMessages}
              onSelectPickup={setPickup}
              onSelectDropoff={setDropoff}
              onSelectVehicleType={setVehicleType}
              onRequestRide={handleRequestRide}
              onCancelRide={() => setActiveRide(null)}
              onRateTrip={handleRateTrip}
              onResetToNewBooking={() => setActiveRide(null)}
              onRebookTrip={handleRebookTrip}
              onSendChatMessage={handleSendChatMessage}
            />
          </section>
        )}

        {/* ========================================================== */}
        {/* CENTER PANE: INTERACTIVE VECTOR MAP CANVAS                 */}
        {/* ========================================================== */}
        <section className="flex-1 flex flex-col h-full relative overflow-hidden min-h-[320px]">
          <VectorMap
            activeRide={activeRide}
            drivers={drivers}
            pickupId={pickup.id}
            dropoffId={dropoff.id}
            routePoints={currentRoutePoints}
            onSelectLocation={(locId) => {
              const found = CITY_LOCATIONS.find((l) => l.id === locId);
              if (!found) return;
              if (locId === pickup.id) return;
              setDropoff(found);
            }}
            className="flex-1 w-full h-full"
          />
        </section>

        {/* ========================================================== */}
        {/* PANE 2: DRIVER VIEWPORT (Visible in 'split' or 'driver_only')*/}
        {/* ========================================================== */}
        {(viewMode === 'split' || viewMode === 'driver_only') && (
          <section
            className={`flex flex-col h-full z-10 shrink-0 border-l border-slate-800 transition-all ${
              viewMode === 'driver_only'
                ? 'w-full lg:w-1/2'
                : 'w-full lg:w-[380px] xl:w-[420px]'
            }`}
          >
            <DriverView
              driver={activeDriver}
              activeRide={activeRide}
              chatMessages={chatMessages}
              onToggleOnline={handleToggleDriverDuty}
              onAcceptRide={handleAcceptRide}
              onDeclineRide={handleDeclineRide}
              onArrivedPickup={handleArrivedPickup}
              onVerifyOtpAndStart={handleVerifyOtpAndStart}
              onCompleteTrip={handleCompleteTrip}
              onSettlePayment={handleSettlePayment}
              onSendChatMessage={handleSendChatMessage}
            />
          </section>
        )}
      </main>
    </div>
  );
}
