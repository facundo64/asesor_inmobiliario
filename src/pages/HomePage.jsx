import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HomePage = ({ navigate, onAddLead }) => {
    const canvasContainerRef = useRef(null);
    const horizontalScrollRef = useRef(null);
    const introRan = useRef(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newLead = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
        };
        onAddLead(newLead);
        e.target.reset();
    };

    // Efecto para la animación de Intro
    useEffect(() => {
        // ... (código de la intro sin cambios)
        if (introRan.current) {
            document.querySelector('.main-header')?.classList.add('is-visible');
            document.querySelector('.main-content-home')?.classList.add('is-visible');
            const finalLogo = document.getElementById('final-logo-target');
            if (finalLogo) finalLogo.style.opacity = '1';
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
        
        if (!introOverlay || !introLogo || !finalLogoTarget || !mainHeader || !mainContent || !heroContent) return;

        const heroTitle = heroContent.querySelector('h1');
        const heroSubtitle = heroContent.querySelector('p');
        
        finalLogoTarget.style.opacity = '0';

        setTimeout(() => {
            if(introR && introA) {
                introR.style.transform = 'translateX(0)';
                introR.style.opacity = '1';
                introA.style.transform = 'translateX(0)';
                introA.style.opacity = '1';
            }
        }, 100);

        setTimeout(() => {
            const targetRect = finalLogoTarget.getBoundingClientRect();
            
            introLogo.style.top = `${targetRect.top + targetRect.height / 2}px`;
            introLogo.style.left = `${targetRect.left + targetRect.width / 2}px`;
            introLogo.style.fontSize = getComputedStyle(finalLogoTarget).fontSize;

            introOverlay.style.opacity = '0';
            mainHeader.classList.add('is-visible');
            mainContent.classList.add('is-visible');
            
            introLogo.addEventListener('transitionend', () => {
                finalLogoTarget.style.transition = 'opacity 0.5s ease-in';
                finalLogoTarget.style.opacity = '1';
                introLogo.style.display = 'none';
                introOverlay.style.display = 'none';

                if(heroTitle && heroSubtitle) {
                    heroTitle.style.opacity = '1';
                    heroTitle.style.transform = 'translateY(0)';
                    setTimeout(() => {
                        heroSubtitle.style.opacity = '1';
                        heroSubtitle.style.transform = 'translateY(0)';
                    }, 300); 
                }
            }, { once: true });
        }, 1800);
        
        introRan.current = true;
    }, []);

    // Efecto para la animación 3D de las TORRES
    useEffect(() => {
        let renderer, scene, camera, buildingGroup, animationFrameId;
        const mouse = new THREE.Vector2();

        // **LA CORRECCIÓN ESTÁ AQUÍ**
        const container = canvasContainerRef.current;
        if (!container) return; // Si el contenedor no existe, no hacemos nada.

        const initThreeJS = () => {
            if (container.childElementCount > 0) return; // Evita reinicializar
            
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 5;
            
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement); // Ahora 'container' siempre existirá

            // ... (resto del código 3D sin cambios)
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
            
            buildingGroup = new THREE.Group();
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
                mesh.position.set((Math.random() - 0.5) * 4, height / 2 - 1.5, (Math.random() - 0.5) * 4);
                buildingGroup.add(mesh);
            }
            scene.add(buildingGroup);

            animate();
        };
        // ... (resto del código del efecto 3D sin cambios)
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
        document.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!renderer || !buildingGroup) return;

            buildingGroup.rotation.y += 0.002;
            camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
            camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        };
        
        initThreeJS();

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('mousemove', onMouseMove);
            renderer?.dispose();
            if(container) {
                container.innerHTML = "";
            }
        };
    }, []);
    
    // ... (resto de los useEffect para scroll y reveal sin cambios)
    // Efecto para el scroll horizontal
    useEffect(() => {
        const horizontalSection = horizontalScrollRef.current;
        if (!horizontalSection) return;
        const scrollTrack = horizontalSection.querySelector('.scroll-track');
        if(!scrollTrack) return;

        const handleScroll = () => {
            const { top, height } = horizontalSection.getBoundingClientRect();
            const scrollableHeight = height - window.innerHeight;
            if (top <= 0 && top >= -scrollableHeight) {
                const progress = -top / scrollableHeight;
                const translateX = progress * (scrollTrack.scrollWidth - window.innerWidth);
                scrollTrack.style.transform = `translateX(-${translateX}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Efecto para animaciones al hacer scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.2 });

        const elements = document.querySelectorAll('.reveal-element');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);


    return (
        <>
            <div id="intro-overlay"></div>
            <div id="intro-logo">
                <span id="intro-R">R</span><span id="intro-A">A.</span>
            </div>
            <div className="main-content-home">
                 {/* ... (código JSX de la página sin cambios) ... */}
                 <section className="relative h-screen flex items-center justify-center text-center text-light overflow-hidden -mt-[72px]">
                     <div className="absolute inset-0 bg-black/60 z-10"></div>
                     <video autoPlay loop muted playsInline className="absolute z-0 w-full h-full object-cover">
                         <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-and-luxurious-hotel-room-5152-large.mp4" type="video/mp4" />
                     </video>
                     <div id="hero-content" className="relative z-20 p-6">
                         <h1 className="font-serif text-6xl md:text-8xl font-bold leading-tight">El Arte de Invertir.</h1>
                         <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">Donde la estrategia de precisión construye legados.</p>
                     </div>
                     <div className="absolute bottom-10 z-20 animate-bounce">
                        <a href="#proceso" className="text-light text-xl"><i className="fas fa-chevron-down"></i></a>
                    </div>
                </section>

                 {/* Horizontal Scroll Section */}
                <section id="proceso" ref={horizontalScrollRef} className="horizontal-scroll-section">
                    <div className="scroll-container">
                        <div className="scroll-track">
                            <div className="slide">
                                <div className="reveal-element">
                                    <h2 className="text-5xl font-serif font-bold text-light">Un Proceso.<br/>Un Viaje a la Excelencia.</h2>
                                    <p className="mt-4 text-gray-400">Desliza para descubrir cómo transformo el mercado en tu oportunidad.</p>
                                </div>
                            </div>
                            <div className="slide">
                                <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
                                    <div className="text-center md:text-left">
                                        <p className="text-7xl font-serif font-bold text-primary opacity-50">01</p>
                                        <h3 className="text-4xl font-serif font-bold text-light mt-2">Diagnóstico y Estrategia</h3>
                                        <p className="mt-4 text-gray-400">Aquí comienza todo. No buscamos propiedades, definimos tu futuro financiero. Analizamos tus metas para crear un mapa de inversión a medida.</p>
                                    </div>
                                    <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Estrategia" className="rounded-lg shadow-2xl" />
                                </div>
                            </div>
                            <div className="slide">
                                <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
                                    <img src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Curaduría" className="rounded-lg shadow-2xl order-last md:order-first" />
                                    <div className="text-center md:text-left">
                                        <p className="text-7xl font-serif font-bold text-primary opacity-50">02</p>
                                        <h3 className="text-4xl font-serif font-bold text-light mt-2">Curaduría de Activos</h3>
                                        <p className="mt-4 text-gray-400">El mercado es ruido. Yo encuentro la señal. Con acceso a propiedades off-market, te presento solo las joyas que superan mis estrictos criterios.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="slide">
                                <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
                                    <div className="text-center md:text-left">
                                        <p className="text-7xl font-serif font-bold text-primary opacity-50">03</p>
                                        <h3 className="text-4xl font-serif font-bold text-light mt-2">Cierre y Gestión de Legado</h3>
                                        <p className="mt-4 text-gray-400">La negociación es un arte. Me encargo de cada detalle para asegurar una transacción impecable, sentando las bases de tu futuro patrimonio.</p>
                                    </div>
                                    <img src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Cierre de trato" className="rounded-lg shadow-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                 
                {/* 3D Section */}
                 <section id="destacados" className="py-24 bg-secondary">
                   <div className="container mx-auto px-6">
                       <div className="grid md:grid-cols-2 gap-16 items-center">
                           <div className="reveal-element">
                               <h2 className="text-5xl font-serif font-bold text-light">Arquitectura de Inversión</h2>
                               <p className="mt-6 text-gray-400 leading-relaxed">Más que propiedades, construimos portafolios. Cada activo es seleccionado por su potencial arquitectónico y financiero, creando una colección de inversiones tan sólida como estéticamente impactante.</p>
                               <button onClick={() => navigate('portfolio')} className="mt-10 inline-block text-white font-bold py-4 px-8 rounded-lg red-dynamic-button">
                                   Explorar Portafolio Completo <i className="fas fa-arrow-right ml-2"></i>
                               </button>
                           </div>
                           <div id="three-canvas-container" ref={canvasContainerRef} className="w-full h-full min-h-[500px] reveal-element"></div>
                       </div>
                   </div>
                 </section>

                {/* Contact Section */}
                 <section id="contacto" className="py-24 bg-secondary">
                      <div className="container mx-auto px-6">
                         <div className="grid lg:grid-cols-2 gap-16 items-center">
                             <div className="reveal-element text-center lg:text-left">
                                 <h2 className="text-5xl font-serif font-bold text-light">Hablemos de su Próxima Inversión</h2>
                                 <p className="mt-6 text-gray-400 leading-relaxed">Su visión merece un estratega. Estoy aquí para ofrecerle un nivel de servicio que transformará sus objetivos en realidad.</p>
                                 <div className="mt-10 border-t border-gray-800 pt-8 space-y-6">
                                     <div className="flex items-center justify-center lg:justify-start">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl"><i className="fas fa-phone"></i></div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500">Llamada Directa</p>
                                            <a href="tel:+5491112345678" className="text-light font-semibold hover:text-primary transition-colors">+54 9 11 1234 5678</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl"><i className="fas fa-envelope"></i></div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500">Correo Electrónico</p>
                                            <a href="mailto:contacto@rodrigoasesor.com" className="text-light font-semibold hover:text-primary transition-colors">contacto@rodrigoasesor.com</a>
                                        </div>
                                    </div>
                                 </div>
                             </div>
                             <div className="reveal-element">
                                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl shadow-2xl p-8">
                                     <form onSubmit={handleSubmit} className="space-y-6">
                                         <input name="fullName" type="text" placeholder="Nombre Completo" required className="form-input" />
                                         <input name="email" type="email" placeholder="Correo Electrónico" required className="form-input" />
                                         <input name="phone" type="tel" placeholder="Número de Teléfono" required className="form-input" />
                                         <textarea name="message" placeholder="¿En qué tipo de inversión está pensando?" rows="4" className="form-input"></textarea>
                                         <button type="submit" className="w-full text-white font-bold py-4 px-8 rounded-lg red-dynamic-button text-lg">Enviar Mensaje</button>
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

