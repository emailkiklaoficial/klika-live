// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KLIKA.LIVE — Core Type System
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ViewId =
  | 'home'
  | 'marketplace'
  | 'live'
  | 'auction'
  | 'notifications'
  | 'cart'
  | 'profile'
  | 'create'
  | 'seller-studio'
  | 'analytics'
  | 'logistics'
  | 'auth-login'
  | 'auth-register'
  | 'product-detail'
  | 'seller-profile'
  | 'search';

export type AuctionStatus = 'upcoming' | 'live' | 'ended' | 'sold';
export type LiveStatus = 'upcoming' | 'live' | 'ended';
export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type NotificationType = 'bid' | 'sale' | 'follow' | 'live' | 'auction' | 'system';
export type MessageRole = 'user' | 'seller' | 'system';

// ─── User ───

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  followersCount: number;
  followingCount: number;
  totalSales: number;
  joinedDate: string;
  location: string;
  coverImage?: string;
}

// ─── Product ───

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  category: string;
  condition: ProductCondition;
  sellerId: string;
  seller: Pick<User, 'id' | 'username' | 'displayName' | 'avatar' | 'isVerified' | 'rating'>;
  likesCount: number;
  isLiked: boolean;
  isAuction: boolean;
  auctionEndsAt?: string;
  currentBid?: number;
  bidCount?: number;
  tags: string[];
  createdAt: string;
}

// ─── Live Stream ───

export interface LiveStream {
  id: string;
  title: string;
  sellerId: string;
  seller: Pick<User, 'id' | 'username' | 'displayName' | 'avatar' | 'isVerified'>;
  thumbnail: string;
  viewerCount: number;
  status: LiveStatus;
  startedAt: string;
  products: LiveProduct[];
  category: string;
  description?: string;
  duration?: number;
}

export interface LiveProduct {
  id: string;
  product: Product;
  price: number;
  discount?: number;
  isFeatured: boolean;
  order: number;
}

// ─── Auction ───

export interface Auction {
  id: string;
  title: string;
  description: string;
  images: string[];
  startingBid: number;
  currentBid: number;
  reservePrice?: number;
  buyNowPrice?: number;
  bidCount: number;
  bidderCount: number;
  status: AuctionStatus;
  endsAt: string;
  sellerId: string;
  seller: Pick<User, 'id' | 'username' | 'displayName' | 'avatar' | 'isVerified' | 'rating'>;
  category: string;
  tags: string[];
  watchCount: number;
  isWatched: boolean;
  bids: Bid[];
  createdAt: string;
}

export interface Bid {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatar'>;
  amount: number;
  timestamp: string;
  isHighest: boolean;
}

// ─── Chat Message ───

export interface ChatMessage {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatar'>;
  content: string;
  role: MessageRole;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
}

// ─── Notification ───

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  imageUrl?: string;
  linkUrl?: string;
  isRead: boolean;
  timestamp: string;
}

// ─── Category ───

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

// ─── Order ───

export interface Order {
  id: string;
  productId: string;
  product: Pick<Product, 'id' | 'title' | 'images' | 'price'>;
  seller: Pick<User, 'id' | 'username' | 'displayName' | 'avatar'>;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
}

// ─── Shipping ───

export interface ShippingStep {
  id: string;
  label: string;
  description: string;
  timestamp?: string;
  status: 'pending' | 'active' | 'completed';
}

// ─── Analytics ───

export interface LiveAnalytics {
  streamId: string;
  title: string;
  peakViewers: number;
  averageViewers: number;
  totalDuration: number;
  totalRevenue: number;
  conversionRate: number;
  productsSold: number;
  newFollowers: number;
  viewerGraph: { time: string; viewers: number }[];
  revenueGraph: { time: string; revenue: number }[];
  topProducts: { product: string; sold: number; revenue: number }[];
}

// ─── Seller Studio ───

export interface SellerInsight {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  avgRating: number;
  followersCount: number;
  followersChange: number;
  aiRecommendation: string;
  alerts: { type: 'info' | 'warning' | 'success'; message: string }[];
}

// ─── Cart ───

export interface CartItem {
  id: string;
  product: Pick<Product, 'id' | 'title' | 'images' | 'price' | 'currency' | 'seller'>;
  quantity: number;
  addedAt: string;
}

// ─── Feed Item (unified) ───

export type FeedItemType = 'product' | 'live' | 'auction';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  product?: Product;
  live?: LiveStream;
  auction?: Auction;
  score: number; // AI recommendation score
}
