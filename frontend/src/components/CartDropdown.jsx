import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useBookContext } from "../hooks/useBookContext";

const CartDropdown = ({ isOpen, onClose }) => {
  const { cart, dispatch } = useBookContext();

  const total = cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { _id: id, quantity } });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { _id: id } });
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 z-9999 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Shopping Cart</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        {(!cart || cart.length === 0) ? (
          <div className="p-8 text-center text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item._id} className="p-4 border-b border-gray-50 flex items-center gap-3">
              <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500">${item.price}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      
      {cart && cart.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Total: ${total.toFixed(2)}</span>
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;