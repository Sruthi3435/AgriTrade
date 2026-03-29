export default function LogoutConfirmModal({ open, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-96 p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Confirm Logout
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to logout? You will need to login again to continue.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
