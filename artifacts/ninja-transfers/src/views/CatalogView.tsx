import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';
import { Search, SlidersHorizontal, Tag, ArrowRight } from 'lucide-react';
import { getWebsiteCopy } from '../data/siteCopy';

export const CatalogView: React.FC = () => {
  const {
    products,
    catalogCategory,
    setCatalogCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProductId,
    setView,
    websiteSettings
  } = useStore();
  const copy = (key: string, fallback: string) => getWebsiteCopy(websiteSettings.siteCopy, key, fallback);

  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'reviews' | 'name'>('featured');

  const categories: { id: CategoryId | 'all'; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'dtf-transfers', label: 'Custom DTF Transfers' },
    { id: 'gang-sheets', label: 'Gang Sheets' },
    { id: 'patches-stickers', label: 'Patches & Stickers' },
    { id: 'uv-dtf', label: 'UV DTF Decals' },
    { id: 'specialty-dtf', label: 'Specialty DTF' },
    { id: 'blank-apparel', label: 'Blank Apparel' },
    { id: 'supplies', label: 'Supplies & Presses' },
    { id: 'sample-packs', label: 'Sample Kits' },
  ];

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesCat = catalogCategory === 'all' || p.category === catalogCategory;
    const matchesSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const hasStock = !inStockOnly || p.variants.some(v => v.stock > 0);

    return matchesCat && matchesSearch && hasStock;
  });

  // Sorting without prices
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Description */}
      <div className="border-b border-neutral-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
          {copy('catalog.heading', 'Commercial Transfer Catalog')}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
          {copy('catalog.description', 'Order single custom transfers, full-roll gang sheets, UV DTF peel & stick decals, premium blanks, and printing supplies with wholesale tier discounts.')}
        </p>
      </div>
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        Catalog products, pricing, availability, and specifications are editable examples. Confirm current details before placing an order.
      </p>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCatalogCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                catalogCategory === cat.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Stock, Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial sm:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label={copy('catalog.searchLabel', 'Search catalog')}
              placeholder={websiteSettings.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          {/* In Stock Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              inStockOnly 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-600' : 'bg-neutral-300'}`} />
            <span>{copy('catalog.inStock', 'In Stock Only')}</span>
          </button>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-700 focus:outline-none focus:border-sky-500"
          >
            <option value="featured">{copy('catalog.sort.featured', 'Sort: Featured')}</option>
            <option value="rating">{copy('catalog.sort.rating', 'Highest Rated')}</option>
            <option value="reviews">{copy('catalog.sort.popular', 'Most Popular')}</option>
            <option value="name">{copy('catalog.sort.name', 'Alphabetical (A-Z)')}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12">
          <Tag className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="font-bold text-neutral-900 text-base">{copy('catalog.empty.heading', 'No matching products found')}</h3>
          <p className="text-xs text-neutral-500 mt-1">
            {copy('catalog.empty.description', 'Try adjusting your search query or selecting a different category filter.')}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setCatalogCategory('all'); setInStockOnly(false); }}
            className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg uppercase tracking-wide hover:bg-neutral-800 transition-colors"
          >
            {copy('catalog.clearFilters', 'Clear Filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
            >
              <div 
                className="relative h-64 bg-neutral-100 overflow-hidden cursor-pointer"
                onClick={() => {
                  setSelectedProductId(product.id);
                  setView('product-detail');
                  window.scrollTo(0, 0);
                }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                {product.bestSeller && (
                  <span className="absolute top-3 left-3 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {copy('catalog.bestSeller', 'Best Seller')}
                  </span>
                )}
                {product.category && (
                  <span className="absolute top-3 right-3 bg-sky-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {product.category.replace('-', ' ')}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setView('product-detail');
                      window.scrollTo(0, 0);
                    }}
                    className="font-bold text-neutral-900 text-base cursor-pointer hover:text-sky-600 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Specifications Tag */}
                  <div className="mt-3 py-1.5 px-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-[11px] text-neutral-600 flex items-center justify-between">
                    <span className="text-neutral-500">{copy('catalog.specLabel', 'Durability & Spec:')}</span>
                    <strong className="text-sky-700 font-bold">
                      Product details
                    </strong>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-[11px] text-neutral-500 font-medium">
                    <span className="text-neutral-400 uppercase text-[9px] block font-bold">{copy('catalog.leadTime', 'Lead Time')}</span>
                    <span className="text-neutral-800 font-bold">Review at checkout</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setView('product-detail');
                      window.scrollTo(0, 0);
                    }}
                    className="px-4 py-2 bg-neutral-900 hover:bg-[#0084ff] text-white text-xs font-bold rounded-lg uppercase tracking-wide transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>{copy('catalog.buy', 'Buy')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
