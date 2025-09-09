import React, { useState, useEffect } from 'react';
import { PropertyFormModal } from '../components/modals/PropertyFormModal';

export const AdminPage = ({ 
    user, 
    onLogin, 
    onLogout, 
    leads = [], 
    properties = [], 
    onUpdateLeadStatus, 
    onDeleteLead, 
    onDeleteProperty, 
    onOpenPropertyForm, 
    onEditProperty, 
    onOpenNotesModal, 
    onDownloadCSV,
    navigate,
    onSaveProperty, 
    onSaveNotes
}) => {
    // Estados para el formulario de login
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPropertyForm, setShowPropertyForm] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar propiedades según el término de búsqueda
    const filteredProperties = properties.filter(property => 
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        property.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // manejo de el login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');
            await onLogin(email, password);
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProperty = () => {
        setPropertyToEdit(null);
        setShowPropertyForm(true);
    };

    const handleEditProperty = (property) => {
        setPropertyToEdit(property);
        setShowPropertyForm(true);
    };


    const handleSaveProperty = (formData, imageFiles, brochureFile) => {

        onSaveProperty(formData, imageFiles, brochureFile);
        setShowPropertyForm(false);
    };

    // Si no hay usuario autenticado, mostrar el formulario de login
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-secondary p-4">
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl text-light font-bold mb-3">Acceso Administrador</h1>
                        <div className="w-16 h-1 bg-primary mx-auto"></div>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Correo Electrónico"
                                className="w-full p-4 rounded-lg bg-secondary border border-gray-700 text-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                        
                        <div>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Contraseña"
                                className="w-full p-4 rounded-lg bg-secondary border border-gray-700 text-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                        
                        {error && (
                            <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            className="w-full text-white font-bold py-4 px-8 rounded-lg red-dynamic-button text-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Procesando...
                                </div>
                            ) : (
                                "Ingresar"
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => navigate('home')}
                            className="text-gray-400 hover:text-primary transition-colors text-sm"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Si hay usuario autenticado, mostrar el panel de administración
    return (
        <div className="min-h-screen bg-secondary pb-16">
            <div className="container mx-auto px-4 pt-8">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-serif font-bold text-light">Panel de Control</h1>
                    <button 
                        onClick={onLogout} 
                        className="text-gray-400 border border-gray-700 rounded-lg px-5 py-2 hover:text-red-400 hover:border-red-900 transition-all"
                    >
                        Cerrar Sesión
                    </button>
                </div>
                
                {/* SECCIÓN DE CLIENTES POTENCIALES */}
                <div className="mb-16 bg-gray-900/30 rounded-xl shadow-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-2xl font-serif text-light font-bold">Clientes Potenciales</h2>
                        <button 
                            onClick={onDownloadCSV} 
                            className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <span>Descargar CSV</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-900/50 text-left text-gray-400 text-sm">
                                    <th className="p-4">Nombre</th>
                                    <th className="p-4">Contacto</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {leads.length > 0 ? (
                                    leads.map((lead, index) => (
                                        <tr key={index} className="hover:bg-gray-900/20 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-light">{lead.name}</div>
                                                <div className="text-gray-500 text-sm">{new Date(lead.timestamp).toLocaleDateString()}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-gray-300">{lead.email}</div>
                                                <div className="text-gray-500">{lead.phone}</div>
                                                {lead.message && (
                                                    <div className="text-xs text-gray-500 mt-1 italic truncate max-w-xs">
                                                        "{lead.message}"
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    lead.status === 'pending' ? 'bg-yellow-900/30 text-yellow-500' : 
                                                    lead.status === 'contacted' ? 'bg-blue-900/30 text-blue-500' : 
                                                    lead.status === 'converted' ? 'bg-green-900/30 text-green-500' : 
                                                    lead.status === 'rejected' ? 'bg-red-900/30 text-red-500' : 
                                                    'bg-gray-800 text-gray-400'
                                                }`}>
                                                    {lead.status === 'pending' ? 'Pendiente' : 
                                                    lead.status === 'contacted' ? 'Contactado' : 
                                                    lead.status === 'converted' ? 'Convertido' : 
                                                    lead.status === 'rejected' ? 'Rechazado' : 
                                                    'Sin Estado'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button 
                                                        onClick={() => onOpenNotesModal(lead)}
                                                        className="text-gray-400 hover:text-primary p-1"
                                                        title="Agregar Nota"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => onUpdateLeadStatus(lead.id, 'contacted')}
                                                        className="text-gray-400 hover:text-blue-500 p-1"
                                                        title="Marcar como Contactado"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => onUpdateLeadStatus(lead.id, 'converted')}
                                                        className="text-gray-400 hover:text-green-500 p-1"
                                                        title="Marcar como Convertido"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => onUpdateLeadStatus(lead.id, 'rejected')}
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                        title="Marcar como Rechazado"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-6 text-center text-gray-500">
                                            No hay clientes potenciales registrados aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* SECCIÓN DE PROPIEDADES */}
                <div className="bg-gray-900/30 rounded-xl shadow-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-2xl font-serif text-light font-bold">Gestionar Propiedades</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-grow">
                                <input 
                                    type="text" 
                                    placeholder="Buscar propiedad..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 pl-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <button 
                                onClick={handleAddProperty}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Añadir Propiedad
                            </button>
                        </div>
                    </div>
                    
                    {filteredProperties.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-800/80 border-b border-gray-700">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Título</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Tipo</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Precio</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-300 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredProperties.map(property => (
                                        <tr key={property.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 flex-shrink-0 mr-3">
                                                        {property.images && property.images.length > 0 ? (
                                                            <img 
                                                                src={property.images[0]} 
                                                                alt="" 
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center text-gray-400">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{property.title}</div>
                                                        <div className="text-sm text-gray-400">{property.location}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    property.type === 'venta' ? 'bg-blue-900/50 text-blue-300' : 
                                                    property.type === 'alquiler' ? 'bg-green-900/50 text-green-300' : 
                                                    'bg-gray-700/50 text-gray-300'
                                                }`}>
                                                    {property.type === 'venta' ? 'Venta' : 
                                                     property.type === 'alquiler' ? 'Alquiler' : 
                                                     'Sin clasificación'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-primary">
                                                    ${property.price?.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    property.status === 'disponible' ? 'bg-green-900/50 text-green-300' : 
                                                    property.status === 'reservado' ? 'bg-yellow-900/50 text-yellow-300' : 
                                                    'bg-gray-700 text-gray-300'
                                                }`}>
                                                    {property.status === 'disponible' ? 'Disponible' : 
                                                     property.status === 'reservado' ? 'Reservado' : 'Vendido'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleEditProperty(property)}
                                                        className="p-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-800"
                                                        title="Editar propiedad"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => onDeleteProperty(property.id)}
                                                        className="p-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-800"
                                                        title="Eliminar propiedad"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-300 mb-4">No hay propiedades disponibles</div>
                            <button 
                                onClick={handleAddProperty}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Añadir la primera propiedad
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Modal de formulario de propiedad */}
            {showPropertyForm && (
                <PropertyFormModal 
                    isOpen={showPropertyForm} 
                    onClose={() => setShowPropertyForm(false)} 
                    onSave={handleSaveProperty}  
                    propertyToEdit={propertyToEdit}
                />
            )}
        </div>
    );
};