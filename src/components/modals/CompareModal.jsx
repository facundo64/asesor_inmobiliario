import React from 'react';

export const CompareModal = ({ properties, isOpen, onClose }) => {
    if (!isOpen) return null;

    const metrics = [
        { label: 'Precio', key: 'price', format: (val) => `$${val.toLocaleString()}` },
        { label: 'Superficie', key: 'size', format: (val) => `${val} m²` },
        { label: 'Precio / m²', key: 'pricePerSqM', format: (val) => `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
        { label: 'Impuestos Anuales', key: 'annualTaxes', format: (val) => `$${(val || 0).toLocaleString()}` },
        { label: 'Alquiler Anual Estimado', key: 'rental', format: (val) => `$${val.toLocaleString()}` },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-secondary">Comparador Financiero</h2>
                    <button onClick={onClose} className="text-3xl text-gray-500 hover:text-primary">&times;</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3 font-semibold text-secondary sticky left-0 bg-white">Propiedad</th>
                                {properties.map(p => <th key={p.id} className="p-3 font-bold text-primary"><img src={p.images[0]} className="w-full h-24 object-cover rounded-md mb-2" alt={p.title}/>{p.title}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.map((metric, index) => (
                                <tr key={metric.key} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                    <th className="p-3 font-semibold text-secondary sticky left-0 bg-inherit">{metric.label}</th>
                                    {properties.map(prop => {
                                        let value;
                                        if (metric.key === 'pricePerSqM') value = prop.size > 0 ? (prop.price / prop.size) : 0;
                                        else if (metric.key === 'rental') value = (prop.estimatedRental || 0) * 12;
                                        else value = prop[metric.key] || 0;
                                        return <td key={prop.id} className="p-3 text-lg">{metric.format(value)}</td>
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};