import React, { useState, useEffect } from 'react';

export const PropertyModal = ({ property, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!property) return;
        const interval = setInterval(() => {
            // Asegurarse de que property.images exista y tenga elementos
            if (property.images && property.images.length > 0) {
                setCurrentImageIndex(prev => (prev + 1) % property.images.length);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [property]);

    if (!property) return null;

    const annualRental = (property.estimatedRental || 0) * 12;
    const grossYield = property.price > 0 && property.type === 'venta' ? (annualRental / property.price) * 100 : 0;
    const netYield = property.price > 0 && property.type === 'venta' ? ((annualRental - (property.annualTaxes || 0) - (property.maintenanceCosts || 0)) / property.price) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-20 bg-black/30 rounded-full w-10 h-10 flex items-center justify-center">&times;</button>
                    <div className="carousel-container rounded-t-lg">
                        {property.images && property.images.map((img, i) => ( <div key={i} className={`carousel-slide ${i === currentImageIndex ? 'active' : ''}`}> <img src={img} alt={property.title} className="carousel-image" /> </div> ))}
                        <div className="carousel-dots">
                            {property.images && property.images.map((_, i) => ( <div key={i} className={`carousel-dot ${i === currentImageIndex ? 'active' : ''}`} onClick={() => setCurrentImageIndex(i)}></div> ))}
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div>
                            <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">{property.type}</span>
                            <h2 className="text-3xl font-bold mt-4">{property.title}</h2>
                            <p className="text-gray-600 my-2 text-lg"><i className="fas fa-map-marker-alt mr-2 text-primary"></i>{property.location}</p>
                            <p className="text-primary font-bold text-4xl my-4">${property.price.toLocaleString()}</p>
                            <p className="text-gray-700 leading-relaxed">{property.description}</p>
                        </div>
                        {property.advisorAnalysis && ( <div className="bg-red-50 border-l-4 border-primary p-4 rounded-r-lg"> <h4 className="font-bold text-secondary"><i className="fas fa-chart-line mr-2"></i>Análisis del Asesor</h4> <p className="text-gray-600 mt-2 italic">"{property.advisorAnalysis}"</p> </div> )}
                        {property.type === 'venta' && property.estimatedRental > 0 && (
                             <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-secondary mb-4"><i className="fas fa-calculator mr-2"></i>Potencial de Inversión</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                    <div className="bg-white p-4 rounded-lg shadow-sm"><p className="text-sm text-gray-500">Rendimiento Bruto Anual</p><p className="text-2xl font-bold text-green-600">{grossYield.toFixed(2)}%</p></div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm"><p className="text-sm text-gray-500">Rendimiento Neto Anual</p><p className="text-2xl font-bold text-green-700">{netYield.toFixed(2)}%</p></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-3 text-center">Cálculos basados en datos estimados. Consulte para un análisis detallado.</p>
                            </div>
                        )}
             
                        {property.brochure && (
                            <div className="mt-4">
                                <a 
                                    href={property.brochure} 
                                    download={`Folleto-${property.title.replace(/\s+/g, '_')}.pdf`} 
                                    className="btn btn-primary font-bold py-3 px-6 rounded-md w-full md:w-auto inline-flex items-center justify-center"
                                >
                                    <i className="fas fa-file-pdf mr-2"></i>Descargar Folleto
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};