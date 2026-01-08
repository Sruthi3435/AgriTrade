import { Link } from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import UsageSnapshot from "../components/UsageSnapshot.jsx";

/* ================= PIE DATA ================= */

const tradeData = [
    { name: "Direct Trade", value: 60 },
    { name: "Bidding", value: 40 },
];



const platformStats = [
    { label: "Registered Farmers", value: "2,300+" },
    { label: "Verified Retailers", value: "980+" },
    { label: "Monthly Trades", value: "5,400+" },
];


const COLORS = ["#765fde", "#4ade80"];

export default function LandingPage() {
    return (
        <div className="min-h-screen text-slate-800">

            {/* ================= HERO SECTION ================= */}
            <section
                className="relative min-h-screen flex items-center"
                style={{
                    backgroundImage:
                        "url('https://www.pixelstalk.net/wp-content/uploads/images6/The-best-Farm-Wallpaper-HD.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>

                {/* NAVBAR */}
                <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-8 md:px-14 py-6 z-10">
                    <div className="text-2xl font-bold text-white">
                        AgroLink
                    </div>
                    <div className="flex gap-6">
                        <Link to="/login" className="text-white/80 hover:text-white">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>

                {/* HERO CONTENT */}
                <div className="relative z-10 max-w-6xl mx-auto px-8 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        A Digital Marketplace for
                        <span className="block text-green-400 mt-2">
                            Transparent Agricultural Trade
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-white/90 max-w-3xl mx-auto">
                        AgroLink enables verified farmers and retailers to trade directly
                        using fixed pricing and bidding models with complete transparency.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <Link
                            to="/register"
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Create Account
                        </Link>
                        <Link
                            to="/login"
                            className="border border-white/40 px-8 py-3 rounded-lg hover:bg-white/10 transition"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>
<UsageSnapshot/>


            {/* ================= PLATFORM CAPABILITIES ================= */}
            <section className="py-28 bg-gradient-to-br from-emerald-50 via-white to-lime-50">
                <div className="max-w-7xl mx-auto px-8 md:px-14 ">

                    {/* Feature 1 */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <img
                            src="https://www.shutterstock.com/image-photo/male-farmers-handshake-outdoor-on-260nw-2075138014.jpg"
                            className="w-full h-48 object-cover object-top rounded-2xl shadow-lg"
                            alt="Direct trade"
                        />
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Direct Farmer–Retailer Trade
                            </h3>
                            <p className="text-slate-600">
                                Farmers sell directly without intermediaries, ensuring better
                                margins and faster deal closure.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Bidding & Fixed Pricing Models
                            </h3>
                            <p className="text-slate-600">
                                Flexible selling strategies with full control for farmers
                                and transparent pricing for retailers.
                            </p>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
                            className="w-full h-48 object-cover rounded-2xl shadow-lg"
                            alt="Bidding"
                        />
                    </div>

                    {/* Feature 3 */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <img
                            src="https://wac-cdn.atlassian.com/dam/jcr:f29a9a1e-19a8-48af-b66e-9a9d63d1a44d/00-PlatformAnalytics-Header-Illo-Desktop@2x.png"
                            className="w-full max-w-sm h-56 object-contain rounded-xl shadow-md"
                            alt="Analytics"
                        />
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Dashboards, Analytics & Reports
                            </h3>
                            <p className="text-slate-600">
                                Real-time dashboards provide insights into orders, payments,
                                and trade performance after login.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-10">
                    <div>
                        <h4 className="text-white font-semibold mb-4">AgroLink</h4>
                        <p className="text-sm">
                            A digital marketplace for transparent agricultural trade.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Features</li>
                            <li>How It Works</li>
                            <li>Security</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Help Center</li>
                            <li>FAQs</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Privacy Policy</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-700 py-6 text-center text-sm">
                    © 2025 AgroLink. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
