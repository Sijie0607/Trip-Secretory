/* ============================================================
 * AuthModal.tsx — M001 登录注册弹窗
 * 对应文档：M001 登录注册弹窗
 * ============================================================ */
"use client";

import { useState } from "react";
import { X, Phone, Lock, User, MessageSquare } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleSendCode = () => {
    if (phone.length < 11) return;
    setCodeSent(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = () => {
    // Mock: 直接登录成功
    onLogin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-modal w-full max-w-md mx-4 animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "login" ? "欢迎回来" : "加入 Trip Open"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-1 bg-gray-50 mx-6 rounded-lg p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === "login"
                ? "bg-white text-primary-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            登录
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === "register"
                ? "bg-white text-primary-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            注册
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              maxLength={11}
            />
          </div>

          {/* Verification Code */}
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleSendCode}
              disabled={countdown > 0 || phone.length < 11}
              className="px-4 py-3 bg-primary-50 text-primary-500 text-sm font-medium rounded-lg hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : "获取验证码"}
            </button>
          </div>

          {/* Password (register only) */}
          {mode === "register" && (
            <>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="设置密码（6-20位）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="设置昵称"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </>
          )}

          {/* Agreement */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500/20"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              我已阅读并同意{" "}
              <a href="#" className="text-primary-500 hover:underline">
                用户协议
              </a>{" "}
              和{" "}
              <a href="#" className="text-primary-500 hover:underline">
                隐私政策
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!agreed || !phone || !code}
            className="w-full py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow text-sm"
          >
            {mode === "login" ? "登录" : "注册"}
          </button>

          {/* Third-party login */}
          <div className="relative flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">其他登录方式</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex justify-center gap-6 pb-2">
            <button className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors group">
              <MessageSquare className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
