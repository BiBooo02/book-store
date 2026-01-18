import { useState } from "react";
import { X } from "lucide-react";
import ReviewForm from "./ReviewForm";

const CollectionModal = ({
  book,
  isOpen,
  onClose,
  onAddToCollection,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!isOpen || !book) return null;


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
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-xs w-full max-h-[80vh] overflow-y-auto"
        style={{ 
          position: 'relative',
          width: '100%',
          maxWidth: '20rem'
        }}
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

        <div className="p-5">
          <div className="flex flex-col items-center mb-6">
            <img
              src={book.image}
              alt={book.title}
              className="w-32 h-48 object-contain rounded-lg shadow-md mb-4"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x400?text=No+Cover";
              }}
            />
            <div className="text-center">
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
    </div>
  );
};

export default CollectionModal;
