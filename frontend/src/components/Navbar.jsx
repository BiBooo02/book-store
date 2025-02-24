import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <h1>Book Store</h1>
        </Link>
      </div>
    </header>
  );
};
export default Navbar