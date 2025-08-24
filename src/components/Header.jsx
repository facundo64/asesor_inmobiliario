import React, { useState } from 'react';

export const Header = ({ currentPage, navigate }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavigate = (page) => {
        navigate(page);
        setMobileMenuOpen(false);
    };
    
    const navLinks = [ { id: 'home', label: 'Inicio' }, { id: 'portfolio', label: 'Portafolio' }, { id: 'admin', label: 'Admin' } ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#home" onClick={() => handleNavigate('home')} className="text-xl font-bold text-primary">Rodrigo Asesor Inmobiliario</a>
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => ( <a key={link.id} href={`#${link.id}`} onClick={() => handleNavigate(link.id)} className={`nav-link ${currentPage === link.id ? 'active' : ''}`}>{link.label}</a> ))}
                </div>
                <button className="md:hidden" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}> <i className="fas fa-bars text-2xl text-secondary"></i> </button>
            </nav>
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white py-2">
                     {navLinks.map(link => ( <a key={link.id} href={`#${link.id}`} className="block text-center py-2 px-4 text-sm hover:bg-gray-100" onClick={() => handleNavigate(link.id)}>{link.label}</a> ))}
                </div>
            )}
        </header>
    );
};