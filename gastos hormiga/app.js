// Datos de la aplicación
const appData = {
  categorias_gastos: [
    {
      "id": "cafe",
      "nombre": "Café y bebidas calientes",
      "icono": "☕",
      "precio_promedio": 1.50,
      "descripcion": "Café diario en el trabajo o camino a casa"
    },
    {
      "id": "snacks", 
      "nombre": "Snacks y comida rápida",
      "icono": "🍿",
      "precio_promedio": 1.25,
      "descripcion": "Patatas, chocolates, bollería y aperitivos"
    },
    {
      "id": "cervezas",
      "nombre": "Cervezas y bebidas alcohólicas", 
      "icono": "🍺",
      "precio_promedio": 2.50,
      "descripcion": "Cerveza en bares, vinos y cócteles"
    },
    {
      "id": "refrescos",
      "nombre": "Refrescos y bebidas frías",
      "icono": "🥤", 
      "precio_promedio": 1.50,
      "descripcion": "Coca-Cola, zumos, agua embotellada"
    },
    {
      "id": "restaurantes",
      "nombre": "Comida en restaurantes",
      "icono": "🍽️",
      "precio_promedio": 12.00,
      "descripcion": "Almuerzos y cenas fuera de casa no planificadas"
    },
    {
      "id": "compras_impulsivas",
      "nombre": "Compras impulsivas",
      "icono": "🛍️", 
      "precio_promedio": 5.00,
      "descripcion": "Artículos no planificados en supermercados y tiendas"
    },
    {
      "id": "suscripciones",
      "nombre": "Suscripciones innecesarias",
      "icono": "📱",
      "precio_promedio": 9.99,
      "descripcion": "Netflix, Spotify, apps y servicios no utilizados"
    },
    {
      "id": "transporte",
      "nombre": "Transporte por comodidad", 
      "icono": "🚗",
      "precio_promedio": 3.00,
      "descripcion": "Taxis, VTC, patinetes cuando hay alternativas"
    },
    {
      "id": "comisiones",
      "nombre": "Comisiones bancarias evitables",
      "icono": "🏦",
      "precio_promedio": 2.00, 
      "descripcion": "Cajeros ajenos, pagos fuera de plazo"
    },
    {
      "id": "otros",
      "nombre": "Otros gastos",
      "icono": "💸",
      "precio_promedio": 2.50,
      "descripcion": "Gastos hormiga personalizados"
    }
  ],
  frecuencias: [
    {"id": "diario", "nombre": "Diario", "multiplicador": 365},
    {"id": "semanal", "nombre": "Semanal", "multiplicador": 52}, 
    {"id": "mensual", "nombre": "Mensual", "multiplicador": 12}
  ],
  estadisticas_referencia: {
    gasto_hormiga_promedio_mensual: 150,
    porcentaje_salario_medio: 12,
    ahorro_potencial_anual: 1800
  },
  consejos_ahorro: [
    "Lleva café de casa en un termo reutilizable",
    "Prepara snacks saludables en casa", 
    "Cancela suscripciones que no uses regularmente",
    "Usa transporte público o camina distancias cortas",
    "Haz lista de compras y cíñete a ella",
    "Revisa y negocia comisiones bancarias",
    "Establece un presupuesto mensual para caprichos"
  ]
};

// Estado de la aplicación
let gastos = {};
let charts = {
  distribucion: null,
  tiempo: null
};

// Colores para gráficos
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  initializeGastos();
  renderGastosCards();
  renderConsejos();
  updateAllCalculations();
  setTimeout(() => {
    initializeCharts();
  }, 100);
});

// Inicializar estado de gastos
function initializeGastos() {
  appData.categorias_gastos.forEach(categoria => {
    gastos[categoria.id] = {
      activo: false,
      monto: categoria.precio_promedio,
      frecuencia: 'diario'
    };
  });
}

// Renderizar tarjetas de gastos
function renderGastosCards() {
  const container = document.getElementById('gastosGrid');
  container.innerHTML = '';

  appData.categorias_gastos.forEach(categoria => {
    const gasto = gastos[categoria.id];
    const card = document.createElement('div');
    card.className = `gasto-card ${gasto.activo ? 'active' : ''}`;
    card.innerHTML = `
      <div class="gasto-header">
        <div class="gasto-info">
          <span class="gasto-icon">${categoria.icono}</span>
          <div class="gasto-details">
            <h5>${categoria.nombre}</h5>
            <p>${categoria.descripcion}</p>
          </div>
        </div>
        <div class="gasto-toggle ${gasto.activo ? 'active' : ''}" 
             data-categoria="${categoria.id}"></div>
      </div>
      <div class="gasto-controls">
        <div class="gasto-amount">
          <input type="number" 
                 value="${gasto.monto}" 
                 step="0.01" 
                 min="0"
                 data-categoria="${categoria.id}"
                 data-type="monto"
                 ${!gasto.activo ? 'disabled' : ''}>
        </div>
        <div class="gasto-frequency">
          <select data-categoria="${categoria.id}" data-type="frecuencia"
                  ${!gasto.activo ? 'disabled' : ''}>
            ${appData.frecuencias.map(freq => 
              `<option value="${freq.id}" ${gasto.frecuencia === freq.id ? 'selected' : ''}>${freq.nombre}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div class="gasto-annual">
        <span id="anual-${categoria.id}">${formatCurrency(calculateGastoAnual(categoria.id))}</span> / año
      </div>
    `;
    container.appendChild(card);
  });

  // Agregar event listeners después de renderizar
  addEventListeners();
}

// Agregar event listeners
function addEventListeners() {
  // Toggle switches
  document.querySelectorAll('.gasto-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const categoriaId = this.getAttribute('data-categoria');
      toggleGasto(categoriaId);
    });
  });

  // Input fields
  document.querySelectorAll('input[data-type="monto"]').forEach(input => {
    input.addEventListener('input', function() {
      const categoriaId = this.getAttribute('data-categoria');
      const valor = parseFloat(this.value) || 0;
      updateMonto(categoriaId, valor);
    });
    
    input.addEventListener('change', function() {
      const categoriaId = this.getAttribute('data-categoria');
      const valor = parseFloat(this.value) || 0;
      updateMonto(categoriaId, valor);
    });
  });

  // Select fields
  document.querySelectorAll('select[data-type="frecuencia"]').forEach(select => {
    select.addEventListener('change', function() {
      const categoriaId = this.getAttribute('data-categoria');
      const frecuencia = this.value;
      updateFrecuencia(categoriaId, frecuencia);
    });
  });
}

// Toggle activar/desactivar gasto
function toggleGasto(categoriaId) {
  gastos[categoriaId].activo = !gastos[categoriaId].activo;
  renderGastosCards();
  updateAllCalculations();
  updateCharts();
  renderConsejos();
}

// Actualizar monto
function updateMonto(categoriaId, valor) {
  if (gastos[categoriaId]) {
    gastos[categoriaId].monto = Math.max(0, valor);
    updateAllCalculations();
    updateCharts();
    updateGastoAnual(categoriaId);
  }
}

// Actualizar frecuencia
function updateFrecuencia(categoriaId, frecuencia) {
  if (gastos[categoriaId]) {
    gastos[categoriaId].frecuencia = frecuencia;
    updateAllCalculations();
    updateCharts();
    updateGastoAnual(categoriaId);
  }
}

// Actualizar gasto anual individual
function updateGastoAnual(categoriaId) {
  const element = document.getElementById(`anual-${categoriaId}`);
  if (element) {
    element.textContent = formatCurrency(calculateGastoAnual(categoriaId));
  }
}

// Calcular gasto anual por categoría
function calculateGastoAnual(categoriaId) {
  const gasto = gastos[categoriaId];
  if (!gasto || !gasto.activo || !gasto.monto) return 0;
  
  const frecuencia = appData.frecuencias.find(f => f.id === gasto.frecuencia);
  if (!frecuencia) return 0;
  
  return gasto.monto * frecuencia.multiplicador;
}

// Calcular totales
function calculateTotales() {
  let totalAnual = 0;
  
  Object.keys(gastos).forEach(categoriaId => {
    totalAnual += calculateGastoAnual(categoriaId);
  });

  return {
    diario: totalAnual / 365,
    semanal: totalAnual / 52,
    mensual: totalAnual / 12,
    anual: totalAnual
  };
}

// Actualizar todos los cálculos
function updateAllCalculations() {
  const totales = calculateTotales();
  
  // Actualizar header
  const totalAnualEl = document.getElementById('totalAnual');
  const ahorroAnualEl = document.getElementById('ahorroAnual');
  if (totalAnualEl) totalAnualEl.textContent = formatCurrency(totales.anual);
  if (ahorroAnualEl) ahorroAnualEl.textContent = formatCurrency(totales.anual);
  
  // Actualizar resumen
  const gastoDiarioEl = document.getElementById('gastoDiario');
  const gastoSemanalEl = document.getElementById('gastoSemanal');
  const gastoMensualEl = document.getElementById('gastoMensual');
  const gastoAnualCardEl = document.getElementById('gastoAnualCard');
  
  if (gastoDiarioEl) gastoDiarioEl.textContent = formatCurrency(totales.diario);
  if (gastoSemanalEl) gastoSemanalEl.textContent = formatCurrency(totales.semanal);
  if (gastoMensualEl) gastoMensualEl.textContent = formatCurrency(totales.mensual);
  if (gastoAnualCardEl) gastoAnualCardEl.textContent = formatCurrency(totales.anual);
  
  // Actualizar simulador
  const ahorro50El = document.getElementById('ahorro50');
  const ahorro75El = document.getElementById('ahorro75');
  const ahorro100El = document.getElementById('ahorro100');
  
  if (ahorro50El) ahorro50El.textContent = formatCurrency(totales.anual * 0.5);
  if (ahorro75El) ahorro75El.textContent = formatCurrency(totales.anual * 0.75);
  if (ahorro100El) ahorro100El.textContent = formatCurrency(totales.anual);
  
  // Actualizar nivel de gastos
  updateNivelGastos(totales.mensual);
  
  // Actualizar comparativa
  updateComparativa(totales.mensual);
}

// Actualizar nivel de gastos
function updateNivelGastos(gastoMensual) {
  const nivelFill = document.getElementById('nivelFill');
  const nivelText = document.getElementById('nivelText');
  
  if (!nivelFill || !nivelText) return;
  
  const porcentaje = Math.min((gastoMensual / 300) * 100, 100);
  nivelFill.style.width = `${porcentaje}%`;
  
  let nivel, mensaje;
  if (gastoMensual < 50) {
    nivel = 'Bajo';
    mensaje = '¡Excelente control de gastos hormiga!';
  } else if (gastoMensual < 150) {
    nivel = 'Medio';
    mensaje = 'Tienes un nivel moderado de gastos hormiga';
  } else {
    nivel = 'Alto';
    mensaje = '¡Atención! Tus gastos hormiga son elevados';
  }
  
  nivelText.textContent = `${nivel}: ${mensaje}`;
}

// Actualizar comparativa
function updateComparativa(gastoMensual) {
  const tuGasto = document.getElementById('tuGastoMensual');
  const resultado = document.getElementById('comparativaResultado');
  
  if (!tuGasto || !resultado) return;
  
  tuGasto.textContent = formatCurrency(gastoMensual);
  
  const diferencia = gastoMensual - appData.estadisticas_referencia.gasto_hormiga_promedio_mensual;
  const porcentaje = Math.abs((diferencia / appData.estadisticas_referencia.gasto_hormiga_promedio_mensual) * 100);
  
  if (diferencia > 0) {
    resultado.className = 'comparativa-resultado peor';
    resultado.innerHTML = `Gastas ${formatCurrency(Math.abs(diferencia))} más que la media española<br><small>(${porcentaje.toFixed(1)}% por encima)</small>`;
  } else if (diferencia < 0) {
    resultado.className = 'comparativa-resultado mejor';
    resultado.innerHTML = `¡Gastas ${formatCurrency(Math.abs(diferencia))} menos que la media española!<br><small>(${porcentaje.toFixed(1)}% por debajo)</small>`;
  } else {
    resultado.className = 'comparativa-resultado';
    resultado.innerHTML = 'Estás en la media española de gastos hormiga';
  }
}

// Renderizar consejos
function renderConsejos() {
  const container = document.getElementById('consejosList');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Seleccionar consejos relevantes basados en gastos activos
  const consejosRelevantes = [];
  
  Object.keys(gastos).forEach(categoriaId => {
    if (gastos[categoriaId].activo) {
      switch(categoriaId) {
        case 'cafe':
          consejosRelevantes.push('Lleva café de casa en un termo reutilizable');
          break;
        case 'snacks':
          consejosRelevantes.push('Prepara snacks saludables en casa');
          break;
        case 'suscripciones':
          consejosRelevantes.push('Cancela suscripciones que no uses regularmente');
          break;
        case 'transporte':
          consejosRelevantes.push('Usa transporte público o camina distancias cortas');
          break;
        case 'compras_impulsivas':
          consejosRelevantes.push('Haz lista de compras y cíñete a ella');
          break;
        case 'comisiones':
          consejosRelevantes.push('Revisa y negocia comisiones bancarias');
          break;
      }
    }
  });
  
  // Si no hay consejos específicos, mostrar consejos generales
  const consejosAMostrar = consejosRelevantes.length > 0 
    ? consejosRelevantes.slice(0, 4)
    : appData.consejos_ahorro.slice(0, 4);
  
  consejosAMostrar.forEach(consejo => {
    const consejoElement = document.createElement('div');
    consejoElement.className = 'consejo-item';
    consejoElement.textContent = consejo;
    container.appendChild(consejoElement);
  });
}

// Inicializar gráficos
function initializeCharts() {
  initDistribucionChart();
  initTiempoChart();
  updateCharts();
}

// Gráfico de distribución
function initDistribucionChart() {
  const canvas = document.getElementById('chartDistribucion');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  charts.distribucion = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: chartColors,
        borderWidth: 3,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 11
            },
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = formatCurrency(context.parsed);
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
              return `${context.label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '60%'
    }
  });
}

// Gráfico de tiempo
function initTiempoChart() {
  const canvas = document.getElementById('chartTiempo');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  charts.tiempo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Diario', 'Semanal', 'Mensual', 'Anual'],
      datasets: [{
        label: 'Gasto Total',
        data: [0, 0, 0, 0],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
        borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Gasto ${context.label.toLowerCase()}: ${formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

// Actualizar gráficos
function updateCharts() {
  updateDistribucionChart();
  updateTiempoChart();
}

// Actualizar gráfico de distribución
function updateDistribucionChart() {
  if (!charts.distribucion) return;
  
  const labels = [];
  const data = [];
  
  Object.keys(gastos).forEach(categoriaId => {
    const gasto = gastos[categoriaId];
    if (gasto.activo && gasto.monto > 0) {
      const categoria = appData.categorias_gastos.find(c => c.id === categoriaId);
      if (categoria) {
        labels.push(`${categoria.icono} ${categoria.nombre}`);
        data.push(calculateGastoAnual(categoriaId));
      }
    }
  });
  
  if (labels.length === 0) {
    labels.push('Sin gastos activos');
    data.push(0);
  }
  
  charts.distribucion.data.labels = labels;
  charts.distribucion.data.datasets[0].data = data;
  charts.distribucion.update('active');
}

// Actualizar gráfico de tiempo
function updateTiempoChart() {
  if (!charts.tiempo) return;
  
  const totales = calculateTotales();
  charts.tiempo.data.datasets[0].data = [
    totales.diario,
    totales.semanal,
    totales.mensual,
    totales.anual
  ];
  charts.tiempo.update('active');
}

// Formatear moneda
function formatCurrency(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}