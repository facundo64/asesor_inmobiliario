import React, { useState, useMemo } from 'react';
import { PropertyCard } from '../components/PropertyCard';

export const PortfolioPage = ({ properties, onToggleCompare, onOpenModal, comparisonList }) => {
    const [filters, setFilters] = useState({ keyword: '', type: 'all', maxPrice: '' });

    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        setFilters(prev => ({ ...prev, [id]: value }));
    };

    const filteredProperties = useMemo(() => {
        return properties.filter(prop => {
            const { keyword, type, maxPrice } = filters;
            const lowerKeyword = keyword.toLowerCase();
            const matchesKeyword = !keyword || prop.title.toLowerCase().includes(lowerKeyword) || prop.description.toLowerCase().includes(lowerKeyword) || prop.location.toLowerCase().includes(lowerKeyword);
            const matchesType = type === 'all' || prop.type === type;
            const matchesPrice = !maxPrice || prop.price <= parseFloat(maxPrice);
            return matchesKeyword && matchesType && matchesPrice;
        });
    }, [properties, filters]);

    return (
        <section className="bg-secondary text-light py-20 min-h-screen pt-32">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-serif font-bold text-center mb-4 text-light">Portafolio de Inversiones</h2>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Una selección curada de activos de primer nivel, elegidos por su potencial de revalorización y su calidad excepcional.</p>
                
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl shadow-lg mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="lg:col-span-2">
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-400 mb-2">Búsqueda</label>
                        <input type="text" id="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="Buscar por palabra clave..." className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-2">Tipo de Propiedad</label>
                        <select id="type" value={filters.type} onChange={handleFilterChange} className="form-input">
                            <option value="all">Todos</option>
                            <option value="venta">Venta</option>
                            <option value="alquiler">Alquiler</option>
                            <option value="inversion">Inversión</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-400 mb-2">Precio Máximo (USD)</label>
                        <input type="number" id="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Sin límite" className="form-input" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map(prop => ( <PropertyCard key={prop.id} prop={prop} onToggleCompare={onToggleCompare} onOpenModal={onOpenModal} isComparing={comparisonList.includes(prop.id)} /> ))
                    ) : ( <p className="text-center col-span-full text-gray-500 text-lg py-16">No se encontraron propiedades con los criterios seleccionados.</p> )}
                </div>
            </div>
        </section>
    );
};