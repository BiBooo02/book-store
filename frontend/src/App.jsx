import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetailsPage from "./pages/BookDetailsPage";
import Navbar from "./components/Navbar";
import "./styles.css";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;