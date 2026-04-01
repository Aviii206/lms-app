import { useState, useEffect } from "react";

const TimerDisplay = ({ expectedEndTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expectedEndTime) - new Date();
      if (difference <= 0) {
        return 0;
      }
      return Math.floor(difference / 1000);
    };

    const initial = calculateTimeLeft();
    setTimeLeft(initial);
    if(initial <= 0) {
       onTimeUp();
       return;
    }
    
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expectedEndTime, onTimeUp]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: timeLeft < 300 ? "red" : "black" }}>
      Time Left: {formatTime(timeLeft)}
    </div>
  );
};

export default TimerDisplay;
