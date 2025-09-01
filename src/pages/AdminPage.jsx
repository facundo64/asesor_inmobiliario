import React, { useState } from 'react';

export const AdminPage = ({ 
    user, 
    onLogin, 
    onLogout, 
    leads, 
    properties, 
    onUpdateLeadStatus, 
    onDeleteLead, 
    onDeleteProperty, 
    onOpenPropertyForm, 
    onEditProperty, 
    onOpenNotesModal, 
    onDownloadCSV 
}) => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { email, password } = Object.fromEntries(new FormData(e.target));
        await onLogin(email, password);
        setLoading(false);
    };

    if (!user) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Acceso Administrador</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input type="email" name="email" required placeholder="Correo Electrónico" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    <input type="password" name="password" required placeholder="Contraseña" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    <div>
                        <button type="submit" disabled={loading} className="w-full btn btn-primary font-bold py-3 px-4 rounded-md disabled:opacity-50">
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
    
    const statusStyles = { potencial: { text: 'Potencial', color: 'bg-yellow-500' }, aceptado: { text: 'Aceptado', color: 'bg-green-500' }, rechazado: { text: 'Rechazado', color: 'bg-red-500' } };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Panel de Control</h2>
                <button onClick={onLogout} className="btn btn-secondary">Cerrar Sesión</button>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-2xl font-semibold mb-4">Clientes Potenciales</h3>
                <div className="flex justify-end mb-4">
                    <button onClick={onDownloadCSV} className="btn btn-secondary px-4 py-2 rounded-md text-sm"><i className="fas fa-file-csv mr-2"></i>Descargar CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Contacto</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length === 0 ? (
                                <tr><td colSpan="4" className="text-center p-4 text-gray-500">No hay clientes.</td></tr>
                            ) : (
                                leads.map(lead => (
                                    <tr key={lead.id} className="border-b">
                                        <td className="p-3 align-top">
                                            <p className="font-bold">{lead.fullName}</p>
                                            <p className="text-sm text-gray-500">{new Date(lead.createdAt.toDate()).toLocaleDateString()}</p>
                                        </td>
                                        <td className="p-3 text-sm align-top">
                                            <p>{lead.email}</p>
                                            <p>{lead.phone}</p>
                                            {lead.message && <p className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 italic">"{lead.message}"</p>}
                                        </td>
                                        <td className="p-3 align-top">
                                            <span className="flex items-center">
                                                <span className={`status-dot ${statusStyles[lead.status]?.color || 'bg-gray-400'}`}></span>
                                                {statusStyles[lead.status]?.text || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="flex items-center space-x-1">
                                                <button onClick={() => onOpenNotesModal(lead)} title="Notas" className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"><i className="fas fa-clipboard"></i></button>
                                                <button onClick={() => onUpdateLeadStatus(lead.id, 'aceptado')} title="Aceptado" className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200"><i className="fas fa-check"></i></button>
                                                <button onClick={() => onUpdateLeadStatus(lead.id, 'potencial')} title="Potencial" className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200"><i className="fas fa-user-clock"></i></button>
                                                <button onClick={() => onUpdateLeadStatus(lead.id, 'rechazado')} title="Rechazado" className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"><i className="fas fa-times"></i></button>
                                                <button onClick={() => onDeleteLead(lead.id)} title="Eliminar" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6">
                <h3 className="text-2xl font-semibold mb-4">Gestionar Propiedades</h3>
                <button onClick={onOpenPropertyForm} className="btn btn-primary mb-4 px-4 py-2 rounded-md"><i className="fas fa-plus mr-2"></i>Agregar Propiedad</button>
                <div className="space-y-4">
                    {properties.map(prop => (
                        <div key={prop.id} className="bg-white p-4 rounded-lg flex justify-between items-center">
                            <div> <p className="font-bold">{prop.title}</p> <p className="text-sm text-gray-600">{prop.location} - ${prop.price.toLocaleString()}</p> </div>
                            <div className="space-x-2">
                                <button onClick={() => onEditProperty(prop)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                                <button onClick={() => onDeleteProperty(prop.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};