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

    // Image modal state
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [activeImages, setActiveImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

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

    useEffect(() => {
        let data = [...products];

        if (category !== "All") {
            data = data.filter(
                p => p.category?.toLowerCase() === category.toLowerCase()
            );
        }

        if (search.trim()) {
            const s = search.toLowerCase();
            data = data.filter((p) => {
                if (filterType === "product") return p.name?.toLowerCase().includes(s);
                if (filterType === "farmer") return p.farmerName?.toLowerCase().includes(s);
                if (filterType === "location") return p.location?.toLowerCase().includes(s);
                return false;
            });
        }

        setFiltered(data);
    }, [search, category, filterType, products]);

    const openBidDrawer = (product) => {
        setSelectedProduct(product);
        setDrawerOpen(true);
    };

    const openImageModal = (images, index = 0) => {
        setActiveImages(images);
        setActiveIndex(index);
        setImageModalOpen(true);
    };

    const nextImage = () => {
        setActiveIndex((i) => (i + 1) % activeImages.length);
    };

    const prevImage = () => {
        setActiveIndex((i) => (i - 1 + activeImages.length) % activeImages.length);
    };

    return (
        <RetailerLayout>
            <div className="pt-2 px-8">

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
                    {filtered.map((p) => {
                        const imgs = p.images?.split("|") || [];

                        return (
                            <div
                                key={p.id}
                                className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition border"
                            >
                                <img
                                    src={imgs[0]}
                                    onClick={() => openImageModal(imgs, 0)}
                                    className="w-full h-40 object-cover rounded-lg cursor-pointer"
                                />

                                <h2 className="font-semibold text-lg mt-3">{p.name}</h2>

                                <p className="text-sm text-gray-600">Category: {p.category}</p>
                                <p className="text-sm text-gray-600">Qty: {p.quantity} {p.unit}</p>

                                <p className="font-semibold">₹{p.price}</p>

                                <p className="text-sm mt-1">
                                    Farmer: <b>{p.farmerName}</b>
                                </p>

                                <p className="text-blue-700 text-sm font-medium">
                                    Highest Bid: ₹{p.highestBid ?? "—"}
                                </p>

                                <p className="text-red-600 text-sm mt-2">
                                    Ends in: <CountdownTimer endTime={p.biddingEnd} />
                                </p>

                                <button
                                    onClick={() => openBidDrawer(p)}
                                    className="w-full mt-3 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
                                >
                                    Place Bid
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* IMAGE MODAL */}
            {imageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <button
                        className="absolute top-6 right-6 text-white text-3xl"
                        onClick={() => setImageModalOpen(false)}
                    >
                        ×
                    </button>

                    {/* IMAGE CONTAINER */}
                    <div className="relative">
                        <img
                            src={activeImages[activeIndex]}
                            className="max-h-[80vh] max-w-[80vw] rounded-xl"
                        />

                        {/* LEFT ARROW */}
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2
                                       bg-black/60 text-white text-3xl px-3 py-1 rounded-full
                                       hover:bg-black/80"
                        >
                            ‹
                        </button>

                        {/* RIGHT ARROW */}
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2
                                       bg-black/60 text-white text-3xl px-3 py-1 rounded-full
                                       hover:bg-black/80"
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            {/* BID DRAWER */}
            <BidDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                product={selectedProduct}
            />
        </RetailerLayout>
    );
}
