"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const handleClaim = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/claim`,
        {
          withCredentials: true,
        }
      );

      if (res.status == 201) {
        setMessage(res.data.message + " " + res.data.coupon);
      }
      console.log("res", res);
    } catch (error) {
      setMessage(error.response.data.message);
      setMinutes(error.response.data.min || 0);
      setSeconds(error.response.data.sec || 0);
      setIsCountingDown(true); // Start the countdown
    }
  };

  useEffect(() => {
    if (!isCountingDown) return; // Exit if no countdown is active

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else if (minutes > 0) {
        setMinutes((prevMinutes) => prevMinutes - 1);
        setSeconds(59);
      } else {
        // Countdown finished
        setIsCountingDown(false);
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [isCountingDown, minutes, seconds]);

  const formatTime = () => {
    if (minutes === null || seconds === null) return "";
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 rounded-lg shadow-md">
      <button
        onClick={handleClaim}
        className={`px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-300 text-gray-600 cursor-pointer`}
      >
        Claim Now!
      </button>

      <p className="mt-4 text-center text-gray-600">{message}</p>

      {isCountingDown && (
        <div className="mt-6">
          <div className="text-3xl font-bold text-center">{formatTime()}</div>
          <p className="mt-1 text-sm text-gray-500 text-center">
            {seconds === 0 && minutes === 0 ? "Time's up!" : "Time remaining"}
          </p>
        </div>
      )}
    </div>
  );
}
