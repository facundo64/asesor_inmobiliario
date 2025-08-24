import React from 'react';

export const PropertyCard = ({ prop, onToggleCompare, onOpenModal, isComparing }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <div className="relative">
            <img src={prop.images[0]} alt={prop.title} className="w-full h-56 object-cover" />
            {prop.isInvestmentOpportunity && ( <div className="investment-badge"><i className="fas fa-star mr-1"></i>Oportunidad</div> )}
        </div>
        <div className="p-6">
            <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">{prop.type}</span>
            <h3 className="font-bold text-xl mt-4 mb-2">{prop.title}</h3>
            <p className="text-gray-600 text-sm mb-4"><i className="fas fa-map-marker-alt mr-2 text-primary"></i>{prop.location}</p>
            <div className="flex justify-between items-center">
                <p className="text-primary font-bold text-2xl">${prop.price.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                    <button onClick={() => onToggleCompare(prop.id)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isComparing ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-primary hover:text-white'}`}>
                        <i className="fas fa-balance-scale-right"></i>
                    </button>
                    <button onClick={() => onOpenModal(prop)} className="btn btn-secondary px-4 py-2 rounded-md text-sm">Ver Detalles</button>
                </div>
            </div>
        </div>
    </div>
);