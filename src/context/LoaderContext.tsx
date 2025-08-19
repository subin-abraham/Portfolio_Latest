import React, { createContext, useState, useEffect, ReactNode } from "react";

interface LoaderContextType {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const LoaderContext = createContext<LoaderContextType>({
    loading: false,
    setLoading: () => { },
});

interface LoaderProviderProps {
    children: ReactNode;
}

export function LoaderProvider({ children }: LoaderProviderProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleLoader = (e: Event) => {
            const customEvent = e as CustomEvent<boolean>;
            setLoading(customEvent.detail);
        };

        window.addEventListener("loader", handleLoader);
        return () => window.removeEventListener("loader", handleLoader);
    }, []);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
            {loading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f172a]/90 backdrop-blur-sm transition-opacity">
                    <div className="relative flex flex-col items-center">
                        {/* Gradient Spinner */}
                        <div className="relative h-20 w-20">
                            {/* Outer ring (normal spin) */}
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>

                            {/* Inner ring (reverse spin) */}
                            <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-blue-500 border-l-blue-500 animate-spin-reverse"></div>

                            {/* Center dot */}
                            <div className="absolute inset-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Animated text */}
                        <div className="mt-6 flex space-x-1">
                            {["L", "o", "a", "d", "i", "n", "g", "..."].map((char, i) => (
                                <span
                                    key={i}
                                    className="text-white font-medium animate-bounce"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Custom CSS for reverse spin */}
                    <style>{`
                        @keyframes spin-reverse {
                            from { transform: rotate(360deg); }
                            to { transform: rotate(0deg); }
                        }
                        .animate-spin-reverse {
                            animation: spin-reverse 1s linear infinite;
                        }
                    `}</style>
                </div>
            )}
        </LoaderContext.Provider>
    );
}
