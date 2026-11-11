// Rideekanda requirements — seed data
// Each item: id, en (English name), si (Sinhala name), desc, price (LKR), qty (needed),
// pledged (count fulfilled), category, priority (urgent|need|routine), addedDays (ago),
// icon (glyph id from icons.js)

window.RIDEEKANDA_ITEMS = [
  // Robes
  { id: 1, en: "Outer robe (Cīvara)", si: "පිට සිවුර", desc: "Cotton, traditional dye. Standard adult monk size.", price: 8500, qty: 6, pledged: 2, category: "robes", priority: "need", addedDays: 4, icon: "robe" },
  { id: 2, en: "Inner robe (Antaravāsaka)", si: "ඇතුළු සිවුර", desc: "Light cotton, daily wear.", price: 4200, qty: 8, pledged: 5, category: "robes", priority: "need", addedDays: 9, icon: "robe" },
  { id: 3, en: "Saffron natural dye", si: "පැහැ ඔසු", desc: "For re-dyeing existing robes. 500g sachets.", price: 2200, qty: 4, pledged: 4, category: "robes", priority: "routine", addedDays: 22, icon: "vial" },

  // Alms / daily
  { id: 4, en: "Alms bowl (Pātra)", si: "පාත්‍රය", desc: "Iron alms bowl with stand and cloth cover.", price: 5200, qty: 4, pledged: 1, category: "alms", priority: "urgent", addedDays: 1, icon: "bowl" },
  { id: 5, en: "Walking stick", si: "කරුණා දඬු", desc: "For elder bhikkhus on the forest paths.", price: 1800, qty: 5, pledged: 2, category: "alms", priority: "routine", addedDays: 14, icon: "stick" },
  { id: 6, en: "Hand fan (Talapatra)", si: "තල්පත් වටාපත", desc: "Traditional palm-leaf fan, used during Dhamma talks.", price: 1400, qty: 3, pledged: 0, category: "alms", priority: "routine", addedDays: 30, icon: "fan" },

  // Food & provisions
  { id: 7, en: "Rice (Suwandel)", si: "සුවඳැල් සහල්", desc: "25 kg sacks. Monthly requirement for the saṅgha.", price: 6800, qty: 12, pledged: 4, category: "provisions", priority: "urgent", addedDays: 2, icon: "grain" },
  { id: 8, en: "Coconut oil (5L)", si: "පොල් තෙල්", desc: "Cold-pressed. Used for cooking and lamps.", price: 3500, qty: 6, pledged: 3, category: "provisions", priority: "need", addedDays: 7, icon: "vial" },
  { id: 9, en: "Tea & jaggery set", si: "තේ සහ හකුරු", desc: "Tea leaves, milk powder, palm jaggery for the kitchen.", price: 4200, qty: 4, pledged: 2, category: "provisions", priority: "need", addedDays: 11, icon: "cup" },

  // Lighting
  { id: 10, en: "Solar lantern", si: "හිරු ලාම්පුව", desc: "Off-grid lighting for the kuṭi at night.", price: 4800, qty: 10, pledged: 3, category: "light", priority: "urgent", addedDays: 3, icon: "lantern" },
  { id: 11, en: "Oil lamp (Pol-tel pahana)", si: "පොල්තෙල් පහන", desc: "Brass lamp for the shrine room. Pair.", price: 3200, qty: 6, pledged: 6, category: "light", priority: "routine", addedDays: 25, icon: "lamp" },
  { id: 12, en: "Beeswax candles (1 kg)", si: "ඉටිපන්දම්", desc: "Hand-poured, for Vesak and pūjā.", price: 1800, qty: 8, pledged: 2, category: "light", priority: "routine", addedDays: 17, icon: "candle" },

  // Books / study
  { id: 13, en: "Pāli Tipiṭaka volumes", si: "ත්‍රිපිටක ග්‍රන්ථ", desc: "Buddha Jayanti edition. Sets of 10 volumes.", price: 18500, qty: 2, pledged: 0, category: "study", priority: "need", addedDays: 6, icon: "book" },
  { id: 14, en: "Dhamma study notebooks", si: "ධර්ම අධ්‍යයන පොත්", desc: "Bound notebooks, 200 pages each. For novice monks.", price: 1200, qty: 20, pledged: 12, category: "study", priority: "routine", addedDays: 13, icon: "book" },

  // Buildings & repair
  { id: 15, en: "Roofing tiles (lot of 50)", si: "වහළ උළු", desc: "Replacement clay tiles for the meditation hall.", price: 18000, qty: 4, pledged: 1, category: "building", priority: "urgent", addedDays: 0, icon: "tile" },
  { id: 16, en: "Cement (50 kg bag)", si: "සිමෙන්ති", desc: "For repair of the boundary wall.", price: 1850, qty: 30, pledged: 8, category: "building", priority: "need", addedDays: 5, icon: "brick" },
  { id: 17, en: "Water filter (gravity)", si: "ජල පෙරනය", desc: "Stainless steel, 20 L. For the kitchen.", price: 12500, qty: 2, pledged: 0, category: "building", priority: "urgent", addedDays: 1, icon: "filter" },

  // Health
  { id: 18, en: "Ayurvedic medicine kit", si: "ආයුර්වේද ඔසු කට්ටලය", desc: "Common remedies prepared by Wedaḷapaḷa Mahattaya.", price: 3800, qty: 5, pledged: 2, category: "health", priority: "need", addedDays: 8, icon: "leaf" },
  { id: 19, en: "Mosquito net", si: "මදුරු දැල", desc: "Single-bed size. Critical during the rain retreat.", price: 1800, qty: 12, pledged: 4, category: "health", priority: "urgent", addedDays: 2, icon: "net" },
];

window.RIDEEKANDA_CATEGORIES = [
  { id: "robes", en: "Robes", si: "සිවුරු" },
  { id: "alms", en: "Alms & Daily Use", si: "පාත්‍ර හා දෛනික" },
  { id: "provisions", en: "Provisions", si: "ආහාර" },
  { id: "light", en: "Light", si: "ආලෝකය" },
  { id: "study", en: "Study", si: "අධ්‍යයන" },
  { id: "building", en: "Building & Repair", si: "ඉදිකිරීම්" },
  { id: "health", en: "Health", si: "සෞඛ්‍ය" },
];
