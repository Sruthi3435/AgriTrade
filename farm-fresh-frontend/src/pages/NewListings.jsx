import FarmerLayout from "../components/FarmerLayout.jsx";
import { useState } from "react";
import api from "../services/api.js";

export default function NewListing() {

    const [product, setProduct] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "kg",
        price: "",
        location: "",
        description: "",
        biddingStart: "",
        biddingEnd: "",
        images: []
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [message, setMessage] = useState("");

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

    const handleSubmit = async () => {
        if (!product.name || !product.price) {
            alert("Name & price required");
            return;
        }

        try {
            await api.post("/products/add", {
                ...product,
                images: product.images.join("|"),
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
                biddingStart: "",
                biddingEnd: "",
                images: []
            });
            setPreviewImages([]);
        } catch {
            alert("Failed to list product");
        }
    };

    return (
        <div className="pt-24  min-h-screen bg-green-100">
            <div className="flex">
                <FarmerLayout />

                <div className="flex-1 p-10 max-w-6xl mx-auto ">
                    <h1 className="text-3xl font-bold text-green-700 mb-8">
                        List New Product
                    </h1>

                    {message && (
                        <div className="mb-6 p-3 bg-green-100 text-green-800 rounded">
                            {message}
                        </div>
                    )}

                    {/* PRODUCT DETAILS */}
                    <div className="bg-white rounded-xl shadow p-8 mb-8">
                        <h2 className="text-lg font-semibold mb-6 text-gray-700">
                            Product Details
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            <input className="input" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} />
                            <select className="input" name="category" value={product.category} onChange={handleChange}>
                                <option value="">Category</option>
                                <option>Vegetables</option>
                                <option>Fruits</option>
                                <option>Grains</option>
                            </select>

                            <input className="input" type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} />
                            <select className="input" name="unit" value={product.unit} onChange={handleChange}>
                                <option>kg</option>
                                <option>ton</option>
                                <option>g</option>
                            </select>

                            <input className="input" type="number" name="price" placeholder="Start Price" value={product.price} onChange={handleChange} />
                            <input className="input" name="location" placeholder="Location" value={product.location} onChange={handleChange} />
                        </div>
                    </div>

                    {/* BIDDING */}
                    <div className="bg-white rounded-xl shadow p-8 mb-8">
                        <h2 className="text-lg font-semibold mb-6 text-gray-700">
                            Bidding Period
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            <input className="input" type="datetime-local" name="biddingStart" value={product.biddingStart} onChange={handleChange} />
                            <input className="input" type="datetime-local" name="biddingEnd" value={product.biddingEnd} onChange={handleChange} />
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="bg-white rounded-xl shadow p-8 mb-8">
                        <textarea
                            className="input w-full"
                            rows={4}
                            name="description"
                            placeholder="Product description"
                            value={product.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div className="bg-white rounded-xl shadow p-8">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">
                            Product Images (Max 3)
                        </h2>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImages}
                            disabled={previewImages.length === 3}
                        />

                        <p className="text-sm text-gray-500 mt-2">
                            {previewImages.length} / 3 images uploaded
                        </p>

                        <div className="flex gap-4 mt-4">
                            {previewImages.map((img, i) => (
                                <div key={i} className="relative">
                                    <img src={img} className="w-28 h-28 object-cover rounded border" />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg"
                    >
                        List Product
                    </button>
                </div>
            </div>
        </div>
    );
}
