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
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [editingProperty, setEditingProperty] = useState(null);
    const [isPropertyFormOpen, setPropertyFormOpen] = useState(false);
    const [selectedLeadForNotes, setSelectedLeadForNotes] = useState(null);
    const [comparisonList, setComparisonList] = useState([]);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            if (user) {
                loadLeads();
            } else {
                setLeads([]);
            }
            setAuthLoading(false);
        });
        
        loadProperties();

        return () => unsubscribe();
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
    };

    const handleAddLead = async (leadData) => {
        try {
            await addLead(leadData);
            showToast('¡Gracias! Su mensaje ha sido enviado.', 'success');
        } catch (error) {
            console.error("Error adding lead:", error);
            showToast('Error al enviar el mensaje', 'error');
        }
    };

    const handleUpdateLeadStatus = async (id, status) => {
        try {
            await updateLeadStatus(id, status);
            setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
            showToast('Estado actualizado');
        } catch (error) {
            showToast('Error al actualizar', 'error');
        }
    };

    const handleDeleteLead = async (id) => {
        try {
            await deleteLead(id);
            setLeads(prev => prev.filter(lead => lead.id !== id));
            showToast('Cliente eliminado.');
        } catch (error) {
            showToast('Error al eliminar', 'error');
        }
    };
    
    const saveNoteToLead = (leadId, noteText) => {
        console.log("Saving note (locally for now):", leadId, noteText);
    };
    const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    const saveProperty = async (formData, imageFiles, brochureFile) => {
        try {
            let finalData = { ...formData };
            if (imageFiles?.length > 0) {
                finalData.images = await Promise.all(Array.from(imageFiles).map(readFileAsDataURL));
            }
            if (brochureFile) {
                finalData.brochure = await readFileAsDataURL(brochureFile);
            }
            if (finalData.id) {
                const updated = await updateProperty(finalData.id, finalData);
                setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
            } else {
                const newProp = await addProperty(finalData);
                setProperties(prev => [newProp, ...prev]);
            }
            showToast(`Propiedad ${finalData.id ? 'actualizada' : 'agregada'}.`);
            setPropertyFormOpen(false);
            setEditingProperty(null);
        } catch (error) {
            showToast('Error al guardar propiedad', 'error');
        }
    };
    const handleDeleteProperty = async (id) => { 
        try {
            await deletePropertyService(id);
            setProperties(prev => prev.filter(p => p.id !== id)); 
            showToast('Propiedad eliminada.');
        } catch(error) {
            showToast('Error al eliminar propiedad', 'error');
        }
    };
    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            showToast('Credenciales incorrectas.', 'error');
        }
    };
    const handleLogout = async () => {
        await signOut(auth);
    };
    const downloadCSV = () => {
        const csv = Papa.unparse(leads);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'clientes_potenciales.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    };
    const toggleCompare = (id) => setComparisonList(p => p.includes(id) ? p.filter(i => i !== id) : (p.length < 3 ? [...p, id] : p));
    const clearComparison = () => setComparisonList([]);
    const propertiesToCompare = properties.filter(p => comparisonList.includes(p.id));


    const renderPage = () => {
        if (authLoading && currentPage !== 'home') {
             return <div className="text-center p-10 text-light">Cargando...</div>;
        }
        switch (currentPage) {
            case 'portfolio': 
                return <PortfolioPage properties={properties} onToggleCompare={toggleCompare} onOpenModal={setSelectedProperty} comparisonList={comparisonList} />;
            case 'admin': 
                return <AdminPage user={currentUser} onLogin={handleLogin} onLogout={handleLogout} leads={leads} properties={properties} onUpdateLeadStatus={handleUpdateLeadStatus} onDeleteLead={handleDeleteLead} onDeleteProperty={handleDeleteProperty} onOpenNotesModal={setSelectedLeadForNotes} onOpenPropertyForm={() => { setEditingProperty(null); setPropertyFormOpen(true); }} onEditProperty={(prop) => { setEditingProperty(prop); setPropertyFormOpen(true); }} onDownloadCSV={downloadCSV} />;
            default: 
                return <HomePage navigate={navigate} onAddLead={handleAddLead} />;
        }
    };

    return (
        <>
            <Header navigate={navigate} currentPage={currentPage} />
            <main>{renderPage()}</main>

            <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
            <NotesModal lead={selectedLeadForNotes} onClose={() => setSelectedLeadForNotes(null)} onSaveNote={saveNoteToLead} />
            <PropertyFormModal isOpen={isPropertyFormOpen} onClose={() => { setPropertyFormOpen(false); setEditingProperty(null); }} onSave={saveProperty} propertyToEdit={editingProperty} />
            <CompareModal properties={propertiesToCompare} isOpen={isCompareModalOpen} onClose={() => setCompareModalOpen(false)} />
            
            {currentPage === 'portfolio' && <CompareBar properties={propertiesToCompare} onClear={clearComparison} onCompare={() => setCompareModalOpen(true)} />}
            {toast.visible && <Toast message={toast.message} type={toast.type} />}
        </>
    );
}
