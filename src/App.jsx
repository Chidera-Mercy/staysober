import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import Profile from "./pages/profile";
import DailyCheckIn from "./pages/DailyCheckIn";
import Resources from "./pages/Resources";
import CommunityForum from "./pages/CommunityForum";
import CheckinForm from "./pages/CheckinForm";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/daily-check" element={<DailyCheckIn />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/community" element={<CommunityForum />} />
          <Route path="/daily-check-form" element={<CheckinForm />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
