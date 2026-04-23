document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------- //
    //                                  CURSOR PERSONALIZADO                      //
    // -------------------------------------------------------------------------- //
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        cursorDot.style.left = `${clientX}px`;
        cursorDot.style.top = `${clientY}px`;
        cursorOutline.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 500, fill: 'forwards' });
    });

    const interactiveElements = document.querySelectorAll('a, button, .service-card, .team-member, .faq-question');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });


    // -------------------------------------------------------------------------- //
    //                                  BARRA DE NAVEGACIÓN                       //
    // -------------------------------------------------------------------------- //
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Efecto de scroll en la barra de navegación
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Menú hamburguesa para móviles
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Activar/desactivar enlace activo en el menú
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Cerrar menú móvil al hacer clic en un enlace
     navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });


    // -------------------------------------------------------------------------- //
    //                                BARRA DE PROGRESO DE SCROLL                 //
    // -------------------------------------------------------------------------- //
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });


    // -------------------------------------------------------------------------- //
    //                                  ANIMACIONES AL HACER SCROLL               //
    // -------------------------------------------------------------------------- //
    const animatedElements = document.querySelectorAll('.section-header, .service-card, .team-member, .about-text, .faq-container, .contact-info, .contact-form');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Opcional: dejar de observar una vez animado
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // El elemento se considera visible cuando el 10% está en pantalla
    });

    animatedElements.forEach(el => {
        // Asignar el tipo de animación basado en los elementos
        if (el.classList.contains('service-card') || el.classList.contains('about-text') || el.classList.contains('faq-container')) {
            el.dataset.animation = 'slide-up';
        } else if(el.classList.contains('team-member') && el.querySelector('.team-photo-jc')) {
             el.dataset.animation = 'slide-right';
        } else if(el.classList.contains('team-member') && el.querySelector('.team-photo-vero')) {
             el.dataset.animation = 'slide-left';
        } else if (el.classList.contains('contact-info')) {
            el.dataset.animation = 'slide-right';
        } else if (el.classList.contains('contact-form')) {
            el.dataset.animation = 'slide-left';
        }
        
        observer.observe(el);
    });

    // -------------------------------------------------------------------------- //
    //                                  SCROLL INFINITO DE TESTIMONIOS            //
    // -------------------------------------------------------------------------- //
    const scroller = document.querySelector('.testimonials-scroller');
    if (scroller) {
        const grid = scroller.querySelector('.testimonials-grid');
        const items = Array.from(grid.children);
        items.forEach(item => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute('aria-hidden', true);
            grid.appendChild(duplicatedItem);
        });
    }

    // -------------------------------------------------------------------------- //
    //                                MODAL DE CONTACTO                           //
    // -------------------------------------------------------------------------- //
    const modal = document.getElementById('contactModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    // MODIFICADO: Ya no se necesitan los .contact-btn para el modal
    const openModal = () => modal.classList.remove('hidden');
    const closeModal = () => modal.classList.add('hidden');
    
    if(openModalBtn) openModalBtn.addEventListener('click', openModal);
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // -------------------------------------------------------------------------- //
    //                                BOTONES DE CONTACTO DIRECTO                  //
    // -------------------------------------------------------------------------- //
    document.getElementById('contactEmailBtn')?.addEventListener('click', () => window.location.href = 'mailto:info@hilolegal.es');
    document.getElementById('contactWhatsappBtn')?.addEventListener('click', () => window.open('https://wa.me/34647506040', '_blank'));
    document.getElementById('fabWhatsapp')?.addEventListener('click', () => window.open('https://wa.me/34647506040', '_blank'));
    document.getElementById('fabPhone')?.addEventListener('click', () => window.location.href = 'tel:647506040');
    document.getElementById('fabEmail')?.addEventListener('click', () => window.location.href = 'mailto:info@hilolegal.es');

    // -------------------------------------------------------------------------- //
    //                                BOTÓN DE VOLVER ARRIBA                      //
    // -------------------------------------------------------------------------- //
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

