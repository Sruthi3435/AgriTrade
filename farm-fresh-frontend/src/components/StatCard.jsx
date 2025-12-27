export default function StatCard({ title, value, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}
