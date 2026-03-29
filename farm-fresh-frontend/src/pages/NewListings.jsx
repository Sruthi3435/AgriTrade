import FarmerLayout from "../components/FarmerLayout.jsx";
import { useState } from "react";
import api from "../services/api.js";

export default function NewListing() {

    /* ======================
       STEP
       ====================== */
    const [step, setStep] = useState(1);

    /* ======================
       TRADE TYPE
       ====================== */
    const [tradeType, setTradeType] = useState("AUCTION");

    const [product, setProduct] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "kg",
        price: "",
        location: "",
        description: "",
        biddingEnd: "",
        images: []
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /* ======================
       HANDLERS (UNCHANGED)
       ====================== */
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);

        if (previewImages.length + files.length > 3) {
            alert("You can upload only 3 images");
            return;
        }

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setProduct((p) => ({
                    ...p,
                    images: [...p.images, reader.result],
                }));
                setPreviewImages((prev) => [...prev, URL.createObjectURL(file)]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setProduct((p) => ({
            ...p,
            images: p.images.filter((_, i) => i !== index),
        }));
    };

    /* ======================
       SUBMIT (UNCHANGED)
       ====================== */
    const handleSubmit = async () => {
        setError("");
        setMessage("");

        if (!product.name || !product.price) {
            setError("Product name and price are required");
            return;
        }

        if (tradeType === "AUCTION" && !product.biddingEnd) {
            setError("Bidding end time is required for auction");
            return;
        }

        try {
            await api.post("/products/add", {
                name: product.name,
                category: product.category,
                quantity: product.quantity,
                unit: product.unit,
                price: product.price,
                location: product.location,
                description: product.description,
                images: product.images.join("|"),
                tradeType: tradeType,
                biddingEnd: tradeType === "AUCTION" ? product.biddingEnd : null
            });

            setMessage("Product listed successfully!");

            setProduct({
                name: "",
                category: "",
                quantity: "",
                unit: "kg",
                price: "",
                location: "",
                description: "",
                biddingEnd: "",
                images: []
            });

            setPreviewImages([]);
            setTradeType("AUCTION");
            setStep(1);

        } catch (err) {
            setError(err.response?.data || "Failed to list product");
        }
    };

    return (
        <FarmerLayout>
            <div className="pt-20 min-h-screen bg-green-50">
                <div className="max-w-5xl mx-auto px-6 pb-16">

                    {/* HEADER */}
                    <h1 className="text-3xl font-bold text-green-700 mb-4">
                        List New Product
                    </h1>

                    {/* STEP INDICATOR */}
                    <div className="flex gap-3 mb-6">
                        {[1,2,3,4,5].map(s => (
                            <div
                                key={s}
                                className={`flex-1 h-2 rounded-full
                                ${s <= step ? "bg-green-600" : "bg-gray-200"}`}
                            />
                        ))}
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                        Step {step} of 5
                    </p>

                    {message && (
                        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* ======================
                       STEP 1 — TRADE TYPE
                       ====================== */}
                    {step === 1 && (
                        <div className="bg-white rounded-xl shadow p-8 mb-8">
                            <h2 className="text-lg font-semibold mb-4">
                                How do you want to sell?
                            </h2>

                            <div className="inline-flex rounded-lg border overflow-hidden">
                                <button
                                    onClick={() => setTradeType("AUCTION")}
                                    className={`px-6 py-3
                                    ${tradeType === "AUCTION"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100"}`}
                                >
                                    Auction
                                </button>
                                <button
                                    onClick={() => setTradeType("DIRECT")}
                                    className={`px-6 py-3
                                    ${tradeType === "DIRECT"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100"}`}
                                >
                                    Direct Trade
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ======================
                       STEP 2 — PRODUCT DETAILS
                       ====================== */}
                    {step === 2 && (
                        <div className="bg-white rounded-xl shadow p-8 mb-8">
                            <div className="grid grid-cols-2 gap-6">
                                <input className="input" name="name" placeholder="Product Name"
                                       value={product.name} onChange={handleChange} />

                                <select className="input" name="category"
                                        value={product.category} onChange={handleChange}>
                                    <option value="">Category</option>
                                    <option>Vegetables</option>
                                    <option>Fruits</option>
                                    <option>Grains</option>
                                    <option>Spices</option>
                                    <option>Others</option>
                                </select>

                                <input className="input" name="quantity" placeholder="Quantity"
                                       value={product.quantity} onChange={handleChange} />

                                <select className="input" name="unit"
                                        value={product.unit} onChange={handleChange}>
                                    <option>kg</option>
                                    <option>ton</option>
                                    <option>g</option>
                                </select>

                                <input className="input" name="price"
                                       placeholder="Price"
                                       value={product.price} onChange={handleChange} />

                                <input className="input" name="location"
                                       placeholder="Location"
                                       value={product.location} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {/* ======================
                       STEP 3 — AUCTION END
                       ====================== */}
                    {step === 3 && tradeType === "AUCTION" && (
                        <div className="bg-white rounded-xl shadow p-8 mb-8">
                            <h2 className="text-lg font-semibold mb-4">
                                Bidding End Time
                            </h2>
                            <input
                                className="input w-1/2"
                                type="datetime-local"
                                name="biddingEnd"
                                value={product.biddingEnd}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* ======================
                       STEP 4 — DESCRIPTION + IMAGES
                       ====================== */}
                    {step === 4 && (
                        <>
                            <div className="bg-white rounded-xl shadow p-8 mb-8">
                                <textarea
                                    className="input w-full"
                                    rows={4}
                                    name="description"
                                    placeholder="Describe your product"
                                    value={product.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="bg-white rounded-xl shadow p-8 mb-8">
                                <input type="file" multiple accept="image/*"
                                       onChange={handleImages} />
                                <div className="flex gap-4 mt-4">
                                    {previewImages.map((img, i) => (
                                        <div key={i} className="relative">
                                            <img src={img}
                                                 className="w-28 h-28 object-cover rounded" />
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ======================
                       STEP 5 — SUBMIT
                       ====================== */}
                    {step === 5 && (
                        <div className="text-right">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg"
                            >
                                List Product
                            </button>
                        </div>
                    )}

                    {/* ======================
                       NAVIGATION
                       ====================== */}
                    <div className="flex justify-between mt-10">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-2 border rounded-lg"
                            >
                                Back
                            </button>
                        )}
                        {step < 5 && (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Next
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </FarmerLayout>
    );
}
