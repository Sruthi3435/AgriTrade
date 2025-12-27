import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import FarmerLayout from "../components/FarmerLayout";

export default function Bids() {

    const { productId } = useParams();
    const [bids, setBids] = useState([]);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await api.get(`/bid/product/${productId}/bids`);
                setBids(res.data);
            } catch (err) {
                alert(err.response?.data || "Failed to load bids");
            }
        };
        fetchBids();
    }, [productId]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <FarmerLayout />

            <div className="flex-1 p-10">
                <h2 className="text-2xl font-bold mb-6">Bids for Product ID {productId}</h2>

                {bids.length === 0 ? (
                    <p className="text-gray-600 text-lg">No bids placed yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {bids.map((b) => (
                            <div className="p-4 border rounded-lg bg-white shadow">
                                <p className="text-lg font-semibold">₹{b.amount}</p>
                                <p className="text-gray-700">Retailer: {b.retailerEmail}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(b.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
