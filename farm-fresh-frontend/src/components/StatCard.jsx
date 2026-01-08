export default function StatCard({ title, value, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-700">
                <Icon size={22} />
            </div>

            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">
                    {value ?? 0}
                </p>
            </div>
        </div>
    );
}
