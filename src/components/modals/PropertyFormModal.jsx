import React, { useState, useEffect } from 'react';

export const PropertyFormModal = ({ isOpen, onClose, onSave, propertyToEdit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        type: '', // Cambiado a string vacío
        status: 'disponible',
        highlight: false,
        rentalIncome: '',
        annualTaxes: '',
        maintenanceCosts: '',
        advisorAnalysis: ''
    });
    
    const [imageFiles, setImageFiles] = useState(null);
    const [brochureFile, setBrochureFile] = useState(null);
    const [imagePreview, setImagePreview] = useState([]);
    const [brochurePreview, setBrochurePreview] = useState('');
    
    useEffect(() => {
        if (propertyToEdit) {
            // Importante: asegurarse de que id se incluya en formData
            setFormData({
                id: propertyToEdit.id, // Asegúrate de incluir el ID para actualizaciones
                title: propertyToEdit.title || '',
                description: propertyToEdit.description || '',
                price: propertyToEdit.price || '',
                location: propertyToEdit.location || '',
                bedrooms: propertyToEdit.bedrooms || '',
                bathrooms: propertyToEdit.bathrooms || '',
                area: propertyToEdit.area || '',
                type: propertyToEdit.type || '', // Puede ser vacío ahora
                status: propertyToEdit.status || 'disponible',
                highlight: propertyToEdit.highlight || false,
                rentalIncome: propertyToEdit.rentalIncome || '',
                annualTaxes: propertyToEdit.annualTaxes || '',
                maintenanceCosts: propertyToEdit.maintenanceCosts || '',
                advisorAnalysis: propertyToEdit.advisorAnalysis || ''
            });
            
            if (propertyToEdit.images && propertyToEdit.images.length > 0) {
                setImagePreview(propertyToEdit.images);
            }
            
            if (propertyToEdit.brochure) {
                setBrochurePreview(propertyToEdit.brochure);
            }
        } else {
            resetForm();
        }
    }, [propertyToEdit]);
    
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            location: '',
            bedrooms: '',
            bathrooms: '',
            area: '',
            type: '', // Cambiado a string vacío
            status: 'disponible',
            highlight: false,
            rentalIncome: '',
            annualTaxes: '',
            maintenanceCosts: '',
            advisorAnalysis: ''
        });
        setImageFiles(null);
        setBrochureFile(null);
        setImagePreview([]);
        setBrochurePreview('');
    };
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFiles(e.target.files);
            
            const previews = [];
            for (let i = 0; i < e.target.files.length; i++) {
                previews.push(URL.createObjectURL(e.target.files[i]));
            }
            setImagePreview(previews);
        }
    };
    
    const handleBrochureChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setBrochureFile(e.target.files[0]);
            setBrochurePreview(URL.createObjectURL(e.target.files[0]));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Importante: asegúrate de que los campos numéricos sean realmente números
        const processedData = {
            ...formData,
            price: formData.price ? Number(formData.price) : '',
            bedrooms: formData.bedrooms ? Number(formData.bedrooms) : '',
            bathrooms: formData.bathrooms ? Number(formData.bathrooms) : '',
            area: formData.area ? Number(formData.area) : '',
            rentalIncome: formData.rentalIncome ? Number(formData.rentalIncome) : '',
            annualTaxes: formData.annualTaxes ? Number(formData.annualTaxes) : '',
            maintenanceCosts: formData.maintenanceCosts ? Number(formData.maintenanceCosts) : '',
        };
        
        // Añade logs para depurar
        console.log("Enviando datos al servidor:", processedData);
        console.log("Imágenes:", imageFiles);
        console.log("Folleto:", brochureFile);
        
        // Llama a onSave con todos los datos necesarios
        onSave(processedData, imageFiles, brochureFile);
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto text-gray-800">
                <h2 className="text-2xl font-bold text-blue-800 mb-6">
                    {propertyToEdit ? 'Editar Propiedad' : 'Añadir Nueva Propiedad'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleChange} placeholder="Título de la Propiedad" required className="w-full p-3 border rounded"/>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Descripción" required className="w-full p-3 border rounded" rows="4"></textarea>
                    <input type="number" name="price" value={formData.price || ''} onChange={handleChange} placeholder="Precio (USD)" required className="w-full p-3 border rounded"/>
                    
                    {/* SECCIÓN DE TIPO MEJORADA */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="">Sin clasificación</option>
                            <option value="venta">Venta</option>
                            <option value="alquiler">Alquiler</option>
                        </select>
                    </div>
                    
                    <input type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Ubicación" required className="w-full p-3 border rounded"/>
                    <input type="number" name="area" value={formData.area || ''} onChange={handleChange} placeholder="Superficie (m²)" required className="w-full p-3 border rounded"/>
                    
                    {/* SECCIÓN DE CARGA DE IMÁGENES MEJORADA */}
                    <div className="md:col-span-2 mt-6">
                        <label className="block text-gray-700 font-medium mb-2">Imágenes (JPG, PNG)</label>
                        <div className="mb-3">
                            <label className="inline-block px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-md">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Elegir archivos
                                </div>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="ml-3 text-gray-600">
                                {imageFiles ? `${imageFiles.length} archivo(s) seleccionado(s)` : 'No se eligió ningún archivo'}
                            </span>
                        </div>
                        {imagePreview.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                                {imagePreview.map((src, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={src}
                                            alt={`Vista previa ${index}`}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* SECCIÓN DE CARGA DE PDF MEJORADA */}
                    <div className="md:col-span-2 mt-6">
                        <label className="block text-gray-700 font-medium mb-2">Folleto (PDF)</label>
                        <div className="mb-3">
                            <label className="inline-block px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-md">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Elegir archivo
                                </div>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleBrochureChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="ml-3 text-gray-600">
                                {brochureFile ? brochureFile.name : 'No se eligió ningún archivo'}
                            </span>
                        </div>
                    </div>
                    
                    {/* SECCIÓN DE ANÁLISIS FINANCIERO MEJORADA */}
                    <div className="md:col-span-2 mt-6">
                        <label className="block text-gray-700 font-medium mb-3">Datos para Análisis Financiero</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Ingreso Alquiler Mensual</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="USD"
                                        name="rentalIncome"
                                        value={formData.rentalIncome || ''}
                                        onChange={handleChange}
                                        className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Impuestos Anuales</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="USD"
                                        name="annualTaxes"
                                        value={formData.annualTaxes || ''}
                                        onChange={handleChange}
                                        className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Costos Mantenimiento Anual</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="USD"
                                        name="maintenanceCosts"
                                        value={formData.maintenanceCosts || ''}
                                        onChange={handleChange}
                                        className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm text-gray-600 mb-1">Análisis del Asesor</label>
                            <textarea
                                name="advisorAnalysis"
                                placeholder="Análisis del Asesor..."
                                value={formData.advisorAnalysis || ''}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            ></textarea>
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="highlight"
                                name="highlight"
                                checked={formData.highlight || false}
                                onChange={handleChange}
                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="highlight" className="ml-2 text-gray-700">
                                Marcar como Destacada
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                        >
                            Guardar Propiedad
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
