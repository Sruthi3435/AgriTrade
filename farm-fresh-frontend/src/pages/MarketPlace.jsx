import RetailerLayout from "../components/RetailerLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import CountdownTimer from "../components/CountdownTimer.jsx";
import BidDrawer from "../components/BidDrawer";

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("product");
    const [category, setCategory] = useState("All");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Load all products
    useEffect(() => {
        const loadProducts = async () => {
            const res = await api.get("/products/active");

            const enriched = await Promise.all(
                res.data.map(async (p) => {
                    try {
                        const bidRes = await api.get(`/bid/highest/${p.id}`);
                        return { ...p, highestBid: bidRes.data.highest || null };
                    } catch {
                        return { ...p, highestBid: null };
                    }
                })
            );

            setProducts(enriched);
            setFiltered(enriched);
        };

        loadProducts();
    }, []);

    // Apply Search + Category Filters
    useEffect(() => {
        let data = [...products];

        // CATEGORY FILTER
        if (category !== "All") {
            data = data.filter(
                p => p.category?.toLowerCase() === category.toLowerCase()
            );
        }

        // SEARCH FILTER
        if (search.trim() !== "") {
            const s = search.toLowerCase();

            data = data.filter((p) => {
                if (filterType === "product") {
                    return p.name?.toLowerCase().includes(s);
                }
                if (filterType === "farmer") {
                    return p.farmerName?.toLowerCase().includes(s);
                }
                if (filterType === "location") {
                    return p.location?.toLowerCase().includes(s);
                }
                return false;
            });
        }

        setFiltered(data);
    }, [search, category, filterType, products]);

    const openBidDrawer = (product) => {
        setSelectedProduct(product);
        setDrawerOpen(true);
    };

    return (
        <RetailerLayout>
            <div className="pt-24 px-8">

                {/* TITLE */}
                <h1 className="text-2xl font-semibold mb-6">Marketplace</h1>

                {/* SEARCH + FILTERS */}
                <div className="bg-white p-4 shadow rounded-xl flex flex-col sm:flex-row gap-4 mb-6">

                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-3 rounded w-full sm:w-1/3"
                    />

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border p-3 rounded w-full sm:w-1/4"
                    >
                        <option value="product">Product Name</option>
                        <option value="farmer">Farmer Name</option>
                        <option value="location">Location</option>
                    </select>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-3 rounded w-full sm:w-1/4"
                    >
                        <option value="All">All Categories</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Spices">Spices</option>
                        <option value="Others">Others</option>
                    </select>

                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition border border-gray-100"
                        >
                            <img
                                src={p.images}
                                alt={p.name}
                                className="w-full h-40 object-cover rounded-lg"
                            />

                            <h2 className="font-semibold text-lg mt-3">
                                {p.name}
                            </h2>

                            <p className="text-sm text-gray-600">
                                Category: {p.category}
                            </p>

                            <p className="text-sm text-gray-600">
                                Qty: {p.quantity} {p.unit}
                            </p>

                            <p className="font-semibold text-gray-800">
                                Base Price: ₹{p.price}
                            </p>

                            <p className="text-sm text-gray-700 mt-1">
                                Farmer: <b>{p.farmerName}</b>
                            </p>

                            <p className="text-sm text-blue-700 font-medium mt-1">
                                Highest Bid: ₹{p.highestBid ?? "—"}
                            </p>

                            <p className="text-sm text-red-600 mt-2">
                                Ends in: <CountdownTimer endTime={p.biddingEnd} />
                            </p>

                            <button
                                onClick={() => openBidDrawer(p)}
                                className="w-full mt-3 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
                            >
                                Place Bid
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT DRAWER */}
            <BidDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                product={selectedProduct}
            />
        </RetailerLayout>
    );
}
