import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Star,
  Phone,
  MessageSquare,
  AlertCircle,
  CreditCard,
  QrCode,
  Banknote,
  Tag,
  CheckCircle2,
  RefreshCw,
  Zap,
  Car,
  Clock,
  ArrowRight,
  History,
  Calendar,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  ActiveRide,
  ChatMessage,
  LocationPoint,
  TripHistoryItem,
  VehicleOption,
  VehicleType,
} from '../types/ride';
import { FLEET_OPTIONS, CITY_LOCATIONS } from '../data/mockCityData';
import { playSound } from '../utils/audio';
import { InAppChatModal } from './InAppChatModal';

interface RiderViewProps {
  activeRide: ActiveRide | null;
  selectedPickup: LocationPoint;
  selectedDropoff: LocationPoint;
  selectedVehicleType: VehicleType;
  tripHistory: TripHistoryItem[];
  chatMessages: ChatMessage[];
  onSelectPickup: (loc: LocationPoint) => void;
  onSelectDropoff: (loc: LocationPoint) => void;
  onSelectVehicleType: (type: VehicleType) => void;
  onRequestRide: (paymentMethod: 'cash' | 'upi' | 'wallet', promoCode: string) => void;
  onCancelRide: () => void;
  onRateTrip: (stars: number, feedback: string) => void;
  onResetToNewBooking: () => void;
  onRebookTrip?: (pickup: LocationPoint, dropoff: LocationPoint, vehicleType: VehicleType) => void;
  onSendChatMessage: (sender: 'rider' | 'driver', text: string) => void;
}

export const RiderView: React.FC<RiderViewProps> = ({
  activeRide,
  selectedPickup,
  selectedDropoff,
  selectedVehicleType,
  tripHistory,
  chatMessages,
  onSelectPickup,
  onSelectDropoff,
  onSelectVehicleType,
  onRequestRide,
  onCancelRide,
  onRateTrip,
  onResetToNewBooking,
  onRebookTrip,
  onSendChatMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [showChatModal, setShowChatModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'wallet'>('cash');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewNote, setReviewNote] = useState('');
  const [ratedSubmitted, setRatedSubmitted] = useState(false);
  const [showSosDialog, setShowSosDialog] = useState(false);

  // Calculate quick estimate for currently selected vehicle
  const activeFleetOption = FLEET_OPTIONS.find((f) => f.type === selectedVehicleType) || FLEET_OPTIONS[0];

  const handleApplyPromo = () => {
    playSound.click();
    if (promoCode.trim().toUpperCase() === 'AUTOFIRST') {
      setAppliedPromo('AUTOFIRST (-₹25)');
    } else if (promoCode.trim().toUpperCase() === 'ECOAUTO') {
      setAppliedPromo('ECOAUTO (-₹20)');
    } else {
      alert('Invalid code! Try "AUTOFIRST" for ₹25 off.');
    }
  };

  const handleBookNow = () => {
    playSound.click();
    onRequestRide(paymentMethod, appliedPromo ? 'DISCOUNT' : '');
  };

  const handleRatingSubmit = () => {
    playSound.click();
    setRatedSubmitted(true);
    onRateTrip(rating, reviewNote);
  };

  const handleRebook = (item: TripHistoryItem) => {
    playSound.click();
    if (onRebookTrip) {
      onRebookTrip(item.pickup, item.dropoff, item.vehicleType);
    } else {
      onSelectPickup(item.pickup);
      onSelectDropoff(item.dropoff);
      onSelectVehicleType(item.vehicleType);
    }
    setActiveTab('book');
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 border-r border-slate-200">
      {/* Rider Header Bar */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
            🛺
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
              Pollachi AutoPulse
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              பொள்ளாச்சி உள்ளூர் ஆட்டோ & மினி கேப்
            </p>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-md px-2.5 py-1">
          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-medium text-slate-500">Wallet:</span>
          <span className="font-tabular font-bold text-slate-900">₹350</span>
        </div>
      </div>

      {/* Primary Tab Navigation: Book Ride vs Trip History */}
      <div className="px-4 pt-2.5 pb-1 border-b border-slate-200 bg-white flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            playSound.click();
            setActiveTab('book');
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'book'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <span>🛺 Book Ride</span>
          {activeRide && activeRide.status !== 'IDLE' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => {
            playSound.click();
            setActiveTab('history');
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5 text-amber-500" />
          <span>Trip History</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 font-tabular font-extrabold">
            {tripHistory.length}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* TAB 1: TRIP HISTORY VIEW                                       */}
        {/* ============================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Recent Rides in Pollachi
                </h3>
                <p className="text-[11px] text-slate-500">
                  Past trip records, digital fare receipts & rebooking
                </p>
              </div>
              <span className="text-[11px] font-tabular font-semibold text-slate-500">
                {tripHistory.length} Total Trips
              </span>
            </div>

            {tripHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <History className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs font-medium">No past trips recorded yet.</p>
                <button
                  onClick={() => setActiveTab('book')}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg mt-2"
                >
                  Book Your First Ride
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tripHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
                  >
                    {/* Header: Date, Time & Vehicle */}
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{item.date}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-tabular text-slate-500 text-[11px]">{item.time}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {item.vehicleType === 'auto' && '🛺 Auto'}
                          {item.vehicleType === 'e_rickshaw' && '⚡ E-Rickshaw'}
                          {item.vehicleType === 'mini_cab' && '🚗 Mini Cab'}
                        </span>
                        <span className="text-emerald-700 font-extrabold text-sm font-tabular">
                          ₹{item.fareAmount}
                        </span>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 block truncate">
                            {item.pickup.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {item.pickup.landmark}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0"></span>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 block truncate">
                            {item.dropoff.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {item.dropoff.landmark}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Driver, Payment and Rebook Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <div>
                        <span className="font-medium text-slate-800">{item.driverName}</span>
                        <span className="text-slate-400 ml-1 font-mono">({item.vehiclePlate})</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                          <span>{item.distanceKm} km</span>
                          <span>·</span>
                          <span>{item.durationMinutes} min</span>
                          <span>·</span>
                          <span className="uppercase font-semibold text-slate-700">
                            {item.paymentMethod}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRebook(item)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Rebook Route</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ACTIVE BOOKING INTERFACE                                */}
        {/* ============================================================== */}
        {activeTab === 'book' && (
          <>
            {/* Johskhan 24/7 Dispatch Section with subtle attention pulse */}
            <div className="relative p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300/90 shadow-sm flex items-center justify-between gap-3 animate-subtle-pulse transition-all hover:shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-4 h-4 animate-bounce" style={{ animationDuration: '2s' }} />
                  {/* Corner Live Beacon */}
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-emerald-950 truncate">
                      Johskhan 24/7 Dispatch: 90800 40503
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    Instant phone booking & auto-rickshaw helpline
                  </p>
                </div>
              </div>

              <a
                href="tel:9080040503"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer shadow-emerald-600/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>

            {/* ============================================================== */}
            {/* CASE 1: IDLE / BOOKING FORM                                    */}
            {/* ============================================================== */}
            {(!activeRide || activeRide.status === 'IDLE') && (
              <div className="space-y-4">
                {/* Location Selector Card */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  {/* Pickup selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Pickup Point (Pollachi)
                    </label>
                    <select
                      value={selectedPickup.id}
                      onChange={(e) => {
                        const found = CITY_LOCATIONS.find((l) => l.id === e.target.value);
                        if (found) onSelectPickup(found);
                      }}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {CITY_LOCATIONS.map((loc) => (
                        <option key={`pickup_${loc.id}`} value={loc.id}>
                          {loc.name} · {loc.landmark}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Drop-off selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Drop-off Destination (Pollachi)
                    </label>
                    <select
                      value={selectedDropoff.id}
                      onChange={(e) => {
                        const found = CITY_LOCATIONS.find((l) => l.id === e.target.value);
                        if (found) onSelectDropoff(found);
                      }}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {CITY_LOCATIONS.map((loc) => (
                        <option key={`drop_${loc.id}`} value={loc.id}>
                          {loc.name} · {loc.landmark}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vehicle Fleet Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 tracking-tight">
                      Available Fleet (3 Categories)
                    </span>
                    <span className="text-[11px] text-slate-500">Upfront Fare Guarantee</span>
                  </div>

                  <div className="space-y-2">
                    {FLEET_OPTIONS.map((fleet: VehicleOption) => {
                      const isSelected = selectedVehicleType === fleet.type;
                      return (
                        <div
                          key={fleet.type}
                          onClick={() => {
                            playSound.click();
                            onSelectVehicleType(fleet.type);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0 ${
                                fleet.type === 'auto'
                                  ? 'bg-amber-100 text-amber-800'
                                  : fleet.type === 'e_rickshaw'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {fleet.type === 'auto' && '🛺'}
                              {fleet.type === 'e_rickshaw' && '⚡'}
                              {fleet.type === 'mini_cab' && '🚗'}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">
                                  {fleet.title}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  · {fleet.capacity} seats
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                {fleet.tagline}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                                <span className="font-medium text-emerald-700">
                                  {fleet.badge}
                                </span>
                                <span>·</span>
                                <span className="font-tabular">{fleet.etaMinutes} min away</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-bold font-tabular text-slate-900">
                              ₹{Math.round(fleet.baseFare + 2.8 * fleet.perKmRate)}
                            </div>
                            <div className="text-[10px] text-slate-400 font-tabular">
                              ₹{fleet.perKmRate}/km
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Payment Option
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5" />
                      Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                        paymentMethod === 'upi'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      UPI QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                        paymentMethod === 'wallet'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Wallet
                    </button>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. AUTOFIRST)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Coupon applied: {appliedPromo}</span>
                  </div>
                )}

                {/* Booking Primary CTA Button */}
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirm {activeFleetOption.title} Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* CASE 2: SEARCHING / DISPATCHING RADAR                          */}
            {/* ============================================================== */}
            {activeRide && activeRide.status === 'SEARCHING' && (
              <div className="py-8 px-4 text-center space-y-5">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full bg-amber-400/30 animate-pulse"></div>
                  <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-2xl shadow-lg relative z-10">
                    🛺
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Finding Nearest {activeFleetOption.title}...
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Connecting with available TN-41 drivers in{' '}
                    <span className="font-semibold text-slate-700">
                      {activeRide.pickup.name}
                    </span>{' '}
                    area.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-center justify-around font-tabular">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Fare</span>
                    <span className="font-bold text-slate-900">₹{activeRide.fare.total}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="font-bold text-slate-900">
                      {activeRide.fare.distanceKm} km
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Payment</span>
                    <span className="font-bold text-slate-900 uppercase">
                      {activeRide.paymentMethod}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound.click();
                    onCancelRide();
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2"
                >
                  Cancel Request
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* CASE 3: DRIVER ACCEPTED / EN ROUTE TO PICKUP                   */}
            {/* ============================================================== */}
            {activeRide &&
              (activeRide.status === 'ACCEPTED' ||
                activeRide.status === 'ARRIVED_PICKUP') && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      activeRide.status === 'ARRIVED_PICKUP'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-bold">
                        {activeRide.status === 'ARRIVED_PICKUP'
                          ? 'Driver has arrived at pickup point!'
                          : 'Driver is arriving in ~2 mins'}
                      </span>
                    </div>
                    <span className="text-xs font-tabular font-bold">
                      {activeRide.distanceRemainingKm} km away
                    </span>
                  </div>

                  {/* SECURITY OTP DISPLAY */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Start Ride OTP
                      </span>
                      <span className="text-[11px] text-amber-400">Share upon boarding</span>
                    </div>
                    <div className="text-center py-1">
                      <div className="inline-block tracking-widest text-3xl font-extrabold font-tabular text-amber-400 bg-slate-800/80 px-6 py-1.5 rounded-lg border border-slate-700">
                        {activeRide.otp}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 text-center">
                      Driver must verify this 4-digit code before starting the taxi meter.
                    </p>
                  </div>

                  {/* Driver Profile Card */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeRide.driver.avatar}
                          alt={activeRide.driver.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {activeRide.driver.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {activeRide.driver.vehicleModel}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                            <span className="font-bold text-amber-600 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {activeRide.driver.rating}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-[11px] text-slate-500">
                              {activeRide.driver.totalTrips} rides
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold bg-slate-100 border border-slate-300 rounded px-2 py-1 text-slate-900 block">
                          {activeRide.driver.vehiclePlate}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {activeRide.vehicleType.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Driver Contact Actions (Phone & In-App Chat) */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      <a
                        href={`tel:${activeRide.driver.phone}`}
                        className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        Call Driver
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          playSound.click();
                          setShowChatModal(true);
                        }}
                        className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors relative"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Chat with Driver</span>
                        {chatMessages.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1 right-1"></span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Safety SOS */}
                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <button
                      onClick={() => setShowSosDialog(true)}
                      className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Emergency SOS
                    </button>
                    <button
                      onClick={onCancelRide}
                      className="text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Cancel Ride
                    </button>
                  </div>
                </div>
              )}

            {/* ============================================================== */}
            {/* CASE 4: IN_TRANSIT (TRIP ONGOING)                              */}
            {/* ============================================================== */}
            {activeRide && activeRide.status === 'IN_TRANSIT' && (
              <div className="space-y-4">
                {/* Live Navigation Status Card */}
                <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Trip In Progress
                    </span>
                    <span className="text-xs font-tabular text-slate-300">
                      ETA: <strong className="text-white">{activeRide.estimatedMinutesLeft} min</strong>
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${activeRide.progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-tabular">
                      <span className="truncate max-w-[45%]">{activeRide.pickup.name}</span>
                      <span>{activeRide.progressPercent}%</span>
                      <span className="truncate max-w-[45%] text-right">{activeRide.dropoff.name}</span>
                    </div>
                  </div>

                  {/* Speed & Remaining Distance */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center font-tabular">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Speed</span>
                      <span className="text-sm font-bold text-amber-400">
                        {activeRide.speedKmph} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Remaining</span>
                      <span className="text-sm font-bold text-white">
                        {activeRide.distanceRemainingKm} km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Meter Fare</span>
                      <span className="text-sm font-bold text-emerald-400">
                        ₹{activeRide.fare.total}
                      </span>
                    </div>
                  </div>
                </div>

                {/* In-Transit Driver Chat & Destination Card */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-start justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 text-[11px] block">Dropping off at:</span>
                        <span className="font-bold text-slate-900">{activeRide.dropoff.name}</span>
                        <p className="text-[11px] text-slate-500">{activeRide.dropoff.address}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playSound.click();
                        setShowChatModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>

                {/* Emergency SOS Button */}
                <button
                  onClick={() => setShowSosDialog(true)}
                  className="w-full py-2.5 px-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  Safety Toolkit & Live Ride Share
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* CASE 5: COMPLETED RECEIPT & FEEDBACK                           */}
            {/* ============================================================== */}
            {activeRide && activeRide.status === 'COMPLETED' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-bold text-emerald-950">
                    You have arrived at your destination!
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Hope you enjoyed your ride with {activeRide.driver.name}.
                  </p>
                </div>

                {/* Digital Receipt Breakdown */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 font-tabular">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">
                      Fare Receipt #{activeRide.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Base Flag-down Fare</span>
                      <span>₹{activeRide.fare.baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance ({activeRide.fare.distanceKm} km)</span>
                      <span>₹{activeRide.fare.distanceFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time & Waiting ({activeRide.fare.timeMinutes} min)</span>
                      <span>₹{activeRide.fare.timeFare}</span>
                    </div>
                    {activeRide.fare.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Promo Discount</span>
                        <span>-₹{activeRide.fare.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>GST & Municipal Cess (5%)</span>
                      <span>₹{activeRide.fare.taxes}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>Total Amount Paid</span>
                    <span className="text-base text-emerald-700 font-extrabold">
                      ₹{activeRide.fare.total}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 text-right">
                    Payment mode: <strong className="uppercase">{activeRide.paymentMethod}</strong>
                  </div>
                </div>

                {/* Driver Rating & Review Card */}
                {!ratedSubmitted ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 text-center">
                      Rate Driver {activeRide.driver.name}
                    </h4>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Optional compliment (e.g. Smooth driving, clean auto)"
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                    />

                    <button
                      onClick={handleRatingSubmit}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Submit Feedback
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 rounded-lg text-center text-xs font-medium text-emerald-800">
                    Thank you! Rating submitted.
                  </div>
                )}

                <button
                  onClick={() => {
                    playSound.click();
                    onResetToNewBooking();
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Book Another Ride
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* In-App Chat Modal for Rider */}
      {activeRide && (
        <InAppChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          currentUser="rider"
          counterpartName={activeRide.driver.name}
          counterpartSubtitle={`${activeRide.driver.vehicleModel} (${activeRide.driver.vehiclePlate})`}
          messages={chatMessages}
          onSendMessage={(text) => onSendChatMessage('rider', text)}
          theme="light"
        />
      )}

      {/* SOS Dialog Modal */}
      {showSosDialog && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-sm text-slate-900">Safety & Emergency SOS</h3>
            </div>
            <p className="text-xs text-slate-600">
              Immediate police dispatch hotline and live ride telemetry sharing with emergency contacts.
            </p>
            <div className="space-y-2">
              <a
                href="tel:112"
                className="w-full py-2.5 bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              >
                Call Emergency 112
              </a>
              <button
                onClick={() => {
                  alert('Ride live tracking link copied to clipboard!');
                  setShowSosDialog(false);
                }}
                className="w-full py-2.5 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Share Live GPS Link with Contacts
              </button>
              <button
                onClick={() => setShowSosDialog(false)}
                className="w-full py-2 text-slate-500 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
