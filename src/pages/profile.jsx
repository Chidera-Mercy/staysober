import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FaCalendarCheck, FaUsers, FaBookOpen } from "react-icons/fa";
import Header from "../components/header";

const Profile = () => {
  const { user } = useAuth0();
  return (
    <div className="bg-slate-500 min-h-screen">
      <Header />
      <div className="flex flex-col items-center p-6">
        <h1 className="text-5xl font-bold text-white mb-12">
          Welcome, {user.name}
        </h1>
        <h3 className="text-2xl text-white mb-24">
          Choose an option to get started
        </h3>

        <div className="flex gap-12 mt-6">
          <Link
            to="/daily-check"
            className="flex flex-col items-center text-pastel-yellow"
          >
            <FaCalendarCheck size="10em" className="text-pastel-yellow mb-2" />
            <span className="text-lg font-semibold">Daily Check-In</span>
          </Link>
          <Link
            to="/community"
            className="flex flex-col items-center text-pastel-purple"
          >
            <FaUsers size="10em" className="text-pastel-purple mb-2" />
            <span className="text-lg font-semibold">Community Forum</span>
          </Link>
          <Link
            to="/resources"
            className="flex flex-col items-center text-pastel-green"
          >
            <FaBookOpen size="10em" className="text-pastel-green mb-2" />
            <span className="text-lg font-semibold">Resources</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
