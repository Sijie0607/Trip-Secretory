/* ============================================================
 * Footer.tsx — 全局页脚
 * 对应文档：P001 Z06 页脚
 * ============================================================ */

import { Plane, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Trip <span className="text-primary-400">Open</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              旅行不用选，开个盲盒就出发。AI 智能推荐，让每次旅行都是惊喜体验。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">快速链接</h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                首页
              </Link>
              <Link href="/blindbox" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                开盲盒
              </Link>
              <Link href="/trip-open-v2" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                V2 插画完整原型
              </Link>
              <a href="#themes" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                热门主题
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">联系我们</h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>hello@tripopen.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span>微信: TripOpen2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2026 Trip Open. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              用户协议
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              隐私政策
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
