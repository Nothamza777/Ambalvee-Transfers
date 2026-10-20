import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getWebsiteCopy } from '../data/siteCopy';
import { 
  ChevronDown,
  MessageCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView, setCatalogCategory, websiteSettings, setChatbotOpen } = useStore();
  const copy = (key: string, fallback: string) => getWebsiteCopy(websiteSettings.siteCopy, key, fallback);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleNavClick = (viewName: any, cat?: any) => {
    if (cat) setCatalogCategory(cat);
    if (viewName === 'gang-sheet-builder' || viewName === 'custom-dtf') {
      setView(viewName);
    } else {
      setView(viewName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white font-sans selection:bg-sky-500 selection:text-white">
      
      <section className="border-t border-neutral-900 bg-black px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Order planning</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              {copy('footer.delivery.heading', 'Shipping information for your order')}
            </h2>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-neutral-400">
            Available shipping methods and charges are shown at checkout. Timing and availability depend on the items and destination.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. COMPREHENSIVE 8-COLUMN DARK FOOTER (MATCHING add-home-page-4.png)      */}
      {/* ========================================================================= */}
      <section className="bg-black border-t border-neutral-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          
          {/* TIER 1: Our Products, Ambalvee Blanks, Custom Transfers, Featured Products */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Column 1: Our Products */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {copy('footer.products.heading', 'Our Products')}
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                <li><button onClick={() => handleNavClick('catalog', 'dtf-transfers')} className="hover:text-white transition-colors text-left">DTF Transfers</button></li>
                <li><button onClick={() => handleNavClick('gang-sheet-builder')} className="hover:text-white transition-colors text-left">DTF Gang Sheet Builder</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">DTF 3D PermaStickers™</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'specialty-dtf')} className="hover:text-white transition-colors text-left">Specialty Transfers</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'patches-stickers')} className="hover:text-white transition-colors text-left">Custom Patches</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'patches-stickers')} className="hover:text-white transition-colors text-left">Custom Stickers</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'patches-stickers')} className="hover:text-white transition-colors text-left">Custom Magnets</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'patches-stickers')} className="hover:text-white transition-colors text-left">Custom Soft Vinyl Keychains</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'supplies')} className="hover:text-white transition-colors text-left">DTF Supplies & Consumables</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'sample-packs')} className="hover:text-white transition-colors text-left text-sky-400 font-bold">Free Sample Pack</button></li>
              </ul>
            </div>

            {/* Column 2: Ambalvee Blanks */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {copy('footer.blanks.heading', 'Ambalvee Blanks')}
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank T-Shirts</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank Short Sleeve</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank Long Sleeve</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank Hoodies</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank Sweatshirts</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank Crewnecks</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank Hats</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank Baseball Caps</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left">Blank Drinkware</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'blank-apparel')} className="hover:text-white transition-colors text-left text-sky-400 font-bold">View All</button></li>
              </ul>
            </div>

            {/* Column 3: Custom Transfers */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {copy('footer.transfers.heading', 'Custom Transfers')}
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Ready-To-Press DTF Transfers</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">T-Shirt Transfers</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Transfers for Hats</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Transfers for Aprons</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Transfers for Neck Labels</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Transfers for Sweatshirts</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Transfers for Socks</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Transfers for Polos</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Transfers for Shorts</button></li>
                <li><button onClick={() => handleNavClick('custom-dtf')} className="hover:text-white transition-colors text-left">Transfers for Bags</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'dtf-transfers')} className="hover:text-white transition-colors text-left text-sky-400 font-bold">DTF Transfers</button></li>
              </ul>
            </div>

            {/* Column 4: Featured Products */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {copy('footer.featured.heading', 'Featured Products')}
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">Car Decals</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">Car Window Decals</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">Football Helmet Decals</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">Bike Decals</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">Stickers for Water Bottles</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">Stickers for Laptops</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">Stickers for Phone Cases</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left">Stickers for Cups</button></li>
              </ul>
            </div>

          </div>

          {/* TIER 2: Support, Resources, Customer Care, Talk to an Ambalvee */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pt-8 border-t border-neutral-900">
            
            {/* Column 1: Support */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {copy('footer.support.heading', 'Support')}
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Help Center</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">FAQs</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Ordering Questions</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Pricing Questions</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Shipping Questions</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Artwork & Sizing Questions</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Tutorials</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Shipping Policy</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Refund Policy</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Trade Shows Schedule</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left text-sky-400">Ambalvee Background Remover</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left text-sky-400">Ambalvee Upscaler</button></li>
                <li><button onClick={() => handleNavClick('catalog', 'uv-dtf')} className="hover:text-white transition-colors text-left text-sky-400">UV DTF 3D PermaStickers™ Builder</button></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {copy('footer.resources.heading', 'Resources')}
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">DTF 101</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">DTF Application & Pressing</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">DTF Design & Preparation</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">DTF Care & Maintenance</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Business Insights</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">UV DTF 101</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">How to Press DTF Transfers</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">How to Apply UV DTF 3D PermaStickers™</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left text-sky-400">Ambalvee University</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">About Us</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">View Blog</button></li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {copy('footer.customerCare.heading', 'Customer Care')}
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">My Account</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Ambalvee Rewards</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Contact Us</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Become a Distributor</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Content Standards</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Satisfaction Guarantee</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Refund & Reprint Policy</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Order Issue Form</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors text-left">Terms and Conditions</button></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Help with an order?
              </h3>
              <p className="text-xs leading-relaxed text-neutral-400">
                Open the support panel for help with the catalog, builders, and order previews.
              </p>
              <button
                type="button"
                onClick={() => setChatbotOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-semibold text-neutral-200 transition-colors hover:bg-neutral-900 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Open support
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LEGAL POLICY STRIP & SOCIAL ICONS (MATCHING add-home-page-5.png)      */}
      {/* ========================================================================= */}
      <div className="bg-[#03060c] border-t border-neutral-900 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
          
          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-[11px]">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#ip" className="hover:text-white transition-colors">IP Property Policy</a>
            <span>•</span>
            <a href="#infringement" className="hover:text-white transition-colors">IP Copyright Infringement Form</a>
            <span>•</span>
            <a href="#cookie" className="hover:text-white transition-colors">Cookie Policy</a>
            <span>•</span>
            <a href="#donotsell" className="hover:text-white transition-colors">Do Not Sell</a>
            <span>•</span>
            <a href="#data" className="hover:text-white transition-colors">Data Request</a>
            <span>•</span>
            <a href="#oeko" className="hover:text-white transition-colors">OEKO-TEX Certification</a>
            <span>•</span>
            <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
          </div>

          {/* Social Icons (Facebook, Instagram, Pinterest, TikTok, YouTube) */}
          <div className="flex items-center gap-4 text-white">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-sky-400 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.2 22 12z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-sky-400 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest" className="hover:text-sky-400 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.056.23-.182.279-.423.167-1.583-.737-2.57-3.053-2.57-4.913 0-3.999 2.906-7.671 8.384-7.671 4.402 0 7.823 3.138 7.823 7.332 0 4.375-2.758 7.896-6.586 7.896-1.286 0-2.496-.669-2.91-1.455l-.792 3.018c-.287 1.097-1.063 2.473-1.583 3.315C9.697 23.856 10.827 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:text-sky-400 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-sky-400 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. COPYRIGHT & REGION PICKER STRIP                                        */}
      {/* ========================================================================= */}
      <div className="bg-black py-4 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          
          <div className="flex items-center gap-2">
            <span>Copyright © 2026 <strong className="text-white font-bold">Ambalvee</strong>.</span>
            <span className="text-neutral-700">|</span>
            <button 
              onClick={() => handleNavClick('admin')} 
              className="text-neutral-500 hover:text-sky-400 transition-colors font-mono text-[10px]"
            >
              Operations Portal
            </button>
            <span className="text-neutral-700">|</span>
          </div>

          {/* Region / Currency selectors */}
          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-300">
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span>English</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>
              {langOpen && (
                <div className="absolute right-0 bottom-full mb-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 shadow-xl min-w-28 text-left z-20">
                  <div className="px-2.5 py-1 text-white bg-neutral-800 rounded text-xs font-bold">English (US)</div>
                  <div className="px-2.5 py-1 text-neutral-400 hover:text-white rounded text-xs cursor-pointer">Français (CA)</div>
                  <div className="px-2.5 py-1 text-neutral-400 hover:text-white rounded text-xs cursor-pointer">Español</div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span>(USD $)</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 bottom-full mb-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 shadow-xl min-w-28 text-left z-20">
                  <div className="px-2.5 py-1 text-white bg-neutral-800 rounded text-xs font-bold">USD ($)</div>
                  <div className="px-2.5 py-1 text-neutral-400 hover:text-white rounded text-xs cursor-pointer">CAD ($)</div>
                  <div className="px-2.5 py-1 text-neutral-400 hover:text-white rounded text-xs cursor-pointer">EUR (€)</div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};
