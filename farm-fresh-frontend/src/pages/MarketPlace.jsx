import RetailerLayout from "../components/RetailerLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import BidDrawer from "../components/BidDrawer";

export default function Marketplace() {

    /* ======================
       DATA
       ====================== */
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);

    /* ======================
       FILTERS
       ====================== */
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("product");
    const [category, setCategory] = useState("All");
    const [tradeView, setTradeView] = useState("DIRECT");

    /* ======================
       AUCTION
       ====================== */
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    /* ======================
       BUY NOW
       ====================== */
    const [confirmBuyProduct, setConfirmBuyProduct] = useState(null);
    const [buying, setBuying] = useState(false);
    const [successOrderId, setSuccessOrderId] = useState(null);
    const [error, setError] = useState("");

    /* ======================
       LOAD PRODUCTS
       ====================== */
    useEffect(() => {
        const loadProducts = async () => {
            const res = await api.get("/products/active");

            const enriched = await Promise.all(
                res.data.map(async (p) => {
                    try {
                        const bidRes = await api.get(`/bid/highest/${p.id}`);
                        return { ...p, highestBid: bidRes.data || null };
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

    /* ======================
       FILTER LOGIC
       ====================== */
    useEffect(() => {
        let data = [...products];

        data = data.filter(
            p => (p.trade_type ?? "DIRECT").trim().toUpperCase() === tradeView
        );

        if (category !== "All") {
            data = data.filter(
                p => p.category?.toLowerCase() === category.toLowerCase()
            );
        }

        if (search.trim()) {
            const s = search.toLowerCase();
            data = data.filter(p => {
                if (filterType === "product") return p.name?.toLowerCase().includes(s);
                if (filterType === "farmer") return p.farmerName?.toLowerCase().includes(s);
                if (filterType === "location") return p.location?.toLowerCase().includes(s);
                return false;
            });
        }

        setFiltered(data);
    }, [products, tradeView, category, search, filterType]);

    /* ======================
       BUY NOW ACTION (FIXED)
       ====================== */
    const confirmBuyNow = async () => {
        if (!confirmBuyProduct) return;

        try {
            setBuying(true);
            setError("");

            const res = await api.post(`/orders/buy/${confirmBuyProduct.id}`);
            setSuccessOrderId(res.data);

            // ✅ MARK PRODUCT AS CLOSED (DO NOT REMOVE)
            setProducts(prev =>
                prev.map(p =>
                    p.id === confirmBuyProduct.id
                        ? { ...p, closed: true }
                        : p
                )
            );

            setConfirmBuyProduct(null);
        } catch (err) {
            setError(err.response?.data || "Unable to place order");
        } finally {
            setBuying(false);
        }
    };

    return (
        <RetailerLayout>
            <div className="pt-4 px-8">

                <h1 className="text-2xl font-semibold mb-6">Marketplace</h1>

                {/* TOGGLE */}
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setTradeView("DIRECT")}
                        className={`px-6 py-2 rounded ${tradeView === "DIRECT" ? "bg-green-600 text-white" : "border"}`}
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={() => setTradeView("AUCTION")}
                        className={`px-6 py-2 rounded ${tradeView === "AUCTION" ? "bg-blue-600 text-white" : "border"}`}
                    >
                        Bid & Compete
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map(p => {
                        const tradeType = (p.trade_type ?? "DIRECT").trim().toUpperCase();

                        return (
                            <div
                                key={p.id}
                                className={`relative bg-white p-4 rounded-xl shadow
                                ${p.closed ? "opacity-60" : ""}`}
                            >
                                {/* OUT OF STOCK BADGE */}
                                {p.closed && (
                                    <span className="absolute top-3 left-3 bg-red-100 text-red-700
                                                     text-xs px-3 py-1 rounded-full font-semibold">
                                        Out of Stock
                                    </span>
                                )}

                                <img
                                    src={p.images?.split("|")[0]}
                                    className="h-40 w-full object-cover rounded"
                                />

                                <h2 className="font-semibold mt-2">{p.name}</h2>
                                <p>₹{p.price}</p>

                                {tradeType === "DIRECT" ? (
                                    <button
                                        disabled={p.closed}
                                        onClick={() => setConfirmBuyProduct(p)}
                                        className={`w-full mt-3 py-2 rounded font-medium
                                            ${p.closed
                                            ? "bg-gray-400 cursor-not-allowed text-white"
                                            : "bg-green-600 hover:bg-green-700 text-white"}`}
                                    >
                                        {p.closed ? "Out of Stock" : "Buy Now"}
                                    </button>
                                ) : (
                                    <button
                                        disabled={p.closed}
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setDrawerOpen(true);
                                        }}
                                        className={`w-full mt-3 py-2 rounded
                                            ${p.closed
                                            ? "bg-gray-400 cursor-not-allowed text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                    >
                                        {p.closed ? "Auction Closed" : "Place Bid"}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CONFIRM BUY MODAL */}
            {confirmBuyProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-2">Confirm Purchase</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Buy <b>{confirmBuyProduct.name}</b> for ₹{confirmBuyProduct.price}?
                        </p>

                        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmBuyProduct(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={buying}
                                onClick={confirmBuyNow}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                {buying ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUCCESS MODAL */}
            {successOrderId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl text-center">
                        <h2 className="text-green-600 text-xl font-semibold mb-2">
                            Order Placed Successfully
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Order ID: {successOrderId}
                        </p>
                        <button
                            onClick={() => setSuccessOrderId(null)}
                            className="px-6 py-2 bg-green-600 text-white rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <BidDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                product={selectedProduct}
            />
        </RetailerLayout>
    );
}
