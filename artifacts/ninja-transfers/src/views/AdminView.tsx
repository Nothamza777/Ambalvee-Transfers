import React, { useMemo, useState } from 'react';
import { useStore, AdminTab } from '../context/StoreContext';
import { 
  BarChart3, 
  Package, 
  Boxes, 
  Users, 
  CreditCard, 
  Tag, 
  ClipboardList, 
  TrendingUp, 
  ArrowUpRight, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  FileDown, 
  Filter, 
  Eye, 
  Printer, 
  RefreshCw,
  X,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  Film,
  Play,
  Image,
  Layers,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Globe2
} from 'lucide-react';
import { Product, Order, OrderStatus, MenuHeaderConfig, MenuItem, ShowcaseVideo } from '../types';
import { IMAGE_PRESETS } from '../data/mockStore';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { WebsiteContentEditor } from '../components/WebsiteContentEditor';

export const AdminView: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    orders,
    products,
    customers,
    coupons,
    stockMovements,
    auditLogs,
    loginEvents,
    loginHistory,
    updateOrderStatus,
    refundOrder,
    adjustStock,
    addProduct,
    updateProduct,
    deleteProduct,
    setView,
    logoutAdmin,
    menuHeaders,
    updateMenuHeader,
    addMenuHeader,
    deleteMenuHeader,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    resetMenuHeadersToDefault,
    videos,
    addVideo,
    updateVideo,
    deleteVideo
  } = useStore();

  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d' | 'year' | 'all'>('30d');
  const [orderSearch, setOrderSearch] = useState('');
  const [loginHistorySearch, setLoginHistorySearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Status update modal state
  const [statusModalOrder, setStatusModalOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('in_production');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Refund modal state
  const [refundModalOrder, setRefundModalOrder] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState('');

  // Stock adjustment modal
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(10);
  const [stockReason, setStockReason] = useState<'restock' | 'damaged' | 'adjustment'>('restock');

  // Product Add / Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormCategory, setProdFormCategory] = useState<any>('dtf-transfers');
  const [prodFormPrice, setProdFormPrice] = useState(9.99);
  const [prodFormStock, setProdFormStock] = useState(100);
  const [prodFormDesc, setProdFormDesc] = useState('');
  const [prodFormImage, setProdFormImage] = useState('');

  // Coupon Add Modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(50);

  // Packing slip print modal
  const [packingSlipOrder, setPackingSlipOrder] = useState<Order | null>(null);

  // Menu Manager state
  const [selectedHeaderId, setSelectedHeaderId] = useState<string>(menuHeaders[0]?.id || 'nav-dtf');
  const [selectedTabId, setSelectedTabId] = useState<string>(menuHeaders[0]?.tabs[0]?.id || 'tab1');
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [editingHeader, setEditingHeader] = useState<MenuHeaderConfig | null>(null);
  const [headerFormLabel, setHeaderFormLabel] = useState('');
  const [headerFormCategory, setHeaderFormCategory] = useState<string>('');
  const [headerFormDisplayType, setHeaderFormDisplayType] = useState<'media-grid' | 'text-links'>('media-grid');
  const [headerFormBannerText, setHeaderFormBannerText] = useState('');
  const [headerFormBannerBtnText, setHeaderFormBannerBtnText] = useState('');
  const [headerFormBannerBtnCat, setHeaderFormBannerBtnCat] = useState('');

  // Menu Item Modal state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [itemFormName, setItemFormName] = useState('');
  const [itemFormImage, setItemFormImage] = useState('');
  const [itemFormTag, setItemFormTag] = useState('');
  const [itemFormColumnGroup, setItemFormColumnGroup] = useState('');
  const [itemFormDesc, setItemFormDesc] = useState('');
  const [itemFormTargetView, setItemFormTargetView] = useState('catalog');
  const [itemFormTargetCat, setItemFormTargetCat] = useState('dtf-transfers');

  // Media Manager state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ShowcaseVideo | null>(null);
  const [videoFormTitle, setVideoFormTitle] = useState('');
  const [videoFormSubtitle, setVideoFormSubtitle] = useState('');
  const [videoFormDuration, setVideoFormDuration] = useState('1:00');
  const [videoFormTag, setVideoFormTag] = useState('TUTORIAL');
  const [videoFormThumbnail, setVideoFormThumbnail] = useState('');
  const [videoFormVideoUrl, setVideoFormVideoUrl] = useState('');
  const [videoFormDesc, setVideoFormDesc] = useState('');
  const [videoFormProdName, setVideoFormProdName] = useState('');
  const [videoFormSteps, setVideoFormSteps] = useState('');
  const [previewingVideo, setPreviewingVideo] = useState<ShowcaseVideo | null>(null);
  const [copiedPresetUrl, setCopiedPresetUrl] = useState<string | null>(null);

  // Executive Metrics Calculations
  const settledOrders = orders.filter(order => order.paymentStatus === 'paid' && order.status !== 'cancelled');
  const grossSales = settledOrders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalDiscounts = settledOrders.reduce((acc, o) => acc + o.discountTotal, 0);
  const netSales = Math.max(0, grossSales - totalDiscounts);
  const totalOrdersCount = orders.length;
  const aov = settledOrders.length > 0 ? (grossSales / settledOrders.length) : 0;
  
  const totalProductsSold = orders.reduce((acc, o) => 
    acc + o.items.reduce((s, i) => s + i.quantity, 0), 0
  );

  const lowStockCount = products.filter(p => p.variants.some(v => v.stock > 0 && v.stock < 20)).length;
  const outOfStockCount = products.filter(p => p.variants.every(v => v.stock === 0)).length;
  const loginActivity = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - index));
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const activeUserIds = new Set(
        loginEvents
          .filter(event => {
            const loginAt = new Date(event.at).getTime();
            return Number.isFinite(loginAt) && loginAt >= start.getTime() && loginAt < end.getTime();
          })
          .map(event => event.userId)
      );
      return {
        day: start.toLocaleDateString(undefined, { weekday: 'short' }),
        date: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        users: activeUserIds.size,
        sessions: loginEvents.filter(event => {
          const loginAt = new Date(event.at).getTime();
          return Number.isFinite(loginAt) && loginAt >= start.getTime() && loginAt < end.getTime();
        }).length
      };
    });
  }, [loginEvents]);
  const salesActivity = useMemo(() => {
    const now = new Date();
    const buckets: Array<{ key: string; label: string; revenue: number; orders: number }> = [];
    if (dateFilter === 'today') {
      for (let hour = 0; hour <= now.getHours(); hour += 1) {
        const start = new Date(now);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(hour + 1);
        const matches = orders.filter(order => {
          const time = new Date(order.createdAt).getTime();
          return Number.isFinite(time) && time >= start.getTime() && time < end.getTime() && order.status !== 'cancelled' && order.paymentStatus === 'paid';
        });
        buckets.push({ key: String(hour), label: `${String(hour).padStart(2, '0')}:00`, revenue: matches.reduce((sum, order) => sum + order.grandTotal, 0), orders: matches.length });
      }
    } else if (dateFilter === '7d' || dateFilter === '30d') {
      const days = dateFilter === '7d' ? 7 : 30;
      for (let offset = days - 1; offset >= 0; offset -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        const matches = orders.filter(order => {
          const time = new Date(order.createdAt).getTime();
          return Number.isFinite(time) && time >= start.getTime() && time < end.getTime() && order.status !== 'cancelled' && order.paymentStatus === 'paid';
        });
        buckets.push({ key: start.toISOString(), label: dateFilter === '7d' ? start.toLocaleDateString(undefined, { weekday: 'short' }) : start.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }), revenue: matches.reduce((sum, order) => sum + order.grandTotal, 0), orders: matches.length });
      }
    } else {
      const earliestOrder = orders.reduce((earliest, order) => {
        const time = new Date(order.createdAt).getTime();
        return Number.isFinite(time) ? Math.min(earliest, time) : earliest;
      }, now.getTime());
      const first = dateFilter === 'year'
        ? new Date(now.getFullYear(), now.getMonth() - 11, 1)
        : new Date(new Date(earliestOrder).getFullYear(), new Date(earliestOrder).getMonth(), 1);
      const monthCount = Math.max(1, (now.getFullYear() - first.getFullYear()) * 12 + now.getMonth() - first.getMonth() + 1);
      for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        const matches = orders.filter(order => {
          const time = new Date(order.createdAt).getTime();
          return Number.isFinite(time) && time >= start.getTime() && time < end.getTime() && order.status !== 'cancelled' && order.paymentStatus === 'paid';
        });
        buckets.push({ key: start.toISOString(), label: start.toLocaleDateString(undefined, { month: 'short' }), revenue: matches.reduce((sum, order) => sum + order.grandTotal, 0), orders: matches.length });
      }
    }
    return buckets;
  }, [dateFilter, orders]);
  const salesInPeriod = salesActivity.reduce((sum, item) => sum + item.revenue, 0);
  const ordersInPeriod = salesActivity.reduce((sum, item) => sum + item.orders, 0);
  const uniqueUsersThisWeek = useMemo(() => {
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - 6);
    return new Set(
      loginEvents
        .filter(event => {
          const loginAt = new Date(event.at).getTime();
          return Number.isFinite(loginAt) && loginAt >= weekStart.getTime();
        })
        .map(event => event.userId)
    ).size;
  }, [loginEvents]);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = !orderSearch.trim() || 
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const filteredLoginHistory = loginHistory.filter(entry => {
    const query = loginHistorySearch.trim().toLowerCase();
    return !query || entry.name.toLowerCase().includes(query) || entry.email.toLowerCase().includes(query);
  });

  const handleOpenStatusModal = (order: Order) => {
    setStatusModalOrder(order);
    setNewStatus(order.status);
    setTrackingNumberInput(order.trackingNumber || '');
  };

  const handleSaveStatus = () => {
    if (statusModalOrder) {
      updateOrderStatus(statusModalOrder.id, newStatus, trackingNumberInput || undefined);
      setStatusModalOrder(null);
    }
  };

  const handleProcessRefund = () => {
    if (refundModalOrder && refundReason.trim()) {
      refundOrder(refundModalOrder.id, refundReason);
      setRefundModalOrder(null);
      setRefundReason('');
    }
  };

  const handleSaveStockAdjustment = () => {
    if (stockModalProduct) {
      adjustStock(
        stockModalProduct.id, 
        stockModalProduct.variants[0]?.id, 
        stockDelta, 
        stockReason, 
        'Admin Operations'
      );
      setStockModalProduct(null);
    }
  };

  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProdFormName(prod.name);
      setProdFormCategory(prod.category);
      setProdFormPrice(prod.price);
      setProdFormStock(prod.variants[0]?.stock || 50);
      setProdFormDesc(prod.shortDescription);
      setProdFormImage(prod.images[0] || IMAGE_PRESETS[0].url);
    } else {
      setEditingProduct(null);
      setProdFormName('');
      setProdFormCategory('dtf-transfers');
      setProdFormPrice(9.99);
      setProdFormStock(100);
      setProdFormDesc('');
      setProdFormImage(IMAGE_PRESETS[0].url);
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImg = prodFormImage.trim() || IMAGE_PRESETS[0].url;
    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: prodFormName,
        category: prodFormCategory,
        price: prodFormPrice,
        shortDescription: prodFormDesc,
        images: [finalImg, ...(editingProduct.images.slice(1) || [])],
        variants: editingProduct.variants.map((v, i) => i === 0 ? { ...v, price: prodFormPrice, stock: prodFormStock } : v)
      };
      updateProduct(updated);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: prodFormName,
        slug: prodFormName.toLowerCase().replace(/\s+/g, '-'),
        category: prodFormCategory,
        description: prodFormDesc || 'Commercial grade transfer and printing product.',
        shortDescription: prodFormDesc || 'Ready to press with vibrant wash endurance.',
        price: prodFormPrice,
        images: [finalImg],
        rating: 5.0,
        reviewCount: 1,
        variants: [
          { id: `v-${Date.now()}`, name: 'Standard Edition', sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`, price: prodFormPrice, stock: prodFormStock, attributes: {} }
        ],
        volumeTiers: [
          { minQty: 1, pricePerUnit: prodFormPrice, discountPercentage: 0 }
        ],
        specifications: {
          turnaround: 'Ships in 24 Hours'
        }
      };
      addProduct(newProd);
    }
    setProductModalOpen(false);
  };

  // Menu Header Handlers
  const handleOpenHeaderModal = (header?: MenuHeaderConfig) => {
    if (header) {
      setEditingHeader(header);
      setHeaderFormLabel(header.label);
      setHeaderFormCategory(header.category || '');
      setHeaderFormDisplayType(header.displayType || 'media-grid');
      setHeaderFormBannerText(header.bannerText || '');
      setHeaderFormBannerBtnText(header.bannerButtonText || '');
      setHeaderFormBannerBtnCat(header.bannerButtonCategory || '');
    } else {
      setEditingHeader(null);
      setHeaderFormLabel('');
      setHeaderFormCategory('dtf-transfers');
      setHeaderFormDisplayType('media-grid');
      setHeaderFormBannerText('Fast Turnaround Commercial Quality');
      setHeaderFormBannerBtnText('Shop Collection');
      setHeaderFormBannerBtnCat('dtf-transfers');
    }
    setHeaderModalOpen(true);
  };

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerFormLabel.trim()) return;

    if (editingHeader) {
      updateMenuHeader({
        ...editingHeader,
        label: headerFormLabel.trim(),
        category: (headerFormCategory || undefined) as any,
        displayType: headerFormDisplayType,
        bannerText: headerFormBannerText.trim() || undefined,
        bannerButtonText: headerFormBannerBtnText.trim() || undefined,
        bannerButtonCategory: (headerFormBannerBtnCat || undefined) as any,
      });
    } else {
      const newHeader: MenuHeaderConfig = {
        id: `nav-${Date.now()}`,
        label: headerFormLabel.trim(),
        category: (headerFormCategory || undefined) as any,
        displayType: headerFormDisplayType,
        bannerText: headerFormBannerText.trim() || 'Fast Commercial Turnaround',
        bannerButtonText: headerFormBannerBtnText.trim() || 'View Collection',
        bannerButtonCategory: (headerFormBannerBtnCat || undefined) as any,
        tabs: [
          {
            id: `tab-${Date.now()}-1`,
            tabName: 'Featured Lineup',
            items: [
              {
                id: `item-${Date.now()}-1`,
                name: `${headerFormLabel} Core Item`,
                imageUrl: IMAGE_PRESETS[0].url,
                tag: 'NEW ARRIVAL',
                description: 'Commercial grade specs',
                targetView: 'catalog',
                targetCategory: (headerFormCategory || 'dtf-transfers') as any,
              }
            ]
          }
        ]
      };
      addMenuHeader(newHeader);
      setSelectedHeaderId(newHeader.id);
    }
    setHeaderModalOpen(false);
  };

  // Menu Item Handlers
  const handleOpenItemModal = (item?: MenuItem) => {
    if (item) {
      setEditingMenuItem(item);
      setItemFormName(item.name);
      setItemFormImage(item.imageUrl || IMAGE_PRESETS[0].url);
      setItemFormTag(item.tag || '');
      setItemFormColumnGroup(item.columnGroup || '');
      setItemFormDesc(item.description || '');
      setItemFormTargetView(item.targetView || 'catalog');
      setItemFormTargetCat(item.targetCategory || 'dtf-transfers');
    } else {
      setEditingMenuItem(null);
      setItemFormName('');
      setItemFormImage(IMAGE_PRESETS[0].url);
      setItemFormTag('');
      setItemFormColumnGroup('');
      setItemFormDesc('');
      setItemFormTargetView('catalog');
      setItemFormTargetCat('dtf-transfers');
    }
    setItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormName.trim() || !selectedHeaderId || !selectedTabId) return;

    const finalItemImg = itemFormImage.trim() || IMAGE_PRESETS[0].url;

    if (editingMenuItem) {
      updateMenuItem(selectedHeaderId, selectedTabId, {
        ...editingMenuItem,
        name: itemFormName.trim(),
        imageUrl: finalItemImg,
        tag: itemFormTag.trim() || undefined,
        columnGroup: itemFormColumnGroup.trim() || undefined,
        description: itemFormDesc.trim() || undefined,
        targetView: itemFormTargetView as any,
        targetCategory: itemFormTargetCat as any
      });
    } else {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: itemFormName.trim(),
        imageUrl: finalItemImg,
        tag: itemFormTag.trim() || undefined,
        columnGroup: itemFormColumnGroup.trim() || undefined,
        description: itemFormDesc.trim() || undefined,
        targetView: itemFormTargetView as any,
        targetCategory: itemFormTargetCat as any
      };
      addMenuItem(selectedHeaderId, selectedTabId, newItem);
    }
    setItemModalOpen(false);
  };

  // Showcase Video Handlers
  const handleOpenVideoModal = (vid?: ShowcaseVideo) => {
    if (vid) {
      setEditingVideo(vid);
      setVideoFormTitle(vid.title);
      setVideoFormSubtitle(vid.subtitle || '');
      setVideoFormDuration(vid.duration || '1:00');
      setVideoFormTag(vid.tag || 'TUTORIAL');
      setVideoFormThumbnail(vid.thumbnailUrl);
      setVideoFormVideoUrl(vid.videoUrl || '');
      setVideoFormDesc(vid.description || '');
      setVideoFormProdName(vid.productName || '');
      setVideoFormSteps(vid.steps ? vid.steps.join('\n') : '');
    } else {
      setEditingVideo(null);
      setVideoFormTitle('');
      setVideoFormSubtitle('');
      setVideoFormDuration('1:00');
      setVideoFormTag('TUTORIAL');
      setVideoFormThumbnail(IMAGE_PRESETS[0].url);
      setVideoFormVideoUrl('');
      setVideoFormDesc('');
      setVideoFormProdName('');
      setVideoFormSteps('');
    }
    setVideoModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFormTitle.trim()) return;

    const parsedSteps = videoFormSteps.split('\n').map(s => s.trim()).filter(Boolean);
    const finalThumb = videoFormThumbnail.trim() || IMAGE_PRESETS[0].url;

    if (editingVideo) {
      updateVideo({
        ...editingVideo,
        title: videoFormTitle.trim(),
        subtitle: videoFormSubtitle.trim(),
        duration: videoFormDuration.trim(),
        tag: videoFormTag.trim(),
        thumbnailUrl: finalThumb,
        videoUrl: videoFormVideoUrl.trim(),
        description: videoFormDesc.trim(),
        productName: videoFormProdName.trim() || undefined,
        category: editingVideo.category || 'commercial-dtf',
        steps: parsedSteps
      });
    } else {
      const newVid: ShowcaseVideo = {
        id: `vid-${Date.now()}`,
        title: videoFormTitle.trim(),
        subtitle: videoFormSubtitle.trim(),
        duration: videoFormDuration.trim() || '1:00',
        tag: videoFormTag.trim() || 'DEMO',
        thumbnailUrl: finalThumb,
        videoUrl: videoFormVideoUrl.trim(),
        description: videoFormDesc.trim(),
        productName: videoFormProdName.trim() || undefined,
        category: 'commercial-dtf',
        steps: parsedSteps
      };
      addVideo(newVid);
    }
    setVideoModalOpen(false);
  };

  const exportCustomersCSV = () => {
    const headers = 'ID,Full Name,Email,Orders Count,Total Spent,Status\n';
    const rows = customers.map(c => `"${c.id}","${c.fullName}","${c.email}",${c.ordersCount},${c.totalSpent},"${c.status}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ambalvee_transfers_customers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="bg-neutral-900 text-neutral-100 min-h-screen">
      {/* Admin Top App Bar */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-600 to-rose-500 flex items-center justify-center text-white font-black text-base shadow">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm uppercase tracking-tight text-white flex items-center gap-2">
              <span>Ambalvee Operations</span>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded-full font-mono">
                ADMIN
              </span>
            </h1>
            <span className="text-[11px] text-neutral-400">Order Management, Inventory, Financials & Prepress Queue</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('home')}
            className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold border border-neutral-700 transition-colors"
          >
            ← View Storefront
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-bold border border-rose-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Navigation Sub-Bar */}
      <nav aria-label="Admin dashboard sections" className="bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
          { id: 'website-editor', label: 'Website Editor', icon: Globe2 },
          { id: 'login-history', label: 'Sign-in History', icon: Users },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
          { id: 'products', label: `Products (${products.length})`, icon: Boxes },
          { id: 'menu-manager', label: `Menu Headers & Dropdown (${menuHeaders.length})`, icon: SlidersHorizontal },
          { id: 'media-manager', label: `Media & Videos (${videos.length})`, icon: Film },
          { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'transactions', label: 'Financial Ledger', icon: CreditCard },
          { id: 'coupons', label: `Discounts (${coupons.length})`, icon: Tag },
          { id: 'audit', label: 'System Audit Logs', icon: ClipboardList },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as AdminTab)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                isActive 
                  ? 'bg-rose-600 text-white font-bold shadow-sm' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Content Container */}
      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* 1. EXECUTIVE OVERVIEW */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Gross Sales</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-black text-white">${grossSales.toFixed(2)}</span>
                  <span className="text-neutral-500 font-mono text-[10px] font-bold">ALL ORDERS</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Net Collected: ${netSales.toFixed(2)}</span>
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Orders</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-black text-white">{totalOrdersCount}</span>
                  <span className="text-neutral-500 font-mono text-[10px] font-bold">{orders.filter(o => o.status === 'delivered').length} DELIVERED</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">AOV: ${aov.toFixed(2)}</span>
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Transfers Printed</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-black text-rose-400">{totalProductsSold}</span>
                  <span className="text-neutral-500 font-mono text-[10px] font-bold">UNITS ORDERED</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Prepress Queue: Active</span>
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Inventory Alerts</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-black text-amber-400">{lowStockCount} Low</span>
                  <span className="text-neutral-500 font-mono text-xs">{outOfStockCount} OOS</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Consumables & Blank Stock</span>
              </div>
            </div>

            {/* Activity derived directly from recorded sign-in events */}
            <section className="bg-neutral-950 p-5 sm:p-6 rounded-2xl border border-neutral-800 space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-rose-400">Account activity</p>
                  <h3 className="mt-1 text-base sm:text-lg font-bold text-white">Daily sign-ins</h3>
                  <p className="mt-1 text-xs text-neutral-400">Unique customers and recorded sign-in sessions over the last 7 calendar days.</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-neutral-300">
                  <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Logged-in users</span>
                  <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-teal-400" /> Sign-in sessions</span>
                  <span className="sm:ml-2 text-neutral-500">{uniqueUsersThisWeek} unique users · {loginEvents.filter(event => {
                    const time = new Date(event.at).getTime();
                    const start = new Date();
                    start.setHours(0, 0, 0, 0);
                    start.setDate(start.getDate() - 6);
                    return Number.isFinite(time) && time >= start.getTime();
                  }).length} sessions</span>
                </div>
              </div>
              {!loginActivity.some(item => item.sessions > 0 || item.users > 0) ? (
                <div className="min-h-44 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 px-5 py-8 flex flex-col items-center justify-center text-center">
                  <Users className="h-7 w-7 text-neutral-500" />
                  <p className="mt-3 text-sm font-semibold text-neutral-200">
                    {loginEvents.length === 0 ? 'No sign-in activity recorded yet' : 'No sign-ins in this 7-day window'}
                  </p>
                  <p className="mt-1 max-w-md text-xs leading-relaxed text-neutral-500">
                    {loginEvents.length === 0
                      ? 'Customer sign-ins will appear here as unique users and sessions by day. No activity is inferred or estimated.'
                      : 'The recorded sign-in history contains no activity during these calendar days.'}
                  </p>
                </div>
              ) : (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={loginActivity} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barCategoryGap="28%">
                      <CartesianGrid stroke="#34363b" strokeDasharray="3 5" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,.04)' }}
                        contentStyle={{ background: '#202124', border: '1px solid #45464b', borderRadius: 10, color: '#fff', fontSize: 11 }}
                        formatter={(value: number, name: string) => [value, name === 'users' ? 'Logged-in users' : 'Sign-in sessions']}
                      />
                      <Bar dataKey="users" name="Logged-in users" fill="#c83220" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sessions" name="Sign-in sessions" fill="#4f9a80" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            {/* Interactive Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sales Trend Chart (8 cols) */}
              <div className="lg:col-span-8 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Daily Revenue & Order Velocity
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Calculated from live transaction records</p>
                  </div>
                  <div className="flex gap-1 text-[11px] font-semibold">
                    {(['today', '7d', '30d', 'year'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setDateFilter(d)}
                        className={`px-2.5 py-1 rounded capitalize ${
                          dateFilter === d ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-900'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {ordersInPeriod === 0 ? (
                  <div className="h-56 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 flex flex-col items-center justify-center text-center px-4">
                    <BarChart3 className="w-7 h-7 text-neutral-500" />
                    <p className="mt-3 text-sm font-semibold text-neutral-200">No orders in this period</p>
                    <p className="mt-1 text-xs text-neutral-500">Revenue and order activity will appear when matching orders are recorded.</p>
                  </div>
                ) : (
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesActivity} margin={{ top: 10, right: 8, left: -15, bottom: 0 }} barCategoryGap="28%">
                        <CartesianGrid stroke="#34363b" strokeDasharray="3 5" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={14} />
                        <YAxis tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,.04)' }}
                          contentStyle={{ background: '#202124', border: '1px solid #45464b', borderRadius: 10, color: '#fff', fontSize: 11 }}
                          formatter={(value: number, name: string) => [name === 'revenue' ? `$${value.toFixed(2)}` : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                        />
                        <Bar dataKey="revenue" name="Revenue" fill="#c83220" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 pt-2 font-mono">
                  <span>Period revenue: ${salesInPeriod.toFixed(2)}</span>
                  <span>{ordersInPeriod} orders in selected period</span>
                </div>
              </div>

              {/* Order Status Distribution (4 cols) */}
              <div className="lg:col-span-4 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Order Status Pipeline
                </h3>

                <div className="space-y-3 pt-2 text-xs">
                  {[
                    { status: 'Artwork Prepress Review', count: orders.filter(o => o.status === 'artwork_review').length, color: 'bg-purple-500' },
                    { status: 'In Production (Printing)', count: orders.filter(o => o.status === 'in_production').length, color: 'bg-amber-500' },
                    { status: 'Shipped / Dispatched', count: orders.filter(o => o.status === 'shipped').length, color: 'bg-blue-500' },
                    { status: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: 'bg-emerald-500' },
                    { status: 'Pending / Verification', count: orders.filter(o => o.status === 'pending').length, color: 'bg-neutral-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-neutral-300">
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span>{item.status}</span>
                        </span>
                        <span className="font-mono font-bold text-white">{item.count}</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full ${item.color}`} 
                          style={{ width: `${Math.min(100, (item.count / Math.max(1, orders.length)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Recent Store Orders ({orders.slice(0, 5).length})
                </h3>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="text-xs text-rose-400 font-semibold hover:underline"
                >
                  View Full Orders Table →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 font-semibold border-b border-neutral-800 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Order #</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-900/40">
                        <td className="py-2.5 px-3 font-bold text-white">{order.orderNumber}</td>
                        <td className="py-2.5 px-3 font-sans text-neutral-300">{order.customerName}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                            order.status === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            order.status === 'shipped' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                            order.status === 'in_production' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-neutral-800 text-neutral-300'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-neutral-400 font-sans">{order.items.length} items</td>
                        <td className="py-2.5 px-3 font-bold text-white">${order.grandTotal.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-sans">
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="text-rose-400 hover:text-white font-semibold text-[11px]"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'website-editor' && (
          <div className="mx-auto max-w-6xl">
            <WebsiteContentEditor />
          </div>
        )}

        {adminTab === 'login-history' && (
          <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-400">Account activity</p>
                <h2 className="mt-1 text-lg font-bold text-white">Sign-in history</h2>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-neutral-400">
                  Recorded customer sign-ins from this browser’s saved activity log, newest first.
                </p>
              </div>
              <label className="block w-full sm:max-w-xs">
                <span className="sr-only">Search sign-in history</span>
                <input
                  type="search"
                  value={loginHistorySearch}
                  onChange={event => setLoginHistorySearch(event.target.value)}
                  placeholder="Search name or email"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Recorded sign-ins</p>
                <p className="mt-1 font-mono text-xl font-bold text-white">{loginHistory.length}</p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Customers in history</p>
                <p className="mt-1 font-mono text-xl font-bold text-white">{new Set(loginHistory.map(entry => entry.userId)).size}</p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Showing</p>
                <p className="mt-1 font-mono text-xl font-bold text-white">{Math.min(filteredLoginHistory.length, 100)} / {filteredLoginHistory.length}</p>
              </div>
            </div>

            {filteredLoginHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-700 px-5 py-12 text-center">
                <Users className="mx-auto h-7 w-7 text-neutral-500" />
                <p className="mt-3 text-sm font-semibold text-neutral-200">
                  {loginHistory.length ? 'No sign-ins match this search' : 'No sign-in history yet'}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {loginHistory.length ? 'Try another name or email address.' : 'Customer sign-ins will appear here when recorded.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full min-w-[620px] text-left text-xs">
                  <thead className="bg-neutral-900 text-[10px] uppercase tracking-wider text-neutral-500">
                    <tr>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Signed in</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredLoginHistory.slice(0, 100).map((entry, index) => (
                      <tr key={`${entry.userId}-${entry.at}-${index}`} className="text-neutral-300 hover:bg-neutral-900/60">
                        <td className="px-4 py-3 font-semibold text-white">{entry.name}</td>
                        <td className="px-4 py-3 font-mono text-neutral-400">{entry.email}</td>
                        <td className="px-4 py-3 text-neutral-400">{new Date(entry.at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* 2. ORDERS MANAGEMENT */}
        {adminTab === 'orders' && (
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Order Management & Prepress Queue ({filteredOrders.length})
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">Filter, inspect artwork configs, update status, and print packing slips.</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by order # or customer..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="artwork_review">Artwork Review</option>
                  <option value="in_production">In Production</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Full Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 font-semibold border-b border-neutral-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Tracking</th>
                    <th className="py-3 px-3">Grand Total</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 font-mono">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-3 font-bold text-white">{order.orderNumber}</td>
                      <td className="py-3 px-3 text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className="font-semibold text-neutral-200 block">{order.customerName}</span>
                        <span className="text-[11px] text-neutral-500 font-mono">{order.customerEmail}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                          order.status === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          order.status === 'shipped' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                          order.status === 'in_production' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          order.status === 'artwork_review' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                          order.status === 'refunded' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          'bg-neutral-800 text-neutral-300'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {order.trackingNumber ? (
                          <span className="text-neutral-300 font-mono text-[11px]">{order.trackingNumber}</span>
                        ) : (
                          <span className="text-neutral-600 font-sans italic text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">${order.grandTotal.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-sans space-x-2">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[11px] font-semibold"
                          title="View order details"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleOpenStatusModal(order)}
                          className="px-2 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-300 rounded text-[11px] font-semibold border border-rose-800/60"
                        >
                          Status
                        </button>
                        <button
                          onClick={() => setPackingSlipOrder(order)}
                          className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px] font-semibold"
                          title="Print packing slip"
                        >
                          Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PRODUCT MANAGEMENT */}
        {adminTab === 'products' && (
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Product Catalog & SKU Management ({products.length})
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">Manage base prices, volume discount tiers, and product publication.</p>
              </div>

              <button
                onClick={() => handleOpenProductModal()}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 font-semibold border-b border-neutral-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Stock on Hand</th>
                    <th className="py-3 px-3">Tiers</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 font-mono">
                  {products.map((p) => {
                    const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                    return (
                      <tr key={p.id} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-3 font-sans font-semibold text-white flex items-center gap-2.5">
                          <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover border border-neutral-800 shrink-0" />
                          <span className="truncate max-w-xs">{p.name}</span>
                        </td>
                        <td className="py-3 px-3 text-neutral-400 uppercase text-[11px] font-sans">{p.category}</td>
                        <td className="py-3 px-3 font-bold text-white">${p.price.toFixed(2)}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                            totalStock > 20 ? 'bg-emerald-950 text-emerald-400' :
                            totalStock > 0 ? 'bg-amber-950 text-amber-400' :
                            'bg-rose-950 text-rose-400'
                          }`}>
                            {totalStock > 0 ? `${totalStock} units` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-neutral-400">{p.volumeTiers.length} tiers</td>
                        <td className="py-3 px-3 text-right font-sans space-x-2">
                          <button
                            onClick={() => handleOpenProductModal(p)}
                            className="p-1 text-neutral-400 hover:text-white rounded"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5 inline" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1 text-rose-400 hover:text-rose-300 rounded"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3B. MENU HEADERS & MEGA-MENU NAVIGATION MANAGER */}
        {adminTab === 'menu-manager' && (() => {
          const activeHeader = menuHeaders.find(h => h.id === selectedHeaderId) || menuHeaders[0];
          const activeTab = activeHeader?.tabs.find(t => t.id === selectedTabId) || activeHeader?.tabs[0];

          return (
            <div className="space-y-6">
              {/* Header Strip with Action Controls */}
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <span>Menu Headers & Hover Mega-Menu Manager</span>
                    <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded-full font-mono">
                      LIVE STORE SYNC
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
                    Edit, add, or remove navigation menu buttons, category dropdowns, sub-tabs, and small product pictures. All changes immediately update the customer-facing top navigation bar and mega-menus.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      if (confirm('Reset all menu headers, sub-tabs, and product items back to the factory default configuration?')) {
                        resetMenuHeadersToDefault();
                      }
                    }}
                    className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold border border-neutral-700 transition-colors flex items-center gap-1.5"
                    title="Restore default navigation structure"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Reset to Defaults</span>
                  </button>

                  <button
                    onClick={() => handleOpenHeaderModal()}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Menu Header</span>
                  </button>
                </div>
              </div>

              {/* Two-Column Editor Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Menu Headers List (4 cols) */}
                <div className="lg:col-span-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block px-2">
                    Store Menu Headers ({menuHeaders.length})
                  </span>

                  <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                    {menuHeaders.map((header) => {
                      const isSelected = (activeHeader?.id === header.id);
                      const totalItems = header.tabs.reduce((sum, t) => sum + t.items.length, 0);

                      return (
                        <div
                          key={header.id}
                          onClick={() => {
                            setSelectedHeaderId(header.id);
                            if (header.tabs[0]) setSelectedTabId(header.tabs[0].id);
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-neutral-900 border-sky-500/80 shadow-md ring-1 ring-sky-500/50'
                              : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-white block truncate">
                              {header.label}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono block mt-0.5">
                              {header.tabs.length} Tab{header.tabs.length > 1 ? 's' : ''} · {totalItems} Product{totalItems > 1 ? 's' : ''}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenHeaderModal(header);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                              title="Edit Header Label & Banner"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {menuHeaders.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete menu header "${header.label}" and all its dropdown items?`)) {
                                    deleteMenuHeader(header.id);
                                  }
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-neutral-800"
                                title="Delete Menu Header"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Tab and Items Manager (8 cols) */}
                <div className="lg:col-span-8 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                  {activeHeader ? (
                    <>
                      {/* Active Header Title & Banner Summary */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-white">
                              {activeHeader.label}
                            </h3>
                            {activeHeader.category && (
                              <span className="text-[10px] bg-neutral-800 text-sky-400 px-2 py-0.5 rounded font-mono uppercase">
                                {activeHeader.category}
                              </span>
                            )}
                          </div>
                          {activeHeader.bannerText && (
                            <p className="text-[11px] text-neutral-400 mt-1">
                              Footer Strip: <span className="text-neutral-300 font-medium">"{activeHeader.bannerText}"</span> · CTA: <span className="text-sky-400 font-semibold">{activeHeader.bannerButtonText || 'View'}</span>
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenHeaderModal(activeHeader)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Edit Header & Banner</span>
                        </button>
                      </div>

                      {/* Sub-tabs strip */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                            Menu Sub-Tabs:
                          </span>
                          <button
                            onClick={() => {
                              const tabName = prompt('Enter name for new sub-tab:');
                              if (tabName && tabName.trim()) {
                                const newTabId = `tab-${Date.now()}`;
                                const updatedHeader: MenuHeaderConfig = {
                                  ...activeHeader,
                                  tabs: [
                                    ...activeHeader.tabs,
                                    {
                                      id: newTabId,
                                      tabName: tabName.trim(),
                                      items: [
                                        {
                                          id: `item-${Date.now()}`,
                                          name: `${tabName.trim()} Item 1`,
                                          imageUrl: IMAGE_PRESETS[0].url,
                                          tag: 'NEW',
                                          targetView: 'catalog'
                                        }
                                      ]
                                    }
                                  ]
                                };
                                updateMenuHeader(updatedHeader);
                                setSelectedTabId(newTabId);
                              }
                            }}
                            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add New Sub-Tab</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {activeHeader.tabs.map((tab) => {
                            const isCurrentTab = (activeTab?.id === tab.id);
                            return (
                              <button
                                key={tab.id}
                                onClick={() => setSelectedTabId(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                                  isCurrentTab
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                                }`}
                              >
                                <span>{tab.tabName}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                  isCurrentTab ? 'bg-rose-950/80 text-rose-200' : 'bg-neutral-800 text-neutral-400'
                                }`}>
                                  {tab.items.length}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Products / Items Grid for Current Tab */}
                      {activeTab && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                                Products in "{activeTab.tabName}" ({activeTab.items.length})
                              </h4>
                              <p className="text-[11px] text-neutral-400">
                                Real product photos shown on mouse hover dropdown menu (no emojis, no prices).
                              </p>
                            </div>

                            <button
                              onClick={() => handleOpenItemModal()}
                              className="px-3.5 py-1.5 bg-[#0084ff] hover:bg-[#0070da] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Product Item</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {activeTab.items.map((item) => (
                              <div
                                key={item.id}
                                className="bg-neutral-900/70 rounded-xl p-3 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-between gap-3 group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-neutral-700 shrink-0 group-hover:scale-105 transition-transform"
                                  />
                                  <div className="min-w-0">
                                    <span className="font-bold text-xs text-white block truncate">
                                      {item.name}
                                    </span>
                                    {item.tag && (
                                      <span className="text-[10px] font-bold text-sky-400 block truncate">
                                        {item.tag}
                                      </span>
                                    )}
                                    {item.description && (
                                      <span className="text-[10px] text-neutral-400 block truncate">
                                        {item.description}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleOpenItemModal(item)}
                                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                                    title="Edit Product Item & Picture"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Remove "${item.name}" from menu?`)) {
                                        deleteMenuItem(activeHeader.id, activeTab.id, item.id);
                                      }
                                    }}
                                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-neutral-800"
                                    title="Delete Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-12 text-center text-neutral-500">
                      Select or create a menu header from the left sidebar.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 3C. MEDIA ASSETS & SHOWCASE VIDEOS MANAGER */}
        {adminTab === 'media-manager' && (
          <div className="space-y-8">
            {/* Top Bar */}
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                  <span>Product Demonstration Videos & Media Assets</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    {videos.length} TUTORIALS ACTIVE
                  </span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
                  Manage commercial heat press tutorials, peel demonstrations, and durability videos shown on the storefront. Add new videos or edit titles, thumbnails, and step checklists.
                </p>
              </div>

              <button
                onClick={() => handleOpenVideoModal()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Showcase Video</span>
              </button>
            </div>

            {/* Videos Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                Storefront Demonstration Videos ({videos.length})
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      {/* Video Thumbnail */}
                      <div className="relative aspect-16/9 bg-neutral-900 overflow-hidden">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button
                            onClick={() => setPreviewingVideo(vid)}
                            className="w-12 h-12 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center hover:scale-110 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
                            title="Play Video Preview"
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </button>
                        </div>
                        <span className="absolute top-2.5 right-2.5 bg-black/80 font-mono text-[10px] text-white px-2 py-0.5 rounded">
                          {vid.duration}
                        </span>
                        <span className="absolute top-2.5 left-2.5 bg-rose-600 text-[9px] font-black uppercase text-white px-2 py-0.5 rounded">
                          {vid.tag}
                        </span>
                      </div>

                      {/* Video Content Details */}
                      <div className="p-4 space-y-1.5">
                        <h3 className="font-bold text-white text-xs leading-snug line-clamp-2">
                          {vid.title}
                        </h3>
                        {vid.subtitle && (
                          <p className="text-[11px] text-neutral-400 line-clamp-1">
                            {vid.subtitle}
                          </p>
                        )}
                        {vid.productName && (
                          <div className="pt-1 text-[11px] font-semibold text-sky-400">
                            Linked: {vid.productName}
                          </div>
                        )}
                        {vid.steps && vid.steps.length > 0 && (
                          <div className="text-[10px] text-neutral-500 font-mono pt-1">
                            {vid.steps.length} application steps documented
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-4 pt-2 border-t border-neutral-900 flex items-center justify-between">
                      <button
                        onClick={() => setPreviewingVideo(vid)}
                        className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 text-sky-400" />
                        <span>Preview Player</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenVideoModal(vid)}
                          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                          title="Edit Video"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete video "${vid.title}"?`)) {
                              deleteVideo(vid.id);
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-neutral-800"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Resolution Storefront Photographic Assets Gallery */}
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Commercial Photographic Assets Preset Library ({IMAGE_PRESETS.length})
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Crisp commercial photography on clean backgrounds. Click "Copy URL" on any photo to use it in any product, category banner, or mega-menu item.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {IMAGE_PRESETS.map((preset, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 flex flex-col justify-between group hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      <div className="relative aspect-square bg-neutral-950 overflow-hidden">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-[9px] font-mono font-bold text-white px-1.5 py-0.5 rounded">
                          {preset.category}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <span className="text-xs font-bold text-white block line-clamp-1">
                          {preset.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 pt-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(preset.url);
                          setCopiedPresetUrl(preset.url);
                          setTimeout(() => setCopiedPresetUrl(null), 2000);
                        }}
                        className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${
                          copiedPresetUrl === preset.url
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
                        }`}
                      >
                        {copiedPresetUrl === preset.url ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {adminTab === 'inventory' && (
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Live Inventory Ledger & Physical Stock Movements
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Auditable record of every stock adjustment, purchase order intake, and sales deduction.</p>
            </div>

            {/* Stock Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 font-semibold border-b border-neutral-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Product / SKU</th>
                    <th className="py-3 px-3">Current Balance</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Adjustment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 font-mono">
                  {products.map((p) => {
                    const firstVariant = p.variants[0];
                    const stock = firstVariant ? firstVariant.stock : 999;
                    return (
                      <tr key={p.id} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-3 font-sans">
                          <span className="font-semibold text-white block">{p.name}</span>
                          <span className="text-[11px] text-neutral-500 font-mono">{firstVariant?.sku || 'SKU-NONE'}</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-white text-sm">{stock} units</td>
                        <td className="py-3 px-3 font-sans">
                          {stock < 20 ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                              <AlertCircle className="w-3.5 h-3.5" /> Low Stock Threshold
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy Balance
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-sans">
                          <button
                            onClick={() => {
                              setStockModalProduct(p);
                              setStockDelta(10);
                            }}
                            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-semibold border border-neutral-700"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Movement Logs */}
            <div className="pt-4 border-t border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Recent Stock Movements ({stockMovements.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs text-neutral-300 pr-2">
                {stockMovements.map((mov) => (
                  <div key={mov.id} className="p-2 bg-neutral-900/60 rounded border border-neutral-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{mov.productName}</span>
                      <span className="text-neutral-500 text-[11px] ml-2">Reason: {mov.reason} ({mov.staffUser})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${mov.quantityChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange} units
                      </span>
                      <span className="text-neutral-500 text-[10px]">Bal: {mov.newBalance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. CUSTOMER MANAGEMENT */}
        {adminTab === 'customers' && (
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Customer Directory & Lifetime Value ({customers.length})
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">Commercial apparel brands, screen printers, and repeat customer accounts.</p>
              </div>

              <button
                onClick={exportCustomersCSV}
                className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold border border-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <FileDown className="w-4 h-4 text-rose-400" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 font-semibold border-b border-neutral-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Total Orders</th>
                    <th className="py-3 px-3">Lifetime Value</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 font-mono">
                  {customers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-3 font-sans">
                        <span className="font-bold text-white block">{cust.fullName}</span>
                        <span className="text-[11px] text-neutral-500 font-mono">{cust.id}</span>
                      </td>
                      <td className="py-3 px-3 text-neutral-300">
                        <span>{cust.email}</span>
                        <span className="block text-[11px] text-neutral-500">{cust.phone}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">{cust.ordersCount} orders</td>
                      <td className="py-3 px-3 font-bold text-rose-400 text-sm">${cust.totalSpent.toFixed(2)}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                          {cust.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. FINANCIAL LEDGER */}
        {adminTab === 'transactions' && (
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Order payment status
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">No payment processor is connected. Demo previews remain pending and do not generate settlements.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">Paid order records</span>
                <span className="font-mono text-xl font-black text-white block">${grossSales.toFixed(2)}</span>
              </div>
              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">Pending order previews</span>
                <span className="font-mono text-xl font-black text-neutral-200 block">
                  {orders.filter(order => order.paymentStatus === 'pending').length}
                </span>
              </div>
              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">Settlement total</span>
                <span className="font-mono text-xl font-black text-emerald-400 block">
                  ${grossSales.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-900 text-neutral-400 font-semibold border-b border-neutral-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Order record</th>
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Payment status</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3">Preview total</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {orders.map((o) => {
                    return (
                      <tr key={o.id} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-3 text-neutral-400">{o.id.slice(-8)}</td>
                        <td className="py-3 px-3 font-bold text-white">{o.orderNumber}</td>
                        <td className="py-3 px-3 text-amber-300">{o.paymentStatus === 'paid' ? 'Paid record' : 'Pending · no charge'}</td>
                        <td className="py-3 px-3 text-neutral-300 font-sans">{o.paymentMethod}</td>
                        <td className="py-3 px-3 font-bold text-white">${o.grandTotal.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-sans">
                          {o.status === 'refunded' ? (
                            <span className="text-rose-400 font-semibold text-[11px]">Refunded</span>
                          ) : o.paymentStatus === 'paid' ? (
                            <button
                              onClick={() => setRefundModalOrder(o)}
                              className="px-2 py-1 bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 text-neutral-400 rounded text-[11px] font-semibold transition-colors"
                            >
                              Issue Refund
                            </button>
                          ) : <span className="text-neutral-500">Unavailable</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. COUPONS MANAGEMENT */}
        {adminTab === 'coupons' && (
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Active Coupons & Promotional Codes ({coupons.length})
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">Manage store discounts, minimum spend thresholds, and usage redemptions.</p>
              </div>

              <button
                onClick={() => setCouponModalOpen(true)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-900 text-neutral-400 font-semibold border-b border-neutral-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Coupon Code</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Discount Value</th>
                    <th className="py-3 px-3">Min Order</th>
                    <th className="py-3 px-3">Usage Count</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-3 font-bold text-white text-sm">{c.code}</td>
                      <td className="py-3 px-3 uppercase text-neutral-400 text-[11px]">{c.discountType}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue.toFixed(2)} OFF`}
                      </td>
                      <td className="py-3 px-3 text-neutral-300">${c.minOrderValue.toFixed(2)}</td>
                      <td className="py-3 px-3 text-white">{c.usageCount} used</td>
                      <td className="py-3 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. AUDIT LOGS */}
        {adminTab === 'audit' && (
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Enterprise System Audit Trail ({auditLogs.length})
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Immutable activity stream tracking orders, stock adjustments, product updates, and refunds.</p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-xs pr-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400">{log.action}</span>
                      <span className="text-neutral-500 text-[11px]">[{log.entityType.toUpperCase()}: {log.entityId}]</span>
                    </div>
                    <p className="text-neutral-300 font-sans text-xs mt-1">{log.details}</p>
                  </div>
                  <div className="text-right text-[10px] text-neutral-500 shrink-0">
                    <div>{log.actor}</div>
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: Update Order Status Modal */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold uppercase tracking-wider text-white text-sm">
                Update Order {statusModalOrder.orderNumber}
              </h3>
              <button onClick={() => setStatusModalOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1.5">Fulfillment Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="pending">Pending</option>
                <option value="artwork_review">Artwork Prepress Review</option>
                <option value="in_production">In Production (Roll Printing)</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1.5">Carrier Tracking Number:</label>
              <input
                type="text"
                placeholder="e.g. 1Z9999999238491823"
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setStatusModalOrder(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Refund Order Modal */}
      {refundModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold uppercase tracking-wider text-rose-400 text-sm">
                Issue Refund for {refundModalOrder.orderNumber}
              </h3>
              <button onClick={() => setRefundModalOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-neutral-300">
              This will refund <strong>${refundModalOrder.grandTotal.toFixed(2)}</strong> to {refundModalOrder.customerName} via the payment provider.
            </p>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1.5">Refund Reason *</label>
              <input
                type="text"
                required
                placeholder="e.g. Customer cancelled before print run / Low resolution artwork"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setRefundModalOrder(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={!refundReason.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider disabled:opacity-50"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Stock Adjustment Modal */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold uppercase tracking-wider text-white text-sm">
                Adjust Physical Stock
              </h3>
              <button onClick={() => setStockModalProduct(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-neutral-300 font-semibold">{stockModalProduct.name}</p>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1.5">Adjustment Quantity (+ to add, - to deduct):</label>
              <input
                type="number"
                value={stockDelta}
                onChange={(e) => setStockDelta(parseInt(e.target.value) || 0)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1.5">Reason for Stock Change:</label>
              <select
                value={stockReason}
                onChange={(e) => setStockReason(e.target.value as any)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="restock">Purchase Order Restock Received</option>
                <option value="adjustment">Cycle Count Manual Adjustment</option>
                <option value="damaged">Damaged / Scrapped Materials</option>
                <option value="return">Customer Return Restocked</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setStockModalProduct(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStockAdjustment}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider"
              >
                Update Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Product Add/Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold uppercase tracking-wider text-white text-sm">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button type="button" onClick={() => setProductModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={prodFormName}
                onChange={(e) => setProdFormName(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                <select
                  value={prodFormCategory}
                  onChange={(e) => setProdFormCategory(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="dtf-transfers">DTF Transfers</option>
                  <option value="gang-sheets">Gang Sheets</option>
                  <option value="uv-dtf">UV DTF Stickers</option>
                  <option value="blank-apparel">Blank Apparel</option>
                  <option value="supplies">Supplies & Presses</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Base Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={prodFormPrice}
                  onChange={(e) => setProdFormPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Product Image Selection & Presets */}
            <div className="space-y-2">
              <label className="block text-neutral-300 font-semibold mb-1">Product Photo / Thumbnail</label>
              <div className="flex items-center gap-3">
                <img
                  src={prodFormImage || IMAGE_PRESETS[0].url}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-neutral-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Enter image URL or pick preset below"
                    value={prodFormImage}
                    onChange={(e) => setProdFormImage(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white font-mono text-[11px] focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Pick a high-definition preset photo below:
                  </span>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProdFormImage(preset.url)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border shrink-0 transition-transform ${
                      prodFormImage === preset.url ? 'ring-2 ring-rose-500 scale-105 border-white' : 'border-neutral-700 opacity-60 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Stock on Hand</label>
              <input
                type="number"
                value={prodFormStock}
                onChange={(e) => setProdFormStock(parseInt(e.target.value) || 0)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Short Description</label>
              <textarea
                rows={2}
                value={prodFormDesc}
                onChange={(e) => setProdFormDesc(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4B: Menu Header Add/Edit Modal */}
      {headerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveHeader} className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold uppercase tracking-wider text-white text-sm">
                {editingHeader ? `Edit Header: ${editingHeader.label}` : 'Add Menu Header'}
              </h3>
              <button type="button" onClick={() => setHeaderModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Menu Header Label *</label>
              <input
                type="text"
                required
                placeholder="e.g. DTF Transfers, UV Decals, Supplies"
                value={headerFormLabel}
                onChange={(e) => setHeaderFormLabel(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Category Link</label>
              <select
                value={headerFormCategory}
                onChange={(e) => setHeaderFormCategory(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="dtf-transfers">DTF Transfers</option>
                <option value="gang-sheets">Gang Sheets</option>
                <option value="uv-dtf">UV DTF Stickers</option>
                <option value="patches-stickers">Patches & Stickers</option>
                <option value="blank-apparel">Blank Apparel</option>
                <option value="supplies">Supplies & Presses</option>
                <option value="sample-packs">Sample Packs</option>
                <option value="tools">Support & Tools</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Mega-Menu Display Style</label>
              <select
                value={headerFormDisplayType}
                onChange={(e) => setHeaderFormDisplayType(e.target.value as any)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="media-grid">Product Photos Grid (Images, No Prices)</option>
                <option value="text-links">Text-Only Clickable Links (Clean Columns, No Pics - e.g. Blank Apparel & Support)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Bottom Banner Bar Text</label>
              <input
                type="text"
                placeholder="e.g. Free 2-Day Air on Orders Over $75"
                value={headerFormBannerText}
                onChange={(e) => setHeaderFormBannerText(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Banner Button Text</label>
                <input
                  type="text"
                  placeholder="e.g. View All Transfers"
                  value={headerFormBannerBtnText}
                  onChange={(e) => setHeaderFormBannerBtnText(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Banner Button Category</label>
                <select
                  value={headerFormBannerBtnCat}
                  onChange={(e) => setHeaderFormBannerBtnCat(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="dtf-transfers">DTF Transfers</option>
                  <option value="gang-sheets">Gang Sheets</option>
                  <option value="uv-dtf">UV DTF</option>
                  <option value="patches-stickers">Patches</option>
                  <option value="blank-apparel">Blanks</option>
                  <option value="supplies">Supplies</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setHeaderModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider"
              >
                Save Header
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4C: Menu Item Add/Edit Modal */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveItem} className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold uppercase tracking-wider text-white text-sm">
                {editingMenuItem ? `Edit Menu Item: ${editingMenuItem.name}` : 'Add Product to Menu'}
              </h3>
              <button type="button" onClick={() => setItemModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Product Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Standard DTF Heat Transfers"
                value={itemFormName}
                onChange={(e) => setItemFormName(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Photo Selection with Presets */}
            <div className="space-y-2">
              <label className="block text-neutral-300 font-semibold mb-1">Small Product Photo (No Emojis)</label>
              <div className="flex items-center gap-3">
                <img
                  src={itemFormImage || IMAGE_PRESETS[0].url}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={itemFormImage}
                    onChange={(e) => setItemFormImage(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white font-mono text-[11px] focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">Pick from real photos below:</span>
                </div>
              </div>

              {/* Presets Horizontal Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setItemFormImage(preset.url)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border shrink-0 transition-transform ${
                      itemFormImage === preset.url ? 'ring-2 ring-sky-500 scale-105 border-white' : 'border-neutral-700 opacity-60 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Column Group / Heading (for Text Menus)</label>
              <input
                type="text"
                placeholder="e.g. T-Shirts & Tops, Fleece, Pressing & Instructions"
                value={itemFormColumnGroup}
                onChange={(e) => setItemFormColumnGroup(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-neutral-400 mt-0.5 block">Used to organize clickable links into neat columns in text-only menus.</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Tag / Highlight Badge</label>
                <input
                  type="text"
                  placeholder="e.g. HOT SELLER, NEW"
                  value={itemFormTag}
                  onChange={(e) => setItemFormTag(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Target View</label>
                <select
                  value={itemFormTargetView}
                  onChange={(e) => setItemFormTargetView(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="catalog">Catalog</option>
                  <option value="custom-dtf">Custom DTF Builder</option>
                  <option value="gang-sheet-builder">Gang Sheet Builder</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Target Category (if Catalog)</label>
              <select
                value={itemFormTargetCat}
                onChange={(e) => setItemFormTargetCat(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="dtf-transfers">DTF Transfers</option>
                <option value="gang-sheets">Gang Sheets</option>
                <option value="uv-dtf">UV DTF</option>
                <option value="patches-stickers">Patches & Stickers</option>
                <option value="blank-apparel">Blank Apparel</option>
                <option value="supplies">Supplies</option>
                <option value="sample-packs">Sample Kits</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Short Description</label>
              <input
                type="text"
                placeholder="e.g. Vibrant full color, no weeding"
                value={itemFormDesc}
                onChange={(e) => setItemFormDesc(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setItemModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider"
              >
                Save Menu Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4D: Showcase Video Add/Edit Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveVideo} className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold uppercase tracking-wider text-white text-sm">
                {editingVideo ? `Edit Video: ${editingVideo.title}` : 'Add Showcase Video'}
              </h3>
              <button type="button" onClick={() => setVideoModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Video Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 10-Second Heat Press Sequence & Peel"
                value={videoFormTitle}
                onChange={(e) => setVideoFormTitle(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Subtitle / Summary</label>
              <input
                type="text"
                placeholder="e.g. Watch instant warm peel on heavyweight black hoodie"
                value={videoFormSubtitle}
                onChange={(e) => setVideoFormSubtitle(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 0:45"
                  value={videoFormDuration}
                  onChange={(e) => setVideoFormDuration(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. PRESS TUTORIAL, LAB TEST"
                  value={videoFormTag}
                  onChange={(e) => setVideoFormTag(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Thumbnail Selection with Presets */}
            <div className="space-y-2">
              <label className="block text-neutral-300 font-semibold mb-1">Video Thumbnail Image</label>
              <div className="flex items-center gap-3">
                <img
                  src={videoFormThumbnail || IMAGE_PRESETS[0].url}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-neutral-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Thumbnail URL"
                    value={videoFormThumbnail}
                    onChange={(e) => setVideoFormThumbnail(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white font-mono text-[11px] focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">Pick from real photo presets below:</span>
                </div>
              </div>

              {/* Presets Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setVideoFormThumbnail(preset.url)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border shrink-0 transition-transform ${
                      videoFormThumbnail === preset.url ? 'ring-2 ring-rose-500 scale-105 border-white' : 'border-neutral-700 opacity-60 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Linked Product Name</label>
              <input
                type="text"
                placeholder="e.g. Custom DTF Heat Transfers by Size"
                value={videoFormProdName}
                onChange={(e) => setVideoFormProdName(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Full Description</label>
              <textarea
                rows={2}
                placeholder="Detailed description of temperature, pressure, peel sequence, etc."
                value={videoFormDesc}
                onChange={(e) => setVideoFormDesc(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Step-by-Step Checklist (One per line)</label>
              <textarea
                rows={3}
                placeholder="Pre-press garment 3s to remove moisture&#10;Press 12s at 305°F&#10;Warm peel in one smooth motion"
                value={videoFormSteps}
                onChange={(e) => setVideoFormSteps(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider"
              >
                Save Video
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4E: Live Video Player Preview in Admin */}
      {previewingVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewingVideo(null)}
        >
          <div 
            className="bg-neutral-950 rounded-2xl max-w-2xl w-full overflow-hidden border border-neutral-800 shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  {previewingVideo.tag}
                </span>
                <span className="font-bold text-xs truncate max-w-sm">
                  {previewingVideo.title}
                </span>
              </div>
              <button onClick={() => setPreviewingVideo(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-16/9 bg-neutral-900 flex items-center justify-center">
              <img
                src={previewingVideo.thumbnailUrl}
                alt={previewingVideo.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-xl">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 bg-black/80 font-mono text-xs text-white px-2 py-1 rounded">
                Duration: {previewingVideo.duration}
              </span>
            </div>

            <div className="p-4 bg-neutral-900 space-y-2">
              <p className="text-xs text-neutral-300">{previewingVideo.description}</p>
              {previewingVideo.steps && (
                <div className="space-y-1 pt-2 border-t border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Application Sequence:</span>
                  {previewingVideo.steps.map((st: string, i: number) => (
                    <div key={i} className="text-[11px] text-neutral-300 flex items-center gap-2">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Order Details Drawer */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-bold uppercase tracking-wider text-white text-base">
                  Order Details: {selectedOrderDetails.orderNumber}
                </h3>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Placed {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div>
                <span className="text-neutral-500 uppercase font-semibold text-[10px] block">Customer Details</span>
                <p className="font-bold text-white mt-1">{selectedOrderDetails.customerName}</p>
                <p className="text-neutral-400 font-mono">{selectedOrderDetails.customerEmail}</p>
                <p className="text-neutral-400 font-mono">{selectedOrderDetails.shippingAddress.phone}</p>
              </div>

              <div>
                <span className="text-neutral-500 uppercase font-semibold text-[10px] block">Shipping Address</span>
                <p className="text-neutral-300 mt-1">{selectedOrderDetails.shippingAddress.addressLine1}</p>
                <p className="text-neutral-300">
                  {selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state} {selectedOrderDetails.shippingAddress.postalCode}
                </p>
                <p className="text-neutral-500">{selectedOrderDetails.shippingAddress.country}</p>
              </div>
            </div>

            {/* Items with custom config preview */}
            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-neutral-400 text-[11px] block">Order Items</span>
              <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
                {selectedOrderDetails.items.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.image} alt="" className="w-12 h-12 rounded object-cover border border-neutral-800 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{item.productName}</span>
                        {item.variantName && <span className="text-[11px] text-neutral-400 block">{item.variantName}</span>}
                        {item.customConfig?.artfileName && (
                          <span className="text-[10px] text-rose-400 font-mono block">
                            Artwork: {item.customConfig.artfileName} ({item.customConfig.artworkDpi || 300} DPI)
                          </span>
                        )}
                        {item.gangSheetConfig && (
                          <span className="text-[10px] text-emerald-400 font-mono block">
                            Gang Sheet: {item.gangSheetConfig.elements.length} designs placed ({item.gangSheetConfig.totalAreaUsedPercentage}% roll utilized)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right font-mono shrink-0">
                      <span className="font-bold text-white block">${item.totalPrice.toFixed(2)}</span>
                      <span className="text-[11px] text-neutral-400">{item.quantity}x @ ${item.unitPrice.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1.5 font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span>${selectedOrderDetails.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrderDetails.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({selectedOrderDetails.couponCode}):</span>
                  <span>-${selectedOrderDetails.discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Shipping:</span>
                <span>${selectedOrderDetails.shippingTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Tax:</span>
                <span>${selectedOrderDetails.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                <span>Grand Total:</span>
                <span className="text-rose-400">${selectedOrderDetails.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-neutral-800 text-neutral-200 rounded-lg font-semibold hover:bg-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Packing Slip Print Modal */}
      {packingSlipOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-2xl max-w-xl w-full p-8 shadow-2xl space-y-6 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-gradient-to-tr from-sky-500 via-indigo-600 to-rose-500 text-white font-black flex items-center justify-center">A</div>
                <span className="font-black text-sm uppercase">Ambalvee Transfers Packing Slip</span>
              </div>
              <button onClick={() => setPackingSlipOrder(null)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Ship To:</span>
                <p className="font-bold text-neutral-900 mt-1">{packingSlipOrder.shippingAddress.fullName}</p>
                <p>{packingSlipOrder.shippingAddress.addressLine1}</p>
                <p>{packingSlipOrder.shippingAddress.city}, {packingSlipOrder.shippingAddress.state} {packingSlipOrder.shippingAddress.postalCode}</p>
              </div>

              <div>
                <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Order Info:</span>
                <p className="font-mono font-bold mt-1">Order: {packingSlipOrder.orderNumber}</p>
                <p className="font-mono text-neutral-600">Date: {new Date(packingSlipOrder.createdAt).toLocaleDateString()}</p>
                <p className="font-mono text-neutral-600">Method: {packingSlipOrder.shippingMethod}</p>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-neutral-100 border-b border-neutral-200 text-[10px] font-bold uppercase text-neutral-600">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Prepress Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {packingSlipOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5">
                        <span className="font-bold block">{item.productName}</span>
                        {item.variantName && <span className="text-neutral-500 text-[11px] block">{item.variantName}</span>}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono text-emerald-700">✓ PASSED</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-500 italic">Ambalvee Transfers · 15 Sec Press @ 305°F</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-bold flex items-center gap-1.5 hover:bg-neutral-800"
              >
                <Printer className="w-4 h-4" />
                <span>Print Packing Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
