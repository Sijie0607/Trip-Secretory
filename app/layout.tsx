/* ============================================================
 * layout.tsx — 全局 Layout
 * 含 Navbar + Footer；/prototype/* 全屏嵌入独立原型（无站点顶栏）
 * ============================================================ */
import AppChrome from "@/components/layout/AppChrome";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <title>Trip Open 旅行盲盒 - 旅行不用选，开个盲盒就出发</title>
        <meta
          name="description"
          content="AI驱动的旅行盲盒平台，输入预算和偏好，随机生成目的地和行程"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
