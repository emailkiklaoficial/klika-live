'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  PackageOpen,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import ProductCard from '@/components/shared/ProductCard';
import SkeletonGrid from '@/components/shared/SkeletonGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MarketplaceView — Full marketplace browse
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const filterOptions = [
  { id: 'all', label: 'All', count: 8 },
  { id: 'live', label: 'Live Now', count: 3 },
  { id: 'auctions', label: 'Auctions', count: 3 },
  { id: 'new', label: 'New', count: 5 },
  { id: 'popular', label: 'Popular', count: 8 },
  { id: 'nearby', label: 'Nearby', count: 2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function MarketplaceView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showCount, setShowCount] = useState(8);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Category filter
    if (activeCategory) {
      const cat = mockCategories.find((c) => c.id === activeCategory);
      if (cat) {
        products = products.filter((p) => p.category === cat.name);
      }
    }

    // Additional filters
    if (activeFilter === 'auctions') {
      products = products.filter((p) => p.isAuction);
    } else if (activeFilter === 'live') {
      products = products.filter((p) => p.isAuction);
    } else if (activeFilter === 'new') {
      products = products.filter((p) => p.condition === 'new');
    } else if (activeFilter === 'popular') {
      products = [...products].sort((a, b) => b.likesCount - a.likesCount);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return products;
  }, [searchQuery, activeCategory, activeFilter]);

  const visibleProducts = filteredProducts.slice(0, showCount);
  const hasMore = showCount < filteredProducts.length;

  const handleCategoryClick = useCallback((cat: Category | null) => {
    setIsLoading(true);
    setShowCount(8);
    setActiveCategory(cat?.id ?? null);
    setTimeout(() => setIsLoading(false), 400);
  }, []);

  const handleFilterClick = useCallback((filterId: string) => {
    setIsLoading(true);
    setShowCount(8);
    setActiveFilter(filterId);
    setTimeout(() => setIsLoading(false), 400);
  }, []);

  const handleLoadMore = useCallback(() => {
    setShowCount((prev) => prev + 8);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <motion.div
      className="space-y-5 px-4 py-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SEARCH BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div className="relative" variants={itemVariants}>
        <div className="relative">
          <Search
            size={18}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 rounded-xl border-0 bg-muted pl-10 pr-12 text-sm shadow-none transition-colors focus-visible:bg-muted focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                onClick={clearSearch}
              >
                <X size={14} />
              </motion.button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal size={16} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CATEGORY PILLS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-1 scroll-smooth scrollbar-hide"
        variants={itemVariants}
      >
        <motion.button
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
            activeCategory === null
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCategoryClick(null)}
        >
          <span>🛍️</span>
          All
        </motion.button>
        {mockCategories.map((cat) => (
          <motion.button
            key={cat.id}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(cat)}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </motion.button>
        ))}
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FILTER BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-1 scroll-smooth scrollbar-hide"
        variants={itemVariants}
      >
        {filterOptions.map((filter) => (
          <motion.button
            key={filter.id}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
              activeFilter === filter.id
                ? 'border-primary/30 bg-primary/5 text-primary'
                : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
            )}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilterClick(filter.id)}
          >
            {filter.label}
            <Badge
              variant={activeFilter === filter.id ? 'default' : 'secondary'}
              className="h-4 min-w-4 px-1 text-[10px]"
            >
              {filter.count}
            </Badge>
          </motion.button>
        ))}
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RESULTS COUNT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="flex items-center justify-between px-1"
        variants={itemVariants}
      >
        <p className="text-xs font-medium text-muted-foreground">
          {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
          {activeCategory && (
            <span>
              {' '}in{' '}
              <span className="text-foreground">
                {mockCategories.find((c) => c.id === activeCategory)?.name}
              </span>
            </span>
          )}
        </p>
        <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          Sort by
          <ChevronDown size={14} />
        </button>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PRODUCT GRID
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonGrid count={8} type="product" />
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center gap-4 py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center rounded-full bg-muted p-4">
                <PackageOpen size={32} className="text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  No products found
                </h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-2 rounded-xl"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(null);
                  setActiveFilter('all');
                }}
              >
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {visibleProducts.map((product) => (
                <motion.div key={product.id} layout variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LOAD MORE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {hasMore && (
        <motion.div
          className="flex justify-center pt-4"
          variants={itemVariants}
          initial="hidden"
          animate="show"
        >
          <Button
            variant="outline"
            size="lg"
            className="gap-2 rounded-xl px-8 font-semibold"
            onClick={handleLoadMore}
          >
            <Loader2
              size={16}
              className={cn(
                'transition-opacity',
                false ? 'animate-spin opacity-100' : 'animate-none opacity-0'
              )}
            />
            Load More Products
          </Button>
        </motion.div>
      )}

      {/* Bottom spacer */}
      <div className="h-4" />

      {/* Custom scrollbar hide */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}
