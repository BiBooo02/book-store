import {useEffect} from 'react';
import {useBookContext} from '../hooks/useBookContext';

import BookForm from '../components/BookForm';
import BookDetails from '../components/BookDetails';

const Home = () => {
 const {books, dispatch} = useBookContext();


 useEffect(() => {
  const fetchBooks = async () => {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/books`);
   const json = await response.json();

   if (response.ok) {
    dispatch({type: 'SET_BOOKS', payload: json})
   }
  }

  fetchBooks()
 }, [dispatch])
  return (
    <div className="home">
     <div className="books">
      {books && books.map((book) => (
       <p key={book._id}>
        <BookDetails key={book._id} book={book} />
       </p>
      ))}
     </div>
     <BookForm />
    </div>
  )
}

export default Home