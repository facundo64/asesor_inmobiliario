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
        <section>
            <h2 className="text-3xl font-bold text-center mb-4">Portafolio de Inversiones</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <input type="text" id="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="Buscar por palabra clave..." className="filter-input lg:col-span-2" />
                <select id="type" value={filters.type} onChange={handleFilterChange} className="filter-input bg-white">
                    <option value="all">Tipo (Todos)</option> <option value="venta">Venta</option> <option value="alquiler">Alquiler</option> <option value="inversion">Inversión</option>
                </select>
                <input type="number" id="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Precio Máximo (USD)" className="filter-input" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map(prop => ( <PropertyCard key={prop.id} prop={prop} onToggleCompare={onToggleCompare} onOpenModal={onOpenModal} isComparing={comparisonList.includes(prop.id)} /> ))
                ) : ( <p className="text-center col-span-full text-gray-500 text-lg">No se encontraron propiedades con los criterios seleccionados.</p> )}
            </div>
        </section>
    );
};