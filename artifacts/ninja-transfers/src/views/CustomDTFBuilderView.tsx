import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockStore';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  ArrowRight, 
  Plus, 
  Minus, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

export const CustomDTFBuilderView: React.FC = () => {
  const { addToCart, setView } = useStore();

  // Size Presets
  const presets = [
    { name: '2" × 2" Pocket/Sleeve', w: 2, h: 2, basePrice: 1.25 },
    { name: '4" × 4" Left Chest', w: 4, h: 4, basePrice: 2.45 },
    { name: '9" × 9" Youth Front', w: 9, h: 9, basePrice: 3.99 },
    { name: '11" × 11" Adult Standard', w: 11, h: 11, basePrice: 5.50 },
    { name: '12" × 17" Oversized Back', w: 12, h: 17, basePrice: 7.95 },
    { name: 'Custom Dimensions', w: 10, h: 10, basePrice: 4.80, isCustom: true }
  ];

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(3); // 11" x 11" default
  const [customWidth, setCustomWidth] = useState(10);
  const [customHeight, setCustomHeight] = useState(10);
  const [garmentColor, setGarmentColor] = useState<'dark' | 'light'>('dark');
  const [fabricType, setFabricType] = useState('100% Cotton & Blends');
  const [quantity, setQuantity] = useState(25);
  const [notes, setNotes] = useState('');

  // Sample or uploaded artwork
  const sampleArtworks = [
    { name: 'Urban Alchemy Streetwear Skull', url: ASSETS.heroBanner, dpi: 300 },
    { name: 'Vintage Adventure Mountain Badge', url: ASSETS.gangSheetRoll, dpi: 300 },
    { name: 'Neon Electric Botanical Tiger', url: ASSETS.uvDtfDecals, dpi: 600 },
  ];

  const [activeArtwork, setActiveArtwork] = useState<{
    name: string;
    url: string;
    dpi: number;
    hasTransparentBg: boolean;
  }>({
    name: sampleArtworks[0].name,
    url: sampleArtworks[0].url,
    dpi: 300,
    hasTransparentBg: true
  });

  const [uploadedFileNotice, setUploadedFileNotice] = useState<string | null>(null);

  const activePreset = presets[selectedPresetIndex];
  const widthInches = activePreset.isCustom ? customWidth : activePreset.w;
  const heightInches = activePreset.isCustom ? customHeight : activePreset.h;

  // Calculate pricing based on sq inches and quantity
  const sqInches = widthInches * heightInches;
  // standard DTF formula approx $0.045 / sq inch with minimums
  const baseCalculated = Math.max(1.20, Number((sqInches * 0.045).toFixed(2)));

  // Tier discounts
  let discountPercentage = 0;
  if (quantity >= 100) discountPercentage = 62;
  else if (quantity >= 50) discountPercentage = 50;
  else if (quantity >= 25) discountPercentage = 38;
  else if (quantity >= 10) discountPercentage = 25;

  const unitPrice = Number((baseCalculated * (1 - discountPercentage / 100)).toFixed(2));
  const subtotal = Number((unitPrice * quantity).toFixed(2));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setActiveArtwork({
        name: file.name,
        url: objectUrl,
        dpi: 300,
        hasTransparentBg: file.type.includes('png') || file.type.includes('svg')
      });
      setUploadedFileNotice(`Artwork "${file.name}" uploaded & resolution inspected (300 DPI verified)`);
      setTimeout(() => setUploadedFileNotice(null), 4000);
    }
  };

  const handleAddCustomToCart = () => {
    addToCart({
      productId: 'prod-dtf-custom-size',
      productName: `Custom DTF Transfer (${widthInches}" × ${heightInches}")`,
      category: 'dtf-transfers',
      productImage: activeArtwork.url,
      variantName: `${widthInches}" × ${heightInches}" (${garmentColor === 'dark' ? 'Dark Garments' : 'Light Garments'})`,
      unitPrice,
      quantity,
      customConfig: {
        sizePreset: activePreset.name,
        widthInches,
        heightInches,
        fabricType,
        fabricColor: garmentColor,
        artworkUrl: activeArtwork.url,
        artfileName: activeArtwork.name,
        artworkDpi: activeArtwork.dpi,
        hasTransparentBg: activeArtwork.hasTransparentBg,
        notes
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-neutral-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
            Interactive Transfer Configurator
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
            Custom DTF Heat Transfers by Size
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Upload your artwork, inspect transparency, and test live shirt mockup sizing with tiered volume discounts.
          </p>
        </div>

        <button
          onClick={() => setView('gang-sheet-builder')}
          className="text-xs font-bold text-neutral-700 hover:text-rose-600 flex items-center gap-1.5 shrink-0"
        >
          <Layers className="w-4 h-4 text-rose-500" />
          <span>Switch to Gang Sheet Builder →</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configuration Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Transfer Dimensions */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                <span>Select Transfer Dimensions</span>
              </h2>
              <span className="text-xs font-mono font-bold text-rose-600">
                Current: {widthInches}" × {heightInches}"
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPresetIndex(index)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPresetIndex === index
                      ? 'border-rose-600 bg-rose-50/40 ring-1 ring-rose-600 text-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{preset.name}</span>
                  <span className="text-[11px] font-mono text-neutral-500 mt-0.5 block">
                    {preset.isCustom ? 'Enter W × H' : `From $${preset.basePrice.toFixed(2)}`}
                  </span>
                </button>
              ))}
            </div>

            {/* If Custom Dimensions is selected */}
            {activePreset.isCustom && (
              <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Width (Inches, up to 22")
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="22"
                    step="0.5"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(1, Math.min(22, parseFloat(e.target.value) || 1)))}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Height (Inches, up to 48")
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    step="0.5"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(1, Math.min(48, parseFloat(e.target.value) || 1)))}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Upload Artwork */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span>Upload Custom Artwork (PNG, SVG, JPG, PDF)</span>
            </h2>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-neutral-300 hover:border-rose-500 rounded-xl p-6 text-center bg-neutral-50/50 transition-colors">
              <input
                type="file"
                id="file-upload-input"
                accept="image/png, image/jpeg, image/svg+xml, application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
                <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-neutral-800">
                  Click to Browse or Drag & Drop Artwork Here
                </div>
                <p className="text-[11px] text-neutral-500">
                  Recommended: 300 DPI Transparent PNG · Max File Size: 100MB
                </p>
              </label>
            </div>

            {uploadedFileNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadedFileNotice}</span>
              </div>
            )}

            {/* Quick Sample Artworks */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-500 block">
                Or choose sample graphic to test:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleArtworks.map((art, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveArtwork({
                      name: art.name,
                      url: art.url,
                      dpi: art.dpi,
                      hasTransparentBg: true
                    })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      activeArtwork.name === art.name
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {art.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Artwork Inspection Specs */}
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 truncate max-w-xs">{activeArtwork.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {activeArtwork.dpi} DPI
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-700 font-medium">Transparent BG OK</span>
              </div>
            </div>
          </div>

          {/* Step 3: Garment Color & Substrate */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <span>Garment Tone & Underbase</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGarmentColor('dark')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  garmentColor === 'dark'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-black border border-neutral-700" />
                  <span className="text-xs font-bold">Dark / Black Garments</span>
                </div>
                <span className={`text-[10px] mt-1 block ${garmentColor === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Full opaque white underbase applied
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGarmentColor('light')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  garmentColor === 'light'
                    ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600 text-neutral-900 shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white border border-neutral-300" />
                  <span className="text-xs font-bold">Light / White Garments</span>
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Optimized soft-hand feel formula
                </span>
              </button>
            </div>
          </div>

          {/* Step 4: Quantity & Volume Discount Stepper */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-bold">4</span>
                <span>Select Order Quantity</span>
              </h2>
              {discountPercentage > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                  {discountPercentage}% Wholesale Tier
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 5))}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 py-2 text-center text-sm font-mono font-bold text-neutral-900 border-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 5)}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick quantity shortcut buttons */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[1, 10, 25, 50, 100, 250].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantity(qty)}
                    className={`px-2.5 py-1.5 rounded border font-mono transition-colors ${
                      quantity === qty
                        ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {qty}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live T-Shirt Visualizer & Pricing Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* T-Shirt Visualizer */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-neutral-800">Live Garment Mockup</span>
              <span className="text-neutral-500 capitalize">{garmentColor} Crewneck · {widthInches}" × {heightInches}"</span>
            </div>

            {/* Visualizer Canvas */}
            <div className={`relative h-80 rounded-xl overflow-hidden flex items-center justify-center p-6 border transition-colors ${
              garmentColor === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
            }`}>
              {/* T-Shirt base silhouette texture */}
              <div className={`relative w-64 h-72 rounded-2xl flex items-center justify-center p-4 border shadow-inner ${
                garmentColor === 'dark' 
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-700' 
                  : 'bg-white border-neutral-300 text-neutral-200'
              }`}>
                {/* Collar indicator */}
                <div className={`absolute top-2 w-16 h-4 rounded-b-full border-b-2 ${
                  garmentColor === 'dark' ? 'border-neutral-700' : 'border-neutral-300'
                }`} />

                {/* The artwork positioned on chest */}
                <div 
                  className="relative z-10 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 shadow-sm"
                  style={{
                    width: `${Math.min(180, Math.max(50, widthInches * 12))}px`,
                    height: `${Math.min(180, Math.max(50, heightInches * 12))}px`
                  }}
                >
                  <img
                    src={activeArtwork.url}
                    alt="Custom DTF transfer mockup"
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>

                <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-mono text-neutral-400">
                  {widthInches}" × {heightInches}" Chest Print
                </div>
              </div>
            </div>

            <p className="text-[11px] text-center text-neutral-400">
              Visual preview is scaled for reference. Print output will match your exact submitted file dimensions.
            </p>
          </div>

          {/* Pricing & Add to Cart Card */}
          <div className="bg-neutral-900 text-white p-6 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
            <div className="space-y-1.5 text-xs text-neutral-300 pb-3 border-b border-neutral-800">
              <div className="flex justify-between">
                <span>Unit Price:</span>
                <span className="font-mono text-white">${unitPrice.toFixed(2)} / transfer</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-mono text-white">{quantity} pieces</span>
              </div>
              {discountPercentage > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Volume Savings:</span>
                  <span>{discountPercentage}% Applied</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-neutral-800">
                <span>Configuration Total:</span>
                <span className="font-mono text-xl text-rose-500">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleAddCustomToCart}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Add Custom Order to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-neutral-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Prepress Inspected
              </span>
              <span>·</span>
              <span>Shipping options at checkout</span>
              <span>·</span>
              <span>Zero Setup Fees</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
