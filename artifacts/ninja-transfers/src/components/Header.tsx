import React, { useState } from 'react';
import { useStore, ActiveView } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Layers, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Package, 
  FileText,
  CheckCircle2, 
  ArrowRight, 
  Headphones,
  Flame, 
  Truck, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CategoryId } from '../types';
import { getWebsiteCopy } from '../data/siteCopy';

export const Header: React.FC = () => {
  const { 
    view, 
    setView, 
    cartCount, 
    setCartDrawerOpen, 
    setCatalogCategory,
    searchQuery,
    setSearchQuery,
    currentUser,
    websiteSettings,
    setAuthModalOpen,
    setAuthModalMode,
    logoutUser,
    setSelectedProductId,
    menuHeaders,
    setChatbotOpen
  } = useStore();

  const copy = (key: string, fallback: string) => getWebsiteCopy(websiteSettings.siteCopy, key, fallback);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [megaSubTab, setMegaSubTab] = useState<string>('tab1');
  const visibleMenuHeaders = menuHeaders;

  const handleNavClick = (targetView: ActiveView, category?: any) => {
    setView(targetView);
    if (category) {
      setCatalogCategory(category);
    }
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setView('catalog');
    setActiveMegaMenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setView('product-detail');
    setActiveMegaMenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMegaMenu = (menuId: string) => {
    if (activeMegaMenu === menuId) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menuId);
      setMegaSubTab('tab1');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white font-sans" onMouseLeave={() => setActiveMegaMenu(null)}>
      {/* 1. TOP UTILITY STRIP (2 names + Same Day Dispatch & Free Shipping over $75) */}
      <div className="bg-[#090d16] text-white text-[11px] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          
          {/* Left: EXACTLY 2 NAMES ONLY */}
          <div className="flex items-center h-full">
            <button
              onClick={() => handleNavClick('home')}
              className="h-full px-3.5 bg-white text-neutral-950 font-black flex items-center gap-1.5 uppercase tracking-wider text-[10px] rounded-t-sm"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-[#c83220] flex items-center justify-center text-[8px] text-white font-black shadow-xs">
                {websiteSettings.brandName.charAt(0) || 'A'}
              </div>
              <span>{websiteSettings.brandName}</span>
            </button>

            <button 
              onClick={() => handleNavClick('custom-dtf')}
              className="h-full px-3 text-neutral-300 hover:text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 transition-colors"
            >
              <span>{websiteSettings.utilityNavLabel}</span>
            </button>
          </div>

          {/* Right: Same-Day Dispatch, 100+ Wash Guarantee, Free Shipping */}
          <div className="flex items-center gap-4 text-neutral-300 text-[11px]">
            <span className="hidden sm:flex items-center gap-1.5 text-neutral-300">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>{websiteSettings.topDispatchText}</span>
            </span>

            <span className="text-neutral-700 hidden md:inline">|</span>

            <span className="hidden md:flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{websiteSettings.topGuaranteeText}</span>
            </span>

            <span className="text-neutral-700 hidden sm:inline">|</span>

            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span>{websiteSettings.topShippingText}</span>
            </span>
          </div>

        </div>
      </div>

      {/* 2. Main header row with logo and product search */}
      <div className="bg-white border-b border-neutral-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Aesthetic Logo Lockup */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            {/* Minimalist Aesthetic Ambalvee Mark */}
            <div className="w-10 h-10 rounded-xl bg-[#c83220] p-0.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[10px] bg-[#0c1017] flex items-center justify-center relative overflow-hidden">
                  {websiteSettings.logoUrl ? (
                    <img src={websiteSettings.logoUrl} alt="" className="absolute inset-0 w-full h-full object-contain bg-white p-1" />
                  ) : (
                    <>
                      <div className="w-4 h-4 rotate-45 bg-[#d7a153] opacity-90 rounded-xs" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[11px] font-black text-white tracking-widest">{websiteSettings.brandName.charAt(0) || 'A'}</span>
                      </div>
                    </>
                  )}
                </div>
            </div>

            <div>
              <span className="text-2xl font-black tracking-tight text-neutral-950 uppercase block leading-none">
                {websiteSettings.brandName} {websiteSettings.brandSuffix && (
                  <span className="text-red-600 font-black">{websiteSettings.brandSuffix}</span>
                )}
              </span>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mt-0.5">
                {websiteSettings.brandTagline}
              </span>
            </div>
          </button>

          {/* Product search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder={websiteSettings.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white border border-neutral-200 rounded-full pl-11 pr-11 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all shadow-2xs"
              />
              <button
                type="submit"
                title="Search products"
                aria-label="Search products"
                className="absolute right-1.5 w-7 h-7 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Action Cluster (Sign In / Account + Cart) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Quick customer support access for mobile/tablet */}
            <button
              onClick={() => setChatbotOpen(true)}
              className="md:hidden w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              aria-label={copy('header.support', 'Customer Support')}
              title={copy('header.support', 'Customer Support')}
            >
              <Headphones className="w-4 h-4" />
            </button>

            {/* User Account / Sign In Button */}
            <div className="relative">
              {!currentUser ? (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-200 hover:border-neutral-300 rounded-full bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-900 transition-colors shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0084ff] text-white flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>{copy('header.signIn', 'Sign In')}</span>
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3.5 py-1.5 border border-neutral-200 hover:border-neutral-300 rounded-full bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-900 transition-colors shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-black uppercase">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <span className="max-w-28 truncate">Hi, {currentUser.fullName.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <span className="font-bold text-neutral-900 block truncate">{currentUser.fullName}</span>
                        <span className="text-[10px] text-neutral-400 block truncate font-mono">{currentUser.email}</span>
                      </div>
                      <button
                        onClick={() => handleNavClick('account')}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 font-medium flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{copy('header.myAccount', 'My Account')}</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('account')}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 font-medium flex items-center gap-2"
                      >
                        <Package className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{copy('header.orderHistory', 'Order History')}</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('account')}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 font-medium flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{copy('header.uploadedArtwork', 'Uploaded Artwork')}</span>
                      </button>
                      <div className="pt-1 border-t border-neutral-100">
                        <button
                          onClick={() => {
                            logoutUser();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{copy('header.signOut', 'Sign Out')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-neutral-800 hover:text-black transition-colors"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-sky-500 text-white rounded-full text-[10px] font-black flex items-center justify-center font-mono shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-700 hover:text-black md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. CATEGORY SUB-NAVIGATION BAR (Hover-triggered Dynamic Mega Menus from menuHeaders) */}
      <div 
        className="bg-white border-b border-neutral-200 hidden md:block relative"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11 text-xs font-bold text-neutral-800">
          <nav className="flex items-center gap-6 lg:gap-7">
            {visibleMenuHeaders.map((header) => {
              const isHeaderActive = activeMegaMenu === header.id;
              return (
                <div 
                  key={header.id}
                  className="flex items-center group py-2"
                  onMouseEnter={() => {
                    setActiveMegaMenu(header.id);
                    setMegaSubTab(header.tabs[0]?.id || 'tab1');
                  }}
                >
                  <button
                    onClick={() => {
                    if (header.category === 'tools') {
                        toggleMegaMenu(header.id);
                      } else if (header.category === 'custom-dtf') {
                        setView('custom-dtf');
                      } else if (header.category === 'gang-sheets') {
                        setSelectedProductId('prod-gang-sheet-builder');
                        setView('gang-sheet-builder');
                      } else if (header.category) {
                        handleNavClick('catalog', header.category);
                      } else {
                        toggleMegaMenu(header.id);
                      }
                    }}
                    className={`hover:text-sky-600 transition-colors py-1 ${
                      isHeaderActive ? 'text-sky-600 font-black' : ''
                    }`}
                  >
                    {header.label}
                  </button>
                  {header.tabs && header.tabs.length > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMegaMenu(header.id); }}
                      className="p-1 hover:text-sky-600 transition-colors"
                      aria-label={`Toggle ${header.label} menu`}
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isHeaderActive ? 'rotate-180 text-sky-600' : 'text-neutral-400'}`} />
                    </button>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Quick Track Order / Help Link (Ninja Transfers Style) */}
          <div className="flex items-center gap-4 text-xs font-bold text-neutral-600">
            <button
              onClick={() => handleNavClick('catalog', 'sample-packs')}
              className="text-red-600 hover:text-red-700 font-extrabold flex items-center gap-1 transition-colors"
            >
              <span>Sample Pack</span>
            </button>
          </div>
        </div>

        {/* Dynamic Mega Menu Dropdown */}
        {activeMegaMenu && (() => {
          const activeHeader = visibleMenuHeaders.find(h => h.id === activeMegaMenu);
          if (!activeHeader || !activeHeader.tabs || activeHeader.tabs.length === 0) return null;

          const currentTab = activeHeader.tabs.find(t => t.id === megaSubTab) || activeHeader.tabs[0];
          const isTextLinksOnly = activeHeader.id === 'blanks' || activeHeader.id === 'tools' || activeHeader.displayType === 'text-links';

          // Group items by columnGroup for text links layout
          const groupedTextItems = currentTab.items.reduce((acc, item) => {
            const grp = item.columnGroup || 'Featured Links';
            if (!acc[grp]) acc[grp] = [];
            acc[grp].push(item);
            return acc;
          }, {} as Record<string, typeof currentTab.items>);

          return (
            <div 
              className="absolute left-0 right-0 top-full bg-black/40 backdrop-blur-xs py-4 flex justify-center z-50 animate-fade-in"
              onClick={(e) => {
                if (e.target === e.currentTarget) setActiveMegaMenu(null);
              }}
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-4xl w-full mx-4 overflow-hidden">
                {/* Sub-tabs if more than 1 tab */}
                {activeHeader.tabs.length > 1 && (
                  <div className="flex border-b border-neutral-200 bg-neutral-50 text-xs font-bold uppercase tracking-wider">
                    {activeHeader.tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setMegaSubTab(tab.id)}
                        className={`flex-1 py-3 px-6 text-center transition-all ${
                          megaSubTab === tab.id
                            ? 'bg-[#0091ff] text-white shadow-sm'
                            : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
                        }`}
                      >
                        {tab.tabName}
                      </button>
                    ))}
                  </div>
                )}

                {/* TEXT-ONLY LINKS LAYOUT (for Blank Apparel & Support & Tools - NO PICS!) */}
                {isTextLinksOnly ? (
                  <div className="p-7">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                      {Object.entries(groupedTextItems).map(([groupTitle, items]) => (
                        <div key={groupTitle} className="space-y-3">
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2 flex items-center justify-between">
                            <span>{groupTitle}</span>
                          </h4>
                          <ul className="space-y-2">
                            {items.map((item) => (
                              <li key={item.id}>
                                <button
                                  onClick={() => {
                                    if (item.targetView === 'product-detail' && item.targetProductId) {
                                      handleSelectProduct(item.targetProductId);
                                    } else if (item.targetView === 'catalog') {
                                      handleNavClick('catalog', item.targetCategory);
                                    } else {
                                      setView(item.targetView as any);
                                      setActiveMegaMenu(null);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                  }}
                                  className="w-full text-left text-xs font-medium text-neutral-600 hover:text-sky-600 transition-all flex items-start justify-between group py-0.5"
                                >
                                  <span className="group-hover:translate-x-1 transition-transform leading-snug">
                                    {item.name}
                                  </span>
                                  {item.tag && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors shrink-0 ml-1.5">
                                      {item.tag}
                                    </span>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* PRODUCT PHOTOS GRID (for DTF Transfers, UV DTF, Specialty, Patches, Supplies) */
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {currentTab.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.targetView === 'product-detail' && item.targetProductId) {
                              handleSelectProduct(item.targetProductId);
                            } else if (item.targetView === 'catalog') {
                              handleNavClick('catalog', item.targetCategory);
                            } else {
                              setView(item.targetView as any);
                              setActiveMegaMenu(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left border border-transparent hover:border-neutral-200 group"
                        >
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-200/80 shrink-0 group-hover:scale-105 transition-transform shadow-xs"
                              loading="lazy"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-neutral-900 text-xs block truncate group-hover:text-sky-600 transition-colors">
                              {item.name}
                            </span>
                            {item.tag && (
                              <span className="text-[11px] font-bold text-sky-600 block truncate">
                                {item.tag}
                              </span>
                            )}
                            {item.description && (
                              <span className="text-[10px] text-neutral-500 line-clamp-1 block mt-0.5">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Strip with CTA Banner (No Prices) */}
                <div className="bg-neutral-50 px-6 py-3.5 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-xs text-neutral-700 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{activeHeader.bannerText || 'Commercial Grade Fast Turnaround'}</span>
                  </span>
                  {activeHeader.bannerButtonText && (
                    <button
                      onClick={() => {
                        if (activeHeader.bannerButtonCategory) {
                          handleNavClick('catalog', activeHeader.bannerButtonCategory);
                        } else if (activeHeader.bannerButtonView) {
                          setView(activeHeader.bannerButtonView as any);
                        } else if (activeHeader.category && activeHeader.category !== 'tools') {
                          handleNavClick('catalog', activeHeader.category as any);
                        } else {
                          setView('home');
                        }
                        setActiveMegaMenu(null);
                      }}
                      className="px-5 py-2 bg-[#0091ff] hover:bg-[#007ee6] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{activeHeader.bannerButtonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-2 text-xs">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <input
              type="text"
              placeholder="Search transfers, gang sheets, patches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-100 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none"
            />
          </form>

          <button
            onClick={() => {
              setChatbotOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 font-bold rounded-lg border border-red-200 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-red-600" />
              <span>{copy('header.support', 'Customer Support')}</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {visibleMenuHeaders.map((header) => (
            <button
              key={header.id}
              onClick={() => {
                if (header.category === 'tools') {
                  setChatbotOpen(true);
                } else if (header.category === 'custom-dtf') {
                  setView('custom-dtf');
                } else if (header.category === 'gang-sheets') {
                  setSelectedProductId('prod-gang-sheet-builder');
                  setView('gang-sheet-builder');
                } else if (header.category) {
                  handleNavClick('catalog', header.category);
                } else {
                  setView('home');
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 font-bold text-neutral-900 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>{header.label}</span>
              <ArrowRight className="w-3 h-3 text-neutral-400" />
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

