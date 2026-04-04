"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Edit,
  Heart,
  Calendar,
  Gift,
  ChevronRight,
  Package,
  ArrowRight,
} from "lucide-react";
import { mockUser, historyBlindBoxes } from "@/lib/mock-data";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(mockUser.nickname);
  const [activeTab, setActiveTab] = useState<"all" | "favorited">("all");
  const [favorites, setFavorites] = useState<Set<string>>(
    () =>
      new Set(
        historyBlindBoxes.filter((b) => b.isFavorite).map((b) => b.id)
      )
  );

  const handleToggleFavorite = (blindBoxId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(blindBoxId)) {
      newFavorites.delete(blindBoxId);
    } else {
      newFavorites.add(blindBoxId);
    }
    setFavorites(newFavorites);
  };

  const filteredBlindBoxes =
    activeTab === "all"
      ? historyBlindBoxes
      : historyBlindBoxes.filter((box) => favorites.has(box.id));

  const totalOpened = historyBlindBoxes.length;
  const totalFavorited = favorites.size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Z01: User Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                      placeholder="输入昵称"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setNickname(mockUser.nickname);
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {nickname}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>加入于 {mockUser.createdAt}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition flex items-center gap-2 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                编辑资料
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">已开盲盒</p>
                <p className="text-2xl font-bold text-gray-900">{totalOpened}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">已收藏</p>
                <p className="text-2xl font-bold text-gray-900">{totalFavorited}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Z02: History Blind Boxes */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">我的盲盒</h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 px-1 font-medium transition ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveTab("favorited")}
              className={`pb-3 px-1 font-medium transition ${
                activeTab === "favorited"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              已收藏
            </button>
          </div>

          {/* Grid of Cards */}
          {filteredBlindBoxes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBlindBoxes.map((blindBox) => {
                const isFavorited = favorites.has(blindBox.id);
                return (
                  <Link
                    key={blindBox.id}
                    href="/blindbox/result"
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-md transition cursor-pointer h-full flex flex-col justify-between">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                            {blindBox.destination}
                          </h3>
                          <div className="mt-2 inline-block">
                            <span className="text-xs font-medium px-2 py-1 bg-blue-200 text-blue-700 rounded-full">
                              {blindBox.theme}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleFavorite(blindBox.id);
                          }}
                          className="flex-shrink-0 p-2 hover:bg-white rounded-lg transition"
                        >
                          <Heart
                            className={`w-5 h-5 transition ${
                              isFavorited
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm text-gray-700 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{blindBox.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>匹配度：{blindBox.matchScore}%</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition">
                        <span>查看详情</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">还没开过盲盒，去开一个吧！</p>
              <Link
                href="/blindbox"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Package className="w-4 h-4" />
                开启盲盒之旅
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
