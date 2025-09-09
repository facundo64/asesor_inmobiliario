import React, { useState, useEffect } from 'react';

export const NotesModal = ({ lead, onClose, onSaveNote }) => {  // Cambiado de onSave a onSaveNote
    const [newNote, setNewNote] = useState('');
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // Cargar notas existentes cuando cambia el lead
        if (lead && lead.notes) {
            setNotes(lead.notes);
        } else {
            setNotes([]);
        }
    }, [lead]);

    const handleSaveNote = () => {
        if (!newNote.trim()) return;
        
        // Crear nueva nota con timestamp
        const noteToAdd = {
            text: newNote.trim(),
            timestamp: new Date().toISOString(),
        };
        
        // Crear un nuevo array con todas las notas
        const updatedNotes = [...notes, noteToAdd];
        
        // Guardar usando la función proporcionada como prop
        if (onSaveNote && lead) {  // Cambiado de onSave a onSaveNote
            onSaveNote(lead.id, updatedNotes);
            setNewNote(''); // Limpiar el campo después de guardar
        }
    };

    if (!lead) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-serif text-light font-bold">
                        Notas para {lead.name}
                    </h2>
                </div>

                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    {notes && notes.length > 0 ? (
                        <div className="space-y-4">
                            {notes.map((note, index) => (
                                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                                    <p className="text-gray-300">{note.text}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(note.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay notas para este cliente.</p>
                    )}
                </div>

                <div className="p-6 border-t border-gray-800">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Escribir nueva nota..."
                        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-light focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows="4"
                    />
                    <div className="flex justify-end mt-4 space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-700 text-gray-400 hover:text-gray-300 rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleSaveNote}
                            className="px-6 py-2 bg-primary/90 hover:bg-primary text-white rounded-lg transition-colors"
                            disabled={!newNote.trim()}
                        >
                            Guardar Nota
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};