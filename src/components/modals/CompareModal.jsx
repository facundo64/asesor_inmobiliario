import React from 'react';

export const CompareModal = ({ isOpen, onClose, properties = [] }) => {
    // Verificar si no hay propiedades o si isOpen es false
    if (!isOpen || !properties || properties.length === 0) return null;

   
    const allFeatures = ['price', 'location', 'type', 'size', 'bedrooms', 'bathrooms', 'status'];
    

    const featureNames = {
        price: 'Precio',
        location: 'Ubicación',
        type: 'Tipo',
        size: 'Superficie',
        bedrooms: 'Dormitorios',
        bathrooms: 'Baños',
        status: 'Estado',
        estimatedRental: 'Ingreso Mensual Estimado',
        annualTaxes: 'Impuestos Anuales',
        maintenanceCosts: 'Costos Mantenimiento',
        advisorAnalysis: 'Análisis del Asesor'
    };

    // Añadir características financieras si existen en alguna propiedad
    if (properties.some(p => p.estimatedRental || p.annualTaxes || p.maintenanceCosts)) {
        allFeatures.push('estimatedRental', 'annualTaxes', 'maintenanceCosts');
    }
    
    // Añadir análisis si existe
    if (properties.some(p => p.advisorAnalysis)) {
        allFeatures.push('advisorAnalysis');
    }

    // Formatea el valor según su tipo
    const formatValue = (feature, value) => {
        if (value === undefined || value === null || value === '') return '-';
        
        switch (feature) {
            case 'price':
            case 'estimatedRental':
            case 'annualTaxes':
            case 'maintenanceCosts':
                return `$${parseInt(value).toLocaleString()}`;
            case 'type':
                return value === 'venta' ? 'Venta' : 
                      value === 'alquiler' ? 'Alquiler' : '-';
            case 'size':
                return `${value} m²`;
            case 'status':
                return value === 'disponible' ? 'Disponible' : 
                      value === 'reservado' ? 'Reservado' : 'Vendido';
            default:
                return value;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-800">Comparación de Propiedades</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-4 text-left text-gray-600 w-1/4">Característica</th>
                                {properties.map((property, index) => (
                                    <th key={index} className="p-4 text-center">
                                        <div className="mb-2">
                                            {property.images && property.images.length > 0 ? (
                                                <img 
                                                    src={property.images[0]} 
                                                    alt={property.title || `Propiedad ${index + 1}`}
                                                    className="w-24 h-24 object-cover mx-auto rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-bold text-blue-800">{property.title || `Propiedad ${index + 1}`}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allFeatures.map(feature => (
                                <tr key={feature} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-700">
                                        {featureNames[feature] || feature}
                                    </td>
                                    {properties.map((property, index) => (
                                        <td key={index} className={`p-4 text-center ${feature === 'advisorAnalysis' ? 'text-left' : ''}`}>
                                            {feature === 'advisorAnalysis' ? (
                                                <div className="max-h-32 overflow-y-auto bg-blue-50 p-3 rounded text-sm">
                                                    {formatValue(feature, property[feature])}
                                                </div>
                                            ) : (
                                                <span className={`${feature === 'price' ? 'font-bold text-primary' : ''}`}>
                                                    {formatValue(feature, property[feature])}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};