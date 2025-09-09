import React, { useState, useEffect, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { Header } from './components/Header';
import { Toast } from './components/Toast.jsx';
import { CompareBar } from './components/CompareBar.jsx';
import { PropertyModal } from './components/modals/PropertyModal.jsx';
import { NotesModal } from './components/modals/NotesModal.jsx';
import { PropertyFormModal } from './components/modals/PropertyFormModal.jsx';
import { CompareModal } from './components/modals/CompareModal.jsx';
import './index.css';

export default function App() {
    const [leads, setLeads] = useState([]);
    const [properties, setProperties] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState('home');
    const [isIntroAnimating, setIsIntroAnimating] = useState(true);
    const [introHasRun, setIntroHasRun] = useState(false);
    const finalLogoRef = useRef(null);
    
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [editingProperty, setEditingProperty] = useState(null);
    const [isPropertyFormOpen, setPropertyFormOpen] = useState(false);
    const [selectedLeadForNotes, setSelectedLeadForNotes] = useState(null);
    const [compareList, setCompareList] = useState([]);
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
            const leadsSnapshot = await getDocs(collection(db, 'leads'));
            const leadsData = leadsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeads(leadsData);
        } catch (error) {
            console.error("Error loading leads:", error);
            showToast('Error al cargar clientes', 'error');
        }
    };

    const loadProperties = async () => {
        try {
            const propertiesSnapshot = await getDocs(collection(db, 'properties'));
            const propertiesData = propertiesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProperties(propertiesData);
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
        window.scrollTo(0, 0);
    };

    const handleIntroFinish = useCallback(() => {
        setIsIntroAnimating(false);
        setIntroHasRun(true);
    }, []);

    useEffect(() => {
        setIsIntroAnimating(currentPage === 'home' && !introHasRun);
    }, [currentPage, introHasRun]);

    const handleAddLead = async (leadData) => {
        try {
            const leadWithTimestamp = {
                ...leadData,
                timestamp: serverTimestamp(),
                status: 'pending',
                notes: []
            };
            
            const docRef = await addDoc(collection(db, 'leads'), leadWithTimestamp);
            const newLead = { id: docRef.id, ...leadWithTimestamp, timestamp: new Date().toISOString() };
            
            setLeads([...leads, newLead]);
            showToast("Contacto registrado correctamente", "success");
        } catch (error) {
            console.error("Error adding lead:", error);
            showToast("Error al registrar contacto", "error");
        }
    };

    const handleUpdateLeadStatus = async (id, status) => {
        try {
            const leadRef = doc(db, 'leads', id);
            await updateDoc(leadRef, { status });
            
            const updatedLeads = leads.map(lead => 
                lead.id === id ? { ...lead, status } : lead
            );
            setLeads(updatedLeads);
            
            showToast("Estado actualizado", "success");
        } catch (error) {
            console.error("Error updating lead status:", error);
            showToast("Error al actualizar estado", "error");
        }
    };
    
    const handleDeleteLead = async (id) => {
        try {
            await deleteDoc(doc(db, 'leads', id));
            setLeads(leads.filter(lead => lead.id !== id));
            showToast("Contacto eliminado", "success");
        } catch (error) {
            console.error("Error deleting lead:", error);
            showToast("Error al eliminar contacto", "error");
        }
    };
    
    const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    const saveProperty = async (formData, imageFiles, brochureFile) => {
        try {
            console.log("Iniciando guardado de propiedad:", formData);
            
            let finalData = { ...formData };
            
            // Procesar imágenes si existen
            if (imageFiles?.length > 0) {
                console.log("Procesando", imageFiles.length, "imágenes");
                finalData.images = await Promise.all(Array.from(imageFiles).map(readFileAsDataURL));
                console.log("Imágenes procesadas correctamente");
            } else if (formData.images) {
                // Mantener imágenes existentes si no se cargan nuevas
                finalData.images = formData.images;
                console.log("Manteniendo imágenes existentes");
            }
            
            // Procesar folleto si existe
            if (brochureFile) {
                console.log("Procesando folleto");
                finalData.brochure = await readFileAsDataURL(brochureFile);
                console.log("Folleto procesado correctamente");
            } else if (formData.brochure) {
                // Mantener folleto existente si no se carga nuevo
                finalData.brochure = formData.brochure;
                console.log("Manteniendo folleto existente");
            }
            
            // Si tiene ID, actualizar propiedad existente
            if (finalData.id) {
                console.log("Actualizando propiedad existente con ID:", finalData.id);
                const propertyRef = doc(db, 'properties', finalData.id);
                await updateDoc(propertyRef, finalData);
                
                const updatedProperties = properties.map(property => 
                    property.id === finalData.id ? { ...property, ...finalData } : property
                );
                setProperties(updatedProperties);
                showToast("Propiedad actualizada correctamente", "success");
            } else {
                // Crear nueva propiedad
                console.log("Creando nueva propiedad");
                const docRef = await addDoc(collection(db, 'properties'), finalData);
                const newProperty = { id: docRef.id, ...finalData };
                setProperties([...properties, newProperty]);
                showToast("Propiedad añadida correctamente", "success");
            }
            
            // Cerrar modal y limpiar estado
            setPropertyFormOpen(false);
            setEditingProperty(null);
            
            console.log("Propiedad guardada con éxito");
        } catch (error) {
            console.error("Error guardando propiedad:", error);
            showToast("Error al guardar la propiedad: " + error.message, "error");
        }
    };
    const handleDeleteProperty = async (id) => { 
        try {
            await deleteDoc(doc(db, 'properties', id));
            setProperties(properties.filter(property => property.id !== id));
            showToast("Propiedad eliminada", "success");
        } catch (error) {
            console.error("Error deleting property:", error);
            showToast("Error al eliminar propiedad", "error");
        }
    };
    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            showToast("Inicio de sesión exitoso", "success");
            return true;
        } catch (error) {
            console.error("Login error:", error);
            showToast("Error en el inicio de sesión", "error");
            throw error;
        }
    };
    const handleLogout = async () => {
        try {
            await signOut(auth);
            showToast("Sesión cerrada", "success");
        } catch (error) {
            console.error("Logout error:", error);
            showToast("Error al cerrar sesión", "error");
        }
    };
    const downloadCSV = () => {
        if (leads.length === 0) {
            showToast("No hay datos para exportar", "warning");
            return;
        }
        
        // Crear contenido CSV
        const headers = ["Nombre", "Email", "Teléfono", "Mensaje", "Estado", "Fecha"];
        const csvContent = [
            headers.join(","),
            ...leads.map(lead => {
                const date = lead.timestamp ? new Date(lead.timestamp).toLocaleDateString() : "";
                return [
                    `"${lead.name || ''}"`, 
                    `"${lead.email || ''}"`, 
                    `"${lead.phone || ''}"`, 
                    `"${lead.message || ''}"`, 
                    `"${lead.status || ''}"`, 
                    `"${date}"`
                ].join(",");
            })
        ].join("\n");
        
        // Crear y descargar archivo
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `leads_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const toggleCompare = (property) => {
        const exists = compareList.some(p => p.id === property.id);
        if (exists) {
            setCompareList(compareList.filter(p => p.id !== property.id));
        } else {
            setCompareList(compareList.length < 3 ? [...compareList, property] : compareList);
        }
    };
    const clearComparison = () => setCompareList([]);
    const propertiesToCompare = properties.filter(p => compareList.some(c => c.id === p.id));


    const saveNoteToLead = async (leadId, notes) => {
        try {
            // Actualizar en Firestore
            const leadRef = doc(db, 'leads', leadId);
            await updateDoc(leadRef, { notes });
            
            // Actualizar en el estado local
            setLeads(leads.map(lead => 
                lead.id === leadId ? { ...lead, notes } : lead
            ));
            
            // Mostrar notificación de éxito
            setToast({
                message: "Nota guardada correctamente",
                type: "success",
                visible: true
            });
            
            setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 3000);
        } catch (error) {
            console.error("Error al guardar nota:", error);
            setToast({
                message: "Error al guardar la nota",
                type: "error",
                visible: true
            });
            
            setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 3000);
        }
    };


    useEffect(() => {
        const handleClearComparison = () => {
            clearComparison();
        };
        
        window.addEventListener('clearComparison', handleClearComparison);
        
        return () => {
            window.removeEventListener('clearComparison', handleClearComparison);
        };
    }, []);  


    return (
        <div className="App bg-secondary min-h-screen text-light">
            <Header 
                currentPage={currentPage} 
                navigate={navigate}
                isIntroAnimating={isIntroAnimating}
                finalLogoRef={finalLogoRef}
                user={currentUser}
            />
            
            <main>
                {currentPage === 'home' ? (
                    <HomePage 
                        navigate={navigate} 
                        onAddLead={handleAddLead} 
                        onIntroFinish={handleIntroFinish}
                        finalLogoRef={finalLogoRef}
                    />
                ) : currentPage === 'portfolio' ? (
                    <PortfolioPage 
    properties={properties} 
    onOpenProperty={setSelectedProperty}
    onToggleCompare={toggleCompare}
    compareList={compareList}
    onOpenCompare={() => setCompareModalOpen(true)}
                    />
                ) : (
                    <AdminPage 
                        user={currentUser}
                        onLogin={handleLogin}
                        onLogout={handleLogout}
                        leads={leads}
                        properties={properties}
                        onUpdateLeadStatus={handleUpdateLeadStatus}
                        onDeleteLead={handleDeleteLead}
                        onDeleteProperty={handleDeleteProperty}
                        onOpenPropertyForm={() => {}} 
    onEditProperty={() => {}} 
                        onOpenNotesModal={setSelectedLeadForNotes} 
                        onDownloadCSV={downloadCSV} 
                        navigate={navigate}
                        onSaveProperty={saveProperty} 
                        onSaveNotes={saveNoteToLead}
                    />
                )}
            </main>
            <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
            <NotesModal lead={selectedLeadForNotes} onClose={() => setSelectedLeadForNotes(null)} onSaveNote={saveNoteToLead} />
            {/* <PropertyFormModal isOpen={isPropertyFormOpen} onClose={() => { setPropertyFormOpen(false); setEditingProperty(null); }} onSave={saveProperty} propertyToEdit={editingProperty} /> */}
            <CompareModal 
    isOpen={isCompareModalOpen} 
    onClose={() => setCompareModalOpen(false)} 
    properties={compareList || []} 
/>
            
            {toast.visible && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
}
