import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="p-6 bg-gradient-to-r from-slate-700 to bg-slate-500 text-white text-center">
      <p>
        &copy; 2024 StaySober |{" "}
        <Link to="/privacy" className="underline">
          {" "}
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link to="/terms" className="underline">
          Terms of Service
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
