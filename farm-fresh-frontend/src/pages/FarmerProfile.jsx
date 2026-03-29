import { useEffect, useState } from "react";
import FarmerLayout from "../components/FarmerLayout";
import Profile from "../components/Profile";
import api from "../services/api";
import FarmerFeedback from "./FarmerFeedback";

export default function FarmerProfile() {

    const [data, setData] = useState(null);

    useEffect(() => {
        api.get("/feedback/farmer").then(res => {
            const feedbacks = res.data || [];

            const averageRating =
                feedbacks.length === 0
                    ? 0
                    : (
                        feedbacks.reduce((sum, f) => sum + f.rating, 0)
                        / feedbacks.length
                    ).toFixed(1);

            setData({
                averageRating,
                feedbacks
            });
        });
    }, []);

    return (
        <FarmerLayout>
            <Profile />

            {data && <FarmerFeedback data={data} />}
        </FarmerLayout>
    );
}
