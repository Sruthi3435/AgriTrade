import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function AdminCharts({ stats }) {
    const data = [
        { name: "Approved", value: stats?.approved || 0 },
        { name: "Pending", value: stats?.pending || 0 },
        { name: "Rejected", value: stats?.rejected || 0 }
    ];

    const COLORS = ["#16a34a", "#facc15", "#dc2626"];

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
