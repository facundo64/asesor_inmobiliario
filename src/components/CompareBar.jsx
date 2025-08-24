import React from 'react';

export const CompareBar = ({ properties, onClear, onCompare }) => {
    const isVisible = properties.length > 0;
    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-secondary text-white p-4 shadow-2xl z-40 transform transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
             <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="font-bold">Comparar Propiedades:</span>
                    <div className="flex gap-2">
                        {properties.map(p => ( <img key={p.id} src={p.images[0]} alt={p.title} className="compare-item-img" /> ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={onClear} className="text-sm hover:underline">Limpiar</button>
                    <button onClick={onCompare} disabled={properties.length < 2} className="btn btn-primary px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Comparar</button>
                </div>
            </div>
        </div>
    );
};