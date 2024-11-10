import { Link } from "react-router-dom";
import Header from "../components/header";
import Hero from "../components/hero";
import Features from "../components/features";
import Footer from "../components/footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to bg-pastel-pink flex flex-col text-black">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Landing;
