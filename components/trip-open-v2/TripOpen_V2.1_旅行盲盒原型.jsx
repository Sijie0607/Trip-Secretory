import { useState, useEffect } from "react";

// ============================================================
// Trip Open V2.2 · 插画风旅行盲盒 · 完整交互原型
// 更新：社交刷新点 / 旅途同路人发现 / 图文动态分享
// ============================================================

/* ========== 全局色彩系统 ========== */
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

/* ========== 地区插画色系 ========== */
const regionColors = {
  "日韩": { bg: "#FDE7E7", accent: "#D94F4F", emoji: "🗾", gradient: "linear-gradient(135deg, #F5A0A0, #E06B6B)" },
  "东南亚": { bg: "#E5F6E8", accent: "#3A9D5C", emoji: "🌴", gradient: "linear-gradient(135deg, #7DD3A0, #3A9D5C)" },
  "欧洲": { bg: "#E8EDF8", accent: "#5B6DB0", emoji: "🏰", gradient: "linear-gradient(135deg, #8B9FD9, #5B6DB0)" },
  "国内": { bg: "#FDE8DB", accent: "#D47B4A", emoji: "🇨🇳", gradient: "linear-gradient(135deg, #F0A876, #D47B4A)" },
  "北美": { bg: "#E3EEF8", accent: "#4A8BC2", emoji: "🗽", gradient: "linear-gradient(135deg, #7BB5E0, #4A8BC2)" },
};

/* ========== Mock Data ========== */
const themes = [
  { id:"island", name:"海岛度假", emoji:"🏝️", color:"#0EA5E9" },
  { id:"city", name:"城市探索", emoji:"🏙️", color:"#6366F1" },
  { id:"ancient", name:"古镇漫游", emoji:"🏯", color:"#D97706" },
  { id:"outdoor", name:"户外冒险", emoji:"⛰️", color:"#059669" },
  { id:"food", name:"美食之旅", emoji:"🍜", color:"#DC2626" },
  { id:"art", name:"文艺打卡", emoji:"🎨", color:"#EC4899" },
  { id:"honeymoon", name:"蜜月浪漫", emoji:"💕", color:"#F43F5E" },
  { id:"offbeat", name:"小众秘境", emoji:"🗺️", color:"#0D9488" },
];
const budgetOptions = [
  { label:"¥1,000以内", value:"0-1000", emoji:"🎒" },
  { label:"¥1,000-3,000", value:"1000-3000", emoji:"🧳" },
  { label:"¥3,000-5,000", value:"3000-5000", emoji:"💼" },
  { label:"¥5,000-10,000", value:"5000-10000", emoji:"💎" },
  { label:"¥10,000+", value:"10000+", emoji:"👑" },
];
const durationOptions = [
  { label:"周末短途", value:"2", days:"2天1夜", emoji:"🌙", desc:"城市周边·说走就走" },
  { label:"小长假", value:"4", days:"3-4天", emoji:"✈️", desc:"短途出境·深度体验" },
  { label:"一周深度", value:"7", days:"6-7天", emoji:"🗺️", desc:"充分探索目的地" },
  { label:"长假探索", value:"10", days:"10天+", emoji:"🌍", desc:"环线深度旅行" },
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

/* ========== 沉浸式插画数据 ========== */
const themeIllustrations = {
  island: { gradient:"linear-gradient(135deg,#0077B6,#00B4D8,#90E0EF,#CAF0F8)", emoji:"🏝️", title:"海岛度假", desc:"碧海蓝天下，让身心彻底放空", vibes:["自由","慵懒","阳光","海盐味"] },
  city: { gradient:"linear-gradient(135deg,#2D3561,#C84B31,#ECDB54)", emoji:"🏙️", title:"城市探索", desc:"在陌生街道迷路，是最好的旅行方式", vibes:["都市感","探索","夜生活","多元"] },
  ancient: { gradient:"linear-gradient(135deg,#7B2D00,#D4A017,#8B7355)", emoji:"🏯", title:"古镇漫游", desc:"石板路上每一步都踩着千年故事", vibes:["历史","文化","厚重","时光感"] },
  outdoor: { gradient:"linear-gradient(135deg,#1B5E20,#388E3C,#8BC34A)", emoji:"⛰️", title:"户外冒险", desc:"山风呼啸，云雾穿越，这才是真正的自由", vibes:["挑战","自然","冒险","壮阔"] },
  food: { gradient:"linear-gradient(135deg,#B71C1C,#E64A19,#FF8A65)", emoji:"🍜", title:"美食之旅", desc:"吃遍一座城，读懂一种文化", vibes:["鲜美","烟火气","探索","满足感"] },
  art: { gradient:"linear-gradient(135deg,#4A148C,#7B1FA2,#CE93D8)", emoji:"🎨", title:"文艺打卡", desc:"博物馆、咖啡馆与画廊，灵感无处不在", vibes:["文艺","创意","慢节奏","美学"] },
  honeymoon: { gradient:"linear-gradient(135deg,#880E4F,#E91E8C,#F48FB1)", emoji:"💕", title:"蜜月浪漫", desc:"两个人的世界，每一刻都是永恒", vibes:["浪漫","私密","温柔","幸福感"] },
  offbeat: { gradient:"linear-gradient(135deg,#004D40,#00796B,#80CBC4)", emoji:"🗺️", title:"小众秘境", desc:"不在地图上的宝藏，只有你知道", vibes:["探索","神秘","稀缺","惊喜"] },
};
const sceneIllustrations = {
  cafe: { gradient:"linear-gradient(135deg,#8B5E3C,#D4A96A,#FFF8F0)", emoji:"☕", title:"咖啡时光", desc:"阳光透过玻璃落在杯上，一本书，一个下午", vibes:["慵懒","文艺","静谧","温暖"] },
  museum: { gradient:"linear-gradient(135deg,#4A3F6B,#8B79CF,#E8D5F5)", emoji:"🏛️", title:"艺术殿堂", desc:"穿越历史的长廊，感受人类文明的厚度", vibes:["庄严","启迪","文化","深度"] },
  beach: { gradient:"linear-gradient(135deg,#00B4D8,#90E0EF,#F4A261)", emoji:"🏖️", title:"碧海金沙", desc:"椰风轻抚脸颊，海浪声声入耳", vibes:["慵懒","治愈","度假感","蔚蓝"] },
  nightmarket: { gradient:"linear-gradient(135deg,#1A1A2E,#E94560,#F5A623)", emoji:"🌙", title:"夜市烟火", desc:"烟雾弥漫的摊档之间，藏着城市最真实的味道", vibes:["烟火气","热闹","市井","夜生活"] },
  hotspring: { gradient:"linear-gradient(135deg,#E8D5C4,#C9B8A8,#7BB3C0)", emoji:"♨️", title:"温泉胜地", desc:"雾气氤氲，温热的泉水治愈一切疲惫", vibes:["放松","治愈","舒适","静谧"] },
  hiking: { gradient:"linear-gradient(135deg,#2D6A4F,#52B788,#B7E4C7)", emoji:"🥾", title:"山野徒步", desc:"踏着泥土的芬芳，登顶时壮阔让人忘记一切", vibes:["挑战","自然","壮阔","清新"] },
  photography: { gradient:"linear-gradient(135deg,#1D3557,#457B9D,#A8DADC)", emoji:"📸", title:"光影之旅", desc:"每一帧都是时间的礼物", vibes:["创意","记录","专注","美学"] },
  shopping: { gradient:"linear-gradient(135deg,#C9184A,#FF4D6D,#FFB3C1)", emoji:"🛍️", title:"购物天堂", desc:"从本地集市到品牌街区，发现独特的惊喜", vibes:["活力","探索","时尚","收获"] },
  show: { gradient:"linear-gradient(135deg,#2C0735,#9B2FBE,#FFCA3A)", emoji:"🎭", title:"演出之夜", desc:"灯光熄灭的那一刻，魔法开始了", vibes:["感动","震撼","文艺","难忘"] },
  temple: { gradient:"linear-gradient(135deg,#7B2D00,#C45C26,#F5D5A0)", emoji:"🛕", title:"古寺参禅", desc:"晨钟暮鼓，在历史的回响中寻找内心的宁静", vibes:["禅意","历史","庄严","虔诚"] },
};
const regionIllustrations = {
  domestic: { gradient:"linear-gradient(135deg,#B71C1C,#E53935,#FDD835)", emoji:"🇨🇳", title:"中国大地", desc:"从雪域高原到江南水乡，每一寸土地都是惊喜", vibes:["地大物博","文化底蕴","风味十足"] },
  sea: { gradient:"linear-gradient(135deg,#1B5E20,#43A047,#FFCA28)", emoji:"🌴", title:"东南亚热带", desc:"热带雨林、金色寺庙与蔚蓝大海", vibes:["热带风情","性价比高","文化多元"] },
  jpkr: { gradient:"linear-gradient(135deg,#B71C1C,#EF5350,#FCE4EC)", emoji:"🗾", title:"日韩之旅", desc:"樱花飘落的古道，霓虹闪烁的夜市", vibes:["精致","美食","街头文化"] },
  europe: { gradient:"linear-gradient(135deg,#1A237E,#3949AB,#90CAF9)", emoji:"🏰", title:"欧洲风情", desc:"哥特教堂、卵石小径与百年咖啡馆", vibes:["浪漫","历史厚重","建筑美学"] },
  na: { gradient:"linear-gradient(135deg,#1A237E,#283593,#B71C1C)", emoji:"🗽", title:"北美大陆", desc:"摩天大楼到壮阔峡谷，北美的尺度令人惊叹", vibes:["壮阔","多元文化","自然奇观"] },
  random: { gradient:"linear-gradient(135deg,#4A148C,#E91E8C,#FF6F00)", emoji:"🎲", title:"随机惊喜", desc:"把决定权完全交给命运，你的下一站连自己都不知道", vibes:["纯粹惊喜","完全随机","冒险精神"] },
};

/* ========== 景点详情数据 ========== */
const attractionDetails = {
  "伏见稻荷大社": {
    emoji:"⛩️", mood:"神秘 · 震撼 · 仪式感",
    desc:"千本鸟居绵延山道，朱红色的门洞一重叠一重，穿越其中仿佛进入另一个时空。清晨薄雾未散时最为神秘。",
    vibes:["朱红震撼","神圣感","光影交错","仪式感"],
    images:[
      {gradient:"linear-gradient(135deg,#B71C1C,#E53935,#FF7043)",label:"千本鸟居"},
      {gradient:"linear-gradient(135deg,#4A1942,#880E4F)",label:"晨曦光影"},
      {gradient:"linear-gradient(135deg,#7B2D00,#C45C26)",label:"山顶神社"},
    ]
  },
  "清水寺": {
    emoji:"🏯", mood:"壮观 · 历史感 · 诗意",
    desc:"悬空于山腰的清水舞台，不用一颗钉子支撑，俯瞰古都全景时让人屏息。春日樱花、秋日红叶，每个季节都有不同的惊喜。",
    vibes:["俯瞰全城","千年古刹","绿意禅境","四季美景"],
    images:[
      {gradient:"linear-gradient(135deg,#1A237E,#42A5F5)",label:"城市全景"},
      {gradient:"linear-gradient(135deg,#1B5E20,#4CAF50,#C8E6C9)",label:"春日樱花"},
      {gradient:"linear-gradient(135deg,#37474F,#90A4AE)",label:"木结构舞台"},
    ]
  },
  "花见小路": {
    emoji:"🏮", mood:"怀旧 · 温柔 · 梦幻",
    desc:"祗园最迷人的小巷，傍晚灯笼亮起时，整条街道如同穿越回江户时代。偶有艺妓轻盈掠过。",
    vibes:["石板路氛围","艺妓文化","灯笼暖光","传统京都"],
    images:[
      {gradient:"linear-gradient(135deg,#1A1A2E,#4A4458)",label:"夜幕灯笼"},
      {gradient:"linear-gradient(135deg,#7B2D00,#C45C26,#F5D5A0)",label:"石板小路"},
      {gradient:"linear-gradient(135deg,#880E4F,#C2185B,#F8BBD9)",label:"传统艺妓"},
    ]
  },
  "金阁寺": {
    emoji:"🥇", mood:"辉煌 · 宁静 · 画意",
    desc:"镜湖池中完美倒映的金色楼阁，清晨薄雾中金光在水面轻轻荡漾，几乎不真实。",
    vibes:["金碧辉煌","镜湖倒影","禅意庭园","历史震撼"],
    images:[
      {gradient:"linear-gradient(135deg,#F57F17,#FFD54F)",label:"金阁倒影"},
      {gradient:"linear-gradient(135deg,#1B5E20,#2E7D32)",label:"庭园绿意"},
      {gradient:"linear-gradient(135deg,#0D47A1,#90CAF9)",label:"晴空映衬"},
    ]
  },
  "龙安寺枯山水": {
    emoji:"🪨", mood:"极简 · 禅意 · 冥想",
    desc:"十五块石头组成的枯山水庭园，无论从哪个角度看都无法同时看到全部。在石庭前静坐，时间仿佛停止。",
    vibes:["枯山水","极简美学","冥想空间","哲学意味"],
    images:[
      {gradient:"linear-gradient(135deg,#BDBDBD,#E0E0E0,#F5F5F5)",label:"白砂石庭"},
      {gradient:"linear-gradient(135deg,#37474F,#78909C)",label:"苔藓石组"},
      {gradient:"linear-gradient(135deg,#4E342E,#8D6E63)",label:"木质回廊"},
    ]
  },
  "锦市场": {
    emoji:"🍡", mood:"热闹 · 鲜活 · 地道",
    desc:"京都的厨房，400米长的商店街挤满了新鲜食材与地道小吃。边走边吃是最好的打开方式。",
    vibes:["市井烟火","京都味道","边走边吃","色彩缤纷"],
    images:[
      {gradient:"linear-gradient(135deg,#E65100,#FF9800,#FFE082)",label:"美食摊档"},
      {gradient:"linear-gradient(135deg,#B71C1C,#F44336)",label:"和果子铺"},
      {gradient:"linear-gradient(135deg,#1B5E20,#66BB6A)",label:"新鲜渍物"},
    ]
  },
  "岚山竹林": {
    emoji:"🎋", mood:"清幽 · 治愈 · 空灵",
    desc:"高耸入云的竹林走道，竹叶轻轻摇曳，风声如天籁。清晨独自走在其中，整个世界都安静了。",
    vibes:["竹影婆娑","风声入耳","清凉幽静","纯粹自然"],
    images:[
      {gradient:"linear-gradient(135deg,#1B5E20,#66BB6A,#C8E6C9)",label:"竹林深处"},
      {gradient:"linear-gradient(135deg,#2E7D32,#A5D6A7)",label:"光影斑驳"},
      {gradient:"linear-gradient(135deg,#004D40,#4DB6AC)",label:"晨雾竹道"},
    ]
  },
  "渡月桥": {
    emoji:"🌉", mood:"开阔 · 诗意 · 经典",
    desc:"桂川河畔的经典风景线，远山如黛，流水潺潺。秋天红叶映衬下的渡月桥是京都最经典的画面。",
    vibes:["河畔风光","远山如黛","红叶季","经典京都"],
    images:[
      {gradient:"linear-gradient(135deg,#0D47A1,#42A5F5,#BBDEFB)",label:"桂川河景"},
      {gradient:"linear-gradient(135deg,#BF360C,#E64A19,#FFAB91)",label:"秋日红叶"},
      {gradient:"linear-gradient(135deg,#1A237E,#5C6BC0)",label:"远山轮廓"},
    ]
  },
  "先斗町": {
    emoji:"🍶", mood:"浪漫 · 微醺 · 河畔",
    desc:"�的河畔居酒屋一字排开，夏天的纳凉床几乎伸到水面上。怀石料理配一壶清酒，京都夜晚的正确打开方式。",
    vibes:["河畔夜景","居酒屋文化","怀石料理","微醺之夜"],
    images:[
      {gradient:"linear-gradient(135deg,#1A1A2E,#16213E,#0F3460)",label:"河畔灯火"},
      {gradient:"linear-gradient(135deg,#4A148C,#7B1FA2)",label:"纳凉床席"},
      {gradient:"linear-gradient(135deg,#BF360C,#D84315)",label:"怀石摆盘"},
    ]
  },
  "% Arabica": {
    emoji:"☕", mood:"极简 · 世界级 · 清晨",
    desc:"京都东山脚下的世界顶级咖啡馆，极简白色空间配上窗外的八坂塔，一杯手冲开启完美的一天。",
    vibes:["极简设计","顶级手冲","晨间时光","网红打卡"],
    images:[
      {gradient:"linear-gradient(135deg,#ECEFF1,#CFD8DC,#B0BEC5)",label:"极简空间"},
      {gradient:"linear-gradient(135deg,#3E2723,#5D4037,#8D6E63)",label:"手冲咖啡"},
      {gradient:"linear-gradient(135deg,#37474F,#546E7A)",label:"八坂塔远景"},
    ]
  },
  "二条城": {
    emoji:"🏛️", mood:"恢宏 · 权力 · 历史",
    desc:"德川幕府在京都的权力象征，踏上会发出黄莺声的地板，仿佛能听到400年前的回响。",
    vibes:["幕府遗风","莺声地板","庭园之美","历史震撼"],
    images:[
      {gradient:"linear-gradient(135deg,#4E342E,#795548,#A1887F)",label:"二之丸御殿"},
      {gradient:"linear-gradient(135deg,#1B5E20,#388E3C)",label:"本丸庭园"},
      {gradient:"linear-gradient(135deg,#F9A825,#FDD835)",label:"金色障壁画"},
    ]
  },
};

/* ========== 社交刷新点 Mock Data ========== */
const refreshPointMatches = {
  2: { // Day 2 has a match
    matchId: "rp001",
    similarity: 0.82,
    matchedDay: 2,
    status: "discovered", // discovered → invited → matched
    traveler: {
      nickname: "山风旅人",
      avatar: "🧑‍🎨",
      prefTags: ["文化浸润", "寺庙", "摄影"],
      theme: "古镇漫游",
    },
    sharedPosts: [
      { id: "p1", author: "山风旅人", avatar: "🧑‍🎨", text: "金阁寺的倒影比想象中更震撼，早上7点几乎没人！", time: "2小时前", emoji: "📸", likes: 3, images: [{gradient:"linear-gradient(135deg,#F57F17,#FFD54F)",label:"金阁晨光"}] },
      { id: "p2", author: "山风旅人", avatar: "🧑‍🎨", text: "偏离了原行程，发现了一家隐藏的抹茶店「茶寮都路里」，强烈推荐！", time: "1小时前", emoji: "🍵", likes: 5, isOffRoute: true, images: [{gradient:"linear-gradient(135deg,#1B5E20,#66BB6A)",label:"隐藏抹茶店"}] },
    ],
    itineraryDiff: {
      yours: ["金阁寺", "龙安寺枯山水", "锦市场"],
      theirs: ["金阁寺", "茶寮都路里", "北野天满宫", "锦市场"],
      unique: ["茶寮都路里", "北野天满宫"],
    }
  }
};

/* ========== 行程结果数据（多目的地） ========== */
const allResults = {
  "京都": {
    destination:{name:"京都",region:"日韩",tags:["文艺","古迹","美食","摄影"],rating:4.8},
    matchScore:92,cost:"¥4,500",duration:"4天3夜",
    itinerary:[
      {day:1,title:"古韵初探",acts:[
        {time:"上午",name:"伏见稻荷大社",desc:"穿越千本鸟居的朱红世界",booking:"trip.com",price:"免费"},
        {time:"下午",name:"清水寺",desc:"俯瞰古都全景的千年古刹",booking:"trip.com",price:"¥25"},
        {time:"晚上",name:"花见小路",desc:"祗园石板路上邂逅传统京都",booking:null,price:null},
      ]},
      {day:2,title:"茶道与庭园",acts:[
        {time:"上午",name:"金阁寺",desc:"镜湖池中的金色倒影",booking:"trip.com",price:"¥25"},
        {time:"下午",name:"龙安寺枯山水",desc:"在石庭前感受禅意",booking:null,price:"¥30"},
        {time:"晚上",name:"锦市场",desc:"京都的厨房，地道小吃天堂",booking:null,price:null},
      ]},
      {day:3,title:"岚山秘境",acts:[
        {time:"上午",name:"岚山竹林",desc:"翠竹之间聆听风的旋律",booking:null,price:"免费"},
        {time:"下午",name:"渡月桥",desc:"桂川河畔的经典风景线",booking:null,price:"免费"},
        {time:"晚上",name:"先斗町",desc:"河畔居酒屋的怀石料理之夜",booking:"tabelog",price:"¥300-500"},
      ]},
      {day:4,title:"咖啡与告别",acts:[
        {time:"上午",name:"% Arabica",desc:"世界顶级咖啡馆的晨间时光",booking:null,price:"¥30-50"},
        {time:"下午",name:"二条城",desc:"感受德川幕府的恢宏气度",booking:"trip.com",price:"¥40"},
      ]},
    ],
    safety:{overall:82,grade:"B",dims:{S1:{score:90,label:"治安环境"},S2:{score:68,label:"自然灾害"},S3:{score:92,label:"医疗保障"},S4:{score:80,label:"交通安全"},S5:{score:88,label:"饮食健康"},S6:{score:85,label:"文化法律"}},alerts:[{level:"caution",title:"6-9月为台风季",reason:"",prevention:"关注天气预报，购买含自然灾害的旅行保险",dim:"S2"},{level:"info",title:"寺院参拜礼仪",reason:"",prevention:"穿方便穿脱的鞋子，尊重当地宗教习俗",dim:"S6"}],checklist:["购买旅行保险（含医疗+自然灾害）","确认护照有效期≥6个月","下载Google Maps离线地图","备份护照和签证电子版","了解紧急求助电话：110(警察)/119(救护)"]},
    hotels:[
      {name:"京都四条三井花园酒店",stars:4,price:"¥580/晚",dist:"距清水寺步行15分钟",gradient:"linear-gradient(135deg,#5D4037,#8D6E63)",tag:"热门"},
      {name:"京都岚山翠嵐豪华酒店",stars:5,price:"¥1,800/晚",dist:"岚山竹林旁",gradient:"linear-gradient(135deg,#1B5E20,#4CAF50)",tag:"奢华"},
      {name:"胶囊旅馆 Nine Hours",stars:3,price:"¥180/晚",dist:"京都站步行5分钟",gradient:"linear-gradient(135deg,#37474F,#78909C)",tag:"背包客"},
    ],
    tickets:[
      {name:"京都巴士一日券",price:"¥40",type:"交通",desc:"无限次乘坐市内巴士"},
      {name:"清水寺+金阁寺联票",price:"¥45",type:"景点",desc:"两大名寺套票优惠"},
      {name:"岚山小火车预约",price:"¥50",type:"体验",desc:"嵯峨野观光列车席位"},
      {name:"和服体验半日租",price:"¥200",type:"体验",desc:"含发型设计+配饰"},
    ],
  },
  "巴厘岛": {
    destination:{name:"巴厘岛",region:"东南亚",tags:["海岛","度假","冲浪","瑜伽"],rating:4.7},
    matchScore:95,cost:"¥3,800",duration:"5天4夜",
    itinerary:[
      {day:1,title:"乌布艺术之心",acts:[
        {time:"上午",name:"乌布皇宫",desc:"巴厘岛文化的起源地",booking:"klook",price:"免费"},
        {time:"下午",name:"德格拉朗梯田",desc:"层叠翠绿的稻田如同大地的阶梯",booking:"klook",price:"¥15"},
        {time:"晚上",name:"乌布传统舞蹈",desc:"在皇宫广场观赏凯恰克火舞",booking:"klook",price:"¥50"},
      ]},
      {day:2,title:"瀑布与丛林",acts:[
        {time:"上午",name:"圣泉寺",desc:"千年涌泉中的净化仪式",booking:"klook",price:"¥10"},
        {time:"下午",name:"秋千森林",desc:"在热带丛林上空荡秋千",booking:"klook",price:"¥120"},
        {time:"晚上",name:"乌布有机餐厅",desc:"稻田景观中的健康晚餐",booking:null,price:"¥80-150"},
      ]},
      {day:3,title:"海神庙与日落",acts:[
        {time:"上午",name:"海神庙",desc:"矗立海岩上的千年神庙",booking:null,price:"¥20"},
        {time:"下午",name:"库塔海滩冲浪",desc:"初学者的完美浪点",booking:"klook",price:"¥150"},
        {time:"晚上",name:"金巴兰海滩",desc:"脚踩细沙看印度洋最美日落",booking:null,price:null},
      ]},
      {day:4,title:"努沙佩尼达跳岛",acts:[
        {time:"上午",name:"精灵坠崖",desc:"INS上最震撼的悬崖海景",booking:"klook",price:"¥200"},
        {time:"下午",name:"破碎海滩",desc:"天然拱形岩石与翡翠色海水",booking:null,price:"含在跳岛费中"},
        {time:"晚上",name:"水明漾晚餐",desc:"巴厘岛最时尚的餐饮区",booking:null,price:"¥100-200"},
      ]},
      {day:5,title:"SPA与告别",acts:[
        {time:"上午",name:"巴厘岛SPA",desc:"花瓣浴+精油按摩的极致放松",booking:"klook",price:"¥180"},
        {time:"下午",name:"乌鲁瓦图断崖",desc:"印度洋尽头的壮观悬崖",booking:null,price:"¥20"},
      ]},
    ],
    safety:{overall:76,grade:"B",dims:{S1:{score:72,label:"治安环境"},S2:{score:65,label:"自然灾害"},S3:{score:68,label:"医疗保障"},S4:{score:70,label:"交通安全"},S5:{score:82,label:"饮食健康"},S6:{score:90,label:"文化法律"}},alerts:[{level:"caution",title:"摩托车交通风险",reason:"",prevention:"租车需有国际驾照，建议包车出行",dim:"S4"},{level:"info",title:"宗教礼仪",reason:"",prevention:"进入寺庙需穿纱笼，经期女性禁止入内",dim:"S6"}],checklist:["购买旅行保险","确认护照有效期≥6个月","准备防蚊液和防晒霜","下载Grab打车APP","兑换少量印尼盾现金"]},
    hotels:[
      {name:"乌布空中花园度假村",stars:5,price:"¥680/晚",dist:"俯瞰德格拉朗梯田",gradient:"linear-gradient(135deg,#1B5E20,#66BB6A)",tag:"网红"},
      {name:"水明漾W酒店",stars:5,price:"¥1,200/晚",dist:"距库塔海滩5分钟",gradient:"linear-gradient(135deg,#0D47A1,#42A5F5)",tag:"奢华"},
      {name:"乌布青旅 Puri Garden",stars:3,price:"¥80/晚",dist:"乌布市场步行3分钟",gradient:"linear-gradient(135deg,#F57F17,#FFCA28)",tag:"背包客"},
    ],
    tickets:[
      {name:"努沙佩尼达跳岛一日游",price:"¥200",type:"体验",desc:"含快艇+午餐+导游"},
      {name:"乌布丛林秋千套票",price:"¥120",type:"体验",desc:"含秋千+下午茶"},
      {name:"库塔冲浪入门课",price:"¥150",type:"体验",desc:"2小时教练一对一"},
      {name:"传统巴厘SPA",price:"¥180",type:"体验",desc:"2小时花瓣浴+精油按摩"},
    ],
  },
  "巴黎": {
    destination:{name:"巴黎",region:"欧洲",tags:["浪漫","艺术","美食","建筑"],rating:4.9},
    matchScore:88,cost:"¥8,500",duration:"6天5夜",
    itinerary:[
      {day:1,title:"巴黎初印象",acts:[
        {time:"上午",name:"埃菲尔铁塔",desc:"登顶俯瞰整个巴黎的天际线",booking:"trip.com",price:"¥180"},
        {time:"下午",name:"塞纳河游船",desc:"从水上看巴黎最美的两岸风景",booking:"trip.com",price:"¥100"},
        {time:"晚上",name:"香榭丽舍大街",desc:"世界最美大道的华灯初上",booking:null,price:null},
      ]},
      {day:2,title:"卢浮宫深度日",acts:[
        {time:"上午",name:"卢浮宫",desc:"与蒙娜丽莎的一期一会",booking:"trip.com",price:"¥120"},
        {time:"下午",name:"杜乐丽花园",desc:"卢浮宫旁的皇家花园漫步",booking:null,price:"免费"},
        {time:"晚上",name:"玛黑区晚餐",desc:"巴黎最有活力的街区觅食",booking:null,price:"¥150-300"},
      ]},
      {day:3,title:"蒙马特与艺术",acts:[
        {time:"上午",name:"圣心大教堂",desc:"蒙马特高地的白色地标",booking:null,price:"免费"},
        {time:"下午",name:"小丘广场",desc:"街头画家的露天艺术沙龙",booking:null,price:null},
        {time:"晚上",name:"红磨坊",desc:"百年歌舞秀的视觉盛宴",booking:"trip.com",price:"¥600"},
      ]},
      {day:4,title:"凡尔赛宫殿",acts:[
        {time:"上午",name:"凡尔赛宫",desc:"太阳王的极致奢华",booking:"trip.com",price:"¥150"},
        {time:"下午",name:"凡尔赛花园",desc:"法式几何庭园的登峰造极",booking:null,price:"含在宫殿门票内"},
        {time:"晚上",name:"左岸咖啡馆",desc:"花神咖啡馆的文学夜晚",booking:null,price:"¥50-100"},
      ]},
      {day:5,title:"甜品与购物",acts:[
        {time:"上午",name:"奥赛博物馆",desc:"印象派画作的殿堂",booking:"trip.com",price:"¥100"},
        {time:"下午",name:"拉法叶百货",desc:"穹顶下的购物天堂",booking:null,price:null},
        {time:"晚上",name:"铁塔灯光秀",desc:"整点闪烁的浪漫时刻",booking:null,price:"免费"},
      ]},
      {day:6,title:"告别巴黎",acts:[
        {time:"上午",name:"莎士比亚书店",desc:"塞纳河畔百年独立书店",booking:null,price:"免费"},
        {time:"下午",name:"巴黎圣母院",desc:"雨果笔下的哥特杰作（外观）",booking:null,price:"免费"},
      ]},
    ],
    safety:{overall:78,grade:"B",dims:{S1:{score:65,label:"治安环境"},S2:{score:88,label:"自然灾害"},S3:{score:90,label:"医疗保障"},S4:{score:82,label:"交通安全"},S5:{score:85,label:"饮食健康"},S6:{score:80,label:"文化法律"}},alerts:[{level:"caution",title:"注意扒手",reason:"",prevention:"地铁和景区高发，贵重物品贴身携带",dim:"S1"},{level:"info",title:"罢工文化",reason:"",prevention:"出行前查看交通罢工信息",dim:"S4"}],checklist:["购买申根旅行保险","确认申根签证有效","下载巴黎地铁APP","随身携带护照复印件","学几句基础法语"]},
    hotels:[
      {name:"巴黎玛黑区精品酒店",stars:4,price:"¥900/晚",dist:"距卢浮宫步行20分钟",gradient:"linear-gradient(135deg,#1A237E,#5C6BC0)",tag:"位置佳"},
      {name:"铁塔景观套房",stars:5,price:"¥2,500/晚",dist:"窗外直面埃菲尔铁塔",gradient:"linear-gradient(135deg,#4A148C,#7B1FA2)",tag:"奢华"},
      {name:"蒙马特青年旅舍",stars:3,price:"¥250/晚",dist:"圣心大教堂步行5分钟",gradient:"linear-gradient(135deg,#BF360C,#E64A19)",tag:"背包客"},
    ],
    tickets:[
      {name:"巴黎博物馆通票(4天)",price:"¥480",type:"景点",desc:"60+博物馆无限进入"},
      {name:"塞纳河晚餐游船",price:"¥350",type:"体验",desc:"含法式三道菜+红酒"},
      {name:"凡尔赛宫免排队",price:"¥180",type:"景点",desc:"含语音导览+花园"},
      {name:"巴黎地铁周票",price:"¥160",type:"交通",desc:"全区域无限乘坐"},
    ],
  },
  "成都": {
    destination:{name:"成都",region:"国内",tags:["美食","熊猫","休闲","文化"],rating:4.6},
    matchScore:90,cost:"¥2,200",duration:"3天2夜",
    itinerary:[
      {day:1,title:"熊猫与古巷",acts:[
        {time:"上午",name:"大熊猫繁育基地",desc:"看国宝们卖萌翻滚的日常",booking:"携程",price:"¥55"},
        {time:"下午",name:"宽窄巷子",desc:"老成都生活的缩影",booking:null,price:"免费"},
        {time:"晚上",name:"小龙坎火锅",desc:"九宫格红油锅底的正宗成都味",booking:null,price:"¥80-120"},
      ]},
      {day:2,title:"历史与烟火",acts:[
        {time:"上午",name:"武侯祠",desc:"三国文化的圣地",booking:"携程",price:"¥50"},
        {time:"下午",name:"锦里古街",desc:"成都版清明上河图",booking:null,price:"免费"},
        {time:"晚上",name:"九眼桥酒吧街",desc:"府南河畔的夜生活",booking:null,price:null},
      ]},
      {day:3,title:"茶馆与告别",acts:[
        {time:"上午",name:"人民公园鹤鸣茶社",desc:"盖碗茶里泡一个成都上午",booking:null,price:"¥15-30"},
        {time:"下午",name:"春熙路太古里",desc:"传统与潮流的完美碰撞",booking:null,price:null},
      ]},
    ],
    safety:{overall:91,grade:"A",dims:{S1:{score:92,label:"治安环境"},S2:{score:82,label:"自然灾害"},S3:{score:90,label:"医疗保障"},S4:{score:88,label:"交通安全"},S5:{score:95,label:"饮食健康"},S6:{score:96,label:"文化法律"}},alerts:[{level:"info",title:"辣度提醒",reason:"",prevention:"点餐时可要求微辣或鸳鸯锅",dim:"S5"}],checklist:["下载高德地图","准备肠胃药以防水土不服","提前预约大熊猫基地门票","准备舒适步行鞋"]},
    hotels:[
      {name:"太古里博舍酒店",stars:5,price:"¥980/晚",dist:"太古里商圈内",gradient:"linear-gradient(135deg,#BF360C,#E64A19)",tag:"潮流"},
      {name:"宽窄巷子民宿",stars:4,price:"¥320/晚",dist:"宽窄巷子步行2分钟",gradient:"linear-gradient(135deg,#5D4037,#8D6E63)",tag:"特色"},
      {name:"春熙路青年旅舍",stars:3,price:"¥60/晚",dist:"春熙路地铁站旁",gradient:"linear-gradient(135deg,#F57F17,#FFCA28)",tag:"背包客"},
    ],
    tickets:[
      {name:"大熊猫基地门票",price:"¥55",type:"景点",desc:"含电瓶车"},
      {name:"川剧变脸秀门票",price:"¥120",type:"体验",desc:"锦江剧场VIP席"},
      {name:"成都美食半日Tour",price:"¥180",type:"体验",desc:"含6个打卡点+试吃"},
      {name:"都江堰一日游",price:"¥280",type:"景点",desc:"含往返大巴+导游+午餐"},
    ],
  },
};

// 为新目的地追加景点详情
Object.assign(attractionDetails, {
  "乌布皇宫": { emoji:"🏛️", mood:"庄严 · 文化 · 历史", desc:"巴厘岛文化的心脏，每晚在此上演传统舞蹈表演，庭院中的石雕见证了数百年的王朝更迭。", vibes:["皇室遗风","石雕艺术","传统舞蹈","文化中心"], images:[{gradient:"linear-gradient(135deg,#5D4037,#8D6E63)",label:"皇宫庭院"},{gradient:"linear-gradient(135deg,#BF360C,#E64A19)",label:"石雕门廊"},{gradient:"linear-gradient(135deg,#1A1A2E,#E94560)",label:"火舞之夜"}] },
  "德格拉朗梯田": { emoji:"🌾", mood:"壮阔 · 翠绿 · 田园", desc:"层层叠叠的翠绿稻田沿山坡铺展，椰树点缀其间，是巴厘岛最经典的自然画面。清晨薄雾中更如仙境。", vibes:["层叠翠绿","田园诗意","清晨薄雾","椰林剪影"], images:[{gradient:"linear-gradient(135deg,#1B5E20,#4CAF50,#C8E6C9)",label:"梯田全景"},{gradient:"linear-gradient(135deg,#33691E,#689F38)",label:"椰树剪影"},{gradient:"linear-gradient(135deg,#E8F5E9,#A5D6A7)",label:"晨雾稻田"}] },
  "海神庙": { emoji:"⛩️", mood:"神圣 · 壮观 · 海浪", desc:"矗立在海岩之上的千年神庙，涨潮时被海水围绕，日落时分天空被染成火红，是巴厘岛最震撼的画面。", vibes:["海上神庙","日落圣地","潮汐奇观","千年历史"], images:[{gradient:"linear-gradient(135deg,#E65100,#FF9800,#FFE082)",label:"金色日落"},{gradient:"linear-gradient(135deg,#0D47A1,#1565C0)",label:"海浪拍岸"},{gradient:"linear-gradient(135deg,#37474F,#78909C)",label:"神庙剪影"}] },
  "金巴兰海滩": { emoji:"🌅", mood:"浪漫 · 日落 · 海鲜", desc:"细软的金色沙滩上摆满烛光餐桌，一边品尝新鲜海鲜一边看印度洋日落，是巴厘岛最浪漫的体验。", vibes:["日落晚餐","金色沙滩","海鲜盛宴","浪漫至极"], images:[{gradient:"linear-gradient(135deg,#E65100,#FF6F00,#FFD54F)",label:"海滩日落"},{gradient:"linear-gradient(135deg,#BF360C,#F4511E)",label:"烛光晚餐"},{gradient:"linear-gradient(135deg,#0D47A1,#42A5F5)",label:"印度洋"}] },
  "埃菲尔铁塔": { emoji:"🗼", mood:"浪漫 · 经典 · 地标", desc:"324米的铁塔是巴黎的灵魂，登顶时整个城市在脚下铺展，夜晚的灯光秀让整座塔闪烁如钻石。", vibes:["世界地标","夜景璀璨","登顶全景","浪漫象征"], images:[{gradient:"linear-gradient(135deg,#1A237E,#283593,#5C6BC0)",label:"夜色铁塔"},{gradient:"linear-gradient(135deg,#F57F17,#FFD54F)",label:"金色黄昏"},{gradient:"linear-gradient(135deg,#0D47A1,#90CAF9)",label:"蓝天铁塔"}] },
  "卢浮宫": { emoji:"🎨", mood:"辉煌 · 艺术 · 震撼", desc:"世界最大的博物馆，从蒙娜丽莎到胜利女神，每一个转角都是人类文明的巅峰之作。一天远远不够。", vibes:["艺术殿堂","蒙娜丽莎","玻璃金字塔","文明之巅"], images:[{gradient:"linear-gradient(135deg,#4A148C,#7B1FA2,#CE93D8)",label:"玻璃金字塔"},{gradient:"linear-gradient(135deg,#3E2723,#5D4037)",label:"名画长廊"},{gradient:"linear-gradient(135deg,#BF360C,#E64A19)",label:"胜利女神"}] },
  "圣心大教堂": { emoji:"⛪", mood:"庄严 · 开阔 · 白色", desc:"蒙马特山顶的白色教堂，从台阶上俯瞰整个巴黎，这里是艺术家们的灵感发源地。", vibes:["白色穹顶","蒙马特","俯瞰巴黎","艺术圣地"], images:[{gradient:"linear-gradient(135deg,#ECEFF1,#CFD8DC,#B0BEC5)",label:"白色教堂"},{gradient:"linear-gradient(135deg,#1A237E,#5C6BC0)",label:"巴黎全景"},{gradient:"linear-gradient(135deg,#4A148C,#9C27B0)",label:"艺术广场"}] },
  "大熊猫繁育基地": { emoji:"🐼", mood:"可爱 · 治愈 · 自然", desc:"看着圆滚滚的大熊猫在竹林间翻滚打闹，所有的烦恼都会被治愈。清晨去能看到最活泼的它们。", vibes:["国宝卖萌","竹林翻滚","清晨最佳","治愈力满分"], images:[{gradient:"linear-gradient(135deg,#1B5E20,#4CAF50,#C8E6C9)",label:"竹林熊猫"},{gradient:"linear-gradient(135deg,#212121,#616161,#BDBDBD)",label:"国宝特写"},{gradient:"linear-gradient(135deg,#33691E,#7CB342)",label:"幼崽嬉戏"}] },
  "宽窄巷子": { emoji:"🏮", mood:"市井 · 悠闲 · 老成都", desc:"宽巷子怀旧，窄巷子文艺，井巷子市井。三条平行的巷子浓缩了老成都的慢生活。", vibes:["青砖灰瓦","盖碗茶","川剧变脸","市井烟火"], images:[{gradient:"linear-gradient(135deg,#5D4037,#8D6E63,#BCAAA4)",label:"青砖巷道"},{gradient:"linear-gradient(135deg,#BF360C,#E64A19)",label:"红灯笼"},{gradient:"linear-gradient(135deg,#F57F17,#FFCA28)",label:"茶馆闲坐"}] },
  "武侯祠": { emoji:"⚔️", mood:"历史 · 三国 · 庄严", desc:"全球唯一的君臣合祀祠庙，红墙竹影间穿越回三国时代，是三国迷的朝圣地。", vibes:["三国文化","红墙竹影","诸葛亮祠","历史厚重"], images:[{gradient:"linear-gradient(135deg,#B71C1C,#E53935)",label:"红墙竹影"},{gradient:"linear-gradient(135deg,#1B5E20,#2E7D32)",label:"庭园古柏"},{gradient:"linear-gradient(135deg,#4E342E,#795548)",label:"三国殿堂"}] },
});

// 兼容旧引用
const sampleResult = allResults["京都"];

const plazaData = [
  {id:"p1",dest:"巴厘岛",user:"小鱼儿",score:95,region:"东南亚",x:72,y:62,review:"乌布稻田美翻了",resultKey:"巴厘岛"},
  {id:"p2",dest:"京都",user:"旅行者K",score:92,region:"日韩",x:82,y:38,review:"千本鸟居太震撼",resultKey:"京都"},
  {id:"p3",dest:"巴黎",user:"文艺Luna",score:88,region:"欧洲",x:48,y:32,review:"卢浮宫可以待一天",resultKey:"巴黎"},
  {id:"p4",dest:"成都",user:"吃货阿明",score:90,region:"国内",x:68,y:42,review:"火锅串串人生巅峰",resultKey:"成都"},
  {id:"p5",dest:"冰岛",user:"极光猎人",score:96,region:"欧洲",x:44,y:18,review:"极光美到词穷",resultKey:"巴黎"},
  {id:"p6",dest:"清迈",user:"慢生活",score:85,region:"东南亚",x:74,y:52,review:"寺庙和咖啡馆的天堂",resultKey:"巴厘岛"},
  {id:"p7",dest:"纽约",user:"城市客",score:87,region:"北美",x:26,y:35,review:"中央公园的秋天绝了",resultKey:"巴黎"},
  {id:"p8",dest:"大理",user:"风花雪月",score:82,region:"国内",x:66,y:46,review:"洱海边骑行太治愈",resultKey:"成都"},
];
const historyBoxes = [
  {id:"h1",dest:"京都",theme:"文艺打卡",date:"2026-03-20",score:92,fav:true,cards:5},
  {id:"h2",dest:"清迈",theme:"美食之旅",date:"2026-03-10",score:85,fav:false,cards:5},
  {id:"h3",dest:"厦门",theme:"海岛度假",date:"2026-02-28",score:78,fav:true,cards:5},
];

/* ========== SVG Icons ========== */
const Ico = ({name,size=20,color="currentColor"}) => {
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
    globe:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    alert:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    clock:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  };
  return m[name]||null;
};

/* ========== 集卡样式 ========== */
const cardStyles = [
  { type:"constraints", label:"旅行框架卡", bgGrad:"linear-gradient(135deg,#F5D5A0,#E4A853)", icon:"📐", borderColor:"#E4A853" },
  { type:"theme", label:"旅行风格卡", bgGrad:"linear-gradient(135deg,#D4A0E8,#8B6CC1)", icon:"🎨", borderColor:"#8B6CC1" },
  { type:"scene", label:"心愿场景卡", bgGrad:"linear-gradient(135deg,#A0D8E8,#5B8DEF)", icon:"🏖️", borderColor:"#5B8DEF" },
  { type:"region", label:"探索方向卡", bgGrad:"linear-gradient(135deg,#A0E8C4,#3AADA8)", icon:"🗺️", borderColor:"#3AADA8" },
  { type:"taboo", label:"旅行护盾卡", bgGrad:"linear-gradient(135deg,#E8A0A0,#E06B6B)", icon:"🛡️", borderColor:"#E06B6B" },
];

function IllustrationCard({ cardIndex, content, collected, small }) {
  const cs = cardStyles[cardIndex];
  const w = small ? 64 : 140;
  const h = small ? 88 : 190;
  return (
    <div style={{ width:w, height:h, borderRadius:small?10:16, background:collected?cs.bgGrad:"#F0E6DB", border:`2.5px solid ${collected?cs.borderColor:"#D8CFC5"}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", transition:"all 0.5s cubic-bezier(0.34,1.56,0.64,1)", transform:collected?"scale(1)":"scale(0.9)", opacity:collected?1:0.4, boxShadow:collected?"0 4px 16px rgba(0,0,0,0.1)":"none" }}>
      {collected ? (<>
        <div style={{fontSize:small?20:36, marginBottom:small?2:8}}>{cs.icon}</div>
        <div style={{fontSize:small?8:11, fontWeight:700, color:"#fff", textShadow:"0 1px 2px rgba(0,0,0,0.2)", textAlign:"center", padding:"0 4px"}}>{cs.label}</div>
        {!small && content && <div style={{fontSize:9, color:"rgba(255,255,255,0.85)", marginTop:4, textAlign:"center", padding:"0 8px", lineHeight:1.3}}>{content}</div>}
      </>) : (<>
        <div style={{fontSize:small?16:28, opacity:0.3}}>❓</div>
        <div style={{fontSize:small?7:10, color:"#A89F99", marginTop:4}}>{cs.label}</div>
      </>)}
      {collected && <div style={{position:"absolute",top:-12,right:-12,width:small?24:40,height:small?24:40,borderRadius:"50%",background:"rgba(255,255,255,0.15)"}}/>}
    </div>
  );
}

/* ========== 沉浸式插画弹窗 ========== */
function ImmersiveOverlay({ data, onClose }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    const t = setTimeout(() => { setShow(false); setTimeout(onClose, 400); }, 2200);
    return () => clearTimeout(t);
  }, []);
  if (!data) return null;
  return (
    <div onClick={() => { setShow(false); setTimeout(onClose, 400); }} style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"opacity .4s",opacity:show?1:0}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(12px)"}}/>
      <div style={{position:"relative",width:"90%",maxWidth:480,textAlign:"center",transform:show?"scale(1) translateY(0)":"scale(0.85) translateY(30px)",transition:"transform .5s cubic-bezier(0.34,1.56,0.64,1)",zIndex:1}}>
        <div style={{width:180,height:180,borderRadius:"50%",background:data.gradient,margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 12px 60px rgba(0,0,0,0.3)",border:"4px solid rgba(255,255,255,0.2)"}}>
          <span style={{fontSize:72}}>{data.emoji}</span>
        </div>
        <h2 style={{fontSize:32,fontWeight:900,color:"#fff",marginBottom:8,textShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>{data.title}</h2>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.85)",marginBottom:20,lineHeight:1.6,maxWidth:360,margin:"0 auto 20px"}}>{data.desc}</p>
        <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
          {data.vibes.map(v => (
            <span key={v} style={{padding:"5px 14px",background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:13,borderRadius:C.radiusFull,backdropFilter:"blur(4px)",border:"1px solid rgba(255,255,255,0.1)"}}>{v}</span>
          ))}
        </div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:24}}>点击任意位置继续</p>
      </div>
    </div>
  );
}

/* ========== 景点详情弹窗 ========== */
function AttractionModal({ name, onClose }) {
  const detail = attractionDetails[name];
  if (!detail) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:250,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(45,41,38,0.5)",backdropFilter:"blur(8px)"}}/>
      <div style={{position:"relative",width:"92%",maxWidth:500,maxHeight:"85vh",overflow:"auto",background:C.surface,borderRadius:C.radiusXl,boxShadow:C.shadowModal,animation:"slideUp .35s ease-out"}}>
        {/* Header gradient */}
        <div style={{height:140,background:detail.images[0]?.gradient || "linear-gradient(135deg,#E8734A,#E06B6B)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <span style={{fontSize:56}}>{detail.emoji}</span>
          <div style={{position:"absolute",bottom:12,left:0,right:0,textAlign:"center"}}>
            <span style={{padding:"4px 14px",background:"rgba(0,0,0,0.25)",color:"#fff",fontSize:12,borderRadius:C.radiusFull,backdropFilter:"blur(4px)"}}>{detail.mood}</span>
          </div>
        </div>
        {/* Content */}
        <div style={{padding:"24px"}}>
          <h3 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:12}}>{name}</h3>
          <p style={{fontSize:14,color:C.textSec,lineHeight:1.7,marginBottom:20}}>{detail.desc}</p>
          {/* Vibe chips */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
            {detail.vibes.map(v => (
              <span key={v} style={{padding:"5px 14px",background:C.bg,color:C.textSec,fontSize:12,fontWeight:600,borderRadius:C.radiusFull,border:`1px solid ${C.border}`}}>{v}</span>
            ))}
          </div>
          {/* Image placeholders */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {detail.images.map((img,i) => (
              <div key={i} style={{aspectRatio:"3/4",borderRadius:C.radiusSm,background:img.gradient,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"10px 6px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.4) 100%)"}}/>
                <span style={{position:"relative",fontSize:11,fontWeight:600,color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,0.3)"}}>{img.label}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onClose} style={{position:"absolute",top:12,right:12,width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.85)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}><Ico name="x" size={16} color={C.textMuted}/></button>
      </div>
    </div>
  );
}

/* ========== Auth Modal ========== */
function AuthModal({open,onClose,onLogin}) {
  const [phone,setPhone]=useState("");
  const [code,setCode]=useState("");
  const [agreed,setAgreed]=useState(false);
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(45,41,38,0.4)",backdropFilter:"blur(6px)"}}/>
      <div style={{position:"relative",background:C.surface,borderRadius:C.radiusXl,width:"100%",maxWidth:400,margin:"0 16px",boxShadow:C.shadowModal,animation:"slideUp .3s ease-out",overflow:"hidden"}}>
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

/* ========== Navbar ========== */
function Navbar({page,setPage,isLoggedIn,onLoginClick}) {
  return (
    <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,248,240,0.95)",backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.borderLight}`,padding:"0 24px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
        <div onClick={()=>setPage({name:"home"})} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <div style={{width:34,height:34,borderRadius:10,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico name="plane" size={17} color="#fff"/></div>
          <span style={{fontSize:17,fontWeight:800,color:C.text}}>Trip <span style={{color:C.primary}}>Open</span></span>
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

/* ========== P001 HomePage ========== */
function HomePage({setPage,isLoggedIn,onLoginClick}) {
  const [hoveredPin,setHoveredPin]=useState(null);
  return (
    <div style={{background:C.bg}}>
      <section style={{position:"relative",minHeight:"70vh",background:`linear-gradient(180deg,${C.bg} 0%,#FEF0E0 50%,#E8DDD4 100%)`,overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px 60px"}}>
        <div style={{position:"absolute",top:40,left:"8%",width:60,height:60,borderRadius:12,background:"rgba(232,115,74,0.08)",transform:"rotate(15deg)"}}/>
        <div style={{position:"absolute",top:120,right:"10%",width:40,height:40,borderRadius:"50%",background:"rgba(91,141,239,0.08)"}}/>
        <h1 style={{fontSize:40,fontWeight:900,color:C.text,textAlign:"center",lineHeight:1.2,marginBottom:8}}>
          旅行不用选<br/><span style={{color:C.primary}}>开个盲盒就出发</span>
        </h1>
        <p style={{fontSize:16,color:C.textSec,marginBottom:40,textAlign:"center"}}>点击地图上的盲盒，探索你的下一段旅程</p>
        {/* SVG 世界地图 */}
        <div style={{position:"relative",width:"100%",maxWidth:800,aspectRatio:"2/1",background:"linear-gradient(180deg,#E8F0DF,#D4DFC8)",borderRadius:C.radiusXl,overflow:"hidden",border:`2px solid ${C.border}`,boxShadow:C.shadow}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#C5DAE8,#B0CBE0,#A0BDD6)"}}/>
          <svg viewBox="0 0 200 100" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
            <path d="M35 25 Q42 20 55 22 Q60 25 58 35 Q55 42 48 40 Q40 38 35 30Z" fill="#D4C4A8" opacity="0.6"/>
            <path d="M15 30 Q22 25 30 28 Q32 35 28 42 Q20 45 15 38Z" fill="#C8B898" opacity="0.6"/>
            <path d="M40 28 Q55 24 65 30 Q68 38 60 45 Q50 48 42 42 Q38 35 40 28Z" fill="#D4C4A8" opacity="0.6"/>
            <path d="M55 45 Q62 40 70 42 Q72 50 65 55 Q58 52 55 45Z" fill="#D0BC9E" opacity="0.5"/>
            <path d="M62 30 Q72 25 85 28 Q88 35 86 42 Q80 48 72 45 Q65 40 62 30Z" fill="#D4C4A8" opacity="0.6"/>
          </svg>
          {plazaData.map(p=>(
            <div key={p.id} onMouseEnter={()=>setHoveredPin(p.id)} onMouseLeave={()=>setHoveredPin(null)} onClick={()=>isLoggedIn?setPage({name:"result"}):onLoginClick()}
              style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:hoveredPin===p.id?10:1}}>
              <div style={{width:hoveredPin===p.id?40:32,height:hoveredPin===p.id?40:32,borderRadius:"50%",background:regionColors[p.region]?.gradient||C.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:hoveredPin===p.id?"0 4px 20px rgba(0,0,0,0.2)":"0 2px 8px rgba(0,0,0,0.1)",transition:"all .3s",animation:"float 3s ease-in-out infinite"}}>
                <span style={{fontSize:hoveredPin===p.id?18:14}}>{regionColors[p.region]?.emoji||"🎁"}</span>
              </div>
              {hoveredPin===p.id && (
                <div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",background:C.surface,borderRadius:C.radiusSm,padding:"10px 14px",boxShadow:C.shadowHover,whiteSpace:"nowrap",animation:"fadeIn .2s ease-out"}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.text}}>{p.dest}</div>
                  <div style={{fontSize:11,color:C.textMuted}}>{p.user} · 匹配{p.score}%</div>
                  <div style={{position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:8,height:8,background:C.surface}}/>
                </div>
              )}
            </div>
          ))}
          <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)"}}>
            <div style={{background:"rgba(255,255,255,0.6)",backdropFilter:"blur(8px)",borderRadius:C.radiusFull,padding:"4px 12px",fontSize:12,color:C.textSec}}>
              <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:"#4CAF7D",marginRight:6,animation:"pulse 2s infinite"}}/>{plazaData.length} 人正在探索
            </div>
          </div>
        </div>
        <button onClick={()=>isLoggedIn?setPage({name:"blindbox"}):onLoginClick()} style={{marginTop:36,padding:"16px 44px",background:C.primary,color:"#fff",fontSize:17,fontWeight:800,borderRadius:C.radiusFull,border:"none",cursor:"pointer",boxShadow:"0 6px 24px rgba(232,115,74,0.35)",display:"flex",alignItems:"center",gap:10}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
          <span style={{fontSize:22}}>🎁</span> 开启我的旅行盲盒
        </button>
      </section>
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

/* ========== 社交刷新点组件 ========== */
function RefreshPointBubble({ dayIndex, onClick }) {
  const match = refreshPointMatches[dayIndex];
  if (!match) return null;
  return (
    <div onClick={(e) => { e.stopPropagation(); onClick(match); }}
      style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",
        background:"linear-gradient(135deg,#667EEA,#764BA2)",borderRadius:C.radiusFull,
        cursor:"pointer",animation:"float 3s ease-in-out infinite",marginLeft:8,flexShrink:0}}>
      <span style={{fontSize:13}}>✨</span>
      <span style={{fontSize:11,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>刷新点</span>
    </div>
  );
}

function RefreshPointModal({ match, onClose }) {
  const [phase, setPhase] = useState(match.status === "matched" ? 2 : 0);
  // phase 0 = discovery, 1 = consent, 2 = shared space
  const [liked, setLiked] = useState({});
  const [myPost, setMyPost] = useState("");
  const [posts, setPosts] = useState(match.sharedPosts || []);

  const handleConsent = () => setPhase(2);

  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",width:"90%",maxWidth:480,maxHeight:"85vh",overflow:"auto",
        background:C.surface,borderRadius:C.radiusXl,boxShadow:C.shadowModal}}>

        {/* Header gradient */}
        <div style={{background:"linear-gradient(135deg,#667EEA,#764BA2)",padding:"28px 24px 20px",borderRadius:`${C.radiusXl} ${C.radiusXl} 0 0`,position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ico name="close" size={14} color="#fff"/>
          </button>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:8}}>✨</div>
            <h2 style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>旅途刷新点</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>
              {phase < 2 ? "有人和你选了相似的行程" : `你和「${match.traveler.nickname}」正在同一座城市旅行`}
            </p>
          </div>
        </div>

        <div style={{padding:"20px 24px 28px"}}>

          {/* Phase 0: Discovery */}
          {phase === 0 && (
            <div style={{animation:"fadeIn .5s ease-out"}}>
              <div style={{background:C.bg,borderRadius:C.radius,padding:"20px",marginBottom:16,textAlign:"center"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#667EEA,#764BA2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28}}>?</div>
                <p style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>一位旅伴也在探索这座城市</p>
                <p style={{fontSize:12,color:C.textMuted}}>
                  行程相似度 <span style={{color:"#667EEA",fontWeight:700}}>{Math.round(match.similarity*100)}%</span> · 今天在同一个区域
                </p>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:20}}>
                {match.traveler.prefTags.map(t=>(
                  <span key={t} style={{padding:"4px 12px",background:"#F0EBFF",color:"#764BA2",fontSize:11,fontWeight:600,borderRadius:C.radiusFull}}>{t}</span>
                ))}
              </div>
              <div style={{background:"#FFF3E0",borderRadius:C.radiusSm,padding:"12px 16px",marginBottom:20,display:"flex",gap:10}}>
                <Ico name="shield" size={16} color="#E65100"/>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#E65100"}}>隐私保护</div>
                  <div style={{fontSize:11,color:"#BF360C"}}>对方无法看到你的任何信息，除非你也同意打招呼</div>
                </div>
              </div>
              <button onClick={()=>setPhase(1)} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#667EEA,#764BA2)",color:"#fff",fontSize:15,fontWeight:700,borderRadius:C.radiusFull,border:"none",cursor:"pointer",boxShadow:"0 4px 16px rgba(102,126,234,0.3)"}}>
                我愿意打个招呼 👋
              </button>
              <button onClick={onClose} style={{width:"100%",padding:"12px",background:"transparent",color:C.textMuted,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",marginTop:8}}>
                暂时不了
              </button>
            </div>
          )}

          {/* Phase 1: Waiting for mutual consent */}
          {phase === 1 && (
            <div style={{animation:"fadeIn .5s ease-out",textAlign:"center"}}>
              <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#667EEA22,#764BA222)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",animation:"pulse 2s ease-in-out infinite"}}>
                <span style={{fontSize:36}}>🤝</span>
              </div>
              <h3 style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:6}}>等待对方回应...</h3>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:20}}>你已表示愿意打招呼，正在等待对方同意</p>
              <div style={{background:C.bg,borderRadius:C.radiusSm,padding:"14px",marginBottom:20}}>
                <p style={{fontSize:12,color:C.textSec}}>对方同意后，你们将可以互相看到昵称和旅行偏好</p>
              </div>
              {/* Demo: auto-match for prototype */}
              <button onClick={handleConsent} style={{width:"100%",padding:"14px",background:C.primary,color:"#fff",fontSize:14,fontWeight:700,borderRadius:C.radiusFull,border:"none",cursor:"pointer"}}>
                ✨ 对方也同意了！（演示）
              </button>
            </div>
          )}

          {/* Phase 2: Matched - Shared Space */}
          {phase === 2 && (
            <div style={{animation:"fadeIn .5s ease-out"}}>
              {/* Matched traveler card */}
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px",background:"linear-gradient(135deg,#F0EBFF,#E8F4FD)",borderRadius:C.radius,marginBottom:16}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#667EEA,#764BA2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
                  {match.traveler.avatar}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:C.text}}>{match.traveler.nickname}</div>
                  <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
                    {match.traveler.prefTags.map(t=>(
                      <span key={t} style={{padding:"2px 8px",background:"rgba(102,126,234,0.15)",color:"#667EEA",fontSize:10,fontWeight:600,borderRadius:C.radiusFull}}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:20,fontWeight:800,color:"#667EEA"}}>{Math.round(match.similarity*100)}%</div>
                  <div style={{fontSize:10,color:C.textMuted}}>相似度</div>
                </div>
              </div>

              {/* Itinerary diff */}
              {match.itineraryDiff && (
                <div style={{background:C.bg,borderRadius:C.radiusSm,padding:"14px 16px",marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                    <span>🔄</span>行程对比
                  </div>
                  <div style={{display:"flex",gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:600,color:C.textMuted,marginBottom:6}}>你的行程</div>
                      {match.itineraryDiff.yours.map(p=>(
                        <div key={p} style={{fontSize:12,color:C.text,padding:"3px 0"}}>{p}</div>
                      ))}
                    </div>
                    <div style={{width:1,background:C.border}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:600,color:C.textMuted,marginBottom:6}}>ta的行程</div>
                      {match.itineraryDiff.theirs.map(p=>{
                        const isUnique = match.itineraryDiff.unique.includes(p);
                        return <div key={p} style={{fontSize:12,color:isUnique?"#667EEA":C.text,fontWeight:isUnique?700:400,padding:"3px 0"}}>
                          {isUnique && "✨ "}{p}
                        </div>;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Feed */}
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                <span>💬</span>旅途动态
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
                {posts.map(post=>(
                  <div key={post.id} style={{background:C.bg,borderRadius:C.radiusSm,padding:"14px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#667EEA,#764BA2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{post.avatar}</div>
                      <div style={{flex:1}}>
                        <span style={{fontSize:12,fontWeight:600,color:C.text}}>{post.author}</span>
                        <span style={{fontSize:10,color:C.textMuted,marginLeft:8}}>{post.time}</span>
                      </div>
                      {post.isOffRoute && (
                        <span style={{padding:"2px 8px",background:"#FFF3E0",color:"#E65100",fontSize:10,fontWeight:600,borderRadius:C.radiusFull}}>新发现</span>
                      )}
                    </div>
                    <p style={{fontSize:13,color:C.text,lineHeight:1.5,marginBottom:8}}>{post.emoji} {post.text}</p>
                    {post.images && (
                      <div style={{display:"flex",gap:6,marginBottom:8}}>
                        {post.images.map((img,i)=>(
                          <div key={i} style={{flex:1,height:60,borderRadius:8,background:img.gradient,display:"flex",alignItems:"flex-end",padding:6}}>
                            <span style={{fontSize:9,color:"rgba(255,255,255,0.8)",fontWeight:600}}>{img.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <button onClick={()=>setLiked({...liked,[post.id]:!liked[post.id]})} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:"2px 6px"}}>
                        <Ico name={liked[post.id]?"heartF":"heart"} size={14} color={liked[post.id]?C.coral:C.textMuted}/>
                        <span style={{fontSize:11,color:liked[post.id]?C.coral:C.textMuted}}>{post.likes + (liked[post.id]?1:0)}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Post input */}
              <div style={{background:C.bg,borderRadius:C.radiusSm,padding:"12px",display:"flex",gap:8,alignItems:"flex-end"}}>
                <input value={myPost} onChange={e=>setMyPost(e.target.value)} placeholder="分享你的旅途发现..." style={{flex:1,padding:"10px 14px",borderRadius:C.radiusFull,border:`1px solid ${C.border}`,fontSize:13,outline:"none",background:C.surface}}/>
                <button onClick={()=>{
                  if (!myPost.trim()) return;
                  setPosts([{id:"my"+Date.now(),author:"我",avatar:"🧳",text:myPost,time:"刚刚",emoji:"✈️",likes:0,images:[]}, ...posts]);
                  setMyPost("");
                }} style={{width:36,height:36,borderRadius:"50%",background:myPost.trim()?"linear-gradient(135deg,#667EEA,#764BA2)":"#D8CFC5",border:"none",cursor:myPost.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ico name="share" size={14} color="#fff"/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========== P002 BlindboxPage: 集卡引导 (V2.1 重构) ========== */
function BlindboxPage({setPage}) {
  const [step,setStep]=useState(0);
  const [budget,setBudget]=useState("");
  const [duration,setDuration]=useState("");
  const [selThemes,setSelThemes]=useState([]);
  const [selScenes,setSelScenes]=useState([]);
  const [region,setRegion]=useState("");
  const [taboos,setTaboos]=useState([]);
  const [overlay,setOverlay]=useState(null);
  const toggle=(a,s,v)=>a.includes(v)?s(a.filter(x=>x!==v)):s([...a,v]);

  const steps=["旅行框架","旅行风格","心愿场景","探索方向","旅行护盾"];
  const collected=[!!budget&&!!duration, selThemes.length>0, selScenes.length>0, !!region, true];
  const cardContents=[
    (budget?budgetOptions.find(b=>b.value===budget)?.label:"")+(duration?" · "+durationOptions.find(d=>d.value===duration)?.days:""),
    selThemes.map(t=>themes.find(x=>x.id===t)?.name).join("·"),
    selScenes.map(s=>sceneOptions.find(x=>x.id===s)?.name).join("·"),
    region?regionOpts.find(r=>r.id===region)?.name:"",
    taboos.length>0?taboos.map(t=>tabooOpts.find(x=>x.id===t)?.name).join("·"):"无禁忌",
  ];

  // theme/scene/region selection with overlay
  const handleThemeClick = (id) => {
    const wasSelected = selThemes.includes(id);
    toggle(selThemes,setSelThemes,id);
    if (!wasSelected && themeIllustrations[id]) setOverlay(themeIllustrations[id]);
  };
  const handleSceneClick = (id) => {
    const wasSelected = selScenes.includes(id);
    toggle(selScenes,setSelScenes,id);
    if (!wasSelected && sceneIllustrations[id]) setOverlay(sceneIllustrations[id]);
  };
  const handleRegionClick = (id) => {
    setRegion(id);
    if (regionIllustrations[id]) setOverlay(regionIllustrations[id]);
  };

  return (
    <div style={{minHeight:"85vh",background:`linear-gradient(180deg,${C.bg},${C.bgAlt})`,padding:"28px 24px 40px"}}>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        {/* 集卡进度 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:28}}>
          {[0,1,2,3,4].map(i=>(<IllustrationCard key={i} cardIndex={i} content={cardContents[i]} collected={i<step||(i===step&&collected[i])} small />))}
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

          {/* Step 0: 预算 + 时长 (硬约束) */}
          {step===0&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>设定你的旅行框架</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:6}}>预算和时长是硬约束，AI 推荐的行程<strong style={{color:C.primary}}>绝不会超出</strong></p>
              <div style={{background:C.primaryLight,borderRadius:C.radiusSm,padding:"8px 14px",marginBottom:24,display:"flex",alignItems:"center",gap:8}}>
                <Ico name="info" size={14} color={C.primary}/>
                <span style={{fontSize:12,color:C.primary}}>盲盒的惊喜在于目的地，但钱包和假期绝对可控</span>
              </div>
              {/* Budget */}
              <h3 style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                <span>💰</span>旅行预算
              </h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
                {budgetOptions.map(b=>(
                  <div key={b.value} onClick={()=>setBudget(b.value)} style={{padding:"14px 10px",borderRadius:C.radiusSm,border:`2px solid ${budget===b.value?C.gold:C.border}`,background:budget===b.value?C.goldLight:C.surface,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                    <div style={{fontSize:20,marginBottom:2}}>{b.emoji}</div>
                    <div style={{fontSize:12,fontWeight:600,color:budget===b.value?C.gold:C.text}}>{b.label}</div>
                  </div>
                ))}
              </div>
              {/* Duration */}
              <h3 style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                <Ico name="clock" size={16} color={C.primary}/>旅行时长
              </h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                {durationOptions.map(d=>(
                  <div key={d.value} onClick={()=>setDuration(d.value)} style={{padding:"16px 14px",borderRadius:C.radiusSm,border:`2px solid ${duration===d.value?C.primary:C.border}`,background:duration===d.value?C.primaryLight:C.surface,cursor:"pointer",transition:"all .2s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontSize:20}}>{d.emoji}</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:duration===d.value?C.primary:C.text}}>{d.label}</div>
                        <div style={{fontSize:11,color:C.textMuted}}>{d.days}</div>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: 旅行风格 (带沉浸弹窗) */}
          {step===1&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>你喜欢什么旅行风格？</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:24}}>可多选 · 选择后获得 <strong style={{color:C.purple}}>旅行风格卡</strong></p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {themes.map(t=>{const s=selThemes.includes(t.id);return(
                  <div key={t.id} onClick={()=>handleThemeClick(t.id)} style={{padding:"14px 8px",borderRadius:C.radiusSm,border:`2px solid ${s?C.purple:C.border}`,background:s?C.purpleLight:C.surface,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                    <div style={{fontSize:22,marginBottom:2}}>{t.emoji}</div>
                    <div style={{fontSize:12,fontWeight:600,color:s?C.purple:C.text}}>{t.name}</div>
                  </div>
                );})}
              </div>
            </div>
          )}

          {/* Step 2: 心愿场景 (带沉浸弹窗) */}
          {step===2&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>你心仪的旅行场景？</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:24}}>选择后获得 <strong style={{color:C.accent}}>心愿场景卡</strong></p>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                {sceneOptions.map(sc=>{const s=selScenes.includes(sc.id);return(
                  <button key={sc.id} onClick={()=>handleSceneClick(sc.id)} style={{padding:"10px 18px",borderRadius:C.radiusFull,border:`2px solid ${s?C.accent:C.border}`,background:s?C.accentLight:C.surface,cursor:"pointer",fontSize:13,fontWeight:500,color:s?C.accent:C.textSec,transition:"all .2s",display:"flex",alignItems:"center",gap:6}}>
                    <span>{sc.emoji}</span>{sc.name}
                  </button>
                );})}
              </div>
            </div>
          )}

          {/* Step 3: 探索方向 (带沉浸弹窗) */}
          {step===3&&(
            <div>
              <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>想去哪个区域探索？</h2>
              <p style={{fontSize:13,color:C.textMuted,marginBottom:24}}>选择后获得 <strong style={{color:C.teal}}>探索方向卡</strong></p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {regionOpts.map(r=>(
                  <div key={r.id} onClick={()=>handleRegionClick(r.id)} style={{padding:"18px 12px",borderRadius:C.radiusSm,border:`2px solid ${region===r.id?C.teal:C.border}`,background:region===r.id?C.tealLight:C.surface,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                    <div style={{fontSize:24,marginBottom:4}}>{r.emoji}</div>
                    <div style={{fontSize:13,fontWeight:600,color:region===r.id?C.teal:C.text}}>{r.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: 旅行护盾 */}
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

      {/* 沉浸式弹窗 */}
      {overlay && <ImmersiveOverlay data={overlay} onClose={()=>setOverlay(null)} />}
    </div>
  );
}

/* ========== P003 ResultPage: 逐层揭晓 + 景点详情 ========== */
function ResultPage({setPage,isLoggedIn,onLoginClick,destKey}) {
  const [phase,setPhase]=useState(0);
  const [expanded,setExpanded]=useState([0]); // Day 1 默认展开
  const [saved,setSaved]=useState(false);
  const [showSafety,setShowSafety]=useState(false);
  const [attractionModal,setAttractionModal]=useState(null);
  const [refreshPointModal,setRefreshPointModal]=useState(null);
  const r=allResults[destKey]||allResults["京都"];
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
            </div>
          )}
          {phase===2&&(
            <div style={{textAlign:"center",animation:"slideUp .8s ease-out"}}>
              <div style={{fontSize:60,marginBottom:16}}>{rc.emoji}</div>
              <p style={{fontSize:16,color:"rgba(255,255,255,0.8)",marginBottom:8}}>第二层揭晓——目的地是...</p>
              <h1 style={{fontSize:64,fontWeight:900,color:"#fff",textShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>{r.destination.name}！</h1>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:16}}>
                {r.destination.tags.map(t=><span key={t} style={{padding:"4px 14px",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:13,borderRadius:C.radiusFull}}>{t}</span>)}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 完整结果 */}
      {phase>=3&&(<>
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
          {/* 安全评估 */}
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
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {Object.entries(r.safety.dims).map(([k,v])=>(
                <div key={k} style={{padding:"10px 12px",background:C.bg,borderRadius:C.radiusSm}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:11,color:C.textSec}}>{v.label}</span>
                    <span style={{fontSize:12,fontWeight:700,color:v.score>=80?C.green:v.score>=60?C.gold:C.coral}}>{v.score}</span>
                  </div>
                  <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${v.score}%`,height:"100%",borderRadius:2,background:v.score>=80?C.green:v.score>=60?C.gold:C.coral,transition:"width .8s"}}/>
                  </div>
                </div>
              ))}
            </div>
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
                    <div style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                      <div style={{width:36,height:36,borderRadius:10,background:rc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:rc.accent,flexShrink:0}}>D{day.day}</div>
                      <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:C.text}}>{day.title}</div><div style={{fontSize:11,color:C.textMuted}}>{day.acts.length}个活动</div></div>
                      <RefreshPointBubble dayIndex={day.day} onClick={(m)=>setRefreshPointModal(m)} />
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
                              <div onClick={()=>attractionDetails[a.name]&&setAttractionModal(a.name)} style={{fontSize:14,fontWeight:600,color:attractionDetails[a.name]?C.primary:C.text,cursor:attractionDetails[a.name]?"pointer":"default",textDecoration:attractionDetails[a.name]?"underline":"none",textUnderlineOffset:"3px"}}>
                                {a.name} {attractionDetails[a.name] && <span style={{fontSize:11}}>→</span>}
                              </div>
                              <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{a.desc}</div>
                              {a.price && <div style={{fontSize:11,color:C.textSec,marginTop:4}}>参考费用：{a.price}</div>}
                            </div>
                          </div>
                          {a.booking&&(
                            <button onClick={()=>attractionDetails[a.name]&&setAttractionModal(a.name)} style={{padding:"5px 12px",background:C.primaryLight,color:C.primary,fontSize:11,fontWeight:600,borderRadius:C.radiusFull,border:"none",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,marginLeft:8}}>
                              查看详情 →
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
      </>)}

      {/* 景点详情弹窗 */}
      {attractionModal && <AttractionModal name={attractionModal} onClose={()=>setAttractionModal(null)} />}
      {/* 社交刷新点弹窗 */}
      {refreshPointModal && <RefreshPointModal match={refreshPointModal} onClose={()=>setRefreshPointModal(null)} />}
    </div>
  );
}

/* ========== PlazaPage ========== */
function PlazaPage({setPage,isLoggedIn,onLoginClick}) {
  const [hoveredPin,setHoveredPin]=useState(null);
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?plazaData:plazaData.filter(p=>p.region===filter);
  return (
    <div style={{minHeight:"85vh",background:C.bg,padding:"32px 24px"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <h1 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
          <Ico name="globe" size={26} color={C.primary}/>盲盒广场
        </h1>
        <p style={{fontSize:14,color:C.textMuted,marginBottom:24}}>探索其他旅行者开出的盲盒目的地</p>
        <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
          {[{key:"all",label:"全部"},{key:"日韩",label:"🗾 日韩"},{key:"东南亚",label:"🌴 东南亚"},{key:"欧洲",label:"🏰 欧洲"},{key:"国内",label:"🇨🇳 国内"},{key:"北美",label:"🗽 北美"}].map(f=>(
            <button key={f.key} onClick={()=>setFilter(f.key)} style={{padding:"7px 16px",borderRadius:C.radiusFull,border:`1.5px solid ${filter===f.key?C.primary:C.border}`,background:filter===f.key?C.primaryLight:C.surface,color:filter===f.key?C.primary:C.textSec,fontSize:13,fontWeight:600,cursor:"pointer"}}>{f.label}</button>
          ))}
        </div>
        <div style={{position:"relative",width:"100%",aspectRatio:"2/1",background:"linear-gradient(135deg,#C5DAE8,#A0BDD6)",borderRadius:C.radiusXl,overflow:"hidden",border:`2px solid ${C.border}`,marginBottom:32}}>
          <svg viewBox="0 0 200 100" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
            <path d="M35 25 Q42 20 55 22 Q60 25 58 35 Q55 42 48 40 Q40 38 35 30Z" fill="#D4C4A8" opacity="0.5"/>
            <path d="M15 30 Q22 25 30 28 Q32 35 28 42 Q20 45 15 38Z" fill="#C8B898" opacity="0.5"/>
            <path d="M40 28 Q55 24 65 30 Q68 38 60 45 Q50 48 42 42 Q38 35 40 28Z" fill="#D4C4A8" opacity="0.5"/>
            <path d="M55 45 Q62 40 70 42 Q72 50 65 55 Q58 52 55 45Z" fill="#D0BC9E" opacity="0.4"/>
            <path d="M62 30 Q72 25 85 28 Q88 35 86 42 Q80 48 72 45 Q65 40 62 30Z" fill="#D4C4A8" opacity="0.5"/>
          </svg>
          {filtered.map(p=>{const prc=regionColors[p.region];return(
            <div key={p.id} onMouseEnter={()=>setHoveredPin(p.id)} onMouseLeave={()=>setHoveredPin(null)} onClick={()=>isLoggedIn?setPage({name:"result"}):onLoginClick()}
              style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:hoveredPin===p.id?10:1}}>
              <div style={{width:hoveredPin===p.id?44:34,height:hoveredPin===p.id?44:34,borderRadius:"50%",background:prc?.gradient||C.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:hoveredPin===p.id?"0 6px 24px rgba(0,0,0,0.2)":"0 2px 10px rgba(0,0,0,0.12)",transition:"all .3s",border:"2.5px solid rgba(255,255,255,0.6)"}}>
                <span style={{fontSize:hoveredPin===p.id?20:15}}>{prc?.emoji||"🎁"}</span>
              </div>
              {hoveredPin===p.id&&(
                <div style={{position:"absolute",bottom:"120%",left:"50%",transform:"translateX(-50%)",background:C.surface,borderRadius:C.radiusSm,padding:"12px 16px",boxShadow:C.shadowHover,whiteSpace:"nowrap",animation:"fadeIn .2s",minWidth:160}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:16,fontWeight:800,color:C.text}}>{p.dest}</span>
                    <span style={{fontSize:12,fontWeight:700,color:C.primary}}>{p.score}%</span>
                  </div>
                  <div style={{fontSize:12,color:C.textMuted}}>by {p.user}</div>
                  <div style={{position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:8,height:8,background:C.surface}}/>
                </div>
              )}
            </div>
          );})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {filtered.map(p=>{const prc=regionColors[p.region];return(
            <div key={p.id} onClick={()=>isLoggedIn?setPage({name:"result"}):onLoginClick()} style={{background:C.surface,borderRadius:C.radius,overflow:"hidden",cursor:"pointer",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,transition:"all .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=C.shadowHover;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=C.shadow;}}>
              <div style={{height:70,background:prc?.gradient||C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:28}}>{prc?.emoji||"🎁"}</span>
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:15,fontWeight:700,color:C.text}}>{p.dest}</span>
                  <span style={{fontSize:12,fontWeight:700,color:C.primary}}>{p.score}%</span>
                </div>
                <div style={{fontSize:12,color:C.textMuted}}>by {p.user}</div>
              </div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

/* ========== ProfilePage ========== */
function ProfilePage({setPage}) {
  const [tab,setTab]=useState("history");
  const [favs,setFavs]=useState(historyBoxes.reduce((a,b)=>({...a,[b.id]:b.fav}),{}));
  return (
    <div style={{minHeight:"85vh",background:`linear-gradient(180deg,${C.primaryLight},${C.bg} 25%)`}}>
      <div style={{maxWidth:700,margin:"0 auto",padding:"36px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico name="user" size={28} color="#fff"/></div>
          <div>
            <h2 style={{fontSize:22,fontWeight:800,color:C.text}}>旅行者</h2>
            <p style={{fontSize:13,color:C.textMuted}}>已开启 {historyBoxes.length} 个盲盒 · 已收集 {historyBoxes.length*5} 张卡片</p>
          </div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:24}}>
          {[{key:"history",label:"历史盲盒"},{key:"cards",label:"我的卡片集"},{key:"map",label:"探索地图"}].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{padding:"8px 20px",borderRadius:C.radiusFull,background:tab===t.key?C.primary:"transparent",color:tab===t.key?"#fff":C.textSec,fontSize:13,fontWeight:600,border:"none",cursor:"pointer"}}>{t.label}</button>
          ))}
        </div>
        {tab==="history"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {historyBoxes.map(h=>(
              <div key={h.id} onClick={()=>setPage({name:"result"})} style={{background:C.surface,borderRadius:C.radius,padding:"18px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:C.text}}>{h.dest}</div>
                  <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{h.theme} · {h.date}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:14,fontWeight:700,color:C.primary}}>{h.score}%</span>
                  <button onClick={e=>{e.stopPropagation();setFavs({...favs,[h.id]:!favs[h.id]});}} style={{background:"none",border:"none",cursor:"pointer"}}>
                    <Ico name={favs[h.id]?"heartF":"heart"} size={18} color={favs[h.id]?C.coral:C.textMuted}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="cards"&&(
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
            {cardStyles.map((cs,i)=><IllustrationCard key={i} cardIndex={i} content="已收集" collected small={false} />)}
          </div>
        )}
        {tab==="map"&&(
          <div style={{background:C.surface,borderRadius:C.radius,padding:"32px",textAlign:"center",boxShadow:C.shadow}}>
            <div style={{fontSize:48,marginBottom:12}}>🗺️</div>
            <p style={{color:C.textMuted,fontSize:14}}>你已探索 3 个目的地，继续开盲盒点亮更多地区！</p>
            <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:20}}>
              {["日韩","东南亚","国内"].map(r=>{const rc2=regionColors[r];return(
                <div key={r} style={{width:56,height:56,borderRadius:"50%",background:rc2.gradient,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.1)"}}>
                  <span style={{fontSize:22}}>{rc2.emoji}</span>
                </div>
              );})}
              {["欧洲","北美"].map(r=>{const rc2=regionColors[r];return(
                <div key={r} style={{width:56,height:56,borderRadius:"50%",background:"#E8DDD4",display:"flex",alignItems:"center",justifyContent:"center",opacity:0.4}}>
                  <span style={{fontSize:22}}>{rc2.emoji}</span>
                </div>
              );})}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== P007 BookingPage: 预订页面 ========== */
function BookingPage({setPage,destKey}) {
  const r = allResults[destKey] || allResults["京都"];
  const rc = regionColors[r.destination.region] || regionColors["日韩"];
  const [activeTab,setActiveTab] = useState("tickets");
  const [selectedItems,setSelectedItems] = useState([]);
  const toggleItem = (id) => selectedItems.includes(id) ? setSelectedItems(selectedItems.filter(x=>x!==id)) : setSelectedItems([...selectedItems,id]);

  const typeIcons = {交通:"🚌",景点:"🎫",体验:"✨"};

  return (
    <div style={{minHeight:"85vh",background:C.bg}}>
      {/* Header */}
      <div style={{background:rc.gradient,padding:"28px 24px 20px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <button onClick={()=>setPage({name:"result",dest:destKey})} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",borderRadius:C.radiusFull,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:16,backdropFilter:"blur(4px)"}}>
            <Ico name="left" size={14} color="#fff"/>返回行程
          </button>
          <h1 style={{fontSize:26,fontWeight:900,color:"#fff",marginBottom:4}}>预订 · {r.destination.name}</h1>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>{r.duration} · 预估 {r.cost}</p>
        </div>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"24px"}}>
        {/* Tab 切换 */}
        <div style={{display:"flex",gap:6,marginBottom:24,background:C.surface,borderRadius:C.radiusFull,padding:4,border:`1px solid ${C.borderLight}`}}>
          {[{key:"tickets",label:"门票·体验",icon:"🎫"},{key:"hotels",label:"附近酒店",icon:"🏨"},{key:"packages",label:"行程打包",icon:"📦"}].map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{flex:1,padding:"10px 16px",borderRadius:C.radiusFull,background:activeTab===t.key?C.primary:"transparent",color:activeTab===t.key?"#fff":C.textSec,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* 门票·体验 */}
        {activeTab==="tickets"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {(r.tickets||[]).map((t,i)=>{
              const sel = selectedItems.includes("t"+i);
              return (
                <div key={i} style={{background:C.surface,borderRadius:C.radius,padding:"18px 20px",boxShadow:C.shadow,border:`1.5px solid ${sel?C.primary:C.borderLight}`,transition:"all .2s",cursor:"pointer"}} onClick={()=>toggleItem("t"+i)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{display:"flex",gap:12,flex:1}}>
                      <div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                        {typeIcons[t.type]||"🎫"}
                      </div>
                      <div>
                        <div style={{fontSize:15,fontWeight:700,color:C.text}}>{t.name}</div>
                        <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>{t.desc}</div>
                        <span style={{display:"inline-block",marginTop:6,padding:"2px 10px",background:C.bg,borderRadius:C.radiusFull,fontSize:11,fontWeight:600,color:C.textSec}}>{t.type}</span>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                      <div style={{fontSize:18,fontWeight:800,color:C.primary}}>{t.price}</div>
                      <div style={{fontSize:11,color:C.textMuted}}>/ 人</div>
                    </div>
                  </div>
                  {sel && (
                    <div style={{marginTop:12,padding:"10px 14px",background:C.greenLight,borderRadius:C.radiusSm,display:"flex",alignItems:"center",gap:8}}>
                      <Ico name="check" size={14} color={C.green}/>
                      <span style={{fontSize:12,fontWeight:600,color:C.green}}>已加入购物车</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 附近酒店 */}
        {activeTab==="hotels"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {(r.hotels||[]).map((h,i)=>(
              <div key={i} style={{background:C.surface,borderRadius:C.radius,overflow:"hidden",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
                <div style={{height:100,background:h.gradient,display:"flex",alignItems:"flex-end",padding:"12px 16px",position:"relative"}}>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.4) 100%)"}}/>
                  <div style={{position:"relative",display:"flex",justifyContent:"space-between",width:"100%",alignItems:"flex-end"}}>
                    <div>
                      <span style={{padding:"3px 10px",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:600,borderRadius:C.radiusFull,backdropFilter:"blur(4px)"}}>{h.tag}</span>
                    </div>
                    <div style={{display:"flex",gap:2}}>
                      {Array.from({length:h.stars}).map((_,j)=><Ico key={j} name="star" size={12} color="#FFD54F"/>)}
                    </div>
                  </div>
                </div>
                <div style={{padding:"16px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,color:C.text}}>{h.name}</div>
                      <div style={{fontSize:12,color:C.textMuted,marginTop:4}}>{h.dist}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:18,fontWeight:800,color:C.primary}}>{h.price}</div>
                    </div>
                  </div>
                  <button style={{width:"100%",marginTop:14,padding:"10px",background:C.primaryLight,color:C.primary,fontSize:13,fontWeight:700,borderRadius:C.radiusFull,border:"none",cursor:"pointer",transition:"all .2s"}}>
                    查看房型 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 行程打包 */}
        {activeTab==="packages"&&(
          <div>
            <div style={{background:C.surface,borderRadius:C.radius,padding:"24px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${C.primary},${C.coral})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:22}}>🎁</span>
                </div>
                <div>
                  <div style={{fontSize:17,fontWeight:800,color:C.text}}>{r.destination.name}盲盒打包价</div>
                  <div style={{fontSize:12,color:C.textMuted}}>门票+酒店+交通一键搞定</div>
                </div>
              </div>
              <div style={{background:C.bg,borderRadius:C.radiusSm,padding:"16px",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:13,color:C.textSec}}>门票·体验 ({(r.tickets||[]).length}项)</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.text}}>含全部景点门票</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:13,color:C.textSec}}>住宿 ({r.duration})</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.text}}>四星级酒店</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,color:C.textSec}}>本地交通</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.text}}>含接送+市内交通</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
                <span style={{fontSize:13,color:C.textMuted,textDecoration:"line-through"}}>原价 {r.cost.replace("¥","¥")}+</span>
                <span style={{fontSize:28,fontWeight:900,color:C.primary}}>{r.cost}</span>
                <span style={{padding:"3px 10px",background:C.coral,color:"#fff",fontSize:11,fontWeight:700,borderRadius:C.radiusFull}}>省15%</span>
              </div>
              <button style={{width:"100%",marginTop:12,padding:"14px",background:C.primary,color:"#fff",fontSize:15,fontWeight:800,borderRadius:C.radiusFull,border:"none",cursor:"pointer",boxShadow:"0 4px 16px rgba(232,115,74,0.3)"}}>
                立即预订打包方案
              </button>
            </div>

            {/* 自由组合 */}
            <div style={{background:C.surface,borderRadius:C.radius,padding:"20px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
              <h3 style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:12}}>自由组合</h3>
              <p style={{fontSize:12,color:C.textMuted,marginBottom:16}}>在上方「门票·体验」和「附近酒店」中自由选择，组合你的专属方案</p>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setActiveTab("tickets")} style={{flex:1,padding:"10px",background:C.bg,color:C.textSec,fontSize:13,fontWeight:600,borderRadius:C.radiusSm,border:`1px solid ${C.border}`,cursor:"pointer"}}>选门票</button>
                <button onClick={()=>setActiveTab("hotels")} style={{flex:1,padding:"10px",background:C.bg,color:C.textSec,fontSize:13,fontWeight:600,borderRadius:C.radiusSm,border:`1px solid ${C.border}`,cursor:"pointer"}}>选酒店</button>
              </div>
            </div>
          </div>
        )}

        {/* 底部购物车 */}
        {selectedItems.length>0 && activeTab==="tickets" && (
          <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,248,240,0.97)",backdropFilter:"blur(10px)",borderTop:`1px solid ${C.borderLight}`,padding:"12px 24px",zIndex:90}}>
            <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <span style={{fontSize:13,color:C.textSec}}>已选 </span>
                <span style={{fontSize:16,fontWeight:800,color:C.primary}}>{selectedItems.length}</span>
                <span style={{fontSize:13,color:C.textSec}}> 项</span>
              </div>
              <button style={{padding:"11px 32px",background:C.primary,color:"#fff",fontSize:14,fontWeight:700,borderRadius:C.radiusFull,border:"none",cursor:"pointer",boxShadow:"0 2px 10px rgba(232,115,74,0.3)"}}>
                去结算 →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== App Shell ========== */
export default function App() {
  const [page,setPage]=useState({name:"home"});
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [showAuth,setShowAuth]=useState(false);

  const renderPage = () => {
    switch(page.name) {
      case "home": return <HomePage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={()=>setShowAuth(true)} />;
      case "blindbox": return <BlindboxPage setPage={setPage} />;
      case "reveal": return <ResultPage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={()=>setShowAuth(true)} />;
      case "result": return <ResultPage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={()=>setShowAuth(true)} />;
      case "plaza": return <PlazaPage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={()=>setShowAuth(true)} />;
      case "profile": return <ProfilePage setPage={setPage} />;
      default: return <HomePage setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={()=>setShowAuth(true)} />;
    }
  };

  return (
    <div style={{fontFamily:"'SF Pro Display','PingFang SC','Noto Sans SC',system-ui,sans-serif",color:C.text,background:C.bg,minHeight:"100vh"}}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes loading { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:${C.bg}; }
      `}</style>
      <Navbar page={page} setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={()=>setShowAuth(true)} />
      {renderPage()}
      <AuthModal open={showAuth} onClose={()=>setShowAuth(false)} onLogin={()=>setIsLoggedIn(true)} />
    </div>
  );
}
