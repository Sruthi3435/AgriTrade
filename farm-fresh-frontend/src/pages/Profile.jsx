import RetailerLayout from "../components/RetailerLayout.jsx";

export default function Profile() {
    return (
        <div className="pt-24 px-8">
        <RetailerLayout>
        <div className="p-8 bg-gray-50 min-h-screen">

            <h1 className="text-3xl font-semibold mb-6 text-green-700">Profile</h1>

            <div className="bg-white shadow-lg rounded-xl p-6 max-w-xl">
                <div className="space-y-4">

                    <input className="border p-3 rounded-lg w-full" placeholder="Business Name" />
                    <input className="border p-3 rounded-lg w-full" placeholder="Email" />
                    <input className="border p-3 rounded-lg w-full" placeholder="Phone" />
                    <input className="border p-3 rounded-lg w-full" placeholder="City" />
                    <input className="border p-3 rounded-lg w-full" placeholder="State" />

                    <button className="bg-green-600 text-white py-2 w-full rounded-lg hover:bg-green-700 transition">
                        Save Changes
                    </button>
                </div>
            </div>

        </div>
        </RetailerLayout>
        </div>
);
}
