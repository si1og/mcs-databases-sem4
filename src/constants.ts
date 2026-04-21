export const COUNTS = {
  os: 10,
  publishers: 50,
  categories: 12,
  formats: 5,
  languages: 40,
  workstations: 200,
  fontFamilies: 500,
  typefacesPerFamily: { min: 3, max: 16 },
  licensesPerFamily: 1,
  alphabetsPerTypeface: { min: 25, max: 40 },
  installationsPerWorkstation: { min: 800, max: 2000 },
};

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

export const osNames = [
  "Windows",
  "macOS",
  "Ubuntu Linux",
  "Fedora Linux",
  "Debian Linux",
  "Arch Linux",
  "RHEL",
  "openSUSE",
  "Mint Linux",
  "Pop!_OS",
];

export const osVersions: Record<string, string[]> = {
  Windows: ["11 23H2", "11 24H2", "10 22H2"],
  macOS: ["15.4.1", "14.7", "13.6"],
  "Ubuntu Linux": ["24.04 LTS", "22.04 LTS"],
  "Fedora Linux": ["40", "39"],
  "Debian Linux": ["12.8", "11.11"],
  "Arch Linux": ["2024.12.01", "2024.06.01"],
  RHEL: ["9.4", "8.10"],
  openSUSE: ["15.6", "15.5"],
  "Mint Linux": ["22", "21.3"],
  "Pop!_OS": ["22.04", "24.04"],
};

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
export const licenseTypes = [
  "OFL",
  "Commercial",
  "Subscription",
  "Trial",
  "Freeware",
];
export const installStatuses = ["active", "active", "active", "disabled"];
export const alphabetStatuses = ["full", "partial", "unsupported"];
export const storageTypes = ["NVMe SSD", "SSD", "HDD"];
export const scriptTypes = ["alphabetic", "syllabic", "logographic"];
export const writingDirs = ["left-to-right", "right-to-left"];

export const gpus = [
  "NVIDIA RTX 4090",
  "NVIDIA RTX 4080",
  "NVIDIA RTX 4070",
  "NVIDIA RTX 4060",
  "NVIDIA RTX 3060",
  "AMD Radeon RX 7800 XT",
  "AMD Radeon RX 7600",
  "Apple M3 Max GPU",
  "Apple M3 Pro GPU",
  "Apple M2 GPU",
  "Intel UHD Graphics 770",
  "Intel UHD Graphics 730",
];

export const processors = [
  "Intel Core i9-14900K",
  "Intel Core i7-14700K",
  "Intel Core i7-13700K",
  "Intel Core i5-13600K",
  "Intel Core i5-13500",
  "Intel Core i5-12400",
  "AMD Ryzen 9 7950X",
  "AMD Ryzen 7 7800X3D",
  "AMD Ryzen 5 7600X",
  "Apple M3 Max",
  "Apple M3 Pro",
  "Apple M2 Pro",
  "Apple M2",
];

export const tables = [
  "OS",
  "Publisher",
  "Category",
  "Format",
  "Language",
  "Workstation",
  "Font_family",
  "Typeface",
  "License",
  "Alphabet",
  "Installation",
];
