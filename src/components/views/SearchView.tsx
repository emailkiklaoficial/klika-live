'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  TrendingUp,
  Clock,
  ArrowUpRight,
  PackageOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SearchView — Full search experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const trendingSearches = [
  'Nike Air Jordan',
  'MacBook Pro',
  'Vintage Rolex',
  'PS5 Pro',
  'Banksy Print',
  'Rare Sneakers',
  'Fine Jewelry',
  'Apple Watch',
];

const recentSearches = [
  'AirPods Max',
  'Sneaker Queen',
  'Vintage Denim',
  'Gaming Bundle',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

// Suggestion type derived from products
interface SearchSuggestion {
  text: string;
  category: string;
  image?: string;
  type: 'product' | 'category' | 'seller';
}

export default function SearchView() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [localRecentSearches, setLocalRecentSearches] = useState(recentSearches);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Generate suggestions from mock data
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchSuggestion[] = [];

    // Match products
    mockProducts.forEach((p) => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          text: p.title,
          category: p.category,
          image: p.images[0],
          type: 'product',
        });
      }
    });

    // Match categories
    mockCategories.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        results.push({
          text: c.name,
          category: 'Category',
          type: 'category',
        });
      }
    });

    return results.slice(0, 5);
  }, [query]);

  // Search results
  const searchResults = useMemo(() => {
    if (!showResults) return [];
    // For demo, show all products when searching
    return mockProducts;
  }, [showResults]);

  const handleSearch = (searchTerm?: string) => {
    const term = searchTerm || query;
    if (!term.trim()) return;

    setQuery(term);
    setShowResults(true);
    setIsFocused(false);

    // Add to recent searches
    setLocalRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== term);
      return [term, ...filtered].slice(0, 8);
    });
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const handleClear = () => {
    setQuery('');
    setShowResults(false);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  const isSearchActive = showResults && query.trim().length > 0;

  return (
    <motion.div
      className="px-4 py-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SEARCH INPUT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div className="relative" variants={itemVariants}>
        <div className="relative">
          <Search
            size={18}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, brands, sellers..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (showResults && !e.target.value.trim()) {
                setShowResults(false);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="h-12 rounded-xl border-0 bg-muted pl-10 pr-12 text-sm shadow-none transition-colors focus-visible:bg-muted focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                onClick={handleClear}
              >
                <X size={14} />
              </motion.button>
            )}
          </div>
        </div>

        {/* ─── Auto-suggest dropdown ─── */}
        <AnimatePresence>
          {isFocused && suggestions.length > 0 && !showResults && (
            <motion.div
              className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border/50 bg-card shadow-xl"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <div className="p-1">
                {suggestions.map((suggestion, i) => (
                  <motion.button
                    key={`${suggestion.text}-${i}`}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                    onClick={() => handleSuggestionClick(suggestion)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    {suggestion.image ? (
                      <img
                        src={suggestion.image}
                        alt={suggestion.text}
                        className="size-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Search size={16} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">
                        {suggestion.text}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {suggestion.category}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 text-muted-foreground/40"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CONTENT AREA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatePresence mode="wait">
        {isSearchActive ? (
          /* ─── Search Results ─── */
          <motion.div
            key="results"
            className="mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-4 flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">
                Showing all results for &ldquo;
                <span className="text-foreground">{query}</span>&rdquo;
              </p>
              <Badge variant="secondary" className="text-[10px]">
                {searchResults.length} items
              </Badge>
            </div>

            {searchResults.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {searchResults.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center gap-4 py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-center rounded-full bg-muted p-4">
                  <PackageOpen size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  No results found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try a different search term
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ─── Default: Trending & Recent ─── */
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ─── Trending Searches ─── */}
            <motion.div className="mt-6" variants={itemVariants}>
              <div className="mb-3 flex items-center gap-2 px-1">
                <TrendingUp size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Trending Searches
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, i) => (
                  <motion.button
                    key={term}
                    className="flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleRecentClick(term)}
                  >
                    <span className="text-primary/60">{i + 1}</span>
                    {term}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ─── Recent Searches ─── */}
            {localRecentSearches.length > 0 && (
              <motion.div className="mt-6" variants={itemVariants}>
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Recent
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => setLocalRecentSearches([])}
                  >
                    Clear all
                  </Button>
                </div>
                <div className="space-y-0.5">
                  {localRecentSearches.map((term, i) => (
                    <motion.button
                      key={term}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted"
                      onClick={() => handleRecentClick(term)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Clock
                        size={14}
                        className="shrink-0 text-muted-foreground/50"
                      />
                      <span className="text-sm text-muted-foreground">
                        {term}
                      </span>
                      <X
                        size={12}
                        className="ml-auto shrink-0 text-muted-foreground/30 hover:text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocalRecentSearches((prev) =>
                            prev.filter((s) => s !== term)
                          );
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── Explore Categories ─── */}
            <motion.div className="mt-6" variants={itemVariants}>
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className="text-sm font-semibold text-foreground">
                  Explore Categories
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {mockCategories.slice(0, 8).map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-card p-3 text-left transition-colors hover:bg-muted"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSearch(cat.name)}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {cat.count.toLocaleString()} items
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom spacer */}
      <div className="h-4" />
    </motion.div>
  );
}
