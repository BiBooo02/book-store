import { useState } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookContext } from "../hooks/useBookContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Rating from './Rating';

const BookDetails = ({ book, view = 'grid' }) => {
  const { dispatch } = useBookContext();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: book });
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: book });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/books/` + book._id,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      dispatch({ type: "DELETE_BOOK", payload: book });
    }
  };

  const rating = book.rating || Math.random() * 2 + 3;
  const isNew = Math.random() > 0.7;
  const isBestseller = Math.random() > 0.8;

  if (view === 'list') {
    return (
      <Link
        to={`/books/${book._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
        className="block"
      >
        <div className="book-card-list bg-white/95 backdrop-blur-md rounded-xl p-4 flex gap-4 hover:shadow-xl transition-all duration-300">
          <img src={book.image} alt={book.title} className="w-20 h-28 object-cover rounded-lg" />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-800">{book.title}</h3>
              <div className="flex gap-2">
                <button onClick={handleToggleFavorite} className="p-1 hover:bg-red-50 rounded">
                  <Heart className={`w-5 h-5 ${book.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                </button>
                <button onClick={handleAddToCart} className="p-1 hover:bg-blue-50 rounded">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">by {book.author}</p>
            <Rating rating={rating} readonly size="sm" />
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{book.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xl font-bold text-blue-600">${book.price}</span>
              <div className="flex gap-2 items-center">
                {isNew && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">New</span>}
                {isBestseller && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Bestseller</span>}
                <button onClick={handleDelete} className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full hover:bg-red-200 transition-colors">
                  Delete
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/books/${book._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
      className="block"
    >
      <div
        className="book-card group relative bg-white/95 backdrop-blur-md rounded-xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          {isNew && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
              New
            </span>
          )}
          {isBestseller && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
              Bestseller
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleToggleFavorite}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
          >
            <Heart className={`w-5 h-5 ${book.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <img 
            src={book.image} 
            alt={book.title} 
            className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 text-sm">by {book.author}</p>
          <Rating rating={rating} readonly size="sm" />
          <p className="text-sm text-gray-500 line-clamp-2">{book.description}</p>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-blue-600">${book.price}</span>
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {Math.floor(Math.random() * 1000) + 100}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
          </p>
          <button 
            onClick={handleDelete} 
            className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BookDetails;