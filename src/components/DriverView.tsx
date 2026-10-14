import React, { useState, useEffect } from 'react';
import {
  Power,
  ShieldCheck,
  Star,
  Phone,
  Navigation2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { ActiveRide, ChatMessage, DriverInfo } from '../types/ride';
import { playSound } from '../utils/audio';
import { InAppChatModal } from './InAppChatModal';

interface DriverViewProps {
  driver: DriverInfo;
  activeRide: ActiveRide | null;
  chatMessages: ChatMessage[];
  onToggleOnline: () => void;
  onAcceptRide: () => void;
  onDeclineRide: () => void;
  onArrivedPickup: () => void;
  onVerifyOtpAndStart: (enteredOtp: string) => boolean;
  onCompleteTrip: () => void;
  onSettlePayment: () => void;
  onSendChatMessage: (sender: 'rider' | 'driver', text: string) => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  driver,
  activeRide,
  chatMessages,
  onToggleOnline,
  onAcceptRide,
  onDeclineRide,
  onArrivedPickup,
  onVerifyOtpAndStart,
  onCompleteTrip,
  onSettlePayment,
  onSendChatMessage,
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [showChatModal, setShowChatModal] = useState(false);

  // Incoming ride alert countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (activeRide && activeRide.status === 'SEARCHING' && driver.isOnline) {
      setCountdown(15);
      playSound.dispatchPing();
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onDeclineRide();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeRide?.status, driver.isOnline]);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;
    const success = onVerifyOtpAndStart(otpInput.trim());
    if (!success) {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 2000);
    } else {
      setOtpInput('');
      setOtpError(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Driver Top Header Bar */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-500"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                driver.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
              }`}
            ></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight leading-none">
                {driver.name}
              </h2>
              <span className="text-[10px] font-mono bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-amber-400 font-bold">
                {driver.vehiclePlate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {driver.rating}
              </span>
              <span>·</span>
              <span>{driver.vehicleModel}</span>
            </div>
          </div>
        </div>

        {/* Online / Offline Duty Switch */}
        <button
          onClick={() => {
            playSound.click();
            onToggleOnline();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            driver.isOnline
              ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{driver.isOnline ? 'Online' : 'Offline'}</span>
        </button>
      </div>

      {/* Driver Shift KPI Strip */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-slate-950/50 border-b border-slate-800 font-tabular text-center">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Today's Net
          </span>
          <span className="text-sm font-extrabold text-emerald-400">
            ₹{driver.todayEarnings}
          </span>
        </div>
        <div className="border-x border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Trips Done
          </span>
          <span className="text-sm font-extrabold text-white">
            {driver.todayTrips}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Acceptance
          </span>
          <span className="text-sm font-extrabold text-amber-400">98%</span>
        </div>
      </div>

      {/* Pollachi Dispatcher Hotline */}
      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] font-medium text-slate-400">Pollachi Control:</span>
          <span className="font-bold text-amber-400">Johskhan</span>
        </div>
        <a
          href="tel:9080040503"
          className="text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-2 py-0.5"
        >
          <Phone className="w-3 h-3 text-emerald-400" />
          <span>90800 40503</span>
        </a>
      </div>

      {/* Driver Viewport Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* CASE 1: OFFLINE STATE                                          */}
        {/* ============================================================== */}
        {!driver.isOnline && (
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-2xl mx-auto border border-slate-700">
              🛑
            </div>
            <h3 className="text-base font-bold text-white">You are Currently Offline</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Switch duty status to Online to start receiving immediate auto and cab booking requests in your radius.
            </p>
            <button
              onClick={() => {
                playSound.click();
                onToggleOnline();
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Go Online & Start Shift
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 2: ONLINE & IDLE (WAITING FOR BOOKING)                    */}
        {/* ============================================================== */}
        {driver.isOnline && (!activeRide || activeRide.status === 'IDLE') && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-emerald-900/60 bg-emerald-950/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-emerald-300">
                  Online & Ready for Bookings
                </span>
              </div>
              <span className="text-[11px] text-emerald-400/80 font-mono">GPS Active</span>
            </div>

            {/* High Demand Auto Stands */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>High-Demand Surge Sectors (1.2x - 1.4x)</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-semibold text-white block">Pollachi Central Bus Stand</span>
                    <span className="text-[11px] text-slate-400">0.3 km · Heavy town rush</span>
                  </div>
                  <span className="font-mono text-emerald-400 text-xs font-bold">+₹20 Surge</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-semibold text-white block">Gandhi Statue & Bazaar</span>
                    <span className="text-[11px] text-slate-400">0.8 km · Evening market shoppers</span>
                  </div>
                  <span className="font-mono text-emerald-400 text-xs font-bold">+₹15 Surge</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 3: INCOMING DISPATCH ALERT MODAL                          */}
        {/* ============================================================== */}
        {driver.isOnline && activeRide && activeRide.status === 'SEARCHING' && (
          <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 shadow-2xl space-y-4 border-2 border-amber-400 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-md">
                  New Ride Request
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-950 text-amber-400 font-extrabold text-xs flex items-center justify-center font-mono">
                {countdown}s
              </div>
            </div>

            <div className="bg-slate-950 text-white rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Passenger</span>
                  <div className="text-xs font-bold">{activeRide.rider.name}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Trip Fare</span>
                  <div className="text-base font-extrabold text-emerald-400 font-tabular">
                    ₹{activeRide.fare.total}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1"></span>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pickup (0.6 km)</span>
                    <span className="font-semibold text-slate-200">{activeRide.pickup.name}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-1"></span>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Drop-off</span>
                    <span className="font-semibold text-slate-200">{activeRide.dropoff.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  onDeclineRide();
                }}
                className="py-3 px-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Decline (Pass)
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  onAcceptRide();
                }}
                className="py-3 px-3 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-extrabold rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                Accept Booking
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 4: EN ROUTE TO PICKUP                                     */}
        {/* ============================================================== */}
        {activeRide && activeRide.status === 'ACCEPTED' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Navigation2 className="w-4 h-4" />
                  Proceeding to Pickup Spot
                </span>
                <span className="font-mono text-slate-400">~2 mins</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Passenger Pickup</span>
                <h4 className="text-xs font-bold text-white">{activeRide.pickup.name}</h4>
                <p className="text-[11px] text-slate-400">{activeRide.pickup.address}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-amber-400">
                    👤
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {activeRide.rider.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Payment: {activeRide.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSound.click();
                      setShowChatModal(true);
                    }}
                    className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-1.5 relative"
                    title="Chat with Passenger"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-semibold">Chat</span>
                    {chatMessages.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-blue-400 absolute -top-0.5 -right-0.5"></span>
                    )}
                  </button>
                  <a
                    href={`tel:${activeRide.rider.phone}`}
                    className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    title="Call Passenger"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Action button: Driver has arrived at pickup */}
            <button
              onClick={() => {
                playSound.click();
                onArrivedPickup();
              }}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              I Have Arrived at Pickup Spot
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 5: ARRIVED AT PICKUP & OTP VERIFICATION GATE              */}
        {/* ============================================================== */}
        {activeRide && activeRide.status === 'ARRIVED_PICKUP' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/80 space-y-4">
            <div className="text-center space-y-1">
              <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">
                Verify Passenger Ride OTP
              </h3>
              <p className="text-xs text-slate-400">
                Ask passenger <strong className="text-white">{activeRide.rider.name}</strong> for the 4-digit code shown on their app.
              </p>
            </div>

            {/* Quick in-app chat button at gate */}
            <button
              type="button"
              onClick={() => {
                playSound.click();
                setShowChatModal(true);
              }}
              className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Chat with Passenger (e.g. "Waiting at gate")</span>
              {chatMessages.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              )}
            </button>

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="• • • •"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  className={`w-44 text-center tracking-widest text-2xl font-mono font-bold bg-slate-900 border rounded-xl py-2 text-amber-400 focus:outline-none ${
                    otpError
                      ? 'border-rose-500 animate-shake ring-2 ring-rose-500'
                      : 'border-slate-700 focus:ring-2 focus:ring-amber-500'
                  }`}
                />
              </div>

              {otpError && (
                <div className="text-rose-400 text-xs text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Invalid OTP. Please check with rider.</span>
                </div>
              )}

              {/* Quick auto-fill button for quick testing */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOtpInput(activeRide.otp)}
                  className="text-[11px] text-slate-400 hover:text-amber-400 underline underline-offset-2"
                >
                  (Testing: Auto-fill OTP {activeRide.otp})
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify OTP & Start Taxi Meter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 6: IN TRANSIT - LIVE DIGITAL TAXI METER                   */}
        {/* ============================================================== */}
        {activeRide && activeRide.status === 'IN_TRANSIT' && (
          <div className="space-y-4">
            {/* Skeuomorphic Digital Auto Meter Unit */}
            <div className="p-4 rounded-xl bg-slate-950 border-2 border-slate-700 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    DIGITAL AUTO METER
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>METER RUNNING</span>
                </div>
              </div>

              {/* Digital LED Fare Display */}
              <div className="bg-black/90 rounded-lg p-3.5 border border-slate-800 text-center font-tabular space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                  Current Fare
                </span>
                <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                  ₹{activeRide.fare.total}
                </div>
              </div>

              {/* Trip Odometer & Speed */}
              <div className="grid grid-cols-3 gap-2 text-center font-tabular pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase">Speed</span>
                  <span className="text-xs font-bold text-white">
                    {activeRide.speedKmph} km/h
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase">Left</span>
                  <span className="text-xs font-bold text-white">
                    {activeRide.distanceRemainingKm} km
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase">Est. Time</span>
                  <span className="text-xs font-bold text-amber-400">
                    {activeRide.estimatedMinutesLeft} min
                  </span>
                </div>
              </div>
            </div>

            {/* Turn instruction & Chat */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Navigation2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Next Instruction</span>
                  <span className="text-xs font-semibold text-white">
                    Continue on {activeRide.currentStreet} towards {activeRide.dropoff.name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setShowChatModal(true);
                }}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-1 shrink-0"
                title="Chat with Passenger"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-[11px] font-semibold hidden sm:inline">Chat</span>
              </button>
            </div>

            {/* End Trip Action */}
            <button
              onClick={() => {
                playSound.tripCompleted();
                onCompleteTrip();
              }}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Trip & Collect Fare
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 7: TRIP COMPLETED & FARE COLLECTION                      */}
        {/* ============================================================== */}
        {activeRide && activeRide.status === 'COMPLETED' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/80 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
              💰
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Trip Finished</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Collect fare from passenger {activeRide.rider.name}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-tabular space-y-2">
              <span className="text-[11px] text-slate-400 block">Total Fare to Collect:</span>
              <div className="text-3xl font-extrabold text-emerald-400">
                ₹{activeRide.fare.total}
              </div>
              <span className="text-xs font-medium text-amber-400 uppercase block">
                Mode: {activeRide.paymentMethod}
              </span>
            </div>

            <button
              onClick={() => {
                playSound.click();
                onSettlePayment();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
            >
              Confirm Payment Received & Return to Duty
            </button>
          </div>
        )}
      </div>

      {/* In-App Chat Modal for Driver */}
      {activeRide && (
        <InAppChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          currentUser="driver"
          counterpartName={activeRide.rider.name}
          counterpartSubtitle={`Passenger · Pickup: ${activeRide.pickup.name}`}
          messages={chatMessages}
          onSendMessage={(text) => onSendChatMessage('driver', text)}
          theme="dark"
        />
      )}
    </div>
  );
};
