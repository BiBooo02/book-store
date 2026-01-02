import { createContext, useReducer } from "react";

export const BookContext = createContext();

export const booksReducer = (state, action) => {
  switch (action.type) {
    case "SET_COLLECTIONS":
      return {
        ...state,
        collections: action.payload,
      };
    case "ADD_TO_COLLECTION":
      return {
        ...state,
        collections: [action.payload, ...state.collections],
      };
    case "UPDATE_COLLECTION":
      return {
        ...state,
        collections: state.collections.map((book) =>
          book._id === action.payload._id ? action.payload : book
        ),
      };
    case "REMOVE_FROM_COLLECTION":
      return {
        ...state,
        collections: state.collections.filter(
          (b) => b._id !== action.payload._id
        ),
      };
    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: action.payload,
      };
    default:
      return state;
  }
};

export const BooksContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(booksReducer, {
    collections: [],
    searchResults: [],
  });

  return (
    <BookContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BookContext.Provider>
  );
};
