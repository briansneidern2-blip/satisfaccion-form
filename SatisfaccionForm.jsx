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

  const validateCurrentStep = () => {
    const errs = {};
    let valid = true;

    if (currentStep === 1) {
      if (!formData.nivelInteres) { errs.nivelInteres = true; valid = false; }
      const telDigits = formData.telefono.replace(/\D/g, '');
      if (!formData.telefono || telDigits.length < 10) { errs.telefono = true; valid = false; }
    }

    if (currentStep === 2) {
      if (!formData.claridadInfo) { errs.claridadInfo = true; valid = false; }
      if (!formData.amabilidad) { errs.amabilidad = true; valid = false; }
      if (!formData.aspectosSeleccionados || formData.aspectosSeleccionados.length === 0) {
        errs.aspectosSeleccionados = true;
        valid = false;
      }
    }

    setErrors(errs);
    return valid;
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

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUWb2c8hzk2tSaKfbCzBs5wW20O2vCxGweH1WOsdsLkbhvXgt14eR0SvKc4s9Q9MuQ/exec";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    let valid = true;

    if (!formData.aceptaPoliticas) { errs.aceptaPoliticas = true; valid = false; }

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
          intencionMatricula: 'N/A (Removido)',
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
    <div style={{ background: '#faf8ff', color: '#131b2e', minHeight: '100vh', padding: '2rem 1.25rem', fontFamily: 'Inter, sans-serif' }}>
      <main style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* BANNER HERO SUPERIOR */}
        {!isSubmitted && (
          <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#ffffff', border: '1px solid #dce0e4', padding: '0.5rem 1.2rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#004ac6', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <i className="fa-solid fa-face-smile" style={{ color: '#004ac6' }}></i>
              <span>COLEGIO NTRA. SRA. DE NAZARETH — PURIFICACIÓN</span>
            </div>
            <div style={{ display: 'block', fontSize: '2.25rem', fontWeight: 800, margin: '0.5rem 0', color: '#131b2e', letterSpacing: '-0.02em' }}>
              ¡Tu Opinión nos ayuda a mejorar! 😊
            </div>
            <p style={{ color: '#5e6367', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
              Tu opinión es muy valiosa para nosotros. Ayúdanos respondiendo estas 3 breves preguntas.
            </p>
          </section>
        )}

        {/* TARJETA PRINCIPAL FEEDBACKPRO (#004ac6) */}
        <div style={{ background: '#004ac6', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 25px rgba(0,0,0,0.12)', color: '#ffffff' }}>
          
          {/* STEPPER DE 3 PASOS */}
          {!isSubmitted && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', left: '3rem', right: '3rem', height: '3px', background: 'rgba(255, 255, 255, 0.25)', zIndex: 1 }}>
                <div style={{ height: '100%', width: `${((currentStep - 1) / 2) * 100}%`, background: '#ffffff', transition: 'width 0.4s ease' }}></div>
              </div>
              {['1. ¿Qué buscas?', '2. La Atención', '3. Tu Opinión'].map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = currentStep === stepNum;
                const isDone = currentStep > stepNum;
                return (
                  <div key={label} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isDone ? '#10b981' : isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.15)', color: isDone ? '#fff' : isActive ? '#004ac6' : 'rgba(255, 255, 255, 0.8)', border: isDone ? 'none' : isActive ? 'none' : '2px solid rgba(255, 255, 255, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {isDone ? <i className="fa-solid fa-check"></i> : stepNum}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)', fontWeight: isActive ? 700 : 600 }}>{label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* CONTENIDO DE PASOS */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              
              {/* PASO 1 */}
              {currentStep === 1 && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', textAlign: 'center', color: '#ffffff' }}>¿Para qué grado o nivel buscas información? 🎒</h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Toca una de las opciones:</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[
                      { val: 'Preescolar', icon: '🎨', title: 'Preescolar', desc: 'Párvulos a Transición' },
                      { val: 'Primaria', icon: '📚', title: 'Primaria', desc: 'Primero a Quinto' },
                      { val: 'Bachillerato', icon: '🧪', title: 'Bachillerato', desc: 'Sexto a Undécimo' },
                      { val: 'Varios Niveles', icon: '👨‍👩‍👧‍👦', title: 'Varios Niveles', desc: 'Más de un hijo/a' }
                    ].map(item => {
                      const selected = formData.nivelInteres === item.val;
                      return (
                        <button type="button" key={item.val} onClick={() => handleInputChange('nivelInteres', item.val)} style={{ background: selected ? '#f0fdf4' : '#ffffff', border: selected ? '2px solid #10b981' : '2px solid transparent', borderRadius: '12px', padding: '1rem 0.8rem', textAlign: 'center', cursor: 'pointer', color: '#131b2e', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{item.icon}</div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#5e6367' }}>{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: '#ffffff', fontWeight: 600 }}>Tu Celular o WhatsApp *</label>
                      <input type="tel" value={formData.telefono} onChange={e => handleInputChange('telefono', e.target.value)} placeholder="Ej. 300 123 4567 (10 dígitos)" style={{ width: '100%', padding: '0.75rem 1rem', background: '#ffffff', border: errors.telefono ? '2px solid #ffdad6' : 'none', borderRadius: '12px', color: '#131b2e' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.4rem', color: '#ffffff', fontWeight: 600 }}>Tu Nombre (Opcional)</label>
                      <input type="text" value={formData.nombreCompleto} onChange={e => handleInputChange('nombreCompleto', e.target.value)} placeholder="Escribe tu nombre si deseas" style={{ width: '100%', padding: '0.75rem 1rem', background: '#ffffff', border: 'none', borderRadius: '12px', color: '#131b2e' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button type="button" onClick={nextStep} style={{ background: '#ffffff', color: '#004ac6', border: 'none', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
                      Siguiente <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2 */}
              {currentStep === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', textAlign: 'center', color: '#ffffff' }}>¿Cómo te pareció la atención? 💬</h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Toca la carita que mejor represente cómo te sentiste hoy:</p>

                  <div style={{ background: 'rgba(255,255,255,0.1)', border: errors.claridadInfo ? '2px solid #ffdad6' : '1px solid rgba(255,255,255,0.2)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'center' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem', color: '#ffffff', fontSize: '0.9rem' }}>1. ¿Qué tan clara fue la información de precios, matrículas y documentos? *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                      {[
                        { val: 'Excelente', face: '😄', text: 'Súper clara' },
                        { val: 'Buena', face: '🙂', text: 'Buena' },
                        { val: 'Regular', face: '😐', text: 'Regular' },
                        { val: 'Poco clara', face: '🙁', text: 'Poco clara' }
                      ].map(em => (
                        <button type="button" key={em.val} onClick={() => handleInputChange('claridadInfo', em.val)} style={{ background: formData.claridadInfo === em.val ? '#f0fdf4' : '#ffffff', border: formData.claridadInfo === em.val ? '2px solid #10b981' : '2px solid transparent', borderRadius: '12px', padding: '0.75rem 0.4rem', cursor: 'pointer', color: '#131b2e' }}>
                          <div style={{ fontSize: '1.8rem' }}>{em.face}</div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>{em.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.1)', border: errors.amabilidad ? '2px solid #ffdad6' : '1px solid rgba(255,255,255,0.2)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'center' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem', color: '#ffffff', fontSize: '0.9rem' }}>2. ¿Cómo te trató la persona que te atendió? *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                      {[
                        { val: 'Muy amable', face: '❤️', text: 'Muy amable' },
                        { val: 'Bien', face: '🙂', text: 'Bien' },
                        { val: 'Normal', face: '😐', text: 'Normal' },
                        { val: 'Frío', face: '🙁', text: 'Distante' }
                      ].map(em => (
                        <button type="button" key={em.val} onClick={() => handleInputChange('amabilidad', em.val)} style={{ background: formData.amabilidad === em.val ? '#f0fdf4' : '#ffffff', border: formData.amabilidad === em.val ? '2px solid #10b981' : '2px solid transparent', borderRadius: '12px', padding: '0.75rem 0.4rem', cursor: 'pointer', color: '#131b2e' }}>
                          <div style={{ fontSize: '1.8rem' }}>{em.face}</div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>{em.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#ffffff', fontSize: '0.875rem' }}>👍 ¿Qué fue lo que más te gustó de tu consulta? *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {[
                        'Las instalaciones y salones', 'La educación en valores',
                        'La atención tan amable', 'La calidad de los profesores',
                        'Los precios y facilidades', 'Otras'
                      ].map(asp => {
                        const active = formData.aspectosSeleccionados.includes(asp);
                        return (
                          <button type="button" key={asp} onClick={() => handleTagToggle(asp)} style={{ padding: '0.5rem 0.9rem', borderRadius: '9999px', background: active ? '#ffffff' : 'rgba(255,255,255,0.18)', color: active ? '#004ac6' : '#ffffff', border: active ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontWeight: 600, fontSize: '0.825rem' }}>
                            {active ? '✓ ' : '+ '}{asp === 'Otras' ? '✨ Otras...' : asp}
                          </button>
                        );
                      })}
                    </div>

                    {formData.aspectosSeleccionados.includes('Otras') && (
                      <div style={{ marginTop: '0.9rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.4rem' }}>¿Qué otra cosa te gustó? Escríbela aquí:</label>
                        <input type="text" value={formData.otrasTexto || ''} onChange={e => handleInputChange('otrasTexto', e.target.value)} placeholder="Escribe aquí tu respuesta..." style={{ width: '100%', padding: '0.75rem', background: '#ffffff', border: 'none', borderRadius: '10px', color: '#131b2e' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button type="button" onClick={prevStep} style={{ background: 'transparent', color: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer' }}>Anterior</button>
                    <button type="button" onClick={nextStep} style={{ background: '#ffffff', color: '#004ac6', border: 'none', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente</button>
                  </div>
                </div>
              )}

              {/* PASO 3 */}
              {currentStep === 3 && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', textAlign: 'center', color: '#ffffff' }}>Tu opinión final 🌟</h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Tu opinión es fundamental para ayudarnos a mejorar cada día:</p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', lineHeight: '1.45', marginBottom: '0.6rem', color: '#ffffff', fontWeight: 600 }}>
                      <i className="fa-regular fa-comment-dots"></i> De acuerdo con la información que te brindamos y la experiencia con nosotros, por favor enúncianos las oportunidades de mejora.
                    </label>
                    <textarea rows="4" value={formData.comentariosSugerencias} onChange={e => handleInputChange('comentariosSugerencias', e.target.value)} placeholder="Escribe aquí tus sugerencias u oportunidades de mejora..." style={{ width: '100%', padding: '0.75rem 1rem', background: '#ffffff', border: 'none', borderRadius: '12px', color: '#131b2e' }}></textarea>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}>
                      <input type="checkbox" checked={formData.aceptaPoliticas} onChange={e => handleInputChange('aceptaPoliticas', e.target.checked)} />
                      <span>Autorizo el uso de mis datos únicamente para recibir información sobre admisiones. *</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button type="button" onClick={prevStep} style={{ background: 'transparent', color: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer' }}>Anterior</button>
                    <button type="submit" style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '0.75rem 2.5rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar Encuesta</button>
                  </div>
                </div>
              )}

            </form>
          ) : (
            /* PANTALLA DE ÉXITO */
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '80px', height: '80px', background: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>
                💙
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.8rem', color: '#ffffff' }}>¡Muchas Gracias por tu Visita!</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 2rem' }}>
                Tus respuestas nos ayudan a atender siempre con alegría y cariño a cada familia que se acerca al Colegio Nazareth.
              </p>
              <button type="button" onClick={handleReset} style={{ background: '#ffffff', color: '#004ac6', border: 'none', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>
                Responder otra vez
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
