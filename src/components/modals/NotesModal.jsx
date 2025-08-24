import React, { useState } from 'react';

export const NotesModal = ({ lead, onClose, onSaveNote }) => {
    const [newNote, setNewNote] = useState('');
    if (!lead) return null;

    const handleSave = () => {
        if (newNote.trim()) {
            onSaveNote(lead.id, newNote);
            setNewNote('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
                <div className="p-6 border-b"><h2 className="text-2xl font-bold">Notas para {lead.fullName}</h2></div>
                <div className="p-6 max-h-64 overflow-y-auto bg-gray-50 space-y-3">
                    {lead.notes && lead.notes.length > 0 ? (
                        lead.notes.map((note, index) => (
                             <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                                <p className="text-sm text-gray-800">{note.text}</p>
                                <p className="text-xs text-gray-400 text-right mt-2">{new Date(note.date).toLocaleString()}</p>
                            </div>
                        ))
                    ) : ( <p className="text-sm text-gray-500">No hay notas para este cliente.</p> )}
                </div>
                <div className="p-6">
                    <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} className="w-full p-3 border rounded" rows="3" placeholder="Escribir nueva nota..."></textarea>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button onClick={onClose} className="btn btn-secondary px-4 py-2 rounded">Cerrar</button>
                        <button onClick={handleSave} className="btn btn-primary px-4 py-2 rounded">Guardar Nota</button>
                    </div>
                </div>
            </div>
        </div>
    );
};