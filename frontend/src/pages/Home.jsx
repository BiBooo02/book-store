import { useEffect, useState } from "react";
import { Search, Filter, Grid, List, BookOpen } from 'lucide-react';
import { useBookContext } from "../hooks/useBookContext";

import BookForm from "../components/BookForm";
import BookDetails from "../components/BookDetails";

// View Toggle Component
const ViewToggle = ({ view, onViewChange }) => (
  <div className="flex bg-white/20 rounded-lg p-1">
    <button
      onClick={() => onViewChange('grid')}
      className={`p-2 rounded transition-all ${
        view === 'grid'
          ? 'bg-white/30 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      <Grid className="w-5 h-5" />
    </button>
    <button
      onClick={() => onViewChange('list')}
      className={`p-2 rounded transition-all ${
        view === 'list'
          ? 'bg-white/30 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      <List className="w-5 h-5" />
    </button>
  </div>
);

// Advanced Filter Component
const AdvancedFilter = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
      >
        <Filter className="w-5 h-5" />
        Filters
        {Object.values(filters).some(v => v) && (
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 z-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                  className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                  className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="romance">Romance</option>
                <option value="sci-fi">Science Fiction</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.inStock || false}
                  onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onFiltersChange({})}
                className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EnhancedHome = () => {
  const { books, dispatch } = useBookContext();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/books`
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_BOOKS", payload: json });
      }
    };

    fetchBooks();
  }, [dispatch]);

  // Filter and sort books
  let filteredBooks = books || [];
  
  if (search) {
    filteredBooks = filteredBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filters.minPrice) {
    filteredBooks = filteredBooks.filter(book => book.price >= parseFloat(filters.minPrice));
  }
  if (filters.maxPrice) {
    filteredBooks = filteredBooks.filter(book => book.price <= parseFloat(filters.maxPrice));
  }

  if (sort === "title") {
    filteredBooks = [...filteredBooks].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sort === "price") {
    filteredBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
  }

  return (
    <div className="home">
      {/* Enhanced Controls */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 w-80"
              />
            </div>
            
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">Sort By</option>
              <option value="title">Title</option>
              <option value="price">Price</option>
            </select>
            
            <AdvancedFilter filters={filters} onFiltersChange={setFilters} />
          </div>
          
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {/* Books Grid/List */}
      <div className={`${
        view === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      } mb-8`}>
        {filteredBooks &&
          filteredBooks.map((book) => (
            <BookDetails key={book._id} book={book} view={view} />
          ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
          <p className="text-white/70">Try adjusting your search or filters</p>
        </div>
      )}

      <BookForm />
    </div>
  );
};

export default EnhancedHome;