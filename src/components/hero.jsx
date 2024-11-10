import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      loginWithRedirect();
    }
  };

  return (
    <section className="flex-grow flex flex-col items-center justify-center text-center p-10">
      <h2 className="text-4xl font-bold text-slate-500">
        Support on Your Journey to Sobriety
      </h2>
      <h3 className="mt-4 text-xl text-slate-500">
        A safe, supportive community to track your progress, share experiences,
        and stay motivated.
      </h3>

      <button
        onClick={handleGetStarted}
        className="mt-6 px-6 py-3 bg-pastel-blue text-slate-700 rounded-lg shadow-lg hover:bg-slate-700 hover:text-pastel-blue transition"
      >
        Get Started
      </button>
    </section>
  );
};

export default Hero;
