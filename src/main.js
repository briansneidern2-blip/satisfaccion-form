/**
 * LÓGICA PRINCIPAL - ENCUESTA DE SATISFACCIÓN Y ATENCIÓN AL USUARIO
 * Colegio Nuestra Señora de Nazareth - Purificación
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 4;

  const form = document.getElementById('satisfaccionForm');
  const progressFill = document.getElementById('progressFill');
  const stepPages = document.querySelectorAll('.form-step-page');
  const stepItems = document.querySelectorAll('.step-item');
  const successScreen = document.getElementById('successScreen');
  const btnResetForm = document.getElementById('btnResetForm');
  const heroSection = document.querySelector('.hero-section');

  // =========================================================================
  // 1. STAR RATINGS
  // =========================================================================
  const ratingTextLabels = {
    1: '1 - Insatisfecho',
    2: '2 - Regular',
    3: '3 - Aceptable',
    4: '4 - Bueno',
    5: '5 - Excelente'
  };

  document.querySelectorAll('.star-rating').forEach(ratingGroup => {
    const hiddenName = ratingGroup.getAttribute('data-name');
    const hiddenInput = document.querySelector(`input[name="${hiddenName}"]`);
    const displayEl = document.getElementById(`val_${hiddenName}`);
    const ratingCard = document.getElementById(`card_${hiddenName}`);
    const buttons = ratingGroup.querySelectorAll('button');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-value');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (hiddenInput) hiddenInput.value = val;
        if (displayEl) {
          displayEl.textContent = ratingTextLabels[val] || val;
          displayEl.classList.add('rated');
        }
        if (ratingCard) ratingCard.classList.remove('invalid');
      });
    });
  });

  // =========================================================================
  // 2. TAG CLOUD ASPECTOS DESTACADOS
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
  // 3. STEPPER & VALIDATION
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

    if (step === 1) {
      ['tipoUsuario', 'canalAtencion', 'areaAtendida'].forEach(id => {
        const el = document.getElementById(id);
        const parent = el ? el.closest('.input-group') : null;
        if (!el || !el.value) {
          if (parent) parent.classList.add('invalid');
          isValid = false;
        } else {
          if (parent) parent.classList.remove('invalid');
        }
      });

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

    if (step === 2) {
      ['agilidad', 'amabilidad', 'claridad', 'efectividad', 'instalaciones'].forEach(name => {
        const input = document.querySelector(`input[name="${name}"]`);
        const card = document.getElementById(`card_${name}`);
        if (!input || !input.value) {
          if (card) card.classList.add('invalid');
          isValid = false;
        } else {
          if (card) card.classList.remove('invalid');
        }
      });
    }

    if (step === 3) {
      const rRes = document.querySelectorAll('input[name="solicitudResuelta"]');
      const checkedRes = Array.from(rRes).some(r => r.checked);
      const ctrlRes = document.getElementById('controlResuelto');
      if (!checkedRes) {
        ctrlRes.classList.add('invalid');
        isValid = false;
      } else {
        ctrlRes.classList.remove('invalid');
      }

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
  // 4. SUBMIT FORM
  // =========================================================================
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let step4Valid = true;

    const rRec = document.querySelectorAll('input[name="recomendariaServicio"]');
    const checkedRec = Array.from(rRec).some(r => r.checked);
    const ctrlRec = document.getElementById('controlRecomendariaServicio');
    if (!checkedRec) {
      ctrlRec.classList.add('invalid');
      step4Valid = false;
    } else {
      ctrlRec.classList.remove('invalid');
    }

    const aceptaPoliticas = document.getElementById('aceptaPoliticas');
    const policyContainer = aceptaPoliticas.closest('.policy-checkbox-container');
    if (!aceptaPoliticas.checked) {
      policyContainer.classList.add('invalid');
      step4Valid = false;
    } else {
      policyContainer.classList.remove('invalid');
    }

    if (!step4Valid) return;

    if (heroSection) heroSection.classList.add('hidden');

    document.querySelector('.stepper-wrapper').style.display = 'none';
    form.style.display = 'none';
    successScreen.classList.remove('hidden');
    document.querySelector('.form-card-container').scrollIntoView({ behavior: 'smooth' });
  });

  // RESET
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      form.reset();

      if (heroSection) heroSection.classList.remove('hidden');

      document.querySelectorAll('.star-rating button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.rating-val-display').forEach(d => {
        d.textContent = "Sin calificar";
        d.classList.remove('rated');
      });
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

  form.querySelectorAll('input, select, textarea').forEach(input => {
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
