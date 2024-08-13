import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  function getTimeRemaining(targetDate) {
    const now = new Date();
    const totalSeconds = Math.max(
      0,
      Math.floor((targetDate.getTime() - now.getTime()) / 1000)
    );
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const targetDate = new Date("2024-06-15");
    setTimeRemaining(getTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeRemaining) {
    return <div>Loading...</div>;
  }

  return (
    <div className="time-container">
      <div className="timebox"><div>{timeRemaining.days}</div> <div className="timerbox-details">Day</div></div>
      <div className="timebox"><div>{timeRemaining.hours}</div> <div className="timerbox-details">Hours</div></div>
      <div className="timebox"><div>{timeRemaining.minutes}</div> <div className="timerbox-details">Mins</div></div>
      <div className="timebox"><div>{timeRemaining.seconds}</div> <div className="timerbox-details">Secs</div></div>
    </div>
  );
};

export default CountdownTimer;
