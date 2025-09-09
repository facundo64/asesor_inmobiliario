import React from 'react';

export const PropertyCard = ({ property, onOpen, onToggleCompare, isInCompare }) => {
    // Verificar que la propiedad existe
    if (!property) return null;
    
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative aspect-[16/9]">
                <img 
                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/800x600?text=Sin+imagen'} 
                    alt={property.title || "Propiedad"} 
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                        {property.type || 'Venta'}
                    </span>
                </div>
            </div>
            
            <div className="p-5">
                <h3 className="text-xl font-serif font-bold text-blue-800 mb-2">{property.title || "Sin título"}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{property.description || "Sin descripción"}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                    {property.type ? (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            property.type === 'venta' ? 'bg-blue-100 text-blue-800' : 
                            property.type === 'alquiler' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {property.type === 'venta' ? 'Venta' : 
                             property.type === 'alquiler' ? 'Alquiler' : ''}
                        </span>
                    ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            Sin clasificación
                        </span>
                    )}
                    
                    {/* Otras etiquetas como ubicación, habitaciones, etc. */}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-primary">${property.price?.toLocaleString() || '0'}</span>
                    <div className="flex space-x-1 text-gray-500">
                        {property.bedrooms && (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                {property.bedrooms}
                            </span>
                        )}
                        {property.bathrooms && (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                {property.bathrooms}
                            </span>
                        )}
                        {property.area && (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                </svg>
                                {property.area} m²
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-between">
                    <button 
                        onClick={() => onOpen && onOpen()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Ver detalles
                    </button>
                    <button 
                        onClick={() => onToggleCompare && onToggleCompare()}
                        className={`p-2 rounded-lg transition-colors ${
                            isInCompare 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={isInCompare ? "Quitar de comparación" : "Añadir a comparación"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};