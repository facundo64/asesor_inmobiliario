import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
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
        console.log('Intentando añadir lead:', leadData); // Debug
        const docRef = await addDoc(collection(db, "leads"), {
            ...leadData,
            createdAt: new Date()
        });
        console.log('Lead añadido con ID:', docRef.id); // Debug
        return { id: docRef.id, ...leadData };
    } catch (error) {
        console.error("Error detallado al añadir lead:", error); // Debug
        throw error;
    }
};

export const getLeads = async () => {
    try {
        const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting leads: ", error);
        throw error;
    }
};

export const updateLeadStatus = async (leadId, newStatus) => {
    try {
        const leadRef = doc(db, "leads", leadId);
        await updateDoc(leadRef, { status: newStatus });
    } catch (error) {
        console.error("Error updating lead status: ", error);
        throw error;
    }
};

export const deleteLead = async (leadId) => {
    try {
        await deleteDoc(doc(db, "leads", leadId));
    } catch (error) {
        console.error("Error deleting lead: ", error);
        throw error;
    }
};

// Properties
export const addProperty = async (propertyData) => {
    try {
        checkAuth(); // Verificar autenticación
        
        console.log('Intentando añadir propiedad:', propertyData); // Debug
        
        // Asegurarse de que los campos necesarios estén presentes
        const propertyToAdd = {
            ...propertyData,
            createdAt: new Date(),
            createdBy: auth.currentUser.uid, // Agregar referencia al usuario
            type: propertyData.type || 'venta',
            price: Number(propertyData.price) || 0,
            size: Number(propertyData.size) || 0,
            isInvestmentOpportunity: Boolean(propertyData.isInvestmentOpportunity),
            estimatedRental: Number(propertyData.estimatedRental) || 0,
            annualTaxes: Number(propertyData.annualTaxes) || 0,
            maintenanceCosts: Number(propertyData.maintenanceCosts) || 0
        };

        const docRef = await addDoc(collection(db, "properties"), propertyToAdd);
        console.log('Propiedad añadida con ID:', docRef.id); // Debug
        
        return { id: docRef.id, ...propertyToAdd };
    } catch (error) {
        console.error("Error detallado al añadir propiedad:", error); // Debug
        throw error;
    }
};

export const getProperties = async () => {
    try {
        console.log('Intentando obtener propiedades...'); // Debug
        const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const properties = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() // Convertir Timestamp a Date
        }));
        console.log('Propiedades obtenidas:', properties); // Debug
        return properties;
    } catch (error) {
        console.error("Error detallado al obtener propiedades:", error); // Debug
        throw error;
    }
};

export const updateProperty = async (propertyId, propertyData) => {
    try {
        console.log('Intentando actualizar propiedad:', propertyId, propertyData); // Debug
        const propertyRef = doc(db, "properties", propertyId);
        
        // Asegurarse de que los campos numéricos sean números
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
        console.log('Propiedad actualizada exitosamente'); // Debug
        return { id: propertyId, ...updatedData };
    } catch (error) {
        console.error("Error detallado al actualizar propiedad:", error); // Debug
        throw error;
    }
};

export const deleteProperty = async (propertyId) => {
    try {
        await deleteDoc(doc(db, "properties", propertyId));
    } catch (error) {
        console.error("Error deleting property: ", error);
        throw error;
    }
};