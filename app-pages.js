document.addEventListener('DOMContentLoaded', () => {

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_XXXXXXXXXXXX_YYYYYYYYYYYY_ZZZZZZZZZZ/exec'; // <-- ¡IMPORTANTE! Reemplaza esto con tu URL de Google Apps Script

    // --- Lógica del Cursor Personalizado ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            cursorDot.style.left = `${clientX}px`;
            cursorDot.style.top = `${clientY}px`;
            cursorOutline.animate({
                left: `${clientX}px`,
                top: `${clientY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        const interactiveElements = document.querySelectorAll('a, button, .practice-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
        });
    }

    // --- Lógica de la Barra de Navegación ---
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (navbar && window.scrollY > 50) navbar.classList.add('scrolled');
        else if (navbar) navbar.classList.remove('scrolled');
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
            }
        });
    });

    // --- Lógica de la Barra de Progreso ---
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        });
    }

    // --- Lógica del Modal de Leads ---
    const modal = document.getElementById('leadModal');
    const openModalBtns = document.querySelectorAll('[data-open-modal]');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalSubareaInput = document.getElementById('modalSubarea');

    const openModal = (subarea) => {
        if (!modal) return;
        if (modalSubareaInput && subarea) modalSubareaInput.value = subarea;
        modal.classList.remove('hidden');
    };
    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.dataset.subarea);
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    // --- Lógica de Envío del Formulario de Leads (Modal y Página) ---
    const handleFormSubmit = (formElement, isModal) => {
        if (!formElement) return;
        const msgElement = isModal ? document.getElementById('formMsg') : null; // Mensajes solo en modal por ahora

        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitButton = formElement.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Enviando...</span>';
            if(msgElement) msgElement.textContent = '';

            const formData = new FormData(formElement);
            fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    if(msgElement) {
                        msgElement.textContent = '¡Gracias! Nos pondremos en contacto pronto.';
                        msgElement.style.color = 'green';
                    }
                    formElement.reset();
                    setTimeout(() => {
                        if (isModal) closeModal();
                        if (msgElement) msgElement.textContent = '';
                    }, 2000);
                } else {
                    throw new Error(data.error || 'Error desconocido');
                }
            })
            .catch(error => {
                if(msgElement) {
                    msgElement.textContent = 'Error al enviar. Inténtalo de nuevo.';
                    msgElement.style.color = 'red';
                }
                console.error('Error:', error);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
        });
    };

    handleFormSubmit(document.getElementById('leadForm'), true);
    handleFormSubmit(document.getElementById('pageContactForm'), false);
    
    // --- Lógica de Botones Flotantes y "Volver Arriba" ---
    document.getElementById('fabWhatsapp')?.addEventListener('click', () => window.open('https://wa.me/34647506040', '_blank'));
    document.getElementById('fabPhone')?.addEventListener('click', () => window.location.href = 'tel:647506040');
    document.getElementById('fabEmail')?.addEventListener('click', () => window.location.href = 'mailto:info@hilolegal.es');

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
<script>
document.addEventListener('DOMContentLoaded', () => {
  // Abrir modal desde cada botón de servicio
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const subarea = btn.getAttribute('data-subarea') || '';
      const modal = document.getElementById('leadModal');
      document.getElementById('modalSubarea').value = subarea;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  // Cerrar modal
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  function closeModal(){
    document.getElementById('leadModal').classList.add('hidden');
    document.body.style.overflow = '';
    const msg = document.getElementById('formMsg');
    if (msg) msg.textContent = '';
  }

  // Click fuera del contenido cierra (opcional)
  document.getElementById('leadModal').addEventListener('click', (e) => {
    if (e.target.id === 'leadModal') closeModal();
  });

  // Envío al Google Apps Script
  const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyvqWu1RH8_Aft8ApnQ0FCSom21FDEHmeE5uhuX5XRIVpZfDp-HpVsLVcr5zQoCXkeCyA/exec'; // <-- Sustituye por la URL del desplegable web de Apps Script

  const leadForm = document.getElementById('leadForm');
  const formMsg  = document.getElementById('formMsg');

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.textContent = 'Enviando...';
    const data = Object.fromEntries(new FormData(leadForm).entries());
    // data: { subarea, area, nombre, telefono, email }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors', // para evitar CORS (el GAS responde sin CORS por defecto)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId: '1aV5DLlJEh1qClwDoc-BgXDxUz10ji1cEEvZVIjpPQRo', // tu Google Sheet
          range: 'A:E', // columnas A..E (ajústalo si quieres)
          payload: {
            fecha: new Date().toISOString(),
            area: data.area || 'Abogados',
            subarea: data.subarea || '',
            nombre: data.nombre || '',
            telefono: data.telefono || '',
            email: data.email || ''
          }
        })
      });

      // Con no-cors no podemos leer respuesta; damos feedback optimista
      formMsg.textContent = '¡Recibido! Te contactamos en breve.';
      leadForm.reset();
      setTimeout(() => {
        formMsg.textContent = '';
        // Opcional: cerrar modal tras éxito
        // closeModal();
      }, 1800);
    } catch (err) {
      formMsg.textContent = 'Hubo un problema al enviar. Inténtalo de nuevo.';
    }
  });
});
</script>
