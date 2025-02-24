import { BookContext } from "../context/BookContext";
import { useContext } from "react"

export const useBookContext = () => {
 const context = useContext(BookContext);

 if(!context) {
  throw Error('useBooksContext must be used inside an BooksContextProvider')
 }

 return context
}