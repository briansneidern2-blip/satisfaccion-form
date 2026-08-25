'use client';

/**
 * COMPONENTE REACT / NEXT.JS - ENCUESTA INTERACTIVA DE ADMISIONES Y PROSPECTOS
 * Colegio Nuestra Señora de Nazareth - Purificación
 * PALETA DE COLORES FEEDBACKPRO (#004ac6) & FUENTE TIPOGRÁFICA INTER
 */

import React, { useState } from 'react';

export default function SatisfaccionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    nivelInteres: '',
    telefono: '',
    nombreCompleto: '',
    claridadInfo: '',
    amabilidad: '',
    aspectosSeleccionados: [],
    otrasTexto: '',
    comentariosSugerencias: '',
    aceptaPoliticas: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const handleTagToggle = (val) => {
    setFormData(prev => {
      const arr = prev.aspectosSeleccionados || [];
      const updated = arr.includes(val) ? arr.filter(i => i !== val) : [...arr, val];
      return { ...prev, aspectosSeleccionados: updated };
    });
    setErrors(prev => ({ ...prev, aspectosSeleccionados: false }));
  };

  const validateStepNumber = (stepNum) => {
    const errs = {};
    let valid = true;
    if (stepNum === 1) {
      if (!formData.nivelInteres) { errs.nivelInteres = true; valid = false; }
      const telDigits = (formData.telefono || '').replace(/\D/g, '');
      if (!formData.telefono || telDigits.length < 10) { errs.telefono = true; valid = false; }
    }
    if (stepNum === 2) {
      if (!formData.claridadInfo) { errs.claridadInfo = true; valid = false; }
      if (!formData.amabilidad) { errs.amabilidad = true; valid = false; }
      if (!formData.aspectosSeleccionados || formData.aspectosSeleccionados.length === 0) {
        errs.aspectosSeleccionados = true;
        valid = false;
      }
    }
    if (stepNum === 3) {
      if (!formData.comentariosSugerencias || !formData.comentariosSugerencias.trim()) {
        errs.comentariosSugerencias = true;
        valid = false;
      }
      if (!formData.aceptaPoliticas) {
        errs.aceptaPoliticas = true;
        valid = false;
      }
    }
    return { valid, errs };
  };

  const validateCurrentStep = () => {
    const { valid, errs } = validateStepNumber(currentStep);
    setErrors(errs);
    return valid;
  };

  const handleStepClick = (targetStep) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetStep > currentStep) {
      let canAdvance = true;
      for (let s = currentStep; s < targetStep; s++) {
        const { valid, errs } = validateStepNumber(s);
        if (!valid) {
          canAdvance = false;
          setErrors(errs);
          setCurrentStep(s);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        }
      }
      if (canAdvance) {
        setCurrentStep(targetStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzzfh_LXwJC4WA8al5NhR2EqLmJHWZw9MqmEVvBnER2q1GPyXRIpWbGquY8IruXhU6XaA/exec";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errs } = validateStepNumber(3);

    if (!valid) {
      setErrors(errs);
      return;
    }

    // Enviar las respuestas a Google Sheets
    if (GOOGLE_SCRIPT_URL) {
      try {
        const aspectosFinal = (formData.aspectosSeleccionados || []).map(a => {
          if (a === 'Otras' && formData.otrasTexto) {
            return `Otras (${formData.otrasTexto.trim()})`;
          }
          return a;
        });

        const payload = {
          nivelInteres: formData.nivelInteres || '',
          telefono: formData.telefono || '',
          nombreCompleto: formData.nombreCompleto || 'Anónimo',
          claridadInfo: formData.claridadInfo || '',
          amabilidad: formData.amabilidad || '',
          aspectosSeleccionados: aspectosFinal.join(', '),
          comentariosSugerencias: formData.comentariosSugerencias || ''
        };
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Error al conectar con Google Sheets:', err);
      }
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({
      nivelInteres: '', telefono: '', nombreCompleto: '',
      claridadInfo: '', amabilidad: '', aspectosSeleccionados: [], otrasTexto: '',
      comentariosSugerencias: '', aceptaPoliticas: false
    });
    setErrors({});
  };

  return (
  return (
    <div style={{ background: '#faf8ff', color: '#131b2e', minHeight: '100vh', width: '100%', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 1.25rem', fontFamily: 'Inter, sans-serif' }}>
      <main style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', boxSizing: 'border-box' }}>
        
        <div className="desktop-split-container">
          
          {/* PANEL IZQUIERDO INSTITUCIONAL */}
          {!isSubmitted && (
            <section className="left-hero-panel">
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="./escudo-nazareth.png" alt="Escudo Colegio Ntra. Sra. de Nazareth" style={{ width: '135px', height: 'auto', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.12))' }} />
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', margin: '0 auto 0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <span>COLEGIO NTRA. SRA. DE NAZARETH — PURIFICACIÓN</span>
              </div>
              <div style={{ display: 'block', fontSize: '2.25rem', fontWeight: 800, margin: '0.5rem 0 0.6rem', color: '#0f172a', letterSpacing: '-0.02em', textAlign: 'center', width: '100%', lineHeight: '1.2' }}>
                ¡Tu Opinión nos ayuda a mejorar! 😊
              </div>
              <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto 1.25rem', textAlign: 'center', width: '100%' }}>
                Tu opinión es muy valiosa para nosotros. Ayúdanos respondiendo estas 3 breves preguntas.
              </p>

              {/* STEPPER DE 3 PASOS EN PANEL IZQUIERDO */}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative', marginTop: '0.8rem' }}>
                <div style={{ position: 'absolute', top: '20px', left: 'calc(40px + 0.5rem)', right: 'calc(40px + 0.5rem)', height: '0', borderTop: '2.5px dashed rgba(0, 74, 198, 0.25)', zIndex: 1 }}>
                  <div style={{ height: '0', width: `${((currentStep - 1) / 2) * 100}%`, borderTop: '2.5px dashed #004ac6', transition: 'width 0.4s ease', marginTop: '-2.5px' }}></div>
                </div>
                {['1. ¿Qué buscas?', '2. La Atención', '3. Tu Opinión'].map((label, idx) => {
                  const stepNum = idx + 1;
                  const isActive = currentStep === stepNum;
                  const isDone = currentStep > stepNum;
                  return (
                    <div key={label} onClick={() => handleStepClick(stepNum)} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isDone ? '#10b981' : isActive ? '#004ac6' : '#ffffff', color: isDone ? '#fff' : isActive ? '#ffffff' : '#004ac6', border: isDone ? 'none' : isActive ? 'none' : '2px solid #004ac6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'relative', zIndex: 2, boxShadow: isActive ? '0 0 14px rgba(0, 74, 198, 0.4)' : '0 2px 6px rgba(0, 74, 198, 0.12)' }}>
                        {isDone ? <i className="fa-solid fa-check"></i> : stepNum}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: isActive ? '#004ac6' : '#475569', fontWeight: isActive ? 800 : 600, textAlign: 'center' }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* PANEL DERECHO: TARJETA DEL FORMULARIO CON PALETA BLANCA Y GRIS ELEGANTE COMPACTA */}
          <div className="right-form-panel">
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.4rem 1.6rem', boxShadow: '0 10px 30px rgba(0,0,0,0.07)', color: '#0f172a', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>

          {/* CONTENIDO DE PASOS */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              
              {/* PASO 1 */}
              {currentStep === 1 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem', textAlign: 'center', color: '#0f172a' }}>¿Para qué grado o nivel buscas información? 🎒</h2>
                  <p style={{ color: '#475569', textAlign: 'center', marginBottom: '1.1rem', fontSize: '0.875rem' }}>Toca una de las opciones:</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.1rem' }}>
                    {[
                      { val: 'Preescolar', img: './icon-preescolar.png', title: 'Preescolar', desc: 'Pre-jardin, Jardín, Transición' },
                      { val: 'Primaria', img: './icon-primaria.png', title: 'Primaria', desc: 'Grado 1° a 5°' },
                      { val: 'Bachillerato', img: './icon-secundaria.png', title: 'Bachillerato', desc: 'Grado 6° a 11°' },
                      { val: 'Varios Niveles', img: './icon-otros.png', title: 'Varios Niveles', desc: 'Tengo más de un hijo/a' }
                    ].map(item => {
                      const selected = formData.nivelInteres === item.val;
                      return (
                        <button type="button" key={item.val} onClick={() => handleInputChange('nivelInteres', item.val)} style={{ background: selected ? '#ecfdf5' : '#f8fafc', border: selected ? '2.5px solid #059669' : '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 0.6rem', textAlign: 'center', cursor: 'pointer', color: selected ? '#065f46' : '#0f172a', boxShadow: selected ? '0 4px 14px rgba(5,150,105,0.25)' : 'none' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '44px', marginBottom: '0.25rem' }}>
                            <img src={item.img} alt={item.title} style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                          </div>
                          <div style={{ fontWeight: selected ? 800 : 700, fontSize: '0.875rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.72rem', color: selected ? '#047857' : '#64748b' }}>{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ minHeight: '2.8rem', display: 'flex', alignItems: 'flex-end', fontSize: '0.875rem', marginBottom: '0.4rem', color: '#0f172a', fontWeight: 600 }}>Tu Celular o WhatsApp de contacto *</label>
                      <input type="tel" value={formData.telefono} onChange={e => handleInputChange('telefono', e.target.value)} placeholder="Ej. 300 123 4567" style={{ width: '100%', height: '46px', padding: '0.7rem 1rem', background: '#f8fafc', border: errors.telefono ? '2.5px solid #dc2626' : '1.5px solid #cbd5e1', borderRadius: '12px', color: '#0f172a', boxSizing: 'border-box' }} />
                      {errors.telefono && <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, display: 'block', marginTop: '0.25rem' }}>Escribe un número válido (10 dígitos).</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ minHeight: '2.8rem', display: 'flex', alignItems: 'flex-end', fontSize: '0.875rem', marginBottom: '0.4rem', color: '#0f172a', fontWeight: 600 }}>Tu Nombre (Opcional)</label>
                      <input type="text" value={formData.nombreCompleto} onChange={e => handleInputChange('nombreCompleto', e.target.value)} placeholder="Escribe tu nombre" style={{ width: '100%', height: '46px', padding: '0.7rem 1rem', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', color: '#0f172a', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.85rem' }}>
                    <button type="button" onClick={nextStep} className="btn-primary">
                      Siguiente <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2 */}
              {currentStep === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem', textAlign: 'center', color: '#0f172a' }}>¿Cómo te pareció la atención? 💬</h2>
                  <p style={{ color: '#475569', textAlign: 'center', marginBottom: '1.1rem', fontSize: '0.875rem' }}>Toca la carita que mejor represente cómo te sentiste hoy:</p>

                  <div className="step2-cards-grid">
                    <div style={{ background: '#f8fafc', border: errors.claridadInfo ? '2.5px solid #dc2626' : '1.5px solid #e2e8f0', padding: '0.9rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '0.75rem', color: '#0f172a', fontSize: '0.875rem', minHeight: '2.8rem', textAlign: 'center' }}>1. ¿Qué tan clara fue la información de precios, matrículas y documentos? *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                        {[
                          { val: 'Excelente', face: '😄', text: 'Súper clara' },
                          { val: 'Buena', face: '🙂', text: 'Buena' },
                          { val: 'Regular', face: '😐', text: 'Regular' },
                          { val: 'Poco clara', face: '🙁', text: 'Poco clara' }
                        ].map(em => {
                          const active = formData.claridadInfo === em.val;
                          return (
                            <button type="button" key={em.val} onClick={() => handleInputChange('claridadInfo', em.val)} style={{ background: active ? '#ecfdf5' : '#ffffff', border: active ? '2.5px solid #059669' : '1.5px solid #cbd5e1', borderRadius: '12px', padding: '0.6rem 0.3rem', cursor: 'pointer', color: active ? '#065f46' : '#0f172a', boxShadow: active ? '0 4px 14px rgba(5,150,105,0.25)' : 'none' }}>
                              <div style={{ fontSize: '1.6rem' }}>{em.face}</div>
                              <div style={{ fontSize: '0.75rem', fontWeight: active ? 800 : 700 }}>{em.text}</div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.claridadInfo && <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, display: 'block', marginTop: '0.35rem' }}>Selecciona una carita.</span>}
                    </div>

                    <div style={{ background: '#f8fafc', border: errors.amabilidad ? '2.5px solid #dc2626' : '1.5px solid #e2e8f0', padding: '0.9rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '0.75rem', color: '#0f172a', fontSize: '0.875rem', minHeight: '2.8rem', textAlign: 'center' }}>2. ¿Cómo te trató la persona que te atendió? *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                        {[
                          { val: 'Muy amable', face: '❤️', text: 'Muy amable' },
                          { val: 'Bien', face: '🙂', text: 'Bien' },
                          { val: 'Normal', face: '😐', text: 'Normal' },
                          { val: 'Frío', face: '🙁', text: 'Distante' }
                        ].map(em => {
                          const active = formData.amabilidad === em.val;
                          return (
                            <button type="button" key={em.val} onClick={() => handleInputChange('amabilidad', em.val)} style={{ background: active ? '#ecfdf5' : '#ffffff', border: active ? '2.5px solid #059669' : '1.5px solid #cbd5e1', borderRadius: '12px', padding: '0.6rem 0.3rem', cursor: 'pointer', color: active ? '#065f46' : '#0f172a', boxShadow: active ? '0 4px 14px rgba(5,150,105,0.25)' : 'none' }}>
                              <div style={{ fontSize: '1.6rem' }}>{em.face}</div>
                              <div style={{ fontSize: '0.75rem', fontWeight: active ? 800 : 700 }}>{em.text}</div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.amabilidad && <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, display: 'block', marginTop: '0.35rem' }}>Selecciona una carita.</span>}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: errors.aspectosSeleccionados ? '2.5px solid #dc2626' : '1.5px solid #e2e8f0', padding: '0.9rem', borderRadius: '12px', marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.6rem', color: '#0f172a', fontSize: '0.85rem' }}>👍 ¿Qué fue lo que más te gustó de tu consulta? *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {[
                        'Las instalaciones y salones', 'La educación en valores',
                        'La atención tan amable', 'La calidad de los profesores',
                        'Los precios y facilidades', 'Otras'
                      ].map(asp => {
                        const active = formData.aspectosSeleccionados.includes(asp);
                        return (
                          <button type="button" key={asp} onClick={() => handleTagToggle(asp)} style={{ padding: '0.45rem 0.85rem', borderRadius: '9999px', background: active ? '#059669' : '#ffffff', color: active ? '#ffffff' : '#334155', border: active ? '1.5px solid #059669' : '1.5px solid #cbd5e1', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', boxShadow: active ? '0 3px 10px rgba(5,150,105,0.3)' : 'none' }}>
                            {active ? '✓ ' : '+ '}{asp === 'Otras' ? '✨ Otras...' : asp}
                          </button>
                        );
                      })}
                    </div>
                    {errors.aspectosSeleccionados && <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, display: 'block', marginTop: '0.35rem' }}>Selecciona al menos una opción.</span>}

                    {formData.aspectosSeleccionados.includes('Otras') && (
                      <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed #cbd5e1' }}>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>✨ ¿Qué otra cosa te gustó? Escríbela aquí:</label>
                        <input type="text" value={formData.otrasTexto || ''} onChange={e => handleInputChange('otrasTexto', e.target.value)} placeholder="Escribe aquí tu respuesta..." style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px', color: '#0f172a' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                    <button type="button" onClick={prevStep} className="btn-secondary">
                      <i className="fa-solid fa-arrow-left"></i> Anterior
                    </button>
                    <button type="button" onClick={nextStep} className="btn-primary">
                      Siguiente <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3 */}
              {currentStep === 3 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem', textAlign: 'center', color: '#0f172a' }}>Tu opinión final 🌟</h2>
                  <p style={{ color: '#475569', textAlign: 'center', marginBottom: '1.1rem', fontSize: '0.875rem' }}>Tu opinión es fundamental para ayudarnos a mejorar cada día:</p>

                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', lineHeight: '1.45', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 600 }}>
                      <i className="fa-regular fa-comment-dots"></i> De acuerdo con la información que te brindamos y la experiencia con nosotros, por favor, indícanos qué oportunidades de mejora crees que tenemos como colegio. Para nosotros son muy importantes tus apreciaciones. *
                    </label>
                    <textarea rows="4" value={formData.comentariosSugerencias} onChange={e => handleInputChange('comentariosSugerencias', e.target.value)} placeholder="Escribe aquí tus apreciaciones u oportunidades de mejora..." style={{ width: '100%', padding: '0.7rem 1rem', background: '#f8fafc', border: errors.comentariosSugerencias ? '2.5px solid #dc2626' : '1.5px solid #cbd5e1', borderRadius: '12px', color: '#0f172a' }}></textarea>
                    {errors.comentariosSugerencias && <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, display: 'block', marginTop: '0.25rem' }}>Por favor, déjanos tus apreciaciones u oportunidades de mejora (campo obligatorio).</span>}
                  </div>

                  <div className={`policy-checkbox-container ${errors.aceptaPoliticas ? 'shake-checkbox' : ''}`} style={{ marginBottom: '1.1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', color: errors.aceptaPoliticas ? '#dc2626' : '#334155', fontSize: '0.825rem', fontWeight: errors.aceptaPoliticas ? 700 : 500 }}>
                      <input type="checkbox" checked={formData.aceptaPoliticas} onChange={e => handleInputChange('aceptaPoliticas', e.target.checked)} />
                      <span>Autorizo el uso de mis datos únicamente para recibir información sobre admisiones. *</span>
                    </label>
                    {errors.aceptaPoliticas && (
                      <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span>Por favor, autoriza el uso de mis datos para poder enviar la encuesta.</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                    <button type="button" onClick={prevStep} className="btn-secondary">
                      <i className="fa-solid fa-arrow-left"></i> Anterior
                    </button>
                    <button type="submit" className="btn-submit">
                      Enviar Encuesta <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              )}

            </form>
          ) : (
            /* PANTALLA DE ÉXITO */
            <div style={{ textAlign: 'center', padding: '1.8rem 1rem' }}>
              <div style={{ width: '70px', height: '70px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 1.2rem', border: '2px solid #059669' }}>
                💚
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.6rem', color: '#0f172a' }}>¡Muchas Gracias por tu Visita!</h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 1.6rem' }}>
                Tus respuestas nos ayudan a atender siempre con alegría y cariño a cada familia que se acerca al Colegio Nazareth.
              </p>
              <button type="button" onClick={handleReset} style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '0.7rem 1.8rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>
                Responder otra vez
              </button>
            </div>
          )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
