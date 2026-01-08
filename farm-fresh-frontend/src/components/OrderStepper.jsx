const STEPS = [
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered" }
];

export default function OrderStepper({ status }) {
    const activeIndex = STEPS.findIndex(s => s.key === status);

    return (
        <div className="mt-6">
            <div className="flex items-center">
                {STEPS.map((step, i) => (
                    <div key={step.key} className="flex items-center w-full">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
              ${i <= activeIndex ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}
                        >
                            {i + 1}
                        </div>

                        {i < STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-1 mx-3 rounded
                ${i < activeIndex ? "bg-green-600" : "bg-gray-300"}`}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-xs text-gray-600 mt-2">
                {STEPS.map(s => <span key={s.key}>{s.label}</span>)}
            </div>
        </div>
    );
}
