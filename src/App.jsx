import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './firebase';
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
    deleteProperty as deletePropertyService
} from './services/firestore';

export default function App() {
    const [leads, setLeads] = useState([]);
    const [properties, setProperties] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    
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
            if (user) {
                // Si el usuario inicia sesión, cargamos los leads.
                loadLeads();
            } else {
                // Si el usuario cierra sesión, limpiamos los leads para seguridad.
                setLeads([]);
            }
            setAuthLoading(false);
        });
        
        // Cargamos las propiedades, que son públicas, al iniciar la app.
        loadProperties();

        return () => {
            if (document.head.contains(fontAwesomeLink)) {
                document.head.removeChild(fontAwesomeLink);
            }
            unsubscribe();
        };
    }, []);
    
    const loadLeads = async () => {
        try {
            const loadedLeads = await getLeads();
            setLeads(loadedLeads);
        } catch (error) {
            console.error("Error loading leads:", error);
            showToast('Error al cargar clientes', 'error');
        }
    };

    const loadProperties = async () => {
        try {
            const loadedProperties = await getProperties();
            setProperties(loadedProperties);
        } catch (error) {
            console.error("Error loading properties:", error);
            showToast('Error al cargar propiedades', 'error');
        }
    };

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
            // Ya no actualizamos el estado local aquí, porque solo el admin puede ver los leads.
            showToast('¡Gracias por tu interés! Nos pondremos en contacto pronto.');
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
            console.error("Error updating lead status:", error);
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
        // Esta función debería también actualizarse en Firestore, por ahora solo actualiza el estado local.
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
        showToast('Nota guardada (localmente).');
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

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
                setProperties(prev => prev.map(p => p.id === finalData.id ? finalData : p));
            } else {
                const newProperty = await addProperty(finalData);
                setProperties(prev => [newProperty, ...prev]);
            }
            
            showToast(`Propiedad ${finalData.id ? 'actualizada' : 'agregada'} con éxito.`);
            setPropertyFormOpen(false);
            setEditingProperty(null);
        } catch (error) {
            console.error("Error saving property:", error);
            showToast('Error al guardar la propiedad', 'error');
        }
    };

    const handleDeleteProperty = async (id) => { 
        try {
            await deletePropertyService(id);
            setProperties(prev => prev.filter(p => p.id !== id)); 
            showToast('Propiedad eliminada.');
        } catch(error) {
            console.error("Error deleting property:", error);
            showToast('Error al eliminar la propiedad', 'error');
        }
    };
    
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
    const propertiesToCompare = properties.filter(p => comparisonList.includes(p.id));

    const renderPage = () => {
        if (authLoading) {
            return <div className="text-center p-10">Cargando...</div>;
        }
        switch (currentPage) {
            case 'portfolio': return <PortfolioPage properties={properties} onToggleCompare={toggleCompare} onOpenModal={setSelectedProperty} comparisonList={comparisonList} />;
            case 'admin': return <AdminPage user={currentUser} onLogin={handleLogin} onLogout={handleLogout} leads={leads} properties={properties} onUpdateLeadStatus={handleUpdateLeadStatus} onDeleteLead={handleDeleteLead} onDeleteProperty={handleDeleteProperty} onOpenNotesModal={setSelectedLeadForNotes} onOpenPropertyForm={() => { setEditingProperty(null); setPropertyFormOpen(true); }} onEditProperty={(prop) => { setEditingProperty(prop); setPropertyFormOpen(true); }} onDownloadCSV={downloadCSV} />;
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
            {toast.visible && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
}
