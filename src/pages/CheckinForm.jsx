import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import supabase from "../db/supabaseClient";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const CheckinForm = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mood: "",
    cravingLevel: 0,
    gratitude: "",
    goalsForToday: "",
  });

  const totalSteps = 4;
  const navigate = useNavigate();

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😣", label: "Stressed" },
  ];

  // Handle form submission to Supabase
  const submitToSupabase = async () => {
    try {
      if (!isAuthenticated || !user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to submit your check-in.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("daily_checkins").insert([
        {
          user_id: user.sub,
          created_at: new Date().toISOString(),
          mood: formData.mood,
          craving_level: formData.cravingLevel,
          gratitude: formData.gratitude,
          goals: formData.goalsForToday,
        },
      ]);

      if (error) {
        console.error("Error submitting check-in:", error);
        toast({
          title: "Submission Error",
          description: "Failed to submit check-in. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Your daily check-in has been recorded.",
      });
      navigate("/daily-check");
    } catch (error) {
      console.error("Error in submission:", error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-6">
              How are you feeling today?
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setFormData({ ...formData, mood: mood.label })}
                  className={`p-4 rounded-lg text-center transition-colors ${
                    formData.mood === mood.label
                      ? "bg-blue-100 border-2 border-blue-300"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-2xl mb-2">{mood.emoji}</div>
                  <div className="text-sm">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-6">
              Rate your craving level today
            </h3>
            <div className="space-y-6">
              <Progress value={formData.cravingLevel * 10} className="w-full" />
              <input
                type="range"
                min="0"
                max="10"
                value={formData.cravingLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cravingLevel: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>None</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-6">
              What are you grateful for today?
            </h3>
            <textarea
              value={formData.gratitude}
              onChange={(e) =>
                setFormData({ ...formData, gratitude: e.target.value })
              }
              placeholder="I am grateful for..."
              className="w-full p-3 rounded-lg border min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-6">
              Set your intention for today
            </h3>
            <textarea
              value={formData.goalsForToday}
              onChange={(e) =>
                setFormData({ ...formData, goalsForToday: e.target.value })
              }
              placeholder="Today, I will..."
              className="w-full p-3 rounded-lg border min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-r from-pastel-pink to bg-pastel-blue">
      <Card className="w-full max-w-xl mx-auto bg-white">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Daily Check-in
            </h2>
            <div className="text-sm text-gray-500">
              Step {step} of {totalSteps}
            </div>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-1" />
        </CardHeader>
        <CardContent className="p-6">
          {renderStep()}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button
              onClick={step === totalSteps ? submitToSupabase : handleNext}
              disabled={
                !formData.mood ||
                (step === 2 && formData.cravingLevel === 0) ||
                (step === 3 && !formData.gratitude) ||
                (step === 4 && !formData.goalsForToday)
              }
            >
              {step === totalSteps ? "Submit" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckinForm;
