import React from 'react';

export const CompareBar = ({ properties = [], onCompare, onClear, onRemove }) => {
    // Si no hay propiedades seleccionadas, no mostrar la barra
    if (!properties || properties.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-4 px-4 z-50">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                        <h3 className="text-blue-800 font-medium mr-3">
                            Propiedades para comparar ({properties.length})
                        </h3>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClear}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
                        >
                            Limpiar
                        </button>
                        <button
                            onClick={onCompare}
                            disabled={properties.length < 2}
                            className={`px-4 py-2 rounded ${
                                properties.length >= 2
                                    ? 'bg-primary text-white hover:bg-primary/90'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Comparar propiedades
                        </button>
                    </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pt-3 pb-1">
                    {properties.map(property => (
                        <div 
                            key={property.id} 
                            className="flex items-center bg-blue-50 p-2 rounded-lg min-w-[180px] border border-blue-100"
                        >
                            <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
                                <img 
                                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/100'} 
                                    alt="" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-medium text-blue-800 truncate">{property.title || "Propiedad"}</p>
                                {/* Asegurar que el precio sea visible */}
                                <p className="text-xs text-primary font-semibold">${property.price?.toLocaleString() || '0'}</p>
                            </div>
                            <button 
                                onClick={() => onRemove && onRemove(property)}
                                className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};