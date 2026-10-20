import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, AlertCircle } from 'lucide-react';
import { ShippingAddress } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    placeOrder,
    currentUser,
    currentCustomer
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customerForAccount = currentUser && currentCustomer?.email.toLowerCase() === currentUser.email.toLowerCase()
    ? currentCustomer
    : null;
  const createAccountAddress = (): ShippingAddress => ({
    fullName: customerForAccount?.fullName || currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: customerForAccount?.phone || '',
    addressLine1: customerForAccount?.defaultAddress?.addressLine1 || '',
    addressLine2: customerForAccount?.defaultAddress?.addressLine2 || '',
    city: customerForAccount?.defaultAddress?.city || '',
    state: customerForAccount?.defaultAddress?.state || 'TX',
    postalCode: customerForAccount?.defaultAddress?.postalCode || '',
    country: customerForAccount?.defaultAddress?.country || 'United States'
  });

  const [formData, setFormData] = useState<ShippingAddress>(() => ({
    ...createAccountAddress()
  }));

  const [shippingMethod, setShippingMethod] = useState<string>(
    cartSubtotal >= 75 || appliedCoupon?.code === 'FREESHIP' 
      ? 'Free Priority Shipping (Orders $75+)' 
      : 'Standard Ground Delivery ($9.99)'
  );

  useEffect(() => {
    if (currentUser) setFormData(createAccountAddress());
  }, [currentUser?.id]);

  if (!checkoutOpen) return null;
  if (!currentUser) return null;

  const isFreeShipping = cartSubtotal >= 75 || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
  const shippingCost = isFreeShipping 
    ? 0 
    : shippingMethod.includes('Rush') 
      ? 24.99 
      : 9.99;

  const taxable = Math.max(0, cartSubtotal - discountAmount);
  const taxCost = Number((taxable * 0.075).toFixed(2));
  const grandTotal = Number((taxable + shippingCost + taxCost).toFixed(2));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser?.email?.trim()) {
      setError('Sign in to your customer account before placing an order.');
      return;
    }

    const orderAddress: ShippingAddress = {
      ...formData,
      fullName: formData.fullName.trim() || currentUser.fullName.trim(),
      email: currentUser.email.trim().toLowerCase()
    };
    if (!orderAddress.fullName || !orderAddress.addressLine1 || !orderAddress.city || !orderAddress.postalCode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setLoading(true);

    try {
      await placeOrder(
        orderAddress,
        shippingMethod,
        'Payment pending — demo order preview',
        'Demo order preview only. No payment was collected and fulfillment has not started.'
      );
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'The order preview could not be created. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-neutral-200 my-8">
        {/* Top Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-rose-600 rounded flex items-center justify-center text-white font-black text-sm">
              N
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight uppercase">Order preview</h2>
              <span className="text-[11px] text-neutral-400">No payment is collected in this demo</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCheckoutOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
          {/* Left Form: Shipping & Payment (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-6">
            {/* 1. Contact Info */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center">1</span>
                <span>Contact & Shipping Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={currentUser.email}
                    readOnly
                    aria-readonly="true"
                    className="w-full border border-neutral-300 rounded-lg bg-neutral-100 px-3 py-2 text-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 uppercase focus:outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">ZIP *</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-rose-600 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Shipping Speed */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center">2</span>
                <span>Shipping Method</span>
              </h3>
              <div className="space-y-2 text-xs">
                {isFreeShipping ? (
                  <label className="flex items-center justify-between p-3 border-2 border-emerald-500 bg-emerald-50/50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        checked={shippingMethod.includes('Free')}
                        onChange={() => setShippingMethod('Free Priority Shipping (Orders $75+)')}
                        className="text-emerald-600"
                      />
                      <div>
                        <span className="font-bold text-neutral-900 block">Standard shipping</span>
                        <span className="text-[11px] text-emerald-700">Shipping discount applied to this preview</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">FREE</span>
                  </label>
                ) : (
                  <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                    shippingMethod.includes('Standard') ? 'border-sky-600 bg-sky-50/30' : 'border-neutral-200'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        checked={shippingMethod.includes('Standard')}
                        onChange={() => setShippingMethod('Standard Ground Delivery ($9.99)')}
                        className="text-sky-600"
                      />
                      <div>
                        <span className="font-bold text-neutral-900 block">Standard Tracked Delivery</span>
                        <span className="text-[11px] text-neutral-500">Estimated 3-5 business days</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">$9.99</span>
                  </label>
                )}

                <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                  shippingMethod.includes('Rush') ? 'border-sky-600 bg-sky-50/30' : 'border-neutral-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      checked={shippingMethod.includes('Rush')}
                      onChange={() => setShippingMethod('Rush Ambalvee Air (Next-Day)')}
                      className="text-sky-600"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 block flex items-center gap-1">
                        <span>Expedited shipping option</span>
                      </span>
                      <span className="text-[11px] text-neutral-500">Availability and timing are not confirmed in this demo.</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-neutral-900">$24.99</span>
                </label>
              </div>
            </div>

            {/* 3. Payment status */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center">3</span>
                <span>Payment status</span>
              </h3>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
                This is an order preview only. Payment remains pending; no card details are requested or stored, and submitting does not start production or shipping.
              </div>
            </div>
          </div>

          {/* Right Summary Column (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-neutral-50 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items preview */}
              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-200 pr-1 space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="pt-2 flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={item.productImage} 
                        alt="" 
                        className="w-9 h-9 rounded object-cover border border-neutral-200 shrink-0" 
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-neutral-900 block truncate leading-snug">
                          {item.productName}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          Qty: {item.quantity} · ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost summary table */}
              <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-neutral-900">
                    {shippingCost === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (7.5%)</span>
                  <span className="font-mono text-neutral-900">${taxCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-3 border-t border-neutral-300">
                    <span>Estimated order total</span>
                  <span className="font-mono text-lg text-rose-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="mt-8 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment & Artwork...
                  </span>
                ) : (
                  <>
                    <span>Create order preview</span>
                    <span>· ${grandTotal.toFixed(2)}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-500">No charge is made. Your preview will be saved in this session with payment pending.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
