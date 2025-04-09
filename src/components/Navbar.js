import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Festiva</h1>
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-500 font-medium">
          Home
        </Link>
        <Link to="/events" className="text-gray-700 hover:text-blue-500 font-medium">
          Events
        </Link>
        <Link to="/checkout" className="text-gray-700 hover:text-blue-500 font-medium">
          Checkout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
