import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Instala react-icons si no lo tienes

export const Header = ({ navigate, currentPage, isIntroAnimating, finalLogoRef }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigate = (page) => {
        navigate(page);
        setMobileMenuOpen(false);
    };

    return (
        <header className={`bg-secondary/70 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-800 main-header ${isScrolled ? 'shadow-lg' : ''}`}>
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button 
                    ref={finalLogoRef}
                    id="final-logo-target" 
                    onClick={() => handleNavigate('home')} 
                    className="text-2xl font-serif font-bold text-light"
                >
                    RR.
                </button>
                
                <div className="hidden md:flex items-center space-x-8 text-sm">
                    <button 
                        onClick={() => handleNavigate('home')}
                        className={`hover:text-primary transition-colors ${currentPage === 'home' ? 'text-primary' : 'text-light'}`}
                    >
                        Inicio
                    </button>
                    <button 
                        onClick={() => handleNavigate('portfolio')}
                        className={`hover:text-primary transition-colors ${currentPage === 'portfolio' ? 'text-primary' : 'text-light'}`}
                    >
                        Portafolio
                    </button>
                    <button 
                        onClick={() => handleNavigate('admin')}
                        className={`hover:text-primary transition-colors ${currentPage === 'admin' ? 'text-primary' : 'text-light'}`}
                    >
                        Admin
                    </button>
                    <button 
                        onClick={() => { 
                            if(currentPage === 'home') { 
                                document.getElementById('contacto')?.scrollIntoView({behavior: 'smooth'}) 
                            } else { 
                                navigate('home'); 
                                setTimeout(() => document.getElementById('contacto')?.scrollIntoView({behavior: 'smooth'}), 100) 
                            } 
                        }} 
                        className="border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-secondary transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        Agendar Consulta
                    </button>
                </div>
                
                <button className="md:hidden text-2xl text-light" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </nav>
            
            {isMobileMenuOpen && (
                <div className="md:hidden bg-secondary py-4">
                    <button onClick={() => handleNavigate('home')} className="block w-full text-center py-2 text-light hover:text-primary">Inicio</button>
                    <button onClick={() => handleNavigate('portfolio')} className="block w-full text-center py-2 text-light hover:text-primary">Portafolio</button>
                    <button onClick={() => handleNavigate('admin')} className="block w-full text-center py-2 text-light hover:text-primary">Admin</button>
                </div>
            )}
        </header>
    );
};