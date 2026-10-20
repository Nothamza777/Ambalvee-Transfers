import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  Package, 
  FileText, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ArrowRight,
  LogOut,
  Settings,
  ShieldCheck,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  CreditCard,
  Lock,
  Bell,
  Building,
  Phone,
  Mail,
  FileCheck,
  Eye,
  Award,
  Headphones,
  ShoppingBag
} from 'lucide-react';
import { Order, ShippingAddress } from '../types';
import { ASSETS } from '../data/mockStore';

export const AccountView: React.FC = () => {
  const { 
    currentCustomer, 
    setCurrentCustomer,
    currentUser,
    logoutUser, 
    orders, 
    setView, 
    setSelectedProductId, 
    addToCart, 
    setCartDrawerOpen,
    setChatbotOpen,
    setChatbotInitialPrompt
  } = useStore();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'order-details' | 'account-details' | 'settings' | 'addresses'>('dashboard');
  
  // Selected order for detailed inspector
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Search & filter for order history
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'in_production' | 'shipped' | 'delivered'>('all');

  // Customer Profile Form State
  const activeFullName = currentUser?.fullName || currentCustomer?.fullName || 'Your account';
  const nameParts = activeFullName.trim().split(' ');
  const [profileForm, setProfileForm] = useState({
    firstName: nameParts[0] === 'Your' ? '' : nameParts[0] || '',
    lastName: nameParts[0] === 'Your' ? '' : nameParts.slice(1).join(' '),
    email: currentUser?.email || currentCustomer?.email || '',
    phone: currentCustomer?.phone || '',
    companyName: '',
    industry: '',
    taxExemptId: '',
    taxExemptVerified: false,
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Security / Settings Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notification toggles
  const [notificationSettings, setNotificationSettings] = useState({
    smsTracking: true,
    emailPrepressApproval: true,
    promoOffers: false,
    gangSheetWeeklyDigest: true,
    twoFactorAuth: false,
  });
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  // Addresses State
  const [savedAddresses, setSavedAddresses] = useState<Array<ShippingAddress & { id: string; label: string; isDefault: boolean }>>([]);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormData, setAddressFormData] = useState({
    label: 'Shipping Address',
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: 'TX',
    postalCode: '',
    country: 'United States',
    isDefault: false
  });

  // Logout confirmation modal
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Orders associated with this customer
  const customerEmail = (currentUser?.email || currentCustomer?.email || '').trim().toLowerCase();
  const customerOrders = customerEmail
    ? orders.filter(order => order.customerEmail.trim().toLowerCase() === customerEmail)
    : [];

  // Never fall back to another customer's orders when this account has no history.
  const displayOrders = customerOrders;

  // Filtered orders
  const filteredOrders = displayOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.items.some(i => i.productName.toLowerCase().includes(orderSearchTerm.toLowerCase()));
    
    if (orderStatusFilter === 'all') return matchesSearch;
    return matchesSearch && order.status === orderStatusFilter;
  });

  // Most recent order for dashboard overview
  const latestOrder = displayOrders[0] || null;
  const orderStageByStatus: Record<string, number> = {
    placed: 0,
    artwork_review: 1,
    in_production: 2,
    shipped: 3,
    delivered: 4
  };
  const latestOrderStage = latestOrder ? (orderStageByStatus[latestOrder.status] ?? 0) : 0;
  const orderProgressPercent = [8, 28, 52, 78, 100][latestOrderStage];
  const orderMilestones = ['Order placed', 'Prepress review', 'In production', 'Shipped', 'Delivered'];
  const orderMilestoneIcons = [CheckCircle2, FileCheck, Printer, Truck, Check];

  // Handle open order details
  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setActiveTab('order-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle 1-click reorder
  const handleReorderOrder = (order: Order) => {
    order.items.forEach(item => {
      addToCart({
        productId: item.productId,
        productName: item.productName,
        category: 'dtf-transfers',
        productImage: item.image,
        variantId: item.variantName || 'reorder',
        variantName: item.variantName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        customConfig: item.customConfig,
        gangSheetConfig: item.gangSheetConfig
      });
    });
    setCartDrawerOpen(true);
  };

  // Handle profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCustomer) {
      setCurrentCustomer({
        ...currentCustomer,
        fullName: `${profileForm.firstName} ${profileForm.lastName}`,
        email: profileForm.email,
        phone: profileForm.phone
      });
    }
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  // Handle password update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  // Handle address save
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressFormData.fullName || !addressFormData.addressLine1 || !addressFormData.city || !addressFormData.postalCode) {
      return;
    }

    if (editingAddressId) {
      setSavedAddresses(prev => prev.map(addr => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            ...addressFormData,
            isDefault: addressFormData.isDefault ? true : addr.isDefault
          };
        }
        return addressFormData.isDefault ? { ...addr, isDefault: false } : addr;
      }));
    } else {
      const newAddr = {
        id: `addr-${Date.now()}`,
        ...addressFormData,
        email: profileForm.email,
        isDefault: addressFormData.isDefault || savedAddresses.length === 0
      };
      setSavedAddresses(prev => [
        ...(addressFormData.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev),
        newAddr
      ]);
    }

    setAddressModalOpen(false);
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setSavedAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handlePerformLogout = () => {
    logoutUser();
    setLogoutConfirmOpen(false);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200"><Truck className="w-3.5 h-3.5 text-sky-600" /> Shipped</span>;
      case 'in_production':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200"><RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" /> In Production</span>;
      case 'artwork_review':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200"><FileCheck className="w-3.5 h-3.5 text-purple-600" /> Prepress Approved</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-neutral-200 text-neutral-800 border border-neutral-300"><Clock className="w-3.5 h-3.5 text-neutral-600" /> Placed</span>;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-50/60 text-neutral-900 pb-20 font-sans">
      
      {/* 1. TOP BREADCRUMB & LOGOUT QUICK BAR */}
      <div className="bg-white border-b border-neutral-200/90 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setView('home')} 
              className="text-neutral-500 hover:text-neutral-900 font-semibold transition-colors"
            >
              Home
            </button>
            <span className="text-neutral-400">/</span>
            <span className="font-bold text-neutral-900">My Account</span>
            <span className="text-neutral-400">/</span>
            <span className="text-rose-600 font-bold capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Prominent Header Logout Button */}
            <button
              onClick={() => setLogoutConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 space-y-6">

        {/* Customer identity: keep the name separate from business and tax details. */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-semibold text-lg shrink-0">
              {profileForm.firstName.charAt(0)}{profileForm.lastName.charAt(0)}
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950">
              {profileForm.firstName} {profileForm.lastName}
            </h1>
          </div>
        </div>

        {/* Account overview metrics are separate from the identity block. */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <span className="block text-xs font-medium text-neutral-500">Orders placed</span>
            <span className="block mt-1 text-2xl font-semibold text-neutral-950">{displayOrders.length}</span>
            <span className="block mt-1 text-[11px] text-neutral-500">All order activity</span>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <span className="block text-xs font-medium text-neutral-500">Open orders</span>
            <span className="block mt-1 text-2xl font-semibold text-neutral-950">
              {displayOrders.filter(order => order.status !== 'delivered').length}
            </span>
            <span className="block mt-1 text-[11px] text-neutral-500">Production and delivery</span>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <span className="block text-xs font-medium text-neutral-500">Delivered</span>
            <span className="block mt-1 text-2xl font-semibold text-neutral-950">
              {displayOrders.filter(order => order.status === 'delivered').length}
            </span>
            <span className="block mt-1 text-[11px] text-neutral-500">Completed orders</span>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <span className="block text-xs font-medium text-neutral-500">Total spend</span>
            <span className="block mt-1 text-2xl font-semibold text-neutral-950">
              ${displayOrders.reduce((sum, order) => sum + order.grandTotal, 0).toFixed(2)}
            </span>
            <span className="block mt-1 text-[11px] text-neutral-500">Across all orders</span>
          </div>
        </div>

        {/* Main account content and navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-3 shadow-sm space-y-1">
              
              {/* Dashboard Overview */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4" />
                  <span>Dashboard Overview</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-white' : 'text-neutral-400'}`} />
              </button>

              {/* Order History */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                  activeTab === 'orders'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Order History</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {displayOrders.length}
                </span>
              </button>

              {/* Order Details (Quick switch if selected) */}
              {selectedOrder && (
                <button
                  onClick={() => setActiveTab('order-details')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    activeTab === 'order-details'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span>Order #{selectedOrder.orderNumber}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'order-details' ? 'text-white' : 'text-neutral-400'}`} />
                </button>
              )}

              {/* Account Details */}
              <button
                onClick={() => setActiveTab('account-details')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                  activeTab === 'account-details'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Account Details</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'account-details' ? 'text-white' : 'text-neutral-400'}`} />
              </button>

              {/* Address Section */}
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>Address Book</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {savedAddresses.length}
                </span>
              </button>

              {/* Account Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                  activeTab === 'settings'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-white' : 'text-neutral-400'}`} />
              </button>

              {/* Divider & Logout Button in Sidebar */}
              <div className="pt-2 border-t border-neutral-100">
                <button
                  onClick={() => setLogoutConfirmOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Account</span>
                </button>
              </div>

            </div>

            {/* Support / Quick Help Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                <Headphones className="w-4 h-4 text-red-600" />
                <span>Print support</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Get help with order status, artwork checks, or gang sheet sizing.
              </p>
              <button
                onClick={() => {
                  setChatbotInitialPrompt('I need help with my recent order');
                  setChatbotOpen(true);
                }}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Contact customer support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* RIGHT MAIN VIEW AREA */}
          <div className="lg:col-span-3">

            {/* ========================================================================= */}
            {/* 1. DASHBOARD OVERVIEW TAB */}
            {/* ========================================================================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Most recent order */}
                {latestOrder && (
                  <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs">
                    <div className="bg-neutral-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider block">
                          Most Recent Order
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-black text-base text-white">#{latestOrder.orderNumber}</span>
                          <span className="text-neutral-400">·</span>
                          <span className="text-xs text-neutral-300">{new Date(latestOrder.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(latestOrder.status)}
                        <button
                          onClick={() => handleOpenOrderDetails(latestOrder)}
                          className="px-3.5 py-1.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Timeline milestone bar */}
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-[11px] font-semibold">
                        {orderMilestones.map((milestone, index) => {
                          const MilestoneIcon = orderMilestoneIcons[index];
                          const completed = index < latestOrderStage;
                          const current = index === latestOrderStage;

                          return (
                            <div
                              key={milestone}
                              className={`flex items-center gap-1.5 ${completed || (current && latestOrder.status === 'delivered') ? 'text-emerald-700' : current ? 'text-red-700' : 'text-neutral-400'}`}
                            >
                              <MilestoneIcon className="w-4 h-4 shrink-0" />
                              <span>{index + 1}. {milestone}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                        <div
                          role="progressbar"
                          aria-label="Order progress"
                          aria-valuenow={orderProgressPercent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          className="bg-red-600 h-full transition-all duration-500"
                          style={{ width: `${orderProgressPercent}%` }}
                        />
                      </div>

                      {latestOrder.trackingNumber && (
                        <div className="bg-neutral-50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs border border-neutral-200/80">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                              <Truck className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-neutral-500 block text-[11px]">Tracking number</span>
                              <span className="font-mono font-bold text-neutral-900 text-sm">
                                {latestOrder.trackingNumber}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setChatbotInitialPrompt(`Track my order #${latestOrder.orderNumber}`);
                                setChatbotOpen(true);
                              }}
                              className="px-3 py-1 bg-neutral-900 hover:bg-black text-white rounded-xl font-bold text-xs transition-colors"
                            >
                              Tracking help
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => {
                      setSelectedProductId('prod-dtf-gang-sheet');
                      setView('product-detail');
                    }}
                    className="bg-white p-5 rounded-3xl border border-neutral-200/90 hover:border-neutral-900 transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-sm text-neutral-900 group-hover:text-rose-600 transition-colors">
                      Order Custom Gang Sheet
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Continuous 22" PET film rolls from 2ft to 40ft with wholesale bulk tiers.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 mt-3">
                      Start Gang Roll <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div 
                    onClick={() => {
                      setSelectedProductId('prod-dtf-custom-size');
                      setView('product-detail');
                    }}
                    className="bg-white p-5 rounded-3xl border border-neutral-200/90 hover:border-neutral-900 transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0084ff] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-sm text-neutral-900 group-hover:text-[#0084ff] transition-colors">
                      Shop Transfers by Size
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Single pre-cut transfers from 2" pockets up to 12"×17" oversized backs.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0084ff] mt-3">
                      View Size Options <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('addresses')}
                    className="bg-white p-5 rounded-3xl border border-neutral-200/90 hover:border-neutral-900 transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-sm text-neutral-900 group-hover:text-emerald-600 transition-colors">
                      Manage Delivery Addresses
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Update warehouse addresses, tax certificates, and default shipping routes.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-3">
                      Edit Addresses <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Recent Orders Table Preview */}
                <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-neutral-900">Recent Print Runs</h3>
                      <p className="text-xs text-neutral-500">Your latest orders with direct prepress tracking</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <span>View All Orders ({displayOrders.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {displayOrders.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-sm font-semibold text-neutral-800">No orders yet</p>
                      <p className="mt-1 text-xs text-neutral-500">Orders placed on this account will appear here.</p>
                      <button
                        type="button"
                        onClick={() => setView('catalog')}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                      >
                        Browse products
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {displayOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={order.items[0]?.image || ASSETS.gangSheetRoll} 
                            alt="" 
                            className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shrink-0 bg-neutral-100" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-neutral-900">#{order.orderNumber}</span>
                              <span className="text-[11px] text-neutral-400">·</span>
                              <span className="text-[11px] text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="text-xs font-bold text-neutral-800 mt-0.5 line-clamp-1">
                              {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                            </h4>
                            <span className="text-xs font-mono font-black text-neutral-900 block mt-1">
                              ${order.grandTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          <button
                            onClick={() => handleOpenOrderDetails(order)}
                            className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleReorderOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-colors"
                          >
                            Reorder
                          </button>
                        </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. ORDER HISTORY TAB */}
            {/* ========================================================================= */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Search & Filter Header Bar */}
                <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      aria-label="Search orders"
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                    />
                    {orderSearchTerm && (
                      <button 
                        onClick={() => setOrderSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Status Filters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
                    <button
                      onClick={() => setOrderStatusFilter('all')}
                      className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                        orderStatusFilter === 'all'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      All Orders ({displayOrders.length})
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('in_production')}
                      className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                        orderStatusFilter === 'in_production'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      In Production
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('shipped')}
                      className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                        orderStatusFilter === 'shipped'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Shipped
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter('delivered')}
                      className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                        orderStatusFilter === 'delivered'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      Delivered
                    </button>
                  </div>

                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                      <Package className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-neutral-900 text-base">No matching orders found</h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Try clearing your search filters or configure a new custom gang sheet run.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProductId('prod-dtf-gang-sheet');
                        setView('product-detail');
                      }}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Order New DTF Transfers
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map(order => (
                      <div key={order.id} className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow">
                        
                        {/* Order Header Bar */}
                        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                          <div className="flex flex-wrap items-center gap-6">
                            <div>
                              <span className="text-neutral-400 block text-[11px] font-semibold">Order Number</span>
                              <span className="font-mono font-black text-neutral-900 text-sm">#{order.orderNumber}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block text-[11px] font-semibold">Date Placed</span>
                              <span className="font-mono text-neutral-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block text-[11px] font-semibold">Total Amount</span>
                              <span className="font-mono font-black text-neutral-900 text-sm">${order.grandTotal.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block text-[11px] font-semibold">Items</span>
                              <span className="font-mono text-neutral-700">{order.items.reduce((s, i) => s + i.quantity, 0)} transfers</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        {/* Order Items Summary */}
                        <div className="p-6 divide-y divide-neutral-100">
                          {order.items.map(item => (
                            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 min-w-0">
                                <img 
                                  src={item.image} 
                                  alt="" 
                                  className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0 bg-neutral-100" 
                                />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-neutral-900 truncate">{item.productName}</h4>
                                  {item.variantName && (
                                    <p className="text-[11px] text-neutral-500 mt-0.5">{item.variantName}</p>
                                  )}
                                  {item.customConfig?.artfileName && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono mt-1">
                                      <FileCheck className="w-3 h-3" />
                                      {item.customConfig.artfileName} (300 DPI)
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-mono font-black text-xs text-neutral-900 block">
                                  ${item.totalPrice.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-mono">
                                  Qty: {item.quantity} · ${item.unitPrice.toFixed(2)} ea
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Bottom Action Bar */}
                        <div className="bg-neutral-50/70 px-6 py-3.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                            {order.trackingNumber ? (
                              <span className="flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-rose-600" />
                                <span>Tracking: <strong className="font-mono text-neutral-900">{order.trackingNumber}</strong></span>
                              </span>
                            ) : (
                              <span>Shipping: <strong>{order.shippingMethod}</strong></span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => handleOpenOrderDetails(order)}
                              className="px-4 py-1.5 rounded-xl border border-neutral-300 hover:bg-white text-neutral-900 font-bold text-xs transition-colors flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Order Details</span>
                            </button>
                            <button
                              onClick={() => handleReorderOrder(order)}
                              className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>1-Click Reorder</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. ORDER DETAILS DEEP VIEW TAB */}
            {/* ========================================================================= */}
            {activeTab === 'order-details' && selectedOrder && (
              <div className="space-y-6">
                
                {/* Back to Orders Button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>Back to All Orders</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                    <button
                      onClick={() => handleReorderOrder(selectedOrder)}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reorder This Batch</span>
                    </button>
                  </div>
                </div>

                {/* Order Deep Inspector Card */}
                <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs">
                  
                  {/* Top Bar with Big Order # and Badge */}
                  <div className="bg-neutral-950 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-neutral-400 font-mono block">COMMERCIAL PRINT INVOICE</span>
                      <h2 className="text-2xl font-black font-mono tracking-tight text-white mt-1">
                        Order #{selectedOrder.orderNumber}
                      </h2>
                      <p className="text-xs text-neutral-400 mt-1">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>

                  {/* 5-Step Production Milestone Progress */}
                  <div className="bg-neutral-900 text-white px-6 py-5 border-t border-neutral-800 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Live Prepress &amp; Production Milestones
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-bold">
                      <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/10 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>1. Order Confirmed</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/10 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>2. 300 DPI Prepress</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                        <span>3. PET Printing</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-400 flex items-center gap-2">
                        <Truck className="w-4 h-4 shrink-0" />
                        <span>4. UPS Dispatch</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-400 flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>5. Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping, Delivery, and Payment Details Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 border-b border-neutral-100 bg-neutral-50/50 text-xs">
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] block mb-2">
                        Delivery Address
                      </span>
                      <p className="font-extrabold text-neutral-900">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-neutral-600 mt-0.5">{selectedOrder.shippingAddress.addressLine1}</p>
                      <p className="text-neutral-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                      <p className="text-neutral-600">{selectedOrder.shippingAddress.country}</p>
                      <p className="text-neutral-400 font-mono mt-1">{selectedOrder.shippingAddress.phone}</p>
                    </div>

                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] block mb-2">
                        Shipping Method &amp; Carrier
                      </span>
                      <p className="font-extrabold text-neutral-900">{selectedOrder.shippingMethod}</p>
                      {selectedOrder.trackingNumber ? (
                        <div className="mt-2 p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                          <span className="text-[10px] text-neutral-400 block">Tracking ID</span>
                          <span className="font-mono font-bold text-neutral-900 block">{selectedOrder.trackingNumber}</span>
                          <button
                            onClick={() => {
                              setChatbotInitialPrompt(`Where is tracking #${selectedOrder.trackingNumber}?`);
                              setChatbotOpen(true);
                            }}
                            className="text-[11px] font-bold text-[#0084ff] hover:underline flex items-center gap-1 pt-1"
                          >
                            <span>Live Carrier Status</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-neutral-500 mt-1">Available shipping options are shown during checkout.</p>
                      )}
                    </div>

                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] block mb-2">
                        Payment &amp; Billing
                      </span>
                      <p className="font-extrabold text-neutral-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>{selectedOrder.paymentMethod}</span>
                      </p>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] mt-2">
                        Status: Paid in Full
                      </span>
                      {selectedOrder.couponCode && (
                        <p className="text-[11px] text-rose-600 font-mono font-bold mt-2">
                          Discount Applied: {selectedOrder.couponCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <h3 className="font-extrabold text-sm text-neutral-900">Items in this Batch</h3>

                    <div className="divide-y divide-neutral-100">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4 min-w-0">
                            <img 
                              src={item.image} 
                              alt="" 
                              className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 shrink-0 bg-neutral-100" 
                            />
                            <div>
                              <h4 className="text-sm font-extrabold text-neutral-900">{item.productName}</h4>
                              {item.variantName && (
                                <p className="text-xs text-neutral-500 mt-0.5">{item.variantName}</p>
                              )}
                              
                              {/* Artwork File Verification Box */}
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                                  <FileCheck className="w-3.5 h-3.5" />
                                  Artwork: 300 DPI High-Def Vector
                                </span>
                                <span className="text-[11px] text-neutral-500">
                                  PET Film Width: 22" Industrial
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-sm text-neutral-900 block">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-neutral-500 font-mono">
                              Qty: {item.quantity} · ${item.unitPrice.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Financial Summary Calculation */}
                    <div className="pt-6 border-t border-neutral-100 max-w-sm ml-auto space-y-2 text-xs">
                      <div className="flex justify-between text-neutral-600">
                        <span>Items Subtotal</span>
                        <span className="font-mono font-bold text-neutral-900">${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      {selectedOrder.discountTotal > 0 && (
                        <div className="flex justify-between text-rose-600">
                          <span>Volume Roll Savings</span>
                          <span className="font-mono font-bold">-${selectedOrder.discountTotal.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-600">
                        <span>Shipping &amp; Handling</span>
                        <span className="font-mono font-bold text-emerald-700">
                          {selectedOrder.shippingTotal === 0 ? 'FREE Priority' : `$${selectedOrder.shippingTotal.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Estimated Tax (Resale Exempt)</span>
                        <span className="font-mono font-bold text-neutral-900">${selectedOrder.taxTotal.toFixed(2)}</span>
                      </div>
                      <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm font-black text-neutral-900">
                        <span>Grand Total</span>
                        <span className="font-mono text-base text-rose-600">${selectedOrder.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. ACCOUNT DETAILS TAB */}
            {/* ========================================================================= */}
            {activeTab === 'account-details' && (
              <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-black text-neutral-900">Account Details &amp; Printmaker Profile</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Manage your commercial business identity, verified email, and state tax-exemption resale certificates.
                  </p>
                </div>

                {profileSaveSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your account details have been updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Company & Industry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Company / Brand / Print Shop Name</label>
                      <input
                        type="text"
                        value={profileForm.companyName}
                        onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Industry Type</label>
                      <select
                        value={profileForm.industry}
                        onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                      >
                        <option>Screen Printing &amp; Apparel Brand</option>
                        <option>Embroidery &amp; Uniforms</option>
                        <option>Etsy &amp; Custom Merch Crafter</option>
                        <option>Sports Leagues &amp; Schools</option>
                        <option>Commercial Sign &amp; Wrap Shop</option>
                        <option>Individual Side Hustler</option>
                      </select>
                    </div>
                  </div>

                  {/* Resale Certificate / Tax Exemption Card */}
                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-extrabold text-xs text-neutral-900">B2B Wholesale Tax Exemption</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                        Active &amp; Approved
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Your resale certificate is on file. All orders automatically deduct sales tax at checkout.
                    </p>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-1">State Resale Certificate ID</label>
                      <input
                        type="text"
                        value={profileForm.taxExemptId}
                        onChange={(e) => setProfileForm({ ...profileForm, taxExemptId: e.target.value })}
                        className="w-full sm:w-80 px-3.5 py-2 bg-white border border-neutral-300 rounded-xl font-mono text-xs font-bold text-neutral-900"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all shadow-xs"
                    >
                      Save Account Details
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 5. ADDRESS SECTION TAB */}
            {/* ========================================================================= */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                
                {/* Header with "+ Add Address" */}
                <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900">Address Book</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Manage delivery destinations, drop-shipping customer addresses, and billing details.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setAddressFormData({
                        label: 'New Delivery Address',
                        fullName: `${profileForm.firstName} ${profileForm.lastName}`,
                        phone: profileForm.phone,
                        addressLine1: '',
                        city: '',
                        state: 'TX',
                        postalCode: '',
                        country: 'United States',
                        isDefault: false
                      });
                      setAddressModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Addresses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map(addr => (
                    <div 
                      key={addr.id} 
                      className={`bg-white rounded-3xl p-6 border transition-all shadow-2xs space-y-4 flex flex-col justify-between ${
                        addr.isDefault ? 'border-rose-600/60 ring-2 ring-rose-600/10' : 'border-neutral-200/90'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-neutral-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-rose-600" />
                            {addr.label}
                          </span>

                          {addr.isDefault ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                              Default Shipping
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[11px] text-neutral-500 hover:text-rose-600 font-bold hover:underline"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        <div className="text-xs text-neutral-600 leading-relaxed font-medium space-y-0.5">
                          <p className="font-black text-neutral-900">{addr.fullName}</p>
                          <p>{addr.addressLine1}</p>
                          <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                          <p>{addr.country}</p>
                          <p className="text-neutral-400 font-mono pt-1">{addr.phone}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => {
                            setEditingAddressId(addr.id);
                            setAddressFormData({
                              label: addr.label,
                              fullName: addr.fullName,
                              phone: addr.phone,
                              addressLine1: addr.addressLine1,
                              city: addr.city,
                              state: addr.state,
                              postalCode: addr.postalCode,
                              country: addr.country,
                              isDefault: addr.isDefault
                            });
                            setAddressModalOpen(true);
                          }}
                          className="font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {!addr.isDefault && (
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 6. ACCOUNT SETTINGS TAB */}
            {/* ========================================================================= */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                {/* Password & Security Card */}
                <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-neutral-700" />
                      <span>Password &amp; Security</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Ensure your account remains safe with a secure commercial passkey.
                    </p>
                  </div>

                  {passwordSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Password updated successfully!</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Notification & Communication Preferences */}
                <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-neutral-700" />
                      <span>Notifications &amp; Prepress Proof Alerts</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Choose how you receive live tracking updates, artwork review flags, and gang sheet invoice digests.
                    </p>
                  </div>

                  {settingsSaveSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Notification preferences saved!</span>
                    </div>
                  )}

                  <div className="divide-y divide-neutral-100 text-xs">
                    
                    {/* SMS Tracking */}
                    <div className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-extrabold text-neutral-900 block">SMS Order Tracking Alerts</span>
                        <span className="text-neutral-500 text-[11px] block mt-0.5">
                          Receive instant text messages when your rolls dispatch from Florida/California and arrive on trucks.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsTracking}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsTracking: e.target.checked })}
                        className="w-5 h-5 rounded accent-rose-600 cursor-pointer"
                      />
                    </div>

                    {/* Prepress Proof Approvals */}
                    <div className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-extrabold text-neutral-900 block">Prepress Proof Approval Alerts</span>
                        <span className="text-neutral-500 text-[11px] block mt-0.5">
                          High-priority emails if our operators flag low DPI artwork, semi-transparent pixels, or thin lines under 1pt.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailPrepressApproval}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailPrepressApproval: e.target.checked })}
                        className="w-5 h-5 rounded accent-rose-600 cursor-pointer"
                      />
                    </div>

                    {/* Weekly Digest */}
                    <div className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-extrabold text-neutral-900 block">Weekly Gang Sheet Production Digest</span>
                        <span className="text-neutral-500 text-[11px] block mt-0.5">
                          Weekly breakdown of total square footage printed and volume roll discount tier credits.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.gangSheetWeeklyDigest}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, gangSheetWeeklyDigest: e.target.checked })}
                        className="w-5 h-5 rounded accent-rose-600 cursor-pointer"
                      />
                    </div>

                    {/* Exclusive Promo Offers */}
                    <div className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-extrabold text-neutral-900 block">VIP Flash Discounts &amp; New Film Roll Launches</span>
                        <span className="text-neutral-500 text-[11px] block mt-0.5">
                          Early access to seasonal PET film sales, UV DTF decal promos, and blank apparel drops.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.promoOffers}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, promoOffers: e.target.checked })}
                        className="w-5 h-5 rounded accent-rose-600 cursor-pointer"
                      />
                    </div>

                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setSettingsSaveSuccess(true);
                        setTimeout(() => setSettingsSaveSuccess(false), 3000);
                      }}
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Save Preferences
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT ADDRESS MODAL */}
      {/* ========================================================================= */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-neutral-900">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button 
                onClick={() => setAddressModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Address Label (e.g. Studio, Warehouse)</label>
                <input
                  type="text"
                  value={addressFormData.label}
                  onChange={(e) => setAddressFormData({ ...addressFormData, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={addressFormData.fullName}
                    onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={addressFormData.phone}
                    onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={addressFormData.addressLine1}
                  onChange={(e) => setAddressFormData({ ...addressFormData, addressLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">City</label>
                  <input
                    type="text"
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">State</label>
                  <input
                    type="text"
                    value={addressFormData.state}
                    onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={addressFormData.postalCode}
                    onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultAddrCheck"
                  checked={addressFormData.isDefault}
                  onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded accent-rose-600"
                />
                <label htmlFor="defaultAddrCheck" className="text-neutral-700 font-semibold cursor-pointer">
                  Set as my primary default delivery address
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 font-bold hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl font-bold transition-colors shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOGOUT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-black text-base text-neutral-900">Sign Out of Ambalvee?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                You will be returned to the store homepage. Your cart and past order files remain securely saved.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 transition-colors"
              >
                Stay Logged In
              </button>
              <button
                onClick={handlePerformLogout}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
