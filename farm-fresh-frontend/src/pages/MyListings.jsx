import FarmerLayout from "../components/FarmerLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import CountdownTimer from "../components/CountdownTimer.jsx";

export default function MyListings() {

    /* ======================
       DATA
       ====================== */
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    /* ======================
       FILTER STATE
       ====================== */
    const [statusFilter, setStatusFilter] = useState("All");
    const [tradeFilter, setTradeFilter] = useState("All");
    const [locationQuery, setLocationQuery] = useState("");
    const [priceRange, setPriceRange] = useState(5000);

    /* ======================
       BID MODAL
       ====================== */
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [bids, setBids] = useState([]);
    const [showModal, setShowModal] = useState(false);

    /* ======================
       LOAD PRODUCTS
       ====================== */
    useEffect(() => {
        const fetchMyProducts = async () => {
            const res = await api.get("/products/my-products");
            const reversed = [...res.data].reverse();
            setProducts(reversed);
            setFilteredProducts(reversed);
        };
        fetchMyProducts();
    }, []);

    /* ======================
       FILTER LOGIC
       ====================== */
    useEffect(() => {
        let data = [...products];

        if (statusFilter === "Active") data = data.filter(p => !p.closed);
        if (statusFilter === "Sold") data = data.filter(p => p.closed);

        if (tradeFilter !== "All") {
            data = data.filter(p => (p.tradeType || "DIRECT") === tradeFilter);
        }

        if (locationQuery.trim()) {
            data = data.filter(p =>
                p.location?.toLowerCase().includes(locationQuery.toLowerCase())
            );
        }

        data = data.filter(p => p.price <= priceRange);

        setFilteredProducts(data);
    }, [products, statusFilter, tradeFilter, locationQuery, priceRange]);

    /* ======================
       BID ACTIONS
       ====================== */
    const viewBids = async (productId) => {
        const res = await api.get(`/bid/product/${productId}/bids`);
        setBids(res.data);
        setSelectedProductId(productId);
        setShowModal(true);
    };

    const acceptBid = async (bidId) => {
        await api.post(`/bid/accept/${bidId}`);
        alert("Bid accepted");
        setShowModal(false);

        const res = await api.get("/products/my-products");
        setProducts([...res.data].reverse());
    };

    return (
        <FarmerLayout>
            <div className="pt-4 px-8 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-green-700">
                            My Listings
                        </h1>
                        <p className="text-sm text-gray-600">
                            Manage your auction and direct trade products
                        </p>
                    </div>

                    <button
                        onClick={() => setShowFilter(prev => !prev)}
                        className="bg-white border px-4 py-2 rounded-lg shadow hover:shadow-md transition"
                    >
                        Filter
                    </button>
                </div>

                {/* FILTERS */}
                {showFilter && (
                    <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border p-3 rounded-lg"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Sold">Sold</option>
                        </select>

                        <select
                            value={tradeFilter}
                            onChange={(e) => setTradeFilter(e.target.value)}
                            className="border p-3 rounded-lg"
                        >
                            <option value="All">All Trade Types</option>
                            <option value="DIRECT">Direct Trade</option>
                            <option value="AUCTION">Auction</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Search location..."
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            className="border p-3 rounded-lg"
                        />

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
                )}

                {/* EMPTY */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow text-center">
                        <h2 className="text-lg font-semibold">No products found</h2>
                        <p className="text-sm text-gray-500">
                            Try changing filters or add new listings
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => {

                            const tradeType = product.tradeType || "DIRECT";

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white p-4 rounded-xl border shadow hover:shadow-lg transition"
                                >
                                    <img
                                        src={product.images?.split("|")[0]}
                                        className="w-full h-40 object-cover rounded-lg"
                                    />

                                    <h2 className="font-bold text-lg mt-3">
                                        {product.name}
                                    </h2>

                                    <p className="text-gray-700 text-sm">
                                        ₹{product.price} / {product.unit}
                                    </p>

                                    <p className="text-gray-500 text-xs">
                                        {product.location}
                                    </p>

                                    {/* TRADE TYPE */}
                                    <span
                                        className={`inline-block mt-2 px-3 py-1 text-xs rounded-full
                                        ${tradeType === "DIRECT"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-blue-100 text-blue-700"}`}
                                    >
                                        {tradeType === "DIRECT" ? "Direct Trade" : "Auction"}
                                    </span>

                                    {/* STATUS */}
                                    <span
                                        className={`ml-2 px-3 py-1 text-xs rounded-full
                                        ${product.closed
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"}`}
                                    >
                                        {product.closed ? "SOLD" : "ACTIVE"}
                                    </span>

                                    {/* AUCTION */}
                                    {tradeType === "AUCTION" && (
                                        <>
                                            <p className="text-green-600 text-sm font-semibold mt-2">
                                                Highest Bid: ₹{product.highestBid || 0}
                                            </p>

                                            {!product.closed && (
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
                                                {product.closed ? "Auction Closed" : "View Bids"}
                                            </button>
                                        </>
                                    )}

                                    {/* DIRECT */}
                                    {tradeType === "DIRECT" && (
                                        <p className="mt-4 text-sm font-medium text-gray-600">
                                            {product.closed
                                                ? "Product sold successfully"
                                                : "Waiting for a buyer"}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* BID MODAL */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-2/3 shadow-lg">

                            <h2 className="text-2xl font-bold mb-4">
                                Bids
                            </h2>

                            {bids.length === 0 ? (
                                <p className="text-gray-600">No bids yet</p>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto">
                                    {[...bids]
                                        .sort((a, b) => b.amount - a.amount)
                                        .map(b => (
                                            <div
                                                key={b.id}
                                                className="p-4 border rounded-lg mb-3"
                                            >
                                                <p className="font-semibold">₹{b.amount}</p>
                                                <p className="text-sm">
                                                    Retailer: {b.retailerName}
                                                </p>

                                                <button
                                                    disabled={products.find(p => p.id === selectedProductId)?.closed}
                                                    onClick={() => acceptBid(b.id)}
                                                    className="mt-2 px-3 py-1 rounded bg-green-600 text-white"
                                                >
                                                    Accept Bid
                                                </button>
                                            </div>
                                        ))}
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
