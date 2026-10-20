export type CategoryId = 
  | 'dtf-transfers' 
  | 'gang-sheets' 
  | 'uv-dtf' 
  | 'blank-apparel' 
  | 'supplies' 
  | 'sample-packs' 
  | 'specialty-dtf' 
  | 'patches-stickers';

export interface VolumeTier {
  minQty: number;
  maxQty?: number;
  pricePerUnit: number;
  discountPercentage: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // e.g. { size: '11" x 11"', garmentColor: 'Dark' }
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  featured?: boolean;
  bestSeller?: boolean;
  isCustomizable?: boolean;
  isGangSheet?: boolean;
  variants: ProductVariant[];
  volumeTiers: VolumeTier[];
  specifications: {
    pressTemp?: string;
    pressTime?: string;
    pressPressure?: string;
    peelType?: string;
    material?: string;
    durability?: string;
    turnaround?: string;
  };
  rating: number;
  reviewCount: number;
}

export interface CustomTransferConfig {
  sizePreset: string;
  widthInches: number;
  heightInches: number;
  fabricType: string;
  fabricColor: 'light' | 'dark' | 'any';
  artworkUrl?: string;
  artfileName?: string;
  artworkDpi?: number;
  hasTransparentBg?: boolean;
  notes?: string;
}

export interface GangSheetElement {
  id: string;
  name: string;
  imageUrl: string;
  x: number; // in inches
  y: number; // in inches
  width: number; // in inches
  height: number; // in inches
  rotation: number; // degrees: 0, 90, 180, 270
}

export interface GangSheetConfig {
  sheetWidth: number; // usually 22"
  sheetLength: number; // 24", 60", 120", 240", etc.
  elements: GangSheetElement[];
  totalAreaUsedPercentage: number;
  artfileName?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  category: CategoryId;
  productImage: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  customConfig?: CustomTransferConfig;
  gangSheetConfig?: GangSheetConfig;
}

export type OrderStatus = 
  | 'pending'
  | 'artwork_review'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
  customConfig?: CustomTransferConfig;
  gangSheetConfig?: GangSheetConfig;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  couponCode?: string;
  shippingMethod: string;
  trackingNumber?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  defaultAddress?: ShippingAddress;
  registeredAt: string;
  status: 'active' | 'suspended';
}

export interface StockMovement {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  quantityChange: number;
  newBalance: number;
  reason: 'sale' | 'restock' | 'adjustment' | 'damaged' | 'return';
  referenceId?: string;
  timestamp: string;
  staffUser: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  usageCount: number;
  maxUsage?: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'order' | 'product' | 'inventory' | 'customer' | 'coupon' | 'settings';
  entityId: string;
  details: string;
  actor: string;
  timestamp: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  tag?: string; // e.g. "Commercial Grade", "Zero Weeding", "Dishwasher Safe"
  imageUrl?: string;
  description?: string;
  columnGroup?: string; // For text-only menu layout columns (e.g. "T-Shirts", "Fleece", "Headwear")
  targetView: string; // 'catalog' | 'product-detail' | 'custom-dtf' | 'gang-sheet-builder' | 'home'
  targetCategory?: CategoryId;
  targetProductId?: string;
}

export interface MenuTabGroup {
  id: string;
  tabName: string;
  items: MenuItem[];
}

export interface MenuHeaderConfig {
  id: string; // e.g. 'dtf', 'uv', 'blanks', 'specialty', 'patches', 'supplies', 'tools'
  label: string;
  category?: CategoryId | 'tools' | 'custom-dtf';
  badge?: string;
  displayType?: 'media-grid' | 'text-links'; // 'media-grid' shows product photos, 'text-links' shows clean text-only clickable links (like Blank Apparel & Support & Tools)
  bannerText?: string;
  bannerButtonText?: string;
  bannerButtonView?: string;
  bannerButtonCategory?: CategoryId;
  tabs: MenuTabGroup[];
}

export interface ShowcaseVideo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  viewsCount?: string;
  featuredProductId?: string;
  category: string;
  tag?: string;
  productName?: string;
  steps?: string[];
}
