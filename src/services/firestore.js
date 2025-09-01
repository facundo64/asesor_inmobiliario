import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query
} from 'firebase/firestore';
import { db, auth } from '../firebase';

// Función auxiliar para verificar autenticación
const checkAuth = () => {
    if (!auth.currentUser) {
        throw new Error('No autorizado: Debe iniciar sesión');
    }
};

// Leads
export const addLead = async (leadData) => {
    try {
        const docRef = await addDoc(collection(db, "leads"), {
            ...leadData,
            createdAt: new Date()
        });
        return { id: docRef.id, ...leadData, createdAt: new Date() };
    } catch (error) {
        console.error("Error detallado al añadir lead:", error);
        throw error;
    }
};

export const getLeads = async () => {
    try {
        checkAuth(); // Asegurarse que solo usuarios logueados pueden llamar esta función
        const q = query(collection(db, "leads"));
        const querySnapshot = await getDocs(q);
        const leads = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Ordenamos los leads en el cliente (más reciente primero)
        return leads.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
    } catch (error) {
        console.error("Error getting leads: ", error);
        throw error;
    }
};

export const updateLeadStatus = async (leadId, newStatus) => {
    try {
        checkAuth();
        const leadRef = doc(db, "leads", leadId);
        await updateDoc(leadRef, { status: newStatus });
    } catch (error) {
        console.error("Error updating lead status: ", error);
        throw error;
    }
};

export const deleteLead = async (leadId) => {
    try {
        checkAuth();
        await deleteDoc(doc(db, "leads", leadId));
    } catch (error) {
        console.error("Error deleting lead: ", error);
        throw error;
    }
};

// Properties
export const addProperty = async (propertyData) => {
    try {
        checkAuth();
        
        const propertyToAdd = {
            ...propertyData,
            createdAt: new Date(),
            createdBy: auth.currentUser.uid,
            type: propertyData.type || 'venta',
            price: Number(propertyData.price) || 0,
            size: Number(propertyData.size) || 0,
            isInvestmentOpportunity: Boolean(propertyData.isInvestmentOpportunity),
            estimatedRental: Number(propertyData.estimatedRental) || 0,
            annualTaxes: Number(propertyData.annualTaxes) || 0,
            maintenanceCosts: Number(propertyData.maintenanceCosts) || 0
        };

        const docRef = await addDoc(collection(db, "properties"), propertyToAdd);
        return { id: docRef.id, ...propertyToAdd };
    } catch (error) {
        console.error("Error detallado al añadir propiedad:", error);
        throw error;
    }
};

export const getProperties = async () => {
    try {
        const q = query(collection(db, "properties"));
        const querySnapshot = await getDocs(q);
        const properties = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() // Convertir Timestamp a Date si existe
        }));
        // Ordenamos las propiedades en el cliente (más reciente primero)
        return properties.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (error) {
        console.error("Error detallado al obtener propiedades:", error);
        throw error;
    }
};

export const updateProperty = async (propertyId, propertyData) => {
    try {
        checkAuth();
        const propertyRef = doc(db, "properties", propertyId);
        
        const updatedData = {
            ...propertyData,
            price: Number(propertyData.price) || 0,
            size: Number(propertyData.size) || 0,
            estimatedRental: Number(propertyData.estimatedRental) || 0,
            annualTaxes: Number(propertyData.annualTaxes) || 0,
            maintenanceCosts: Number(propertyData.maintenanceCosts) || 0,
            updatedAt: new Date()
        };

        await updateDoc(propertyRef, updatedData);
        return { id: propertyId, ...updatedData };
    } catch (error) {
        console.error("Error detallado al actualizar propiedad:", error);
        throw error;
    }
};

export const deleteProperty = async (propertyId) => {
    try {
        checkAuth();
        await deleteDoc(doc(db, "properties", propertyId));
    } catch (error) {
        console.error("Error deleting property: ", error);
        throw error;
    }
};
