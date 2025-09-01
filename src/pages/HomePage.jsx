import React from 'react';
// 1. IMPORTA TU VIDEO LOCAL DESDE LA CARPETA 'assets'
import miVideoLocal from '../assets/Ciudad_Transitada_salta.mp4';

export const HomePage = ({ onAddLead }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // CORREGIDO: Eliminamos la creación de 'id' y 'date' aquí.
        // Firestore se encargará de generar el ID y la fecha de creación.
        const newLead = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            status: 'potencial',
            notes: []
        };
        onAddLead(newLead);
        e.target.reset();
    };


    const videoUrl = miVideoLocal;

    
    const scrollToForm = () => {
        document.getElementById('contact-form-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
       
            <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
    <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute z-0 w-full h-full object-cover"
    >
        <source src={videoUrl} type="video/mp4" />
        Tu navegador no soporta el tag de video.
    </video>
    
    <div className="relative z-20 p-4 md:p-8 bg-black bg-opacity-30 rounded-lg backdrop-blur-sm w-full max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-bold leading-tight drop-shadow-lg mb-4">
            Encuentre la propiedad de sus sueños
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-lg">
            Le ayudo a encontrar no solo un hogar, sino una sólida oportunidad financiera.
        </p>
        <button 
            onClick={scrollToForm}
            className="mt-8 btn btn-primary font-bold py-3 px-8 text-lg md:text-xl rounded-md transition-transform transform hover:scale-105"
        >
            Hablemos de su futuro
        </button>
    </div>
</section>


            <section id="contact-form-section" className="py-8 md:py-16 px-4">
    <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-2">
                Contáctese con un experto
            </h2>
            <p className="text-center text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                Complete el formulario y me comunicaré a la brevedad.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
    <input type="text" name="fullName" required placeholder="Nombre Completo" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
    <input type="email" name="email" required placeholder="Correo Electrónico" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
    <input type="tel" name="phone" required placeholder="Número de Teléfono" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
    <textarea name="message" placeholder="Mensaje Adicional (Opcional)" rows="3" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
    <div>
        <button type="submit" className="w-full btn btn-primary font-bold py-3 px-4 rounded-md">Contactar Asesor</button>
    </div>
</form>
        </div>
    </div>
</section>
        </>
    );
};