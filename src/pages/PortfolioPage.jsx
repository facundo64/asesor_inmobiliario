import React, { useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { CompareBar } from '../components/CompareBar';

export const PortfolioPage = ({ properties = [], onOpenProperty, onToggleCompare, compareList = [], onOpenCompare }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Filtrar las propiedades
    const filteredProperties = Array.isArray(properties) ? properties.filter(property => {
        const matchesSearch = !searchTerm || 
            (property.title && property.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase()));
            
        const matchesType = !selectedType ? true :
                            selectedType === 'sin-tipo' ? !property.type || property.type === '' :
                            property.type === selectedType;
            
        const matchesPrice = !maxPrice || 
            (property.price && property.price <= parseFloat(maxPrice));
            
        return matchesSearch && matchesType && matchesPrice;
    }) : [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 pb-24">
            {/* Banner principal */}
            <div className="bg-blue-900 py-16 px-4">
                <div className="container mx-auto max-w-7xl text-center">
                    <h1 className="font-serif text-4xl md:text-5xl text-light font-bold mb-4">Portafolio de Inversiones</h1>
                    <p className="text-blue-100 max-w-3xl mx-auto">
                        Una selección curada de activos de primer nivel, elegidos por su potencial de
                        revalorización y su calidad excepcional.
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Sección de Filtros */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-blue-800 font-medium mb-2">Búsqueda</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por palabra clave..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-blue-800 font-medium mb-2">Tipo de Propiedad</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                            >
                                <option value="">Todos</option>
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                                <option value="sin-tipo">Sin clasificación</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-blue-800 font-medium mb-2">Precio Máximo (USD)</label>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Sin límite"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid de propiedades */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property) => (
                            <PropertyCard 
                                key={property.id} 
                                property={property} 
                                onOpen={() => onOpenProperty(property)} 
                                onToggleCompare={() => onToggleCompare(property)}
                                isInCompare={compareList.some(p => p.id === property.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-white rounded-lg">
                            <p className="text-lg text-gray-600">No se encontraron propiedades con los criterios seleccionados.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Barra de comparación */}
            <CompareBar 
                properties={compareList} 
                onCompare={onOpenCompare} 
                onClear={() => {
                 
                    const clearEvent = new CustomEvent('clearComparison');
                    window.dispatchEvent(clearEvent);
                }}
                onRemove={(property) => onToggleCompare(property)}
            />
        </div>
    );
};
