import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <header className="flex justify-between items-center p-6 bg-slate-500 shadow-md">
      <Link to="/">
        <h1 className="text-2xl font-bold text-white">StaySober</h1>
      </Link>

      <div className="flex items-center">
        {/* Show user avatar and profile link if authenticated */}
        {isAuthenticated ? (
          <>
            <Link to="/profile">
              <img
                src={user.picture}
                alt="user avatar"
                className="w-12 h-12 rounded-full"
              />
            </Link>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="ml-4 px-4 py-2 bg-white text-slate-700 rounded-lg"
            >
              Log Out
            </button>
          </>
        ) : (
          // Show login button if not authenticated
          <button
            onClick={() => loginWithRedirect()}
            className="ml-4 px-4 py-2 bg-white text-slate-700 rounded-lg"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
