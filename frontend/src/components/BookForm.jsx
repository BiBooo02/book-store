import { useState } from "react";
import { useBookContext } from "../hooks/useBookContext";

const BookForm = () => {
 const { dispatch } = useBookContext();

 const [title, setTitle] = useState("");
 const [author, setAuthor] = useState("");
 const [description, setDescription] = useState("");
 const [price, setPrice] = useState(null);
 const [image, setImage] = useState("");
 const [error, setError] = useState(null);
 const [emptyFields, setEmptyFields] = useState([])

 const handleSubmit = async (e) => {
   e.preventDefault();

   const book = { title, author, description, price, image };

   const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/books`, {
     method: "POST",
     body: JSON.stringify(book),
     headers: {
       "Content-Type": "application/json",
     },
   });
   const json = await response.json();

   if (!response.ok) {
     setError(json.error);
     setEmptyFields(json.emptyFields)
   }
   if (response.ok) {
     setTitle("");
     setAuthor("");
     setDescription("");
     setPrice(null);
     setImage("");
     setError(null);
     console.log("New book added", json);
     dispatch({type: 'CREATE_BOOK', payload: json})
   }
 };

 return (
   <form className="create" onSubmit={handleSubmit}>
     <h3>Add a New Book</h3>

     <label>Book Title:</label>
     <input
       type="text"
       onChange={(e) => setTitle(e.target.value)}
       value={title}
       className={emptyFields.includes('title') ? 'error' : ''}
     />

     <label>Author:</label>
     <input
       type="text"
       onChange={(e) => setAuthor(e.target.value)}
       value={author}
       className={emptyFields.includes('author') ? 'error' : ''}
     />

     <label>Description:</label>
     <input
       type="text"
       onChange={(e) => setDescription(e.target.value)}
       value={description}
       className={emptyFields.includes('description') ? 'error' : ''}
     />

    <label>Price:</label>
     <input
       type="number"
       onChange={(e) => setPrice(e.target.value)}
       value={price}
       className={emptyFields.includes('price') ? 'error' : ''}
     />

    <label>Image:</label>
     <input
       type="text"
       onChange={(e) => setImage(e.target.value)}
       value={image}
       className={emptyFields.includes('image') ? 'error' : ''}
     />   

     <button>Add Book</button>
     {error && <div className="error">{error}</div>}
   </form>
 );
};

export default BookForm