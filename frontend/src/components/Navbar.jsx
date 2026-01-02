import { Book } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar sticky top-0 z-40">
      <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="logo flex items-center gap-2">
          <Book className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">BookLover</h1>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
