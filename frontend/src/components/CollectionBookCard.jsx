import { useState } from "react";
import { Trash2, Edit, Star } from "lucide-react";
import { useBookContext } from "../hooks/useBookContext";
import ReviewForm from "./ReviewForm";

const CollectionBookCard = ({ book }) => {
  const { dispatch } = useBookContext();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleRemove = async () => {
    if (window.confirm("Remove this book from your collection?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/collections/${
            book._id
          }`,
          { method: "DELETE" }
        );

        if (response.ok) {
          dispatch({ type: "REMOVE_FROM_COLLECTION", payload: book });
        }
      } catch (error) {
        console.error("Error removing book:", error);
      }
    }
  };

  const handleUpdateCollection = async (newCollection, review = null) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/collections/${
          book._id
        }`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection: newCollection, review }),
        }
      );

      if (response.ok) {
        const updatedBook = await response.json();
        dispatch({ type: "UPDATE_COLLECTION", payload: updatedBook });
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  const getCollectionBadge = () => {
    const badges = {
      wantToRead: { text: "Want to Read", color: "bg-blue-500" },
      currentlyReading: { text: "Currently Reading", color: "bg-green-500" },
      doneReading: { text: "Done Reading", color: "bg-purple-500" },
    };
    const badge = badges[book.collection] || badges.wantToRead;
    return (
      <span
        className={`${badge.color} text-white text-xs px-2 py-1 rounded-full font-medium`}
      >
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
      <div className="flex gap-4">
        <img
          src={
            book.image || "https://via.placeholder.com/300x400?text=No+Cover"
          }
          alt={book.title}
          className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x400?text=No+Cover";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                {book.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                by{" "}
                {Array.isArray(book.author)
                  ? book.author.join(", ")
                  : book.author}
              </p>
              {getCollectionBadge()}
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
              title="Remove from collection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {book.collection === "doneReading" && book.review ? (
            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= book.review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {book.review.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-700">{book.review.review}</p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit Review
              </button>
            </div>
          ) : book.collection === "doneReading" && !book.review ? (
            <div className="mt-3">
              <button
                onClick={() => setShowReviewForm(true)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Add Review (Required)
              </button>
            </div>
          ) : null}

          {showReviewForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <ReviewForm
                onSubmit={(review) =>
                  handleUpdateCollection("doneReading", review)
                }
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {book.collection !== "doneReading" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleUpdateCollection("wantToRead")}
                className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Want to Read
              </button>
              <button
                onClick={() => handleUpdateCollection("currentlyReading")}
                className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Currently Reading
              </button>
              <button
                onClick={() => setShowReviewForm(true)}
                className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Mark as Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionBookCard;
