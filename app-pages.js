document.addEventListener('DOMContentLoaded', () => {
 
    // ─── ENDPOINT GOOGLE APPS SCRIPT ────────────────────────────────────────────
    // URL real del Web App desplegado en Google Apps Script.
    // Si necesitas cambiarla, solo toca esta línea.
    const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyvqWu1RH8_Aft8ApnQ0FCSom21FDEHmeE5uhuX5XRIVpZfDp-HpVsLVcr5zQoCXkeCyA/exec';
 
    // ID de la hoja de cálculo destino
    const SHEET_ID = '1aV5DLlJEh1qClwDoc-BgXDxUz10ji1cEEvZVIjpPQRo';
 
 
    // ─── CURSOR PERSONALIZADO ────────────────────────────────────────────────────
    const cursorDot     = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
 
    if (cursorDot && cursorOutline && !('ontouchstart' in window)) {
        window.addEventListener('mousemove', ({ clientX, clientY }) => {
            cursorDot.style.left = `${clientX}px`;
            cursorDot.style.top  = `${clientY}px`;
            cursorOutline.animate(
                { left: `${clientX}px`, top: `${clientY}px` },
                { duration: 500, fill: 'forwards' }
            );
        });
        document.querySelectorAll('a, button, .practice-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
        });
    }
 
 
    // ─── BARRA DE NAVEGACIÓN ─────────────────────────────────────────────────────
    const navbar    = document.getElementById('navbar');
    const navMenu   = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.querySelectorAll('.nav-link');
 
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
 
    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
 
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
        });
    });
 
 
    // ─── BARRA DE PROGRESO DE SCROLL ─────────────────────────────────────────────
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop    = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress.style.width = `${(scrollTop / scrollHeight) * 100}%`;
        });
    }
 
 
    // ─── MODAL DE LEADS ───────────────────────────────────────────────────────────
    const modal             = document.getElementById('leadModal');
    const modalSubareaInput = document.getElementById('modalSubarea');
 
    const openModal = (subarea) => {
        if (!modal) return;
        if (modalSubareaInput) modalSubareaInput.value = subarea || '';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
 
    const closeModal = () => {
        modal?.classList.add('hidden');
        document.body.style.overflow = '';
        const msg = document.getElementById('formMsg');
        if (msg) msg.textContent = '';
    };
 
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.subarea || ''));
    });
 
    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
 
 
    // ─── ENVÍO DE FORMULARIOS ─────────────────────────────────────────────────────
    const gestionarFormulario = (formEl, areaDefault, cerrarModalAlEnviar) => {
        if (!formEl) return;
 
        const msgEl         = formEl.querySelector('.form-message') || document.getElementById('formMsg');
        const submitBtn     = formEl.querySelector('button[type="submit"]');
        const textoOriginal = submitBtn ? submitBtn.innerHTML : '';
 
        const mostrarMsg = (texto, color) => {
            if (!msgEl) return;
            msgEl.textContent = texto;
            msgEl.style.color = color || 'green';
        };
 
        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
 
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Enviando...</span>';
            }
            mostrarMsg('Enviando...', '#888');
 
            const datos = Object.fromEntries(new FormData(formEl).entries());
 
            const payload = {
                fecha:    new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
                area:     datos.area     || areaDefault || '',
                subarea:  datos.subarea  || '',
                nombre:   datos.nombre   || '',
                telefono: datos.telefono || '',
                email:    datos.email    || '',
                mensaje:  datos.mensaje  || ''
            };
 
            try {
                await fetch(FORM_ENDPOINT, {
                    method:  'POST',
                    mode:    'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ sheetId: SHEET_ID, payload })
                });
 
                mostrarMsg('¡Recibido! Te contactamos en breve.', 'green');
                formEl.reset();
 
                setTimeout(() => {
                    mostrarMsg('');
                    if (cerrarModalAlEnviar) closeModal();
                }, 2500);
 
            } catch (err) {
                mostrarMsg('Hubo un problema. Llámanos al 647 50 60 40.', 'red');
                console.error('Error al enviar formulario:', err);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = textoOriginal;
                }
            }
        });
    };
 
    // Modal de lead (se cierra tras enviar)
    gestionarFormulario(document.getElementById('leadForm'), '', true);
 
    // Formulario de contacto de página (no cierra modal)
    gestionarFormulario(document.getElementById('pageContactForm'), 'Consulta General', false);
 
 
    // ─── BOTONES FLOTANTES (FAB) ──────────────────────────────────────────────────
    document.getElementById('fabWhatsapp')?.addEventListener('click', () =>
        window.open('https://wa.me/34647506040?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20vuestros%20servicios.', '_blank')
    );
    document.getElementById('fabPhone')?.addEventListener('click', () =>
        window.location.href = 'tel:647506040'
    );
    document.getElementById('fabEmail')?.addEventListener('click', () =>
        window.location.href = 'mailto:info@hilolegal.es'
    );
 
 
    // ─── BOTÓN VOLVER ARRIBA ──────────────────────────────────────────────────────
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        backToTopBtn.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
        );
    }
 
});
