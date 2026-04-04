// ============================================================
// Trip Open 旅行盲盒 - Mock 数据
// 原型阶段使用静态数据，预留 Supabase 接口注释
// ============================================================

// --- Theme 主题数据 ---
export const themes = [
  {
    id: "island",
    name: "海岛度假",
    emoji: "🏝️",
    description: "碧海蓝天，椰风海韵，远离城市喧嚣",
    cover: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
    destinations: ["巴厘岛", "普吉岛", "马尔代夫", "三亚", "长滩岛"],
  },
  {
    id: "city",
    name: "城市探索",
    emoji: "🏙️",
    description: "发现城市的隐秘角落与潮流文化",
    cover: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    destinations: ["东京", "首尔", "曼谷", "新加坡", "香港"],
  },
  {
    id: "ancient",
    name: "古镇漫游",
    emoji: "🏯",
    description: "穿越时光，感受历史与文化的沉淀",
    cover: "linear-gradient(135deg, #D97706, #B45309)",
    destinations: ["丽江", "凤凰", "周庄", "乌镇", "大理"],
  },
  {
    id: "outdoor",
    name: "户外冒险",
    emoji: "⛰️",
    description: "挑战自我，拥抱自然的壮阔",
    cover: "linear-gradient(135deg, #059669, #047857)",
    destinations: ["张家界", "九寨沟", "稻城亚丁", "新西兰", "瑞士"],
  },
  {
    id: "food",
    name: "美食之旅",
    emoji: "🍜",
    description: "跟着味蕾去旅行，寻找地道风味",
    cover: "linear-gradient(135deg, #DC2626, #B91C1C)",
    destinations: ["成都", "广州", "大阪", "曼谷", "伊斯坦布尔"],
  },
  {
    id: "art",
    name: "文艺打卡",
    emoji: "🎨",
    description: "博物馆、咖啡馆、书店，文艺青年的灵感之旅",
    cover: "linear-gradient(135deg, #EC4899, #DB2777)",
    destinations: ["巴黎", "佛罗伦萨", "京都", "景德镇", "厦门"],
  },
  {
    id: "honeymoon",
    name: "蜜月浪漫",
    emoji: "💕",
    description: "和最爱的人一起，创造难忘回忆",
    cover: "linear-gradient(135deg, #F43F5E, #E11D48)",
    destinations: ["圣托里尼", "巴黎", "马尔代夫", "布拉格", "威尼斯"],
  },
  {
    id: "offbeat",
    name: "小众秘境",
    emoji: "🗺️",
    description: "远离人潮，探索未被发现的宝藏目的地",
    cover: "linear-gradient(135deg, #0D9488, #0F766E)",
    destinations: ["格鲁吉亚", "黔东南", "斯里兰卡", "冰岛", "阿曼"],
  },
];

// --- 热门搜索标签 ---
export const hotSearchTags = [
  "海岛度假",
  "古镇漫游",
  "日本温泉",
  "咖啡馆打卡",
  "3天2夜周末游",
  "人少景美",
  "美食探店",
  "户外徒步",
];

// --- 预算选项 ---
export const budgetOptions = [
  { label: "¥1,000 以内", value: "0-1000", emoji: "💰" },
  { label: "¥1,000 - 3,000", value: "1000-3000", emoji: "💰💰" },
  { label: "¥3,000 - 5,000", value: "3000-5000", emoji: "💰💰💰" },
  { label: "¥5,000 - 10,000", value: "5000-10000", emoji: "💎" },
  { label: "¥10,000+", value: "10000+", emoji: "👑" },
];

// --- 场景选项 ---
export const sceneOptions = [
  { id: "cafe", name: "咖啡馆", emoji: "☕" },
  { id: "museum", name: "博物馆", emoji: "🏛️" },
  { id: "beach", name: "海滩", emoji: "🏖️" },
  { id: "nightmarket", name: "夜市", emoji: "🌙" },
  { id: "hotspring", name: "温泉", emoji: "♨️" },
  { id: "hiking", name: "徒步", emoji: "🥾" },
  { id: "photography", name: "摄影", emoji: "📸" },
  { id: "shopping", name: "购物", emoji: "🛍️" },
  { id: "show", name: "演出", emoji: "🎭" },
  { id: "temple", name: "寺庙", emoji: "🛕" },
];

// --- 区域选项 ---
export const regionOptions = [
  { id: "domestic", name: "国内", emoji: "🇨🇳" },
  { id: "southeast-asia", name: "东南亚", emoji: "🌴" },
  { id: "japan-korea", name: "日韩", emoji: "🗾" },
  { id: "europe", name: "欧洲", emoji: "🏰" },
  { id: "north-america", name: "北美", emoji: "🗽" },
  { id: "random", name: "随机都行", emoji: "🎲" },
];

// --- 禁忌选项 ---
export const tabooOptions = [
  { id: "hot", name: "怕热", emoji: "🥵" },
  { id: "cold", name: "怕冷", emoji: "🥶" },
  { id: "mountain", name: "不爬山", emoji: "🚫⛰️" },
  { id: "boat", name: "不坐船", emoji: "🚫🚢" },
  { id: "spicy", name: "不吃辣", emoji: "🚫🌶️" },
  { id: "crowd", name: "人少优先", emoji: "🧘" },
  { id: "visa-free", name: "无需签证", emoji: "✈️" },
];

// --- 盲盒结果示例 ---
export const sampleBlindBoxResult = {
  id: "bb-001",
  destination: {
    name: "京都",
    region: "日韩",
    cover: "linear-gradient(135deg, #F59E0B, #D97706)",
    description:
      "千年古都，樱花与红叶交替的四季之美。漫步在花见小路，感受传统与现代交融的独特魅力。",
    tags: ["文艺", "古迹", "美食", "摄影"],
    rating: 4.8,
  },
  matchScore: 92,
  estimatedCost: "¥4,500",
  duration: "4天3夜",
  itinerary: [
    {
      day: 1,
      title: "古韵初探",
      activities: [
        {
          time: "上午",
          name: "伏见稻荷大社",
          desc: "穿越千本鸟居，感受神秘的朱红世界",
          highlight: "千本鸟居日出",
        },
        {
          time: "下午",
          name: "清水寺",
          desc: "京都最古老的寺院，俯瞰城市全景",
        },
        {
          time: "晚上",
          name: "花见小路",
          desc: "祗园的石板路上，邂逅艺伎文化",
        },
      ],
    },
    {
      day: 2,
      title: "茶道与庭园",
      activities: [
        {
          time: "上午",
          name: "金阁寺",
          desc: "金色倒影映在镜湖池中的绝美画面",
        },
        {
          time: "下午",
          name: "龙安寺枯山水",
          desc: "在石庭前静心冥想，体验禅意",
        },
        {
          time: "晚上",
          name: "锦市场",
          desc: "京都的厨房，品尝地道小吃",
        },
      ],
    },
    {
      day: 3,
      title: "岚山秘境",
      activities: [
        {
          time: "上午",
          name: "岚山竹林",
          desc: "漫步翠竹之间，聆听风的声音",
          highlight: "竹林晨雾步道",
        },
        {
          time: "下午",
          name: "渡月桥",
          desc: "桂川河畔的经典景观",
        },
        {
          time: "晚上",
          name: "先斗町",
          desc: "河畔的居酒屋街，品尝怀石料理",
        },
      ],
    },
    {
      day: 4,
      title: "咖啡与告别",
      activities: [
        {
          time: "上午",
          name: "% Arabica 咖啡",
          desc: "在世界级咖啡馆享用早间咖啡",
        },
        {
          time: "下午",
          name: "二条城",
          desc: "最后的古迹巡礼，感受德川幕府的辉煌",
        },
      ],
    },
  ],
  highlights: ["千本鸟居日出", "正宗抹茶体验", "竹林小径晨间漫步", "怀石料理"],
};

// --- 精选盲盒预览卡片 ---
export const featuredBlindBoxes = [
  {
    id: "fb-1",
    destination: "巴厘岛",
    theme: "海岛度假",
    cover: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
    matchScore: 95,
    review: "超出预期！乌布的稻田太美了",
    userName: "小鱼儿",
  },
  {
    id: "fb-2",
    destination: "成都",
    theme: "美食之旅",
    cover: "linear-gradient(135deg, #DC2626, #B91C1C)",
    matchScore: 88,
    review: "火锅串串吃到扶墙，太幸福了",
    userName: "吃货阿明",
  },
  {
    id: "fb-3",
    destination: "冰岛",
    theme: "小众秘境",
    cover: "linear-gradient(135deg, #0D9488, #0F766E)",
    matchScore: 91,
    review: "极光真的太震撼了，一生必去",
    userName: "旅行者Luna",
  },
  {
    id: "fb-4",
    destination: "大理",
    theme: "文艺打卡",
    cover: "linear-gradient(135deg, #EC4899, #DB2777)",
    matchScore: 87,
    review: "洱海边骑行，风吹在脸上的感觉",
    userName: "文艺小青年",
  },
  {
    id: "fb-5",
    destination: "瑞士",
    theme: "户外冒险",
    cover: "linear-gradient(135deg, #059669, #047857)",
    matchScore: 93,
    review: "少女峰的雪景此生难忘",
    userName: "山野客",
  },
  {
    id: "fb-6",
    destination: "圣托里尼",
    theme: "蜜月浪漫",
    cover: "linear-gradient(135deg, #F43F5E, #E11D48)",
    matchScore: 96,
    review: "蓝顶教堂的日落，和对的人在一起",
    userName: "甜蜜夫妇",
  },
];

// --- 特色卖点 ---
export const features = [
  {
    id: "ai",
    icon: "Sparkles",
    title: "AI 智能推荐",
    description: "基于你的偏好和预算，AI 为你量身定制旅行方案",
  },
  {
    id: "budget",
    icon: "Wallet",
    title: "预算可控",
    description: "设定预算上限，推荐方案绝不超标",
  },
  {
    id: "surprise",
    icon: "Gift",
    title: "惊喜体验",
    description: "像开盲盒一样发现旅行目的地，每次都是新惊喜",
  },
  {
    id: "go",
    icon: "Zap",
    title: "一键出发",
    description: "完整行程一键生成，告别攻略焦虑",
  },
];

// --- 用户 Mock ---
export const mockUser = {
  id: "user-001",
  phone: "138****8888",
  nickname: "旅行达人小明",
  avatar: null,
  createdAt: "2026-01-15",
};

// --- 历史盲盒 Mock ---
export const historyBlindBoxes = [
  {
    id: "hb-1",
    destination: "京都",
    theme: "文艺打卡",
    date: "2026-03-20",
    matchScore: 92,
    isFavorite: true,
  },
  {
    id: "hb-2",
    destination: "清迈",
    theme: "美食之旅",
    date: "2026-03-10",
    matchScore: 85,
    isFavorite: false,
  },
  {
    id: "hb-3",
    destination: "厦门",
    theme: "海岛度假",
    date: "2026-02-28",
    matchScore: 78,
    isFavorite: true,
  },
];
