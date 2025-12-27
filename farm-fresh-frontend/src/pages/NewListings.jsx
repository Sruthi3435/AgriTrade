
import FarmerLayout from "../components/FarmerLayout.jsx";
import {useState} from "react";
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

            if (files.length > 3) {
                alert("Max 3 images allowed");
                return;
            }

            const fileReaders = [];
            const base64Images = [];
            const previews = [];

            files.forEach((file) => {
                const reader = new FileReader();
                previews.push(URL.createObjectURL(file));

                reader.onload = () => {
                    base64Images.push(reader.result);

                    if (base64Images.length === files.length) {
                        setProduct((p) => ({
                            ...p,
                            images: base64Images,
                        }));
                        setPreviewImages(previews);
                    }
                };

                reader.readAsDataURL(file);
            });
        };

        const handleSubmit = async () => {
            if (!product.name || !product.price) {
                alert("Name & price required");
                return;
            }

            try {
                const requestBody = {
                    ...product,
                    images: product.images.join("|")
// convert array → string
                };

                await api.post("/products/add", requestBody);


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
            } catch (e) {
                alert("Failed to list product");
            }
        };

        return (
            <div className="pt-24 px-8">
            <div className="flex min-h-screen bg-gray-50">

                <FarmerLayout />

                <div className="flex-1 p-10">

                    <h1 className="text-3xl font-semibold mb-6 text-green-700">
                        List New Product
                    </h1>

                    {message && (
                        <p className="text-green-700 bg-green-100 p-2 rounded mb-4">
                            {message}
                        </p>
                    )}

                    <div className="bg-white shadow rounded-xl p-6 grid grid-cols-2 gap-6">

                        <input
                            className="border p-3 rounded"
                            name="name"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={handleChange}
                        />

                        <select
                            className="border p-3 rounded"
                            name="category"
                            onChange={handleChange}
                            value={product.category}
                        >
                            <option value="">Category</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Grains">Grains</option>
                        </select>

                        <input
                            className="border p-3 rounded"
                            name="quantity"
                            type="number"
                            placeholder="Quantity"
                            value={product.quantity}
                            onChange={handleChange}
                        />

                        <select
                            className="border p-3 rounded"
                            name="unit"
                            value={product.unit}
                            onChange={handleChange}
                        >
                            <option value="kg">kg</option>
                            <option value="ton">ton</option>
                            <option value="g">g</option>
                        </select>

                        <input
                            className="border p-3 rounded"
                            name="price"
                            type="number"
                            placeholder="Start Price"
                            value={product.price}
                            onChange={handleChange}
                        />

                        <input
                            className="border p-3 rounded"
                            name="location"
                            placeholder="Location"
                            value={product.location}
                            onChange={handleChange}
                        />

                        <input
                            className="border p-3 rounded"
                            name="biddingStart"
                            type="datetime-local"
                            onChange={handleChange}
                            value={product.biddingStart}
                        />

                        <input
                            className="border p-3 rounded"
                            name="biddingEnd"
                            type="datetime-local"
                            onChange={handleChange}
                            value={product.biddingEnd}
                        />

                        <textarea
                            className="border p-3 rounded col-span-2"
                            name="description"
                            placeholder="Description"
                            rows={3}
                            value={product.description}
                            onChange={handleChange}
                        />

                        <div className="col-span-2">
                            <label className="block mb-2 font-medium">Upload Images (Max 3)</label>
                            <input type="file" multiple accept="image/*" onChange={handleImages} />

                            <div className="flex gap-3 mt-3">
                                {previewImages.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt="preview"
                                        className="w-24 h-24 object-cover rounded border"
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                    <button
                        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                        onClick={handleSubmit}
                    >
                        List Product
                    </button>

                </div>
            </div>
            </div>
        );
    }

