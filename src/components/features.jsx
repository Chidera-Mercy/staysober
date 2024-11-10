import React from "react";

const Feature = ({ title, descr }) => {
  return (
    <div className="p-6 w-full md:w-1/2 lg:w-1/4 text-center">
      <h4 className="text-xl font-semibold text-slate-700">{title}</h4>
      <p className="mt-2 text-slate-700">{descr}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section className="p-10 bg-gradient-to-r from-white to bg-pastel-blue">
      <h3 className="text-2xl font-bold text-slate-500 text-center">
        Features
      </h3>
      <div className="flex flex-wrap justify-around mt-6">
        <Feature
          title="Daily Check-Ins"
          descr="Log your mood, sobriety status, and goals for the day."
        />
        <Feature
          title="Progress Tracking"
          descr="See your progress and positive patterns overtime."
        />
        <Feature
          title="Community Forum"
          descr="A safe anonymous place to share advice and experiences"
        />
        <Feature
          title="Resource Library"
          descr="Access resources on sobriety, wellness, and healthy coping."
        />
      </div>
    </section>
  );
};

export default Features;
