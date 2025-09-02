import React from 'react';

export const PropertyCard = ({ prop, onToggleCompare, onOpenModal, isComparing }) => (
    <div className="property-card-deluxe rounded-lg overflow-hidden flex flex-col">
        <div className="relative overflow-hidden">
            <img src={prop.images && prop.images[0] ? prop.images[0] : 'https://placehold.co/600x400/121212/D4AF37?text=Propiedad'} alt={prop.title} className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110" />
            {prop.isInvestmentOpportunity && (
                <div className="absolute top-4 left-4 bg-primary text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <i className="fas fa-star mr-1"></i>Oportunidad
                </div>
            )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <span className="inline-block bg-gray-800 text-primary text-xs font-semibold px-3 py-1 rounded-full self-start">{prop.type}</span>
            <h3 className="font-serif font-bold text-2xl mt-4 mb-2 text-light flex-grow">{prop.title}</h3>
            <p className="text-gray-400 text-sm mb-4"><i className="fas fa-map-marker-alt mr-2 text-primary"></i>{prop.location}</p>
            <div className="border-t border-gray-800 pt-4 mt-auto">
                <div className="flex justify-between items-center">
                    <p className="text-primary font-bold text-3xl">${prop.price ? prop.price.toLocaleString() : 'N/A'}</p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => onToggleCompare(prop.id)} 
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${isComparing ? 'bg-primary text-secondary' : 'bg-gray-800 text-gray-400 hover:bg-primary/20 hover:text-primary'}`}
                            title="Comparar"
                        >
                            <i className="fas fa-balance-scale-right"></i>
                        </button>
                        <button 
                            onClick={() => onOpenModal(prop)} 
                            className="bg-gray-800 text-light px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary hover:text-secondary transition-colors duration-300"
                        >
                            Ver Más
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);