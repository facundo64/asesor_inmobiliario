import React from 'react';
// 1. IMPORTA TU VIDEO LOCAL DESDE LA CARPETA 'assets'
import miVideoLocal from '../assets/Ciudad_Transitada_salta.mp4';

export const HomePage = ({ onAddLead }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newLead = { id: Date.now(), fullName: formData.get('fullName'), email: formData.get('email'), phone: formData.get('phone'), budget: formData.get('budget'), message: formData.get('message'), date: new Date().toISOString(), status: 'potencial', notes: [] };
        onAddLead(newLead);
        e.target.reset();
    };


    const videoUrl = miVideoLocal;

    
    const scrollToForm = () => {
        document.getElementById('contact-form-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* --- SECCIÓN 1: HERO CON VIDEO DE FONDO --- */}
            <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white rounded-lg shadow-xl overflow-hidden">
                {/* Capa de video */}
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    // Clases CSS actualizadas para un posicionamiento más robusto del video
                    className="absolute z-0 top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Tu navegador no soporta el tag de video.
                </video>
                
                {/* Capa de superposición oscura para contraste */}
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

                {/* Contenido de texto y botón */}
                <div className="relative z-20 p-8">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
                        Encuentre la propiedad de sus sueños
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow">
                        Le ayudo a encontrar no solo un hogar, sino una sólida oportunidad financiera.
                    </p>
                    <button 
                        onClick={scrollToForm}
                        className="mt-8 btn btn-primary font-bold py-3 px-8 text-lg rounded-md transition-transform transform hover:scale-105"
                    >
                        Hablemos de su futuro
                    </button>
                </div>
            </section>

            {/* --- SECCIÓN 2: FORMULARIO DE CONTACTO --- */}
            <section id="contact-form-section" className="py-16">
                <div className="max-w-2xl mx-auto">
                     <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-secondary text-center mb-2">Contáctese con un experto</h2>
                        <p className="text-center text-gray-600 mb-8">Complete el formulario y me comunicaré a la brevedad.</p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input type="text" name="fullName" required placeholder="Nombre Completo" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            <input type="email" name="email" required placeholder="Correo Electrónico" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            <input type="tel" name="phone" required placeholder="Número de Teléfono" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            <input type="number" name="budget" placeholder="Presupuesto Estimado (USD)" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            <textarea name="message" placeholder="Mensaje Adicional (Opcional)" rows="3" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                            <div><button type="submit" className="w-full btn btn-primary font-bold py-3 px-4 rounded-md">Contactar Asesor</button></div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};