import React, { useState, useEffect } from 'react';

export const PropertyFormModal = ({ isOpen, onClose, onSave, propertyToEdit }) => {
    const [formData, setFormData] = useState({});
    const [imageFiles, setImageFiles] = useState(null);
    const [brochureFile, setBrochureFile] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        setFormData(propertyToEdit || { type: 'venta', isInvestmentOpportunity: false });
        setImageFiles(null);
        setBrochureFile(null);
        setImagePreviews(propertyToEdit?.images || []);
    }, [propertyToEdit, isOpen]);

    const handleTextChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files) {
            setImageFiles(files);
            const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, imageFiles, brochureFile);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4`}>
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                <h2 className="text-2xl font-bold mb-6">{propertyToEdit ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={formData.title || ''} onChange={handleTextChange} placeholder="Título de la Propiedad" required className="w-full p-3 border rounded"/>
                    <textarea name="description" value={formData.description || ''} onChange={handleTextChange} placeholder="Descripción" required className="w-full p-3 border rounded" rows="4"></textarea>
                    <input type="number" name="price" value={formData.price || ''} onChange={handleTextChange} placeholder="Precio (USD)" required className="w-full p-3 border rounded"/>
                    <select name="type" value={formData.type || 'venta'} onChange={handleTextChange} required className="w-full p-3 border rounded bg-white"> <option value="venta">Venta</option> <option value="renta">Renta</option> </select>
                    <input type="text" name="location" value={formData.location || ''} onChange={handleTextChange} placeholder="Ubicación" required className="w-full p-3 border rounded"/>
                    <input type="number" name="size" value={formData.size || ''} onChange={handleTextChange} placeholder="Superficie (m²)" required className="w-full p-3 border rounded"/>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes (JPG, PNG)</label>
                        <input type="file" name="images" multiple accept="image/jpeg, image/png" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-primary/20"/>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {imagePreviews.map((src, i) => <img key={i} src={src} alt={`preview ${i}`} className="w-20 h-20 object-cover rounded"/>)}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Folleto (PDF)</label>
                        <input type="file" name="brochure" accept="application/pdf" onChange={(e) => setBrochureFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-primary/20"/>
                        {brochureFile && <p className="text-xs text-gray-500 mt-1">Archivo seleccionado: {brochureFile.name}</p>}
                    </div>

                    <hr/>
                    <div className="pt-4 space-y-4">
                        <p className="font-semibold text-secondary">Datos para Análisis Financiero</p>
                        <textarea name="advisorAnalysis" value={formData.advisorAnalysis || ''} onChange={handleTextChange} placeholder="Análisis del Asesor..." className="w-full p-3 border rounded" rows="3"></textarea>
                        <input type="number" name="estimatedRental" value={formData.estimatedRental || ''} onChange={handleTextChange} placeholder="Ingreso Alquiler Mensual Estimado (USD)" className="w-full p-3 border rounded"/>
                        <input type="number" name="annualTaxes" value={formData.annualTaxes || ''} onChange={handleTextChange} placeholder="Impuestos Anuales Estimados (USD)" className="w-full p-3 border rounded"/>
                        <input type="number" name="maintenanceCosts" value={formData.maintenanceCosts || ''} onChange={handleTextChange} placeholder="Costos Mantenimiento Anual (USD)" className="w-full p-3 border rounded"/>
                        <div className="flex items-center">
                            <input type="checkbox" name="isInvestmentOpportunity" checked={formData.isInvestmentOpportunity || false} onChange={handleTextChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"/>
                            <label htmlFor="isInvestmentOpportunity" className="ml-2 block text-sm text-gray-900">Marcar como Oportunidad de Inversión</label>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary px-4 py-2 rounded">Cancelar</button>
                        <button type="submit" className="btn btn-primary px-4 py-2 rounded">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
