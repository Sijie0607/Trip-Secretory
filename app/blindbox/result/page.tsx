'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Share2,
  RefreshCw,
  ExternalLink,
  Lock,
  MapPin,
  Clock,
  Wallet,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Gift,
} from 'lucide-react';
import { sampleBlindBoxResult } from '@/lib/mock-data';

export default function BlindBoxResultPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [expandedDay, setExpandedDay] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const result = sampleBlindBoxResult;
  const destination = result.destination;
  const isLoggedIn = false;
  const matchPct = result.matchScore;
  const gaugeR = 45;
  const gaugeCirc = 2 * Math.PI * gaugeR;
  const gaugeDash = `${(matchPct / 100) * gaugeCirc} ${gaugeCirc}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Z01: Reveal Animation Area */}
      <section className="relative w-full overflow-hidden">
        {/* Hero Background with Gradient */}
        <div className="relative h-96 w-full bg-gradient-to-br from-blue-500 via-blue-400 to-orange-400 flex items-center justify-center">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-56 h-56 bg-orange-300 rounded-full blur-3xl" />
          </div>

          {/* Reveal Text Container */}
          <div className="relative z-10 text-center px-6">
            {!isRevealed ? (
              <div className="animate-pulse">
                <div className="flex items-center justify-center gap-2 text-white">
                  <Sparkles className="w-6 h-6 animate-spin" />
                  <p className="text-xl font-medium">正在开启你的盲盒...</p>
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <p className="text-white text-lg font-medium">
                  恭喜！你的盲盒目的地是——
                </p>
                <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                  {destination.name}
                </h1>
                <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{destination.region}</span>
                </div>
              </div>
            )}
          </div>

          {/* Cover Image Placeholder */}
          <div
            className="absolute inset-0 opacity-0"
            style={{
              background: destination.cover,
              animation: isRevealed ? 'fadeOut 0.6s ease-out' : 'none',
            }}
          />
        </div>

        {/* Match Score Gauge */}
        <div className="relative -mt-12 mx-auto w-fit px-8 py-6 bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                {/* Circular Progress Background */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="3"
                    strokeDasharray={isRevealed ? gaugeDash : `0 ${gaugeCirc}`}
                    strokeLinecap="round"
                    style={{
                      transition: isRevealed
                        ? 'stroke-dasharray 1.5s ease-out'
                        : 'none',
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="gaugeGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{matchPct}%</span>
                  <span className="text-xs text-slate-500">匹配度</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">
                完美匹配！
              </p>
              <p className="text-xs text-slate-500 max-w-xs">
                这个目的地与你的旅行偏好高度契合，快去探索吧！
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Z02: Itinerary Overview */}
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Duration & Stats */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {result.duration}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
            <Wallet className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              {result.estimatedCost}
            </span>
          </div>
        </div>

        {/* Destination Tags */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {destination.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Itinerary Accordion */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-orange-500" />
            完整行程
          </h2>

          {result.itinerary.map((day, index) => {
            const isDay0 = index === 0;
            const isExpanded = expandedDay === index;
            const isLocked = !isLoggedIn && !isDay0;

            return (
              <div
                key={day.day}
                className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Day Header */}
                <button
                  type="button"
                  onClick={() => !isLocked && setExpandedDay(isExpanded ? -1 : index)}
                  disabled={isLocked}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold flex items-center justify-center text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        第{index + 1}天
                      </p>
                      <p className="text-sm text-slate-500">
                        {day.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLocked && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500 font-medium">
                          登录后查看
                        </span>
                      </div>
                    )}
                    {!isLocked && (
                      isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )
                    )}
                  </div>
                </button>

                {/* Day Content - Show for Day 1, or when expanded and not locked */}
                {(isDay0 || isExpanded) && !isLocked && (
                  <div className="px-6 pb-4 space-y-3 border-t border-slate-100 bg-slate-50">
                    {day.activities.map((activity, actIndex) => (
                      <div key={`${day.day}-${actIndex}`} className="flex gap-4">
                        {/* Time Badge */}
                        <div className="flex-shrink-0">
                          <div className="w-16 px-2 py-1 bg-white rounded border border-blue-200 text-center">
                            <p className="text-xs font-medium text-blue-600">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                        {/* Activity Card */}
                        <div className="flex-grow rounded-lg bg-white p-3 border border-slate-200">
                          <p className="font-medium text-slate-900 text-sm">
                            {activity.name}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {activity.desc}
                          </p>
                          {'highlight' in activity && activity.highlight ? (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-orange-50 rounded text-xs font-medium text-orange-600 border border-orange-200">
                              <Sparkles className="w-3 h-3" />
                              {activity.highlight}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Locked State Message */}
                {isLocked && !isExpanded && (
                  <div className="px-6 py-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 flex items-center justify-center gap-2 text-slate-600">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">登录后查看完整行程</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Z03: Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-4 gap-2">
          {/* Save Button */}
          <button
            onClick={() => {
              if (!isLoggedIn) {
                // Would open login modal
                alert('请登录后保存');
              } else {
                setIsSaved(!isSaved);
              }
            }}
            className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg hover:bg-slate-100 transition-colors group"
            title={isLoggedIn ? (isSaved ? '取消保存' : '收藏盲盒') : '登录后收藏'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isSaved
                  ? 'fill-red-500 text-red-500'
                  : 'text-slate-600 group-hover:text-red-500'
              }`}
            />
            <span className="text-xs font-medium text-slate-700">收藏</span>
            {!isLoggedIn && <Lock className="w-3 h-3 text-slate-400 absolute -top-1 -right-1" />}
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${destination.name} - 盲盒`,
                  text: `我开出了 ${destination.name}！匹配度 ${matchPct}%，快来看看吧！`,
                  url: window.location.href,
                });
              } else {
                alert('分享链接已复制');
              }
            }}
            className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg hover:bg-slate-100 transition-colors group"
            title="分享盲盒"
          >
            <Share2 className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-medium text-slate-700">分享</span>
          </button>

          {/* Open Another Button */}
          <Link
            href="/blindbox"
            className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg hover:bg-slate-100 transition-colors group"
            title="再开一个"
          >
            <RefreshCw className="w-5 h-5 text-slate-600 group-hover:text-green-500 transition-colors" />
            <span className="text-xs font-medium text-slate-700">再开一个</span>
          </Link>

          {/* Book Button */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              alert('预订功能已准备好！');
            }}
            className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg hover:bg-orange-50 transition-colors group"
            title="去预订"
          >
            <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-orange-500 transition-colors" />
            <span className="text-xs font-medium text-slate-700">预订</span>
          </a>
        </div>
      </div>

      {/* Padding for fixed footer */}
      <div className="h-24" />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-spin {
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
