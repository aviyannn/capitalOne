import React, { useState } from "react";
import { useRouter } from "next/router";
import { UserProfileForm } from "../components/UserProfileForm";
import CarSelector from "../components/CarSelector";
import { PaymentSimulator } from "../components/PaymentSimulator";


const Onboarding: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [showSimulator, setShowSimulator] = useState(false);

  const router = useRouter();

  // Step 1: Collect profile info
  if (!profile) {
    return <UserProfileForm onComplete={setProfile} />;
  }

  // Step 2: Let user pick a car
  if (!selectedCar) {
    return <CarSelector profile={profile} onSelect={setSelectedCar} />;
  }

  // Step 3: Payment simulation
  if (!showSimulator) {
    return (
      <PaymentSimulator
        car={selectedCar}
        profile={profile}
        onFinish={() => setShowSimulator(true)}
      />
    );
  }

  // Step 4: Go to dashboard after simulation
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-indigo-900 to-purple-900">
      <div className="bg-black bg-opacity-60 rounded-2xl p-8 max-w-lg mx-auto shadow-xl mt-10 flex flex-col gap-3">
        <h2 className="text-white font-bold text-xl mb-4">
          You're ready!
        </h2>
        <div className="text-indigo-200 mb-2">
          Profile and plan selected.<br />
          <span className="font-semibold text-yellow-300">Proceed to your personalized dashboard and cosmic journey.</span>
        </div>
        <button
          className="mt-6 rounded bg-gradient-to-r from-indigo-700 to-purple-500 text-white px-6 py-3 font-bold"
          onClick={() => router.push("/dashboard")}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
