import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, CheckCheck, Clock } from 'lucide-react';
import { ChatMessage } from '../types/ride';
import { playSound } from '../utils/audio';

interface InAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: 'rider' | 'driver';
  counterpartName: string;
  counterpartSubtitle?: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  theme?: 'light' | 'dark';
}

export const InAppChatModal: React.FC<InAppChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  counterpartName,
  counterpartSubtitle,
  messages,
  onSendMessage,
  theme = 'light',
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined quick-reply chips based on role
  const quickReplies =
    currentUser === 'rider'
      ? [
          'Where are you?',
          'Waiting at gate',
          'I am at the main entrance',
          'Please hurry, catching a bus',
          'Coming down in 1 min',
          'Near the auto stand',
        ]
      : [
          'On my way',
          'Arrived at pickup location',
          'Waiting at gate',
          'Stuck in bazaar traffic (2 mins)',
          'I have turned on hazard lights',
          'Please confirm your landmark',
        ];

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    playSound.click();
    onSendMessage(text);
    setInputText('');
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md h-[540px] flex flex-col rounded-2xl shadow-2xl border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between shrink-0 rounded-t-2xl ${
            isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                isDark ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">{counterpartName}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-1.5 py-0.2 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              {counterpartSubtitle && (
                <p className="text-[11px] opacity-70 leading-none mt-0.5">
                  {counterpartSubtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread List */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-3 ${
            isDark ? 'bg-slate-950/40' : 'bg-slate-50/40'
          }`}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs font-semibold">No messages yet</p>
              <p className="text-[11px] mt-1">
                Tap a quick reply below or type a message to coordinate your ride.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === currentUser;
              const timeString = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] opacity-50 px-1 mb-0.5 font-medium">
                    {isMe ? 'You' : msg.senderName}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs font-medium shadow-xs ${
                      isMe
                        ? isDark
                          ? 'bg-amber-500 text-slate-950 rounded-br-xs font-semibold'
                          : 'bg-emerald-600 text-white rounded-br-xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isMe
                          ? isDark
                            ? 'text-slate-900/70'
                            : 'text-white/80'
                          : 'opacity-50'
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>{timeString}</span>
                      {isMe && <CheckCheck className="w-3 h-3 ml-0.5" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Carousel */}
        <div
          className={`px-3 py-2 border-t shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
          }`}
        >
          <span className="text-[10px] font-semibold opacity-60 uppercase tracking-wider block mb-1.5 px-1">
            Quick Replies:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(reply)}
                className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-all border shrink-0 font-medium ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/90 text-slate-200 hover:border-amber-400 hover:text-amber-400'
                    : 'border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300'
                }`}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className={`p-3 border-t flex items-center gap-2 shrink-0 rounded-b-2xl ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/60'
          }`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${counterpartName}...`}
            className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
