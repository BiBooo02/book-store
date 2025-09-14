import {createContext, useReducer } from 'react'

export const BookContext = createContext()

export const booksReducer = (state, action) => {
  switch(action.type) {
   case 'SET_BOOKS':
    return {
     ...state,
     books: action.payload
    }
   case 'CREATE_BOOK':
    return {
     ...state,
     books: [action.payload, ...state.books]
    }
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter((b) => b._id !== action.payload._id)
      }
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        books: state.books.map(book => 
          book._id === action.payload._id 
            ? { ...book, isFavorite: !book.isFavorite }
            : book
        )
      }
    case 'ADD_TO_CART': {
      const existingItem = (state.cart || []).find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...(state.cart || []), { ...action.payload, quantity: 1 }]
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: (state.cart || []).filter(item => item._id !== action.payload._id)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: (state.cart || []).map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
   default:
    return state
  }
}

export const BooksContextProvider  = ({children}) => {
 const [state, dispatch] = useReducer(booksReducer, {
  books: [],
  cart: [],
  favorites: []
 });

 return (
  <BookContext.Provider value={{...state, dispatch}}>
   { children }
  </BookContext.Provider>
 )
}