import FarmerLayout from "../components/FarmerLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import CountdownTimer from "../components/CountdownTimer.jsx";

export default function MyListings() {

    // SOURCE DATA (DO NOT TOUCH)
    const [products, setProducts] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    // FILTERED VIEW
    const [filteredProducts, setFilteredProducts] = useState([]);

    // FILTER UI STATE
    const [statusFilter, setStatusFilter] = useState("All");
    const [locationQuery, setLocationQuery] = useState("");
    const [priceRange, setPriceRange] = useState(5000);

    // BID MODAL
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [bids, setBids] = useState([]);
    const [showModal, setShowModal] = useState(false);

    /* ======================
       LOAD PRODUCTS (ORIGINAL LOGIC)
       ====================== */
    useEffect(() => {
        const fetchMyProducts = async () => {
            const res = await api.get("/products/my-products");
            const reversed = [...res.data].reverse();
            setProducts(reversed);
            setFilteredProducts(reversed); // initial
        };
        fetchMyProducts();
    }, []);

    /* ======================
       FILTER LOGIC (SAFE)
       ====================== */
    useEffect(() => {
        let data = [...products];

        // STATUS
        if (statusFilter === "Active") {
            data = data.filter(p => !p.closed);
        }
        if (statusFilter === "Sold") {
            data = data.filter(p => p.closed);
        }

        // LOCATION SEARCH
        if (locationQuery.trim()) {
            data = data.filter(p =>
                p.location?.toLowerCase().includes(locationQuery.toLowerCase())
            );
        }

        // PRICE RANGE
        data = data.filter(p => p.price <= priceRange);

        setFilteredProducts(data);
    }, [products, statusFilter, locationQuery, priceRange]);

    /* ======================
       BID ACTIONS (UNCHANGED)
       ====================== */
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
            setShowModal(false);

            const res = await api.get("/products/my-products");
            const reversed = [...res.data].reverse();
            setProducts(reversed); // filters reapply automatically
        } catch (err) {
            alert(err.response?.data || "Failed to accept bid");
        }
    };

    return (
        <FarmerLayout>
            <div className="pt-2 px-8 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

                {/* HEADER */}


                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-semibold text-green-700">
                                    My Listings
                                </h1>
                            </div>

                            <button
                                onClick={() => setShowFilter(prev => !prev)}
                                className="bg-white border px-4 py-2 rounded-lg shadow
                   hover:shadow-md transition flex items-center gap-2"
                            >
                                <i className="fa fa-filter text-green-700"></i>
                                Filter
                            </button>
                        </div>

                        <p className="text-sm text-gray-600">
                            Showing {filteredProducts.length} products
                        </p>

                {showFilter && (
                    <div className="bg-white rounded-xl shadow p-4 mb-6 animate-fade-in">
                        {/* FILTER BAR */}
                        <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* STATUS */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border p-3 rounded-lg"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Sold">Sold</option>
                            </select>

                            {/* LOCATION */}
                            <input
                                type="text"
                                placeholder="Search location..."
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="border p-3 rounded-lg"
                            />

                            {/* PRICE */}
                            <div>
                                <p className="text-sm mb-1">Max Price: ₹{priceRange}</p>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-green-600"
                                />
                            </div>
                        </div>
                    </div>
                )}



                {/* EMPTY STATE */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow text-center">
                        <h2 className="text-lg font-semibold">
                            No available products
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Try adjusting filters or add new listings.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="bg-white p-4 rounded-xl border shadow
                                           hover:shadow-lg transition flex flex-col items-center"
                            >
                                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={product.images?.split("|")[0]}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <h2 className="font-bold text-lg mt-3 text-center">
                                    {product.name}
                                </h2>

                                <p className="text-gray-700 text-sm">
                                    ₹{product.price} / {product.unit}
                                </p>

                                <p className="text-gray-500 text-xs">
                                    {product.location}
                                </p>

                                <p className="text-green-600 text-sm font-semibold">
                                    Max Bid: ₹{product.highestBid || 0}
                                </p>

                                <span
                                    className={`mt-2 px-3 py-1 text-xs rounded-full
                                    ${product.closed
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"}`}
                                >
                                    {product.closed ? "SOLD" : "ACTIVE"}
                                </span>

                                {product.closed ? (
                                    <p className="text-sm text-red-600 font-semibold mt-2">
                                        Expired
                                    </p>
                                ) : (
                                    <p className="text-xs mt-2 text-red-600">
                                        Ends in: <CountdownTimer endTime={product.biddingEnd} />
                                    </p>
                                )}

                                <button
                                    disabled={product.closed}
                                    onClick={() => viewBids(product.id)}
                                    className={`w-full mt-3 py-2 rounded-lg
                                    ${product.closed
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                >
                                    {product.closed ? "Bidding Closed" : "View Bids"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* MODAL (UNCHANGED) */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-2/3 shadow-lg">

                            <h2 className="text-2xl font-bold mb-4">
                                Bids for Product #{selectedProductId}
                            </h2>

                            {bids.length === 0 ? (
                                <p className="text-gray-600">No bids placed yet.</p>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto pr-2">
                                    {[...bids]
                                        .sort((a, b) => b.amount - a.amount)
                                        .map((b) => {
                                            const highest = Math.max(...bids.map(x => x.amount));
                                            return (
                                                <div
                                                    key={b.id}
                                                    className={`p-4 border rounded-lg mb-3
                                                    ${b.amount === highest
                                                        ? "bg-green-100 border-green-400"
                                                        : "bg-gray-50"}`}
                                                >
                                                    <p className="text-lg font-semibold">
                                                        ₹{b.amount}
                                                        {b.amount === highest && (
                                                            <span className="text-green-700 font-bold ml-2">
                                                                (Highest)
                                                            </span>
                                                        )}
                                                    </p>

                                                    <p className="text-sm">
                                                        Retailer: {b.retailerName}
                                                    </p>

                                                    <button
                                                        disabled={products.find(p => p.id === selectedProductId)?.closed}
                                                        onClick={() => acceptBid(b.id)}
                                                        className={`mt-2 px-3 py-1 rounded text-white
                                                        ${products.find(p => p.id === selectedProductId)?.closed
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-green-600 hover:bg-green-700"}`}
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
        </FarmerLayout>
    );
}
