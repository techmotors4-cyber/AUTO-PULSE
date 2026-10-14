export type VehicleType = 'auto' | 'e_rickshaw' | 'mini_cab';

export type RideStatus =
  | 'IDLE'
  | 'SEARCHING'
  | 'ACCEPTED'
  | 'ARRIVED_PICKUP'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'CANCELLED';

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  landmark: string;
  x: number; // 0 to 1000 coordinate space
  y: number; // 0 to 1000 coordinate space
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  vehiclePlate: string;
  rating: number;
  totalTrips: number;
  joinedYear: number;
  currentX: number;
  currentY: number;
  heading: number; // degrees
  isOnline: boolean;
  todayEarnings: number;
  todayTrips: number;
}

export interface VehicleOption {
  type: VehicleType;
  title: string;
  tagline: string;
  capacity: number;
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  etaMinutes: number;
  iconType: 'auto' | 'e_rickshaw' | 'mini_cab';
  badge: string;
}

export interface FareBreakdown {
  baseFare: number;
  distanceKm: number;
  distanceFare: number;
  timeMinutes: number;
  timeFare: number;
  surgeMultiplier: number;
  discount: number;
  taxes: number;
  total: number;
}

export interface TurnInstruction {
  distanceMeters: number;
  instruction: string;
  direction: 'straight' | 'left' | 'right' | 'u-turn' | 'arrive';
}

export interface ActiveRide {
  id: string;
  status: RideStatus;
  vehicleType: VehicleType;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  driver: DriverInfo;
  rider: {
    name: string;
    phone: string;
    rating: number;
  };
  otp: string;
  fare: FareBreakdown;
  paymentMethod: 'cash' | 'upi' | 'wallet';
  // Telemetry
  driverPos: { x: number; y: number };
  heading: number;
  speedKmph: number;
  progressPercent: number; // 0 to 100
  estimatedMinutesLeft: number;
  distanceRemainingKm: number;
  currentStreet: string;
  nextTurn?: TurnInstruction;
  startedAt?: number;
  completedAt?: number;
  chatMessages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'rider' | 'driver';
  senderName: string;
  text: string;
  timestamp: number;
}

export interface TripHistoryItem {
  id: string;
  date: string;
  time: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  vehicleType: VehicleType;
  vehicleName: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  fareAmount: number;
  paymentMethod: 'cash' | 'upi' | 'wallet';
  distanceKm: number;
  durationMinutes: number;
  rating?: number;
}

export interface CompletedTripReceipt {
  rideId: string;
  date: string;
  pickupName: string;
  dropoffName: string;
  vehicleTitle: string;
  driverName: string;
  vehiclePlate: string;
  fare: FareBreakdown;
  paymentMethod: string;
  ratingGiven?: number;
  driverRatingGiven?: number;
}
