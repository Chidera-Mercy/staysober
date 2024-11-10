import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import supabase from "../db/supabaseClient";
import Header from "../components/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const motivationalQuotes = [
  "Every day is a new beginning. Stay strong, stay positive.",
  "Your strength is greater than your struggles.",
  "Progress is progress, no matter how small.",
  "You are braver than you believe, stronger than you seem.",
  "One day at a time - this is enough. Do not look back and grieve, nor forward with fear.",
  "The only way around is through. Keep going.",
];

const DailyCheckIn = () => {
  const { user } = useAuth0();
  const [checkInData, setCheckInData] = useState([]);
  const [latestMood, setLatestMood] = useState("Neutral");
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [cravingTrend, setCravingTrend] = useState([]);

  useEffect(() => {
    if (user?.sub) {
      fetchUserData();
    }
    // Rotate quotes every 10 seconds
    const quoteInterval = setInterval(() => {
      setQuote(
        motivationalQuotes[
          Math.floor(Math.random() * motivationalQuotes.length)
        ]
      );
    }, 10000);

    return () => clearInterval(quoteInterval);
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.sub)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) throw error;

      if (data && data.length > 0) {
        setCheckInData(data);
        setLatestMood(data[0].mood);

        // Process data for craving trend chart
        const trendData = data.reverse().map((checkin) => ({
          date: new Date(checkin.created_at).toLocaleDateString(),
          level: checkin.craving_level,
        }));
        setCravingTrend(trendData);
      }
    } catch (error) {
      console.error("Error fetching check-in data:", error);
    }
  };

  const calculateStreakDays = () => {
    if (!checkInData.length) return 0;
    const today = new Date().setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = today;

    for (const checkin of checkInData) {
      const checkinDate = new Date(checkin.created_at).setHours(0, 0, 0, 0);
      if (checkinDate === currentDate) {
        streak++;
        currentDate -= 86400000; // Subtract one day in milliseconds
      } else break;
    }
    return streak;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-white to-pastel-pink">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Welcome Section */}
          <Card className="w-full md:w-2/3 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.name}!
              </CardTitle>
              <p className="text-lg text-gray-600 mt-2 italic">{quote}</p>
            </CardHeader>
            <CardContent>
              <Link
                to="/daily-check-form"
                className="inline-flex items-center gap-3 px-6 py-3 bg-pastel-green text-white rounded-lg hover:bg-pastel-green/90 transition-colors"
              >
                <FaCheckCircle size="1.5em" />
                Start Today's Check-In
              </Link>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card className="w-full md:w-1/3 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {calculateStreakDays()} days
                </h3>
              </div>
              <div>
                <p className="text-sm text-gray-600">Latest Mood</p>
                <h3 className="text-xl font-semibold text-gray-800">
                  {latestMood}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Craving Trend Chart */}
        <Card className="mt-8 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Craving Level Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cravingTrend}>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#666" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fill: "#666" }} domain={[0, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="level"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: "#8884d8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Card className="mt-8 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Recent Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkInData.slice(0, 5).map((checkin, index) => (
                <div key={index} className="p-4 rounded-lg bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(checkin.created_at).toLocaleDateString()}
                      </p>
                      <p className="font-medium text-gray-800">
                        Mood: {checkin.mood}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {checkin.gratitude}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Craving Level</p>
                      <Progress
                        value={checkin.craving_level * 10}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyCheckIn;
