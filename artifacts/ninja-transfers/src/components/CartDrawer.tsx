import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    appliedCoupon,
    couponError,
    applyCouponCode,
    removeCoupon,
    discountAmount,
    setCheckoutOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!cartDrawerOpen) return null;

  const freeShippingThreshold = 75;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const ok = applyCouponCode(couponInput);
      if (ok) setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setCartDrawerOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base uppercase">Your Cart</span>
              <span className="text-xs bg-rose-600 px-2 py-0.5 rounded-full font-mono font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button 
              onClick={() => setCartDrawerOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rose-600" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">You unlocked FREE Priority Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-rose-600">${amountNeededForFreeShipping.toFixed(2)}</strong> more for FREE Shipping!
                  </span>
                )}
              </span>
              <span className="text-neutral-500 font-mono text-[11px]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  amountNeededForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-rose-600'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-neutral-800 text-lg">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
                  Upload custom designs, build a gang sheet, or choose from our blanks and transfer supplies.
                </p>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="mt-5 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg uppercase tracking-wide transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                  <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200 flex items-center justify-center">
                    <img 
                      src={item.productImage} 
                      alt={item.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-neutral-900 leading-snug line-clamp-1">
                        {item.productName}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-rose-600 p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.variantName && (
                      <p className="text-[11px] text-neutral-600 mt-0.5">{item.variantName}</p>
                    )}

                    {/* Custom DTF Specs */}
                    {item.customConfig && (
                      <div className="mt-1 text-[11px] text-neutral-600 bg-neutral-50 rounded p-1.5 border border-neutral-200/60 space-y-0.5">
                        <div className="flex justify-between">
                          <span>Size: {item.customConfig.widthInches}" × {item.customConfig.heightInches}"</span>
                          <span className="capitalize text-rose-700 font-semibold">{item.customConfig.fabricColor} Garment</span>
                        </div>
                        {item.customConfig.artfileName && (
                          <div className="truncate text-neutral-500 text-[10px]">
                            File: {item.customConfig.artfileName}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gang Sheet Specs */}
                    {item.gangSheetConfig && (
                      <div className="mt-1 text-[11px] text-neutral-600 bg-neutral-50 rounded p-1.5 border border-neutral-200/60 space-y-0.5">
                        <div className="flex justify-between">
                          <span className="font-semibold text-neutral-800">22" × {item.gangSheetConfig.sheetLength}" Roll</span>
                          <span className="text-emerald-700 font-bold">{item.gangSheetConfig.totalAreaUsedPercentage}% Utilized</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {item.gangSheetConfig.elements.length} graphics placed
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-300 rounded-md overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-mono font-bold text-neutral-800 min-w-7 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-neutral-900 block">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-neutral-500 font-mono block">
                            ${item.unitPrice.toFixed(2)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 bg-neutral-50 border-t border-neutral-200 space-y-3.5">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  aria-label="Coupon Code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-800 uppercase focus:outline-none focus:border-rose-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Code "{appliedCoupon.code}" applied
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
                    <button 
                      onClick={removeCoupon}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {couponError && (
                <p className="text-xs text-rose-600 font-medium">{couponError}</p>
              )}

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-neutral-800">${cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-neutral-800">
                    {cartSubtotal >= 75 || appliedCoupon?.code === 'FREESHIP' ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      'Calculated at checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Due</span>
                  <span className="font-mono text-base text-rose-600">
                    ${Math.max(0, cartSubtotal - discountAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Payment pending in demo preview
                </span>
                <span>·</span>
                <span>60+ Wash Guarantee</span>
                <span>·</span>
                <span>Rush Dispatch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
