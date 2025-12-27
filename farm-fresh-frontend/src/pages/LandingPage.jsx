import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100">

            {/* NAVBAR */}
            <nav className="flex justify-between items-center px-6 md:px-10 py-6">
                <div className="text-2xl font-bold text-green-700">
                    🌱 AgroLink
                </div>

                <div className="space-x-4 md:space-x-6">
                    <Link
                        to="/login"
                        className="text-gray-700 hover:text-green-700"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="bg-green-600 text-white px-4 py-2 md:px-5 md:py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="flex flex-col items-center text-center px-6 mt-20 md:mt-28">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 max-w-4xl leading-tight">
                    A Smart Digital Bridge Between{" "}
                    <span className="text-green-600">Farmers</span> and{" "}
                    <span className="text-green-600">Retailers</span>
                </h1>

                <p className="mt-6 text-base md:text-lg text-gray-600 max-w-2xl">
                    AgroLink streamlines agricultural trade by connecting verified farmers
                    and retailers on a secure, transparent, and efficient platform.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/register"
                        className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-green-700 transition"
                    >
                        Register Now
                    </Link>

                    <Link
                        to="/login"
                        className="border border-green-600 text-green-700 px-8 py-3 rounded-xl text-lg hover:bg-green-100 transition"
                    >
                        Login
                    </Link>
                </div>
            </section>

            {/* FEATURES */}
            <section className="mt-24 px-6 md:px-10 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                    { icon: "✔️", title: "Verified Users", text: "Admin-approved farmers and retailers ensure trust and safety." },
                    { icon: "📦", title: "Direct Trade", text: "No middlemen. Farmers sell directly to retailers." },
                    { icon: "🔒", title: "Secure Platform", text: "JWT authentication and role-based access control." },
                ].map((f, i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center"
                    >
                        <div className="text-4xl mb-3">{f.icon}</div>
                        <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                        <p className="text-gray-600">{f.text}</p>
                    </div>
                ))}
            </section>

            {/* HOW IT WORKS */}
            <section className="mt-28 px-6 md:px-10 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    How AgroLink Works
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: "📝", title: "Register", text: "Users register and submit details for verification." },
                        { icon: "✅", title: "Admin Approval", text: "Admin validates users to ensure authenticity." },
                        { icon: "🤝", title: "Trade Securely", text: "Approved users trade seamlessly and securely." },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-xl transition"
                        >
                            <div className="text-3xl mb-3">{s.icon}</div>
                            <h4 className="font-semibold text-lg mb-2">{s.title}</h4>
                            <p className="text-gray-600">{s.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* WHY AGROLINK */}
            <section className="mt-28 bg-white py-20">
                <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Why Choose AgroLink?
                    </h2>

                    <p className="text-gray-600 max-w-3xl mx-auto mb-12">
                        AgroLink focuses on trust, efficiency, and fairness—empowering both
                        farmers and retailers equally.
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {["🌾 Fair Pricing", "📊 Transparency", "⚡ Faster Deals", "🛡️ Trusted Network"].map((x, i) => (
                            <div
                                key={i}
                                className="p-5 rounded-xl bg-green-50 hover:bg-green-100 transition"
                            >
                                {x}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="mt-16 py-6 text-center text-gray-500 text-sm">
                © 2025 AgroLink. Built for Smart Agriculture.
            </footer>
        </div>
    );
}
