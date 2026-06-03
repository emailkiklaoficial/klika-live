// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KLIKA.LIVE — Mock Data Layer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  User, Product, LiveStream, Auction, Category,
  ChatMessage, Notification, Order, ShippingStep,
  LiveAnalytics, SellerInsight, FeedItem, Bid
} from '@/types';

// ─── Users ───

export const mockUsers: User[] = [
  {
    id: 'u1', username: 'techhunter', displayName: 'Tech Hunter',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=techhunter',
    bio: 'Premium electronics dealer. New drops every week! 🔥',
    isVerified: true, rating: 4.9, reviewCount: 1247,
    followersCount: 45200, followingCount: 120, totalSales: 8930,
    joinedDate: '2024-03-15', location: 'Miami, FL',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
  },
  {
    id: 'u2', username: 'sneakerqueen', displayName: 'Sneaker Queen 👟',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sneakerqueen',
    bio: 'Rare kicks & exclusive drops. Authenticity guaranteed. ✨',
    isVerified: true, rating: 4.8, reviewCount: 856,
    followersCount: 23400, followingCount: 89, totalSales: 5670,
    joinedDate: '2024-01-20', location: 'NYC'
  },
  {
    id: 'u3', username: 'vintagevault', displayName: 'Vintage Vault',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vintagevault',
    bio: 'Curated vintage finds from around the world 🌍',
    isVerified: true, rating: 4.7, reviewCount: 632,
    followersCount: 18700, followingCount: 234, totalSales: 3420,
    joinedDate: '2024-02-10', location: 'Austin, TX'
  },
  {
    id: 'u4', username: 'gemcollector', displayName: 'Gem Collector',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=gemcollector',
    bio: 'Fine jewelry & precious gems. Each piece tells a story 💎',
    isVerified: true, rating: 5.0, reviewCount: 421,
    followersCount: 15800, followingCount: 67, totalSales: 2180,
    joinedDate: '2024-04-05', location: 'LA'
  },
  {
    id: 'u5', username: 'artdealer', displayName: 'Art Dealer',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=artdealer',
    bio: 'Contemporary art & limited editions. Museum quality pieces 🎨',
    isVerified: true, rating: 4.9, reviewCount: 312,
    followersCount: 9800, followingCount: 45, totalSales: 890,
    joinedDate: '2024-05-12', location: 'Chicago, IL'
  }
];

// ─── Categories ───

export const mockCategories: Category[] = [
  { id: 'c1', name: 'Electronics', icon: '💻', color: '#6366f1', count: 12450 },
  { id: 'c2', name: 'Sneakers', icon: '👟', color: '#f43f5e', count: 8930 },
  { id: 'c3', name: 'Jewelry', icon: '💎', color: '#a855f7', count: 5670 },
  { id: 'c4', name: 'Vintage', icon: '📦', color: '#f59e0b', count: 7340 },
  { id: 'c5', name: 'Art', icon: '🎨', color: '#10b981', count: 2180 },
  { id: 'c6', name: 'Fashion', icon: '👗', color: '#ec4899', count: 15670 },
  { id: 'c7', name: 'Collectibles', icon: '🏆', color: '#06b6d4', count: 4890 },
  { id: 'c8', name: 'Home', icon: '🏠', color: '#84cc16', count: 9230 },
  { id: 'c9', name: 'Gaming', icon: '🎮', color: '#8b5cf6', count: 6780 },
  { id: 'c10', name: 'Beauty', icon: '✨', color: '#f97316', count: 11340 },
];

// ─── Products ───

export const mockProducts: Product[] = [
  {
    id: 'p1', title: 'MacBook Pro 16" M4 Max — 96GB RAM',
    description: 'Brand new, sealed in box. Space Black. AppleCare+ included until 2027. This is the ultimate creator machine with M4 Max chip.',
    price: 3499, originalPrice: 3999, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80'],
    category: 'Electronics', condition: 'new', sellerId: 'u1',
    seller: mockUsers[0],
    likesCount: 342, isLiked: false, isAuction: false,
    tags: ['apple', 'macbook', 'laptop', 'm4'],
    createdAt: '2024-12-01'
  },
  {
    id: 'p2', title: 'Nike Air Jordan 1 Retro High OG "Chicago"',
    description: 'Deadstock pair, all original. Size 10. Comes with box and extra laces. One of the most iconic colorways ever made.',
    price: 385, originalPrice: 450, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80'],
    category: 'Sneakers', condition: 'new', sellerId: 'u2',
    seller: mockUsers[1],
    likesCount: 891, isLiked: true, isAuction: false,
    tags: ['nike', 'jordan', 'sneakers', 'deadstock'],
    createdAt: '2024-11-28'
  },
  {
    id: 'p3', title: 'Vintage Rolex Submariner 5513 — 1967',
    description: 'Original patina dial, matching hands. Service history documented. A true collector\'s piece from the golden era of Rolex.',
    price: 18500, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80'],
    category: 'Jewelry', condition: 'good', sellerId: 'u4',
    seller: mockUsers[3],
    likesCount: 1205, isLiked: false, isAuction: true,
    auctionEndsAt: '2024-12-15T20:00:00Z',
    currentBid: 15200, bidCount: 47,
    tags: ['rolex', 'submariner', 'vintage', 'watch'],
    createdAt: '2024-11-25'
  },
  {
    id: 'p4', title: 'Banksy "Girl with Balloon" Signed Print',
    description: 'Authenticated Banksy screen print. Numbered 142/150. Certificate of authenticity from Pest Control. Museum-grade framing available.',
    price: 45000, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b17a?w=600&q=80'],
    category: 'Art', condition: 'like_new', sellerId: 'u5',
    seller: mockUsers[4],
    likesCount: 2100, isLiked: false, isAuction: true,
    auctionEndsAt: '2024-12-20T22:00:00Z',
    currentBid: 38000, bidCount: 23,
    tags: ['banksy', 'art', 'print', 'contemporary'],
    createdAt: '2024-11-20'
  },
  {
    id: 'p5', title: 'PS5 Pro Bundle — 2 Controllers + 5 Games',
    description: 'Like new condition. Includes PS5 Pro console, 2 DualSense Edge controllers, and 5 top titles. All original packaging.',
    price: 749, originalPrice: 899, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80'],
    category: 'Gaming', condition: 'like_new', sellerId: 'u1',
    seller: mockUsers[0],
    likesCount: 567, isLiked: false, isAuction: false,
    tags: ['ps5', 'sony', 'gaming', 'bundle'],
    createdAt: '2024-12-02'
  },
  {
    id: 'p6', title: 'Vintage Levi\'s 501 — 1970s Big E',
    description: 'Original Big E red tab. Excellent fading and wear pattern. Size 32x32. One of the most sought-after vintage denim pieces.',
    price: 890, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'],
    category: 'Vintage', condition: 'good', sellerId: 'u3',
    seller: mockUsers[2],
    likesCount: 445, isLiked: false, isAuction: false,
    tags: ['levis', 'vintage', 'denim', '501'],
    createdAt: '2024-11-30'
  },
  {
    id: 'p7', title: 'iPad Pro 13" M4 — 1TB Wi-Fi',
    description: 'Space Black, nano-texture glass. Apple Pencil Pro + Magic Keyboard included. Perfect for artists and professionals.',
    price: 2199, originalPrice: 2499, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80'],
    category: 'Electronics', condition: 'new', sellerId: 'u1',
    seller: mockUsers[0],
    likesCount: 289, isLiked: false, isAuction: false,
    tags: ['apple', 'ipad', 'm4', 'tablet'],
    createdAt: '2024-12-03'
  },
  {
    id: 'p8', title: 'Travis Scott x Nike Air Max 1 "Wheat"',
    description: 'Brand new, DS. Size 11. One of the hardest collabs of the year. Comes with original box and all accessories.',
    price: 520, originalPrice: 650, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'],
    category: 'Sneakers', condition: 'new', sellerId: 'u2',
    seller: mockUsers[1],
    likesCount: 734, isLiked: true, isAuction: false,
    tags: ['travis', 'nike', 'airmax', 'sneakers'],
    createdAt: '2024-12-01'
  },
];

// ─── Live Streams ───

export const mockLiveStreams: LiveStream[] = [
  {
    id: 'l1', title: '🔥 MEGA DROP — AirPods Max 2 Unboxing Live!',
    sellerId: 'u1', seller: mockUsers[0],
    thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
    viewerCount: 2341, status: 'live', startedAt: '2024-12-05T18:00:00Z',
    category: 'Electronics',
    description: 'First live unboxing of the new AirPods Max 2! Exclusive deals during the stream.',
    products: [
      { id: 'lp1', product: mockProducts[0], price: 3299, discount: 6, isFeatured: true, order: 1 },
      { id: 'lp2', product: mockProducts[6], price: 1999, discount: 9, isFeatured: false, order: 2 },
    ]
  },
  {
    id: 'l2', title: 'Sneaker Auction — Rare Grails Only 👟',
    sellerId: 'u2', seller: mockUsers[1],
    thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80',
    viewerCount: 1876, status: 'live', startedAt: '2024-12-05T19:30:00Z',
    category: 'Sneakers',
    description: 'Live auction of rare sneaker grails. Bidding starts at wholesale!',
    products: [
      { id: 'lp3', product: mockProducts[1], price: 350, discount: 9, isFeatured: true, order: 1 },
      { id: 'lp4', product: mockProducts[7], price: 480, discount: 8, isFeatured: false, order: 2 },
    ]
  },
  {
    id: 'l3', title: '💎 Fine Jewelry Showcase & Live Auction',
    sellerId: 'u4', seller: mockUsers[3],
    thumbnail: 'https://images.unsplash.com/photo-1515562141589-67f0d749b707?w=600&q=80',
    viewerCount: 987, status: 'live', startedAt: '2024-12-05T17:00:00Z',
    category: 'Jewelry',
    products: [
      { id: 'lp5', product: mockProducts[2], price: 16000, discount: 14, isFeatured: true, order: 1 },
    ]
  },
  {
    id: 'l4', title: 'Midnight Gaming Setup Tour 🎮',
    sellerId: 'u1', seller: mockUsers[0],
    thumbnail: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80',
    viewerCount: 0, status: 'upcoming', startedAt: '2024-12-06T00:00:00Z',
    category: 'Gaming',
    products: [
      { id: 'lp6', product: mockProducts[4], price: 649, discount: 13, isFeatured: true, order: 1 },
    ]
  },
];

// ─── Auctions ───

export const mockBids: Bid[] = [
  { id: 'b1', userId: 'bu1', user: { id: 'bu1', username: 'collector99', displayName: 'Collector99', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=collector99' }, amount: 15200, timestamp: '2024-12-05T19:42:00Z', isHighest: true },
  { id: 'b2', userId: 'bu2', user: { id: 'bu2', username: 'watchmaster', displayName: 'WatchMaster', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=watchmaster' }, amount: 14800, timestamp: '2024-12-05T19:38:00Z', isHighest: false },
  { id: 'b3', userId: 'bu3', user: { id: 'bu3', username: 'luxuryking', displayName: 'LuxuryKing', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=luxuryking' }, amount: 14500, timestamp: '2024-12-05T19:35:00Z', isHighest: false },
  { id: 'b4', userId: 'bu4', user: { id: 'bu4', username: 'rarefinder', displayName: 'RareFinder', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rarefinder' }, amount: 14200, timestamp: '2024-12-05T19:30:00Z', isHighest: false },
  { id: 'b5', userId: 'bu5', user: { id: 'bu5', username: 'vintageaddict', displayName: 'VintageAddict', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vintageaddict' }, amount: 13900, timestamp: '2024-12-05T19:25:00Z', isHighest: false },
];

export const mockAuctions: Auction[] = [
  {
    id: 'a1', title: 'Vintage Rolex Submariner 5513 — 1967',
    description: 'Original patina dial, matching hands. One of the finest examples available. Full documentation and provenance included.',
    images: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80'],
    startingBid: 10000, currentBid: 15200, reservePrice: 14000, buyNowPrice: 22000,
    bidCount: 47, bidderCount: 12, status: 'live',
    endsAt: '2024-12-15T20:00:00Z', sellerId: 'u4', seller: mockUsers[3],
    category: 'Jewelry', tags: ['rolex', 'vintage', 'luxury'],
    watchCount: 892, isWatched: true, bids: mockBids, createdAt: '2024-12-01'
  },
  {
    id: 'a2', title: 'Banksy "Girl with Balloon" Signed Print #142/150',
    description: 'Authenticated Banksy screen print from Pest Control. Museum-grade archival paper. Custom framing options available.',
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b17a?w=600&q=80'],
    startingBid: 25000, currentBid: 38000, buyNowPrice: 55000,
    bidCount: 23, bidderCount: 8, status: 'live',
    endsAt: '2024-12-20T22:00:00Z', sellerId: 'u5', seller: mockUsers[4],
    category: 'Art', tags: ['banksy', 'contemporary', 'limited'],
    watchCount: 1245, isWatched: false,
    bids: mockBids.slice(0, 3).map((b, i) => ({ ...b, id: `ab${i}`, amount: 38000 - i * 2000, timestamp: '2024-12-05T19:40:00Z' })),
    createdAt: '2024-11-20'
  },
  {
    id: 'a3', title: 'PS5 Pro Launch Edition — Signed by Shuhei Yoshida',
    description: 'Extremely rare signed PS5 Pro. Signed at PlayStation showcase event. Includes certificate and photos from the signing.',
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80'],
    startingBid: 2000, currentBid: 4800,
    bidCount: 34, bidderCount: 19, status: 'live',
    endsAt: '2024-12-10T21:00:00Z', sellerId: 'u1', seller: mockUsers[0],
    category: 'Gaming', tags: ['ps5', 'signed', 'rare', 'gaming'],
    watchCount: 2341, isWatched: true,
    bids: mockBids.slice(0, 4).map((b, i) => ({ ...b, id: `ac${i}`, amount: 4800 - i * 300, timestamp: '2024-12-05T19:35:00Z' })),
    createdAt: '2024-12-02'
  },
];

// ─── Chat Messages ───

export const mockMessages: ChatMessage[] = [
  { id: 'm1', userId: 'u10', user: { id: 'u10', username: 'jake_live', displayName: 'Jake', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=jake' }, content: 'This is insane! 🔥', role: 'user', timestamp: '2024-12-05T19:45:00Z' },
  { id: 'm2', userId: 'u1', user: { id: 'u1', username: 'techhunter', displayName: 'Tech Hunter', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=techhunter' }, content: 'Wait till you see what\'s next!', role: 'seller', timestamp: '2024-12-05T19:45:30Z' },
  { id: 'm3', userId: 'u11', user: { id: 'u11', username: 'sarah_b', displayName: 'Sarah', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sarah' }, content: 'Just placed my bid! Good luck everyone 🤞', role: 'user', timestamp: '2024-12-05T19:46:00Z' },
  { id: 'm4', userId: 'u12', user: { id: 'u12', username: 'mike_collects', displayName: 'Mike', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=mike' }, content: 'How much is the reserve? 👀', role: 'user', timestamp: '2024-12-05T19:46:15Z' },
  { id: 'm5', userId: 'u13', user: { id: 'u13', username: 'collector_kate', displayName: 'Kate', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=kate' }, content: 'I\'ve been watching this for weeks. Today\'s the day!', role: 'user', timestamp: '2024-12-05T19:47:00Z' },
  { id: 'm6', userId: 'u14', user: { id: 'u14', username: 'premium_deals', displayName: 'Premium', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=premium' }, content: 'WOW the quality is amazing 🤩', role: 'user', timestamp: '2024-12-05T19:47:30Z' },
  { id: 'm7', userId: 'u1', user: { id: 'u1', username: 'techhunter', displayName: 'Tech Hunter', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=techhunter' }, content: '10% off for the next 2 minutes only! Use code LIVE10', role: 'seller', timestamp: '2024-12-05T19:48:00Z' },
  { id: 'm8', userId: 'u15', user: { id: 'u15', username: 'deal_hunter', displayName: 'DealHunter', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=dealhunter' }, content: 'LOCKED IN! 🎯', role: 'user', timestamp: '2024-12-05T19:48:15Z' },
];

// ─── Notifications ───

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'bid', title: 'You\'ve been outbid!', message: 'Someone placed a higher bid on the Rolex Submariner.', imageUrl: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=100&q=80', isRead: false, timestamp: '2024-12-05T19:42:00Z' },
  { id: 'n2', type: 'live', title: 'Tech Hunter is LIVE', message: '🔥 MEGA DROP — AirPods Max 2 Unboxing is happening now!', isRead: false, timestamp: '2024-12-05T18:00:00Z' },
  { id: 'n3', type: 'follow', title: 'New follower', message: 'sneakerqueen started following you.', isRead: false, timestamp: '2024-12-05T17:30:00Z' },
  { id: 'n4', type: 'auction', title: 'Auction ending soon', message: 'The Banksy print auction ends in 2 hours.', isRead: true, timestamp: '2024-12-05T16:00:00Z' },
  { id: 'n5', type: 'sale', title: 'Item sold!', message: 'Your PS5 Pro Bundle has been purchased. $749.00', isRead: true, timestamp: '2024-12-05T14:00:00Z' },
  { id: 'n6', type: 'system', title: 'Welcome to Klika!', message: 'Complete your profile to unlock selling features.', isRead: true, timestamp: '2024-12-01T00:00:00Z' },
];

// ─── Orders ───

export const mockOrders: Order[] = [
  {
    id: 'o1', productId: 'p5', product: mockProducts[4], seller: mockUsers[0],
    status: 'shipped', totalPrice: 749, createdAt: '2024-12-03T10:00:00Z',
    shippedAt: '2024-12-04T09:00:00Z', trackingNumber: 'KL20241204001'
  },
  {
    id: 'o2', productId: 'p2', product: mockProducts[1], seller: mockUsers[1],
    status: 'delivered', totalPrice: 385, createdAt: '2024-11-28T12:00:00Z',
    shippedAt: '2024-11-29T10:00:00Z', deliveredAt: '2024-12-02T14:00:00Z', trackingNumber: 'KL20241129001'
  },
  {
    id: 'o3', productId: 'p6', product: mockProducts[5], seller: mockUsers[2],
    status: 'pending', totalPrice: 890, createdAt: '2024-12-05T08:00:00Z'
  },
];

// ─── Shipping Steps ───

export const mockShippingSteps: ShippingStep[] = [
  { id: 's1', label: 'Order Placed', description: 'Your order has been confirmed', timestamp: '2024-12-03T10:00:00Z', status: 'completed' },
  { id: 's2', label: 'Payment Verified', description: 'Payment confirmed and processed', timestamp: '2024-12-03T10:05:00Z', status: 'completed' },
  { id: 's3', label: 'Shipped', description: 'Package picked up by carrier', timestamp: '2024-12-04T09:00:00Z', status: 'completed' },
  { id: 's4', label: 'In Transit', description: 'Package is on its way to you', timestamp: '2024-12-05T06:00:00Z', status: 'active' },
  { id: 's5', label: 'Delivered', description: 'Package will arrive at your door', status: 'pending' },
];

// ─── Live Analytics ───

export const mockAnalytics: LiveAnalytics = {
  streamId: 'l1', title: '🔥 MEGA DROP — AirPods Max 2 Unboxing Live!',
  peakViewers: 3241, averageViewers: 2180, totalDuration: 5400,
  totalRevenue: 28450, conversionRate: 8.7, productsSold: 14, newFollowers: 342,
  viewerGraph: [
    { time: '0:00', viewers: 450 }, { time: '5:00', viewers: 890 },
    { time: '10:00', viewers: 1560 }, { time: '15:00', viewers: 2100 },
    { time: '20:00', viewers: 2800 }, { time: '25:00', viewers: 3200 },
    { time: '30:00', viewers: 3241 }, { time: '35:00', viewers: 2980 },
    { time: '40:00', viewers: 3100 }, { time: '45:00', viewers: 2341 },
    { time: '50:00', viewers: 2450 }, { time: '55:00', viewers: 2680 },
  ],
  revenueGraph: [
    { time: '0:00', revenue: 0 }, { time: '5:00', revenue: 1200 },
    { time: '10:00', revenue: 4500 }, { time: '15:00', revenue: 8900 },
    { time: '20:00', revenue: 15600 }, { time: '25:00', revenue: 21200 },
    { time: '30:00', revenue: 25400 }, { time: '35:00', revenue: 26800 },
    { time: '40:00', revenue: 27500 }, { time: '45:00', revenue: 28450 },
  ],
  topProducts: [
    { product: 'MacBook Pro 16"', sold: 3, revenue: 10497 },
    { product: 'iPad Pro 13"', sold: 5, revenue: 10995 },
    { product: 'AirPods Max 2', sold: 6, revenue: 5958 },
  ],
};

// ─── Seller Insights ───

export const mockSellerInsights: SellerInsight = {
  totalRevenue: 127450, revenueChange: 23.4,
  totalOrders: 847, ordersChange: 12.1,
  avgRating: 4.9, followersCount: 45200, followersChange: 8.5,
  aiRecommendation: 'Your electronics category is trending 34% this week. Consider scheduling a live stream featuring your MacBook inventory — similar sellers saw 2.3x conversion rates during live events. Also, your Nike Air Max listing is getting high engagement but low conversion. Try reducing the price by 5% or adding a bundle deal.',
  alerts: [
    { type: 'success', message: 'You reached 45,000 followers! 🎉' },
    { type: 'warning', message: '3 items have been listed for 30+ days without a sale' },
    { type: 'info', message: 'AI suggests posting between 6-9 PM for maximum engagement' },
  ],
};

// ─── Feed Items ───

export const mockFeedItems: FeedItem[] = [
  { id: 'f1', type: 'live', live: mockLiveStreams[0], score: 0.98 },
  { id: 'f2', type: 'auction', auction: mockAuctions[0], score: 0.95 },
  { id: 'f3', type: 'product', product: mockProducts[0], score: 0.92 },
  { id: 'f4', type: 'live', live: mockLiveStreams[1], score: 0.90 },
  { id: 'f5', type: 'product', product: mockProducts[1], score: 0.88 },
  { id: 'f6', type: 'auction', auction: mockAuctions[1], score: 0.86 },
  { id: 'f7', type: 'product', product: mockProducts[3], score: 0.84 },
  { id: 'f8', type: 'live', live: mockLiveStreams[2], score: 0.82 },
  { id: 'f9', type: 'product', product: mockProducts[4], score: 0.80 },
  { id: 'f10', type: 'product', product: mockProducts[5], score: 0.78 },
  { id: 'f11', type: 'auction', auction: mockAuctions[2], score: 0.76 },
  { id: 'f12', type: 'product', product: mockProducts[6], score: 0.74 },
  { id: 'f13', type: 'product', product: mockProducts[7], score: 0.72 },
];
