import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AmbalveeChatbot } from './components/AmbalveeChatbot';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CustomDTFBuilderView } from './views/CustomDTFBuilderView';
import { GangSheetBuilderView } from './views/GangSheetBuilderView';
import { AccountView } from './views/AccountView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { AdminView } from './views/AdminView';
import { AdminLoginView } from './views/AdminLoginView';

const MainLayout: React.FC = () => {
  const {
    view,
    isAdminAuthenticated,
    isAdminSessionLoading,
    isAdminDataLoading,
    adminDataLoadError,
    retryAdminDataLoad
  } = useStore();

  if (view === 'admin') {
    if (isAdminSessionLoading) {
      return (
        <div className="min-h-[100dvh] bg-neutral-950 text-neutral-300 grid place-items-center font-sans">
          <div className="text-center space-y-3" role="status" aria-live="polite">
            <div className="mx-auto h-8 w-8 rounded-full border-2 border-neutral-700 border-t-rose-500 animate-spin" />
            <p className="text-sm">Checking administrator session…</p>
          </div>
        </div>
      );
    }
    if (!isAdminAuthenticated) {
      return <AdminLoginView />;
    }
    if (isAdminDataLoading) {
      return (
        <div className="min-h-[100dvh] bg-neutral-950 text-neutral-300 grid place-items-center font-sans">
          <div className="text-center space-y-3" role="status" aria-live="polite">
            <div className="mx-auto h-8 w-8 rounded-full border-2 border-neutral-700 border-t-rose-500 animate-spin" />
            <p className="text-sm">Loading protected store data…</p>
          </div>
        </div>
      );
    }
    if (adminDataLoadError) {
      return (
        <div className="min-h-[100dvh] bg-neutral-950 text-neutral-200 grid place-items-center p-6 font-sans">
          <div className="max-w-md space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center">
            <p role="alert" className="text-sm">{adminDataLoadError}</p>
            <button
              type="button"
              onClick={retryAdminDataLoad}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
            >
              Retry loading
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-[100dvh] bg-neutral-900 font-sans">
        <AdminView />
      </div>
    );
  }

  return (
    <div className="ninja-shell min-h-[100dvh] flex flex-col text-neutral-900 font-sans selection:bg-rose-500 selection:text-white">
      <Header />

      <main className="flex-1 bg-transparent">
        {view === 'home' && <HomeView />}
        {view === 'catalog' && <CatalogView />}
        {view === 'product-detail' && <ProductDetailView />}
        {view === 'custom-dtf' && <CustomDTFBuilderView />}
        {view === 'gang-sheet-builder' && <GangSheetBuilderView />}
        {view === 'account' && <AccountView />}
        {view === 'order-success' && <OrderSuccessView />}
      </main>

      <Footer />

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      <AmbalveeChatbot />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
