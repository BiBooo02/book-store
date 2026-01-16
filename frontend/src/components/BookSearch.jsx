import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useBookContext } from "../hooks/useBookContext";

const BookSearch = ({ onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useBookContext();

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Using Open Library API
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchQuery
        )}&limit=30`
      );
      const data = await response.json();

      if (data.docs && data.docs.length > 0) {
        const books = data.docs.map((book) => ({
          bookId:
            book.key?.replace("/works/", "") ||
            book.cover_edition_key ||
            Math.random().toString(),
          title: book.title || "Unknown Title",
          author: book.author_name || ["Unknown Author"],
          description: book.first_sentence?.[0] || "",
          image: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "https://via.placeholder.com/300x400?text=No+Cover",
          publishedDate: book.first_publish_year?.toString() || "",
          isbn: book.isbn?.[0] || "",
        }));
        setSearchResults(books);
        dispatch({ type: "SET_SEARCH_RESULTS", payload: books });
      } else {
        setSearchResults([]);
        setError("No books found. Try a different search term.");
      }
    } catch (err) {
      setError("Failed to search books. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Search for Books
      </h3>

      <form onSubmit={searchBooks} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg
               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search Books"}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </form>

      {searchResults.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Search Results ({searchResults.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {searchResults.map((book) => (
              <div
                key={book.bookId}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer flex flex-col items-center"
                onClick={() => onBookSelect(book)}
              >
                <div className="w-full flex justify-center mb-3">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-28 h-40 sm:w-32 sm:h-48 object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x400?text=No+Cover";
                    }}
                  />
                </div>
                <h5 className="font-semibold text-white line-clamp-2 mb-1 text-center">
                  {book.title}
                </h5>
                <p className="text-sm text-white mb-2 text-center">
                  by{" "}
                  {Array.isArray(book.author)
                    ? book.author.join(", ")
                    : book.author}
                </p>
                {book.publishedDate && (
                  <p className="text-xs text-white text-center">{book.publishedDate}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <BookOpen className="w-16 h-16 text-white mx-auto mb-4 mt-4" />
          <p className="text-white">
            Search for books to add to your collections
          </p>
        </div>
      )}
    </div>
  );
};

export default BookSearch;
