import React, { useEffect, useState, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const SearchBox = ({ className = '', placeholder = 'Search products...', onSearch, autoFocus = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products } = useProducts();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitSearch = (nextQuery) => {
    const trimmedQuery = nextQuery.trim();
    setIsFocused(false);

    if (!trimmedQuery) {
      navigate('/');
      onSearch?.();
      return;
    }

    navigate(`/?search=${encodeURIComponent(trimmedQuery)}`);
    onSearch?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    navigate('/');
    setIsFocused(false);
  };

  // Quick suggestions when typing
  const liveSuggestions = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || !products) return [];

    return products
      .filter((p) => {
        const text = [
          p.name,
          p.gender,
          Array.isArray(p.collection) ? p.collection.join(' ') : p.collection,
          ...(p.variants || []).flatMap((v) => [v.color, v.size, ...(v.keywords || [])]),
        ]
          .join(' ')
          .toLowerCase();
        return text.includes(trimmed);
      })
      .slice(0, 4);
  }, [products, query]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 shadow-xs transition-all focus-within:border-neutral-900 focus-within:shadow-md"
      >
        <Search className="text-neutral-400 shrink-0" size={17} strokeWidth={2.2} />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsFocused(true);
          }}
          placeholder={placeholder}
          className="w-full border-none bg-transparent text-xs sm:text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        )}
      </form>

      {/* Instant Dropdown Preview when focused and typing */}
      {isFocused && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl bg-white p-2 shadow-xl border border-neutral-200 z-50 overflow-hidden">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Live Drops</span>
            <span>{liveSuggestions.length} found</span>
          </div>

          {liveSuggestions.length === 0 ? (
            <div className="px-3 py-3 text-xs text-neutral-500 font-medium text-center">
              Press Enter to search "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {liveSuggestions.map((item) => {
                const img = item.variants?.[0]?.images?.[0] || 'https://placeholder.com/400x500';
                const price = item.variants?.[0]?.salePrice && item.variants?.[0]?.isSale
                  ? item.variants[0].salePrice
                  : item.variants?.[0]?.price || item.price || 0;

                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      setIsFocused(false);
                      onSearch?.();
                      navigate(`/products/${item._id}`);
                    }}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <img src={img} alt={item.name} className="h-9 w-8 object-cover rounded-lg bg-neutral-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 uppercase truncate">{item.name}</p>
                      <p className="text-[11px] font-extrabold text-[var(--color-primary)]">₹{price}</p>
                    </div>
                    <ArrowRight size={13} className="text-neutral-400 shrink-0 mr-1" />
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => submitSearch(query)}
                className="w-full text-center py-2 mt-1 border-t border-neutral-100 text-xs font-black uppercase text-[var(--color-primary)] hover:underline flex items-center justify-center gap-1 cursor-pointer"
              >
                View all results for "{query}" <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
