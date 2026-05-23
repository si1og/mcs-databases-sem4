export const BASE_COUNTS = {
  categories: 12,
  formats: 5,
  languages: 40,
} as const;

export const COEFFICIENT_LIMITS = {
  fontFamiliesPerCategory: { min: 15, max: 20 },
  typefacesPerFamily: { min: 18, max: 22 },
  languagesPerTypeface: { min: 2, max: 5 },
  symbolsPerTypefaceLanguage: { min: 33, max: 45 },
} as const;
export const categoryNames = [
  "Serif",
  "Sans-serif",
  "Monospace",
  "Display",
  "Handwriting",
  "Slab-serif",
  "Geometric",
  "Humanist",
  "Grotesque",
  "Neo-grotesque",
  "Transitional",
  "Didone",
];

export const categoryDescs: Record<string, string> = {
  Serif: "Typefaces with decorative strokes at the ends of letterforms",
  "Sans-serif": "Typefaces without decorative strokes",
  Monospace: "Typefaces where each character occupies the same width",
  Display: "Typefaces designed for headlines and large sizes",
  Handwriting: "Typefaces imitating handwritten text",
  "Slab-serif": "Typefaces with thick rectangular serifs",
  Geometric: "Sans-serif typefaces based on geometric shapes",
  Humanist: "Typefaces with organic strokes inspired by calligraphy",
  Grotesque: "Early sans-serif typefaces with irregular proportions",
  "Neo-grotesque": "Refined sans-serif typefaces with uniform strokes",
  Transitional: "Serif typefaces bridging old-style and modern designs",
  Didone: "High-contrast serif typefaces with thin hairlines",
};

export const formats = [
  {
    name: "TrueType",
    ext: ".ttf",
    year: 1991,
    desc: "Scalable font format developed by Apple",
    web: false,
  },
  {
    name: "OpenType",
    ext: ".otf",
    year: 1996,
    desc: "Scalable font format by Microsoft and Adobe",
    web: false,
  },
  {
    name: "WOFF",
    ext: ".woff",
    year: 2010,
    desc: "Web Open Font Format",
    web: true,
  },
  {
    name: "WOFF2",
    ext: ".woff2",
    year: 2014,
    desc: "Compressed Web Open Font Format",
    web: true,
  },
  {
    name: "TrueType Collection",
    ext: ".ttc",
    year: 1994,
    desc: "Multiple TrueType fonts in a single file",
    web: false,
  },
];

export const languages = [
  {
    name: "English",
    iso: "eng",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Russian",
    iso: "rus",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "German",
    iso: "deu",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "French",
    iso: "fra",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Spanish",
    iso: "spa",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Italian",
    iso: "ita",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Portuguese",
    iso: "por",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Dutch",
    iso: "nld",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Polish",
    iso: "pol",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Czech",
    iso: "ces",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Slovak",
    iso: "slk",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Ukrainian",
    iso: "ukr",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Belarusian",
    iso: "bel",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Serbian",
    iso: "srp",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Croatian",
    iso: "hrv",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Bulgarian",
    iso: "bul",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Greek",
    iso: "ell",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Turkish",
    iso: "tur",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Finnish",
    iso: "fin",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Swedish",
    iso: "swe",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Norwegian",
    iso: "nor",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Danish",
    iso: "dan",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Icelandic",
    iso: "isl",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Irish",
    iso: "gle",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Welsh",
    iso: "cym",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Arabic",
    iso: "ara",
    writingDirection: "right-to-left",
    scriptType: "alphabetic",
  },
  {
    name: "Hebrew",
    iso: "heb",
    writingDirection: "right-to-left",
    scriptType: "alphabetic",
  },
  {
    name: "Persian",
    iso: "fas",
    writingDirection: "right-to-left",
    scriptType: "alphabetic",
  },
  {
    name: "Urdu",
    iso: "urd",
    writingDirection: "right-to-left",
    scriptType: "alphabetic",
  },
  {
    name: "Hindi",
    iso: "hin",
    writingDirection: "left-to-right",
    scriptType: "syllabic",
  },
  {
    name: "Bengali",
    iso: "ben",
    writingDirection: "left-to-right",
    scriptType: "syllabic",
  },
  {
    name: "Tamil",
    iso: "tam",
    writingDirection: "left-to-right",
    scriptType: "syllabic",
  },
  {
    name: "Telugu",
    iso: "tel",
    writingDirection: "left-to-right",
    scriptType: "syllabic",
  },
  {
    name: "Thai",
    iso: "tha",
    writingDirection: "left-to-right",
    scriptType: "syllabic",
  },
  {
    name: "Lao",
    iso: "lao",
    writingDirection: "left-to-right",
    scriptType: "syllabic",
  },
  {
    name: "Chinese",
    iso: "zho",
    writingDirection: "left-to-right",
    scriptType: "logographic",
  },
  {
    name: "Japanese",
    iso: "jpn",
    writingDirection: "left-to-right",
    scriptType: "logographic",
  },
  {
    name: "Korean",
    iso: "kor",
    writingDirection: "left-to-right",
    scriptType: "syllabic",
  },
  {
    name: "Vietnamese",
    iso: "vie",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
  {
    name: "Indonesian",
    iso: "ind",
    writingDirection: "left-to-right",
    scriptType: "alphabetic",
  },
];

export const weights = [
  "Thin",
  "ExtraLight",
  "Light",
  "Regular",
  "Medium",
  "SemiBold",
  "Bold",
  "ExtraBold",
  "Black",
];

export const slopes = ["Upright", "Italic", "Oblique"];

export const tables = [
  "Category",
  "Format",
  "Language",
  "Font_family",
  "Typeface",
  "Symbol",
];
