import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetailsPage from "./pages/BookDetailsPage";
import "./styles.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/:id" element={<BookDetailsPage />} />
    </Routes>
  );
};

export default App;
