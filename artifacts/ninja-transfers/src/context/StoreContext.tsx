import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetAdminSessionQueryKey,
  getGetAdminStoreStateQueryKey,
  getGetStorefrontStateQueryKey,
  useGetAdminSession,
  useGetAdminStoreState,
  useGetStorefrontState,
  useLoginAdmin as useLoginAdminMutation,
  useLogoutAdmin as useLogoutAdminMutation,
  useSaveAdminStoreState
} from '@workspace/api-client-react';
import {
  Product,
  Order,
  CartItem,
  Customer,
  StockMovement,
  DiscountCoupon,
  AuditLog,
  CategoryId,
  OrderStatus,
  CustomTransferConfig,
  GangSheetConfig,
  ShippingAddress,
  UserAccount,
  MenuItem,
  MenuTabGroup,
  MenuHeaderConfig,
  ShowcaseVideo
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MENU_HEADERS,
  INITIAL_SHOWCASE_VIDEOS,
  LocalStoreManager
} from '../data/mockStore';
import {
  DEFAULT_WEBSITE_SETTINGS,
  LoginEvent,
  WebsiteSettings
} from '../data/websiteSettings';

export type ActiveView = 
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'custom-dtf'
  | 'gang-sheet-builder'
  | 'account'
  | 'admin'
  | 'order-success';

export type AdminTab = 
  | 'overview'
  | 'website-editor'
  | 'login-history'
  | 'orders'
  | 'products'
  | 'menu-manager'
  | 'media-manager'
  | 'inventory'
  | 'customers'
  | 'transactions'
  | 'coupons'
  | 'audit';

const DEFAULT_USERS: UserAccount[] = [];

interface StoreContextType {
  // Navigation & View
  view: ActiveView;
  setView: (v: ActiveView) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  catalogCategory: CategoryId | 'all';
  setCatalogCategory: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  chatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
  chatbotInitialPrompt: string;
  setChatbotInitialPrompt: (prompt: string) => void;

  // User Authentication
  currentUser: UserAccount | null;
  loginEvents: LoginEvent[];
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  checkoutLoginRequired: boolean;
  clearCheckoutLoginRequirement: () => void;
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  registerUser: (name: string, email: string, password: string) => { success: boolean; error?: string };
  loginUser: (email: string, password: string) => { success: boolean; error?: string };
  logoutUser: () => void;

  // Storefront content controls
  websiteSettings: WebsiteSettings;
  updateWebsiteSettings: (updates: Partial<WebsiteSettings>) => void;
  adminStoreSaveState: 'idle' | 'saving' | 'saved' | 'error';

  // Admin Authentication
  isAdminAuthenticated: boolean;
  isAdminSessionLoading: boolean;
  isAdminDataLoading: boolean;
  adminDataLoadError: string | null;
  retryAdminDataLoad: () => void;
  loginAdmin: (
    email: string,
    password: string,
    captchaId: string,
    captchaAnswer: string
  ) => Promise<{ success: boolean; error?: string; retryAfterSeconds?: number }>;
  logoutAdmin: () => void;
  loginHistory: Array<{ userId: string; name: string; email: string; at: string }>;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Coupon / Promo
  coupons: DiscountCoupon[];
  appliedCoupon: DiscountCoupon | null;
  couponError: string | null;
  applyCouponCode: (code: string) => boolean;
  removeCoupon: () => void;
  discountAmount: number;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: ShippingAddress, shippingMethod: string, paymentMethod: string, notes?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string) => void;
  refundOrder: (orderId: string, reason: string) => void;

  // Inventory
  stockMovements: StockMovement[];
  adjustStock: (productId: string, variantId: string | undefined, delta: number, reason: StockMovement['reason'], staffUser: string) => void;

  // Customers & Legacy Customer State
  customers: Customer[];
  currentCustomer: Customer | null;
  setCurrentCustomer: (c: Customer | null) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => void;

  // Replaceable Menu Headers & Items
  menuHeaders: MenuHeaderConfig[];
  updateMenuHeader: (header: MenuHeaderConfig) => void;
  addMenuHeader: (header: MenuHeaderConfig) => void;
  deleteMenuHeader: (id: string) => void;
  updateMenuItem: (headerId: string, tabId: string, item: MenuItem) => void;
  addMenuItem: (headerId: string, tabId: string, item: MenuItem) => void;
  deleteMenuItem: (headerId: string, tabId: string, itemId: string) => void;
  resetMenuHeadersToDefault: () => void;

  // Replaceable Showcase Videos
  videos: ShowcaseVideo[];
  addVideo: (video: ShowcaseVideo) => void;
  updateVideo: (video: ShowcaseVideo) => void;
  deleteVideo: (id: string) => void;
  activePlayingVideo: ShowcaseVideo | null;
  setActivePlayingVideo: (v: ShowcaseVideo | null) => void;

  // Reset demo data
  resetStoreData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const sessionQuery = useGetAdminSession();
  const storefrontQuery = useGetStorefrontState();
  const loginMutation = useLoginAdminMutation();
  const logoutMutation = useLogoutAdminMutation();
  const saveStoreMutation = useSaveAdminStoreState();
  const isAdminAuthenticated = sessionQuery.data?.authenticated === true;
  const isAdminSessionLoading = sessionQuery.isLoading;
  const adminStoreQuery = useGetAdminStoreState({
    query: {
      enabled: isAdminAuthenticated,
      queryKey: getGetAdminStoreStateQueryKey()
    }
  });
  const hydratedRemoteState = useRef(false);
  const [adminDataReady, setAdminDataReady] = useState(false);
  const pendingAdminLoginAudit = useRef(false);
  const storefrontHydrated = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Navigation State with URL Detection for /admin
  const checkIsAdminUrl = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash.startsWith('#/admin');
  };

  const [view, setViewState] = useState<ActiveView>(() => checkIsAdminUrl() ? 'admin' : 'home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-dtf-custom-size');
  const [catalogCategory, setCatalogCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpenState] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [chatbotInitialPrompt, setChatbotInitialPrompt] = useState<string>('');

  // User Auth State
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => 
    LocalStoreManager.get('user_session_authenticated', false)
      ? (() => {
          const saved = LocalStoreManager.get<UserAccount | null>('current_user', null);
          return saved ? { ...saved, password: undefined } : null;
        })()
      : null
  );
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>(() =>
    LocalStoreManager.get('login_events', [])
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [checkoutLoginRequired, setCheckoutLoginRequired] = useState(false);
  const setCheckoutOpen = (open: boolean) => {
    if (!open) {
      setCheckoutOpenState(false);
      return;
    }
    if (!currentUser) {
      setCheckoutOpenState(false);
      setCheckoutLoginRequired(true);
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setCheckoutLoginRequired(false);
    setCheckoutOpenState(true);
  };
  const clearCheckoutLoginRequirement = () => setCheckoutLoginRequired(false);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    const savedSettings = LocalStoreManager.get<Partial<WebsiteSettings>>('website_settings', {});
    return {
      ...DEFAULT_WEBSITE_SETTINGS,
      ...savedSettings,
      siteCopy: {
        ...DEFAULT_WEBSITE_SETTINGS.siteCopy,
        ...(savedSettings.siteCopy || {})
      },
      heroGuarantees: Array.isArray(savedSettings.heroGuarantees)
        ? savedSettings.heroGuarantees
        : DEFAULT_WEBSITE_SETTINGS.heroGuarantees
    };
  });

  // Persistent Domain State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = LocalStoreManager.get('products', INITIAL_PRODUCTS);
    if (Array.isArray(saved) && saved.length >= INITIAL_PRODUCTS.length) {
      return saved;
    }
    return INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>(() => 
    LocalStoreManager.get('cart', [])
  );
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<DiscountCoupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  // Replaceable Menu Headers & Items
  const [menuHeaders, setMenuHeaders] = useState<MenuHeaderConfig[]>(() => {
    const saved = LocalStoreManager.get('menuHeaders', INITIAL_MENU_HEADERS);
    if (Array.isArray(saved) && saved.length > 0) {
      return saved.map(h => {
        if (h.id === 'blanks' || h.id === 'tools') {
          const init = INITIAL_MENU_HEADERS.find(i => i.id === h.id);
          return {
            ...h,
            displayType: h.displayType || 'text-links',
            tabs: (h.tabs && h.tabs[0]?.items?.length >= 10) ? h.tabs : (init ? init.tabs : h.tabs)
          };
        }
        return h;
      });
    }
    return INITIAL_MENU_HEADERS;
  });

  // Replaceable Showcase Videos
  const [videos, setVideos] = useState<ShowcaseVideo[]>(() => {
    const saved = LocalStoreManager.get('videos', INITIAL_SHOWCASE_VIDEOS);
    if (Array.isArray(saved) && saved.length > 0) return saved;
    return INITIAL_SHOWCASE_VIDEOS;
  });

  const [activePlayingVideo, setActivePlayingVideo] = useState<ShowcaseVideo | null>(null);

  // View wrapper that syncs URL cleanly
  const setView = (v: ActiveView) => {
    setViewState(v);
    if (typeof window !== 'undefined') {
      if (v === 'admin') {
        if (!window.location.hash.includes('/admin') && window.location.pathname !== '/admin') {
          window.history.pushState(null, '', '#/admin');
        }
      } else {
        if (window.location.hash.includes('/admin')) {
          window.history.pushState(null, '', window.location.pathname || '/');
        }
      }
    }
  };

  // Listen to popstate & hashchange so typing /admin or #/admin in browser switches view
  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsAdminUrl()) {
        setViewState('admin');
      } else if (view === 'admin') {
        setViewState('home');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [view]);

  const applyRemoteStoreData = (data: Record<string, unknown>) => {
    if (Array.isArray(data.products)) setProducts(data.products as Product[]);
    if (Array.isArray(data.orders)) setOrders(data.orders as Order[]);
    if (Array.isArray(data.customers)) setCustomers(data.customers as Customer[]);
    if (Array.isArray(data.coupons)) setCoupons(data.coupons as DiscountCoupon[]);
    if (Array.isArray(data.stockMovements)) setStockMovements(data.stockMovements as StockMovement[]);
    if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs as AuditLog[]);
    if (Array.isArray(data.menuHeaders)) setMenuHeaders(data.menuHeaders as MenuHeaderConfig[]);
    if (Array.isArray(data.videos)) setVideos(data.videos as ShowcaseVideo[]);
    if (Array.isArray(data.loginEvents)) setLoginEvents(data.loginEvents as LoginEvent[]);
    if (data.websiteSettings && typeof data.websiteSettings === 'object') {
      const saved = data.websiteSettings as Partial<WebsiteSettings>;
      setWebsiteSettings(previous => ({
        ...previous, ...saved,
        siteCopy: { ...previous.siteCopy, ...(saved.siteCopy || {}) },
        heroGuarantees: Array.isArray(saved.heroGuarantees) ? saved.heroGuarantees : previous.heroGuarantees
      }));
    }
  };

  useEffect(() => {
    if (!isAdminAuthenticated) {
      hydratedRemoteState.current = false;
      setAdminDataReady(false);
      return;
    }
    if (adminStoreQuery.data && !hydratedRemoteState.current) {
      const savedData = adminStoreQuery.data.updatedAt
        ? adminStoreQuery.data.data as Record<string, unknown>
        : {
            ...adminStoreQuery.data.data,
            orders: LocalStoreManager.get('orders', INITIAL_ORDERS),
            customers: LocalStoreManager.get('customers', INITIAL_CUSTOMERS),
            coupons: LocalStoreManager.get('coupons', INITIAL_COUPONS),
            stockMovements: LocalStoreManager.get('stockMovements', INITIAL_STOCK_MOVEMENTS),
            auditLogs: LocalStoreManager.get('auditLogs', INITIAL_AUDIT_LOGS),
            loginEvents: LocalStoreManager.get('login_events', [])
          };
      applyRemoteStoreData(savedData);
      if (pendingAdminLoginAudit.current) {
        pendingAdminLoginAudit.current = false;
        const log: AuditLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          action: 'Admin Logged In',
          entityType: 'settings',
          entityId: 'admin',
          details: 'Administrator session started.',
          actor: 'Admin System',
          timestamp: new Date().toISOString()
        };
        setAuditLogs(previous => [log, ...previous]);
      }
      hydratedRemoteState.current = true;
      setAdminDataReady(true);
    }
  }, [adminStoreQuery.data, isAdminAuthenticated]);

  useEffect(() => {
    if (isAdminAuthenticated || storefrontHydrated.current || !storefrontQuery.data) return;
    applyRemoteStoreData(storefrontQuery.data.data as Record<string, unknown>);
    storefrontHydrated.current = true;
  }, [storefrontQuery.data, isAdminAuthenticated]);

  useEffect(() => {
    if (!isAdminAuthenticated || !hydratedRemoteState.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const data = { products, orders, customers, coupons, stockMovements, auditLogs, menuHeaders, videos, loginEvents, websiteSettings };
      saveStoreMutation.mutate({ data: { data } }, {
        onSuccess: saved => {
          const session = queryClient.getQueryData<{ authenticated?: boolean }>(getGetAdminSessionQueryKey());
          if (session?.authenticated) {
            queryClient.setQueryData(getGetAdminStoreStateQueryKey(), saved);
          }
          const publicKeys = ['products', 'websiteSettings', 'menuHeaders', 'videos'];
          const publicData = Object.fromEntries(
            publicKeys.flatMap(key => Object.prototype.hasOwnProperty.call(saved.data, key)
              ? [[key, saved.data[key]]]
              : [])
          );
          queryClient.setQueryData(getGetStorefrontStateQueryKey(), { data: publicData, updatedAt: saved.updatedAt });
          ['orders', 'customers', 'coupons', 'stockMovements', 'auditLogs'].forEach(
            key => LocalStoreManager.remove(key)
          );
        }
      });
    }, 350);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [isAdminAuthenticated, products, orders, customers, coupons, stockMovements, auditLogs, menuHeaders, videos, loginEvents, websiteSettings]);

  // Sync non-credential preferences and cart state only.
  useEffect(() => {
    // Remove the password-bearing account cache created by older demo builds.
    LocalStoreManager.remove('users');
  }, []);

  useEffect(() => {
    LocalStoreManager.set('current_user', currentUser ? { ...currentUser, password: undefined } : null);
    LocalStoreManager.set('user_session_authenticated', Boolean(currentUser));
  }, [currentUser]);

  useEffect(() => {
    LocalStoreManager.set('login_events', loginEvents.slice(-5000));
  }, [loginEvents]);

  useEffect(() => {
    LocalStoreManager.set('website_settings', websiteSettings);
  }, [websiteSettings]);

  useEffect(() => {
    LocalStoreManager.set('products', products);
  }, [products]);

  useEffect(() => {
    LocalStoreManager.set('cart', cart);
  }, [cart]);

  // User Auth Methods
  const registerUser = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: name.trim(),
      email: trimmedEmail,
      password: password,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(null);

    // Sync to Customer list if not exists
    const customerExists = customers.find(c => c.email.toLowerCase() === trimmedEmail);
    if (!customerExists) {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        fullName: name.trim(),
        email: trimmedEmail,
        phone: '',
        ordersCount: 0,
        totalSpent: 0,
        registeredAt: new Date().toISOString(),
        status: 'active'
      };
      setCustomers(prev => [newCust, ...prev]);
    }

    LocalStoreManager.set('user_session_authenticated', false);
    addAuditLog('User Registered', 'customer', newUser.id, `New user ${newUser.fullName} registered`);
    return { success: true };
  };

  const loginUser = (email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email. Please create an account.' };
    }
    if (user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setCurrentUser({ ...user, password: undefined });
    if (checkoutLoginRequired) {
      setCheckoutLoginRequired(false);
      setCheckoutOpenState(true);
    }
    setLoginEvents(previous => [
      ...previous,
      { userId: user.id, at: new Date().toISOString() }
    ].slice(-5000));

    // Sync active customer profile
    const matchedCust = customers.find(c => c.email.toLowerCase() === trimmedEmail);
    setCurrentCustomer(matchedCust || null);

    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentCustomer(null);
    setCheckoutOpenState(false);
    setCheckoutLoginRequired(false);
    LocalStoreManager.set('user_session_authenticated', false);
  };

  const updateWebsiteSettings = (updates: Partial<WebsiteSettings>) => {
    setWebsiteSettings(previous => ({ ...previous, ...updates }));
  };

  // Admin Auth Methods
  const loginAdmin = async (
    email: string,
    password: string,
    captchaId: string,
    captchaAnswer: string
  ): Promise<{ success: boolean; error?: string; retryAfterSeconds?: number }> => {
    try {
      const result = await loginMutation.mutateAsync({ data: { email, password, captchaId, captchaAnswer } });
      if (result.authenticated) {
        queryClient.setQueryData(getGetAdminSessionQueryKey(), { authenticated: true, email: result.email || email.trim() });
        hydratedRemoteState.current = false;
        setAdminDataReady(false);
        pendingAdminLoginAudit.current = true;
        return { success: true };
      }
      return {
        success: false,
        error: result.message || 'Sign-in details or CAPTCHA were not accepted.',
        retryAfterSeconds: result.retryAfterSeconds
      };
    } catch (error) {
      return { success: false, error: (error as { message?: string })?.message || 'The secure sign-in service is unavailable. Try again shortly.' };
    }
  };

  const logoutAdmin = () => {
    queryClient.setQueryData(getGetAdminSessionQueryKey(), { authenticated: false });
    hydratedRemoteState.current = false;
    setAdminDataReady(false);
    queryClient.removeQueries({ queryKey: getGetAdminStoreStateQueryKey() });
    logoutMutation.mutate();
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setCoupons(INITIAL_COUPONS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentCustomer(null);
    setView('home');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
  };

  // Product CRUD
  const addProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    addAuditLog('Created Product', 'product', newProduct.id, `Product "${newProduct.name}" created with price $${newProduct.price}`);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    addAuditLog('Updated Product', 'product', updated.id, `Product "${updated.name}" updated`);
  };

  const deleteProduct = (id: string) => {
    const toDelete = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (toDelete) {
      addAuditLog('Deleted Product', 'product', id, `Product "${toDelete.name}" deleted from catalog`);
    }
  };

  // Cart operations
  const addToCart = (itemData: Omit<CartItem, 'id'>) => {
    const id = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: CartItem = { ...itemData, id };

    setCart(prev => {
      // If standard product without custom config, stack quantity
      if (!newItem.customConfig && !newItem.gangSheetConfig) {
        const existingIndex = prev.findIndex(
          p => p.productId === newItem.productId && p.variantId === newItem.variantId
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += newItem.quantity;
          return updated;
        }
      }
      return [...prev, newItem];
    });

    setCartDrawerOpen(true);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Coupons
  const applyCouponCode = (code: string): boolean => {
    setCouponError(null);
    const cleaned = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleaned && c.isActive);

    if (!found) {
      setCouponError('Invalid or expired promotional coupon code.');
      return false;
    }

    if (cartSubtotal < found.minOrderValue) {
      setCouponError(`Coupon requires minimum order value of $${found.minOrderValue.toFixed(2)}.`);
      return false;
    }

    if (found.maxUsage && found.usageCount >= found.maxUsage) {
      setCouponError('This coupon has reached its maximum usage limit.');
      return false;
    }

    setAppliedCoupon(found);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? (cartSubtotal * appliedCoupon.discountValue) / 100
      : Math.min(cartSubtotal, appliedCoupon.discountValue)
    : 0;

  // Place Order
  const placeOrder = async (
    shippingAddress: ShippingAddress,
    shippingMethod: string,
    _paymentMethod: string,
    notes?: string
  ): Promise<Order> => {
    if (!currentUser?.email?.trim()) {
      throw new Error('Sign in to your customer account before placing an order.');
    }
    if (cart.length === 0) {
      throw new Error('Add an item to your cart before placing an order.');
    }

    const accountEmail = currentUser.email.trim().toLowerCase();
    const accountName = currentUser.fullName.trim() || shippingAddress.fullName.trim();
    const verifiedShippingAddress: ShippingAddress = {
      ...shippingAddress,
      email: accountEmail
    };
    const isFreeShipping = cartSubtotal >= 75 || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
    const shippingCost = isFreeShipping ? 0 : (shippingMethod.includes('Rush') ? 24.99 : 9.99);
    const taxableSubtotal = Math.max(0, cartSubtotal - discountAmount);
    const taxCost = Number((taxableSubtotal * 0.075).toFixed(2));
    const grandTotal = Number((taxableSubtotal + shippingCost + taxCost).toFixed(2));

    const orderNumber = `AMB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: accountName,
      customerEmail: accountEmail,
      shippingAddress: verifiedShippingAddress,
      items: cart.map(item => ({
        id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        image: item.productImage,
        customConfig: item.customConfig,
        gangSheetConfig: item.gangSheetConfig
      })),
      subtotal: Number(cartSubtotal.toFixed(2)),
      discountTotal: Number(discountAmount.toFixed(2)),
      shippingTotal: shippingCost,
      taxTotal: taxCost,
      grandTotal,
      couponCode: appliedCoupon?.code,
      shippingMethod,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Payment pending (demo preview)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes
    };

    setOrders(prev => [newOrder, ...prev]);
    addAuditLog('Order Preview Created', 'order', orderNumber, `Demo order preview for ${accountName}; payment is pending and no fulfillment action was started.`);

    setLastPlacedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    setCheckoutOpen(false);
    setView('order-success');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          status,
          updatedAt: new Date().toISOString(),
          ...(trackingNumber ? { trackingNumber } : {}),
          ...(notes ? { notes: (o.notes ? `${o.notes}\n` : '') + notes } : {})
        };
        addAuditLog('Order Status Updated', 'order', o.orderNumber, `Status changed to "${status}"${trackingNumber ? ` with tracking ${trackingNumber}` : ''}`);
        return updated;
      }
      return o;
    }));
  };

  const refundOrder = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        addAuditLog('Order Refunded', 'order', o.orderNumber, `Order refunded. Reason: ${reason}`);
        return {
          ...o,
          status: 'refunded',
          paymentStatus: 'refunded',
          notes: (o.notes ? `${o.notes}\n` : '') + `[REFUND PROCESSED]: ${reason}`,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const adjustStock = (
    productId: string,
    variantId: string | undefined,
    delta: number,
    reason: StockMovement['reason'],
    staffUser: string,
    refId?: string
  ) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let targetVariant = product.variants.find(v => v.id === variantId);
    if (!targetVariant && product.variants.length > 0) {
      targetVariant = product.variants[0];
    }

    const currentStock = targetVariant ? targetVariant.stock : 999;
    const newBalance = Math.max(0, currentStock + delta);

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          variants: p.variants.map(v => v.id === (targetVariant?.id || variantId) ? { ...v, stock: newBalance } : v)
        };
      }
      return p;
    }));

    const movement: StockMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      productId,
      variantId,
      productName: `${product.name}${targetVariant ? ` (${targetVariant.name})` : ''}`,
      quantityChange: delta,
      newBalance,
      reason,
      referenceId: refId || `ADJ-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      staffUser
    };

    setStockMovements(prev => [movement, ...prev]);
    addAuditLog('Stock Adjusted', 'inventory', productId, `${product.name} changed by ${delta > 0 ? `+${delta}` : delta}. Reason: ${reason} (${staffUser})`);
  };

  const addAuditLog = (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      action,
      entityType,
      entityId,
      details,
      actor: 'Admin System',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Menu Management Methods
  useEffect(() => {
    LocalStoreManager.set('menuHeaders', menuHeaders);
  }, [menuHeaders]);

  const updateMenuHeader = (updated: MenuHeaderConfig) => {
    setMenuHeaders(prev => prev.map(h => h.id === updated.id ? updated : h));
    addAuditLog('Menu Header Updated', 'settings', updated.id, `Header "${updated.label}" was modified by admin`);
  };

  const addMenuHeader = (header: MenuHeaderConfig) => {
    setMenuHeaders(prev => [...prev, header]);
    addAuditLog('Menu Header Added', 'settings', header.id, `Header "${header.label}" was created by admin`);
  };

  const deleteMenuHeader = (id: string) => {
    setMenuHeaders(prev => prev.filter(h => h.id !== id));
    addAuditLog('Menu Header Deleted', 'settings', id, `Header "${id}" removed by admin`);
  };

  const updateMenuItem = (headerId: string, tabId: string, item: MenuItem) => {
    setMenuHeaders(prev => prev.map(header => {
      if (header.id !== headerId) return header;
      return {
        ...header,
        tabs: header.tabs.map(tab => {
          if (tab.id !== tabId) return tab;
          return {
            ...tab,
            items: tab.items.map(it => it.id === item.id ? item : it)
          };
        })
      };
    }));
    addAuditLog('Menu Item Updated', 'settings', item.id, `Menu item "${item.name}" updated`);
  };

  const addMenuItem = (headerId: string, tabId: string, item: MenuItem) => {
    setMenuHeaders(prev => prev.map(header => {
      if (header.id !== headerId) return header;
      return {
        ...header,
        tabs: header.tabs.map(tab => {
          if (tab.id !== tabId) return tab;
          return {
            ...tab,
            items: [...tab.items, item]
          };
        })
      };
    }));
    addAuditLog('Menu Item Added', 'settings', item.id, `Menu item "${item.name}" added to ${headerId}`);
  };

  const deleteMenuItem = (headerId: string, tabId: string, itemId: string) => {
    setMenuHeaders(prev => prev.map(header => {
      if (header.id !== headerId) return header;
      return {
        ...header,
        tabs: header.tabs.map(tab => {
          if (tab.id !== tabId) return tab;
          return {
            ...tab,
            items: tab.items.filter(it => it.id !== itemId)
          };
        })
      };
    }));
    addAuditLog('Menu Item Deleted', 'settings', itemId, `Menu item "${itemId}" removed`);
  };

  const resetMenuHeadersToDefault = () => {
    setMenuHeaders(INITIAL_MENU_HEADERS);
    addAuditLog('Menu Reset', 'settings', 'all', 'Menu headers restored to default layout');
  };

  // Video Management Methods
  useEffect(() => {
    LocalStoreManager.set('videos', videos);
  }, [videos]);

  const addVideo = (vid: ShowcaseVideo) => {
    setVideos(prev => [vid, ...prev]);
    addAuditLog('Video Added', 'settings', vid.id, `Showcase video "${vid.title}" added`);
  };

  const updateVideo = (vid: ShowcaseVideo) => {
    setVideos(prev => prev.map(v => v.id === vid.id ? vid : v));
    addAuditLog('Video Updated', 'settings', vid.id, `Showcase video "${vid.title}" updated`);
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    addAuditLog('Video Deleted', 'settings', id, `Video ${id} removed`);
  };

  const loginHistory = loginEvents
    .map(event => {
      const user = users.find(candidate => candidate.id === event.userId);
      return {
        userId: event.userId,
        name: user?.fullName || 'Account no longer available',
        email: user?.email || '—',
        at: event.at
      };
    })
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  const resetStoreData = () => {
    LocalStoreManager.resetToDefaults();
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setCoupons(INITIAL_COUPONS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMenuHeaders(INITIAL_MENU_HEADERS);
    setVideos(INITIAL_SHOWCASE_VIDEOS);
    setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
    setLoginEvents([]);
    setCart([]);
    setAppliedCoupon(null);
  };

  return (
    <StoreContext.Provider value={{
      view, setView,
      selectedProductId, setSelectedProductId,
      catalogCategory, setCatalogCategory,
      searchQuery, setSearchQuery,
      adminTab, setAdminTab,
      cartDrawerOpen, setCartDrawerOpen,
      checkoutOpen, setCheckoutOpen,
      lastPlacedOrder, setLastPlacedOrder,
      chatbotOpen, setChatbotOpen,
      chatbotInitialPrompt, setChatbotInitialPrompt,

      currentUser,
      loginEvents,
      authModalOpen, setAuthModalOpen,
      authModalMode, setAuthModalMode,
      checkoutLoginRequired,
      clearCheckoutLoginRequirement,
      registerUser, loginUser, logoutUser,
      websiteSettings, updateWebsiteSettings,
      adminStoreSaveState: saveStoreMutation.isPending ? 'saving' : saveStoreMutation.isError ? 'error' : saveStoreMutation.isSuccess ? 'saved' : 'idle',

      isAdminAuthenticated,
      isAdminSessionLoading,
      isAdminDataLoading: isAdminAuthenticated && !adminDataReady && adminStoreQuery.isLoading,
      adminDataLoadError: isAdminAuthenticated && adminStoreQuery.isError && !adminDataReady
        ? 'Protected store data could not be loaded.'
        : null,
      retryAdminDataLoad: () => { void adminStoreQuery.refetch(); },
      loginAdmin, logoutAdmin,
      loginHistory,

      products, addProduct, updateProduct, deleteProduct,
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart, cartSubtotal, cartCount,
      coupons, appliedCoupon, couponError, applyCouponCode, removeCoupon, discountAmount,
      orders, placeOrder, updateOrderStatus, refundOrder,
      stockMovements, adjustStock,
      customers, currentCustomer, setCurrentCustomer,
      auditLogs, addAuditLog,

      menuHeaders, updateMenuHeader, addMenuHeader, deleteMenuHeader, updateMenuItem, addMenuItem, deleteMenuItem, resetMenuHeadersToDefault,
      videos, addVideo, updateVideo, deleteVideo, activePlayingVideo, setActivePlayingVideo,

      resetStoreData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
