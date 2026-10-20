import {
  Product,
  Order,
  Customer,
  StockMovement,
  DiscountCoupon,
  AuditLog,
  ProductReview,
  MenuHeaderConfig,
  ShowcaseVideo
} from '../types';

import heroImg from '../assets/images/ninja_hero_dtf_press_1791621393553.jpg';
import gangSheetImg from '../assets/images/dtf_gang_sheet_roll_1791621410405.jpg';
import uvDtfImg from '../assets/images/uv_dtf_decals_tumbler_1791621440672.jpg';
import tumblerWrapImg from '../assets/images/tumbler_decal_wrap_1791628477155.jpg';
import blankApparelImg from '../assets/images/blank_apparel_stack_1791621455211.jpg';
import patchesImg from '../assets/images/custom_embroidered_patches_1791627943574.jpg';
import leatherPatchesImg from '../assets/images/leather_pvc_patches_1791628437633.jpg';
import stickersImg from '../assets/images/holographic_stickers_stack_1791628407702.jpg';
import specialtyImg from '../assets/images/specialty_glitter_dtf_1791627974475.jpg';
import heatPressImg from '../assets/images/heat_press_machine_1791628384482.jpg';

// Newly generated home page images matching user uploaded pictures
import dtfBySizeCollage from '../assets/images/dtf_by_size_collage_1791713563353.jpg';
import gangBuilderScreen from '../assets/images/gang_builder_screen_1791713584802.jpg';
import gangRollPrintReady from '../assets/images/gang_roll_print_ready_1791713610570.jpg';
import deliveryGlobeMap from '../assets/images/delivery_globe_map_1791713640925.jpg';
import featureAstronaut from '../assets/images/feature_astronaut_1791713672929.jpg';
import featureFineArcade from '../assets/images/feature_fine_arcade_1791714000384.jpg';
import featureCapPress from '../assets/images/feature_cap_press_1791713725094.jpg';
import featureRoosterBlack from '../assets/images/feature_rooster_black_1791713767910.jpg';
import featureRetroBaseball from '../assets/images/feature_retro_baseball_1791713928824.jpg';
import featureWhiteCamp from '../assets/images/feature_white_camp_1791713814809.jpg';
import featureStretchDurability from '../assets/images/feature_stretch_durability_1791713864566.jpg';
import featureGradientGlobe from '../assets/images/feature_gradient_globe_1791714066496.jpg';

export const ASSETS = {
  heroBanner: heroImg,
  gangSheetRoll: gangSheetImg,
  uvDtfDecals: uvDtfImg,
  tumblerWrap: tumblerWrapImg,
  blankApparel: blankApparelImg,
  patches: patchesImg,
  leatherPatches: leatherPatchesImg,
  stickers: stickersImg,
  specialtyDtf: specialtyImg,
  heatPress: heatPressImg,
  // Section 1: 3-Product selector
  dtfBySizeCollage,
  gangBuilderScreen,
  gangRollPrintReady,
  // Section 2: 8 Feature tiles
  featureAstronaut,
  featureFineArcade,
  featureCapPress,
  featureRoosterBlack,
  featureRetroBaseball,
  featureWhiteCamp,
  featureStretchDurability,
  featureGradientGlobe,
  // Section 3: Delivery Map
  deliveryGlobeMap,
};

export const IMAGE_PRESETS = [
  { name: 'Custom DTF Heat Press Transfer', url: heroImg, category: 'DTF Transfers' },
  { name: '22" Continuous Gang Sheet Roll', url: gangSheetImg, category: 'Gang Sheets' },
  { name: 'UV DTF Decals & Multi-surface Stickers', url: uvDtfImg, category: 'UV DTF' },
  { name: 'UV Tumbler Wrap (40oz Cup)', url: tumblerWrapImg, category: 'UV DTF' },
  { name: 'Streetwear Heavyweight Apparel Stack', url: blankApparelImg, category: 'Blank Apparel' },
  { name: 'Custom Embroidered Patches', url: patchesImg, category: 'Patches' },
  { name: 'Laser Leather & 3D PVC Patches', url: leatherPatchesImg, category: 'Patches' },
  { name: 'Holographic Prism Die-Cut Stickers', url: stickersImg, category: 'Stickers' },
  { name: 'Specialty Diamond Glitter DTF Film', url: specialtyImg, category: 'Specialty DTF' },
  { name: 'Commercial 15" x 15" Auto-Open Heat Press', url: heatPressImg, category: 'Supplies' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-dtf-custom-size',
    name: 'Custom DTF Heat Transfers by Size',
    slug: 'custom-dtf-transfers-by-size',
    category: 'dtf-transfers',
    shortDescription: 'Vibrant full-color Direct to Film transfers ready to press on any fabric with no weeding.',
    description: 'Our industry-leading Custom DTF transfers deliver ultra-vibrant colors, razor-sharp details, and long-lasting durability tested through 60+ commercial washes. Works effortlessly on 100% cotton, polyester, blends, tri-blends, spandex, and nylon. Zero weeding, zero setup fees, and lightning-fast turnaround.',
    price: 3.99,
    compareAtPrice: 5.50,
    images: [heroImg, gangSheetImg],
    featured: true,
    bestSeller: true,
    isCustomizable: true,
    rating: 4.95,
    reviewCount: 3840,
    specifications: {
      pressTemp: '300°F - 320°F (150°C - 160°C)',
      pressTime: '12 - 15 Seconds',
      pressPressure: '50 - 60 PSI (Medium to Heavy)',
      peelType: 'Warm or Cold Peel',
      material: 'PET Film with High-Density TPU Powder',
      durability: '60+ Washes without cracking or fading',
      turnaround: 'Same-Day Dispatch before 3 PM EST'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 3.99, discountPercentage: 0 },
      { minQty: 10, maxQty: 24, pricePerUnit: 2.99, discountPercentage: 25 },
      { minQty: 25, maxQty: 49, pricePerUnit: 2.49, discountPercentage: 38 },
      { minQty: 50, maxQty: 99, pricePerUnit: 1.99, discountPercentage: 50 },
      { minQty: 100, pricePerUnit: 1.49, discountPercentage: 62 },
    ],
    variants: [
      { id: 'v-pocket', name: '2" x 2" Pocket/Sleeve', sku: 'DTF-SZ-02', price: 1.25, stock: 9999, attributes: { size: '2" x 2"' } },
      { id: 'v-hat', name: '4" x 4" Hat/Left Chest', sku: 'DTF-SZ-04', price: 2.45, stock: 9999, attributes: { size: '4" x 4"' } },
      { id: 'v-youth', name: '9" x 9" Youth Front', sku: 'DTF-SZ-09', price: 3.99, stock: 9999, attributes: { size: '9" x 9"' } },
      { id: 'v-adult', name: '11" x 11" Adult Standard', sku: 'DTF-SZ-11', price: 5.50, stock: 9999, attributes: { size: '11" x 11"' } },
      { id: 'v-oversized', name: '12" x 17" Oversized Back', sku: 'DTF-SZ-17', price: 7.95, stock: 9999, attributes: { size: '12" x 17"' } },
    ]
  },
  {
    id: 'prod-gang-sheet-builder',
    name: 'Custom DTF Gang Sheet (Visual Builder)',
    slug: 'custom-dtf-gang-sheet-builder',
    category: 'gang-sheets',
    shortDescription: 'Build your custom roll gang sheet online or upload your pre-made print file at wholesale pricing.',
    description: 'Maximize your profits by ganging multiple designs on continuous 22" wide industrial DTF film rolls. Upload multiple logos, resize, rotate, and arrange them directly inside our interactive builder. Pay only for the linear length you need with tiered volume roll discounts.',
    price: 19.99,
    compareAtPrice: 28.00,
    images: [gangSheetImg, heroImg],
    featured: true,
    bestSeller: true,
    isGangSheet: true,
    rating: 4.98,
    reviewCount: 5120,
    specifications: {
      pressTemp: '305°F (152°C)',
      pressTime: '15 Seconds',
      pressPressure: 'Medium - Heavy (60 PSI)',
      peelType: 'Instant Warm or Cold Peel',
      material: 'Industrial 22" Matte PET Transfer Roll',
      durability: 'Commercial Grade 65+ Washes',
      turnaround: 'Prints in 24 Hours'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 2, pricePerUnit: 19.99, discountPercentage: 0 },
      { minQty: 3, maxQty: 5, pricePerUnit: 17.50, discountPercentage: 12 },
      { minQty: 6, maxQty: 10, pricePerUnit: 15.00, discountPercentage: 25 },
      { minQty: 11, pricePerUnit: 12.99, discountPercentage: 35 },
    ],
    variants: [
      { id: 'gs-24', name: '22" x 24" Small Roll', sku: 'GS-22-24', price: 19.99, stock: 1500, attributes: { length: '24 Inches' } },
      { id: 'gs-60', name: '22" x 60" Medium Roll (5 ft)', sku: 'GS-22-60', price: 39.99, stock: 1200, attributes: { length: '60 Inches' } },
      { id: 'gs-120', name: '22" x 120" Pro Roll (10 ft)', sku: 'GS-22-120', price: 74.99, stock: 950, attributes: { length: '120 Inches' } },
      { id: 'gs-240', name: '22" x 240" Wholesale Roll (20 ft)', sku: 'GS-22-240', price: 139.99, stock: 600, attributes: { length: '240 Inches' } },
      { id: 'gs-360', name: '22" x 360" Master Roll (30 ft)', sku: 'GS-22-360', price: 199.99, stock: 400, attributes: { length: '360 Inches' } },
    ]
  },
  {
    id: 'prod-uv-dtf-stickers',
    name: 'UV DTF Custom Decals & Tumbler Wraps',
    slug: 'uv-dtf-custom-decals',
    category: 'uv-dtf',
    shortDescription: 'Peel and stick waterproof 3D gloss transfers for tumblers, glass, metal, hard plastics & wood.',
    description: 'No heat press required! UV DTF transfers use UV-cured ink with a raised high-gloss 3D varnish layer and industrial strength adhesive. Perfect for customized Stanley tumblers, hydro flasks, glassware, phone cases, laptops, hard hats, and wooden surfaces. 100% waterproof, dish-washer safe, and UV resistant.',
    price: 4.50,
    compareAtPrice: 6.00,
    images: [tumblerWrapImg, uvDtfImg, stickersImg],
    featured: true,
    bestSeller: false,
    isCustomizable: true,
    rating: 4.92,
    reviewCount: 1640,
    specifications: {
      pressTemp: 'No Heat Press Needed',
      pressTime: 'Instant Peel & Stick Application',
      pressPressure: 'Hand or Squeegee Pressure',
      peelType: 'Firm Rub & Smooth Film Peel',
      material: 'UV Curable Ink + 3D Gloss Varnish + High Tack Film',
      durability: 'Scratch Proof & Water Resistant',
      turnaround: 'Ships in 1-2 Business Days'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 10, pricePerUnit: 4.50, discountPercentage: 0 },
      { minQty: 11, maxQty: 25, pricePerUnit: 3.50, discountPercentage: 22 },
      { minQty: 26, maxQty: 50, pricePerUnit: 2.75, discountPercentage: 38 },
      { minQty: 51, pricePerUnit: 2.10, discountPercentage: 53 },
    ],
    variants: [
      { id: 'uv-3x3', name: '3" x 3" Decal Sticker', sku: 'UV-03-03', price: 3.50, stock: 5000, attributes: { size: '3" x 3"' } },
      { id: 'uv-4x4', name: '4" x 4" Decal Sticker', sku: 'UV-04-04', price: 4.50, stock: 4500, attributes: { size: '4" x 4"' } },
      { id: 'uv-tumbler', name: '9.3" x 8.2" Full Tumbler Wrap (20oz)', sku: 'UV-TUMB-20', price: 8.95, stock: 3200, attributes: { size: '20oz Wrap' } },
      { id: 'uv-tumbler-40', name: '11" x 10" Stanley 40oz Wrap', sku: 'UV-TUMB-40', price: 11.50, stock: 2800, attributes: { size: '40oz Wrap' } },
    ]
  },
  {
    id: 'prod-heavyweight-blank-tee',
    name: 'Pro-Club Style Heavyweight 6.5oz Cotton Tee',
    slug: 'heavyweight-blank-cotton-tshirt',
    category: 'blank-apparel',
    shortDescription: 'Premium vintage relaxed fit streetwear blank garment optimized for DTF heat pressing.',
    description: 'The ultimate canvas for your DTF transfers. Crafted from 100% carded ring-spun combed cotton (6.5 oz/yd²) with a thick ribbed collar, double-needle stitching, and preshrunk fabric. Specially treated to eliminate fabric sizing for maximum DTF adhesive absorption and wash longevity.',
    price: 6.95,
    compareAtPrice: 9.50,
    images: [blankApparelImg, heroImg],
    featured: false,
    bestSeller: true,
    rating: 4.88,
    reviewCount: 920,
    specifications: {
      material: '100% Combed Ringspun Cotton (6.5 oz / 220 GSM)',
      turnaround: 'In Stock - Ships Same Day',
      durability: 'Heavyweight Preshrunk Streetwear Spec'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 11, pricePerUnit: 6.95, discountPercentage: 0 },
      { minQty: 12, maxQty: 35, pricePerUnit: 5.95, discountPercentage: 14 },
      { minQty: 36, maxQty: 71, pricePerUnit: 5.25, discountPercentage: 24 },
      { minQty: 72, pricePerUnit: 4.65, discountPercentage: 33 },
    ],
    variants: [
      { id: 'tee-blk-m', name: 'Vintage Black - Medium', sku: 'TEE-BLK-M', price: 6.95, stock: 240, attributes: { color: 'Black', size: 'M' } },
      { id: 'tee-blk-l', name: 'Vintage Black - Large', sku: 'TEE-BLK-L', price: 6.95, stock: 380, attributes: { color: 'Black', size: 'L' } },
      { id: 'tee-blk-xl', name: 'Vintage Black - XL', sku: 'TEE-BLK-XL', price: 6.95, stock: 190, attributes: { color: 'Black', size: 'XL' } },
      { id: 'tee-wht-l', name: 'Bone White - Large', sku: 'TEE-WHT-L', price: 6.95, stock: 15, attributes: { color: 'White', size: 'L' } }, // low stock
      { id: 'tee-gry-l', name: 'Washed Charcoal - Large', sku: 'TEE-GRY-L', price: 6.95, stock: 0, attributes: { color: 'Charcoal', size: 'L' } }, // out of stock
    ]
  },
  {
    id: 'prod-pro-heat-press-15x15',
    name: 'Ambalvee Pro 15" x 15" Auto-Open Heat Press',
    slug: 'ambalvee-pro-auto-open-heat-press',
    category: 'supplies',
    shortDescription: 'Industrial electromagnetic auto-open clamshell heat press with digital touchscreen control.',
    description: 'Designed specifically for high-volume DTF printing shops. Features an electromagnetic release mechanism that pops open automatically when the timer reaches zero, preventing scorched shirts. Thick cast-aluminum heat platen with edge-to-edge heat distribution, laser-guided alignment support, and slide-out bottom drawer.',
    price: 349.00,
    compareAtPrice: 420.00,
    images: [heatPressImg, heroImg],
    featured: false,
    bestSeller: false,
    rating: 4.96,
    reviewCount: 310,
    specifications: {
      pressTemp: 'Up to 450°F (232°C)',
      pressPressure: 'Adjustable Over-the-Center Clamp',
      material: 'Cast Heavy-Gauge Steel Body',
      turnaround: 'Ships via Freight Ground (2-3 Days)'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 349.00, discountPercentage: 0 },
    ],
    variants: [
      { id: 'press-std', name: 'Standard 15" x 15" Auto-Open', sku: 'EQ-HP-1515', price: 349.00, stock: 24, attributes: { type: 'Standard Platen' } },
      { id: 'press-threadable', name: '15" x 15" Threadable Base Edition', sku: 'EQ-HP-1515T', price: 389.00, stock: 8, attributes: { type: 'Threadable' } },
    ]
  },
  {
    id: 'prod-sample-pack',
    name: 'Ambalvee DTF & UV DTF Sample Kit',
    slug: 'ambalvee-sample-pack-kit',
    category: 'sample-packs',
    shortDescription: 'Test our print clarity, color brilliance, stretch, and wash endurance risk-free on your garments.',
    description: 'Experience the Ambalvee Transfers quality before placing your bulk order. Kit contains 6 pre-printed custom DTF transfers in various color gradients and fine line work, 2 UV DTF hard-surface decals, pressing instruction parchment, and our $10 store credit coupon towards your first custom order.',
    price: 1.00,
    compareAtPrice: 15.00,
    images: [gangSheetImg, heroImg],
    featured: true,
    bestSeller: false,
    rating: 4.99,
    reviewCount: 12450,
    specifications: {
      turnaround: 'In Stock - Dispatched within 12 Hours',
      material: 'Sample DTF Film + UV Stickers + Guide Sheet'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 1.00, discountPercentage: 0 },
    ],
    variants: [
      { id: 'samp-full', name: 'Complete DTF + UV DTF Sample Pack', sku: 'SAMP-ALL', price: 1.00, stock: 850, attributes: { type: 'Full Kit' } }
    ]
  },
  // Patches & Stickers (Matching User Screenshot)
  {
    id: 'prod-patch-standard-embroidery',
    name: 'Custom Standard Embroidery Patches',
    slug: 'standard-embroidery-patches',
    category: 'patches-stickers',
    shortDescription: 'Classic textured thread embroidery patches with iron-on or hook-and-loop backing.',
    description: 'Traditional tight-weave twill and polyester thread embroidered patches. Merrowed border edging, crisp color separation, and heat-seal iron-on or Velcro backing. Low 10-piece minimum.',
    price: 1.34,
    compareAtPrice: 2.25,
    images: [patchesImg, heroImg],
    featured: true,
    bestSeller: true,
    rating: 4.95,
    reviewCount: 1420,
    specifications: {
      material: '100% Polyester Twill & Thread',
      durability: 'Commercial Washable',
      turnaround: 'Dispatches in 3-5 Business Days'
    },
    volumeTiers: [
      { minQty: 10, maxQty: 49, pricePerUnit: 1.95, discountPercentage: 0 },
      { minQty: 50, maxQty: 99, pricePerUnit: 1.55, discountPercentage: 20 },
      { minQty: 100, pricePerUnit: 1.34, discountPercentage: 31 },
    ],
    variants: [
      { id: 'v-emb-2', name: '2.5" Standard Iron-On', sku: 'PAT-EMB-25', price: 1.34, stock: 4500, attributes: { size: '2.5"' } },
      { id: 'v-emb-3', name: '3.5" Standard Iron-On', sku: 'PAT-EMB-35', price: 1.85, stock: 3200, attributes: { size: '3.5"' } }
    ]
  },
  {
    id: 'prod-patch-full-color-printed',
    name: 'Full Color Printed Sublimated Patches',
    slug: 'full-color-printed-patches',
    category: 'patches-stickers',
    shortDescription: 'Photographic gradient resolution patches with embroidered marrowed borders.',
    description: 'Capture micro-fine photographic gradients and intricate typography that standard embroidery cannot stitch. High-definition dye-sublimated twill with authentic embroidered border.',
    price: 0.84,
    compareAtPrice: 1.50,
    images: [patchesImg, uvDtfImg],
    featured: true,
    bestSeller: false,
    rating: 4.91,
    reviewCount: 890,
    specifications: {
      material: 'Sublimated Micro-Twill + Overlocked Border',
      turnaround: 'Ships in 3 Days'
    },
    volumeTiers: [
      { minQty: 10, maxQty: 49, pricePerUnit: 1.30, discountPercentage: 0 },
      { minQty: 50, pricePerUnit: 0.84, discountPercentage: 35 },
    ],
    variants: [
      { id: 'v-print-3', name: '3" Printed Patch', sku: 'PAT-PRT-30', price: 0.84, stock: 6000, attributes: { size: '3"' } }
    ]
  },
  {
    id: 'prod-patch-pvc-rubber',
    name: 'Custom 3D PVC Rubber Patches',
    slug: 'custom-pvc-rubber-patches',
    category: 'patches-stickers',
    shortDescription: 'Flexible weatherproof tactical 3D molded rubber patches with sewing channel.',
    description: 'Tactical-grade soft PVC rubber patches with multi-level 3D embossing. 100% waterproof, mud-proof, and fade-resistant. Includes military hook-and-loop velcro or heat seal backing.',
    price: 1.97,
    compareAtPrice: 3.10,
    images: [leatherPatchesImg, patchesImg],
    featured: false,
    bestSeller: true,
    rating: 4.97,
    reviewCount: 1120,
    specifications: {
      material: 'Flexible Weatherproof PVC Rubber',
      durability: 'Extreme Outdoor & Tactical Durability'
    },
    volumeTiers: [
      { minQty: 10, maxQty: 49, pricePerUnit: 2.80, discountPercentage: 0 },
      { minQty: 50, pricePerUnit: 1.97, discountPercentage: 30 },
    ],
    variants: [
      { id: 'v-pvc-3', name: '3" Molded PVC Rubber', sku: 'PAT-PVC-30', price: 1.97, stock: 2500, attributes: { size: '3"' } }
    ]
  },
  {
    id: 'prod-patch-genuine-leather',
    name: 'Laser-Etched Genuine Leather Patches',
    slug: 'genuine-leather-patches',
    category: 'patches-stickers',
    shortDescription: 'Premium top-grain cowhide leather patches laser engraved for hats and outerwear.',
    description: '100% authentic genuine American cowhide leather with natural grain variations. Precision high-contrast laser ablation produces deep dark burned artwork. Ideal for trucker snapbacks and beanies.',
    price: 1.22,
    compareAtPrice: 2.00,
    images: [leatherPatchesImg, blankApparelImg],
    featured: true,
    bestSeller: true,
    rating: 4.94,
    reviewCount: 2040,
    specifications: {
      material: '100% Top-Grain Cowhide Leather',
      turnaround: 'Ships in 2-4 Days'
    },
    volumeTiers: [
      { minQty: 10, maxQty: 49, pricePerUnit: 1.75, discountPercentage: 0 },
      { minQty: 50, pricePerUnit: 1.22, discountPercentage: 30 },
    ],
    variants: [
      { id: 'v-lea-caramel', name: 'Caramel Tan 3" x 2" Oval', sku: 'PAT-LEA-TAN', price: 1.22, stock: 3800, attributes: { color: 'Caramel' } },
      { id: 'v-lea-dark', name: 'Raw Hide Dark Brown 3" x 2"', sku: 'PAT-LEA-BRN', price: 1.22, stock: 2900, attributes: { color: 'Dark Brown' } }
    ]
  },
  {
    id: 'prod-patch-chenille-varsity',
    name: 'Retro Chenille Letter Varsity Patches',
    slug: 'chenille-varsity-patches',
    category: 'patches-stickers',
    shortDescription: 'Plush vintage collegiate varsity letterman chenille loop patches.',
    description: 'Thick, fluffy textured chenille pile with gold bullion stitch border on heavy wool felt. Creates the authentic vintage high school letterman jacket aesthetic for streetwear brands.',
    price: 3.07,
    compareAtPrice: 4.50,
    images: [patchesImg, leatherPatchesImg],
    featured: false,
    bestSeller: false,
    rating: 4.89,
    reviewCount: 650,
    specifications: {
      material: 'Plush Chenille Loop Yarn + Double Felt Backing',
      durability: 'Dry Clean or Gentle Cold Wash'
    },
    volumeTiers: [
      { minQty: 10, pricePerUnit: 3.07, discountPercentage: 0 },
    ],
    variants: [
      { id: 'v-chen-4', name: '4" Varsity Letter', sku: 'PAT-CHN-40', price: 3.07, stock: 1800, attributes: { size: '4"' } }
    ]
  },
  // Specialty DTF
  {
    id: 'prod-dtf-glitter-specialty',
    name: 'Glitter Sparkle Custom DTF Transfers',
    slug: 'glitter-sparkle-dtf-transfers',
    category: 'specialty-dtf',
    shortDescription: 'Ultra-reflective diamond glitter embedded directly inside custom DTF transfer film.',
    description: 'Real micro-sparkle diamond glitter flakes infused into the polyurethane matrix. Shimmers brilliantly in sunlight and stage lights with zero glitter shedding onto fabrics.',
    price: 2.95,
    compareAtPrice: 4.25,
    images: [specialtyImg, heroImg],
    featured: true,
    bestSeller: true,
    isCustomizable: true,
    rating: 4.96,
    reviewCount: 940,
    specifications: {
      pressTemp: '305°F (152°C)',
      pressTime: '15 Seconds',
      peelType: 'Cold Peel Only',
      durability: '60+ Washes without glitter fallout'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 2.95, discountPercentage: 0 },
      { minQty: 10, maxQty: 49, pricePerUnit: 2.35, discountPercentage: 20 },
      { minQty: 50, pricePerUnit: 1.85, discountPercentage: 37 },
    ],
    variants: [
      { id: 'v-glt-4x4', name: '4" x 4" Glitter Chest Print', sku: 'DTF-GLT-04', price: 2.95, stock: 5000, attributes: { size: '4" x 4"' } },
      { id: 'v-glt-11x11', name: '11" x 11" Glitter Adult Standard', sku: 'DTF-GLT-11', price: 6.95, stock: 3500, attributes: { size: '11" x 11"' } }
    ]
  },
  {
    id: 'prod-dtf-glow-in-dark',
    name: 'Glow-in-the-Dark Phosphorescent DTF',
    slug: 'glow-in-the-dark-dtf-transfers',
    category: 'specialty-dtf',
    shortDescription: 'High-luminance electric green/blue phosphorescent glow heat transfers.',
    description: 'Charges quickly under daylight or UV blacklight to emit an intense green-white glow in pitch darkness. Perfect for concert merchandise, Halloween lines, safety crews, and gym apparel.',
    price: 3.25,
    compareAtPrice: 4.80,
    images: [specialtyImg, gangSheetImg],
    featured: false,
    bestSeller: false,
    isCustomizable: true,
    rating: 4.92,
    reviewCount: 420,
    specifications: {
      pressTemp: '300°F (150°C)',
      pressTime: '12-14 Seconds',
      peelType: 'Warm or Cold Peel'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 3.25, discountPercentage: 0 },
      { minQty: 10, pricePerUnit: 2.60, discountPercentage: 20 },
    ],
    variants: [
      { id: 'v-glow-4', name: '4" x 4" Glow Pocket', sku: 'DTF-GLO-04', price: 3.25, stock: 2400, attributes: { size: '4" x 4"' } }
    ]
  },
  // Apparel & Supplies Demo Items
  {
    id: 'prod-hoodie-heavyweight-fleece',
    name: 'Heavyweight 10oz Oversized Streetwear Hoodie',
    slug: 'heavyweight-streetwear-hoodie',
    category: 'blank-apparel',
    shortDescription: 'Dense 330 GSM fleece cotton-poly blend hoodie tailored for DTF chest and back prints.',
    description: 'Super heavyweight 3-end fleece with double-needle construction, generous kangaroo pocket, and unlined 3-piece hood. Preshrunk with brushed interior for ultra-luxurious streetwear hand-feel.',
    price: 14.50,
    compareAtPrice: 22.00,
    images: [blankApparelImg, heroImg],
    featured: true,
    bestSeller: true,
    rating: 4.95,
    reviewCount: 1680,
    specifications: {
      material: '80% Combed Ringspun Cotton / 20% Polyester (10 oz / 330 GSM)',
      turnaround: 'In Stock - Dispatches Today'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 11, pricePerUnit: 14.50, discountPercentage: 0 },
      { minQty: 12, maxQty: 35, pricePerUnit: 12.75, discountPercentage: 12 },
      { minQty: 36, pricePerUnit: 11.20, discountPercentage: 23 },
    ],
    variants: [
      { id: 'hd-blk-l', name: 'Washed Charcoal Black - Large', sku: 'HD-BLK-L', price: 14.50, stock: 240, attributes: { size: 'L' } },
      { id: 'hd-blk-xl', name: 'Washed Charcoal Black - XL', sku: 'HD-BLK-XL', price: 14.50, stock: 180, attributes: { size: 'XL' } }
    ]
  },
  {
    id: 'prod-tote-canvas-heavy',
    name: 'Heavy 12oz 100% Cotton Canvas Tote Bag',
    slug: 'heavy-canvas-tote-bag',
    category: 'blank-apparel',
    shortDescription: 'Reinforced stress points, 22" handles, flat bottom gusset ready for pressing.',
    description: 'Durable eco-friendly 12oz heavy duck canvas tote bag. Natural cotton weave absorbs DTF adhesive flawlessly, making it the most profitable promotional item for merchandise drops.',
    price: 2.85,
    compareAtPrice: 4.50,
    images: [blankApparelImg, uvDtfImg],
    featured: false,
    bestSeller: true,
    rating: 4.88,
    reviewCount: 910,
    specifications: {
      material: '100% Heavy Duck Cotton Canvas (12 oz)',
      turnaround: 'In Stock'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 24, pricePerUnit: 2.85, discountPercentage: 0 },
      { minQty: 25, pricePerUnit: 2.15, discountPercentage: 25 },
    ],
    variants: [
      { id: 'tote-nat', name: 'Natural Cotton Canvas', sku: 'BG-TOT-NAT', price: 2.85, stock: 1200, attributes: { color: 'Natural' } }
    ]
  },
  {
    id: 'prod-teflon-sheets-pack',
    name: 'Commercial Non-Stick Teflon Press Sheets (5-Pack)',
    slug: 'teflon-heat-sheets-pack',
    category: 'supplies',
    shortDescription: '16" x 20" reusable heat-resistant PTFE sheets for flawless matte finish and platen protection.',
    description: 'Heavyweight 0.11mm thick PTFE fiberglass sheets rated up to 600°F (315°C). Eliminates scorched garment fibers and delivers the signature ultra-soft matte finish on post-pressing.',
    price: 12.99,
    compareAtPrice: 18.00,
    images: [heroImg, gangSheetImg],
    featured: false,
    bestSeller: true,
    rating: 4.98,
    reviewCount: 2200,
    specifications: {
      material: 'Industrial PTFE Coated Fiberglass',
      durability: 'Reusable over 1,000 Presses'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 12.99, discountPercentage: 0 },
    ],
    variants: [
      { id: 'tef-5pk', name: '16" × 20" 5-Pack', sku: 'SUP-TEF-05', price: 12.99, stock: 650, attributes: { pack: '5 Sheets' } }
    ]
  },
  // Additional DTF Transfer Demo Products
  {
    id: 'prod-dtf-pocket-2x2',
    name: '2" × 2" Pocket & Sleeve Mini DTF Transfers',
    slug: 'pocket-sleeve-mini-dtf-transfers',
    category: 'dtf-transfers',
    shortDescription: 'Ideal for hat bills, front pockets, wrist cuffs, neck branding tags and small badges.',
    description: 'Crisp micro-detail DTF heat transfers engineered for smaller garments and accessory placements. Zero weeding, transparent backing, ready to heat press in 10-15 seconds.',
    price: 1.25,
    compareAtPrice: 2.00,
    images: [heroImg, gangSheetImg],
    featured: false,
    bestSeller: true,
    isCustomizable: true,
    rating: 4.93,
    reviewCount: 1540,
    specifications: {
      pressTemp: '300°F - 320°F',
      pressTime: '10 - 12 Seconds',
      peelType: 'Warm or Cold Peel',
      durability: '100+ Washes'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 24, pricePerUnit: 1.25, discountPercentage: 0 },
      { minQty: 25, maxQty: 49, pricePerUnit: 0.95, discountPercentage: 24 },
      { minQty: 50, pricePerUnit: 0.65, discountPercentage: 48 },
    ],
    variants: [
      { id: 'v-pock-2x2', name: '2" x 2" Pack', sku: 'DTF-MINI-02', price: 1.25, stock: 9999, attributes: { size: '2" x 2"' } }
    ]
  },
  {
    id: 'prod-dtf-chest-4x4',
    name: '4" × 4" Left Chest Standard DTF Transfers',
    slug: 'left-chest-standard-dtf-transfers',
    category: 'dtf-transfers',
    shortDescription: 'Industry standard size for left chest corporate logos, crests, and brand symbols.',
    description: 'High-opacity white underbase ensures vibrant punchy color even on pitch black or dark navy shirts. Tested against industrial washing without cracking or fading.',
    price: 2.45,
    compareAtPrice: 3.50,
    images: [heroImg, blankApparelImg],
    featured: true,
    bestSeller: true,
    isCustomizable: true,
    rating: 4.96,
    reviewCount: 2890,
    specifications: {
      pressTemp: '305°F',
      pressTime: '12 - 15 Seconds',
      peelType: 'Instant Warm Peel'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 24, pricePerUnit: 2.45, discountPercentage: 0 },
      { minQty: 25, maxQty: 49, pricePerUnit: 1.75, discountPercentage: 28 },
      { minQty: 50, pricePerUnit: 1.25, discountPercentage: 49 },
    ],
    variants: [
      { id: 'v-chest-4x4', name: '4" x 4" Left Chest', sku: 'DTF-CHEST-04', price: 2.45, stock: 9999, attributes: { size: '4" x 4"' } }
    ]
  },
  {
    id: 'prod-dtf-oversize-12x17',
    name: '12" × 17" Jumbo Streetwear Back Print Transfers',
    slug: 'jumbo-streetwear-back-dtf-transfers',
    category: 'dtf-transfers',
    shortDescription: 'Huge high-impact back graphics and full front streetwear poster designs.',
    description: 'Fill the entire back canvas of oversized hoodies and heavyweight boxy tees. Soft-hand finish ensures the large transfer drapes naturally without feeling heavy or rubbery.',
    price: 7.95,
    compareAtPrice: 11.50,
    images: [heroImg, gangSheetImg],
    featured: true,
    bestSeller: true,
    isCustomizable: true,
    rating: 4.97,
    reviewCount: 3410,
    specifications: {
      pressTemp: '310°F',
      pressTime: '15 Seconds',
      peelType: 'Cold Peel Recommended'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 7.95, discountPercentage: 0 },
      { minQty: 10, maxQty: 24, pricePerUnit: 5.95, discountPercentage: 25 },
      { minQty: 25, pricePerUnit: 4.50, discountPercentage: 43 },
    ],
    variants: [
      { id: 'v-jumbo-12x17', name: '12" x 17" Jumbo', sku: 'DTF-JUMB-17', price: 7.95, stock: 9999, attributes: { size: '12" x 17"' } }
    ]
  },
  // Additional Gang Sheet Sizes
  {
    id: 'prod-gang-22x24',
    name: '22" × 24" Starter DTF Gang Sheet Roll',
    slug: 'starter-dtf-gang-sheet-22x24',
    category: 'gang-sheets',
    shortDescription: 'Compact gang roll fitting approximately 6 to 10 logos at wholesale pricing.',
    description: 'Perfect for small merchandise runs, sample testing, and pop-up events. Print multiple designs on one sheet to maximize efficiency.',
    price: 19.99,
    compareAtPrice: 28.00,
    images: [gangSheetImg, heroImg],
    featured: false,
    bestSeller: true,
    isGangSheet: true,
    rating: 4.94,
    reviewCount: 1820,
    specifications: {
      turnaround: 'Prints in 24 Hours',
      material: '22" Industrial Matte PET Film'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 19.99, discountPercentage: 0 },
      { minQty: 5, pricePerUnit: 16.50, discountPercentage: 17 }
    ],
    variants: [
      { id: 'v-gs-24', name: '22" x 24"', sku: 'GS-22-24', price: 19.99, stock: 1200, attributes: { length: '24"' } }
    ]
  },
  {
    id: 'prod-gang-22x120',
    name: '22" × 120" Pro Printshop Gang Sheet Roll (10 ft)',
    slug: 'pro-dtf-gang-sheet-roll-22x120',
    category: 'gang-sheets',
    shortDescription: '10-foot continuous master roll fitting 40 to 60+ full-color designs.',
    description: 'High-yield commercial roll for active screen printing shops and apparel brand runs. Huge bulk savings over individual transfer orders.',
    price: 74.99,
    compareAtPrice: 105.00,
    images: [gangSheetImg, heroImg],
    featured: true,
    bestSeller: true,
    isGangSheet: true,
    rating: 4.99,
    reviewCount: 2650,
    specifications: {
      turnaround: 'Same-Day Dispatch',
      material: 'High-Density 22" Matte PET Film'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 74.99, discountPercentage: 0 },
      { minQty: 3, pricePerUnit: 64.99, discountPercentage: 13 }
    ],
    variants: [
      { id: 'v-gs-120', name: '22" x 120" (10ft)', sku: 'GS-22-120', price: 74.99, stock: 850, attributes: { length: '120"' } }
    ]
  },
  // Additional UV DTF Decals
  {
    id: 'prod-uv-tumbler-20oz',
    name: '20oz Skinny Tumbler Full Wrap UV Decal',
    slug: '20oz-skinny-tumbler-full-wrap-uv',
    category: 'uv-dtf',
    shortDescription: 'Pre-sized 9.3" × 8.2" seamless 3D embossed wrap for insulated skinny drinkware.',
    description: 'High-gloss raised 3D varnish creates a tactile, luxurious textured grip on tumblers. Industrial waterproof adhesive withstands daily dishwashing.',
    price: 8.95,
    compareAtPrice: 12.50,
    images: [uvDtfImg, gangSheetImg],
    featured: true,
    bestSeller: true,
    rating: 4.95,
    reviewCount: 1420,
    specifications: {
      durability: 'Dishwasher Safe & Scratch Proof',
      material: 'UV Curable Ink + High Gloss Varnish'
    },
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 8.95, discountPercentage: 0 },
      { minQty: 10, pricePerUnit: 6.95, discountPercentage: 22 }
    ],
    variants: [
      { id: 'v-uv-tumb20', name: '20oz Skinny Wrap', sku: 'UV-TUMB-20', price: 8.95, stock: 3200, attributes: { size: '20oz' } }
    ]
  },
  {
    id: 'prod-uv-stanley-40oz',
    name: '40oz Stanley Tumbler Curved Decal Wrap',
    slug: '40oz-stanley-tumbler-uv-wrap',
    category: 'uv-dtf',
    shortDescription: 'Custom contour wrap pre-measured for 40oz handle tumblers with raised 3D shine.',
    description: 'Precision curved die lines fit smoothly around handle brackets and tapered bases. Stick firmly to stainless steel, powder-coated, or smooth acrylic surfaces.',
    price: 11.50,
    compareAtPrice: 16.00,
    images: [uvDtfImg, heroImg],
    featured: false,
    bestSeller: true,
    rating: 4.96,
    reviewCount: 2150,
    specifications: {
      durability: '100% Waterproof & Weatherproof'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 11.50, discountPercentage: 0 },
      { minQty: 10, pricePerUnit: 8.95, discountPercentage: 22 }
    ],
    variants: [
      { id: 'v-uv-stan40', name: '40oz Stanley Wrap', sku: 'UV-STAN-40', price: 11.50, stock: 2100, attributes: { size: '40oz' } }
    ]
  },
  // Additional Specialty DTF
  {
    id: 'prod-dtf-reflective-silver',
    name: 'High-Visibility Safety Reflective Silver DTF',
    slug: 'high-vis-reflective-silver-dtf',
    category: 'specialty-dtf',
    shortDescription: 'Micro-glass prism retro-reflective transfers for night safety, running gear & techwear.',
    description: 'Reflects direct headlight beams and flash photography with an intense blinding white-silver reflection. Meets ANSI safety reflectivity standards for high-visibility workwear.',
    price: 3.75,
    compareAtPrice: 5.50,
    images: [heroImg, uvDtfImg],
    featured: true,
    bestSeller: false,
    isCustomizable: true,
    rating: 4.94,
    reviewCount: 580,
    specifications: {
      pressTemp: '305°F',
      pressTime: '15 Seconds',
      peelType: 'Cold Peel Only'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 3.75, discountPercentage: 0 },
      { minQty: 25, pricePerUnit: 2.75, discountPercentage: 26 }
    ],
    variants: [
      { id: 'v-refl-4x4', name: '4" x 4" Reflective', sku: 'DTF-REFL-04', price: 3.75, stock: 3200, attributes: { size: '4" x 4"' } }
    ]
  },
  {
    id: 'prod-dtf-puff-3d',
    name: '3D Puff Raised Velvet DTF Heat Transfers',
    slug: '3d-puff-raised-velvet-dtf',
    category: 'specialty-dtf',
    shortDescription: 'Expands 3D under heat to create a velvety embossed marshmallow puff effect.',
    description: 'Give typography and logos a high-end streetwear dimension. The transfer puffs up during the heat press cycle for an authentic 3D tactile finish.',
    price: 3.50,
    compareAtPrice: 5.00,
    images: [blankApparelImg, heroImg],
    featured: true,
    bestSeller: true,
    isCustomizable: true,
    rating: 4.98,
    reviewCount: 1890,
    specifications: {
      pressTemp: '290°F - 300°F',
      pressTime: '10 Seconds Medium Pressure',
      peelType: 'Warm Peel'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 3.50, discountPercentage: 0 },
      { minQty: 25, pricePerUnit: 2.50, discountPercentage: 28 }
    ],
    variants: [
      { id: 'v-puff-4x4', name: '4" x 4" 3D Puff', sku: 'DTF-PUFF-04', price: 3.50, stock: 4500, attributes: { size: '4" x 4"' } }
    ]
  },
  // Additional Blank Garments
  {
    id: 'prod-crewneck-sweatshirt',
    name: 'Heavy 9oz Classic Streetwear Crewneck Sweatshirt',
    slug: 'classic-heavyweight-crewneck-sweatshirt',
    category: 'blank-apparel',
    shortDescription: 'Substantial 300 GSM cotton-poly crewneck fleece with side gussets and ribbed collar.',
    description: 'Clean front chest area free from center seams for smooth transfer placement. Thick fleece interior provides all-day warmth and premium retail drape.',
    price: 12.80,
    compareAtPrice: 18.50,
    images: [blankApparelImg, heroImg],
    featured: false,
    bestSeller: true,
    rating: 4.91,
    reviewCount: 760,
    specifications: {
      material: '80% Cotton / 20% Polyester Heavy Fleece'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 12.80, discountPercentage: 0 },
      { minQty: 12, pricePerUnit: 10.50, discountPercentage: 18 }
    ],
    variants: [
      { id: 'v-crw-blk-l', name: 'Vintage Black - Large', sku: 'CRW-BLK-L', price: 12.80, stock: 190, attributes: { size: 'L' } }
    ]
  },
  {
    id: 'prod-trucker-foam-snapback',
    name: '5-Panel Foam Front Trucker Mesh Snapback',
    slug: 'foam-front-trucker-mesh-snapback',
    category: 'blank-apparel',
    shortDescription: 'Seamless foam front panel engineered for easy cap heat press transfer application.',
    description: 'High-profile structured crown with breathable rear mesh and adjustable double-snap closure. Perfect surface for 4" x 2" leather patches or 2" x 2" DTF logos.',
    price: 4.25,
    compareAtPrice: 6.50,
    images: [blankApparelImg, uvDtfImg],
    featured: false,
    bestSeller: false,
    rating: 4.87,
    reviewCount: 520,
    specifications: {
      material: '100% Polyester Foam Front & Nylon Mesh'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 4.25, discountPercentage: 0 },
      { minQty: 24, pricePerUnit: 3.25, discountPercentage: 23 }
    ],
    variants: [
      { id: 'v-hat-blk', name: 'Solid Black Trucker', sku: 'HAT-TRK-BLK', price: 4.25, stock: 750, attributes: { color: 'Black' } }
    ]
  },
  // Additional Supplies
  {
    id: 'prod-thermal-tape-3pack',
    name: 'High-Temperature Heat Resistant Polyimide Tape (3-Pack)',
    slug: 'thermal-heat-resistant-tape-3pack',
    category: 'supplies',
    shortDescription: 'Secures transfers firmly to garments without leaving sticky adhesive residue under heat.',
    description: 'Rated up to 500°F (260°C). Keeps multi-piece gang graphics and pocket designs precisely in place on the heat press without ghosting or shifting.',
    price: 5.99,
    compareAtPrice: 8.50,
    images: [heroImg, gangSheetImg],
    featured: false,
    bestSeller: true,
    rating: 4.95,
    reviewCount: 3100,
    specifications: {
      material: 'Polyimide Film with Silicone Adhesive',
      turnaround: 'In Stock'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 5.99, discountPercentage: 0 }
    ],
    variants: [
      { id: 'v-tape-3pk', name: '10mm × 33m (3 Rolls)', sku: 'SUP-TAPE-03', price: 5.99, stock: 1400, attributes: { pack: '3 Rolls' } }
    ]
  },
  {
    id: 'prod-temp-laser-gun',
    name: 'Digital Infrared Non-Contact Laser Thermometer',
    slug: 'digital-laser-infrared-thermometer',
    category: 'supplies',
    shortDescription: 'Verifies real platen temperature and eliminates cold spots across heat presses.',
    description: 'Many heat press digital dials drift by 15°F - 30°F over time. Instantly verify edge-to-edge heat uniformity to ensure 100% adhesive melt and foolproof wash longevity.',
    price: 24.99,
    compareAtPrice: 35.00,
    images: [heroImg, uvDtfImg],
    featured: false,
    bestSeller: false,
    rating: 4.93,
    reviewCount: 880,
    specifications: {
      material: 'ABS Plastic Body + Backlit LCD'
    },
    volumeTiers: [
      { minQty: 1, pricePerUnit: 24.99, discountPercentage: 0 }
    ],
    variants: [
      { id: 'v-laser-gun', name: 'Laser Temp Gun (-58°F to 932°F)', sku: 'SUP-TEMP-IR', price: 24.99, stock: 320, attributes: { type: 'Infrared' } }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-10492',
    orderNumber: 'NT-10492',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus@urbanthreads.co',
    shippingAddress: {
      fullName: 'Marcus Vance',
      email: 'marcus@urbanthreads.co',
      phone: '(555) 392-8812',
      addressLine1: '742 Evergreen Terrace',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'United States'
    },
    items: [
      {
        id: 'item-101',
        productId: 'prod-gang-sheet-builder',
        productName: 'Custom DTF Gang Sheet (Visual Builder)',
        variantName: '22" x 120" Pro Roll (10 ft)',
        quantity: 2,
        unitPrice: 74.99,
        totalPrice: 149.98,
        image: gangSheetImg,
        gangSheetConfig: {
          sheetWidth: 22,
          sheetLength: 120,
          elements: [
            { id: 'el-1', name: 'Urban Threads Front Logo', imageUrl: '', x: 1, y: 1, width: 11, height: 11, rotation: 0 },
            { id: 'el-2', name: 'Sleeve Badge', imageUrl: '', x: 13, y: 1, width: 4, height: 4, rotation: 0 },
          ],
          totalAreaUsedPercentage: 92,
          artfileName: 'urban_threads_spring26_gangsheet.pdf'
        }
      },
      {
        id: 'item-102',
        productId: 'prod-heavyweight-blank-tee',
        productName: 'Pro-Club Style Heavyweight 6.5oz Cotton Tee',
        variantName: 'Vintage Black - Large',
        quantity: 24,
        unitPrice: 5.95,
        totalPrice: 142.80,
        image: blankApparelImg
      }
    ],
    subtotal: 292.78,
    discountTotal: 29.28,
    shippingTotal: 0.00,
    taxTotal: 21.08,
    grandTotal: 284.58,
    couponCode: 'WELCOME10',
    shippingMethod: 'Free Ambalvee Priority (Over $75)',
    trackingNumber: '1Z9999999238491823',
    status: 'shipped',
    paymentStatus: 'pending',
    paymentMethod: 'Payment pending (demo record)',
    createdAt: '2026-10-08T14:22:00Z',
    updatedAt: '2026-10-09T09:15:00Z',
    notes: 'Artwork vector verified at 300 DPI by prepress operator.'
  },
  {
    id: 'ord-10493',
    orderNumber: 'NT-10493',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@studiocraft.io',
    shippingAddress: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova@studiocraft.io',
      phone: '(555) 728-1199',
      addressLine1: '1200 S Michigan Ave, Apt 4B',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60605',
      country: 'United States'
    },
    items: [
      {
        id: 'item-201',
        productId: 'prod-dtf-custom-size',
        productName: 'Custom DTF Heat Transfers by Size',
        variantName: '11" x 11" Adult Standard',
        quantity: 50,
        unitPrice: 1.99,
        totalPrice: 99.50,
        image: heroImg,
        customConfig: {
          sizePreset: '11" x 11" Adult Standard',
          widthInches: 11,
          heightInches: 11,
          fabricType: '100% Cotton & Blends',
          fabricColor: 'dark',
          artfileName: 'midnight_skate_club_backprint.png',
          artworkDpi: 300,
          hasTransparentBg: true
        }
      }
    ],
    subtotal: 99.50,
    discountTotal: 0.00,
    shippingTotal: 0.00,
    taxTotal: 8.96,
    grandTotal: 108.46,
    shippingMethod: 'Free Ambalvee Priority (Over $75)',
    status: 'in_production',
    paymentStatus: 'pending',
    paymentMethod: 'Payment pending (demo record)',
    createdAt: '2026-10-09T18:40:00Z',
    updatedAt: '2026-10-10T02:10:00Z',
    notes: 'On Roll Printer #3 (Mimaki TXF150).'
  },
  {
    id: 'ord-10494',
    orderNumber: 'NT-10494',
    customerName: 'Derrick Chen',
    customerEmail: 'dchen@summitathletic.com',
    shippingAddress: {
      fullName: 'Derrick Chen',
      email: 'dchen@summitathletic.com',
      phone: '(555) 441-2090',
      addressLine1: '88 Tech Blvd, Suite 300',
      city: 'Denver',
      state: 'CO',
      postalCode: '80202',
      country: 'United States'
    },
    items: [
      {
        id: 'item-301',
        productId: 'prod-uv-dtf-stickers',
        productName: 'UV DTF Custom Decals & Tumbler Wraps',
        variantName: '11" x 10" Stanley 40oz Wrap',
        quantity: 30,
        unitPrice: 11.50,
        totalPrice: 345.00,
        image: uvDtfImg,
        customConfig: {
          sizePreset: '11" x 10" Stanley 40oz Wrap',
          widthInches: 11,
          heightInches: 10,
          fabricType: 'Hard Goods / Stainless Steel',
          fabricColor: 'any',
          artfileName: 'summit_trail_fullwrap.ai',
          artworkDpi: 600,
          hasTransparentBg: true
        }
      }
    ],
    subtotal: 345.00,
    discountTotal: 51.75,
    shippingTotal: 24.99,
    taxTotal: 28.64,
    grandTotal: 346.88,
    couponCode: 'AMBALVEE15',
    shippingMethod: 'Rush Ambalvee Air (Next-Day)',
    status: 'artwork_review',
    paymentStatus: 'pending',
    paymentMethod: 'Payment pending (demo record)',
    createdAt: '2026-10-10T00:15:00Z',
    updatedAt: '2026-10-10T01:00:00Z',
    notes: 'Checking transparency underlay on edge gradients.'
  },
  {
    id: 'ord-10495',
    orderNumber: 'NT-10495',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@coastalprint.net',
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      email: 's.jenkins@coastalprint.net',
      phone: '(555) 890-4422',
      addressLine1: '320 Pacific Coast Hwy',
      city: 'San Diego',
      state: 'CA',
      postalCode: '92101',
      country: 'United States'
    },
    items: [
      {
        id: 'item-401',
        productId: 'prod-sample-pack',
        productName: 'Ambalvee DTF & UV DTF Sample Kit',
        variantName: 'Complete DTF + UV DTF Sample Pack',
        quantity: 1,
        unitPrice: 1.00,
        totalPrice: 1.00,
        image: gangSheetImg
      }
    ],
    subtotal: 1.00,
    discountTotal: 0.00,
    shippingTotal: 4.99,
    taxTotal: 0.48,
    grandTotal: 6.47,
    shippingMethod: 'Standard Ground Delivery',
    status: 'delivered',
    paymentStatus: 'pending',
    paymentMethod: 'Payment pending (demo record)',
    createdAt: '2026-10-06T11:00:00Z',
    updatedAt: '2026-10-08T16:30:00Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    fullName: 'Marcus Vance',
    email: 'marcus@urbanthreads.co',
    phone: '(555) 392-8812',
    ordersCount: 8,
    totalSpent: 2840.50,
    defaultAddress: {
      fullName: 'Marcus Vance',
      email: 'marcus@urbanthreads.co',
      phone: '(555) 392-8812',
      addressLine1: '742 Evergreen Terrace',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'United States'
    },
    registeredAt: '2025-11-14T10:00:00Z',
    status: 'active'
  },
  {
    id: 'cust-2',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@studiocraft.io',
    phone: '(555) 728-1199',
    ordersCount: 4,
    totalSpent: 940.20,
    defaultAddress: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova@studiocraft.io',
      phone: '(555) 728-1199',
      addressLine1: '1200 S Michigan Ave, Apt 4B',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60605',
      country: 'United States'
    },
    registeredAt: '2026-01-20T14:12:00Z',
    status: 'active'
  },
  {
    id: 'cust-3',
    fullName: 'Derrick Chen',
    email: 'dchen@summitathletic.com',
    phone: '(555) 441-2090',
    ordersCount: 3,
    totalSpent: 1210.88,
    registeredAt: '2026-03-05T09:30:00Z',
    status: 'active'
  },
  {
    id: 'cust-4',
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@coastalprint.net',
    phone: '(555) 890-4422',
    ordersCount: 1,
    totalSpent: 6.47,
    registeredAt: '2026-10-06T10:50:00Z',
    status: 'active'
  }
];

export const INITIAL_COUPONS: DiscountCoupon[] = [
  {
    id: 'coup-1',
    code: 'AMBALVEE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 50,
    usageCount: 412,
    maxUsage: 1000,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 9.99,
    minOrderValue: 40,
    usageCount: 885,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 20,
    usageCount: 1240,
    isActive: true
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    productId: 'prod-heavyweight-blank-tee',
    variantId: 'tee-blk-l',
    productName: 'Pro-Club Style Heavyweight Tee (Black - L)',
    quantityChange: -24,
    newBalance: 380,
    reason: 'sale',
    referenceId: 'NT-10492',
    timestamp: '2026-10-08T14:22:00Z',
    staffUser: 'Storefront Checkout'
  },
  {
    id: 'mov-2',
    productId: 'prod-pro-heat-press-15x15',
    variantId: 'press-std',
    productName: 'Ambalvee Pro 15" x 15" Auto-Open Heat Press',
    quantityChange: 15,
    newBalance: 24,
    reason: 'restock',
    referenceId: 'PO-2026-091',
    timestamp: '2026-10-07T11:00:00Z',
    staffUser: 'Warehouse Intake'
  },
  {
    id: 'mov-3',
    productId: 'prod-heavyweight-blank-tee',
    variantId: 'tee-wht-l',
    productName: 'Pro-Club Style Heavyweight Tee (Bone White - L)',
    quantityChange: -3,
    newBalance: 15,
    reason: 'damaged',
    referenceId: 'SCRAP-04',
    timestamp: '2026-10-06T16:20:00Z',
    staffUser: 'Quality Control'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'Order Shipped',
    entityType: 'order',
    entityId: 'NT-10492',
    details: 'Tracking number 1Z9999999238491823 added via UPS integration.',
    actor: 'Fulfillment Lead (Jordan)',
    timestamp: '2026-10-09T09:15:00Z'
  },
  {
    id: 'log-2',
    action: 'Artwork Prepress Approved',
    entityType: 'order',
    entityId: 'NT-10493',
    details: 'Resolution verified 300 DPI, white underbase generated.',
    actor: 'Prepress Operator (Alex)',
    timestamp: '2026-10-10T02:10:00Z'
  },
  {
    id: 'log-3',
    action: 'Coupon Updated',
    entityType: 'coupon',
    entityId: 'AMBALVEE15',
    details: 'Increased maximum usage limit to 1,000 redemptions.',
    actor: 'Marketing Director',
    timestamp: '2026-10-05T13:45:00Z'
  }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-dtf-custom-size',
    author: 'Tyler M., Print Shop Owner',
    rating: 5,
    title: 'Colors are unreal & washes like screen printing',
    comment: 'We pressed 200 shirts for a music festival client. The gradients popped vibrantly and the hand-feel is super soft with zero plastisol bulk. Ambalvee is our exclusive transfer partner now.',
    date: '2026-10-04',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-gang-sheet-builder',
    author: 'Jessica K., Apparel Brand Founder',
    rating: 5,
    title: 'Saved over $600 by using the gang sheet builder',
    comment: 'The builder tool makes it so easy to fit 40 chest logos and 60 neck labels on a single 120" roll. Arrived on my doorstep in 2 days perfectly cured and powdered.',
    date: '2026-10-02',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-uv-dtf-stickers',
    author: 'Carlos D., Merchandise Producer',
    rating: 5,
    title: 'Adhesion on Stanley tumblers is unbreakable',
    comment: 'Put these on stainless steel tumblers and ran them through 15 high-temp dishwasher cycles. Not a single peeling edge. The 3D embossed gloss finish looks like a $50 custom job.',
    date: '2026-09-28',
    verifiedPurchase: true
  }
];

export const INITIAL_MENU_HEADERS: MenuHeaderConfig[] = [
  {
    id: 'dtf',
    label: 'DTF Transfers',
    category: 'dtf-transfers',
    bannerText: 'Zero Weeding · 100+ Commercial Wash Endurance · Fast Dispatch',
    bannerButtonText: 'Shop All DTF Transfers',
    bannerButtonView: 'catalog',
    bannerButtonCategory: 'dtf-transfers',
    tabs: [
      {
        id: 'tab-dtf-sizes',
        tabName: 'CUSTOM DTF TRANSFERS',
        items: [
          {
            id: 'm-dtf-1',
            name: '2" × 2" Pocket & Sleeve DTF',
            tag: 'Zero Weeding',
            imageUrl: heroImg,
            description: 'Micro details for cuffs, pockets & tags',
            targetView: 'custom-dtf',
            targetProductId: 'prod-dtf-pocket-2x2',
            targetCategory: 'dtf-transfers'
          },
          {
            id: 'm-dtf-2',
            name: '4" × 4" Left Chest Standard',
            tag: 'Most Popular',
            imageUrl: heroImg,
            description: 'High-opacity white underbase on dark fabrics',
            targetView: 'custom-dtf',
            targetProductId: 'prod-dtf-chest-4x4',
            targetCategory: 'dtf-transfers'
          },
          {
            id: 'm-dtf-3',
            name: '9" × 9" Youth Front Transfer',
            tag: 'Vibrant Gradients',
            imageUrl: heroImg,
            description: 'Perfect proportions for youth tees & totes',
            targetView: 'custom-dtf',
            targetProductId: 'prod-dtf-custom-size',
            targetCategory: 'dtf-transfers'
          },
          {
            id: 'm-dtf-4',
            name: '11" × 11" Adult Standard Center',
            tag: 'Bestseller',
            imageUrl: heroImg,
            description: 'Flagship streetwear graphic print size',
            targetView: 'custom-dtf',
            targetProductId: 'prod-dtf-custom-size',
            targetCategory: 'dtf-transfers'
          },
          {
            id: 'm-dtf-5',
            name: '12" × 17" Oversized Back Graphic',
            tag: 'Heavy Impact',
            imageUrl: heroImg,
            description: 'Edge-to-edge statements for hoodies & jackets',
            targetView: 'custom-dtf',
            targetProductId: 'prod-dtf-custom-size',
            targetCategory: 'dtf-transfers'
          },
          {
            id: 'm-dtf-6',
            name: 'Custom Exact Dimensions',
            tag: 'Free Proofing',
            imageUrl: gangSheetImg,
            description: 'Input any width and height in inches',
            targetView: 'custom-dtf',
            targetProductId: 'prod-dtf-custom-size',
            targetCategory: 'dtf-transfers'
          }
        ]
      },
      {
        id: 'tab-dtf-gang',
        tabName: '22" GANG SHEET BUILDER',
        items: [
          {
            id: 'm-gang-1',
            name: '22" × 24" Small Roll',
            tag: 'Quick Run',
            imageUrl: gangSheetImg,
            description: 'Fit 15-20 chest logos on single roll',
            targetView: 'gang-sheet-builder',
            targetProductId: 'prod-gang-sheet-builder',
            targetCategory: 'gang-sheets'
          },
          {
            id: 'm-gang-2',
            name: '22" × 60" Medium Roll (5 ft)',
            tag: 'Shop Favorite',
            imageUrl: gangSheetImg,
            description: 'Optimal yield for merch drops & small batches',
            targetView: 'gang-sheet-builder',
            targetProductId: 'prod-gang-sheet-builder',
            targetCategory: 'gang-sheets'
          },
          {
            id: 'm-gang-3',
            name: '22" × 120" Pro Roll (10 ft)',
            tag: 'High Volume',
            imageUrl: gangSheetImg,
            description: 'Production roll for commercial printers',
            targetView: 'gang-sheet-builder',
            targetProductId: 'prod-gang-sheet-builder',
            targetCategory: 'gang-sheets'
          },
          {
            id: 'm-gang-4',
            name: '22" × 240" Wholesale Roll (20 ft)',
            tag: 'Bulk Batch',
            imageUrl: gangSheetImg,
            description: 'Continuous roll for automatic heat presses',
            targetView: 'gang-sheet-builder',
            targetProductId: 'prod-gang-sheet-builder',
            targetCategory: 'gang-sheets'
          },
          {
            id: 'm-gang-5',
            name: '22" × 360" Master Roll (30 ft)',
            tag: 'Max Efficiency',
            imageUrl: gangSheetImg,
            description: 'Maximum linear savings for commercial shops',
            targetView: 'gang-sheet-builder',
            targetProductId: 'prod-gang-sheet-builder',
            targetCategory: 'gang-sheets'
          },
          {
            id: 'm-gang-6',
            name: 'Upload Pre-Made Gang Sheet',
            tag: 'Instant Prepress',
            imageUrl: gangSheetImg,
            description: 'Send print-ready PDF/PNG at 300 DPI',
            targetView: 'gang-sheet-builder',
            targetProductId: 'prod-gang-sheet-builder',
            targetCategory: 'gang-sheets'
          }
        ]
      }
    ]
  },
  {
    id: 'uv',
    label: 'UV DTF PermaStickers',
    category: 'uv-dtf',
    bannerText: 'No Heat Press Needed · Waterproof & Dishwasher Safe · 3D Gloss Varnish',
    bannerButtonText: 'Shop All UV Decals',
    bannerButtonView: 'catalog',
    bannerButtonCategory: 'uv-dtf',
    tabs: [
      {
        id: 'tab-uv-decals',
        tabName: 'PEEL & STICK DECALS',
        items: [
          {
            id: 'm-uv-1',
            name: '3" × 3" 3D Gloss Decal',
            tag: 'No Heat Required',
            imageUrl: uvDtfImg,
            description: 'Tactile raised varnish on glass, plastic & wood',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-2',
            name: '4" × 4" Embossed UV Sticker',
            tag: 'Raised Varnish',
            imageUrl: uvDtfImg,
            description: 'Industrial bonding adhesive for helmets & laptops',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-3',
            name: 'Metallic Foil 3D Decal',
            tag: 'Reflective Shine',
            imageUrl: specialtyImg,
            description: 'High-lux gold and silver metallic embossed finish',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-4',
            name: 'Die-Cut Outdoor Decal',
            tag: 'Weatherproof',
            imageUrl: stickersImg,
            description: 'Heavy duty sun and water resistance',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-5',
            name: 'Clear Glass Drinkware Decals',
            tag: 'Dishwasher Safe',
            imageUrl: uvDtfImg,
            description: 'Flawless transparency for coffee mugs & beer cans',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-6',
            name: 'High-Tack Industrial Decals',
            tag: 'Ultra Bond',
            imageUrl: tumblerWrapImg,
            description: 'Binds securely to coated metals and powder coats',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          }
        ]
      },
      {
        id: 'tab-uv-wraps',
        tabName: 'TUMBLER & CUP WRAPS',
        items: [
          {
            id: 'm-uv-w1',
            name: '20oz Skinny Tumbler Wrap',
            tag: 'Seamless Fit',
            imageUrl: tumblerWrapImg,
            description: 'Precision dimensioned for 20oz straight tumblers',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-w2',
            name: '40oz Stanley Cup Full Wrap',
            tag: 'Trending',
            imageUrl: tumblerWrapImg,
            description: 'Engineered curve cut for 40oz handle mugs',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-w3',
            name: '16oz Glass Beer Can Wrap',
            tag: 'Ultra Clear',
            imageUrl: tumblerWrapImg,
            description: 'Complete 360-degree wrap for glassware',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-w4',
            name: 'Hydro Insulated Bottle Wrap',
            tag: 'Scratch Resistant',
            imageUrl: tumblerWrapImg,
            description: 'Rugged everyday finish for outdoor drinkware',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-w5',
            name: 'Full Bleed Wrap Sheets',
            tag: 'Edge-to-Edge',
            imageUrl: tumblerWrapImg,
            description: 'Continuous pattern decal sheets for custom cutting',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          },
          {
            id: 'm-uv-w6',
            name: 'Coffee Mug Decal Sets',
            tag: 'Thermal Resistant',
            imageUrl: uvDtfImg,
            description: 'Withstands hot water, tea, and steam washes',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'uv-dtf'
          }
        ]
      }
    ]
  },
  {
    id: 'blanks',
    label: 'Blank Apparel',
    category: 'blank-apparel',
    displayType: 'text-links',
    bannerText: 'Optimized Specifically for Maximum DTF Adhesive Fusion & 100+ Commercial Washes',
    bannerButtonText: 'Shop All Blank Garments',
    bannerButtonView: 'catalog',
    bannerButtonCategory: 'blank-apparel',
    tabs: [
      {
        id: 'tab-blanks-main',
        tabName: 'BLANK APPAREL COLLECTIONS',
        items: [
          // T-Shirts & Tops
          {
            id: 'm-blk-1',
            name: 'Pro-Club Style Heavyweight Tee (6.5oz)',
            columnGroup: 'T-Shirts & Tops',
            targetView: 'product-detail',
            targetProductId: 'prod-heavyweight-blank-tee',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-2',
            name: '100% Combed Ringspun Cotton Soft Tees',
            columnGroup: 'T-Shirts & Tops',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-3',
            name: 'Garment-Dyed Vintage Washed Tees',
            columnGroup: 'T-Shirts & Tops',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-4',
            name: 'Drop-Shoulder Boxy Streetwear Tees',
            columnGroup: 'T-Shirts & Tops',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-5',
            name: 'Long Sleeve Heavyweight Cotton Crewnecks',
            columnGroup: 'T-Shirts & Tops',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          
          // Fleece & Sweatshirts
          {
            id: 'm-blk-6',
            name: 'Super Heavyweight 10oz Streetwear Hoodie',
            columnGroup: 'Fleece & Sweatshirts',
            targetView: 'product-detail',
            targetProductId: 'prod-hoodie-heavyweight-fleece',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-7',
            name: 'Classic Streetwear Crewneck Sweatshirts',
            columnGroup: 'Fleece & Sweatshirts',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-8',
            name: 'Full-Zip Heavy Fleece Hoodies',
            columnGroup: 'Fleece & Sweatshirts',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-9',
            name: 'French Terry Relaxed Fit Pullovers',
            columnGroup: 'Fleece & Sweatshirts',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-10',
            name: 'Windbreakers & Lightweight Coaches Jackets',
            columnGroup: 'Fleece & Sweatshirts',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },

          // Headwear & Bags
          {
            id: 'm-blk-11',
            name: '6-Panel Flatbill Structured Snapback',
            columnGroup: 'Headwear & Accessories',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-12',
            name: 'Unstructured Vintage Cotton Dad Hats',
            columnGroup: 'Headwear & Accessories',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-13',
            name: '12oz Heavy Duck Cotton Canvas Totes',
            columnGroup: 'Headwear & Accessories',
            targetView: 'product-detail',
            targetProductId: 'prod-tote-canvas-heavy',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-14',
            name: 'Ribbed Knit Cuffed Streetwear Beanies',
            columnGroup: 'Headwear & Accessories',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-15',
            name: 'Heavy Canvas Utility Aprons & Bags',
            columnGroup: 'Headwear & Accessories',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },

          // Top Wholesale Brands
          {
            id: 'm-blk-16',
            name: 'Pro Club Heavyweight Collection',
            columnGroup: 'Top Wholesale Brands',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-17',
            name: 'Comfort Colors Vintage Washed Blanks',
            columnGroup: 'Top Wholesale Brands',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-18',
            name: 'Shaka Wear Streetwear Heavyweight',
            columnGroup: 'Top Wholesale Brands',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-19',
            name: 'Bella+Canvas Premium Retail Blanks',
            columnGroup: 'Top Wholesale Brands',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          },
          {
            id: 'm-blk-20',
            name: 'Independent Trading Co. Hoodies',
            columnGroup: 'Top Wholesale Brands',
            targetView: 'catalog',
            targetCategory: 'blank-apparel'
          }
        ]
      }
    ]
  },
  {
    id: 'specialty',
    label: 'Specialty DTF',
    category: 'specialty-dtf',
    bannerText: 'Unique Specialty Pigments · High Hand-Feel Appeal · Heat Press in 12s',
    bannerButtonText: 'Shop Specialty DTF',
    bannerButtonView: 'catalog',
    bannerButtonCategory: 'specialty-dtf',
    tabs: [
      {
        id: 'tab-spec-main',
        tabName: 'SPECIALTY EFFECT TRANSFERS',
        items: [
          {
            id: 'm-sp-1',
            name: 'Diamond Glitter Sparkle DTF',
            tag: 'Zero Shedding',
            imageUrl: specialtyImg,
            description: 'Real micro-diamond glitter flakes in TPU matrix',
            targetView: 'product-detail',
            targetProductId: 'prod-dtf-glitter-specialty',
            targetCategory: 'specialty-dtf'
          },
          {
            id: 'm-sp-2',
            name: 'Phosphorescent Glow in the Dark',
            tag: 'High Luminance',
            imageUrl: specialtyImg,
            description: 'Charges in ambient light to emit electric neon glow',
            targetView: 'product-detail',
            targetProductId: 'prod-dtf-glow-in-dark',
            targetCategory: 'specialty-dtf'
          },
          {
            id: 'm-sp-3',
            name: 'High-Vis Safety Reflective Silver',
            tag: 'OSHA Spec',
            imageUrl: specialtyImg,
            description: 'Flash-activated silver reflection for workwear',
            targetView: 'product-detail',
            targetProductId: 'prod-dtf-glitter-specialty',
            targetCategory: 'specialty-dtf'
          },
          {
            id: 'm-sp-4',
            name: 'Metallic Gold & Silver Foil DTF',
            tag: 'Mirror Gloss',
            imageUrl: specialtyImg,
            description: 'True mirror chrome metallic finish on fabrics',
            targetView: 'product-detail',
            targetProductId: 'prod-dtf-glitter-specialty',
            targetCategory: 'specialty-dtf'
          },
          {
            id: 'm-sp-5',
            name: '3D Puff Raised Velvet DTF',
            tag: 'Tactile Volume',
            imageUrl: specialtyImg,
            description: 'Puffs into a velvety raised 3D emboss upon pressing',
            targetView: 'product-detail',
            targetProductId: 'prod-dtf-glitter-specialty',
            targetCategory: 'specialty-dtf'
          },
          {
            id: 'm-sp-6',
            name: 'Rainbow Hologram Prism DTF',
            tag: 'Color Shift',
            imageUrl: specialtyImg,
            description: 'Shifts dynamic colors as viewer moves in lighting',
            targetView: 'product-detail',
            targetProductId: 'prod-dtf-glitter-specialty',
            targetCategory: 'specialty-dtf'
          }
        ]
      }
    ]
  },
  {
    id: 'patches',
    label: 'Patches & Stickers',
    category: 'patches-stickers',
    bannerText: 'Low 10-Piece Minimum · Iron-On, Velcro & Adhesive Backing Options',
    bannerButtonText: 'Shop All Patches & Stickers',
    bannerButtonView: 'catalog',
    bannerButtonCategory: 'patches-stickers',
    tabs: [
      {
        id: 'tab-pat-1',
        tabName: 'CUSTOM EMBROIDERED & MORALE PATCHES',
        items: [
          {
            id: 'm-p-1',
            name: 'Standard Embroidery Patches',
            tag: 'Iron-On / Velcro',
            imageUrl: patchesImg,
            description: 'Tight-weave twill with authentic merrowed edge',
            targetView: 'product-detail',
            targetProductId: 'prod-patch-standard-embroidery',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-p-2',
            name: 'Full Color Printed Sublimated',
            tag: 'Photo Realistic',
            imageUrl: patchesImg,
            description: 'Fine gradients and micro lettering on satin twill',
            targetView: 'product-detail',
            targetProductId: 'prod-patch-full-color-printed',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-p-3',
            name: 'Custom 3D PVC Rubber Patches',
            tag: 'Tactical Grade',
            imageUrl: leatherPatchesImg,
            description: 'Weatherproof soft PVC with molded relief',
            targetView: 'product-detail',
            targetProductId: 'prod-patch-pvc-rubber',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-p-4',
            name: 'Laser-Etched Genuine Leather',
            tag: 'Top-Grain Cowhide',
            imageUrl: leatherPatchesImg,
            description: 'Deep burnt laser ablation on caramel & raw hide',
            targetView: 'product-detail',
            targetProductId: 'prod-patch-genuine-leather',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-p-5',
            name: 'Retro Chenille Varsity Letters',
            tag: 'Plush Loop Yarn',
            imageUrl: patchesImg,
            description: 'Vintage collegiate varsity jacket chenille texture',
            targetView: 'product-detail',
            targetProductId: 'prod-patch-chenille-varsity',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-p-6',
            name: 'Woven Micro-Thread Patches',
            tag: 'Ultra Flat & Crisp',
            imageUrl: patchesImg,
            description: 'High thread count for intricate fine logos',
            targetView: 'product-detail',
            targetProductId: 'prod-patch-standard-embroidery',
            targetCategory: 'patches-stickers'
          }
        ]
      },
      {
        id: 'tab-pat-2',
        tabName: 'CUSTOM DIE-CUT STICKERS',
        items: [
          {
            id: 'm-s-1',
            name: 'Die-Cut Vinyl Stickers',
            tag: 'UV & Waterproof',
            imageUrl: stickersImg,
            description: 'Contour cut around your design with durable laminate',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-s-2',
            name: 'Holographic Prism Stickers',
            tag: 'Iridescent Shine',
            imageUrl: stickersImg,
            description: 'Eye-catching rainbow shimmer vinyl substrate',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-s-3',
            name: 'Clear Transparent Decals',
            tag: 'Invisible Border',
            imageUrl: stickersImg,
            description: 'Premium clear vinyl with opaque white backing layer',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-s-4',
            name: 'Matte Streetwear Stickers',
            tag: 'Silky Soft Feel',
            imageUrl: stickersImg,
            description: 'Glare-free satin matte protective over-lamination',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-s-5',
            name: 'Bumper Stickers & Magnets',
            tag: 'Outdoor Vehicle',
            imageUrl: stickersImg,
            description: 'Heavy gauge vehicle vinyl resistant to rain and sun',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'patches-stickers'
          },
          {
            id: 'm-s-6',
            name: 'Kiss-Cut Multi-Sticker Sheets',
            tag: 'Multiple Designs',
            imageUrl: stickersImg,
            description: 'Gang multiple sticker graphics on single backer sheet',
            targetView: 'product-detail',
            targetProductId: 'prod-uv-dtf-stickers',
            targetCategory: 'patches-stickers'
          }
        ]
      }
    ]
  },
  {
    id: 'supplies',
    label: 'Supplies',
    category: 'supplies',
    bannerText: 'Commercial Grade Equipment & Consumables Tested in Daily Production',
    bannerButtonText: 'Shop All Supplies',
    bannerButtonView: 'catalog',
    bannerButtonCategory: 'supplies',
    tabs: [
      {
        id: 'tab-sup-main',
        tabName: 'HEAT PRESSES & PRESSING ACCESSORIES',
        items: [
          {
            id: 'm-eq-1',
            name: 'Ambalvee Pro 15" x 15" Auto-Open Press',
            tag: 'Auto Pop-Open',
            imageUrl: heatPressImg,
            description: 'Electromagnetic release prevents shirt scorching',
            targetView: 'product-detail',
            targetProductId: 'prod-pro-heat-press-15x15',
            targetCategory: 'supplies'
          },
          {
            id: 'm-eq-2',
            name: 'Teflon Non-Stick Sheets (5-Pack)',
            tag: 'Rated to 600°F',
            imageUrl: heroImg,
            description: 'Reusable PTFE sheets for soft matte post-press finish',
            targetView: 'product-detail',
            targetProductId: 'prod-teflon-sheets-pack',
            targetCategory: 'supplies'
          },
          {
            id: 'm-eq-3',
            name: 'Thermal Heat Resistant Tape',
            tag: 'Zero Residue',
            imageUrl: gangSheetImg,
            description: 'Holds transfers in position on sleeves and pockets',
            targetView: 'catalog',
            targetCategory: 'supplies'
          },
          {
            id: 'm-eq-4',
            name: 'Infrared Digital Temp Laser Gun',
            tag: 'Precision Probe',
            imageUrl: heatPressImg,
            description: 'Verify edge-to-edge platen heat consistency',
            targetView: 'catalog',
            targetCategory: 'supplies'
          },
          {
            id: 'm-eq-5',
            name: 'Heavy Duty Felt Application Squeegee',
            tag: 'Felt Edge',
            imageUrl: uvDtfImg,
            description: 'Smooth bubble-free installation for UV decals & wraps',
            targetView: 'catalog',
            targetCategory: 'supplies'
          },
          {
            id: 'm-eq-6',
            name: 'Parchment Finishing Paper Rolls',
            tag: 'Ultra Soft Feel',
            imageUrl: heroImg,
            description: 'Final 5-second cure seal for maximum wash life',
            targetView: 'catalog',
            targetCategory: 'supplies'
          }
        ]
      }
    ]
  },
  {
    id: 'tools',
    label: 'Support & Tools',
    category: 'tools',
    displayType: 'text-links',
    bannerText: 'Commercial Printmaker Resources, Prepress Checkers & Application Guides',
    bannerButtonText: 'Explore Knowledge Base',
    bannerButtonView: 'home',
    tabs: [
      {
        id: 'tab-tool-main',
        tabName: 'SUPPORT & PRINTMAKER TOOLS',
        items: [
          // Pressing & Garment Care
          {
            id: 'm-t-1',
            name: 'DTF Heat Pressing Instructions (Time, Temp & PSI)',
            columnGroup: 'Pressing & Instructions',
            targetView: 'home'
          },
          {
            id: 'm-t-2',
            name: 'Warm Peel vs Cold Peel Instructions',
            columnGroup: 'Pressing & Instructions',
            targetView: 'home'
          },
          {
            id: 'm-t-3',
            name: 'Washing, Drying & Garment Care Specs (100+ Washes)',
            columnGroup: 'Pressing & Instructions',
            targetView: 'home'
          },
          {
            id: 'm-t-4',
            name: 'Heat Press Temperature & Pressure Calibration',
            columnGroup: 'Pressing & Instructions',
            targetView: 'home'
          },
          {
            id: 'm-t-5',
            name: 'Substrate Guide: Cotton, Poly, Nylon & Canvas',
            columnGroup: 'Pressing & Instructions',
            targetView: 'home'
          },

          // Artwork & Prepress Guide
          {
            id: 'm-t-6',
            name: 'Artwork Requirements: 300 DPI Transparent PNG',
            columnGroup: 'Artwork & Prepress Help',
            targetView: 'custom-dtf'
          },
          {
            id: 'm-t-7',
            name: 'Free Prepress Quality & Resolution Checker',
            columnGroup: 'Artwork & Prepress Help',
            targetView: 'custom-dtf'
          },
          {
            id: 'm-t-8',
            name: 'How to Knock Out Black/White Backgrounds',
            columnGroup: 'Artwork & Prepress Help',
            targetView: 'home'
          },
          {
            id: 'm-t-9',
            name: 'CMYK vs RGB Color Profiles for Vibrant Printing',
            columnGroup: 'Artwork & Prepress Help',
            targetView: 'home'
          },
          {
            id: 'm-t-10',
            name: 'Minimum Line Weight & Transparency Thresholds',
            columnGroup: 'Artwork & Prepress Help',
            targetView: 'home'
          },

          // Interactive Printmaker Tools
          {
            id: 'm-t-11',
            name: 'Visual Gang Sheet Roll Builder (Online Tool)',
            columnGroup: 'Printmaker Tools',
            targetView: 'gang-sheet-builder'
          },
          {
            id: 'm-t-12',
            name: 'Artwork Cleanup & Resolution Guide',
            columnGroup: 'Printmaker Tools',
            targetView: 'custom-dtf'
          },
          {
            id: 'm-t-13',
            name: 'Roll Yield Estimator & Linear Feet Calculator',
            columnGroup: 'Printmaker Tools',
            targetView: 'gang-sheet-builder'
          },
          {
            id: 'm-t-14',
            name: 'DTF vs Screen Printing & Vinyl Cost Comparison',
            columnGroup: 'Printmaker Tools',
            targetView: 'home'
          },
          {
            id: 'm-t-15',
            name: 'Order Physical Sample Pack ($1.00 Shipped)',
            columnGroup: 'Printmaker Tools',
            targetView: 'catalog',
            targetCategory: 'sample-packs'
          },

          // Customer Care & Policies
          {
            id: 'm-t-16',
            name: 'Track Active Order & UPS Tracking Status',
            columnGroup: 'Customer Care & Policies',
            targetView: 'account'
          },
          {
            id: 'm-t-17',
            name: 'Same-Day Dispatch Cutoff Times (3 PM EST)',
            columnGroup: 'Customer Care & Policies',
            targetView: 'home'
          },
          {
            id: 'm-t-18',
            name: '100% Quality Reprint & Durability Guarantee',
            columnGroup: 'Customer Care & Policies',
            targetView: 'home'
          },
          {
            id: 'm-t-19',
            name: 'Commercial Wholesale Volume Account Application',
            columnGroup: 'Customer Care & Policies',
            targetView: 'home'
          },
          {
            id: 'm-t-20',
            name: 'Frequently Asked Questions & Support Desk',
            columnGroup: 'Customer Care & Policies',
            targetView: 'home'
          }
        ]
      }
    ]
  }
];

export const INITIAL_SHOWCASE_VIDEOS: ShowcaseVideo[] = [
  {
    id: 'vid-1',
    title: 'DTF Peel & Heat Press Masterclass',
    subtitle: 'Warm vs Cold Peel Demonstration & Settings',
    description: 'Watch how quickly Ambalvee Transfers fuse into 100% cotton garments at 300°F with zero weeding and effortless instant peel.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: heroImg,
    duration: '1:42',
    viewsCount: '48.2K views',
    featuredProductId: 'prod-dtf-custom-size',
    category: 'DTF Transfers'
  },
  {
    id: 'vid-2',
    title: 'UV DTF PermaStickers Hard Surface Scratch Test',
    subtitle: 'Waterproof Decal Application onto 40oz Tumblers',
    description: 'No heat press required! Experience how 3D gloss UV ink adheres instantly to stainless steel cups, glass mugs, and helmets.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: tumblerWrapImg,
    duration: '2:15',
    viewsCount: '64.9K views',
    featuredProductId: 'prod-uv-dtf-stickers',
    category: 'UV DTF'
  },
  {
    id: 'vid-3',
    title: '22" Continuous Gang Sheet Roll Inspection & Unboxing',
    subtitle: 'Industrial Japanese Printhead Precision & Color Vibrancy',
    description: 'Watch our production team roll and inspect 30-foot continuous gang sheets printed with high-density white underbase.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: gangSheetImg,
    duration: '3:08',
    viewsCount: '32.1K views',
    featuredProductId: 'prod-gang-sheet-builder',
    category: 'Gang Sheets'
  },
  {
    id: 'vid-4',
    title: 'Custom Embroidered & PVC Patches Application Guide',
    subtitle: 'Iron-On, Heat Press & Hook-and-Loop Testing',
    description: 'See the texture, beveling, and clean marrowed edges of our authentic embroidered, PVC rubber, and laser-engraved leather patches.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: patchesImg,
    duration: '1:55',
    viewsCount: '27.4K views',
    featuredProductId: 'prod-patch-standard-embroidery',
    category: 'Patches & Stickers'
  },
  {
    id: 'vid-5',
    title: 'Commercial 15" x 15" Auto-Open Heat Press in Action',
    subtitle: 'Digital Temperature Calibration & Magnetic Release',
    description: 'Tour the Ambalvee Pro Auto-Open Press. Learn how electromagnetic pressure prevents scorched garments in commercial print shops.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: heatPressImg,
    duration: '2:40',
    viewsCount: '19.8K views',
    featuredProductId: 'prod-pro-heat-press-15x15',
    category: 'Equipment & Supplies'
  },
  {
    id: 'vid-6',
    title: 'Specialty Glitter & Phosphorescent Glow DTF Showcase',
    subtitle: 'High-Luminance Glow & Diamond Reflective Flakes',
    description: 'Watch how glitter and glow DTF transfers react under direct light, blacklight, and night conditions with zero fallout.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnailUrl: specialtyImg,
    duration: '1:30',
    viewsCount: '41.5K views',
    featuredProductId: 'prod-dtf-glitter-specialty',
    category: 'Specialty DTF'
  }
];

// Persistent Store Helper
export class LocalStoreManager {
  private static STORAGE_PREFIX = 'ninja_transfers_data_';

  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed:', e);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }

  static resetToDefaults(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Storage reset failed:', e);
    }
  }
}
