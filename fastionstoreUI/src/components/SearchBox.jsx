import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchBox = ({ className = '', placeholder = 'Search products...', onSearch }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const submitSearch = (nextQuery) => {
    const trimmedQuery = nextQuery.trim();

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
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 px-3 py-2 shadow-sm ${className}`}
    >
      <Search className="text-[var(--color-text-muted)]" size={18} strokeWidth={2} />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
      />

      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
        >
          <X size={15} strokeWidth={2} />
        </button>
      )}
    </form>
  );
};

export default SearchBox;
