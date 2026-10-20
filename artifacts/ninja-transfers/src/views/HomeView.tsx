import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockStore';
import { 
  ArrowRight, 
  Layers, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  ChevronDown,
  UploadCloud,
  Check,
  Truck,
  Calculator,
  Package,
  Layers as LayersIcon,
  HelpCircle,
  FileCheck2,
  Award,
  Zap,
  SlidersHorizontal,
  Clock,
  Printer,
  X,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  Tag,
  ShoppingBag,
  ExternalLink,
  Timer,
  CheckCheck,
  Shirt,
  Info,
  BadgeCheck
} from 'lucide-react';
import { Product, CategoryId } from '../types';
import { getWebsiteCopy } from '../data/siteCopy';

export const HomeView: React.FC = () => {
  const { 
    setView, 
    setSelectedProductId, 
    setCatalogCategory,
    products,
    addToCart,
    videos,
    websiteSettings
  } = useStore();

  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [featuredTab, setFeaturedTab] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(35);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const copy = (key: string, fallback: string) => getWebsiteCopy(websiteSettings.siteCopy, key, fallback);

  const getTimeLeft = (endAt: string) => {
    const end = new Date(endAt).getTime();
    const remaining = Number.isFinite(end) ? Math.max(0, end - Date.now()) : 0;
    return {
      hours: Math.floor(remaining / 3_600_000),
      minutes: Math.floor((remaining % 3_600_000) / 60_000),
      seconds: Math.floor((remaining % 60_000) / 1_000)
    };
  };
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(websiteSettings.offerEndsAt));

  useEffect(() => {
    const refreshTimer = () => setTimeLeft(getTimeLeft(websiteSettings.offerEndsAt));
    refreshTimer();
    const timer = setInterval(refreshTimer, 1000);
    return () => clearInterval(timer);
  }, [websiteSettings.offerEndsAt]);

  // Dynamic headline rotating words: Gang Sheets, Side Hustlers, Printshops, etc.
  const rotatingWords = websiteSettings.heroRotatingWords
    .split('\n')
    .map(word => word.trim())
    .filter(Boolean);
  const safeRotatingWords = rotatingWords.length ? rotatingWords : ['GANG SHEETS'];
  const [rotatingWordIndex, setRotatingWordIndex] = useState(0);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setRotatingWordIndex(prev => (prev + 1) % safeRotatingWords.length);
    }, 2200);
    return () => clearInterval(wordTimer);
  }, [safeRotatingWords.length]);

  // Moving images streams for infinite vertical marquee (Columns scrolling UP and DOWN)
  const streamCol1 = [
    { title: 'Vivid Astronaut Graphic', image: ASSETS.featureAstronaut, productId: 'prod-dtf-custom-size' },
    { title: 'Commercial Gang Sheet Roll', image: ASSETS.gangSheetRoll, productId: 'prod-dtf-gang-sheet' },
    { title: 'Cap & Curved Hat Press', image: ASSETS.featureCapPress, productId: 'prod-dtf-custom-size' },
    { title: 'Ultra-Fine Arcade Retro', image: ASSETS.featureFineArcade, productId: 'prod-dtf-custom-size' },
    { title: 'Streetwear Graphic Hoodie Press', image: ASSETS.heroBanner, productId: 'prod-dtf-gang-sheet' },
  ];

  const streamCol2 = [
    { title: 'UV DTF Decal Application', image: ASSETS.uvDtfDecals, productId: 'prod-uv-decals-sheet' },
    { title: 'Rooster Design on Pitch Black', image: ASSETS.featureRoosterBlack, productId: 'prod-dtf-custom-size' },
    { title: 'Premium Heavyweight Streetwear Blanks', image: ASSETS.blankApparel, productId: 'prod-heavyweight-tees' },
    { title: '100+ Commercial Wash Durability', image: ASSETS.featureStretchDurability, productId: 'prod-dtf-gang-sheet' },
    { title: 'Ultra Opaque Crisp White Underbase', image: ASSETS.featureWhiteCamp, productId: 'prod-dtf-custom-size' },
  ];

  const streamCol3 = [
    { title: 'Retro Baseball Script Print', image: ASSETS.featureRetroBaseball, productId: 'prod-dtf-custom-size' },
    { title: '9-Color Pantone Spectrum', image: ASSETS.featureGradientGlobe, productId: 'prod-dtf-custom-size' },
    { title: 'Custom Embroidered Patches', image: ASSETS.patches, productId: 'prod-embroidered-patches' },
    { title: 'Full Sizing Transfer Pack', image: ASSETS.dtfBySizeCollage, productId: 'prod-dtf-custom-size' },
    { title: 'Gloss Tumbler Wrap Decal', image: ASSETS.tumblerWrap, productId: 'prod-uv-decals-sheet' },
  ];

  // Gang Sheet Interactive Calculator Presets (Exact Ninja Transfers sizes & tiers)
  const gangSheetPresets = [
    { size: '22" x 24"', lengthInches: 24, price: 14.99, perSqIn: '$0.028', savings: '20% OFF', bestFor: 'Sample Run / 4-8 Logos' },
    { size: '22" x 60"', lengthInches: 60, price: 29.99, perSqIn: '$0.023', savings: '35% OFF', popular: true, bestFor: 'Small Batch / 12-20 Shirts' },
    { size: '22" x 120"', lengthInches: 120, price: 49.99, perSqIn: '$0.019', savings: '45% OFF', bestFor: 'Production Run / 30-50 Shirts' },
    { size: '22" x 240"', lengthInches: 240, price: 89.99, perSqIn: '$0.017', savings: '55% OFF', bestValue: true, bestFor: 'Master Roll / 70-110 Shirts' },
    { size: '22" x 360"', lengthInches: 360, price: 129.99, perSqIn: '$0.016', savings: '60% OFF', bestFor: 'Continuous Roll / 120+ Shirts' },
  ];
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(1);

  // Heat Press Guide Fabric Tabs
  const [activeFabricTab, setActiveFabricTab] = useState<string>('cotton');
  const fabricSettings: Record<string, { name: string; temp: string; time: string; pressure: string; peel: string; postPress: string; notes: string }> = {
    cotton: {
      name: '100% Cotton & Heavyweight Tees',
      temp: '300°F - 320°F (150°C - 160°C)',
      time: '12 - 15 Seconds',
      pressure: 'Medium - Heavy (50 - 60 PSI)',
      peel: 'Warm or Cold Peel (wait 5-10s)',
      postPress: '5 Seconds with parchment/Teflon',
      notes: 'Pre-press 3 seconds to remove moisture and flatten garment fibers.'
    },
    poly: {
      name: '100% Polyester & Athletic Dry-Fit',
      temp: '275°F - 285°F (135°C - 140°C)',
      time: '10 - 12 Seconds',
      pressure: 'Medium (40 - 45 PSI)',
      peel: 'Completely Cold Peel',
      postPress: '3 Seconds with parchment paper',
      notes: 'Lower temperature prevents fabric dye migration and scorch marks.'
    },
    blends: {
      name: '50/50 Poly-Cotton & Tri-Blends',
      temp: '290°F - 305°F (143°C - 152°C)',
      time: '12 Seconds',
      pressure: 'Medium - Heavy (50 PSI)',
      peel: 'Warm Peel',
      postPress: '5 Seconds with Teflon sheet',
      notes: 'Ideal for popular Bella+Canvas 3001 and Next Level soft tri-blends.'
    },
    nylon: {
      name: 'Nylon, Windbreakers & Spandex',
      temp: '265°F - 280°F (130°C - 138°C)',
      time: '10 Seconds',
      pressure: 'Light - Medium (35 - 40 PSI)',
      peel: 'Cold Peel',
      postPress: '3 Seconds light press',
      notes: 'Use low heat and test on an inconspicuous hem to prevent melting.'
    },
    canvas: {
      name: 'Heavy Duck Canvas Bags & Denim',
      temp: '315°F - 325°F (157°C - 163°C)',
      time: '15 - 18 Seconds',
      pressure: 'Heavy (60 - 70 PSI)',
      peel: 'Warm Peel',
      postPress: '5 Seconds heavy post-press',
      notes: 'High pressure ensures TPU adhesive deeply bonds into thick coarse weaves.'
    }
  };

  // Filter featured products
  const displayedProducts = products.filter(p => {
    if (featuredTab === 'all') return true;
    return p.category === featuredTab;
  }).slice(0, 6);

  // Dynamic showcase videos from store
  const productVideos = videos && videos.length > 0 ? videos : [
    {
      id: 'vid-press-hoodie',
      title: '10-Second Heat Press & Instant Peel on Streetwear Hoodie',
      subtitle: 'Watch the full heat press sequence with zero weeding and instant warm peel',
      duration: '0:45',
      tag: 'DTF PRESS TUTORIAL',
      thumbnail: ASSETS.heroBanner,
      productId: 'prod-dtf-custom-size',
      productName: 'Custom DTF Heat Transfers by Size',
      description: 'Watch our master printmaker press an 11" x 11" full-color custom DTF graphic onto a heavyweight 10oz streetwear black hoodie at 305°F for 12 seconds with 55 PSI pressure. Notice the ultra-opaque white underbase and instant, smooth peel.',
      steps: [
        'Pre-press garment 3s to remove fabric moisture',
        'Place DTF transfer film centered with heat tape',
        'Press 12s at 305°F with 55 PSI medium-heavy pressure',
        'Allow 5s warm rest, then peel film in one smooth motion',
        'Optional 5s post-press with Teflon sheet for matte soft hand'
      ]
    },
    {
      id: 'vid-gang-roll',
      title: '22" Gang Sheet Roll Cut & Fast Batch Pressing',
      subtitle: 'Unrolling 10ft continuous roll and pressing 15 shirts in 4 minutes',
      duration: '1:12',
      tag: 'HIGH VOLUME PRODUCTION',
      thumbnail: ASSETS.gangSheetRoll,
      productId: 'prod-gang-sheet-builder',
      productName: 'Visual Gang Sheet Builder (22" Roll)',
      description: 'See how commercial printshops gang 40+ different designs onto continuous 22" PET rolls, scissors-cut individual logos, and mass-produce clothing lines with zero screen setup fees and maximum linear yard savings.',
      steps: [
        'Unroll 22" x 120" commercial PET master film',
        'Quick scissors trim around nested logo graphics',
        'Batch press front pocket crests and full back artwork',
        'Peel and fold finished apparel with zero weeding'
      ]
    },
    {
      id: 'vid-uv-tumbler',
      title: 'UV DTF Decals Applied to 40oz Stanley Tumbler',
      subtitle: 'Peel, stick, scratch test with metal key, and running water test',
      duration: '0:58',
      tag: 'HARD GOODS & DRINKWARE',
      thumbnail: ASSETS.uvDtfDecals,
      productId: 'prod-uv-dtf-stickers',
      productName: 'UV DTF Custom Decals & Tumbler Wraps',
      description: 'No heat press required! Watch the 3D high-gloss embossed decal adhere to powder-coated stainless steel drinkware, survive an aggressive scratch test with a metal coin, and stay 100% waterproof under high-pressure running water.',
      steps: [
        'Clean tumbler surface with isopropyl alcohol wipe',
        'Peel opaque white backing from UV transfer decal',
        'Position decal and rub down firmly with squeegee',
        'Peel clear top carrier film slowly at 180° angle',
        'Permanent waterproof, scratch-proof 3D gloss finish'
      ]
    },
    {
      id: 'vid-wash-test',
      title: '100+ Commercial Wash Cycles Extreme Torture Test',
      subtitle: 'Stretching, pulling, and inspecting after 100 industrial washes',
      duration: '0:40',
      tag: 'LAB DURABILITY TEST',
      thumbnail: ASSETS.blankApparel,
      productId: 'prod-heavyweight-blank-tee',
      productName: 'Pro-Club Style Heavyweight 6.5oz Cotton Tee',
      description: 'Watch our lab technicians put a printed cotton tee through an extreme mechanical stretch test and inspect the TPU polyurethane adhesive after 100 real commercial washing machine cycles with zero cracking, flaking, or discoloration.',
      steps: [
        '100 commercial wash cycles with heavy-duty detergent',
        'High-heat industrial tumble dry cycle',
        'Mechanical horizontal stretch to 150% fabric width',
        'Diagonal stretch across fine gradient lines',
        'Zero cracking, zero flaking, and 100% color retention'
      ]
    }
  ];

  const handleOpenProduct = (productId: string) => {
    setSelectedProductId(productId);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = product.variants[0];
    addToCart({
      productId: product.id,
      productName: product.name,
      category: product.category,
      productImage: product.images[0],
      variantId: variant?.id || 'standard',
      variantName: variant?.name || 'Standard Adult 11" x 11"',
      unitPrice: variant ? variant.price : product.price,
      quantity: 1
    });
  };

  // 8 Feature cards data from add-home-page-2.png / Ninja Transfers
  const featureTiles = [
    { title: copy('home.feature.quality', 'Incredible Image Quality'), image: ASSETS.featureAstronaut },
    { title: copy('home.feature.detail', 'Super Fine Details'), image: ASSETS.featureFineArcade },
    { title: copy('home.feature.fabric', 'Works on All Fabrics'), image: ASSETS.featureCapPress },
    { title: copy('home.feature.color', 'Any Design on Any Color'), image: ASSETS.featureRoosterBlack },
    { title: copy('home.feature.borders', 'No Borders Necessary'), image: ASSETS.featureRetroBaseball },
    { title: copy('home.feature.white', 'Crisp Bright Whites'), image: ASSETS.featureWhiteCamp },
    { title: copy('home.feature.durability', '100+ Wash Durability'), image: ASSETS.featureStretchDurability },
    { title: copy('home.feature.printing', '9 Color Printing'), image: ASSETS.featureGradientGlobe },
  ];

  // Authentic customer reviews matching add-home-page-3.png / Ninja Transfers
  const customerReviews = [
    {
      name: copy('home.review.1.name', 'Edward Garcia'),
      tag: copy('home.review.1.tag', 'Food Pantry Director'),
      review: copy('home.review.1.text', "I have been loving the quality of the products and DTF's I have been receiving. I ordering shirts and prints for our food pantry volunteers. They loved them.")
    },
    {
      name: copy('home.review.2.name', 'Jill Fragus'),
      tag: copy('home.review.2.tag', 'Boutique Apparel Owner'),
      review: copy('home.review.2.text', "I've finally found my transfer company! My order was perfect. Amazing quality prints and lightning FAST turnaround time! Thank you! I'll definitely be ordering again!")
    },
    {
      name: copy('home.review.3.name', 'Brave Wolf Customs'),
      tag: copy('home.review.3.tag', 'Commercial Printshop'),
      review: copy('home.review.3.text', 'Excellent quality! I ordered "build your own gang sheet" - almost 200 square feet worth on my first order and they all arrived perfect. Easy to use, exactly what I was looking for. Just placed another order and will keep coming back!')
    },
    {
      name: copy('home.review.4.name', 'Erika Le...'),
      tag: copy('home.review.4.tag', 'Small Business Founder'),
      review: copy('home.review.4.text', "I have to say, Ambalvee with their customer service... say that they stand behind their products, that's all a small business could ask for.")
    },
    {
      name: copy('home.review.5.name', 'Kevin Kington'),
      tag: copy('home.review.5.tag', 'Streetwear Brand Owner'),
      review: copy('home.review.5.text', 'I have ordered numerous transfers from here and never been disappointed with the quality. I appreciate you guys. You are the best!!!')
    },
    {
      name: copy('home.review.6.name', 'Luxury Leisure'),
      tag: copy('home.review.6.tag', 'Custom Goods Maker'),
      review: copy('home.review.6.text', 'Service was impeccable. I cannot believe how quickly the items were shipped and met my expectations above and beyond. My go to from now on. I would recommend to anyone!!!!')
    },
    {
      name: copy('home.review.7.name', 'Caitlin L'),
      tag: copy('home.review.7.tag', 'Graphic Designer'),
      review: copy('home.review.7.text', 'Their friendliness and expertise made the whole experience enjoyable. I highly recommend Ambalvee Transfer, especially with Allie and Erin on the team!')
    }
  ];

  const faqs = [
    {
      q: copy('home.faq.1.question', 'What artwork format works best for Ambalvee Custom DTF Transfers?'),
      a: copy('home.faq.1.answer', 'We strongly recommend high-resolution PNG files with a transparent background at 300 DPI. We also accept vector PDF, SVG, Adobe Illustrator (.AI), and EPS files. If your design has a solid background, our prepress team can advise on preparing it for a clean print.')
    },
    {
      q: copy('home.faq.2.question', 'What fabrics can I press Ambalvee DTF Transfers onto?'),
      a: copy('home.faq.2.answer', 'Ambalvee DTF transfers work on virtually ANY fabric! That includes 100% cotton, 100% polyester, 50/50 poly-cotton blends, tri-blends, spandex, bamboo, nylon, and heavy duck canvas tote bags. Unlike sublimation, DTF looks equally vibrant on dark, pitch black, or light garments.')
    },
    {
      q: copy('home.faq.3.question', 'What are the exact heat press settings for applying DTF transfers?'),
      a: copy('home.faq.3.answer', 'Press at 300°F – 320°F (150°C – 160°C) with medium-to-heavy pressure (50-60 PSI) for just 10 to 15 seconds. Allow the transfer to cool for 5-10 seconds (warm or cold peel), gently peel the film away from a corner, and finish with a 5-second post-press using parchment or a Teflon sheet.')
    },
    {
      q: copy('home.faq.4.question', 'How many washes will Ambalvee Transfers endure?'),
      a: copy('home.faq.4.answer', 'Our proprietary TPU polyurethane adhesive powder formula has been lab-tested and verified through 100+ commercial wash cycles with zero cracking, flaking, or discoloration when washed inside-out in cold or warm water.')
    },
    {
      q: copy('home.faq.5.question', 'When will my order ship if I order today?'),
      a: copy('home.faq.5.answer', 'Orders placed before 3:00 PM EST qualify for Guaranteed Same-Day Dispatch! With automated production facilities on both the East Coast and West Coast, our delivery reaches most of the US in 1-2 business days.')
    },
    {
      q: copy('home.faq.6.question', 'What is the difference between Single Transfers and a Gang Sheet?'),
      a: copy('home.faq.6.answer', 'Single Transfers are pre-cut individual graphics sized to your specified dimensions. A Gang Sheet is a continuous 22"-wide roll where you place as many different designs, sizes, and neck labels as you want—saving up to 70% on high-volume print runs.')
    }
  ];

  return (
    <div className="bg-white text-neutral-900 font-sans space-y-14 lg:space-y-20 pb-20">
      
      {/* ========================================================================= */}
      {/* 0. LIVE DISPATCH CUTOFF TICKER BANNER (NINJA TRANSFERS SIGNATURE FEATURE) */}
      {/* ========================================================================= */}
      <div className="bg-[#253d38] text-white py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            <span className="uppercase tracking-wider font-extrabold text-yellow-300">
              {websiteSettings.offerLabel}
            </span>
            <span>
              {timeLeft.hours || timeLeft.minutes || timeLeft.seconds ? (
                <>
                  {websiteSettings.offerLead}{' '}
                  <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-yellow-200 font-black">
                    {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>{' '}
                  {websiteSettings.offerTail}
                </>
              ) : websiteSettings.offerExpiredText}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-rose-100">
            <span>{websiteSettings.offerShippingText}</span>
            <span>•</span>
            <span>{websiteSettings.offerGuaranteeText}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (NINJA TRANSFERS BOLD HIGH-IMPACT STYLE)                  */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-neutral-100 overflow-hidden pt-2 pb-12 lg:pt-6 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Main Headline with dynamic rotating changing words */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.03] uppercase text-neutral-950">
                  {websiteSettings.heroHeadlineLead} <br />
                  <span className="text-red-600 inline-block transition-all duration-300 transform font-black">
                    {safeRotatingWords[rotatingWordIndex % safeRotatingWords.length]}
                  </span>
                </h1>
                <p className="text-neutral-700 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
                  {websiteSettings.heroDescription}
                </p>
              </div>

              {/* Editable storefront guarantee badges */}
              <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs sm:text-sm font-bold text-neutral-800 pt-1">
                {websiteSettings.heroGuarantees.map(guarantee => (
                  <span key={guarantee} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{guarantee}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons - Direct e-commerce order links (no canvas builder sheet) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => { 
                    setSelectedProductId('prod-dtf-gang-sheet'); 
                    setView('product-detail'); 
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 uppercase tracking-wide group whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span>{websiteSettings.heroPrimaryButton}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => { 
                    setSelectedProductId('prod-dtf-custom-size'); 
                    setView('product-detail'); 
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }}
                  className="px-5 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs rounded-lg transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 uppercase tracking-wide whitespace-nowrap"
                >
                  <span>{websiteSettings.heroSecondaryButton}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Quick Secondary Links Strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-600 pt-1">
                <button 
                  onClick={() => { setCatalogCategory('sample-packs'); setView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-red-600 hover:text-red-700 underline font-extrabold flex items-center gap-1"
                >
                  <span>{websiteSettings.heroSampleButton}</span>
                </button>
                <span>•</span>
                <span className="flex items-center gap-1 text-neutral-500 font-medium">
                  <Truck className="w-3.5 h-3.5 text-neutral-700" />
                  <span>{websiteSettings.heroShippingNote}</span>
                </span>
              </div>

            </div>

            {/* Right Hero Showcase: Smooth Infinite Vertical Moving Images (Upper & Down Marquee) */}
            <div className="lg:col-span-5 h-[480px] sm:h-[540px] lg:h-[600px] overflow-hidden relative rounded-3xl p-2 bg-gradient-to-b from-neutral-50 to-neutral-100 border border-neutral-200/90 shadow-inner">
              {/* Top & Bottom Soft Fade Masks */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-full">
                
                {/* Column 1: Scrolling UP */}
                <div className="overflow-hidden relative h-full">
                  <div className="animate-marquee-up pause-on-hover flex flex-col gap-3">
                    {[...streamCol1, ...streamCol1].map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        aria-label={`View ${item.title}`}
                        className="w-full text-left rounded-2xl overflow-hidden bg-white border border-neutral-200/90 shadow-xs aspect-3/4 shrink-0 group relative hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 transition-all cursor-pointer"
                        onClick={() => { setSelectedProductId(item.productId); setView('product-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        title={item.title}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-neutral-950/80 via-neutral-950/45 to-transparent px-3 pb-3 pt-8 text-[11px] font-bold text-white opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all">
                          <span>View product</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 2: Scrolling DOWN */}
                <div className="overflow-hidden relative h-full">
                  <div className="animate-marquee-down pause-on-hover flex flex-col gap-3">
                    {[...streamCol2, ...streamCol2].map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        aria-label={`View ${item.title}`}
                        className="w-full text-left rounded-2xl overflow-hidden bg-white border border-neutral-200/90 shadow-xs aspect-3/4 shrink-0 group relative hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 transition-all cursor-pointer"
                        onClick={() => { setSelectedProductId(item.productId); setView('product-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        title={item.title}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-neutral-950/80 via-neutral-950/45 to-transparent px-3 pb-3 pt-8 text-[11px] font-bold text-white opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all">
                          <span>View product</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 3: Scrolling UP (hidden on mobile, visible on sm/lg) */}
                <div className="hidden sm:block overflow-hidden relative h-full">
                  <div className="animate-marquee-up-fast pause-on-hover flex flex-col gap-3">
                    {[...streamCol3, ...streamCol3].map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        aria-label={`View ${item.title}`}
                        className="w-full text-left rounded-2xl overflow-hidden bg-white border border-neutral-200/90 shadow-xs aspect-3/4 shrink-0 group relative hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 transition-all cursor-pointer"
                        onClick={() => { setSelectedProductId(item.productId); setView('product-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        title={item.title}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-neutral-950/80 via-neutral-950/45 to-transparent px-3 pb-3 pt-8 text-[11px] font-bold text-white opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all">
                          <span>View product</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SELECT THE DTF PRODUCT THAT WORKS BEST FOR YOU (MATCHING NINJATRANSFERS) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 block mb-1">
            {copy('home.ordering.eyebrow', 'HOW WOULD YOU LIKE TO ORDER?')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
            {copy('home.ordering.heading', 'Select the DTF Product That Works Best for You')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* CARD 1: DTF Transfers By Size */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              {/* Image with Pill Badge */}
              <div className="relative aspect-4/3 bg-sky-50 overflow-hidden">
                <img 
                  src={ASSETS.dtfBySizeCollage} 
                  alt="DTF Transfers By Size" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3.5 py-1 rounded-lg shadow-sm">
                  Most Popular
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-black text-neutral-950">
                  DTF Transfers By Size
                </h3>
                <p className="text-emerald-700 font-extrabold text-sm">
                  As low as $0.02 per sq. inch
                </p>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed pt-1">
                  Upload your individual graphics and pick standard sizes from 2" neck labels to 14" full back prints. Zero weeding required.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => { setSelectedProductId('prod-dtf-custom-size'); setView('product-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-sm active:scale-[0.99] text-center uppercase tracking-wider"
              >
                Shop Transfers By Size
              </button>
            </div>
          </div>

          {/* CARD 2: Build a DTF Gang Sheet */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group ring-2 ring-red-500/20">
            <div>
              {/* Image with Pill Badge */}
              <div className="relative aspect-4/3 bg-sky-50 overflow-hidden">
                <img 
                  src={ASSETS.gangBuilderScreen} 
                  alt="Custom DTF Gang Sheet" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-neutral-950 text-white text-xs font-black px-3.5 py-1 rounded-lg shadow-sm">
                  Continuous Rolls • 22" Wide
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-black text-neutral-950">
                  Custom DTF Gang Sheets
                </h3>
                <p className="text-emerald-700 font-extrabold text-sm">
                  Save Up to 70% vs Single Transfers
                </p>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed pt-1">
                  Commercial 22"-wide PET film rolls. Choose lengths from 1 foot to 40 feet with unlimited color reproduction and instant upload.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => { setSelectedProductId('prod-dtf-gang-sheet'); setView('product-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition-all shadow-sm active:scale-[0.99] text-center uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span>{websiteSettings.featuredCtaButton}</span>
              </button>
            </div>
          </div>

          {/* CARD 3: Upload a DTF Gang Sheet */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              {/* Image with Pill Badge */}
              <div className="relative aspect-4/3 bg-sky-50 overflow-hidden">
                <img 
                  src={ASSETS.gangRollPrintReady} 
                  alt="Upload a DTF Gang Sheet" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-sky-600 text-white text-xs font-black px-3.5 py-1 rounded-lg shadow-sm">
                  For Pros • Print-Ready Files
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-black text-neutral-950">
                  Upload a DTF Gang Sheet
                </h3>
                <p className="text-emerald-700 font-extrabold text-sm">
                  300 DPI Transparent PNG / PDF
                </p>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed pt-1">
                  Have your 22"-wide roll artwork ready from Illustrator, Photoshop, or Canva? Upload directly for instant prepress check.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => { setSelectedProductId('prod-dtf-gang-sheet'); setView('product-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-sm active:scale-[0.99] text-center uppercase tracking-wider"
              >
                Order Gang Sheet by the Foot
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2.5 INTERACTIVE GANG SHEET ESTIMATOR / SIZER (NINJA TRANSFERS WIDGET)      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-950 rounded-3xl p-6 sm:p-10 text-white border border-neutral-800 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-extrabold">
                <Calculator className="w-3.5 h-3.5" />
                <span>{copy('home.calculator.badge', 'INSTANT GANG SHEET PRICING CALCULATOR')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {copy('home.calculator.heading', 'Calculate Your Gang Sheet Savings')}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {copy('home.calculator.description', 'Continuous 22-inch commercial PET film rolls. Print as many logos, front pocket prints, sleeve designs, and neck tags as you can fit.')}
              </p>
            </div>

            {/* Price Preview Callout */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center gap-6 shrink-0">
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Total Roll Price</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                  ${gangSheetPresets[selectedPresetIndex].price.toFixed(2)}
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  {gangSheetPresets[selectedPresetIndex].perSqIn} / sq inch ({gangSheetPresets[selectedPresetIndex].savings})
                </span>
              </div>
              
              <button
                onClick={() => { setSelectedProductId('prod-dtf-gang-sheet'); setView('product-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>Order {gangSheetPresets[selectedPresetIndex].size} Roll</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Size Pill Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
            {gangSheetPresets.map((preset, idx) => {
              const isSelected = selectedPresetIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPresetIndex(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    isSelected 
                      ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/50 text-white' 
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-sm text-white font-mono">{preset.size}</span>
                    {preset.popular && (
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">POPULAR</span>
                    )}
                    {preset.bestValue && (
                      <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">BEST VALUE</span>
                    )}
                  </div>
                  <div className="text-lg font-black text-emerald-400 font-mono">${preset.price.toFixed(2)}</div>
                  <div className="text-[10px] text-neutral-400 mt-1 line-clamp-1">{preset.bestFor}</div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 8-GRID FEATURE SHOWCASE (NINJA TRANSFERS EXACT 8 TILES)                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 block mb-1">
              {websiteSettings.industrySectionHeading}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
            {copy('home.features.heading', 'Commercial Quality Built for High Output')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featureTiles.map((tile, idx) => (
            <div 
              key={idx}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-sm group bg-neutral-950 border border-neutral-200/60"
            >
              <img 
                src={tile.image} 
                alt={tile.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              {/* Subtle vignette gradient on bottom for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              {/* Bold White Title in Bottom Left */}
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 pointer-events-none">
                <span className="text-sm sm:text-base lg:text-lg font-black text-white leading-tight drop-shadow-md block">
                  {tile.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COMMERCIAL PERFORMANCE STATS STRIP                                     */}
      {/* ========================================================================= */}
      <section className="border-y border-neutral-200/80 py-10 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-neutral-200/60">
            <div>
              <span className="text-2xl sm:text-4xl font-black text-neutral-950 font-mono block">01</span>
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider mt-1 block">Choose individual transfers</span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl font-black text-red-600 font-mono block">02</span>
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider mt-1 block">Arrange a gang sheet</span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl font-black text-neutral-950 font-mono block">03</span>
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider mt-1 block">Review product details</span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl font-black text-emerald-600 font-mono block">04</span>
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider mt-1 block">Choose shipping at checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.5 SIDE-BY-SIDE COMPARISON TABLE (NINJA TRANSFERS SIGNATURE SECTION)     */}
      {/* ========================================================================= */}
      <section className="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 block mb-1">
            {copy('home.comparison.eyebrow', 'HOW WE COMPARE')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            {copy('home.comparison.heading', 'Ambalvee DTF vs Other Printing Methods')}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            {copy('home.comparison.description', 'See why screen printers, embroidery shops, and clothing brands are migrating 100% of their heat transfer production to Ambalvee.')}
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-neutral-200 shadow-sm bg-white">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="py-4 px-5 font-black text-neutral-900 uppercase">Features &amp; Specifications</th>
                <th className="py-4 px-5 font-black text-red-600 uppercase bg-red-50/60 border-x border-red-200">
                  Ambalvee DTF
                </th>
                <th className="py-4 px-5 font-bold text-neutral-600 uppercase">Traditional Screen Print</th>
                <th className="py-4 px-5 font-bold text-neutral-600 uppercase">Heat Transfer Vinyl (HTV)</th>
                <th className="py-4 px-5 font-bold text-neutral-600 uppercase">Dye Sublimation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              <tr>
                <td className="py-3.5 px-5 font-extrabold text-neutral-950">Weeding Required</td>
                <td className="py-3.5 px-5 font-black text-emerald-700 bg-red-50/30 border-x border-red-200">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> NO WEEDING</span>
                </td>
                <td className="py-3.5 px-5 text-neutral-500">None</td>
                <td className="py-3.5 px-5 font-bold text-rose-600">Hours of manual weeding</td>
                <td className="py-3.5 px-5 text-neutral-500">None</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-extrabold text-neutral-950">Minimum Order Quantity</td>
                <td className="py-3.5 px-5 font-black text-emerald-700 bg-red-50/30 border-x border-red-200">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Just 1 Piece ($0.50)</span>
                </td>
                <td className="py-3.5 px-5 text-neutral-500">24 - 48 Pieces Minimum</td>
                <td className="py-3.5 px-5 text-neutral-500">1 Piece</td>
                <td className="py-3.5 px-5 text-neutral-500">1 Piece</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-extrabold text-neutral-950">Setup &amp; Screen Fees</td>
                <td className="py-3.5 px-5 font-black text-emerald-700 bg-red-50/30 border-x border-red-200">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> $0 Free Prepress</span>
                </td>
                <td className="py-3.5 px-5 font-bold text-rose-600">$25 - $50 per color</td>
                <td className="py-3.5 px-5 text-neutral-500">$0</td>
                <td className="py-3.5 px-5 text-neutral-500">$0</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-extrabold text-neutral-950">Colors &amp; Gradients</td>
                <td className="py-3.5 px-5 font-black text-emerald-700 bg-red-50/30 border-x border-red-200">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Unlimited CMYK+W Photo</span>
                </td>
                <td className="py-3.5 px-5 text-neutral-500">Limited (1 - 4 colors)</td>
                <td className="py-3.5 px-5 font-bold text-rose-600">Single color only</td>
                <td className="py-3.5 px-5 text-neutral-500">Full color (light only)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-extrabold text-neutral-950">Fabric Compatibility</td>
                <td className="py-3.5 px-5 font-black text-emerald-700 bg-red-50/30 border-x border-red-200">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> All Fabrics &amp; Colors</span>
                </td>
                <td className="py-3.5 px-5 text-neutral-500">Cotton &amp; Blends</td>
                <td className="py-3.5 px-5 text-neutral-500">Cotton &amp; Poly</td>
                <td className="py-3.5 px-5 font-bold text-rose-600">White 100% Poly Only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-extrabold text-neutral-950">Turnaround Time</td>
                <td className="py-3.5 px-5 font-black text-emerald-700 bg-red-50/30 border-x border-red-200">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Same Day Dispatch</span>
                </td>
                <td className="py-3.5 px-5 font-bold text-rose-600">2 - 3 Weeks</td>
                <td className="py-3.5 px-5 text-neutral-500">1 - 2 Days DIY</td>
                <td className="py-3.5 px-5 text-neutral-500">2 - 4 Days</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-extrabold text-neutral-950">Wash Durability</td>
                <td className="py-3.5 px-5 font-black text-emerald-700 bg-red-50/30 border-x border-red-200">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> 100+ Washes (Guaranteed)</span>
                </td>
                <td className="py-3.5 px-5 text-neutral-500">50 - 75 Washes</td>
                <td className="py-3.5 px-5 font-bold text-rose-600">20 - 30 Washes (Peels)</td>
                <td className="py-3.5 px-5 text-neutral-500">Permanent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.7 Heat press reference                                                   */}
      {/* ========================================================================= */}
      <section className="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-600 block mb-1">
                EASY APPLICATION GUIDE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
                Heat Press Settings for Any Garment
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Press like a pro in 10 seconds. Select your fabric to view verified temperature and pressure specifications.
              </p>
            </div>

            {/* Fabric Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {Object.keys(fabricSettings).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveFabricTab(key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeFabricTab === key
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Active Fabric Setting Spec Box */}
          {(() => {
            const spec = fabricSettings[activeFabricTab];
            return (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Temperature</span>
                  <span className="text-xl font-black text-neutral-950 font-mono mt-1 block">{spec.temp}</span>
                  <span className="text-xs text-neutral-500 mt-1 block">Calibrated dual platen</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Press Time</span>
                  <span className="text-xl font-black text-red-600 font-mono mt-1 block">{spec.time}</span>
                  <span className="text-xs text-neutral-500 mt-1 block">Zero scorching formula</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Pressure</span>
                  <span className="text-xl font-black text-neutral-950 font-mono mt-1 block">{spec.pressure}</span>
                  <span className="text-xs text-neutral-500 mt-1 block">Medium-to-heavy</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Peel Style</span>
                  <span className="text-xl font-black text-emerald-600 font-mono mt-1 block">{spec.peel}</span>
                  <span className="text-xs text-neutral-500 mt-1 block">{spec.notes}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED PRODUCTS & BEST SELLERS                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-black text-red-600 uppercase tracking-widest block mb-1">
              {copy('home.featured.eyebrow', 'COMMERCIAL GRADE CATALOG')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
              {copy('home.featured.heading', 'Featured Products & Best Sellers')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
              {copy('home.featured.description', 'Custom heat transfers, continuous gang rolls, 3D UV stickers for tumblers, heavyweight blanks, and equipment.')}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Best Sellers' },
              { id: 'dtf-transfers', label: 'DTF Transfers' },
              { id: 'gang-sheets', label: 'Gang Sheets' },
              { id: 'uv-dtf', label: 'UV Stickers' },
              { id: 'patches-stickers', label: 'Patches' },
              { id: 'blank-apparel', label: 'Blank Apparel' },
              { id: 'supplies', label: 'Supplies' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFeaturedTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  featuredTab === tab.id
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleOpenProduct(product.id)}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-60 bg-neutral-100 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {product.bestSeller && (
                      <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
                        BEST SELLER
                      </span>
                    )}
                    {product.featured && (
                      <span className="bg-neutral-950 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
                        PRO PICK
                      </span>
                    )}
                  </div>

                  {/* Quick Dispatch Badge */}
                  <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-neutral-200/80 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-red-600" />
                    <span>Shipping details at checkout</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pb-2">
                  <h3 className="font-black text-neutral-900 text-base group-hover:text-red-600 transition-colors line-clamp-1 uppercase">
                    {product.name}
                  </h3>

                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Volume Tier Spec Pill */}
                  {product.volumeTiers.length > 1 && (
                    <div className="mt-3 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200/80 text-[11px] text-red-900 font-bold flex items-center justify-between">
                      <span>Commercial Production:</span>
                      <span>High Volume Ready</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications & Action Footer */}
              <div className="p-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Production Schedule</span>
                  <span className="text-xs font-bold text-neutral-900">
                    {product.specifications?.turnaround || 'Ships in 24h'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="px-4 py-2.5 bg-neutral-950 hover:bg-red-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Buy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Catalog Button */}
        <div className="text-center pt-8">
          <button
            onClick={() => { setCatalogCategory('all'); setView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-8 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-neutral-300 hover:border-neutral-400 transition-all shadow-xs inline-flex items-center gap-2"
          >
            <span>Explore All 20+ Commercial Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5.5 100% AMBALVEE SATISFACTION GUARANTEE (NINJA 45-DAY PROMISE)           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-5 max-w-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg">
              <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-red-400 block">
                OUR IRONCLAD PROMISE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {copy('home.guarantee.heading', 'The 100% Ambalvee Guarantee')}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {copy('home.guarantee.description', 'If you are not completely blown away by the color richness, vibrancy, and durability of your transfers within 45 days of delivery, we will reprint your order for free or issue a 100% full refund. No stress, no runaround.')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => { setSelectedProductId('prod-dtf-custom-size'); setView('product-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              {copy('home.guarantee.orderButton', 'Order Risk-Free')}
            </button>
            <button
              onClick={() => { setCatalogCategory('sample-packs'); setView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-7 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-700"
            >
              {copy('home.guarantee.sampleButton', 'Get $1 Sample Kit')}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. Customer feedback */}
      {/* ========================================================================= */}
      <section className="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 block">
            {copy('home.reviews.eyebrow', 'VERIFIED FEEDBACK FROM REAL CREATORS')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight">
            {copy('home.reviews.heading', 'Thousands of 5 Star DTF Transfer Reviews')}
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base font-normal">
            {copy('home.reviews.description', 'Trusted by 500,000+ Designers, Crafters, Streetwear Brands, and Commercial Printshops')}
          </p>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {customerReviews.map((rev, index) => (
            <div 
              key={index}
              className="bg-[#f8f9fa] rounded-2xl p-6 border border-neutral-200/70 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className={`w-11 h-11 rounded-full flex items-center justify-center border border-neutral-300 shadow-2xs shrink-0 text-xs font-black text-neutral-800 ${['bg-rose-100', 'bg-sky-100', 'bg-amber-100', 'bg-emerald-100'][index % 4]}`}
                  >
                    {rev.name.split(' ').slice(0, 2).map((part) => part[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-neutral-950 leading-tight">
                      {rev.name}
                    </h4>
                    <span className="text-[11px] text-neutral-500 font-medium block">
                      {rev.tag}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                  "{rev.review}"
                </p>
              </div>

              {/* 5 Yellow Stars at Bottom */}
              <div className="flex text-amber-400 pt-2 border-t border-neutral-200/60">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRODUCT VIDEOS IN ACTION                                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black text-red-600 uppercase tracking-widest block mb-1.5">
            {copy('home.tutorials.eyebrow', 'SEE THE QUALITY IN REAL TIME')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            {copy('home.tutorials.heading', 'Watch Our Transfers in Action')}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            {copy('home.tutorials.description', 'Watch live printshop heat press applications, continuous gang roll peeling, 3D UV decal stickiness, and 100+ commercial wash tests.')}
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productVideos.map((video: any) => {
            const thumb = video.thumbnailUrl || video.thumbnail || ASSETS.heroBanner;
            const badgeTag = video.tag || 'TUTORIAL';
            return (
              <div
                key={video.id}
                onClick={() => {
                  setActiveVideo({
                    ...video,
                    thumbnail: thumb,
                    tag: badgeTag,
                    steps: video.steps || []
                  });
                  setIsPlaying(true);
                  setVideoProgress(15);
                }}
                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Video Thumbnail with Play Button */}
                  <div className="relative h-48 bg-neutral-900 overflow-hidden">
                    <img
                      src={thumb}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30" />

                    {/* Duration Badge */}
                    <span className="absolute top-3 right-3 bg-neutral-950/80 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {video.duration}
                    </span>

                    {/* Tag */}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {badgeTag}
                    </span>

                    {/* Pulsing Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-13 h-13 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Click to Watch Demo</span>
                    </span>
                  </div>

                  {/* Video Info */}
                  <div className="p-4.5 space-y-2">
                    <h3 className="font-black text-neutral-950 text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                      {video.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer Product Link */}
                <div className="p-4.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Featured Item</span>
                    <span className="text-xs font-black text-neutral-900 truncate max-w-44 block">
                      {video.productName || video.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <span>Watch Tutorial</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE VIDEO MODAL PLAYER                                         */}
      {/* ========================================================================= */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="bg-neutral-950 rounded-3xl max-w-3xl w-full overflow-hidden border border-neutral-800 shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80">
              <div className="flex items-center gap-2.5">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                  {activeVideo.tag}
                </span>
                <span className="font-bold text-sm text-neutral-200 truncate max-w-md">
                  {activeVideo.title}
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport Area */}
            <div className="relative aspect-16/9 bg-neutral-900 flex items-center justify-center overflow-hidden">
              <img 
                src={activeVideo.thumbnail} 
                alt={activeVideo.title}
                className="w-full h-full object-cover opacity-75"
              />

              {/* Watermark Logo */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-xs px-3 py-1 rounded-full border border-neutral-800 text-xs font-black">
                <div className="w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px]">A</div>
                <span>AMBALVEE LAB</span>
              </div>

              {/* Real-time Overlay Graphic */}
              <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-mono text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                300°F · 12 SECONDS · 55 PSI
              </div>

              {/* Center Play/Pause Trigger */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-white/90 text-neutral-950 flex items-center justify-center hover:scale-110 hover:bg-red-600 hover:text-white transition-all shadow-2xl z-10"
              >
                {isPlaying ? <span className="font-black text-sm">❚❚</span> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              {/* Bottom Video Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent space-y-2">
                {/* Progress Scrub Bar */}
                <div 
                  className="w-full h-1.5 bg-neutral-700 rounded-full cursor-pointer overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setVideoProgress(Math.round((clickX / rect.width) * 100));
                  }}
                >
                  <div 
                    className="h-full bg-red-600 rounded-full transition-all"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-white font-bold"
                    >
                      {isPlaying ? 'PAUSE' : 'PLAY'}
                    </button>
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-white"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-[11px] text-neutral-400">
                      0:18 / {activeVideo.duration}
                    </span>
                  </div>

                  <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    HD 1080P PRO PRINT
                  </span>
                </div>
              </div>
            </div>

            {/* Video Details & Steps */}
            <div className="p-6 bg-neutral-900 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h4 className="text-base font-black uppercase text-white">
                    {activeVideo.productName}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-lg leading-relaxed">
                    {activeVideo.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleOpenProduct(activeVideo.productId);
                    setActiveVideo(null);
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
                >
                  <span>Shop Featured Product</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Application steps checklist */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Key Steps Shown in this Video:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                  {activeVideo.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SAMPLE PACK PROMO BANNER (NINJA FREE TEST PACK)                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="bg-red-600 text-white font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full inline-block">
              {copy('home.sample.eyebrow', 'RISK-FREE TEST PACK')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 leading-tight">
              {copy('home.sample.heading', 'Get the $1.00 DTF Sample Pack Kit')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {copy('home.sample.description', 'Test our print clarity, color gradients, and wash endurance on your own garments before placing bulk orders. Includes 6 custom DTF transfers, 2 UV DTF decals, and a $10 credit towards your first custom order.')}
            </p>
          </div>

          <button
            onClick={() => { setCatalogCategory('sample-packs'); setView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>{copy('home.sample.button', 'Order $1 Sample Pack')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FAQ ACCORDION                                                         */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 block mb-1">
            {copy('home.faq.eyebrow', 'HAVE QUESTIONS?')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
            {copy('home.faq.heading', 'Frequently Asked Questions')}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {copy('home.faq.description', 'Everything you need to know about Ambalvee DTF transfers, gang sheets, artwork formats, and same-day shipping.')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm text-neutral-900 hover:text-red-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4.5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
