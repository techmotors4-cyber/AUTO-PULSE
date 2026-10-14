import { LocationPoint, VehicleOption, DriverInfo, TripHistoryItem } from '../types/ride';

// Pollachi City Operator Info
export const POLLACHI_OPERATOR = {
  name: 'Johskhan',
  phone: '9080040503',
  displayPhone: '90800 40503',
  fullPhoneWithCode: '+919080040503',
  city: 'Pollachi',
  tamilTitle: 'பொள்ளாச்சி ஆட்டோ & மினி கேப்',
  tagline: '24/7 Local Auto & Mini Cab Call Dispatch',
};

// Pollachi City Transit Hubs & Landmarks (Coordinate bounds: 0 to 1000)
export const CITY_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc_new_bus_stand',
    name: 'Pollachi New Bus Stand (புதிய பேருந்து நிலையம்)',
    address: 'Bus Stand Circular Road, Town Center',
    landmark: 'Platform 1 & Town Bus Terminal',
    x: 480,
    y: 440,
  },
  {
    id: 'loc_gandhi_statue',
    name: 'Gandhi Statue & Bazaar (காந்தி சிலை & பஜார்)',
    address: 'Bazaar Street, Pollachi Town Center',
    landmark: 'Old Municipal Clock & Shopping Street',
    x: 360,
    y: 520,
  },
  {
    id: 'loc_mahalingapuram',
    name: 'Mahalingapuram Roundabout (மகாலிங்கபுரம்)',
    address: 'Mahalingapuram Main Road',
    landmark: 'Arch Entrance & Roundabout',
    x: 600,
    y: 320,
  },
  {
    id: 'loc_railway_station',
    name: 'Pollachi Junction Railway Station (ரயில் நிலையம்)',
    address: 'Station Road, Southern Railway Sector',
    landmark: 'Concourse & Auto Stand Bay',
    x: 340,
    y: 660,
  },
  {
    id: 'loc_achipatti',
    name: 'Coimbatore Road - Achipatti (கோவை ரோடு - ஆச்சிபட்டி)',
    address: 'NH 83 Coimbatore Highway Corridor',
    landmark: 'Achipatti Industrial Junction',
    x: 820,
    y: 180,
  },
  {
    id: 'loc_ngm_college',
    name: 'Palakkad Road - NGM College (பாலக்காடு ரோடு)',
    address: 'SH 19 Palakkad Highway Sector',
    landmark: 'NGM College Main Academic Gate',
    x: 180,
    y: 380,
  },
  {
    id: 'loc_udumalpet_rd',
    name: 'Udumalpet Road Junction (உடுமலை ரோடு)',
    address: 'SH 21 Udumalpet Highway Link',
    landmark: 'East Pollachi Commercial Arch',
    x: 840,
    y: 720,
  },
  {
    id: 'loc_sub_collector',
    name: 'Sub-Collector Office & Court (சார்-ஆட்சியர் அலுவலகம்)',
    address: 'Collectorate Complex Road',
    landmark: 'Administrative Block & Taluk Office',
    x: 640,
    y: 540,
  },
  {
    id: 'loc_meenkarai_rd',
    name: 'Meenkarai Road - Uzhavar Sandhai (உழவர் சந்தை)',
    address: 'Meenkarai Bypass Road',
    landmark: 'Farmers Daily Vegetable Market',
    x: 280,
    y: 820,
  },
];

// Major Roads for the Pollachi Vector Map Layout
export interface RoadSegment {
  id: string;
  name: string;
  points: { x: number; y: number }[];
  type: 'highway' | 'arterial' | 'street';
}

export const CITY_ROADS: RoadSegment[] = [
  // Coimbatore Highway (NH 83) - North-East Spine
  {
    id: 'road_cbe_nh83',
    name: 'NH 83 Coimbatore Highway (கோவை ரோடு)',
    points: [
      { x: 480, y: 440 },
      { x: 600, y: 320 },
      { x: 720, y: 240 },
      { x: 820, y: 180 },
      { x: 920, y: 120 },
    ],
    type: 'highway',
  },
  // Palakkad Highway (SH 19) - West Spine
  {
    id: 'road_palakkad_sh19',
    name: 'SH 19 Palakkad Road (பாலக்காடு ரோடு)',
    points: [
      { x: 480, y: 440 },
      { x: 360, y: 400 },
      { x: 260, y: 390 },
      { x: 180, y: 380 },
      { x: 80, y: 370 },
    ],
    type: 'highway',
  },
  // Udumalpet Highway (SH 21) - South-East Spine
  {
    id: 'road_udumalpet_sh21',
    name: 'Udumalpet Road (உடுமலை ரோடு)',
    points: [
      { x: 480, y: 440 },
      { x: 640, y: 540 },
      { x: 740, y: 640 },
      { x: 840, y: 720 },
      { x: 940, y: 800 },
    ],
    type: 'highway',
  },
  // Meenkarai Road - South-West Spine
  {
    id: 'road_meenkarai',
    name: 'Meenkarai Road (மீன்கரை ரோடு)',
    points: [
      { x: 360, y: 520 },
      { x: 340, y: 660 },
      { x: 280, y: 820 },
      { x: 200, y: 920 },
    ],
    type: 'arterial',
  },
  // Central Market Ring & Station Link
  {
    id: 'road_market_link',
    name: 'Gandhi Bazaar Road (பஜார் வீதி)',
    points: [
      { x: 480, y: 440 },
      { x: 360, y: 520 },
      { x: 340, y: 660 },
      { x: 480, y: 700 },
      { x: 640, y: 540 },
      { x: 480, y: 440 },
    ],
    type: 'arterial',
  },
  // Mahalingapuram Main Link
  {
    id: 'road_mahalingapuram_link',
    name: 'Mahalingapuram Main Road (மகாலிங்கபுரம் சாலை)',
    points: [
      { x: 480, y: 440 },
      { x: 600, y: 320 },
      { x: 540, y: 220 },
      { x: 400, y: 240 },
      { x: 480, y: 440 },
    ],
    type: 'street',
  },
];

// Pollachi Water Canal / Stream (Aliyar Feeder Canal representation)
export const CITY_RIVER = [
  { x: 100, y: 650 },
  { x: 250, y: 620 },
  { x: 450, y: 630 },
  { x: 650, y: 610 },
  { x: 850, y: 590 },
  { x: 960, y: 580 },
  { x: 960, y: 610 },
  { x: 850, y: 620 },
  { x: 650, y: 640 },
  { x: 450, y: 660 },
  { x: 250, y: 650 },
  { x: 100, y: 680 },
];

// Fleet Options: ONLY AUTO AND MINI CABS (Pollachi Local Rates in ₹)
export const FLEET_OPTIONS: VehicleOption[] = [
  {
    type: 'auto',
    title: 'Pollachi Auto Rickshaw (ஆட்டோ)',
    tagline: 'Classic 3-Wheeler · Quick town travel',
    capacity: 3,
    baseFare: 30,
    perKmRate: 14,
    perMinRate: 1.2,
    etaMinutes: 2,
    iconType: 'auto',
    badge: 'Fastest in Pollachi',
  },
  {
    type: 'e_rickshaw',
    title: 'E-Rickshaw Eco (மின்சார ஆட்டோ)',
    tagline: '100% Electric · Silent & Zero Emission',
    capacity: 4,
    baseFare: 25,
    perKmRate: 11,
    perMinRate: 1.0,
    etaMinutes: 3,
    iconType: 'e_rickshaw',
    badge: 'Eco Friendly',
  },
  {
    type: 'mini_cab',
    title: 'Mini Cab AC (மினி கேப்)',
    tagline: 'Compact 4-Seater AC Hatchback · Outstation & Highway',
    capacity: 4,
    baseFare: 60,
    perKmRate: 18,
    perMinRate: 2.0,
    etaMinutes: 4,
    iconType: 'mini_cab',
    badge: 'AC Comfort',
  },
];

// Active Driver Pool in Pollachi (TN-41 Registration)
// Lead Driver & Operator: Johskhan
export const DEFAULT_DRIVERS: DriverInfo[] = [
  {
    id: 'drv_johskhan',
    name: 'Johskhan (ஜோஸ்கான்)',
    phone: '9080040503',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    vehicleType: 'auto',
    vehicleModel: 'Bajaj RE Compact 4S (Pollachi Special)',
    vehiclePlate: 'TN 41 AX 3624',
    rating: 4.96,
    totalTrips: 4120,
    joinedYear: 2019,
    currentX: 450,
    currentY: 460,
    heading: 60,
    isOnline: true,
    todayEarnings: 1540,
    todayTrips: 11,
  },
  {
    id: 'drv_murugan',
    name: 'Murugan (முருகன்)',
    phone: '9080040503',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    vehicleType: 'e_rickshaw',
    vehicleModel: 'Mahindra Treo Electric 3W',
    vehiclePlate: 'TN 41 ER 1092',
    rating: 4.88,
    totalTrips: 2450,
    joinedYear: 2022,
    currentX: 470,
    currentY: 410,
    heading: 120,
    isOnline: true,
    todayEarnings: 1220,
    todayTrips: 8,
  },
  {
    id: 'drv_senthil',
    name: 'Senthil Kumar (செந்தில்)',
    phone: '9080040503',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    vehicleType: 'mini_cab',
    vehicleModel: 'Maruti Suzuki WagonR AC (Pollachi Cab)',
    vehiclePlate: 'TN 41 Y 8820',
    rating: 4.94,
    totalTrips: 3890,
    joinedYear: 2020,
    currentX: 520,
    currentY: 450,
    heading: 240,
    isOnline: true,
    todayEarnings: 2350,
    todayTrips: 7,
  },
];

// Helper to generate a realistic coordinate path between two points
export function generateRoutePoints(
  from: { x: number; y: number },
  to: { x: number; y: number }
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  points.push({ x: from.x, y: from.y });

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const midX = from.x + dx * 0.4;
  const midY = from.y + dy * 0.2;
  points.push({ x: midX, y: midY });

  const midX2 = from.x + dx * 0.6;
  const midY2 = from.y + dy * 0.8;
  points.push({ x: midX2, y: midY2 });

  points.push({ x: to.x, y: to.y });

  const smoothPoints: { x: number; y: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const steps = 18;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      smoothPoints.push({
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
      });
    }
  }
  smoothPoints.push({ x: to.x, y: to.y });
  return smoothPoints;
}

// Calculate approximate distance in km from coordinate space
export function calculateDistanceKm(
  from: { x: number; y: number },
  to: { x: number; y: number }
): number {
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const km = (dist / 1000) * 9.8;
  return Math.max(1.0, Number(km.toFixed(1)));
}

// Calculate angle/heading in degrees
export function calculateHeading(
  from: { x: number; y: number },
  to: { x: number; y: number }
): number {
  const rad = Math.atan2(to.y - from.y, to.x - from.x);
  const deg = (rad * 180) / Math.PI;
  return (deg + 90 + 360) % 360;
}

// Initial Seed for Trip History
export const DEFAULT_TRIP_HISTORY: TripHistoryItem[] = [
  {
    id: 'POL-8291',
    date: 'Yesterday',
    time: '06:15 PM',
    pickup: CITY_LOCATIONS[0], // New Bus Stand
    dropoff: CITY_LOCATIONS[2], // Mahalingapuram Roundabout
    vehicleType: 'auto',
    vehicleName: 'Pollachi Auto Rickshaw',
    driverName: 'Johskhan (ஜோஸ்கான்)',
    driverPhone: '9080040503',
    vehiclePlate: 'TN 41 AX 3624',
    fareAmount: 68,
    paymentMethod: 'upi',
    distanceKm: 2.4,
    durationMinutes: 7,
    rating: 5,
  },
  {
    id: 'POL-7840',
    date: '12 Oct 2026',
    time: '11:40 AM',
    pickup: CITY_LOCATIONS[5], // Palakkad Rd - NGM College
    dropoff: CITY_LOCATIONS[1], // Gandhi Statue & Bazaar
    vehicleType: 'e_rickshaw',
    vehicleName: 'E-Rickshaw Eco',
    driverName: 'Murugan (முருகன்)',
    driverPhone: '9080040503',
    vehiclePlate: 'TN 41 ER 1092',
    fareAmount: 48,
    paymentMethod: 'cash',
    distanceKm: 1.8,
    durationMinutes: 6,
    rating: 5,
  },
  {
    id: 'POL-6512',
    date: '10 Oct 2026',
    time: '08:20 PM',
    pickup: CITY_LOCATIONS[4], // Coimbatore Road - Achipatti
    dropoff: CITY_LOCATIONS[3], // Railway Station
    vehicleType: 'mini_cab',
    vehicleName: 'Mini Cab AC',
    driverName: 'Senthil Kumar (செந்தில்)',
    driverPhone: '9080040503',
    vehiclePlate: 'TN 41 Y 8820',
    fareAmount: 185,
    paymentMethod: 'wallet',
    distanceKm: 5.6,
    durationMinutes: 14,
    rating: 5,
  },
];
