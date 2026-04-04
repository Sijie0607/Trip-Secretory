/* ============================================================
 * Navbar.tsx — 全局导航栏
 * 对应文档：所有页面 Z01 顶部导航栏
 * ============================================================ */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane,
  Gift,
  Flame,
  User,
  Menu,
  X,
  LogIn,
} from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
  isLoggedIn?: boolean;
}

export default function Navbar({ onLoginClick, isLoggedIn = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Trip <span className="text-primary-500">Open</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all"
            >
              首页
            </Link>
            <Link
              href="/blindbox"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4" />
              开盲盒
            </Link>
            <a
              href="#themes"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4" />
              热门主题
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-500" />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  我的
                </span>
              </Link>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-all shadow-sm hover:shadow"
              >
                <LogIn className="w-4 h-4" />
                <span>登录</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-fade-in">
            <Link
              href="/"
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/blindbox"
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              开盲盒
            </Link>
            <a
              href="#themes"
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              热门主题
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
