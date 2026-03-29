export default function InvoicePreviewModal({ invoice, onClose, onDownload }) {
    if (!invoice) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white w-[900px] max-w-[95%] shadow-2xl overflow-hidden">

                {/* HEADER */}
                <div className="relative h-28 bg-emerald-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-b-[120px]" />
                    <h1 className="relative z-10 text-3xl font-bold text-white px-8 pt-6">
                        AGROLINK INVOICE
                    </h1>
                </div>

                {/* BODY */}
                <div className="p-8 text-sm text-gray-700">

                    {/* META */}
                    <div className="flex justify-between mb-8">
                        <div>
                            <p><b>Date:</b> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                            <p><b>Invoice #:</b> {invoice.orderId}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-emerald-700">Farm2Trade</p>
                            <p className="text-xs text-gray-500">easy to connect</p>
                        </div>
                    </div>

                    {/* BILLING */}
                    <div className="grid grid-cols-2 gap-10 mb-10">
                        <div>
                            <p className="font-semibold mb-2">Bill To</p>
                            <p>{invoice.retailerName}</p>
                            <p className="text-gray-500">{invoice.retailerEmail}</p>
                            <p>📞 {invoice.retailerPhone}</p>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold mb-2">Sold By</p>
                            <p>{invoice.farmerName}</p>
                            <p className="text-gray-500">{invoice.location}</p>
                            <p>📞 {invoice.farmerPhone}</p>
                            <p>✉ {invoice.farmerEmail}</p>
                        </div>
                    </div>

                    {/* TABLE */}
                    <table className="w-full border-collapse mb-8">
                        <thead className="bg-emerald-50 text-emerald-700">
                        <tr>
                            <th className="text-left px-4 py-3">Product</th>
                            <th className="text-center px-4 py-3">Qty</th>
                            <th className="text-right px-4 py-3">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="border-b">
                            <td className="px-4 py-3 font-medium">
                                {invoice.productName}
                            </td>
                            <td className="text-center px-4 py-3">
                                {invoice.quantity}
                            </td>
                            <td className="text-right px-4 py-3 font-medium">
                                ₹{invoice.finalPrice}
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    {/* TOTAL */}
                    <div className="flex justify-end">
                        <div className="w-64">
                            <div className="flex justify-between py-2">
                                <span className="text-gray-500">Sub Total</span>
                                <span>₹{invoice.finalPrice}</span>
                            </div>
                            <div className="flex justify-between py-3 border-t font-bold text-emerald-700">
                                <span>Grand Total</span>
                                <span>₹{invoice.finalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <p className="text-center text-xs text-emerald-500 mt-10">
                        THANK YOU FOR YOUR BUSINESS
                    </p>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4 px-8 py-5 border-t bg-gray-50">
                    <button
                        onClick={() => onDownload(invoice.orderId)}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                        Download Invoice
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
