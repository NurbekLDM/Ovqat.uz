/**
 * O'zbek oshxonasida ishlatiladigan barcha ingredientlar
 * Kategoriyalar bo'yicha tashkil qilingan
 */

export const UZBEK_INGREDIENTS = [
  // Asosiy don mahsulotlari
  "guruch",
  "bugdoy",
  "arpa",
  "makkajo'xori",
  "javdar",

  // Go'sht va baliq mahsulotlari
  "mol go'shti",
  "qo'y go'shti",
  "echki go'shti",
  "tovuq go'shti",
  "o'rdak go'shti",
  "baliq",
  "sazan",
  "oq baliq",
  "qora baliq",
  "qiyma",

  // Sut mahsulotlari va tuxum
  "sut",
  "qaymoq",
  "sariyog'",
  "margarin",
  "tvorog",
  "suzma",
  "qatiq",
  "airan",
  "pishloq",
  "brynza",
  "tuxum",

  // Sabzavotlar va ko'katlar
  "piyoz",
  "sarimsoq",
  "sabzi",
  "jambul",
  "sholg'om",
  "turp",
  "lavlagi",
  "pomidor",
  "bodring",
  "qovuq",
  "qovuncha",
  "baqlajon",
  "qalampir",
  "kartoshka",
  "shalgam",
  "sabzi bargi",
  "petrushka",
  "ukrop",
  "rayhon",
  "ko'katlar",
  "piyozcha",
  "qizil qalampir",
  "yashil qalampir",
  "karam",
  "gulkaram",
  "ismaloq",
  "tarvuz",
  "qovun",

  // Dukkaklilar va loviyalar
  "loviya",
  "mosh",
  "no'xat",
  "yasmiq",
  "masosh",
  "burdog'",

  // Ziravorlar va dorivorlar
  "zira",
  "koriander",
  "doljin",
  "qora murch",
  "qizil murch",
  "dolchin",
  "mikhak",
  "muskat",
  "yalpiz",
  "rayo",
  "namatak",
  "qizil pepper",
  "achchiq qalampir",
  "tuz",
  "shakar",
  "sirka",
  "limon kislotasi",
  "soda",

  // Yog'lar
  "o'simlik yog'i",
  "zaytun yog'i",
  "kungaboqar yog'i",
  "sariyog'",
  "quyruq yog'i",
  "dumba yog'i",

  // Mevalar va quruq mevalar
  "olma",
  "nok",
  "uzum",
  "shaftoli",
  "o'rik",
  "gilos",
  "olcha",
  "mayiz",
  "yong'oq",
  "bodom",
  "pista",
  "anjir",
  "kishmish",
  "o'rik quritma",
  "olma quritma",
  "mayiz quritma",

  // Un va xamir mahsulotlari
  "un",
  "xamir",
  "lag'mon",
  "chuchvara xamiri",
  "manti xamiri",
  "non",
  "oq non",
  "qora non",
  "patir",
  "yupqa",

  // Boshqa mahsulotlar
  "asal",
  "murabbo",
  "moy",
  "sardalya",
  "konserva",
  "mazali qo'shimchalar",
  "bulyon",
  "xantal",
  "gelatin",
  "mayonez",
  "ketchup",
  "gorchitsa",
  "sous",

  // Ichimliklar
  "choy",
  "qora choy",
  "yashil choy",
  "kofe",
  "kakao",
  "kompot",
  "sherbet",
  "ayran",
  "qatiq",

  // Mahalliy o'ziga xos mahsulotlar
  "qazi",
  "shuvoq",
  "chuchuk",
  "hasip",
  "qovurma",
  "qaymog'",
  "erimchik",
  "kurt",
  "suzma",

  // Pishiriq va shirinliklar uchun
  "xamirturush",
  "soda",
  "vanilin",
  "limon posti",
  "apelsin posti",
  "kokos",
  "shokolad",
  "kakao kukuni",

  // Salatlar uchun
  "mayonez",
  "smetana",
  "sirka",
  "limon sharbati",
  "zaytun",
  "kappers",
  "kornishon",
] as const;

/**
 * Search algorithm configurations
 */
export const SEARCH_CONFIG = {
  MIN_SEARCH_LENGTH: 1,
  MAX_SUGGESTIONS: 10,
  DEBOUNCE_DELAY: 200,
} as const;
