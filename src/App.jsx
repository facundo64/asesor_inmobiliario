import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './firebase';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { HomePage } from './pages/HomePage.jsx';
import { PortfolioPage } from './pages/PortfolioPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { Header } from './components/Header.jsx';
import { Toast } from './components/Toast.jsx';
import { CompareBar } from './components/CompareBar.jsx';
import { PropertyModal } from './components/modals/PropertyModal.jsx';
import { NotesModal } from './components/modals/NotesModal.jsx';
import { PropertyFormModal } from './components/modals/PropertyFormModal.jsx';
import { CompareModal } from './components/modals/CompareModal.jsx';
import { 
    addLead, 
    getLeads, 
    updateLeadStatus, 
    deleteLead,
    addProperty,
    getProperties,
    updateProperty,
    deleteProperty 
} from './services/firestore';


const getInitialProperties = () => [
    {id: 1, title: 'Villa de Lujo con Vista al Mar', description: 'Espectacular villa con diseño moderno, piscina infinita y acceso directo a la playa...', price: 2500000, type: 'venta', location: 'Marbella, España', size: 450, images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], brochure: null, isInvestmentOpportunity: true, advisorAnalysis: "Alto potencial de revalorización por desarrollo turístico en la zona. Ideal para alquiler vacacional de alta gama.", estimatedRental: 15000, annualTaxes: 8000, maintenanceCosts: 5000},
    {id: 2, title: 'Apartamento Moderno en el Centro', description: 'Luminoso apartamento en el corazón de la ciudad...', price: 450000, type: 'venta', location: 'Buenos Aires, Argentina', size: 95, images: ['https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], brochure: null, isInvestmentOpportunity: false, advisorAnalysis: "Ubicación estratégica para alquiler a largo plazo a profesionales. Rentabilidad estable y bajo riesgo.", estimatedRental: 1200, annualTaxes: 1000, maintenanceCosts: 600},
    {id: 3, title: 'PH con Terraza Propia en Palermo', description: 'Increíble PH de 3 ambientes con terraza privada, parrilla y jacuzzi. Completamente renovado con estilo industrial.', price: 680000, type: 'venta', location: 'Palermo, Buenos Aires', size: 120, images: ['https://images.pexels.com/photos/210552/pexels-photo-210552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], brochure: null, isInvestmentOpportunity: true, advisorAnalysis: "Propiedad única en una de las zonas más demandadas. Excelente para alquiler temporario a turistas con alta rentabilidad en dólares.", estimatedRental: 2500, annualTaxes: 1500, maintenanceCosts: 800},
    {id: 4, title: 'Casa Familiar en Nordelta', description: 'Espaciosa casa de 5 ambientes con jardín, piscina y muelle propio sobre la laguna. Seguridad 24hs y amenities de primer nivel.', price: 950000, type: 'venta', location: 'Nordelta, Tigre', size: 320, images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], brochure: null, isInvestmentOpportunity: false, advisorAnalysis: "Inversión en calidad de vida. Aunque la rentabilidad por alquiler es moderada, la revalorización de la tierra en la zona es constante y segura.", estimatedRental: 2000, annualTaxes: 4000, maintenanceCosts: 2500},
    {id: 5, title: '2 Ambientes Luminoso en Caballito', description: 'Departamento de 2 ambientes con balcón al contrafrente. Muy luminoso y silencioso. A metros del subte y Parque Rivadavia.', price: 900, type: 'renta', location: 'Caballito, Buenos Aires', size: 50, images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], brochure: null, isInvestmentOpportunity: true, advisorAnalysis: "Alta demanda de alquiler en la zona por su conectividad. Ideal para inversores que buscan una renta estable y de bajo mantenimiento.", estimatedRental: 900, annualTaxes: 0, maintenanceCosts: 0}
];



export default function App() {
    const [leads, setLeads] = useState([]);
    const [properties, setProperties] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // verifica si Firebase está comprobando el estado de autenticación
    
    const [currentPage, setCurrentPage] = useState('home');
    const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [editingProperty, setEditingProperty] = useState(null);
    const [isPropertyFormOpen, setPropertyFormOpen] = useState(false);
    const [selectedLeadForNotes, setSelectedLeadForNotes] = useState(null);
    const [comparisonList, setComparisonList] = useState([]);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);

    useEffect(() => {
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesomeLink);
        
    
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setAuthLoading(false);
        });

        return () => {
            if (document.head.contains(fontAwesomeLink)) {
                document.head.removeChild(fontAwesomeLink);
            }
            unsubscribe(); // Limpia el listener al desmontar
        };
    }, []);

    useEffect(() => {
        // Cargar datos al iniciar
        const loadData = async () => {
            try {
                const loadedLeads = await getLeads();
                setLeads(loadedLeads);
                
                const loadedProperties = await getProperties();
                setProperties(loadedProperties);
            } catch (error) {
                console.error("Error loading data:", error);
                // Aquí podrías mostrar un mensaje de error al usuario
            }
        };
        
        loadData();
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }, []);

    const navigate = (page) => {
        setCurrentPage(page);
        window.history.pushState(null, '', `#${page}`);
    };

    const handleAddLead = async (leadData) => {
        try {
            const newLead = await addLead(leadData);
            setLeads(prev => [newLead, ...prev]);
            showToast('¡Gracias por tu interés! Nos pondremos en contacto pronto.');
            console.log('Lead añadido:', newLead); // Para debugging
        } catch (error) {
            console.error("Error adding lead:", error);
            showToast('Error al guardar los datos', 'error');
        }
    };

    const handleUpdateLeadStatus = async (id, status) => {
        try {
            await updateLeadStatus(id, status);
            setLeads(prev => prev.map(lead => 
                lead.id === id ? { ...lead, status } : lead
            ));
            showToast('Estado actualizado correctamente');
        } catch (error) {
            console.error("Error updating lead:", error);
            showToast('Error al actualizar el estado', 'error');
        }
    };

    const handleDeleteLead = async (id) => {
        try {
            await deleteLead(id);
            setLeads(prev => prev.filter(lead => lead.id !== id));
            showToast('Cliente eliminado.');
        } catch (error) {
            console.error("Error deleting lead:", error);
            showToast('Error al eliminar el cliente', 'error');
        }
    };
    
    const saveNoteToLead = (leadId, noteText) => {
        const newNote = { text: noteText, date: new Date().toISOString() };
        let updatedLead;
        setLeads(prevLeads => {
            const newLeads = prevLeads.map(lead => {
                if (lead.id === leadId) {
                    updatedLead = { ...lead, notes: [...(lead.notes || []), newNote] };
                    return updatedLead;
                }
                return lead;
            });
            return newLeads;
        });
        setSelectedLeadForNotes(updatedLead);
        showToast('Nota guardada.');
    };

    // --- FUNCIÓN AUXILIAR PARA CONVERTIR ARCHIVOS A BASE64 ---
    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // --- FUNCIÓN saveProperty ACTUALIZADA ---
    const saveProperty = async (formData, imageFiles, brochureFile) => {
        try {
            let finalData = { ...formData };

            if (imageFiles && imageFiles.length > 0) {
                const imagePromises = Array.from(imageFiles).map(file => readFileAsDataURL(file));
                finalData.images = await Promise.all(imagePromises);
            }

            if (brochureFile) {
                finalData.brochure = await readFileAsDataURL(brochureFile);
            }

            if (finalData.id) {
                await updateProperty(finalData.id, finalData);
            } else {
                const newProperty = await addProperty(finalData);
                finalData = newProperty;
            }

            setProperties(prev => {
                if (finalData.id) {
                    return prev.map(p => p.id === finalData.id ? finalData : p);
                }
                return [...prev, finalData];
            });

            showToast(`Propiedad ${finalData.id ? 'actualizada' : 'agregada'} con éxito.`);
            setPropertyFormOpen(false);
            setEditingProperty(null);
        } catch (error) {
            console.error("Error saving property:", error);
            showToast('Error al guardar la propiedad', 'error');
        }
    };

    const deleteProperty = (id) => { setProperties(prev => prev.filter(p => p.id !== id)); showToast('Propiedad eliminada.'); };
    
    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            showToast('Inicio de sesión exitoso.');
        } catch (error) {
            showToast('Credenciales incorrectas.', 'error');
            console.error("Error de inicio de sesión:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            showToast('Sesión cerrada correctamente.');
        } catch (error) {
            showToast('Error al cerrar sesión.', 'error');
        }
    };
    
    const downloadCSV = () => {
        const csv = Papa.unparse(leads);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clientes_potenciales.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const toggleCompare = (propertyId) => {
        setComparisonList(prev => {
            if (prev.includes(propertyId)) return prev.filter(id => id !== propertyId);
            if (prev.length < 3) return [...prev, propertyId];
            showToast('Puedes comparar hasta 3 propiedades.', 'error');
            return prev;
        });
    };

    const clearComparison = () => setComparisonList([]);
    const propertiesToCompare = useMemo(() => properties.filter(p => comparisonList.includes(p.id)), [properties, comparisonList]);

    const renderPage = () => {
        if (authLoading) {
            return <div className="text-center p-10">Cargando...</div>; // Muestra un loader mientras Firebase verifica
        }
        switch (currentPage) {
            case 'portfolio': return <PortfolioPage properties={properties} onToggleCompare={toggleCompare} onOpenModal={setSelectedProperty} comparisonList={comparisonList} />;
            case 'admin': return <AdminPage user={currentUser} onLogin={handleLogin} onLogout={handleLogout} leads={leads} properties={properties} onUpdateLeadStatus={updateLeadStatus} onDeleteLead={deleteLead} onDeleteProperty={deleteProperty} onOpenNotesModal={setSelectedLeadForNotes} onOpenPropertyForm={() => { setEditingProperty(null); setPropertyFormOpen(true); }} onEditProperty={(prop) => { setEditingProperty(prop); setPropertyFormOpen(true); }} onDownloadCSV={downloadCSV} />;
            default: return <HomePage onAddLead={handleAddLead} />;
        }
    };

    return (
        <div className="text-dark">
            <Header currentPage={currentPage} navigate={navigate} />
            <main className="container mx-auto px-4 md:px-6 py-4 md:py-8">
                {renderPage()}
            </main>
            
            <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
            <NotesModal lead={selectedLeadForNotes} onClose={() => setSelectedLeadForNotes(null)} onSaveNote={saveNoteToLead} />
            <PropertyFormModal isOpen={isPropertyFormOpen} onClose={() => { setPropertyFormOpen(false); setEditingProperty(null); }} onSave={saveProperty} propertyToEdit={editingProperty} />
            <CompareModal properties={propertiesToCompare} isOpen={isCompareModalOpen} onClose={() => setCompareModalOpen(false)} />
            
            <CompareBar properties={propertiesToCompare} onClear={clearComparison} onCompare={() => setCompareModalOpen(true)} />
            <Toast message={toast.message} type={toast.type} visible={toast.visible} />
        </div>
    );
}
