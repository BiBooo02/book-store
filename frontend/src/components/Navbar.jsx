import  { useState } from 'react';
import { Book, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookContext } from "../hooks/useBookContext";
import CartDropdown from './CartDropdown';

const Navbar = () => {
  const { cart } = useBookContext();
  const [cartOpen, setCartOpen] = useState(false);

  const cartItemsCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="navbar sticky top-0 z-40">
      <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="logo flex items-center gap-2">
          <Book className="w-8 h-8" />
          <h1 className="text-2xl font-bold">BookVerse</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <CartDropdown isOpen={cartOpen} onClose={() => setCartOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;