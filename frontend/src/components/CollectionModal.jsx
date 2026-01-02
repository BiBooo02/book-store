import { useState } from "react";
import { X } from "lucide-react";
import ReviewForm from "./ReviewForm";

const CollectionModal = ({
  book,
  isOpen,
  onClose,
  onAddToCollection,
  position,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!isOpen || !book) return null;

  // Calculate modal position to appear near the clicked book
  const getModalStyle = () => {
    if (!position) return {};

    const modalWidth = 400; // approximate modal width
    const modalHeight = 500; // approximate modal height
    const padding = 20;

    let left = position.x;
    let top = position.y;

    // Adjust if modal would go off screen
    if (left + modalWidth / 2 > window.innerWidth - padding) {
      left = window.innerWidth - modalWidth / 2 - padding;
    }
    if (left - modalWidth / 2 < padding) {
      left = modalWidth / 2 + padding;
    }
    if (top + modalHeight / 2 > window.innerHeight - padding) {
      top = window.innerHeight - modalHeight / 2 - padding;
    }
    if (top - modalHeight / 2 < padding) {
      top = modalHeight / 2 + padding;
    }

    return {
      position: "fixed",
      left: `${left}px`,
      top: `${top}px`,
      transform: "translate(-50%, -50%)",
    };
  };

  const handleCollectionSelect = (collection) => {
    if (collection === "doneReading") {
      setShowReviewForm(true);
    } else {
      handleSubmit(collection);
    }
  };

  const handleSubmit = (collection, review = null) => {
    onAddToCollection(book, collection, review);
    setShowReviewForm(false);
    onClose();
  };

  const handleReviewSubmit = (review) => {
    handleSubmit("doneReading", review);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>
      <div
        className="fixed z-50 bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={getModalStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Add to Collection</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <img
              src={book.image}
              alt={book.title}
              className="w-24 h-32 object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x400?text=No+Cover";
              }}
            />
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-gray-800 mb-1">
                {book.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                by{" "}
                {Array.isArray(book.author)
                  ? book.author.join(", ")
                  : book.author}
              </p>
              {book.publishedDate && (
                <p className="text-xs text-gray-500">{book.publishedDate}</p>
              )}
            </div>
          </div>

          {!showReviewForm ? (
            <div className="space-y-3">
              <button
                onClick={() => handleCollectionSelect("wantToRead")}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>📚</span>
                Want to Read
              </button>
              <button
                onClick={() => handleCollectionSelect("currentlyReading")}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>📖</span>
                Currently Reading
              </button>
              <button
                onClick={() => handleCollectionSelect("doneReading")}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>✅</span>
                Done Reading
              </button>
            </div>
          ) : (
            <ReviewForm
              onSubmit={handleReviewSubmit}
              onCancel={() => {
                setShowReviewForm(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionModal;
