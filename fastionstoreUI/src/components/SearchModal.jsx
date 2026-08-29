import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, TrendingUp, Sparkles, ArrowRight, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const POPULAR_SEARCHES = [
  'Oversized Tees',
  'Heavyweight Hoodies',
  'Baggy Cargos',
  'Acid Wash',
  '280 GSM Cotton',
  'Clearance Sale',
  'Black Oversized',
  'Streetwear Men',
];

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('genz_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  // Autofocus when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const saveRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem('genz_recent_searches', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('genz_recent_searches');
    } catch {
      // Ignore
    }
  };

  const handleSelectSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    onClose();
    navigate(`/?search=${encodeURIComponent(trimmed)}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSelectSearch(query);
  };

  // Instant live matched products based on query
  const liveResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || !products) return [];

    return products
      .map((product) => {
        const matchedVariant = product.variants?.find((v) => {
          const haystack = [v.color, v.size, ...(v.keywords || [])].join(' ').toLowerCase();
          return haystack.includes(trimmed);
        });

        const haystack = [
          product.name,
          product.description,
          product.gender,
          product.brand,
          Array.isArray(product.collection) ? product.collection.join(' ') : product.collection,
          ...(product.variants || []).flatMap((v) => [v.color, v.size, ...(v.keywords || [])]),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (haystack.includes(trimmed)) {
          const activeVar = matchedVariant || product.variants?.[0];
          const img = activeVar?.images?.[0] || 'https://placeholder.com/400x500';
          const price = activeVar?.salePrice && activeVar.isSale ? activeVar.salePrice : (activeVar?.price || product.price || 0);
          const origPrice = activeVar?.price || product.price || 0;

          return {
            ...product,
            activeImage: img,
            activePrice: price,
            originalPrice: origPrice,
            isSale: activeVar?.isSale,
            colorCount: product.variants ? new Set(product.variants.map((v) => v.color).filter(Boolean)).size : 0,
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 6);
  }, [products, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Search Card Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-auto w-full max-w-3xl bg-white shadow-2xl md:mt-12 md:rounded-3xl border border-neutral-200/80 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-neutral-100 bg-white">
              <form onSubmit={handleFormSubmit} className="relative flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-800">
                  <Search size={20} strokeWidth={2.5} />
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search oversized tees, hoodies, cargos, wash..."
                  className="w-full bg-transparent text-base sm:text-lg font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  ESC
                </button>
              </form>
            </div>

            {/* Modal Body: Live Results or Suggestions */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[calc(92vh-100px)]">
              {/* If Query has matching live results */}
              {query.trim() && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                      Live Product Drops ({liveResults.length})
                    </span>
                    {liveResults.length > 0 && (
                      <button
                        onClick={() => handleSelectSearch(query)}
                        className="flex items-center gap-1 text-xs font-black uppercase text-[var(--color-primary)] hover:underline"
                      >
                        View All Matches <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {liveResults.length === 0 ? (
                    <div className="py-8 text-center bg-neutral-50 rounded-2xl border border-neutral-100">
                      <p className="text-sm font-bold text-neutral-800">No products found for "{query}"</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Try searching for "Oversized", "Hoodie", "Cargo", "Cotton", or "Black"
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {liveResults.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            saveRecentSearch(product.name);
                            onClose();
                            navigate(`/products/${product._id}`);
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-2xl border border-neutral-100 hover:border-neutral-300 bg-white hover:bg-neutral-50/80 transition-all cursor-pointer group"
                        >
                          <div className="h-16 w-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                            <img
                              src={product.activeImage}
                              alt={product.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.target.src = 'https://placeholder.com/400x500';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block truncate">
                              {product.gender || 'Streetwear'} • {product.colorCount > 1 ? `${product.colorCount} Colors` : 'In Stock'}
                            </span>
                            <h4 className="text-xs font-bold text-neutral-900 uppercase truncate group-hover:text-[var(--color-primary)] transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-extrabold text-neutral-900">
                                ₹{product.activePrice}
                              </span>
                              {product.isSale && product.originalPrice > product.activePrice && (
                                <span className="text-[10px] font-bold text-neutral-400 line-through">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowUpRight size={16} className="text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0 mr-1" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-400">
                      <Clock size={13} /> Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="flex items-center gap-1 text-[11px] font-bold uppercase text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={12} /> Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectSearch(term)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white text-xs font-bold text-neutral-700 transition-colors"
                      >
                        <Clock size={12} className="opacity-50" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending & Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-400 mb-2.5">
                  <TrendingUp size={13} className="text-[var(--color-primary)]" /> Trending Streetwear Fits
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearch(tag)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white text-xs font-bold text-neutral-800 transition-all shadow-2xs cursor-pointer"
                    >
                      <Sparkles size={11} className="text-amber-500" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Category Jump */}
              <div className="pt-3 border-t border-neutral-100">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-400 block mb-2">
                  Explore Curated Drops
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Oversized Tees', link: '/collections/oversized' },
                    { label: 'Heavy Hoodies', link: '/collections/hoodies' },
                    { label: 'Baggy Cargos', link: '/collections/cargos' },
                    { label: 'Clearance Sale', link: '/sale' },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onClose();
                        navigate(item.link);
                      }}
                      className="p-3 text-left rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-extrabold uppercase text-neutral-900 block truncate">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-medium">Browse Drop →</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
