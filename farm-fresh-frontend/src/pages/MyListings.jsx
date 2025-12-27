import FarmerLayout from "../components/FarmerLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import CountdownTimer from "../components/CountdownTimer.jsx";

export default function MyListings() {

    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [bids, setBids] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchMyProducts = async () => {
            const res = await api.get("/products/my-products");

            // ⭐ REVERSE ORDERING — NEWEST FIRST
            const reversed = [...res.data].reverse();
            setProducts(reversed);
        };
        fetchMyProducts();
    }, []);

    const viewBids = async (productId) => {
        try {
            const res = await api.get(`/bid/product/${productId}/bids`);
            setBids(res.data);
            setSelectedProductId(productId);
            setShowModal(true);
        } catch (err) {
            alert(err.response?.data || "Failed to load bids");
        }
    };

    const acceptBid = async (bidId) => {
        try {
            await api.post(`/bid/accept/${bidId}`);
            alert("Bid accepted!");

            setShowModal(false); // close modal

            // Reload updated listings from backend
            const res = await api.get("/products/my-products");

            // newest first
            setProducts([...res.data].reverse());

        } catch (err) {
            alert(err.response?.data || "Failed to accept bid");
        }
    };

    const getTimeLeft = (endTime) => {
        const end = new Date(endTime).getTime();
        const now = Date.now();
        const diff = end - now;

        if (diff <= 0) return "Expired";

        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);

        return `${mins}m ${secs}s`;
    };

    return (
        <div className="pt-24 px-8">
            <div className="flex min-h-screen bg-gray-50">
                <FarmerLayout />

                <div className="flex-1 p-8">
                    <h1 className="text-2xl font-semibold mb-6 text-green-700">My Listings</h1>

                    {/* PRODUCT GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => {
                            const maxBid = product.highestBid || 0;

                            return (
                                <div key={product.id} className="bg-white p-4 shadow rounded-xl border hover:shadow-lg transition flex flex-col items-center">

                                    {/* IMAGE */}
                                    <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={product.images?.split("|")[0]}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* NAME */}
                                    <h2 className="font-bold text-lg mt-3 text-center">{product.name}</h2>

                                    {/* DETAILS */}
                                    <p className="text-gray-700 text-sm">₹{product.price} / {product.unit}</p>
                                    <p className="text-gray-500 text-xs">{product.location}</p>
                                    <p className="text-green-600 text-sm font-semibold">
                                        Max Bid: ₹{product.highestBid}
                                    </p>


                                    {/* BADGE */}
                                    <span className={`mt-2 px-3 py-1 text-xs rounded-full 
                                        ${product.closed ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                        {product.closed ? "SOLD" : "ACTIVE"}
                                    </span>

                                    {/* BIDDING TIME / EXPIRED LABEL */}
                                    {product.closed ? (
                                        <p className="text-sm text-red-600 font-semibold mt-2">Expired</p>
                                    ) : (
                                        <p className="text-xs mt-2 text-red-600">
                                            Ends in: <CountdownTimer endTime={product.biddingEnd} />
                                        </p>
                                    )}


                                    {/* VIEW BIDS BUTTON */}
                                    <button
                                        disabled={product.closed}     // ⭐ DISABLE IF SOLD
                                        onClick={() => viewBids(product.id)}
                                        className={`w-full mt-3 py-2 rounded-lg
                                            ${product.closed
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                    >
                                        {product.closed ? "Bidding Closed" : "View Bids"}
                                    </button>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MODAL (unchanged) */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-2/3 shadow-lg">

                        <h2 className="text-2xl font-bold mb-4">Bids for Product #{selectedProductId}</h2>

                        {bids.length === 0 ? (
                            <p className="text-gray-600">No bids placed yet.</p>
                        ) : (
                            <div className="max-h-[400px] overflow-y-auto pr-2">
                                {[...bids]
                                    .sort((a, b) => b.amount - a.amount)   // 🔥 highest → lowest
                                    .map((b) => {

                                    const highest = Math.max(...bids.map(x => x.amount));

                                    return (
                                        <div
                                            key={b.id}
                                            className={`p-4 border rounded-lg mb-3 ${
                                                b.amount === highest
                                                    ? "bg-green-100 border-green-400"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <p className="text-lg font-semibold">
                                                ₹{b.amount}
                                                {b.amount === highest && (
                                                    <span className="text-green-700 font-bold ml-2">(Highest)</span>
                                                )}
                                            </p>

                                            <p className="text-sm">Retailer: {b.retailerName}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(b.createdAt).toLocaleString()}
                                            </p>

                                            {/* Disable accept if SOLD */}
                                            <button
                                                disabled={products.find(p => p.id === selectedProductId)?.closed}
                                                onClick={() => acceptBid(b.id)}
                                                className={`mt-2 px-3 py-1 rounded text-white ${
                                                    products.find(p => p.id === selectedProductId)?.closed
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >
                                                Accept Bid
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}


                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
