import { useEffect, useState } from "react";
import { useBookContext } from "../hooks/useBookContext";

import BookForm from "../components/BookForm";
import BookDetails from "../components/BookDetails";

const Home = () => {
  const { books, dispatch } = useBookContext();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

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
  if (sort === "title") {
    filteredBooks = [...filteredBooks].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sort === "price") {
    filteredBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
  }

  return (
    <div className="home">
      <div className="controls">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
        </select>
      </div>
      <div className="books">
        {filteredBooks &&
          filteredBooks.map((book) => (
            <p key={book._id}>
              <BookDetails key={book._id} book={book} />
            </p>
          ))}
      </div>
      <BookForm />
    </div>
  );
};

export default Home;
