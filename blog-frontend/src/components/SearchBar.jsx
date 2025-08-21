import { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Rechercher des articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Rechercher"
      />
      <button 
        type="button" 
        className="search-button"
        onClick={handleClear}
        style={{ display: query ? 'block' : 'none' }}
        aria-label="Effacer la recherche"
      >
        <X size={18} />
      </button>
      <button type="submit" className="search-button" aria-label="Rechercher">
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
