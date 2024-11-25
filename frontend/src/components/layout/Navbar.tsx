import { Link } from "react-router-dom";
//import { useSelector, useDispatch } from "react-redux";
import { Car, Book, Trophy, UserCircle, LogOut } from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  console.log("User => "+user?.name);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-belgian-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-belgian-yellow" />
              <span className="font-bold text-xl">Belgian Driving</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/rules" className="nav-link">
              <Book className="h-5 w-5" />
              <span>Rules</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/journey" className="nav-link">
                  <Car className="h-5 w-5" />
                  <span>Journey</span>
                </Link>
                {user?.role === "STUDENT" && (
                <Link to="/achievements" className="nav-link">
                  <Trophy className="h-5 w-5" />
                  <span>Achievements</span>
                </Link>
                )}
                {user?.role === "INSTRUCTOR" && (
                  <Link to="/instructor" className="nav-link">
                    <UserCircle className="h-5 w-5" />
                    <span>Students</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="nav-link text-belgian-red"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-belgian-yellow text-belgian-black px-4 py-2 rounded-md font-medium hover:bg-opacity-90"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
