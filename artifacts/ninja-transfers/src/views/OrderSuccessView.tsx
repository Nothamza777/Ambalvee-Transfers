import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Package, Printer, ArrowRight } from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { lastPlacedOrder, setView } = useStore();

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-neutral-800">No recent order found</h2>
        <button
          onClick={() => setView('catalog')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
          Demo order preview created · payment pending
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-900">
          Preview {lastPlacedOrder.orderNumber}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
          This is a no-charge preview linked to <strong>{lastPlacedOrder.customerEmail}</strong>. No payment was collected and production or shipping has not started.
        </p>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        {/* Receipt Header */}
        <div className="p-6 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#c83220] flex items-center justify-center text-white font-black text-xs">
                A
              </div>
              <span className="font-black uppercase tracking-tight text-sm">
                 Ambalvee Transfers · Order Preview
              </span>
            </div>
            <span className="text-neutral-400 text-xs mt-1 block font-mono">
              Order #{lastPlacedOrder.orderNumber} · {new Date(lastPlacedOrder.createdAt).toLocaleDateString()}
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold border border-neutral-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-400" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Shipping details */}
        <div className="p-6 border-b border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-neutral-400 font-semibold block uppercase text-[10px]">Shipping To</span>
            <p className="font-bold text-neutral-900 mt-1">{lastPlacedOrder.shippingAddress.fullName}</p>
            <p className="text-neutral-600">{lastPlacedOrder.shippingAddress.addressLine1}</p>
            <p className="text-neutral-600">
              {lastPlacedOrder.shippingAddress.city}, {lastPlacedOrder.shippingAddress.state} {lastPlacedOrder.shippingAddress.postalCode}
            </p>
            <p className="text-neutral-500 font-mono mt-1">{lastPlacedOrder.shippingAddress.phone}</p>
          </div>

          <div>
              <span className="text-neutral-400 font-semibold block uppercase text-[10px]">Selected shipping option</span>
            <p className="font-bold text-neutral-900 mt-1">{lastPlacedOrder.shippingMethod}</p>
              <p className="text-amber-800 mt-2 font-semibold">Payment pending · no charge collected</p>
              <p className="text-neutral-500 mt-1">This preview does not start fulfillment.</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="p-6 divide-y divide-neutral-100">
          <div className="pb-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Purchased Transfer Items
          </div>
          {lastPlacedOrder.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={item.image} 
                  alt="" 
                  className="w-12 h-12 rounded object-cover border border-neutral-200 shrink-0" 
                />
                <div className="min-w-0">
                  <span className="font-bold text-neutral-900 block truncate">{item.productName}</span>
                  {item.variantName && <span className="text-[11px] text-neutral-500 block">{item.variantName}</span>}
                  {item.customConfig?.artfileName && (
                    <span className="text-[10px] text-rose-600 font-mono block">
                      Uploaded File: {item.customConfig.artfileName}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-neutral-900 block">
                  ${item.totalPrice.toFixed(2)}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Qty: {item.quantity} · ${item.unitPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Subtotal table */}
          <div className="pt-4 space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-neutral-900">${lastPlacedOrder.subtotal.toFixed(2)}</span>
            </div>
            {lastPlacedOrder.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({lastPlacedOrder.couponCode}):</span>
                <span className="font-mono">-${lastPlacedOrder.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-mono text-neutral-900">
                {lastPlacedOrder.shippingTotal === 0 ? 'FREE' : `$${lastPlacedOrder.shippingTotal.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (7.5%):</span>
              <span className="font-mono text-neutral-900">${lastPlacedOrder.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                   <span>Estimated total:</span>
              <span className="font-mono text-rose-600">${lastPlacedOrder.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={() => { setView('account'); window.scrollTo(0, 0); }}
          className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>View in My Account</span>
        </button>

        <button
          onClick={() => { setView('catalog'); window.scrollTo(0, 0); }}
          className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
