import { useBookContext } from "../hooks/useBookContext";

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Link } from "react-router-dom";

const BookDetails = ({ book }) => {
  const { dispatch } = useBookContext();

  const handleClick = async () => {
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
  return (
    <Link
      to={`/books/${book._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="book-details">
        <img src={book.image} alt={book.title} />
        <h3>{book.title}</h3>
        <p>Author: {book.author}</p>
        <p>Description: {book.description}</p>
        <p>
          <strong>Price:</strong> {book.price}{" "}
        </p>
        <p>
          {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
        </p>
        <button onClick={handleClick}>Delete</button>
      </div>
    </Link>
  );
};

export default BookDetails;
