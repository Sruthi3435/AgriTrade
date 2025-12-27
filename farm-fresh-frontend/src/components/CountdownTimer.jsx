import { useEffect, useState } from "react";

export default function CountdownTimer({ endTime }) {
    const [timeLeft, setTimeLeft] = useState("");

    const calculateTimeLeft = () => {
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) {
            return "Expired";
        }

        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        }

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <span className={`font-medium ${timeLeft === "Expired" ? "text-red-600" : "text-green-700"}`}>
            {timeLeft}
        </span>
    );
}
