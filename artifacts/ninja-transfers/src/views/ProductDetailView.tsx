import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { INITIAL_REVIEWS, ASSETS } from '../data/mockStore';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Flame, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  UploadCloud,
  Layers,
  Sparkles,
  Play,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  DollarSign,
  Shirt,
  ThumbsUp,
  MessageSquare,
  BadgeCheck,
  Zap,
  HelpCircle,
  Volume2,
  VolumeX,
  FileCheck,
  ShoppingBag,
  CreditCard,
  Palette
} from 'lucide-react';
import { Product } from '../types';

interface BlankItem {
  id: string;
  name: string;
  brand: string;
  weight: string;
  category: 'popular' | 'tees' | 'sweatshirts' | 'hats' | 'bags';
  startingPrice: number;
  swatches: string[];
  swatchCount: number;
  image: string;
}

interface SuggestedItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  rating: number;
}

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setView,
    addToCart,
    setCartDrawerOpen,
    setCheckoutOpen
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  // Gallery images matching user screenshots
  const galleryImages = product.images?.length ? product.images : [ASSETS.heroBanner];

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Size selections: Gang Sheet Rolls
  const gangSheetSizes = [
    { id: '1-foot', label: '1 Foot (22" × 12")', lengthIn: 12, price: 16.99, discount: null },
    { id: '2-feet', label: '2 Feet (22" × 24")', lengthIn: 24, price: 19.99, discount: '41% off' },
    { id: '5-feet', label: '5 Feet (22" × 60")', lengthIn: 60, price: 49.99, discount: '41% off' },
    { id: '7-feet', label: '7 Feet (22" × 84")', lengthIn: 84, price: 69.99, discount: '41% off' },
    { id: '10-feet', label: '10 Feet (22" × 120")', lengthIn: 120, price: 89.99, discount: '47% off' },
    { id: '15-feet', label: '15 Feet (22" × 180")', lengthIn: 180, price: 109.99, discount: '57% off' },
    { id: '20-feet', label: '20 Feet (22" × 240")', lengthIn: 240, price: 129.99, discount: '62% off' },
    { id: '30-feet', label: '30 Feet (22" × 360")', lengthIn: 360, price: 179.99, discount: '65% off' },
    { id: '40-feet', label: '40 Feet (22" × 480")', lengthIn: 480, price: 210.99, discount: '68% off' },
  ];

  // Size selections: By Size Single Transfers
  const bySizeOptions = [
    { id: 'size-2x2', label: '2" × 2" Pocket/Cap', price: 2.99, bestFor: 'Pocket & Hats' },
    { id: 'size-4x4', label: '4" × 4" Left Chest', price: 4.49, bestFor: 'Front Chest' },
    { id: 'size-8x8', label: '8" × 8" Youth Center', price: 6.99, bestFor: 'Youth Garments' },
    { id: 'size-11x11', label: '11" × 11" Adult Standard', price: 9.99, discount: 'Popular', bestFor: 'Standard Front/Back' },
    { id: 'size-12x17', label: '12" × 17" Oversized Back', price: 14.99, bestFor: 'Streetwear Oversized' },
  ];

  // Size selections: Apparel Blanks
  const blankSizes = [
    { id: 'size-xs', label: 'Extra Small (XS)', price: 2.59 },
    { id: 'size-s', label: 'Small (S)', price: 2.59 },
    { id: 'size-m', label: 'Medium (M)', price: 2.59 },
    { id: 'size-l', label: 'Large (L)', price: 2.59 },
    { id: 'size-xl', label: 'X-Large (XL)', price: 2.59 },
    { id: 'size-2xl', label: '2X-Large (2XL)', price: 3.59 },
    { id: 'size-3xl', label: '3X-Large (3XL)', price: 4.29 },
  ];

  const isGang = product.isGangSheet || product.id === 'prod-dtf-gang-sheet';
  const isBlank = product.category === 'blank-apparel';

  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    isGang ? '2-feet' : isBlank ? 'size-l' : 'size-11x11'
  );

  // Film styles from products_should.png
  const filmStyles = [
    { 
      id: 'premium-dtf', 
      name: 'Premium DTF', 
      sub: 'VIVID AF', 
      badge: 'Free upgrade',
      iconType: 'rainbow' 
    },
    { 
      id: 'glitter', 
      name: 'Glitter', 
      sub: 'VIVID AF', 
      badge: null,
      iconType: 'glitter' 
    },
    { 
      id: 'glow', 
      name: 'Glow in the Dark', 
      sub: 'VIVID AF', 
      badge: null,
      iconType: 'glow' 
    },
    { 
      id: 'gold-foil', 
      name: 'Gold Foil', 
      sub: '1 COLOR', 
      badge: null,
      iconType: 'gold' 
    },
    { 
      id: 'silver-foil', 
      name: 'Silver Foil', 
      sub: '1 COLOR', 
      badge: null,
      iconType: 'silver' 
    },
  ];
  const [selectedFilmStyle, setSelectedFilmStyle] = useState('premium-dtf');

  // Garment and Base Colors
  const garmentColors = [
    { id: 'black', name: 'Jet Black', hex: '#111827' },
    { id: 'white', name: 'Pure White', hex: '#ffffff', border: true },
    { id: 'heather-grey', name: 'Heather Grey', hex: '#9ca3af' },
    { id: 'navy', name: 'Deep Navy', hex: '#1e3a8a' },
    { id: 'red', name: 'Crimson Red', hex: '#dc2626' },
    { id: 'forest-green', name: 'Forest Green', hex: '#166534' },
    { id: 'royal-blue', name: 'Royal Blue', hex: '#2563eb' }
  ];
  const [selectedColorId, setSelectedColorId] = useState('black');

  // Direct Artwork Upload State (no canvas placer!)
  const [uploadedArtwork, setUploadedArtwork] = useState<{ name: string; url: string; size: string } | null>(null);
  const artworkFileRef = useRef<HTMLInputElement>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Blanks cross-sell carousel data matching products_should-2.png
  const blankApparelList: BlankItem[] = [
    {
      id: 'blank-g500',
      name: 'Gildan G500 Adult 5.3 oz.',
      brand: 'Gildan',
      weight: '5.3 oz. Heavy Cotton',
      category: 'tees',
      startingPrice: 2.59,
      swatches: ['#ffffff', '#e5e7eb', '#9ca3af', '#4b5563', '#1f2937', '#111827'],
      swatchCount: 62,
      image: ASSETS.blankApparel
    },
    {
      id: 'blank-g640',
      name: 'Gildan G640 Adult 4.5 oz',
      brand: 'Gildan Softstyle',
      weight: '4.5 oz. Ringspun',
      category: 'tees',
      startingPrice: 3.09,
      swatches: ['#ffffff', '#e5e7eb', '#1f2937', '#991b1b', '#1e3a8a'],
      swatchCount: 54,
      image: ASSETS.featureWhiteCamp
    },
    {
      id: 'blank-g185',
      name: 'Gildan G185 Heavy Blend Hoodie',
      brand: 'Gildan',
      weight: '8.0 oz. 50/50 Fleece',
      category: 'sweatshirts',
      startingPrice: 13.95,
      swatches: ['#111827', '#4b5563', '#9ca3af', '#ffffff', '#1e3a8a', '#991b1b'],
      swatchCount: 38,
      image: ASSETS.featureStretchDurability
    },
    {
      id: 'blank-hat-6089',
      name: 'Yupoong 6089M Classic Snapback Cap',
      brand: 'Yupoong',
      weight: 'Structured 6-Panel',
      category: 'hats',
      startingPrice: 5.75,
      swatches: ['#111827', '#1f2937', '#374151', '#1e3a8a', '#991b1b'],
      swatchCount: 22,
      image: ASSETS.featureCapPress
    },
    {
      id: 'blank-bag-8801',
      name: 'Liberty Bags 8801 Heavyweight Canvas Tote',
      brand: 'Liberty Bags',
      weight: '12 oz. Cotton Duck Canvas',
      category: 'bags',
      startingPrice: 3.25,
      swatches: ['#fef3c7', '#ffffff', '#1f2937', '#1e3a8a', '#065f46'],
      swatchCount: 18,
      image: ASSETS.blankApparel
    }
  ];

  // Frequently Bought Together / Suggested Products
  const suggestedAccessories: SuggestedItem[] = [
    {
      id: 'acc-teflon-sheet',
      name: 'Commercial Non-Stick Teflon Sheet (16" × 20")',
      subtitle: 'Reusable 1,000+ presses · Protects heat platen',
      price: 5.99,
      image: ASSETS.heatPress,
      rating: 5
    },
    {
      id: 'acc-heat-tape',
      name: 'High-Temperature Thermal Tape (2 Pack)',
      subtitle: 'Resists up to 450°F with zero residue',
      price: 4.99,
      image: ASSETS.uvDtfDecals,
      rating: 5
    },
    {
      id: 'acc-sample-pack',
      name: 'Ambalvee DTF Official Sample Pack Kit',
      subtitle: 'Includes DTF, UV DTF, Glitter & Glow swatches',
      price: 1.00,
      image: ASSETS.heroBanner,
      rating: 5
    },
    {
      id: 'acc-press-pillow',
      name: 'Foam Heat Press Pillow Set (3 Pack)',
      subtitle: 'Eliminates zipper & seam pressure marks',
      price: 14.99,
      image: ASSETS.blankApparel,
      rating: 5
    }
  ];

  const [activeBlankCategory, setActiveBlankCategory] = useState<'popular' | 'tees' | 'sweatshirts' | 'hats' | 'bags'>('popular');
  const [blankScrollIdx, setBlankScrollIdx] = useState(0);

  const filteredBlanks = blankApparelList.filter(item => {
    if (activeBlankCategory === 'popular') return true;
    return item.category === activeBlankCategory;
  });

  // Video tutorial modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Calculate Unit Price dynamically based on selected Size
  let unitPrice = product.price;
  let activeSizeLabel = 'Standard';

  if (isGang) {
    const activeGangSize = gangSheetSizes.find(s => s.id === selectedSizeId) || gangSheetSizes[1];
    unitPrice = activeGangSize.price;
    activeSizeLabel = activeGangSize.label;
  } else if (isBlank) {
    const activeBlankSize = blankSizes.find(s => s.id === selectedSizeId) || blankSizes[2];
    unitPrice = activeBlankSize.price;
    activeSizeLabel = activeBlankSize.label;
  } else {
    const activeBySize = bySizeOptions.find(s => s.id === selectedSizeId) || bySizeOptions[3];
    unitPrice = activeBySize.price;
    activeSizeLabel = activeBySize.label;
  }

  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    setUploadedArtwork({
      name: file.name,
      url: url,
      size: sizeMb
    });

    e.target.value = '';
  };

  const handleAddToCart = () => {
    const chosenStyle = filmStyles.find(f => f.id === selectedFilmStyle)?.name || 'Premium DTF';
    const chosenColor = garmentColors.find(c => c.id === selectedColorId)?.name || 'Black';

    addToCart({
      productId: product.id,
      productName: `${product.name} (${activeSizeLabel} · ${chosenStyle} · ${chosenColor})`,
      category: product.category,
      productImage: uploadedArtwork?.url || galleryImages[activeImageIdx] || product.images[0],
      variantId: `${selectedSizeId}-${selectedFilmStyle}-${selectedColorId}`,
      variantName: `${activeSizeLabel} / ${chosenStyle} / ${chosenColor}${uploadedArtwork ? ' [Artwork Attached]' : ''}`,
      unitPrice: unitPrice,
      quantity: quantity
    });

    setAddedNotice(true);
    setCartDrawerOpen(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    const chosenStyle = filmStyles.find(f => f.id === selectedFilmStyle)?.name || 'Premium DTF';
    const chosenColor = garmentColors.find(c => c.id === selectedColorId)?.name || 'Black';

    addToCart({
      productId: product.id,
      productName: `${product.name} (${activeSizeLabel} · ${chosenStyle} · ${chosenColor})`,
      category: product.category,
      productImage: uploadedArtwork?.url || galleryImages[activeImageIdx] || product.images[0],
      variantId: `${selectedSizeId}-${selectedFilmStyle}-${selectedColorId}`,
      variantName: `${activeSizeLabel} / ${chosenStyle} / ${chosenColor}${uploadedArtwork ? ' [Artwork Attached]' : ''}`,
      unitPrice: unitPrice,
      quantity: quantity
    });

    setCheckoutOpen(true);
  };

  const handleAddBlankToCart = (blank: BlankItem) => {
    addToCart({
      productId: blank.id,
      productName: `${blank.name} (White - M)`,
      category: 'blank-apparel',
      productImage: blank.image,
      variantId: `${blank.id}-wht-m`,
      variantName: 'White / Size M',
      unitPrice: blank.startingPrice,
      quantity: 1
    });
    setAddedNotice(true);
    setCartDrawerOpen(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleAddAccessoryToCart = (acc: SuggestedItem) => {
    addToCart({
      productId: acc.id,
      productName: acc.name,
      category: 'supplies',
      productImage: acc.image,
      variantId: `${acc.id}-default`,
      variantName: 'Standard',
      unitPrice: acc.price,
      quantity: 1
    });
    setAddedNotice(true);
    setCartDrawerOpen(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      title: newReviewTitle.trim() || 'Verified Purchase Feedback',
      comment: newReviewComment.trim(),
      date: 'Just now',
      verifiedPurchase: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalOpen(false);
      setNewReviewAuthor('');
      setNewReviewTitle('');
      setNewReviewComment('');
    }, 1500);
  };

  return (
    <div className="bg-white text-neutral-900 font-sans pb-24">
      
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-neutral-100 bg-neutral-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-neutral-500">
          <button
            onClick={() => setView('catalog')}
            className="inline-flex items-center gap-1.5 font-bold hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Products</span>
          </button>
          <span className="font-medium hidden sm:inline text-neutral-400">
            Home / Products / <strong className="text-neutral-900 font-bold">{product.name}</strong>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-12 lg:space-y-16">
        
        {/* ========================================================================= */}
        {/* TOP SECTION: 2-COLUMN PRODUCT DISPLAY (MATCHING USER SCREENSHOTS)         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: MAIN IMAGE, BADGES, THUMBNAILS & VIDEO BANNER (6 COLS)    */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Main Image Viewport with Badges & Arrows */}
            <div className="relative aspect-4/3 sm:aspect-1/1 bg-neutral-100 rounded-3xl overflow-hidden border border-neutral-200 shadow-sm group">
              <img
                src={uploadedArtwork?.url || galleryImages[activeImageIdx] || galleryImages[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500"
              />

              {/* Prev / Next Carousel Arrow Buttons */}
              <button
                onClick={() => setActiveImageIdx((activeImageIdx - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-all hover:scale-110 opacity-90 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={() => setActiveImageIdx((activeImageIdx + 1) % galleryImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-all hover:scale-110 opacity-90 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Badge 1 (Top Left): EVERYDAY LOW PRICES Green Starburst / Circle */}
              <div className="absolute top-4 left-4 z-10">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-emerald-500 text-white font-black text-[9px] sm:text-[10px] uppercase text-center flex flex-col items-center justify-center shadow-lg leading-tight p-1 rotate-[-6deg] border-2 border-white">
                  <span>EVERYDAY</span>
                  <span className="text-sm sm:text-base font-black tracking-tighter">LOW</span>
                  <span>PRICES</span>
                </div>
              </div>

              {/* Badge 2 (Top Right): Ambalvee Commercial Guarantee */}
              <div className="absolute top-4 right-4 z-10 max-w-[240px] sm:max-w-[280px]">
                <div className="bg-neutral-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md border border-neutral-700">
                  <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                  <span className="truncate">Product details are editable catalog examples</span>
                </div>
              </div>

              {/* Badge 3 (Bottom Left): AMBALVEE PEEL Red Badge */}
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 border border-red-500">
                  <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                  <div className="text-[10px] font-black uppercase tracking-wider leading-none">
                    <span>AMBALVEE PEEL</span>
                    <span className="block text-[8px] font-normal text-red-100">PEEL 2-4X FASTER</span>
                  </div>
                </div>
              </div>

              {/* Badge 4 (Bottom Right): VIVID AF ADVANCED FINISH Dark Glass Banner */}
              <div className="absolute bottom-4 right-4 z-10">
                <div className="bg-black/90 text-white px-3.5 py-2 rounded-xl shadow-xl border border-neutral-800 text-right backdrop-blur-xs">
                  <span className="text-[8px] text-purple-300 font-extrabold uppercase tracking-widest block">
                    FREE UPGRADE TO AMBALVEE'S
                  </span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs sm:text-sm font-black tracking-tight text-white">VIVID AF</span>
                    <span className="text-[9px] bg-purple-600 text-white font-bold px-1.5 py-0.2 rounded">ADVANCED</span>
                  </div>
                  <span className="text-[8px] text-neutral-400 block">16.7M+ Pantone Accurate Colors</span>
                </div>
              </div>
            </div>

            {/* 6 Thumbnail Row (matching products_should.png) */}
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all shadow-2xs ${
                    activeImageIdx === idx 
                      ? 'border-sky-500 ring-2 ring-sky-200 scale-102' 
                      : 'border-neutral-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* "HOW TO CREATE A GANG SHEET IN SECONDS" Video Banner Card (matching products_should.png) */}
            <div 
              onClick={() => setVideoModalOpen(true)}
              className="relative rounded-3xl overflow-hidden cursor-pointer shadow-md group border border-neutral-200 bg-neutral-950 aspect-16/9 sm:aspect-21/9 flex items-center"
            >
              <img 
                src={ASSETS.heroBanner} 
                alt="How to create a gang sheet in seconds" 
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-700/80 via-red-600/50 to-neutral-950/80" />

              <div className="absolute inset-0 p-6 flex items-center justify-between">
                <div className="space-y-1 text-white max-w-sm">
                  <span className="bg-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    WATCH TUTORIAL
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
                    HOW TO CREATE A GANG SHEET IN SECONDS
                  </h4>
                  <p className="text-xs text-white/90 hidden sm:block">
                    Learn how our automated commercial prepress prints continuous rolls with zero weeding.
                  </p>
                </div>

                {/* Big Center/Right Play Button */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shrink-0">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            </div>

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: FULL PROFESSIONAL ORDERING & CONFIG MODULE               */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & VIVID AF Pill */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight">
                  {product.name}
                </h1>
                <span className="bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Catalog example
                </span>
              </div>

              {/* Sub-info strip */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 pt-1">
                <span className="font-semibold text-neutral-700 flex items-center gap-1">
                  Review current product configuration and shipping details at checkout.
                </span>
              </div>
            </div>

            {/* 4 Value Props (2x2 Grid with Blue Icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
              <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
                <Shirt className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Review fabric compatibility for your application</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Artwork and color appearance depend on your source file</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
                <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="flex items-center gap-1">
                  See product specifications
                  <Info className="w-3 h-3 text-neutral-400" />
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Confirm product details before ordering</span>
              </div>
            </div>

            {/* Product information note */}
            <div className="py-2.5 px-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="font-extrabold text-sky-600">
                Volume pricing may vary by product
              </span>
              <span className="text-neutral-700 flex items-center gap-1 font-medium">
                <Truck className="w-3.5 h-3.5 text-sky-600" />
                <span>Shipping methods and charges appear at checkout</span>
              </span>
              <span className="text-neutral-500 text-[11px] font-semibold">
                Editable catalog example
              </span>
            </div>

            {/* 1. SIZE SELECTOR MODULE */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {isGang ? 'Select Roll Length (All sizes 22" wide)' : isBlank ? 'Select Garment Size' : 'Select Transfer Dimensions'}
                </label>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {isGang ? 'Width: 22" Continuous PET Film' : 'Ultra-Opaque Prepress'}
                </span>
              </div>

              {/* Grid of Size Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(isGang ? gangSheetSizes : isBlank ? blankSizes : bySizeOptions).map((sizeItem: any) => {
                  const isSelected = selectedSizeId === sizeItem.id;
                  return (
                    <button
                      key={sizeItem.id}
                      onClick={() => setSelectedSizeId(sizeItem.id)}
                      className={`relative p-3 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500 text-neutral-950 font-bold'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                      }`}
                    >
                      {/* Checkmark circle on selected size */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      <span className="font-black text-xs sm:text-sm block">
                        {sizeItem.label}
                      </span>
                      <span className="text-xs text-neutral-600 font-mono block mt-0.5">
                        ${sizeItem.price.toFixed(2)}
                      </span>

                      {/* Discount pill */}
                      {sizeItem.discount && (
                        <span className="mt-1 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          {sizeItem.discount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. FILM STYLE SELECTOR (Different Styles) */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                Select Film Style / Finish
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filmStyles.map((style) => {
                  const isSelected = selectedFilmStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedFilmStyle(style.id)}
                      className={`relative p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500' 
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      {/* Style Icon Indicator */}
                      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-2xs overflow-hidden border border-neutral-200">
                        {style.iconType === 'rainbow' && (
                          <div className="w-full h-full bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-500" />
                        )}
                        {style.iconType === 'glitter' && (
                          <div className="w-full h-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        {style.iconType === 'glow' && (
                          <div className="w-full h-full bg-lime-400 flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 text-lime-900" />
                          </div>
                        )}
                        {style.iconType === 'gold' && (
                          <div className="w-full h-full bg-amber-400" />
                        )}
                        {style.iconType === 'silver' && (
                          <div className="w-full h-full bg-neutral-300" />
                        )}
                      </div>

                      <div className="min-w-0">
                        {style.badge && (
                          <span className="text-[9px] font-black text-emerald-600 block leading-none">
                            {style.badge}
                          </span>
                        )}
                        <span className="font-bold text-xs text-neutral-900 block truncate">
                          {style.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          {style.sub}
                        </span>
                      </div>

                      {/* Selected check circle */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. COLOR SELECTION MODULE (Different Colours) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Garment / Transfer Base Color</span>
                </label>
                <span className="text-xs font-black text-sky-600">
                  {garmentColors.find(c => c.id === selectedColorId)?.name}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {garmentColors.map((color) => {
                  const isSelected = selectedColorId === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColorId(color.id)}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-300' 
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <span 
                        style={{ backgroundColor: color.hex }}
                        className={`w-4 h-4 rounded-full block shadow-2xs ${color.border ? 'border border-neutral-300' : ''}`}
                      />
                      <span className="text-xs font-bold text-neutral-800">
                        {color.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3 h-3 text-sky-600 stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. DIRECT ARTWORK UPLOAD MODULE (NO CANVAS PLACER SHEET!) */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 transition-colors space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-sky-600" />
                    <span>Upload Artwork / Print File</span>
                  </span>
                  <p className="text-[11px] text-neutral-500 leading-snug">
                    PNG, SVG, PDF, PSD, and Adobe Illustrator (.AI) files accepted. Transparent background recommended · 300 DPI.
                  </p>
                </div>

                <input 
                  type="file" 
                  ref={artworkFileRef}
                  onChange={handleArtworkUpload}
                  accept="image/png,image/jpeg,image/svg+xml,application/pdf"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => artworkFileRef.current?.click()}
                  className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                </button>
              </div>

              {/* Uploaded File Pill Preview */}
              {uploadedArtwork ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={uploadedArtwork.url} 
                      alt="Uploaded" 
                      className="w-10 h-10 rounded-lg object-cover bg-white border border-emerald-300 shrink-0" 
                    />
                    <div className="truncate">
                      <span className="font-extrabold text-neutral-900 block truncate">
                        {uploadedArtwork.name}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        ✓ 300 DPI Verified · Print-Ready ({uploadedArtwork.size})
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadedArtwork(null)}
                    className="p-1 hover:bg-emerald-100 rounded-full text-emerald-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-medium">
                  <span>✓ Free Artwork Knockout</span>
                  <span>✓ Zero Art Fees</span>
                  <span>✓ 100% CMYK Color Calibrated</span>
                </div>
              )}
            </div>

            {/* 5. QUANTITY STEPPER & ACTION BUTTONS (ADD TO CART + BUY NOW) */}
            <div className="space-y-3 pt-2">
              
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 py-2 text-center text-sm font-mono font-black text-neutral-900 border-0 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtotal Display */}
                <div className="flex-1 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-semibold">Subtotal:</span>
                  <span className="font-mono text-base font-black text-neutral-950">
                    ${(unitPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* DUAL ACTION BUTTONS: ADD TO CART & BUY NOW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. ADD TO CART BUTTON */}
                <button
                  onClick={handleAddToCart}
                  className="py-4 px-6 bg-[#0084ff] hover:bg-[#0070da] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART · ${(unitPrice * quantity).toFixed(2)}</span>
                </button>

                {/* 2. BUY NOW BUTTON */}
                <button
                  onClick={handleBuyNow}
                  className="py-4 px-6 bg-neutral-950 hover:bg-neutral-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span>BUY NOW · 1-CLICK</span>
                </button>
              </div>

              {addedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Successfully added to your shopping cart!</span>
                </div>
              )}
            </div>

            {/* Ambalvee Cash Rewards Bar */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">$</span>
                <span>Earn up to ${(unitPrice * quantity * 0.1).toFixed(2)} Ambalvee Cash Rewards</span>
              </span>
              <span className="text-[11px] font-bold text-neutral-600 underline">
                10% Store Credit
              </span>
            </div>

            {/* Buy Now Pay Later Options */}
            <div className="pt-2 border-t border-neutral-100 space-y-2 text-center">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Finance with Buy Now Pay Later options
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-black text-neutral-700">
                <span className="px-2.5 py-1 rounded bg-[#5a31f4] text-white font-black text-[10px]">shop Pay</span>
                <span className="px-2.5 py-1 rounded bg-[#b2fce4] text-black font-black text-[10px]">afterpay ↗</span>
                <span className="px-2.5 py-1 rounded bg-[#ffb3c7] text-black font-black text-[10px]">Klarna.</span>
                <span className="px-2.5 py-1 rounded bg-[#392550] text-purple-200 font-black text-[10px]">sezzle</span>
                <span className="px-2.5 py-1 rounded bg-neutral-900 text-white font-black text-[10px]">affirm</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Payment is not collected in this demo preview.
              </p>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* Frequently selected accessories and supplies                              */}
        {/* ========================================================================= */}
        <section className="pt-10 border-t border-neutral-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-600 block mb-1">
                RECOMMENDED ACCESSORIES &amp; SUPPLIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
                Frequently Bought Together
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              Bundle essential heat press supplies for perfect application every time.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedAccessories.map((acc) => (
              <div 
                key={acc.id}
                className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="space-y-3">
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100">
                    <img 
                      src={acc.image} 
                      alt={acc.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>

                  <div>
                    <div className="flex text-amber-400 mb-1">
                      {[...Array(acc.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <h4 className="font-extrabold text-neutral-900 text-xs sm:text-sm leading-snug line-clamp-2">
                      {acc.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1">
                      {acc.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-neutral-100 mt-3">
                  <span className="font-mono font-black text-sm text-neutral-950">
                    ${acc.price.toFixed(2)}
                  </span>
                  
                  <button
                    onClick={() => handleAddAccessoryToCart(acc)}
                    className="px-3 py-1.5 bg-neutral-950 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* Complete your order with blanks                                          */}
        {/* ========================================================================= */}
        <section className="pt-10 border-t border-neutral-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 text-xs font-bold text-emerald-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>No Minimums</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Delivery in 1-2 Days</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
                Complete your order with Blanks
              </h2>
            </div>

            {/* Category Filter Pills: Popular, Tees, Sweatshirts, Hats, Bags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'popular', label: 'Popular' },
                { id: 'tees', label: 'Tees' },
                { id: 'sweatshirts', label: 'Sweatshirts' },
                { id: 'hats', label: 'Hats' },
                { id: 'bags', label: 'Bags' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveBlankCategory(cat.id as any);
                    setBlankScrollIdx(0);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                    activeBlankCategory === cat.id
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blank Apparel Product Cards Grid / Horizontal Slider */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {filteredBlanks.slice(blankScrollIdx, blankScrollIdx + 4).map((blank) => (
              <div
                key={blank.id}
                className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-4/5 bg-neutral-100 overflow-hidden">
                    <img
                      src={blank.image}
                      alt={blank.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-neutral-950/80 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-xs">
                      {blank.brand}
                    </span>
                  </div>

                  {/* Swatches strip */}
                  <div className="p-3.5 pb-1">
                    <div className="flex items-center gap-1 mb-2">
                      {blank.swatches.map((colorHex, sIdx) => (
                        <span
                          key={sIdx}
                          style={{ backgroundColor: colorHex }}
                          className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs block"
                        />
                      ))}
                      <span className="text-[10px] text-neutral-500 font-bold ml-1">
                        +{blank.swatchCount}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-neutral-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                      {blank.name}
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 pt-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-600">
                    Starting at <strong className="text-neutral-950 font-black">${blank.startingPrice.toFixed(2)}</strong>
                  </span>
                  
                  <button
                    onClick={() => handleAddBlankToCart(blank)}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-sky-500 hover:text-white text-neutral-800 transition-colors shadow-2xs"
                    title="Quick Add Blank to Order"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Next/Prev Controls */}
          {filteredBlanks.length > 4 && (
            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={blankScrollIdx === 0}
                onClick={() => setBlankScrollIdx(Math.max(0, blankScrollIdx - 2))}
                className="p-2 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={blankScrollIdx + 4 >= filteredBlanks.length}
                onClick={() => setBlankScrollIdx(blankScrollIdx + 2)}
                className="p-2 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* Application instructions                                                  */}
        {/* ========================================================================= */}
        <section className="hidden pt-10 border-t border-neutral-200 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-red-600 block">
              APPLICATION INSTRUCTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
              Technical Heat Press Specifications
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Lab-tested parameters for 100+ wash permanence across all popular fabric blends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-black text-xs">
                  1
                </div>
                <h4 className="font-extrabold text-neutral-900 text-sm">100% Cotton &amp; Blends</h4>
              </div>
              <ul className="text-xs text-neutral-600 space-y-1.5 font-medium">
                <li>• <strong>Temp</strong>: 300°F – 320°F (150°C – 160°C)</li>
                <li>• <strong>Time</strong>: 12 – 15 Seconds</li>
                <li>• <strong>Pressure</strong>: 55 PSI (Medium-Heavy)</li>
                <li>• <strong>Peel</strong>: Warm or Cold Peel (wait 5-10s)</li>
                <li>• <strong>Post-Press</strong>: 5s with Teflon/parchment</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-black text-xs">
                  2
                </div>
                <h4 className="font-extrabold text-neutral-900 text-sm">100% Polyester &amp; Poly-Blends</h4>
              </div>
              <ul className="text-xs text-neutral-600 space-y-1.5 font-medium">
                <li>• <strong>Temp</strong>: 275°F – 285°F (135°C – 140°C)</li>
                <li>• <strong>Time</strong>: 10 – 12 Seconds</li>
                <li>• <strong>Pressure</strong>: 40 PSI (Medium)</li>
                <li>• <strong>Peel</strong>: Completely Cold Peel</li>
                <li>• <strong>Post-Press</strong>: 3s with parchment paper</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
                  3
                </div>
                <h4 className="font-extrabold text-neutral-900 text-sm">Heavy Canvas &amp; Denim Bags</h4>
              </div>
              <ul className="text-xs text-neutral-600 space-y-1.5 font-medium">
                <li>• <strong>Temp</strong>: 315°F – 325°F (157°C – 163°C)</li>
                <li>• <strong>Time</strong>: 15 – 18 Seconds</li>
                <li>• <strong>Pressure</strong>: 60 PSI (Heavy)</li>
                <li>• <strong>Peel</strong>: Warm Peel</li>
                <li>• <strong>Post-Press</strong>: 5s heavy pressure</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CUSTOMER FEEDBACK & VERIFIED REVIEWS SECTION (REQUESTED BY USER)          */}
        {/* ========================================================================= */}
        <section className="hidden pt-10 border-t border-neutral-200 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-sky-600 block mb-1">
                AUTHENTIC CUSTOMER FEEDBACK
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
                Product Ratings &amp; Reviews
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Real feedback from designers, print shop owners, and brand builders pressing with Ambalvee.
              </p>
            </div>

            {/* Write a Review Button */}
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-6 py-3 bg-neutral-900 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Rating Breakdown Bar & Summary */}
          <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Score box */}
            <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-neutral-200 pb-6 md:pb-0 md:pr-6">
              <div className="text-5xl sm:text-6xl font-black text-neutral-950 font-mono">
                4.95
              </div>
              <div className="flex justify-center md:justify-start text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-neutral-500 font-medium block">
                Based on 23,642 verified submissions
              </span>
            </div>

            {/* Progress Bars */}
            <div className="md:col-span-8 space-y-2 text-xs font-semibold text-neutral-700">
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">5 Star</span>
                <div className="flex-1 h-2.5 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '94%' }} />
                </div>
                <span className="w-10 text-neutral-500">94%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">4 Star</span>
                <div className="flex-1 h-2.5 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '5%' }} />
                </div>
                <span className="w-10 text-neutral-500">5%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">3 Star</span>
                <div className="flex-1 h-2.5 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '1%' }} />
                </div>
                <span className="w-10 text-neutral-500">1%</span>
              </div>
            </div>

          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviewsList.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-neutral-900 text-sm">
                    {rev.title}
                  </h4>

                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="font-bold text-neutral-800">{rev.author}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* WRITE A REVIEW MODAL                                                      */}
      {/* ========================================================================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
                Submit Product Feedback
              </h3>
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-black text-emerald-900 text-sm">Thank You for Your Feedback!</h4>
                <p className="text-xs text-emerald-700">Your review has been verified and added to this product.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-neutral-700 mb-1">Your Rating</label>
                  <div className="flex gap-2 text-neutral-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className={`p-1 hover:scale-110 transition-transform ${
                          star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Your Full Name or Brand</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Detailed Review</label>
                  <textarea
                    rows={4}
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-sky-600 text-white font-extrabold uppercase tracking-wider"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIDEO TUTORIAL PLAYER MODAL                                               */}
      {/* ========================================================================= */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-neutral-950 rounded-3xl max-w-3xl w-full overflow-hidden border border-neutral-800 shadow-2xl relative">
            
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
                  How To Create &amp; Order a Gang Sheet in Seconds
                </h3>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-16/9 bg-black flex items-center justify-center">
              <img
                src={ASSETS.heroBanner}
                alt="Tutorial Video Poster"
                className="w-full h-full object-cover opacity-60"
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl animate-pulse">
                  <Play className="w-9 h-9 fill-current ml-1" />
                </div>
                <div className="space-y-1 text-white max-w-md">
                  <h4 className="text-lg font-black uppercase">
                    Step-by-Step Ambalvee Masterclass
                  </h4>
                  <p className="text-xs text-neutral-300">
                    See how our commercial DTF transfers press onto cotton, polyester, and dark hoodies in 10 seconds flat with zero weeding.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono text-emerald-400 font-bold">1080p 60FPS High-Definition</span>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 bg-white text-neutral-900 font-bold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Close Video
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
