import { useEffect, useState } from "react";
import { BookOpen, BookMarked, CheckCircle } from "lucide-react";
import { useBookContext } from "../hooks/useBookContext";
import BookSearch from "../components/BookSearch";
import CollectionModal from "../components/CollectionModal";
import CollectionBookCard from "../components/CollectionBookCard";

const Home = () => {
  const { collections, dispatch } = useBookContext();
  const [selectedBook, setSelectedBook] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/collections`
        );
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_COLLECTIONS", payload: json });
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, [dispatch]);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setShowCollectionModal(true);
  };

  const handleAddToCollection = async (book, collection, review = null) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/collections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...book,
            collection,
            review,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "ADD_TO_COLLECTION", payload: data });
      } else if (data.requiresReview) {
        // If review is required, show review form
        setSelectedBook({ ...book, collection: "doneReading" });
        setShowCollectionModal(true);
      } else {
        alert(data.error || "Failed to add book to collection");
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
      alert("Failed to add book to collection");
    }
  };

  const filteredCollections = collections.filter((book) => {
    if (activeTab === "all") return true;
    return book.collection === activeTab;
  });

  const collectionStats = {
    all: collections.length,
    wantToRead: collections.filter((b) => b.collection === "wantToRead").length,
    currentlyReading: collections.filter(
      (b) => b.collection === "currentlyReading"
    ).length,
    doneReading: collections.filter((b) => b.collection === "doneReading")
      .length,
  };

  return (
    <div className="home">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          My Book Collections
        </h1>
        <p className="text-white text-center">
          Track your reading journey and share your thoughts
        </p>
      </div>

      {/* Collection Tabs */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveTab("all")}
            className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            All ({collectionStats.all})
          </button>
          <button
            onClick={() => setActiveTab("wantToRead")}
            className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            <BookOpen className="w-4 h-4 text-white" />
            Want to Read ({collectionStats.wantToRead})
          </button>
          <button
            onClick={() => setActiveTab("currentlyReading")}
            className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            <BookMarked className="w-4 h-4 text-white" />
            Currently Reading ({collectionStats.currentlyReading})
          </button>
          <button
            onClick={() => setActiveTab("doneReading")}
            className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            Done Reading ({collectionStats.doneReading})
          </button>
        </div>
      </div>

      {/* Book Search */}
      <BookSearch onBookSelect={handleBookSelect} />

      {/* Collections Display */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          {activeTab === "all" && "All Books"}
          {activeTab === "wantToRead" && "Want to Read"}
          {activeTab === "currentlyReading" && "Currently Reading"}
          {activeTab === "doneReading" && "Done Reading"}
        </h2>

        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollections.map((book) => (
              <CollectionBookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center mt-10">
            <BookOpen className="w-16 h-16 text-white mx-auto mb-4 mt-10" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No books in this collection yet
            </h3>
            <p className="text-white">
              Search for books above and add them to your collections
            </p>
          </div>
        )}
      </div>

      {/* Collection Modal */}
      <CollectionModal
        book={selectedBook}
        isOpen={showCollectionModal}
        onClose={() => {
          setShowCollectionModal(false);
          setSelectedBook(null);
        }}
        onAddToCollection={handleAddToCollection}
      />
    </div>
  );
};

export default Home;
