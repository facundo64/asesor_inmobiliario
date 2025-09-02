import React, { useState, useEffect } from 'react';

export const Header = ({ navigate, currentPage }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigate = (page) => {
        navigate(page);
        setMobileMenuOpen(false);
    };

    return (
        <header id="main-header" className={`main-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || currentPage !== 'home' ? 'bg-secondary/70 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button onClick={() => handleNavigate('home')} id="final-logo-target" className="text-2xl font-serif font-bold text-light transition-opacity duration-500">
                    RA.
                </button>
                <div className="hidden md:flex items-center space-x-8 text-sm">
                    <button onClick={() => handleNavigate('home')} className={`hover:text-primary transition-colors ${currentPage === 'home' ? 'text-primary' : 'text-light'}`}>Inicio</button>
                    <button onClick={() => handleNavigate('portfolio')} className={`hover:text-primary transition-colors ${currentPage === 'portfolio' ? 'text-primary' : 'text-light'}`}>Portafolio</button>
                    <button onClick={() => handleNavigate('admin')} className={`hover:text-primary transition-colors ${currentPage === 'admin' ? 'text-primary' : 'text-light'}`}>Admin</button>
                    <button onClick={() => { if(currentPage === 'home') { document.getElementById('contacto').scrollIntoView() } else { navigate('home'); setTimeout(() => document.getElementById('contacto')?.scrollIntoView(), 100) } }} className="border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-secondary transition-all text-xs font-bold uppercase tracking-wider">
                        Agendar Consulta
                    </button>
                </div>
                <button className="md:hidden text-2xl" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                    <i className="fas fa-bars"></i>
                </button>
            </nav>
            {isMobileMenuOpen && (
                <div className="md:hidden bg-secondary border-t border-gray-800 py-4">
                    <button onClick={() => handleNavigate('home')} className="block w-full text-center py-2 text-light hover:text-primary">Inicio</button>
                    <button onClick={() => handleNavigate('portfolio')} className="block w-full text-center py-2 text-light hover:text-primary">Portafolio</button>
                    <button onClick={() => handleNavigate('admin')} className="block w-full text-center py-2 text-light hover:text-primary">Admin</button>
                </div>
            )}
        </header>
    );
};