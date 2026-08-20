/**
 * LÓGICA PRINCIPAL - ENCUESTA INTERACTIVA DE ADMISIONES Y ATENCIÓN A PROSPECTOS
 * Colegio Nuestra Señora de Nazareth - Purificación
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 3;

  const form = document.getElementById('satisfaccionForm');
  const progressFill = document.getElementById('progressFill');
  const stepPages = document.querySelectorAll('.form-step-page');
  const stepItems = document.querySelectorAll('.step-item');
  const successScreen = document.getElementById('successScreen');
  const btnResetForm = document.getElementById('btnResetForm');
  const heroSection = document.querySelector('.hero-section');

  // =========================================================================
  // 1. MANEJO INTERACTIVO DE BOTONES DE CARITAS (EMOJIS)
  // =========================================================================
  const emojiButtons = document.querySelectorAll('.emoji-btn');
  emojiButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const fieldName = btn.getAttribute('data-field');
      const value = btn.getAttribute('data-val');

      // Desmarcar otros botones del mismo grupo
      document.querySelectorAll(`.emoji-btn[data-field="${fieldName}"]`).forEach(b => b.classList.remove('active'));
      
      // Marcar botón activo
      btn.classList.add('active');

      // Actualizar el input oculto correspondiente
      const hiddenInput = document.getElementById(fieldName);
      if (hiddenInput) {
        hiddenInput.value = value;
      }

      // Remover estado inválido de la tarjeta si existía
      const cardBlock = document.getElementById(`card_${fieldName}`);
      if (cardBlock) {
        cardBlock.classList.remove('invalid');
      }
    });
  });

  // =========================================================================
  // 2. NUBE INTERACTIVA DE ETIQUETAS DE ASPECTOS DESTACADOS
  // =========================================================================
  const tagPills = document.querySelectorAll('.tag-pill');
  const hiddenAspectos = document.getElementById('aspectosSeleccionados');
  const tagsSection = document.getElementById('tagsAspectosSection');

  tagPills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      const icon = pill.querySelector('i');
      if (pill.classList.contains('active')) {
        icon.className = 'fa-solid fa-check';
      } else {
        icon.className = 'fa-solid fa-plus';
      }

      const activeVals = Array.from(document.querySelectorAll('.tag-pill.active')).map(p => p.getAttribute('data-val'));
      hiddenAspectos.value = activeVals.join(',');

      if (activeVals.length > 0 && tagsSection) {
        tagsSection.classList.remove('invalid');
      }
    });
  });

  // =========================================================================
  // 3. STEPPER Y VALIDACIÓN DE PASOS
  // =========================================================================
  function updateStepper(step) {
    currentStep = step;
    
    const percentage = ((step - 1) / (totalSteps - 1)) * 100;
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }

    stepPages.forEach((page, index) => {
      if (index + 1 === step) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    stepItems.forEach((item) => {
      const stepNum = parseInt(item.getAttribute('data-step'), 10);
      if (stepNum === step) {
        item.classList.add('active');
        item.classList.remove('completed');
      } else if (stepNum < step) {
        item.classList.remove('active');
        item.classList.add('completed');
      } else {
        item.classList.remove('active', 'completed');
      }
    });

    document.querySelector('.form-card-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    let isValid = true;

    // Paso 1: Nivel de interés y teléfono de contacto
    if (step === 1) {
      const rNivel = document.querySelectorAll('input[name="nivelInteres"]');
      const checkedNivel = Array.from(rNivel).some(r => r.checked);
      const gridNiveles = document.getElementById('gridNiveles').closest('.input-group');
      
      if (!checkedNivel) {
        gridNiveles.classList.add('invalid');
        isValid = false;
      } else {
        gridNiveles.classList.remove('invalid');
      }

      const elTel = document.getElementById('telefono');
      const parentTel = elTel ? elTel.closest('.input-group') : null;
      const digitsOnly = elTel ? elTel.value.replace(/\D/g, '') : '';

      if (!elTel || !elTel.value || digitsOnly.length < 10) {
        if (parentTel) parentTel.classList.add('invalid');
        isValid = false;
      } else {
        if (parentTel) parentTel.classList.remove('invalid');
      }
    }

    // Paso 2: Evaluación con caritas y aspectos destacados
    if (step === 2) {
      ['claridadInfo', 'amabilidad'].forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const card = document.getElementById(`card_${fieldId}`);
        if (!input || !input.value) {
          if (card) card.classList.add('invalid');
          isValid = false;
        } else {
          if (card) card.classList.remove('invalid');
        }
      });

      if (!hiddenAspectos.value || hiddenAspectos.value.trim() === '') {
        if (tagsSection) tagsSection.classList.add('invalid');
        isValid = false;
      } else {
        if (tagsSection) tagsSection.classList.remove('invalid');
      }
    }

    return isValid;
  }

  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.getAttribute('data-next'), 10);
      if (validateStep(currentStep)) {
        updateStepper(targetStep);
      }
    });
  });

  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.getAttribute('data-prev'), 10);
      updateStepper(targetStep);
    });
  });

  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetStep = parseInt(item.getAttribute('data-step'), 10);
      if (targetStep < currentStep) {
        updateStepper(targetStep);
      } else if (targetStep > currentStep && validateStep(currentStep)) {
        updateStepper(targetStep);
      }
    });
  });

  // =========================================================================
  // 4. ENVÍO DE DATOS Y CONEXIÓN CON GOOGLE SHEETS (GOOGLE DRIVE)
  // =========================================================================
  // URL oficial de Google Apps Script para guardar respuestas en Google Sheets
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUWb2c8hzk2tSaKfbCzBs5wW20O2vCxGweH1WOsdsLkbhvXgt14eR0SvKc4s9Q9MuQ/exec";

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let step3Valid = true;

    const rInt = document.querySelectorAll('input[name="intencionMatricula"]');
    const checkedInt = Array.from(rInt).some(r => r.checked);
    const ctrlInt = document.getElementById('controlIntencion');
    if (!checkedInt) {
      ctrlInt.classList.add('invalid');
      step3Valid = false;
    } else {
      ctrlInt.classList.remove('invalid');
    }

    const aceptaPoliticas = document.getElementById('aceptaPoliticas');
    const policyContainer = aceptaPoliticas.closest('.policy-checkbox-container');
    if (!aceptaPoliticas.checked) {
      policyContainer.classList.add('invalid');
      step3Valid = false;
    } else {
      policyContainer.classList.remove('invalid');
    }

    if (!step3Valid) return;

    // Recopilar datos para guardar en Google Sheets
    const payload = {
      nivelInteres: document.querySelector('input[name="nivelInteres"]:checked')?.value || '',
      telefono: document.getElementById('telefono').value || '',
      nombreCompleto: document.getElementById('nombreCompleto').value || 'Anónimo',
      claridadInfo: document.getElementById('claridadInfo').value || '',
      amabilidad: document.getElementById('amabilidad').value || '',
      aspectosSeleccionados: document.getElementById('aspectosSeleccionados').value || '',
      intencionMatricula: document.querySelector('input[name="intencionMatricula"]:checked')?.value || '',
      comentariosSugerencias: document.getElementById('comentariosSugerencias').value || ''
    };

    // Si colocaron la URL de Google Script, enviar la información a Google Sheets
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim() !== '') {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Advertencia al enviar a Google Sheets:', err);
      }
    }

    // Ocultar banner hero y mostrar pantalla de éxito
    if (heroSection) heroSection.classList.add('hidden');

    document.querySelector('.stepper-wrapper').style.display = 'none';
    form.style.display = 'none';
    successScreen.classList.remove('hidden');
    document.querySelector('.form-card-container').scrollIntoView({ behavior: 'smooth' });
  });

  // RESTABLECER FORMULARIO
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      form.reset();

      if (heroSection) heroSection.classList.remove('hidden');

      document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('input[type="hidden"]').forEach(h => {
        if (h.name !== 'aspectosSeleccionados') h.value = '';
      });

      tagPills.forEach(p => {
        p.classList.remove('active');
        p.querySelector('i').className = 'fa-solid fa-plus';
      });
      hiddenAspectos.value = '';

      document.querySelector('.stepper-wrapper').style.display = 'flex';
      form.style.display = 'block';
      successScreen.classList.add('hidden');
      updateStepper(1);
    });
  }

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      const parent = input.closest('.input-group');
      if (parent) parent.classList.remove('invalid');
    });
  });

  form.querySelectorAll('input[type="radio"]').forEach(r => {
    r.addEventListener('change', () => {
      const ctrl = r.closest('.segmented-control') || r.closest('.input-group');
      if (ctrl) ctrl.classList.remove('invalid');
    });
  });
});
