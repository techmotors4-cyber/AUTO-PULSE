import React from 'react';
import {
  Volume2,
  VolumeX,
  Gauge,
  RotateCcw,
  LayoutGrid,
  Smartphone,
  Truck,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import { POLLACHI_OPERATOR } from '../data/mockCityData';

export type AppViewMode = 'split' | 'rider_only' | 'driver_only' | 'fleet_stats';

interface SplitConsoleHeaderProps {
  viewMode: AppViewMode;
  onChangeViewMode: (mode: AppViewMode) => void;
  simSpeed: number;
  onChangeSimSpeed: (speed: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onLoadScenario: (scenario: 'busstand_mahalingam' | 'bazaar_station' | 'cbe_udumalpet') => void;
  onResetAll: () => void;
}

export const SplitConsoleHeader: React.FC<SplitConsoleHeaderProps> = ({
  viewMode,
  onChangeViewMode,
  simSpeed,
  onChangeSimSpeed,
  isMuted,
  onToggleMute,
  onLoadScenario,
  onResetAll,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 select-none">
      {/* Top Bar (3 Zones) */}
      <div className="flex items-center justify-between gap-3 px-3 lg:px-6 py-2.5">
        {/* Zone 1: Pollachi AutoPulse Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xl">🛺</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                Pollachi AutoPulse
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.2">
                TN-41
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              பொள்ளாச்சி ஆட்டோ & மினி கேப்
            </p>
          </div>
        </div>

        {/* Zone 2: Viewport Mode Switcher Buttons */}
        <nav className="hidden sm:flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => onChangeViewMode('split')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Split Console</span>
            <span className="md:hidden">Split</span>
          </button>
          <button
            onClick={() => onChangeViewMode('rider_only')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              viewMode === 'rider_only'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            <span>Rider View</span>
          </button>
          <button
            onClick={() => onChangeViewMode('driver_only')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              viewMode === 'driver_only'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Driver View</span>
          </button>
        </nav>

        {/* Zone 3: Johskhan 90800 40503 Pollachi 24/7 Hotline */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${POLLACHI_OPERATOR.phone}`}
            title={`Call Johskhan Pollachi (${POLLACHI_OPERATOR.displayPhone})`}
            className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
            <div className="text-left leading-tight">
              <span className="text-[10px] block opacity-90 font-normal">
                {POLLACHI_OPERATOR.name} · {POLLACHI_OPERATOR.city}
              </span>
              <span className="font-tabular font-extrabold tracking-wide">
                {POLLACHI_OPERATOR.displayPhone}
              </span>
            </div>
          </a>

          <a
            href={`https://wa.me/91${POLLACHI_OPERATOR.phone}?text=Hello%20Johskhan,%20I%20need%20an%20auto%20ride%20in%20Pollachi`}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp Booking"
            className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Secondary Quick Toolbar: Pollachi Routes, Simulation Speed & Controls */}
      <div className="px-3 lg:px-6 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">
            Pollachi Routes:
          </span>
          <button
            onClick={() => onLoadScenario('busstand_mahalingam')}
            className="hover:text-slate-900 font-medium whitespace-nowrap cursor-pointer text-[11px]"
          >
            New Bus Stand ➔ Mahalingapuram
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={() => onLoadScenario('bazaar_station')}
            className="hover:text-slate-900 font-medium whitespace-nowrap cursor-pointer text-[11px]"
          >
            Gandhi Bazaar ➔ Railway Station
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={() => onLoadScenario('cbe_udumalpet')}
            className="hover:text-slate-900 font-medium whitespace-nowrap cursor-pointer text-[11px]"
          >
            Coimbatore Rd ➔ Udumalpet Rd
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile view switchers */}
          <div className="flex sm:hidden items-center bg-slate-200/80 rounded p-0.5 text-[10px]">
            <button
              onClick={() => onChangeViewMode('split')}
              className={`px-1.5 py-0.5 rounded ${viewMode === 'split' ? 'bg-white font-bold' : ''}`}
            >
              Split
            </button>
            <button
              onClick={() => onChangeViewMode('rider_only')}
              className={`px-1.5 py-0.5 rounded ${viewMode === 'rider_only' ? 'bg-white font-bold' : ''}`}
            >
              Rider
            </button>
            <button
              onClick={() => onChangeViewMode('driver_only')}
              className={`px-1.5 py-0.5 rounded ${viewMode === 'driver_only' ? 'bg-white font-bold' : ''}`}
            >
              Driver
            </button>
          </div>

          {/* Simulation Speed */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5">
            <Gauge className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-400">Sim:</span>
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSimSpeed(spd)}
                className={`px-1 rounded font-tabular font-bold text-[10px] ${
                  simSpeed === spd
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-1 hover:text-slate-900 text-slate-500"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Reset */}
          <button
            onClick={onResetAll}
            title="Reset to fresh state"
            className="hover:text-slate-900 text-slate-500 flex items-center gap-1 text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
