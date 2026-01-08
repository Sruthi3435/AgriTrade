import { useEffect, useRef, useState } from "react";

function UsageSnapshot() {

    const sectionRef = useRef(null);
    const [animate, setAnimate] = useState(false);
    const [showLabel, setShowLabel] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimate(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
    }, []);

    // PERCENTAGES
    const farmersPercent = 70;
    const retailersPercent = 30;
    const totalUsers = 10000;

    return (
        <section
            ref={sectionRef}
            className="py-20 bg-gradient-to-br from-emerald-50 via-white to-lime-50"
        >
            <div className="max-w-6xl mx-auto px-8">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">
                        Platform Usage Snapshot
                    </h2>
                    <p className="text-slate-600 mt-2">
                        Active participation of farmers and retailers on the AgroLink platform.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* PIE CHART */}
                    <div className="flex justify-center">
                        <div
                            onMouseOver={() => setShowLabel(prev => !prev)}
                            className={`relative w-64 h-64 rounded-full cursor-pointer
                                transition-all duration-1000 ease-out
                                ${animate ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
                            style={{
                                background: `conic-gradient(
                                    #4c00b0 0% ${farmersPercent}%,
                                    #ffffff ${farmersPercent}% ${farmersPercent + 1}%,
                                    #7600bc ${farmersPercent + 1}% 100%
                                )`,
                                boxShadow: "0 25px 50px rgba(138,43,226,0.35)",
                            }}
                        >
                            {/* INNER HOLE (IGNORE CLICKS) */}
                            <div
                                className="absolute inset-6 bg-white rounded-full shadow-inner pointer-events-none"
                            ></div>

                            {/* LABEL (VISIBLE ON CLICK) */}
                            {showLabel && (
                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2
                                    bg-slate-900 text-white px-5 py-2 rounded-lg
                                    text-sm shadow-xl z-50">
                                    Farmers {farmersPercent}% • Retailers {retailersPercent}%
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FLOATING STATS */}
                    <div className="space-y-5">

                        <div className="flex justify-between items-center px-6 py-4 rounded-xl
                            bg-gradient-to-r from-green-600 to-emerald-500
                            text-white shadow-lg">
                            <span className="font-medium">Farmers Using AgroLink</span>
                            <span className="text-xl font-bold">7,800+</span>
                        </div>

                        <div className="flex justify-between items-center px-6 py-4 rounded-xl
                            bg-gradient-to-r from-lime-400 to-green-400
                            text-white shadow-lg">
                            <span className="font-medium">Retailers Using AgroLink</span>
                            <span className="text-xl font-bold">3,000+</span>
                        </div>

                        <div className="flex justify-between items-center px-6 py-4 rounded-xl
                            bg-gradient-to-r from-emerald-400 to-teal-500
                            text-white shadow-lg">
                            <span className="font-medium">Total Active Users</span>
                            <span className="text-xl font-bold">
                                {totalUsers.toLocaleString()}+
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default UsageSnapshot;
