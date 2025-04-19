import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // ✅ import context

const Navbar = () => {
  const { user, setUser } = useUser();

  const handleLogin = () => {
    setUser({ name: "Egland Zeneli", role: "organizer" }); // simulate login
  };

  const handleLogout = () => {
    setUser(null); // logout
  };

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

      <div className="space-x-4 flex items-center ml-4">
        <span className="text-gray-600 text-sm">
          {user ? `Hello, ${user.name}` : "Guest"}
        </span>
        {user ? (
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="text-sm text-blue-500 hover:underline"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
