import { create } from 'zustand';
import type { ViewId, User, CartItem, Product } from '@/types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Navigation Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface NavigationState {
  currentView: ViewId;
  previousView: ViewId | null;
  viewParams: Record<string, string>;
  searchQuery: string;
  navigate: (view: ViewId, params?: Record<string, string>) => void;
  goBack: () => void;
  setSearchQuery: (q: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentView: 'home',
  previousView: null,
  viewParams: {},
  searchQuery: '',
  navigate: (view, params = {}) =>
    set((s) => ({
      previousView: s.currentView,
      currentView: view,
      viewParams: params,
    })),
  goBack: () =>
    set((s) => ({
      currentView: s.previousView || 'home',
      previousView: null,
    })),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (l: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setLoading: (l) => set({ isLoading: l }),
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auction Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Auction, Bid } from '@/types';

interface AuctionState {
  currentAuction: Auction | null;
  bids: Bid[];
  userBid: number | null;
  isBidding: boolean;
  bidHistory: Bid[];
  setAuction: (auction: Auction) => void;
  addBid: (bid: Bid) => void;
  placeBid: (amount: number) => void;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
  currentAuction: null,
  bids: [],
  userBid: null,
  isBidding: false,
  bidHistory: [],
  setAuction: (auction) => set({ currentAuction: auction, bids: auction.bids }),
  addBid: (bid) => set((s) => ({ bids: [bid, ...s.bids] })),
  placeBid: (amount) =>
    set((s) => ({
      isBidding: true,
      userBid: amount,
    })),
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Live Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { LiveStream, ChatMessage } from '@/types';

interface LiveState {
  currentStream: LiveStream | null;
  messages: ChatMessage[];
  viewerCount: number;
  isLive: boolean;
  reactions: { emoji: string; x: number; y: number; id: string }[];
  setStream: (stream: LiveStream) => void;
  addMessage: (msg: ChatMessage) => void;
  setViewerCount: (count: number) => void;
  addReaction: (emoji: string) => void;
  removeReaction: (id: string) => void;
}

export const useLiveStore = create<LiveState>((set) => ({
  currentStream: null,
  messages: [],
  viewerCount: 0,
  isLive: false,
  reactions: [],
  setStream: (stream) =>
    set({ currentStream: stream, isLive: stream.status === 'live', viewerCount: stream.viewerCount }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages.slice(-50), msg] })),
  setViewerCount: (count) => set({ viewerCount: count }),
  addReaction: (emoji) =>
    set((s) => ({
      reactions: [
        ...s.reactions,
        { emoji, x: 20 + Math.random() * 60, y: 80, id: Math.random().toString() },
      ],
    })),
  removeReaction: (id) =>
    set((s) => ({ reactions: s.reactions.filter((r) => r.id !== id) })),
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Cart Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) =>
    set((s) => {
      const existing = s.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [
          ...s.items,
          { id: Math.random().toString(), product, quantity: 1, addedAt: new Date().toISOString() },
        ],
      };
    }),
  removeItem: (productId) =>
    set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) })),
  updateQuantity: (productId, qty) =>
    set((s) => ({
      items: s.items.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i)),
    })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UI Store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface UIState {
  isSearchOpen: boolean;
  activeBottomTab: string;
  setSearchOpen: (open: boolean) => void;
  setActiveBottomTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  activeBottomTab: 'home',
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),
}));
