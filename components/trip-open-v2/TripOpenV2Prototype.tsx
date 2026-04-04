"use client";

import {
  useState,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

// ============================================================
// Trip Open V2 · 插画风旅行盲盒 · 完整交互原型
// 风格：格里格外插画 × 纪念碑谷几何简约 × 温暖色彩
// 包含：世界地图首页 / 集卡引导 / 逐层拆盒 / 安全评估 / 盲盒广场 / 个人中心
// ============================================================

/* ---------- 全局色彩系统 ---------- */
const C = {
  bg: "#FFF8F0", bgAlt: "#FEF3E7", surface: "#FFFFFF",
  text: "#2D2926", textSec: "#6B5E57", textMuted: "#A89F99",
  primary: "#E8734A", primaryLight: "#FDEEE8", primaryDark: "#C85A34",
  accent: "#5B8DEF", accentLight: "#EBF1FD",
  coral: "#E06B6B", green: "#4CAF7D", greenLight: "#E8F5EE",
  gold: "#E4A853", goldLight: "#FDF5E6",
  purple: "#8B6CC1", purpleLight: "#F0EBF8",
  teal: "#3AADA8", tealLight: "#E5F6F5",
  pink: "#E88CB2", pinkLight: "#FCF0F5",
  border: "#F0E6DB", borderLight: "#F8F0E8",
  shadow: "0 2px 12px rgba(45,41,38,0.06)",
  shadowHover: "0 8px 30px rgba(45,41,38,0.1)",
  shadowModal: "0 20px 60px rgba(45,41,38,0.15)",
  radius: "16px", radiusSm: "12px", radiusXl: "24px", radiusFull: "9999px",
};

/* ---------- 地区插画色系 ---------- */
type RegionStyle = { bg: string; accent: string; emoji: string; gradient: string };
const regionColors: Record<string, RegionStyle> = {
  "日韩": { bg: "#FDE7E7", accent: "#D94F4F", emoji: "🗾", gradient: "linear-gradient(135deg, #F5A0A0, #E06B6B)" },
  "东南亚": { bg: "#E5F6E8", accent: "#3A9D5C", emoji: "🌴", gradient: "linear-gradient(135deg, #7DD3A0, #3A9D5C)" },
  "欧洲": { bg: "#E8EDF8", accent: "#5B6DB0", emoji: "🏰", gradient: "linear-gradient(135deg, #8B9FD9, #5B6DB0)" },
  "国内": { bg: "#FDE8DB", accent: "#D47B4A", emoji: "🇨🇳", gradient: "linear-gradient(135deg, #F0A876, #D47B4A)" },
  "北美": { bg: "#E3EEF8", accent: "#4A8BC2", emoji: "🗽", gradient: "linear-gradient(135deg, #7BB5E0, #4A8BC2)" },
};

/* ---------- Mock Data ---------- */
const themes = [
  { id:"island", name:"海岛度假", emoji:"🏝️", desc:"碧海蓝天，椰风海韵", color:"#0EA5E9" },
  { id:"city", name:"城市探索", emoji:"🏙️", desc:"发现城市的隐秘角落", color:"#6366F1" },
  { id:"ancient", name:"古镇漫游", emoji:"🏯", desc:"穿越时光的文化之旅", color:"#D97706" },
  { id:"outdoor", name:"户外冒险", emoji:"⛰️", desc:"挑战自我，拥抱自然", color:"#059669" },
  { id:"food", name:"美食之旅", emoji:"🍜", desc:"跟着味蕾去旅行", color:"#DC2626" },
  { id:"art", name:"文艺打卡", emoji:"🎨", desc:"博物馆与咖啡的灵感之旅", color:"#EC4899" },
  { id:"honeymoon", name:"蜜月浪漫", emoji:"💕", desc:"和最爱的人一起旅行", color:"#F43F5E" },
  { id:"offbeat", name:"小众秘境", emoji:"🗺️", desc:"探索未被发现的宝藏", color:"#0D9488" },
];
const budgetOptions = [
  { label:"¥1,000以内", value:"0-1000", emoji:"🎒" },
  { label:"¥1,000-3,000", value:"1000-3000", emoji:"🧳" },
  { label:"¥3,000-5,000", value:"3000-5000", emoji:"💼" },
  { label:"¥5,000-10,000", value:"5000-10000", emoji:"💎" },
  { label:"¥10,000+", value:"10000+", emoji:"👑" },
];
const sceneOptions = [
  {id:"cafe",name:"咖啡馆",emoji:"☕"},{id:"museum",name:"博物馆",emoji:"🏛️"},
  {id:"beach",name:"海滩",emoji:"🏖️"},{id:"nightmarket",name:"夜市",emoji:"🌙"},
  {id:"hotspring",name:"温泉",emoji:"♨️"},{id:"hiking",name:"徒步",emoji:"🥾"},
  {id:"photography",name:"摄影",emoji:"📸"},{id:"shopping",name:"购物",emoji:"🛍️"},
  {id:"show",name:"演出",emoji:"🎭"},{id:"temple",name:"寺庙",emoji:"🛕"},
];
const regionOpts = [
  {id:"domestic",name:"国内",emoji:"🇨🇳"},{id:"sea",name:"东南亚",emoji:"🌴"},
  {id:"jpkr",name:"日韩",emoji:"🗾"},{id:"europe",name:"欧洲",emoji:"🏰"},
  {id:"na",name:"北美",emoji:"🗽"},{id:"random",name:"随机都行",emoji:"🎲"},
];
const tabooOpts = [
  {id:"hot",name:"怕热",emoji:"🥵"},{id:"cold",name:"怕冷",emoji:"🥶"},
  {id:"mtn",name:"不爬山",emoji:"⛰️"},{id:"boat",name:"不坐船",emoji:"⛵"},
  {id:"spicy",name:"不吃辣",emoji:"🌶️"},{id:"crowd",name:"人少优先",emoji:"🧘"},{id:"visa",name:"免签优先",emoji:"✈️"},
];

const sampleResult = {
  destination:{name:"京都",region:"日韩",tags:["文艺","古迹","美食","摄影"],rating:4.8},
  matchScore:92,cost:"¥4,500",duration:"4天3夜",
  itinerary:[
    {day:1,title:"古韵初探",acts:[{time:"上午",name:"伏见稻荷大社",desc:"穿越千本鸟居的朱红世界",booking:"trip.com",price:"免费"},{time:"下午",name:"清水寺",desc:"俯瞰古都全景的千年古刹",booking:"trip.com",price:"¥25"},{time:"晚上",name:"花见小路",desc:"祗园石板路上邂逅传统京都",booking:null,price:null}]},
    {day:2,title:"茶道与庭园",acts:[{time:"上午",name:"金阁寺",desc:"镜湖池中的金色倒影",booking:"trip.com",price:"¥25"},{time:"下午",name:"龙安寺枯山水",desc:"在石庭前感受禅意",booking:null,price:"¥30"},{time:"晚上",name:"锦市场",desc:"京都的厨房，地道小吃天堂",booking:null,price:null}]},
    {day:3,title:"岚山秘境",acts:[{time:"上午",name:"岚山竹林",desc:"翠竹之间聆听风的旋律",booking:null,price:"免费"},{time:"下午",name:"渡月桥",desc:"桂川河畔的经典风景线",booking:null,price:"免费"},{time:"晚上",name:"先斗町",desc:"河畔居酒屋的怀石料理之夜",booking:"tabelog",price:"¥300-500"}]},
    {day:4,title:"咖啡与告别",acts:[{time:"上午",name:"% Arabica",desc:"世界顶级咖啡馆的晨间时光",booking:null,price:"¥30-50"},{time:"下午",name:"二条城",desc:"感受德川幕府的恢宏气度",booking:"trip.com",price:"¥40"}]},
  ],
  safety:{
    overall:82,grade:"B",
    dims:{S1:{score:90,label:"治安环境"},S2:{score:68,label:"自然灾害"},S3:{score:92,label:"医疗保障"},S4:{score:80,label:"交通安全"},S5:{score:88,label:"饮食健康"},S6:{score:85,label:"文化法律"}},
    alerts:[
      {level:"caution",title:"6-9月为台风季",reason:"日本每年6-9月为台风活跃期，可能影响航班和户外活动",prevention:"关注天气预报，购买含自然灾害的旅行保险",dim:"S2"},
      {level:"info",title:"寺院参拜礼仪",reason:"进入寺院需脱鞋，部分区域禁止拍照",prevention:"穿方便穿脱的鞋子，尊重当地宗教习俗",dim:"S6"},
      {level:"info",title:"地震应急准备",reason:"日本位于地震带，有轻微地震的可能性",prevention:"了解酒店紧急出口位置，下载地震预警APP",dim:"S2"},
    ],
    checklist:["购买旅行保险（含医疗+自然灾害）","确认护照有效期≥6个月","下载Google Maps离线地图","备份护照和签证电子版","了解紧急求助电话：110(警察)/119(救护)"]
  }
};

const plazaData = [
  {id:"p1",dest:"巴厘岛",user:"小鱼儿",score:95,region:"东南亚",x:72,y:62,review:"乌布稻田美翻了"},
  {id:"p2",dest:"京都",user:"旅行者K",score:92,region:"日韩",x:82,y:38,review:"千本鸟居太震撼"},
  {id:"p3",dest:"巴黎",user:"文艺Luna",score:88,region:"欧洲",x:48,y:32,review:"卢浮宫可以待一天"},
  {id:"p4",dest:"成都",user:"吃货阿明",score:90,region:"国内",x:68,y:42,review:"火锅串串人生巅峰"},
  {id:"p5",dest:"冰岛",user:"极光猎人",score:96,region:"欧洲",x:44,y:18,review:"极光美到词穷"},
  {id:"p6",dest:"清迈",user:"慢生活",score:85,region:"东南亚",x:74,y:52,review:"寺庙和咖啡馆的天堂"},
  {id:"p7",dest:"纽约",user:"城市客",score:87,region:"北美",x:26,y:35,review:"中央公园的秋天绝了"},
  {id:"p8",dest:"大理",user:"风花雪月",score:82,region:"国内",x:66,y:46,review:"洱海边骑行太治愈"},
];

const historyBoxes = [
  {id:"h1",dest:"京都",theme:"文艺打卡",date:"2026-03-20",score:92,fav:true,cards:5},
  {id:"h2",dest:"清迈",theme:"美食之旅",date:"2026-03-10",score:85,fav:false,cards:5},
  {id:"h3",dest:"厦门",theme:"海岛度假",date:"2026-02-28",score:78,fav:true,cards:5},
];

/* ---------- SVG Icons ---------- */
const Ico = ({
  name,
  size = 20,
  color = "currentColor",
}: {
  name: string;
  size?: number;
  color?: string;
}) => {
  const s = {width:size,height:size,display:"inline-block",verticalAlign:"middle"};
  const m = {
    plane:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>,
    gift:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 010-5A4.8 4.8 0 0112 8a4.8 4.8 0 014.5-5 2.5 2.5 0 010 5"/></svg>,
    user:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    heart:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></svg>,
    heartF:<svg style={s} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></svg>,
    share:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
    refresh:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
    ext:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    shield:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    star:<svg style={s} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    map:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    check:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    left:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
    right:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
    down:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
    x:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
    lock:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    collection:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    globe:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    alert:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  };
  return (m as Record<string, ReactNode>)[name] ?? null;
};

/* ---------- 插画卡片组件 ---------- */
const cardStyles = [
  { type:"budget", label:"旅行基金卡", bgGrad:"linear-gradient(135deg,#F5D5A0,#E4A853)", icon:"🎒", borderColor:"#E4A853" },
  { type:"theme", label:"旅行风格卡", bgGrad:"linear-gradient(135deg,#D4A0E8,#8B6CC1)", icon:"🎨", borderColor:"#8B6CC1" },
  { type:"scene", label:"心愿场景卡", bgGrad:"linear-gradient(135deg,#A0D8E8,#5B8DEF)", icon:"🏖️", borderColor:"#5B8DEF" },
  { type:"region", label:"探索方向卡", bgGrad:"linear-gradient(135deg,#A0E8C4,#3AADA8)", icon:"🗺️", borderColor:"#3AADA8" },
  { type:"taboo", label:"旅行护盾卡", bgGrad:"linear-gradient(135deg,#E8A0A0,#E06B6B)", icon:"🛡️", borderColor:"#E06B6B" },
];

function IllustrationCard({
  cardIndex,
  content,
  collected,
  small,
}: {
  cardIndex: number;
  content?: string;
  collected: boolean;
  small?: boolean;
}) {
  const cs = cardStyles[cardIndex];
  const w = small ? 64 : 140;
  const h = small ? 88 : 190;
  return (
    <div style={{ width:w, height:h, borderRadius: small?10:16, background: collected ? cs.bgGrad : "#F0E6DB", border:`2.5px solid ${collected?cs.borderColor:"#D8CFC5"}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", transition:"all 0.5s cubic-bezier(0.34,1.56,0.64,1)", transform: collected ? "scale(1)" : "scale(0.9)", opacity: collected?1:0.4, boxShadow: collected ? "0 4px 16px rgba(0,0,0,0.1)" : "none" }}>
      {collected ? (
        <>
          <div style={{fontSize:small?20:36, marginBottom:small?2:8}}>{cs.icon}</div>
          <div style={{fontSize:small?8:11, fontWeight:700, color:"#fff", textShadow:"0 1px 2px rgba(0,0,0,0.2)", textAlign:"center", padding:"0 4px"}}>{cs.label}</div>
          {!small && content && <div style={{fontSize:9, color:"rgba(255,255,255,0.85)", marginTop:4, textAlign:"center", padding:"0 8px", lineHeight:1.3}}>{content}</div>}
        </>
      ) : (
        <>
          <div style={{fontSize:small?16:28, opacity:0.3}}>❓</div>
          <div style={{fontSize:small?7:10, color:"#A89F99", marginTop:4}}>{cs.label}</div>
        </>
      )}
      {collected && <div style={{position:"absolute",top:-12,right:-12,width:small?24:40,height:small?24:40,borderRadius:"50%",background:"rgba(255,255,255,0.15)"}}/>}
    </div>
  );
}

/* ---------- Auth Modal ---------- */
function AuthModal({
  open,
  onClose,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}) {
  const [phone,setPhone]=useState("");
  const [code,setCode]=useState("");
  const [agreed,setAgreed]=useState(false);
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(45,41,38,0.4)",backdropFilter:"blur(6px)"}}/>
      <div style={{position:"relative",background:C.surface,borderRadius:C.radiusXl,width:"100%",maxWidth:400,margin:"0 16px",boxShadow:C.shadowModal,animation:"slideUp .3s ease-out",overflow:"hidden"}}>
        {/* 插画装饰 */}
        <div style={{height:80,background:"linear-gradient(135deg,#FDEEE8,#FDF5E6)",display:"flex",alignItems:"center",justifyContent:"center",gap:16,fontSize:32}}>
          <span style={{animation:"float 3s ease-in-out infinite"}}>🧳</span>
          <span style={{animation:"float 3s ease-in-out infinite .5s"}}>✈️</span>
          <span style={{animation:"float 3s ease-in-out infinite 1s"}}>🌍</span>
        </div>
        <div style={{padding:"24px 28px"}}>
          <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>开启你的旅行盲盒</h2>
          <p style={{fontSize:13,color:C.textMuted,marginBottom:20}}>注册即可获得第一次免费拆盒体验</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input placeholder="手机号" value={phone} onChange={e=>setPhone(e.target.value)} style={{width:"100%",padding:"13px 16px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            <div style={{display:"flex",gap:8}}>
              <input placeholder="验证码" value={code} onChange={e=>setCode(e.target.value)} style={{flex:1,padding:"13px 16px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,fontSize:14,outline:"none"}}/>
              <button style={{padding:"13px 18px",background:C.primaryLight,color:C.primary,fontSize:13,fontWeight:600,borderRadius:C.radiusSm,border:"none",cursor:"pointer",whiteSpace:"nowrap"}}>获取验证码</button>
            </div>
            <label style={{display:"flex",alignItems:"flex-start",gap:8,cursor:"pointer"}}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3}}/>
              <span style={{fontSize:12,color:C.textMuted,lineHeight:1.5}}>我已阅读并同意 <span style={{color:C.primary}}>用户协议</span> 和 <span style={{color:C.primary}}>隐私政策</span></span>
            </label>
            <button onClick={()=>{onLogin();onClose();}} disabled={!agreed} style={{width:"100%",padding:"14px",background:C.primary,color:"#fff",fontSize:15,fontWeight:700,borderRadius:C.radiusFull,border:"none",cursor:"pointer",opacity:agreed?1:0.5,transition:"all .2s"}}>注册并开盲盒</button>
          </div>
        </div>
        <button onClick={onClose} style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.8)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico name="x" size={16} color={C.textMuted}/></button>
      </div>
    </div>
  );
}

/* ---------- Navbar ---------- */
function Navbar({
  page,
  setPage,
  isLoggedIn,
  onLoginClick,
}: {
  page: { name: string };
  setPage: (p: { name: string }) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}) {
  return (
    <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,248,240,0.95)",backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.borderLight}`,padding:"0 24px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
        <div onClick={()=>setPage({name:"home"})} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <div style={{width:34,height:34,borderRadius:10,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico name="plane" size={17} color="#fff"/></div>
          <span style={{fontSize:17,fontWeight:800,color:C.text,letterSpacing:"-0.3px"}}>Trip <span style={{color:C.primary}}>Open</span></span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:2}}>
          {[{key:"home",label:"探索",icon:"globe"},{key:"blindbox",label:"开盲盒",icon:"gift"},{key:"plaza",label:"盲盒广场",icon:"map"}].map(n=>(
            <button key={n.key} onClick={()=>setPage({name:n.key})} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",fontSize:13,fontWeight:600,color:page.name===n.key?C.primary:C.textSec,background:page.name===n.key?C.primaryLight:"transparent",borderRadius:C.radiusFull,border:"none",cursor:"pointer",transition:"all .2s"}}>
              <Ico name={n.icon} size={15} color={page.name===n.key?C.primary:C.textSec}/>{n.label}
            </button>
          ))}
        </div>
        <div>
          {isLoggedIn ? (
            <button onClick={()=>setPage({name:"profile"})} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:C.radiusFull,border:`1.5px solid ${C.border}`,background:C.surface,cursor:"pointer"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico name="user" size={14} color={C.primary}/></div>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>我的</span>
            </button>
          ) : (
            <button onClick={onLoginClick} style={{padding:"8px 20px",background:C.primary,color:"#fff",fontSize:13,fontWeight:700,borderRadius:C.radiusFull,border:"none",cursor:"pointer",boxShadow:"0 2px 8px rgba(232,115,74,0.3)"}}>注册 / 登录</button>
          )}
        </div>
      </div>
    </nav>
  );
}

/** 嵌入主站时使用：无 Logo/页脚，子导航粘在全局 Navbar（h-16）下方 */
function EmbeddedSubNav({
  page,
  setPage,
  isLoggedIn,
  onLoginClick,
}: {
  page: { name: string };
  setPage: (p: { name: string }) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}) {
  const isTabActive = (key: string) => page.name === key;
  return (
    <nav
      style={{
        position: "sticky",
        top: 64,
        zIndex: 40,
        background: "rgba(255,248,240,0.97)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${C.borderLight}`,
        padding: "0 16px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          minHeight: 48,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, flexShrink: 0 }}>
          V2 插画原型
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flex: 1, flexWrap: "wrap" }}>
          {(
            [
              { key: "home", label: "探索", icon: "globe" },
              { key: "blindbox", label: "开盲盒", icon: "gift" },
              { key: "plaza", label: "盲盒广场", icon: "map" },
            ] as const
          ).map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => setPage({ name: n.key })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 600,
                color: isTabActive(n.key) ? C.primary : C.textSec,
                background: isTabActive(n.key) ? C.primaryLight : "transparent",
                borderRadius: C.radiusFull,
                border: "none",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              <Ico name={n.icon} size={15} color={isTabActive(n.key) ? C.primary : C.textSec} />
              {n.label}
            </button>
          ))}
        </div>
        <div style={{ flexShrink: 0 }}>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => setPage({ name: "profile" })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: C.radiusFull,
                border: `1.5px solid ${C.border}`,
                background: C.surface,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: C.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico name="user" size={13} color={C.primary} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>我的</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              style={{
                padding: "7px 14px",
                background: C.primary,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                borderRadius: C.radiusFull,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(232,115,74,0.3)",
              }}
            >
              注册 / 登录
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ---------- P001 Home: 插画世界地图 ---------- */
function HomePage({
  setPage,
  isLoggedIn,
  onLoginClick,
}: {
  setPage: (p: { name: string }) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}) {
  const [hoveredPin,setHoveredPin]=useState<string | null>(null);
  return (
    <div style={{background:C.bg}}>
      {/* Hero 插画世界地图 */}
      <section style={{position:"relative",minHeight:"70vh",background:`linear-gradient(180deg, ${C.bg} 0%, #FEF0E0 50%, #E8DDD4 100%)`,overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px 60px"}}>
        {/* 装饰几何 */}
        <div style={{position:"absolute",top:40,left:"8%",width:60,height:60,borderRadius:12,background:"rgba(232,115,74,0.08)",transform:"rotate(15deg)"}}/>
        <div style={{position:"absolute",top:120,right:"10%",width:40,height:40,borderRadius:"50%",background:"rgba(91,141,239,0.08)"}}/>
        <div style={{position:"absolute",bottom:80,left:"15%",width:50,height:50,borderRadius:8,background:"rgba(58,173,168,0.06)",transform:"rotate(-10deg)"}}/>

        <h1 style={{fontSize:40,fontWeight:900,color:C.text,textAlign:"center",lineHeight:1.2,marginBottom:8,letterSpacing:"-0.5px"}}>
          旅行不用选<br/><span style={{color:C.primary}}>开个盲盒就出发</span>
        </h1>
        <p style={{fontSize:16,color:C.textSec,marginBottom:40,textAlign:"center"}}>点击地图上的盲盒，探索你的下一段旅程</p>

        {/* SVG 世界地图简化版 */}
        <div style={{position:"relative",width:"100%",maxWidth:800,aspectRatio:"2/1",background:"linear-gradient(180deg,#E8F0DF 0%,#D4DFC8 100%)",borderRadius:C.radiusXl,overflow:"hidden",border:`2px solid ${C.border}`,boxShadow:C.shadow}}>
          {/* 海洋 */}
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#C5DAE8 0%,#B0CBE0 50%,#A0BDD6 100%)"}}/>
          {/* 简化大陆 */}
          <svg viewBox="0 0 200 100" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
            {/* 简化大陆形状 */}
            <path d="M35 25 Q42 20 55 22 Q60 25 58 35 Q55 42 48 40 Q40 38 35 30Z" fill="#D4C4A8" opacity="0.6"/>
            <path d="M15 30 Q22 25 30 28 Q32 35 28 42 Q20 45 15 38Z" fill="#C8B898" opacity="0.6"/>
            <path d="M40 28 Q55 24 65 30 Q68 38 60 45 Q50 48 42 42 Q38 35 40 28Z" fill="#D4C4A8" opacity="0.6"/>
            <path d="M55 45 Q62 40 70 42 Q72 50 65 55 Q58 52 55 45Z" fill="#D0BC9E" opacity="0.5"/>
            <path d="M62 30 Q72 25 85 28 Q88 35 86 42 Q80 48 72 45 Q65 40 62 30Z" fill="#D4C4A8" opacity="0.6"/>
          </svg>
          {/* 盲盒标记 */}
          {plazaData.map((p, pinIndex)=>(
            <div key={p.id} onMouseEnter={()=>setHoveredPin(p.id)} onMouseLeave={()=>setHoveredPin(null)} onClick={()=>isLoggedIn?setPage({name:"result"}):onLoginClick()}
              style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:hoveredPin===p.id?10:1,transition:"all .3s"}}>
              <div style={{width:hoveredPin===p.id?40:32,height:hoveredPin===p.id?40:32,borderRadius:"50%",background:regionColors[p.region]?.gradient||C.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:hoveredPin===p.id?"0 4px 20px rgba(0,0,0,0.2)":"0 2px 8px rgba(0,0,0,0.1)",transition:"all .3s",animation:"float 3s ease-in-out infinite",animationDelay:`${pinIndex * 0.28}s`}}>
                <span style={{fontSize:hoveredPin===p.id?18:14}}>{regionColors[p.region]?.emoji||"🎁"}</span>
              </div>
              {hoveredPin===p.id && (
                <div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",background:C.surface,borderRadius:C.radiusSm,padding:"10px 14px",boxShadow:C.shadowHover,whiteSpace:"nowrap",animation:"fadeIn .2s ease-out"}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.text}}>{p.dest}</div>
                  <div style={{fontSize:11,color:C.textMuted}}>{p.user} · 匹配{p.score}%</div>
                  <div style={{fontSize:11,color:C.textSec,marginTop:2}}>"{p.review}"</div>
                  <div style={{position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:8,height:8,background:C.surface}}/>
                </div>
              )}
            </div>
          ))}
          {/* 中央 CTA */}
          <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"center",gap:8}}>
            <div style={{background:"rgba(255,255,255,0.6)",backdropFilter:"blur(8px)",borderRadius:C.radiusFull,padding:"4px 12px",fontSize:12,color:C.textSec}}>
              <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:"#4CAF7D",marginRight:6,animation:"pulse 2s infinite"}}/>
              {plazaData.length} 人正在探索
            </div>
          </div>
        </div>

        {/* 主 CTA */}
        <button onClick={()=>isLoggedIn?setPage({name:"blindbox"}):onLoginClick()} style={{marginTop:36,padding:"16px 44px",background:C.primary,color:"#fff",fontSize:17,fontWeight:800,borderRadius:C.radiusFull,border:"none",cursor:"pointer",boxShadow:"0 6px 24px rgba(232,115,74,0.35)",display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(232,115,74,0.4)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 6px 24px rgba(232,115,74,0.35)";}}>
          <span style={{fontSize:22}}>🎁</span> 开启我的旅行盲盒
        </button>
      </section>

      {/* 特色卖点 */}
      <section style={{maxWidth:900,margin:"0 auto",padding:"56px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {[
            {icon:"✨",title:"AI 智能推荐",desc:"基于偏好量身定制",color:C.purple,bg:C.purpleLight},
            {icon:"💰",title:"预算可控",desc:"推荐方案绝不超标",color:C.green,bg:C.greenLight},
            {icon:"🎁",title:"惊喜体验",desc:"开盲盒式的旅行发现",color:C.primary,bg:C.primaryLight},
            {icon:"🛡️",title:"安全评估",desc:"AI驱动的行程安全矩阵",color:C.accent,bg:C.accentLight},
          ].map((f,i)=>(
            <div key={i} style={{textAlign:"center",padding:"28px 16px",borderRadius:C.radius,background:C.surface,border:`1px solid ${C.borderLight}`,transition:"all .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=C.shadowHover;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="none";}}>
              <div style={{width:48,height:48,borderRadius:14,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:22}}>{f.icon}</div>
              <h3 style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:4}}>{f.title}</h3>
              <p style={{fontSize:12,color:C.textMuted,lineHeight:1.4}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- P002 Blindbox Guide: 集卡引导 ---------- */
function BlindboxPage({ setPage }: { setPage: (p: { name: string }) => void }) {
  const [step,setStep]=useState(0);
  const [budget,setBudget]=useState("");
  const [selThemes,setSelThemes]=useState<string[]>([]);
  const [selScenes,setSelScenes]=useState<string[]>([]);
  const [region,setRegion]=useState("");
  const [taboos,setTaboos]=useState<string[]>([]);
  const toggle = <T,>(a: T[], s: Dispatch<SetStateAction<T[]>>, v: T) =>
    a.includes(v) ? s(a.filter((x) => x !== v)) : s([...a, v]);
  const steps=["旅行基金","旅行风格","心愿场景","探索方向","旅行护盾"];
  const collected=[!!budget,selThemes.length>0,selScenes.length>0,!!region,true];
  const cardContents=[
    budget?budgetOptions.find(b=>b.value===budget)?.label:"",
    selThemes.map(t=>themes.find(x=>x.id===t)?.name).join("·"),
    selScenes.map(s=>sceneOptions.find(x=>x.id===s)?.name).join("·"),
    region?regionOpts.find(r=>r.id===region)?.name:"",
    taboos.length>0?taboos.map(t=>tabooOpts.find(x=>x.id===t)?.name).join("·"):"无禁忌",
  ];

  return (
    <div style={{minHeight:"85vh",background:`linear-gradient(180deg,${C.bg} 0%,${C.bgAlt} 100%)`,padding:"28px 24px 40px"}}>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        {/* 集卡进度 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:28}}>
          {[0,1,2,3,4].map(i=>(
            <IllustrationCard key={i} cardIndex={i} content={cardContents[i]} collected={i<step||(i===step&&collected[i])} small />
          ))}
        </div>

        {/* 步骤指示 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:24}}>
          {steps.map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:i<step?C.primary:i===step?C.primary:"#E8DDD4",color:i<=step?"#fff":C.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,transition:"all .3s"}}>
                {i<step?<Ico name="check" size={12} color="#fff"/>:i+1}
              </div>
              <span style={{fontSize:11,fontWeight:i===step?700:400,color:i<=step?C.primary:C.textMuted,display:i===step?"inline":"none"}}>{s}</span>
              {i<4&&<div style={{width:20,height:2,borderRadius:1,background:i<step?C.primary:"#E8DDD4"}}/>}
            </div>
          ))}
        </div>

        {/* 主卡片 */}
        <div style={{background:C.surface,borderRadius:C.radiusXl,padding:"36px 32px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
          {step===0&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>你这次旅行的预算是？</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:24}}>选择后将获得 <strong style={{color:C.gold}}>旅行基金卡</strong></p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {budgetOptions.map(b=>(
                  <div key={b.value} onClick={()=>setBudget(b.value)} style={{padding:"18px 12px",borderRadius:C.radiusSm,border:`2px solid ${budget===b.value?C.gold:C.border}`,background:budget===b.value?C.goldLight:C.surface,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                    <div style={{fontSize:24,marginBottom:4}}>{b.emoji}</div>
                    <div style={{fontSize:13,fontWeight:600,color:budget===b.value?C.gold:C.text}}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step===1&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>你喜欢什么旅行风格？</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:24}}>可多选 · 选择后获得 <strong style={{color:C.purple}}>旅行风格卡</strong></p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {themes.map(t=>{const s=selThemes.includes(t.id);return(
                  <div key={t.id} onClick={()=>toggle(selThemes,setSelThemes,t.id)} style={{padding:"14px 8px",borderRadius:C.radiusSm,border:`2px solid ${s?C.purple:C.border}`,background:s?C.purpleLight:C.surface,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                    <div style={{fontSize:22,marginBottom:2}}>{t.emoji}</div>
                    <div style={{fontSize:12,fontWeight:600,color:s?C.purple:C.text}}>{t.name}</div>
                  </div>
                );})}
              </div>
            </div>
          )}
          {step===2&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>你心仪的旅行场景？</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:24}}>选择后获得 <strong style={{color:C.accent}}>心愿场景卡</strong></p>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                {sceneOptions.map(sc=>{const s=selScenes.includes(sc.id);return(
                  <button key={sc.id} onClick={()=>toggle(selScenes,setSelScenes,sc.id)} style={{padding:"10px 18px",borderRadius:C.radiusFull,border:`2px solid ${s?C.accent:C.border}`,background:s?C.accentLight:C.surface,cursor:"pointer",fontSize:13,fontWeight:500,color:s?C.accent:C.textSec,transition:"all .2s",display:"flex",alignItems:"center",gap:6}}>
                    <span>{sc.emoji}</span>{sc.name}
                  </button>
                );})}
              </div>
            </div>
          )}
          {step===3&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>想去哪个区域探索？</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:24}}>选择后获得 <strong style={{color:C.teal}}>探索方向卡</strong></p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {regionOpts.map(r=>(
                  <div key={r.id} onClick={()=>setRegion(r.id)} style={{padding:"18px 12px",borderRadius:C.radiusSm,border:`2px solid ${region===r.id?C.teal:C.border}`,background:region===r.id?C.tealLight:C.surface,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                    <div style={{fontSize:24,marginBottom:4}}>{r.emoji}</div>
                    <div style={{fontSize:13,fontWeight:600,color:region===r.id?C.teal:C.text}}>{r.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step===4&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>有什么不想要的？</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:24}}>选择后获得 <strong style={{color:C.coral}}>旅行护盾卡</strong>（可不选）</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                {tabooOpts.map(t=>{const s=taboos.includes(t.id);return(
                  <button key={t.id} onClick={()=>toggle(taboos,setTaboos,t.id)} style={{padding:"10px 18px",borderRadius:C.radiusFull,border:`2px solid ${s?C.coral:C.border}`,background:s?C.pinkLight:C.surface,cursor:"pointer",fontSize:13,fontWeight:500,color:s?C.coral:C.textSec,transition:"all .2s",display:"flex",alignItems:"center",gap:6}}>
                    <span>{t.emoji}</span>{t.name}
                  </button>
                );})}
              </div>
            </div>
          )}

          {/* Nav */}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:32}}>
            {step>0?(<button onClick={()=>setStep(step-1)} style={{display:"flex",alignItems:"center",gap:6,padding:"11px 22px",background:C.bg,color:C.textSec,fontSize:14,fontWeight:600,borderRadius:C.radiusFull,border:"none",cursor:"pointer"}}><Ico name="left" size={16}/>上一步</button>):<div/>}
            {step<4?(
              <button onClick={()=>setStep(step+1)} disabled={!collected[step]} style={{display:"flex",alignItems:"center",gap:6,padding:"11px 26px",background:collected[step]?C.primary:"#D8CFC5",color:"#fff",fontSize:14,fontWeight:700,borderRadius:C.radiusFull,border:"none",cursor:collected[step]?"pointer":"not-allowed",transition:"all .2s"}}>收集卡片 <Ico name="right" size={16} color="#fff"/></button>
            ):(
              <button onClick={()=>setPage({name:"reveal"})} style={{display:"flex",alignItems:"center",gap:8,padding:"14px 32px",background:`linear-gradient(135deg,${C.primary},${C.coral})`,color:"#fff",fontSize:15,fontWeight:800,borderRadius:C.radiusFull,border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(232,115,74,0.3)"}}>
                <span style={{fontSize:20}}>🎁</span> 5张卡已集齐 · 开启盲盒
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- P003 Result: 逐层揭晓 + 安全评估 ---------- */
function ResultPage({
  setPage,
  isLoggedIn,
  onLoginClick,
}: {
  setPage: (p: { name: string }) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}) {
  const [phase,setPhase]=useState(0); // 0=loading,1=region,2=city,3=full
  const [expanded,setExpanded]=useState([0]);
  const [saved,setSaved]=useState(false);
  const [showSafety,setShowSafety]=useState(false);
  const r=sampleResult;
  const rc=regionColors[r.destination.region]||regionColors["日韩"];

  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),1500);
    const t2=setTimeout(()=>setPhase(2),3200);
    const t3=setTimeout(()=>setPhase(3),5000);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);

  return (
    <div style={{minHeight:"85vh",background:C.bg}}>
      {/* 逐层揭晓 */}
      {phase<3 && (
        <section style={{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",background:phase>=1?rc.gradient:`linear-gradient(135deg,${C.bgAlt},${C.bg})`,transition:"background 1s ease"}}>
          {phase===0&&(
            <div style={{textAlign:"center",animation:"pulse 1.5s ease-in-out infinite"}}>
              <div style={{fontSize:72,marginBottom:16}}>🎁</div>
              <h2 style={{fontSize:20,fontWeight:700,color:C.text}}>正在开启你的盲盒...</h2>
              <div style={{width:180,height:4,background:C.border,borderRadius:2,margin:"20px auto",overflow:"hidden"}}>
                <div style={{width:"60%",height:"100%",background:C.primary,borderRadius:2,animation:"loading 1.5s ease-in-out infinite"}}/>
              </div>
            </div>
          )}
          {phase===1&&(
            <div style={{textAlign:"center",animation:"slideUp .8s ease-out"}}>
              <div style={{fontSize:60,marginBottom:16}}>🌏</div>
              <p style={{fontSize:16,color:"rgba(255,255,255,0.8)",marginBottom:8}}>第一层揭晓——你将前往...</p>
              <h1 style={{fontSize:52,fontWeight:900,color:"#fff",textShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>{r.destination.region}！</h1>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",marginTop:12}}>继续拆盒中...</p>
            </div>
          )}
          {phase===2&&(
            <div style={{textAlign:"center",animation:"slideUp .8s ease-out"}}>
              <div style={{fontSize:60,marginBottom:16}}>{rc.emoji}</div>
              <p style={{fontSize:16,color:"rgba(255,255,255,0.8)",marginBottom:8}}>第二层揭晓——目的地是...</p>
              <h1 style={{fontSize:64,fontWeight:900,color:"#fff",textShadow:"0 4px 20px rgba(0,0,0,0.2)",letterSpacing:"-1px"}}>{r.destination.name}！</h1>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:16}}>
                {r.destination.tags.map(t=><span key={t} style={{padding:"4px 14px",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:13,borderRadius:C.radiusFull,backdropFilter:"blur(4px)"}}>{t}</span>)}
              </div>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",marginTop:16}}>完整行程即将展开...</p>
            </div>
          )}
        </section>
      )}

      {/* 完整结果 */}
      {phase>=3&&(
        <>
        <section style={{background:rc.gradient,padding:"48px 24px 36px",textAlign:"center"}}>
          <div style={{animation:"fadeIn .8s ease-out"}}>
            <div style={{fontSize:48,marginBottom:8}}>🎉</div>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.8)"}}>你的旅行盲盒目的地</p>
            <h1 style={{fontSize:48,fontWeight:900,color:"#fff",margin:"4px 0 16px"}}>{r.destination.name}</h1>
            <div style={{display:"inline-flex",background:"rgba(255,255,255,0.2)",borderRadius:C.radius,padding:"14px 24px",backdropFilter:"blur(8px)",gap:24}}>
              <div><div style={{fontSize:28,fontWeight:800,color:"#fff"}}>{r.matchScore}%</div><div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>匹配度</div></div>
              <div style={{width:1,background:"rgba(255,255,255,0.2)"}}/>
              <div><div style={{fontSize:28,fontWeight:800,color:"#fff"}}>{r.duration}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>行程时长</div></div>
              <div style={{width:1,background:"rgba(255,255,255,0.2)"}}/>
              <div><div style={{fontSize:28,fontWeight:800,color:"#fff"}}>{r.cost}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>预估花费</div></div>
            </div>
          </div>
        </section>

        <section style={{maxWidth:720,margin:"0 auto",padding:"28px 24px 140px"}}>
          {/* 安全评估模块 */}
          <div style={{background:C.surface,borderRadius:C.radius,padding:"24px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:36,height:36,borderRadius:10,background:r.safety.overall>=70?C.greenLight:C.goldLight,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico name="shield" size={18} color={r.safety.overall>=70?C.green:C.gold}/></div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:C.text}}>安全评估</div>
                  <div style={{fontSize:12,color:C.textMuted}}>RAG 驱动 · 6维分析</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:28,fontWeight:800,color:r.safety.overall>=70?C.green:C.gold}}>{r.safety.overall}</span>
                <span style={{padding:"3px 10px",background:r.safety.overall>=70?C.greenLight:C.goldLight,color:r.safety.overall>=70?C.green:C.gold,fontSize:12,fontWeight:700,borderRadius:C.radiusFull}}>{r.safety.grade}级</span>
              </div>
            </div>
            {/* 6维度条 */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {Object.entries(r.safety.dims).map(([k,v])=>(
                <div key={k} style={{padding:"10px 12px",background:C.bg,borderRadius:C.radiusSm}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:11,color:C.textSec}}>{v.label}</span>
                    <span style={{fontSize:12,fontWeight:700,color:v.score>=80?C.green:v.score>=60?C.gold:C.coral}}>{v.score}</span>
                  </div>
                  <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${v.score}%`,height:"100%",borderRadius:2,background:v.score>=80?C.green:v.score>=60?C.gold:C.coral,transition:"width .8s ease-out"}}/>
                  </div>
                </div>
              ))}
            </div>
            {/* 警示 */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {r.safety.alerts.map((a,i)=>(
                <div key={i} style={{padding:"10px 14px",borderRadius:C.radiusSm,background:a.level==="caution"?C.goldLight:C.accentLight,border:`1px solid ${a.level==="caution"?"#E4D098":"#C5D8F0"}`,display:"flex",gap:10}}>
                  <Ico name={a.level==="caution"?"alert":"info"} size={16} color={a.level==="caution"?C.gold:C.accent}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:C.text}}>{a.title}</div>
                    <div style={{fontSize:12,color:C.textSec,marginTop:2}}>{a.prevention}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* 出行清单 */}
            <button onClick={()=>setShowSafety(!showSafety)} style={{width:"100%",marginTop:12,padding:"10px",background:C.bg,color:C.textSec,fontSize:12,fontWeight:600,borderRadius:C.radiusSm,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              {showSafety?"收起":"展开"} 出行准备清单 <Ico name="down" size={14}/>
            </button>
            {showSafety&&(
              <div style={{marginTop:10,padding:"14px",background:C.bg,borderRadius:C.radiusSm}}>
                {r.safety.checklist.map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"6px 0",fontSize:13,color:C.textSec}}>
                    <span style={{color:C.green,marginTop:1}}>☐</span>{c}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 行程 */}
          <h3 style={{fontSize:18,fontWeight:800,color:C.text,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>🗓️</span>行程安排
          </h3>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {r.itinerary.map((day,i)=>{
              const isOpen=expanded.includes(i);
              const locked=i>0&&!isLoggedIn;
              return(
                <div key={i} style={{background:C.surface,borderRadius:C.radius,overflow:"hidden",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
                  <div onClick={()=>!locked&&(isOpen?setExpanded(expanded.filter(x=>x!==i)):setExpanded([...expanded,i]))} style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:locked?"default":"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:36,height:36,borderRadius:10,background:rc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:rc.accent}}>D{day.day}</div>
                      <div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{day.title}</div><div style={{fontSize:11,color:C.textMuted}}>{day.acts.length}个活动</div></div>
                    </div>
                    {locked?<Ico name="lock" size={16} color={C.textMuted}/>:<Ico name="down" size={16} color={C.textMuted}/>}
                  </div>
                  {locked&&(
                    <div style={{padding:"0 18px 14px"}}>
                      <button onClick={onLoginClick} style={{width:"100%",padding:"10px",background:C.bg,color:C.primary,fontSize:12,fontWeight:600,borderRadius:C.radiusSm,border:`1px dashed ${C.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                        <Ico name="lock" size={13} color={C.primary}/>登录后查看完整行程
                      </button>
                    </div>
                  )}
                  {isOpen&&!locked&&(
                    <div style={{padding:"0 18px 16px",borderTop:`1px solid ${C.borderLight}`}}>
                      {day.acts.map((a,j)=>(
                        <div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"12px 0",borderBottom:j<day.acts.length-1?`1px solid ${C.borderLight}`:"none"}}>
                          <div style={{display:"flex",gap:12,flex:1}}>
                            <span style={{padding:"3px 10px",background:C.bg,borderRadius:6,fontSize:11,fontWeight:600,color:C.textSec,whiteSpace:"nowrap",height:"fit-content"}}>{a.time}</span>
                            <div>
                              <div style={{fontSize:14,fontWeight:600,color:C.text}}>{a.name}</div>
                              <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{a.desc}</div>
                            </div>
                          </div>
                          {a.booking&&(
                            <button style={{padding:"5px 12px",background:C.primaryLight,color:C.primary,fontSize:11,fontWeight:600,borderRadius:C.radiusFull,border:"none",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,marginLeft:8}}>
                              查看价格 →
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Floating bar */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,248,240,0.95)",backdropFilter:"blur(10px)",borderTop:`1px solid ${C.borderLight}`,padding:"10px 24px",zIndex:90}}>
          <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:8}}>
            <button onClick={()=>isLoggedIn?setSaved(!saved):onLoginClick()} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"11px",borderRadius:C.radiusFull,border:`1.5px solid ${C.border}`,background:C.surface,cursor:"pointer",fontSize:13,fontWeight:600,color:saved?C.coral:C.textSec}}>
              <Ico name={saved?"heartF":"heart"} size={16} color={saved?C.coral:C.textMuted}/>{saved?"已收藏":"收藏"}
            </button>
            <button style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"11px",borderRadius:C.radiusFull,border:`1.5px solid ${C.border}`,background:C.surface,cursor:"pointer",fontSize:13,fontWeight:600,color:C.textSec}}>
              <Ico name="share" size={16} color={C.textMuted}/>分享
            </button>
            <button onClick={()=>setPage({name:"blindbox"})} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"11px",borderRadius:C.radiusFull,border:`1.5px solid ${C.border}`,background:C.surface,cursor:"pointer",fontSize:13,fontWeight:600,color:C.textSec}}>
              <Ico name="refresh" size={16} color={C.textMuted}/>再开一个
            </button>
            <button style={{flex:1.3,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"11px",borderRadius:C.radiusFull,background:C.primary,cursor:"pointer",fontSize:13,fontWeight:700,color:"#fff",border:"none",boxShadow:"0 2px 10px rgba(232,115,74,0.3)"}}>
              <Ico name="ext" size={16} color="#fff"/>去预订
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

/* ---------- P006 盲盒广场 ---------- */
function PlazaPage({
  setPage,
  isLoggedIn,
  onLoginClick,
}: {
  setPage: (p: { name: string }) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}) {
  const [hoveredPin,setHoveredPin]=useState<string | null>(null);
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?plazaData:plazaData.filter(p=>p.region===filter);
  return (
    <div style={{minHeight:"85vh",background:C.bg,padding:"32px 24px"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <h1 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
          <Ico name="globe" size={26} color={C.primary}/>盲盒广场
        </h1>
        <p style={{fontSize:14,color:C.textMuted,marginBottom:24}}>探索其他旅行者开出的盲盒目的地</p>

        {/* 筛选 */}
        <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
          {[{key:"all",label:"全部"},{key:"日韩",label:"🗾 日韩"},{key:"东南亚",label:"🌴 东南亚"},{key:"欧洲",label:"🏰 欧洲"},{key:"国内",label:"🇨🇳 国内"},{key:"北美",label:"🗽 北美"}].map(f=>(
            <button key={f.key} onClick={()=>setFilter(f.key)} style={{padding:"7px 16px",borderRadius:C.radiusFull,border:`1.5px solid ${filter===f.key?C.primary:C.border}`,background:filter===f.key?C.primaryLight:C.surface,color:filter===f.key?C.primary:C.textSec,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>{f.label}</button>
          ))}
        </div>

        {/* 地图 */}
        <div style={{position:"relative",width:"100%",aspectRatio:"2/1",background:"linear-gradient(135deg,#C5DAE8,#A0BDD6)",borderRadius:C.radiusXl,overflow:"hidden",border:`2px solid ${C.border}`,marginBottom:32}}>
          <svg viewBox="0 0 200 100" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
            <path d="M35 25 Q42 20 55 22 Q60 25 58 35 Q55 42 48 40 Q40 38 35 30Z" fill="#D4C4A8" opacity="0.5"/>
            <path d="M15 30 Q22 25 30 28 Q32 35 28 42 Q20 45 15 38Z" fill="#C8B898" opacity="0.5"/>
            <path d="M40 28 Q55 24 65 30 Q68 38 60 45 Q50 48 42 42 Q38 35 40 28Z" fill="#D4C4A8" opacity="0.5"/>
            <path d="M55 45 Q62 40 70 42 Q72 50 65 55 Q58 52 55 45Z" fill="#D0BC9E" opacity="0.4"/>
            <path d="M62 30 Q72 25 85 28 Q88 35 86 42 Q80 48 72 45 Q65 40 62 30Z" fill="#D4C4A8" opacity="0.5"/>
          </svg>
          {filtered.map(p=>{
            const rc=regionColors[p.region];
            return(
            <div key={p.id} onMouseEnter={()=>setHoveredPin(p.id)} onMouseLeave={()=>setHoveredPin(null)} onClick={()=>isLoggedIn?setPage({name:"result"}):onLoginClick()}
              style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:hoveredPin===p.id?10:1}}>
              <div style={{width:hoveredPin===p.id?44:34,height:hoveredPin===p.id?44:34,borderRadius:"50%",background:rc?.gradient||C.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:hoveredPin===p.id?"0 6px 24px rgba(0,0,0,0.2)":"0 2px 10px rgba(0,0,0,0.12)",transition:"all .3s",border:"2.5px solid rgba(255,255,255,0.6)"}}>
                <span style={{fontSize:hoveredPin===p.id?20:15}}>{rc?.emoji||"🎁"}</span>
              </div>
              {hoveredPin===p.id&&(
                <div style={{position:"absolute",bottom:"120%",left:"50%",transform:"translateX(-50%)",background:C.surface,borderRadius:C.radiusSm,padding:"12px 16px",boxShadow:C.shadowHover,whiteSpace:"nowrap",animation:"fadeIn .2s",minWidth:160}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:16,fontWeight:800,color:C.text}}>{p.dest}</span>
                    <span style={{fontSize:12,fontWeight:700,color:C.primary}}>{p.score}%</span>
                  </div>
                  <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>by {p.user}</div>
                  <div style={{fontSize:12,color:C.textSec}}>"{p.review}"</div>
                  <div style={{position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:8,height:8,background:C.surface}}/>
                </div>
              )}
            </div>
          );})}
        </div>

        {/* 卡片列表 */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {filtered.map(p=>{const rc=regionColors[p.region];return(
            <div key={p.id} onClick={()=>isLoggedIn?setPage({name:"result"}):onLoginClick()} style={{background:C.surface,borderRadius:C.radius,overflow:"hidden",cursor:"pointer",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,transition:"all .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=C.shadowHover;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=C.shadow;}}>
              <div style={{height:70,background:rc?.gradient||C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:28}}>{rc?.emoji||"🎁"}</span>
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:15,fontWeight:700,color:C.text}}>{p.dest}</span>
                  <span style={{fontSize:12,fontWeight:700,color:C.primary}}>{p.score}%</span>
                </div>
                <div style={{fontSize:12,color:C.textMuted}}>by {p.user}</div>
                <div style={{fontSize:12,color:C.textSec,marginTop:4,lineHeight:1.3}}>"{p.review}"</div>
              </div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

/* ---------- P005 Profile: 卡片集 + 历史 ---------- */
function ProfilePage({ setPage }: { setPage: (p: { name: string }) => void }) {
  const [tab,setTab]=useState("history");
  const [favs, setFavs] = useState<Record<string, boolean>>(() =>
    historyBoxes.reduce<Record<string, boolean>>((a, b) => ({ ...a, [b.id]: b.fav }), {})
  );
  return (
    <div style={{minHeight:"85vh",background:`linear-gradient(180deg,${C.primaryLight} 0%,${C.bg} 25%)`}}>
      <div style={{maxWidth:800,margin:"0 auto",padding:"36px 24px"}}>
        {/* User card */}
        <div style={{background:C.surface,borderRadius:C.radiusXl,padding:"28px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,marginBottom:28,display:"flex",alignItems:"center",gap:20}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.primaryLight},${C.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico name="user" size={26} color={C.primary}/></div>
          <div style={{flex:1}}>
            <h2 style={{fontSize:20,fontWeight:800,color:C.text}}>旅行达人小明</h2>
            <div style={{fontSize:13,color:C.textMuted,marginTop:2}}>已收集 15 张卡片 · 点亮 3 个区域</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{textAlign:"center",padding:"10px 18px",background:C.bg,borderRadius:C.radiusSm}}>
              <div style={{fontSize:22,fontWeight:800,color:C.primary}}>{historyBoxes.length}</div>
              <div style={{fontSize:11,color:C.textMuted}}>已开盲盒</div>
            </div>
            <div style={{textAlign:"center",padding:"10px 18px",background:C.bg,borderRadius:C.radiusSm}}>
              <div style={{fontSize:22,fontWeight:800,color:C.coral}}>{Object.values(favs).filter(Boolean).length}</div>
              <div style={{fontSize:11,color:C.textMuted}}>已收藏</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,background:C.bg,borderRadius:C.radiusSm,padding:4,marginBottom:24}}>
          {[{key:"history",label:"历史盲盒",icon:"gift"},{key:"cards",label:"我的卡片集",icon:"collection"},{key:"map",label:"探索地图",icon:"globe"}].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"10px",fontSize:13,fontWeight:600,borderRadius:C.radiusSm,border:"none",background:tab===t.key?C.surface:"transparent",color:tab===t.key?C.primary:C.textMuted,cursor:"pointer",boxShadow:tab===t.key?C.shadow:"none",transition:"all .2s"}}>
              <Ico name={t.icon} size={15} color={tab===t.key?C.primary:C.textMuted}/>{t.label}
            </button>
          ))}
        </div>

        {/* History */}
        {tab==="history"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {historyBoxes.map(b=>(
              <div key={b.id} onClick={()=>setPage({name:"result"})} style={{background:C.surface,borderRadius:C.radius,padding:"18px",cursor:"pointer",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=C.shadowHover;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=C.shadow;}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <h4 style={{fontSize:17,fontWeight:800,color:C.text}}>{b.dest}</h4>
                  <button onClick={e=>{e.stopPropagation();setFavs(p=>({...p,[b.id]:!p[b.id]}));}} style={{background:"transparent",border:"none",cursor:"pointer",padding:2}}>
                    <Ico name={favs[b.id]?"heartF":"heart"} size={18} color={favs[b.id]?C.coral:C.border}/>
                  </button>
                </div>
                <span style={{display:"inline-block",padding:"3px 10px",background:C.primaryLight,color:C.primary,fontSize:11,fontWeight:600,borderRadius:C.radiusFull,marginBottom:10}}>{b.theme}</span>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:C.textMuted}}>{b.date}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.primary}}>{b.score}%</span>
                </div>
                <div style={{marginTop:10,fontSize:11,color:C.textMuted}}>🃏 {b.cards} 张卡片</div>
              </div>
            ))}
          </div>
        )}

        {/* Cards Collection */}
        {tab==="cards"&&(
          <div>
            <p style={{fontSize:14,color:C.textSec,marginBottom:20}}>每次开盲盒收集的5张插画卡片</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:14,justifyContent:"center"}}>
              {[0,1,2,3,4,0,1,2,3,4,0,1,2,3,4].map((ci,i)=>(
                <IllustrationCard key={i} cardIndex={ci} content={["¥3k-5k","文艺打卡","咖啡馆","日韩","无禁忌"][ci]} collected={i<historyBoxes.length*5}/>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        {tab==="map"&&(
          <div style={{textAlign:"center"}}>
            <div style={{position:"relative",width:"100%",aspectRatio:"2/1",background:"linear-gradient(135deg,#C5DAE8,#A0BDD6)",borderRadius:C.radiusXl,overflow:"hidden",border:`2px solid ${C.border}`}}>
              <svg viewBox="0 0 200 100" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
                <path d="M35 25 Q42 20 55 22 Q60 25 58 35 Q55 42 48 40 Q40 38 35 30Z" fill="#D4C4A8" opacity="0.5"/>
                <path d="M15 30 Q22 25 30 28 Q32 35 28 42 Q20 45 15 38Z" fill="#C8B898" opacity="0.5"/>
                <path d="M40 28 Q55 24 65 30 Q68 38 60 45 Q50 48 42 42 Q38 35 40 28Z" fill="#D4C4A8" opacity="0.5"/>
                <path d="M62 30 Q72 25 85 28 Q88 35 86 42 Q80 48 72 45 Q65 40 62 30Z" fill="#D4C4A8" opacity="0.5"/>
              </svg>
              {/* 已点亮的区域 */}
              {["日韩","东南亚","国内"].map(r=>{
                const pins = plazaData.filter(p=>p.region===r);
                const rc=regionColors[r];
                return pins.map(p=>(
                  <div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:rc?.gradient||C.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",border:"2px solid rgba(255,255,255,0.5)"}}>
                      <span style={{fontSize:12}}>{rc?.emoji}</span>
                    </div>
                  </div>
                ));
              })}
            </div>
            <p style={{fontSize:13,color:C.textMuted,marginTop:16}}>已点亮 <strong style={{color:C.primary}}>3</strong> 个区域 · 继续开盲盒探索更多</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer style={{background:C.text,color:C.textMuted,padding:"40px 24px 28px"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:24,marginBottom:28}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:30,height:30,borderRadius:8,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico name="plane" size={14} color="#fff"/></div>
              <span style={{fontSize:15,fontWeight:800,color:"#fff"}}>Trip <span style={{color:C.primary}}>Open</span></span>
            </div>
            <p style={{fontSize:12,color:"#8C837A",maxWidth:300,lineHeight:1.5}}>旅行不用选，开个盲盒就出发。</p>
          </div>
          <div style={{display:"flex",gap:28}}>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {["首页","开盲盒","盲盒广场"].map(l=><span key={l} style={{fontSize:12,color:"#8C837A",cursor:"pointer"}}>{l}</span>)}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <span style={{fontSize:12,color:"#8C837A"}}>hello@tripopen.com</span>
              <span style={{fontSize:12,color:"#8C837A"}}>微信: TripOpen2026</span>
            </div>
          </div>
        </div>
        <div style={{borderTop:"1px solid #3D3835",paddingTop:16,fontSize:11,color:"#5E5550"}}>© 2026 Trip Open. All rights reserved.</div>
      </div>
    </footer>
  );
}

/* ---------- Main App ---------- */
export default function TripOpenV2Prototype({ embedded = false }: { embedded?: boolean }) {
  const [page,setPage]=useState({name:"home"});
  const [authOpen,setAuthOpen]=useState(false);
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const onLoginClick=()=>setAuthOpen(true);
  const renderPage=()=>{
    switch(page.name){
      case "home": return <HomePage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={onLoginClick}/>;
      case "blindbox": return <BlindboxPage setPage={setPage}/>;
      case "reveal": case "result": return <ResultPage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={onLoginClick}/>;
      case "plaza": return <PlazaPage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={onLoginClick}/>;
      case "profile": return <ProfilePage setPage={setPage}/>;
      default: return <HomePage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={onLoginClick}/>;
    }
  };
  return (
    <div
      className="trip-open-v2-root"
      style={{
        fontFamily: "'Inter','Noto Sans SC','PingFang SC',system-ui,sans-serif",
        color: C.text,
        background: C.bg,
        minHeight: embedded ? undefined : "100vh",
      }}
    >
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes loading{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}
        .trip-open-v2-root,.trip-open-v2-root *{box-sizing:border-box}
        .trip-open-v2-root button{font-family:inherit}
        .trip-open-v2-root input,.trip-open-v2-root textarea{font-family:inherit}
        .trip-open-v2-root ::-webkit-scrollbar{width:5px;height:5px}
        .trip-open-v2-root ::-webkit-scrollbar-thumb{background:#D8CFC5;border-radius:3px}
      `}</style>
      {embedded ? (
        <EmbeddedSubNav page={page} setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} />
      ) : (
        <Navbar page={page} setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} />
      )}
      {renderPage()}
      {!embedded && <Footer />}
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onLogin={()=>setIsLoggedIn(true)}/>
    </div>
  );
}
