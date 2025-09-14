import { useState } from 'react';
import { useBookContext } from "../hooks/useBookContext";

const BookForm = () => {
  const { dispatch } = useBookContext();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isbn: '',
    pages: ''
  });
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [imagePreview, setImagePreview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const book = { 
      title: formData.title, 
      author: formData.author, 
      description: formData.description, 
      price: formData.price, 
      image: formData.image 
    };

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
      setEmptyFields(json.emptyFields || []);
    }
    if (response.ok) {
      // Reset form
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        image: '',
        category: '',
        isbn: '',
        pages: ''
      });
      setImagePreview('');
      setError(null);
      setEmptyFields([]);
      console.log("New book added", json);
      dispatch({type: 'CREATE_BOOK', payload: json});
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Book
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Cover Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={handleImageChange}
              placeholder="https://example.com/book-cover.jpg"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                emptyFields.includes('image') ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-44 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                emptyFields.includes('title') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                emptyFields.includes('author') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="mystery">Mystery</option>
              <option value="romance">Romance</option>
              <option value="sci-fi">Science Fiction</option>
              <option value="fantasy">Fantasy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                emptyFields.includes('price') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ISBN (Optional)
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="978-0-123456-78-9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pages (Optional)
            </label>
            <input
              type="number"
              value={formData.pages}
              onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="250"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                emptyFields.includes('description') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter book description..."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg"
        >
          Add Book to Store
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default BookForm;