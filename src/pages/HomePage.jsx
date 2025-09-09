import React, { useEffect, useRef } from 'react';
import * as THREE from 'three'; // Asegúrate de instalar three.js: npm install three
import { FaChevronDown, FaPhone, FaEnvelope } from 'react-icons/fa'; // Instala react-icons si no lo has hecho

export const HomePage = ({ navigate, onAddLead, onIntroFinish, finalLogoRef }) => {
    const introRan = useRef(false);
    const horizontalScrollRef = useRef(null);
    const threeJsContainerRef = useRef(null);

    // Efecto para la animación de intro
    useEffect(() => {
        if (introRan.current) {
            onIntroFinish();
            return;
        }

        const introOverlay = document.getElementById('intro-overlay');
        const introLogo = document.getElementById('intro-logo');
        const introR = document.getElementById('intro-R');
        const introA = document.getElementById('intro-A');
        const finalLogoTarget = document.getElementById('final-logo-target');
        const mainHeader = document.querySelector('.main-header');
        const mainContent = document.querySelector('.main-content-home');
        const heroContent = document.getElementById('hero-content');
        
        if (!introOverlay || !introLogo || !mainHeader || !mainContent || !finalLogoTarget) {
            console.error("Elementos necesarios para la animación de intro no encontrados");
            onIntroFinish();
            return;
        }

        // Oculta el logo final inicialmente
        finalLogoTarget.style.opacity = '0';

        // Anima las letras del logo
        setTimeout(() => {
            if (introR) introR.style.transform = 'translateX(0)';
            if (introR) introR.style.opacity = '1';
            if (introA) introA.style.transform = 'translateX(0)';
            if (introA) introA.style.opacity = '1';
        }, 100);

        // Mueve el logo al header
        setTimeout(() => {
            const targetRect = finalLogoTarget.getBoundingClientRect();
            
            introLogo.style.top = `${targetRect.top + targetRect.height / 2}px`;
            introLogo.style.left = `${targetRect.left + targetRect.width / 2}px`;
            introLogo.style.fontSize = getComputedStyle(finalLogoTarget).fontSize;

            introOverlay.style.opacity = '0';
            mainHeader.style.opacity = '1';
            mainContent.classList.add('is-visible');
            
            introLogo.addEventListener('transitionend', () => {
                finalLogoTarget.style.transition = 'opacity 0.5s ease-in';
                finalLogoTarget.style.opacity = '1';
                introLogo.style.display = 'none';
                introOverlay.style.display = 'none';
                
                // Animar contenido del hero
                if (heroContent) {
                    const heroTitle = heroContent.querySelector('h1');
                    const heroSubtitle = heroContent.querySelector('p');
                    
                    if (heroTitle) {
                        heroTitle.style.opacity = '1';
                        heroTitle.style.transform = 'translateY(0)';
                    }
                    
                    setTimeout(() => {
                        if (heroSubtitle) {
                            heroSubtitle.style.opacity = '1';
                            heroSubtitle.style.transform = 'translateY(0)';
                        }
                    }, 300);
                }
                
                onIntroFinish();
            }, { once: true });

        }, 1800);

        introRan.current = true;
    }, [onIntroFinish, finalLogoRef]);

    // Efecto mejorado para el scroll horizontal
    useEffect(() => {
        const scrollContainer = document.querySelector('.horizontal-scroll-container');
        const scrollTrack = document.querySelector('.scroll-track');
        
        if (!scrollContainer || !scrollTrack) return;
        
        // El número total de paneles (incluye el panel de título)
        const panelCount = 4;
        
        const handleScroll = () => {
            const { top, height } = scrollContainer.getBoundingClientRect();
            const scrollableHeight = height - window.innerHeight;
            
            if (top <= 0 && top > -scrollableHeight) {
                // Calcula el progreso del scroll (0 al inicio, 1 al final)
                const progress = -top / scrollableHeight;
                // Calcula el desplazamiento horizontal basado en el progreso
                const translateX = -progress * (window.innerWidth * (panelCount - 1));
                scrollTrack.style.transform = `translateX(${translateX}px)`;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Efecto para revelar elementos al hacer scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.2 });
        
        const elementsToAnimate = document.querySelectorAll('.reveal-element');
        elementsToAnimate.forEach(el => observer.observe(el));
        
        return () => elementsToAnimate.forEach(el => observer.unobserve(el));
    }, []);

    // Efecto para inicializar Three.js
    useEffect(() => {
        if (!threeJsContainerRef.current) return;
        
        // Comprueba si Three.js está disponible
        if (typeof THREE === 'undefined') {
            console.error('Three.js no está disponible');
            return;
        }
        
        const container = threeJsContainerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        const buildingGroup = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({
            color: 0xD4AF37,
            metalness: 0.8,
            roughness: 0.3,
            flatShading: true
        });
        
        for (let i = 0; i < 8; i++) {
            const height = Math.random() * 3 + 1;
            const geometry = new THREE.BoxGeometry(Math.random() * 0.5 + 0.3, height, Math.random() * 0.5 + 0.3);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set((Math.random() - 0.5) * 2, height / 2 - 1.5, (Math.random() - 0.5) * 2);
            buildingGroup.add(mesh);
        }
        scene.add(buildingGroup);
        
        let mouseX = 0, mouseY = 0;
        const onMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        }
        document.addEventListener('mousemove', onMouseMove);
        
        const animate = () => {
            requestAnimationFrame(animate);
            buildingGroup.rotation.y += 0.002;
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };
        animate();
        
        const onResize = () => {
             camera.aspect = container.clientWidth / container.clientHeight;
             camera.updateProjectionMatrix();
             renderer.setSize(container.clientWidth, container.clientHeight);
        }
        window.addEventListener('resize', onResize);
        
        // Limpieza
        return () => {
            window.removeEventListener('resize', onResize);
            document.removeEventListener('mousemove', onMouseMove);
            container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <>
            {/* Elementos de Intro */}
            <div id="intro-overlay"></div>
            <div id="intro-logo">
                <span id="intro-R">R</span><span id="intro-A">A.</span>
            </div>
            
            {/* Contenido Principal */}
            <div className="main-content-home">
                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center text-center text-light overflow-hidden -mt-[72px]">
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <video 
                            className="absolute inset-0 min-w-full min-h-full object-cover" 
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                            onError={(e) => {
                                // Si hay error al cargar el video, usar un color de fondo como fallback
                                e.target.style.display = 'none';
                                e.target.parentElement.style.backgroundColor = '#0F2847';
                            }}
                        >
                            <source src="/assets/Ciudad_Transitada_salta.mp4" type="video/mp4" />
                            {/* Versión fallback si el video no carga */}
                        </video>
                        {/* Overlay para oscurecer el video ligeramente */}
                        <div className="absolute inset-0 bg-black opacity-60"></div>
                    </div>
                    <div id="hero-content" className="relative z-20 p-6">
                        <h1 className="font-serif text-6xl md:text-8xl font-bold leading-tight">El Arte de Invertir.</h1>
                        <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">Donde la estrategia de precisión construye legados.</p>
                    </div>
                    <div className="absolute bottom-10 z-20 animate-bounce">
                        <a href="#proceso" className="text-light text-xl">
                            <FaChevronDown />
                        </a>
                    </div>
                </section>

                {/* Sección de Scroll Horizontal - ACTUALIZADA con la estructura correcta */}
                <section id="proceso" className="horizontal-scroll-container">
                    <div className="sticky-container">
                        <div className="scroll-track">
                            {/* Panel 1: Introducción */}
                            <div className="w-screen h-screen flex items-center justify-center text-center">
                                <div className="reveal-element">
                                    <h2 className="text-5xl font-serif font-bold text-light">Un Proceso.<br />Un Viaje a la Excelencia.</h2>
                                    <p className="mt-4 text-gray-400">Desliza para descubrir cómo transformo el mercado en tu oportunidad.</p>
                                </div>
                            </div>
                            
                            {/* Panel 2: Diagnóstico y Estrategia */}
                            <div className="w-screen h-screen flex items-center">
                                <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
                                    <div className="text-center md:text-left">
                                        <p className="text-7xl font-serif font-bold text-primary opacity-50">01</p>
                                        <h3 className="text-4xl font-serif font-bold text-light mt-2">Diagnóstico y Estrategia</h3>
                                        <p className="mt-4 text-gray-400">Aquí comienza todo. No buscamos propiedades, definimos tu futuro financiero. Analizamos tus metas para crear un mapa de inversión a medida.</p>
                                    </div>
                                    <img 
                                        src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                                        alt="Estrategia" 
                                        className="rounded-lg shadow-2xl h-96 w-full object-cover"
                                    />
                                </div>
                            </div>
                            
                            {/* Panel 3: Curaduría de Activos */}
                            <div className="w-screen h-screen flex items-center">
                                <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
                                    <img 
                                        src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                                        alt="Curaduría" 
                                        className="rounded-lg shadow-2xl h-96 w-full object-cover order-last md:order-first"
                                    />
                                    <div className="text-center md:text-left">
                                        <p className="text-7xl font-serif font-bold text-primary opacity-50">02</p>
                                        <h3 className="text-4xl font-serif font-bold text-light mt-2">Curaduría de Activos</h3>
                                        <p className="mt-4 text-gray-400">El mercado es ruido. Yo encuentro la señal. Con acceso a propiedades off-market, te presento solo las joyas que superan mis estrictos criterios.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Panel 4: Cierre y Gestión */}
                            <div className="w-screen h-screen flex items-center">
                                <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
                                    <div className="text-center md:text-left">
                                        <p className="text-7xl font-serif font-bold text-primary opacity-50">03</p>
                                        <h3 className="text-4xl font-serif font-bold text-light mt-2">Cierre y Gestión de Legado</h3>
                                        <p className="mt-4 text-gray-400">La negociación es un arte. Me encargo de cada detalle para asegurar una transacción impecable, sentando las bases de tu futuro patrimonio.</p>
                                    </div>
                                    <img 
                                        src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                                        alt="Cierre de trato" 
                                        className="rounded-lg shadow-2xl h-96 w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 3D */}
                <section id="destacados" className="py-24 bg-secondary">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="reveal-element">
                                <h2 className="text-5xl font-serif font-bold text-light">Arquitectura de Inversión</h2>
                                <p className="mt-6 text-gray-400 leading-relaxed">
                                    Más que propiedades, construimos portafolios. Cada activo es seleccionado por su potencial arquitectónico y financiero, 
                                    creando una colección de inversiones tan sólida como estéticamente impactante. Visualice el futuro de su capital.
                                </p>
                                <button 
                                    onClick={() => navigate('portfolio')}
                                    className="mt-10 inline-block text-white font-bold py-4 px-8 rounded-lg red-dynamic-button"
                                >
                                    Explorar Portafolio Completo <span className="ml-2">→</span>
                                </button>
                            </div>
                            <div 
                                ref={threeJsContainerRef} 
                                id="three-canvas-container" 
                                className="w-full h-[500px] reveal-element"
                                style={{ transitionDelay: '200ms' }}
                            ></div>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN DE CONTACTO FINAL */}
                <section id="contacto" className="py-24 bg-secondary">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Columna Izquierda: Info Personal */}
                            <div className="reveal-element text-center lg:text-left">
                                <h2 className="text-5xl font-serif font-bold text-light">Hablemos de su Próxima Inversión</h2>
                                <p className="mt-6 text-gray-400 leading-relaxed">
                                    Su visión merece un estratega, no solo un agente. Estoy aquí para ofrecerle un nivel de servicio 
                                    y análisis que transformará sus objetivos en realidad. La primera conversación es el paso más importante.
                                </p>
                                <div className="mt-10 border-t border-gray-800 pt-8 space-y-6">
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl">
                                            <FaPhone />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500">Llamada Directa</p>
                                            <a href="tel:+5491112345678" className="text-light font-semibold hover:text-primary transition-colors">+54 9 11 1234 5678</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl">
                                            <FaEnvelope />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500">Correo Electrónico</p>
                                            <a href="mailto:contacto@rodrigoasesor.com" className="text-light font-semibold hover:text-primary transition-colors">contacto@rodrigoasesor.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Formulario */}
                            <div className="reveal-element" style={{ transitionDelay: '200ms' }}>
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl shadow-2xl p-8">
                                    <form className="space-y-6" onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        const leadData = {
                                            name: formData.get('name'),
                                            email: formData.get('email'),
                                            phone: formData.get('phone'),
                                            message: formData.get('message')
                                        };
                                        onAddLead(leadData);
                                        e.target.reset();
                                    }}>
                                        <input 
                                            type="text" 
                                            name="name"
                                            placeholder="Nombre Completo" 
                                            required 
                                            className="w-full p-4 rounded-lg bg-secondary border border-gray-700 text-light focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
                                        />
                                        <input 
                                            type="email" 
                                            name="email"
                                            placeholder="Correo Electrónico" 
                                            required 
                                            className="w-full p-4 rounded-lg bg-secondary border border-gray-700 text-light focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
                                        />
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            placeholder="Número de Teléfono" 
                                            required 
                                            className="w-full p-4 rounded-lg bg-secondary border border-gray-700 text-light focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
                                        />
                                        <textarea 
                                            name="message"
                                            placeholder="¿En qué tipo de inversión está pensando?" 
                                            rows="4" 
                                            className="w-full p-4 rounded-lg bg-secondary border border-gray-700 text-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        ></textarea>
                                        <button 
                                            type="submit" 
                                            className="w-full text-white font-bold py-4 px-8 rounded-lg red-dynamic-button text-lg"
                                        >
                                            Enviar Mensaje
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

