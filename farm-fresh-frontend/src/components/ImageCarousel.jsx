import { useEffect, useState } from "react";

export default function ImageCarousel({ images = [] }) {
    const imgs = images.length ? images : [];
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (imgs.length <= 1) return;

        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % imgs.length);
        }, 3500);

        return () => clearInterval(timer);
    }, [imgs.length]);

    const prev = (e) => {
        e.stopPropagation();
        setIndex((index - 1 + imgs.length) % imgs.length);
    };

    const next = (e) => {
        e.stopPropagation();
        setIndex((index + 1) % imgs.length);
    };

    return (
        <>
            {/* CAROUSEL */}
            <div
                onClick={() => setOpen(true)}
                className="relative w-full h-44 overflow-hidden rounded-lg group cursor-pointer"
            >
                {imgs.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out
                            ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"}
                        `}
                    />
                ))}

                {imgs.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            ‹
                        </button>

                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {/* FULLSCREEN PREVIEW */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                    onClick={() => setOpen(false)}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prev(e);
                        }}
                        className="absolute left-6 text-white text-4xl"
                    >
                        ‹
                    </button>

                    <img
                        src={imgs[index]}
                        className="max-h-[90vh] max-w-[90vw] object-contain transition"
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            next(e);
                        }}
                        className="absolute right-6 text-white text-4xl"
                    >
                        ›
                    </button>

                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-6 right-6 text-white text-2xl"
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}
