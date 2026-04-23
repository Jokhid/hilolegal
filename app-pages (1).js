// Lógica de modal + envío a Google Sheets
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('leadModal');
  const leadForm = document.getElementById('leadForm');
  const msg = document.getElementById('formMsg');
  const subareaInput = document.getElementById('modalSubarea');
  const areaInput = document.getElementById('modalArea');

  // Abrir modal
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      subareaInput.value = btn.getAttribute('data-subarea') || '';
      if (btn.getAttribute('data-area')) areaInput.value = btn.getAttribute('data-area');
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  // Cerrar modal
  const closeBtn = document.getElementById('closeModalBtn');
  const close = () => { modal.classList.remove('show'); document.body.style.overflow=''; if (msg) msg.textContent=''; }
  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  // Endpoint del Web App de Apps Script (REEMPLAZAR)
  const FORM_ENDPOINT = 'PASTE_YOUR_WEB_APP_URL_HERE';

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'Enviando...';

    const data = Object.fromEntries(new FormData(leadForm).entries());

    try {
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId: '1aV5DLlJEh1qClwDoc-BgXDxUz10ji1cEEvZVIjpPQRo',
          range: 'A:E',
          payload: {
            fecha: new Date().toISOString(),
            area: data.area || '',
            subarea: data.subarea || '',
            nombre: data.nombre || '',
            telefono: data.telefono || '',
            email: data.email || ''
          }
        })
      });
      msg.textContent = '¡Recibido! Te contactamos en breve.';
      leadForm.reset();
      setTimeout(() => { msg.textContent=''; close(); }, 1600);
    } catch (err) {
      msg.textContent = 'Error al enviar. Intenta de nuevo.';
    }
  });
});
