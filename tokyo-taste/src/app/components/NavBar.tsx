"use client";

import React, { useState, useEffect } from "react";

export default function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <nav className={`
            fixed top-0 left-0 right-0 z-50 
            transition-all duration-300 ease-in-out
            ${isScrolled 
                ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg shadow-slate-900/25' 
                : 'bg-slate-900/20 backdrop-blur-sm'
            }
        `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <h1 className={`
                            text-2xl font-bold tracking-tight
                            bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300
                            bg-clip-text text-transparent
                            transition-all duration-300
                            ${isScrolled ? 'scale-95' : 'scale-100'}
                        `}>
                            Taste Tokyo
                        </h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            <button
                                onClick={() => scrollToSection("map-section")}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium
                                    text-slate-300 hover:text-white
                                    hover:bg-white/10 active:bg-white/20
                                    transition-all duration-200 ease-in-out
                                    transform hover:scale-105 active:scale-95
                                    border border-transparent hover:border-white/20
                                    backdrop-blur-sm
                                `}
                            >
                                Map
                            </button>
                            <button
                                onClick={() => scrollToSection("list-section")}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium
                                    text-slate-300 hover:text-white
                                    hover:bg-white/10 active:bg-white/20
                                    transition-all duration-200 ease-in-out
                                    transform hover:scale-105 active:scale-95
                                    border border-transparent hover:border-white/20
                                    backdrop-blur-sm
                                `}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            className={`
                                p-2 rounded-md text-slate-300 hover:text-white
                                hover:bg-white/10 transition-all duration-200
                                border border-transparent hover:border-white/20
                            `}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className="md:hidden">
                <div className={`
                    px-2 pt-2 pb-3 space-y-1 sm:px-3
                    bg-slate-900/95 backdrop-blur-md
                    border-t border-slate-700/50
                `}>
                    <button
                        onClick={() => scrollToSection("map-section")}
                        className={`
                            block w-full text-left px-3 py-2 rounded-md text-base font-medium
                            text-slate-300 hover:text-white hover:bg-white/10
                            transition-all duration-200
                        `}
                    >
                        Map
                    </button>
                    <button
                        onClick={() => scrollToSection("list-section")}
                        className={`
                            block w-full text-left px-3 py-2 rounded-md text-base font-medium
                            text-slate-300 hover:text-white hover:bg-white/10
                            transition-all duration-200
                        `}
                    >
                        List
                    </button>
                </div>
            </div>
        </nav>
    );
}