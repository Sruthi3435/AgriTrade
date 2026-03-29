export default function FarmerFeedback({ data }) {
    if (!data) return null;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Customer Feedback</h2>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-emerald-600">
                    {data.averageRating}
                </span>
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-sm text-gray-500">
                    ({data.feedbacks.length} reviews)
                </span>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {data.feedbacks.map((f, i) => (
                    <div key={i} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{f.retailerName}</span>
                            <span className="text-xs text-gray-400">
                                {new Date(f.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="text-yellow-400 text-sm mb-2">
                            {"★".repeat(f.rating)}{" "}
                            <span className="text-gray-300">
                                {"★".repeat(5 - f.rating)}
                            </span>
                        </div>

                        <p className="text-sm text-gray-700">
                            {f.comment || "No comment provided"}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                            Order #{f.orderId}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
