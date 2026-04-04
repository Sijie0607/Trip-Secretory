'use client';

import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, Flame, Lock, ArrowLeft, Gift, ChevronRight } from 'lucide-react';
import { themes, featuredBlindBoxes } from '@/lib/mock-data';

export default function ThemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params.id as string;

  // Find the theme
  const theme = themes.find((t) => t.id === themeId);

  if (!theme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">主题不存在</h1>
          <p className="text-gray-600 mb-8">抱歉，我们找不到这个主题。</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            <ArrowLeft size={20} />
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // Filter featured blind boxes by theme
  const relatedBlindBoxes = featuredBlindBoxes.filter(
    (box) => box.theme === theme.name
  );
  const blindBoxesToShow = relatedBlindBoxes.length > 0 ? relatedBlindBoxes : featuredBlindBoxes;

  // Generate destination cards data with mock stats
  const destinationCards = theme.destinations.map((dest, index) => ({
    name: dest,
    rating: 4.5 + (index % 3) * 0.2,
    heat: 85 + (index % 5) * 5,
  }));

  const handleOpenBlindBox = () => {
    router.push('/blindbox');
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">返回</span>
          </button>
        </div>
      </div>

      {/* Z01 Theme Banner */}
      <section
        className="relative w-full h-64 md:h-80 lg:h-96 flex items-center justify-center text-white overflow-hidden"
        style={{ background: theme.cover }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative text-center px-4">
          <div className="text-6xl md:text-7xl mb-4">{theme.emoji}</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            {theme.name}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl drop-shadow">
            {theme.description}
          </p>
          <button
            onClick={handleOpenBlindBox}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-blue-50 transition font-semibold shadow-lg hover:shadow-xl"
          >
            <Gift size={20} />
            以此主题开盲盒
          </button>
        </div>
      </section>

      {/* Z02 Hot Destinations Grid */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">热门目的地</h2>
          <p className="text-gray-600 mb-8">来看看这个主题下的热门目的地吧</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationCards.map((card, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-default"
              >
                {/* Card Background Gradient */}
                <div
                  className="h-40 relative flex items-end p-4"
                  style={{ background: theme.cover }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <div className="relative w-full">
                    {/* Heat Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <Flame size={16} />
                      {card.heat}
                    </div>

                    {/* Destination Name */}
                    <h3 className="text-2xl font-bold text-white drop-shadow">{card.name}</h3>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-white">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(card.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{card.rating.toFixed(1)}</span>
                  </div>

                  {/* Brief Description */}
                  <p className="text-sm text-gray-600">
                    热门主题目的地，适合{theme.name}的旅行体验
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Z03 Theme Blind Box Showcase */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">该主题精选盲盒</h2>
          <p className="text-gray-600 mb-8">
            看看其他旅行者在这个主题下的盲盒开启体验
          </p>

          {/* Horizontal Scroll Cards */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-6 min-w-min">
              {blindBoxesToShow.map((box) => (
                <button
                  key={box.id}
                  onClick={() => router.push('/blindbox/result')}
                  className="group flex-shrink-0 w-72 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer text-left"
                >
                  {/* Card Content */}
                  <div
                    className="h-40 relative p-4 flex items-end"
                    style={{ background: box.cover }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    <div className="relative w-full">
                      {/* Lock Icon Badge */}
                      <div className="absolute top-4 right-4 bg-gray-900/70 backdrop-blur-sm text-white px-3 py-2 rounded-full flex items-center gap-2">
                        <Lock size={16} />
                        <span className="text-sm font-semibold">盲盒</span>
                      </div>

                      {/* Destination Name */}
                      <h3 className="text-2xl font-bold text-white drop-shadow">
                        {box.destination}
                      </h3>

                      {/* Match Score */}
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < Math.floor(box.matchScore / 20)
                                  ? 'fill-yellow-300 text-yellow-300'
                                  : 'text-white/30'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-white ml-1">
                          {box.matchScore}分
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-white">
                    {/* User Review */}
                    <p className="text-sm text-gray-700 font-medium mb-2 line-clamp-2">
                      "{box.review}"
                    </p>

                    {/* User Name */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">— {box.userName}</p>
                      <ChevronRight
                        size={16}
                        className="text-blue-500 group-hover:translate-x-1 transition"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleOpenBlindBox}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              <Gift size={20} />
              开启此主题盲盒
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 text-white text-center"
            style={{ background: theme.cover }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow">
              准备好了吗？
            </h2>
            <p className="text-lg text-white/90 mb-8 drop-shadow max-w-2xl mx-auto">
              点击下方按钮，用{theme.name}主题为自己开启一场惊喜之旅
            </p>
            <button
              onClick={handleOpenBlindBox}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 rounded-lg hover:bg-blue-50 transition font-bold text-lg shadow-lg hover:shadow-xl"
            >
              <Gift size={24} />
              开启{theme.name}盲盒
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
