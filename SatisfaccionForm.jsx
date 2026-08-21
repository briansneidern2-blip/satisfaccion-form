'use client';

/**
 * COMPONENTE REACT / NEXT.JS - ENCUESTA INTERACTIVA DE ADMISIONES Y PROSPECTOS
 * Colegio Nuestra Señora de Nazareth - Purificación
 * FONDO DE PÁGINA BLANCO + TARJETA AZUL MARINO INSTITUCIONAL
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
    intencionMatricula: '',
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

    if (!formData.intencionMatricula) { errs.intencionMatricula = true; valid = false; }
    if (!formData.aceptaPoliticas) { errs.aceptaPoliticas = true; valid = false; }

    if (!valid) {
      setErrors(errs);
      return;
    }

    // Enviar las respuestas a Google Sheets
    if (GOOGLE_SCRIPT_URL) {
      try {
        const payload = {
          nivelInteres: formData.nivelInteres || '',
          telefono: formData.telefono || '',
          nombreCompleto: formData.nombreCompleto || 'Anónimo',
          claridadInfo: formData.claridadInfo || '',
          amabilidad: formData.amabilidad || '',
          aspectosSeleccionados: (formData.aspectosSeleccionados || []).join(','),
          intencionMatricula: formData.intencionMatricula || '',
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
      claridadInfo: '', amabilidad: '', aspectosSeleccionados: [],
      intencionMatricula: '', comentariosSugerencias: '', aceptaPoliticas: false
    });
    setErrors({});
  };

  return (
    <div style={{ background: '#ffffff', color: '#0f172a', minHeight: '100vh', padding: '2rem 1.25rem' }}>
      <main style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* BANNER HERO SUPERIOR (Fondo blanco de la página) */}
        {!isSubmitted && (
          <section style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.5rem 1.2rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(15,23,42,0.05)' }}>
              <i className="fa-solid fa-face-smile" style={{ color: '#0284c7' }}></i>
              <span>COLEGIO NTRA. SRA. DE NAZARETH — PURIFICACIÓN</span>
            </div>
            <div style={{ display: 'block', fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0', color: '#0f172a' }}>
              ¡Tu Opinión nos ayuda a mejorar! 😊
            </div>
            <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
              Tu opinión es muy valiosa para nosotros. Ayúdanos respondiendo estas 3 breves preguntas.
            </p>
          </section>
        )}

        {/* TARJETA CONTENEDORA AZUL MARINO INSTITUCIONAL */}
        <div style={{ background: 'radial-gradient(circle at 50% 0%, #162c4e 0%, #0b172a 70%)', border: '1px solid #1e3a63', borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: '0 20px 45px rgba(11,23,42,0.3)', color: '#ffffff' }}>
          
          {/* STEPPER DE 3 PASOS */}
          {!isSubmitted && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '22px', left: '4rem', right: '4rem', height: '3px', background: '#192d4b', zIndex: 1 }}>
                <div style={{ height: '100%', width: `${((currentStep - 1) / 2) * 100}%`, background: 'linear-gradient(90deg, #38bdf8, #10b981)', transition: 'width 0.4s ease' }}></div>
              </div>
              {['1. ¿Qué buscas?', '2. La Atención', '3. Tu Opinión'].map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = currentStep === stepNum;
                const isDone = currentStep > stepNum;
                return (
                  <div key={label} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: isDone ? '#10b981' : isActive ? '#ffffff' : '#192d4b', color: isDone ? '#fff' : isActive ? '#0b172a' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {isDone ? <i className="fa-solid fa-check"></i> : stepNum}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: isActive ? '#fff' : '#64748b', fontWeight: isActive ? 700 : 500 }}>{label}</span>
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
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', textAlign: 'center', color: '#ffffff' }}>¿Para qué grado o nivel buscas información? 🎒</h2>
                  <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '1.5rem' }}>Toca una de las opciones:</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    {[
                      { val: 'Preescolar', icon: '🎨', title: 'Preescolar', desc: 'Párvulos a Transición' },
                      { val: 'Primaria', icon: '📚', title: 'Primaria', desc: 'Primero a Quinto' },
                      { val: 'Bachillerato', icon: '🧪', title: 'Bachillerato', desc: 'Sexto a Undécimo' },
                      { val: 'Varios Niveles', icon: '👨‍👩‍👧‍👦', title: 'Varios Niveles', desc: 'Más de un hijo/a' }
                    ].map(item => {
                      const selected = formData.nivelInteres === item.val;
                      return (
                        <button type="button" key={item.val} onClick={() => handleInputChange('nivelInteres', item.val)} style={{ background: selected ? 'rgba(16, 185, 129, 0.15)' : '#192d4b', border: selected ? '2px solid #10b981' : '1px solid #27436b', borderRadius: '14px', padding: '1.1rem 0.9rem', textAlign: 'center', cursor: 'pointer', color: '#ffffff' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{item.icon}</div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#ffffff' }}>Tu Celular o WhatsApp *</label>
                      <input type="tel" value={formData.telefono} onChange={e => handleInputChange('telefono', e.target.value)} placeholder="Ej. 300 123 4567 (10 dígitos)" style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: errors.telefono ? '1px solid #ec4899' : '1px solid #27436b', borderRadius: '12px', color: '#ffffff' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#ffffff' }}>Tu Nombre (Opcional)</label>
                      <input type="text" value={formData.nombreCompleto} onChange={e => handleInputChange('nombreCompleto', e.target.value)} placeholder="Escribe tu nombre si deseas" style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: '1px solid #27436b', borderRadius: '12px', color: '#ffffff' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button type="button" onClick={nextStep} style={{ background: '#ffffff', color: '#0b172a', border: 'none', padding: '0.85rem 2rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Siguiente <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2 */}
              {currentStep === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', textAlign: 'center', color: '#ffffff' }}>¿Cómo te pareció la atención? 💬</h2>
                  <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '1.5rem' }}>Toca la carita que mejor represente cómo te sentiste hoy:</p>

                  <div style={{ background: '#192d4b', border: errors.claridadInfo ? '1px solid #ec4899' : '1px solid #27436b', padding: '1.2rem', borderRadius: '14px', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem', color: '#ffffff' }}>1. ¿Qué tan clara fue la información de precios, matrículas y documentos? *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                      {[
                        { val: 'Excelente', face: '😄', text: 'Súper clara' },
                        { val: 'Buena', face: '🙂', text: 'Buena' },
                        { val: 'Regular', face: '😐', text: 'Regular' },
                        { val: 'Poco clara', face: '🙁', text: 'Poco clara' }
                      ].map(em => (
                        <button type="button" key={em.val} onClick={() => handleInputChange('claridadInfo', em.val)} style={{ background: formData.claridadInfo === em.val ? 'rgba(16, 185, 129, 0.2)' : '#0f203c', border: formData.claridadInfo === em.val ? '2px solid #10b981' : '1px solid #27436b', borderRadius: '12px', padding: '0.8rem 0.4rem', cursor: 'pointer', color: '#ffffff' }}>
                          <div style={{ fontSize: '2rem' }}>{em.face}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{em.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#192d4b', border: errors.amabilidad ? '1px solid #ec4899' : '1px solid #27436b', padding: '1.2rem', borderRadius: '14px', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem', color: '#ffffff' }}>2. ¿Cómo te trató la persona que te atendió? *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                      {[
                        { val: 'Muy amable', face: '❤️', text: 'Muy amable' },
                        { val: 'Bien', face: '🙂', text: 'Bien' },
                        { val: 'Normal', face: '😐', text: 'Normal' },
                        { val: 'Frío', face: '🙁', text: 'Distante' }
                      ].map(em => (
                        <button type="button" key={em.val} onClick={() => handleInputChange('amabilidad', em.val)} style={{ background: formData.amabilidad === em.val ? 'rgba(16, 185, 129, 0.2)' : '#0f203c', border: formData.amabilidad === em.val ? '2px solid #10b981' : '1px solid #27436b', borderRadius: '12px', padding: '0.8rem 0.4rem', cursor: 'pointer', color: '#ffffff' }}>
                          <div style={{ fontSize: '2rem' }}>{em.face}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{em.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#192d4b', border: '1px solid #27436b', padding: '1.25rem', borderRadius: '14px', marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#ffffff' }}>👍 ¿Qué fue lo que más te gustó de tu consulta? *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {[
                        'Las instalaciones y salones', 'La educación en valores',
                        'La atención tan amable', 'La calidad de los profesores',
                        'Los precios y facilidades', 'Otras'
                      ].map(asp => {
                        const active = formData.aspectosSeleccionados.includes(asp);
                        return (
                          <button type="button" key={asp} onClick={() => handleTagToggle(asp)} style={{ padding: '0.55rem 1rem', borderRadius: '9999px', background: active ? 'rgba(16,185,129,0.2)' : '#0f203c', color: active ? '#ffffff' : '#cbd5e1', border: active ? '1px solid #10b981' : '1px solid #27436b', cursor: 'pointer', fontWeight: 600 }}>
                            {active ? '✓ ' : '+ '}{asp === 'Otras' ? '✨ Otras...' : asp}
                          </button>
                        );
                      })}
                    </div>

                    {formData.aspectosSeleccionados.includes('Otras') && (
                      <div style={{ marginTop: '0.9rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>¿Qué otra cosa te gustó? Escríbela aquí:</label>
                        <input type="text" value={formData.otrasTexto || ''} onChange={e => handleInputChange('otrasTexto', e.target.value)} placeholder="Escribe aquí tu respuesta..." style={{ width: '100%', padding: '0.75rem', background: '#0f203c', border: '1px solid #27436b', borderRadius: '10px', color: '#ffffff' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button type="button" onClick={prevStep} style={{ background: 'transparent', color: '#cbd5e1', border: 'none', cursor: 'pointer' }}>Anterior</button>
                    <button type="button" onClick={nextStep} style={{ background: '#ffffff', color: '#0b172a', border: 'none', padding: '0.85rem 2rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente</button>
                  </div>
                </div>
              )}

              {/* PASO 3 */}
              {currentStep === 3 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', textAlign: 'center', color: '#ffffff' }}>Tu opinión final 🌟</h2>
                  <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '1.5rem' }}>Tu opinión es fundamental para ayudarnos a mejorar cada día:</p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.92rem', lineHeight: '1.45', marginBottom: '0.6rem', color: '#ffffff', fontWeight: 600 }}>
                      <i className="fa-regular fa-comment-dots"></i> De acuerdo con la información que te brindamos y la experiencia con nosotros, por favor enúncianos las oportunidades de mejora.
                    </label>
                    <textarea rows="4" value={formData.comentariosSugerencias} onChange={e => handleInputChange('comentariosSugerencias', e.target.value)} placeholder="Escribe aquí tus sugerencias u oportunidades de mejora..." style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: '1px solid #27436b', borderRadius: '12px', color: '#ffffff' }}></textarea>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#cbd5e1' }}>
                      <input type="checkbox" checked={formData.aceptaPoliticas} onChange={e => handleInputChange('aceptaPoliticas', e.target.checked)} />
                      <span>Autorizo el uso de mis datos únicamente para recibir información sobre admisiones. *</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button type="button" onClick={prevStep} style={{ background: 'transparent', color: '#cbd5e1', border: 'none', cursor: 'pointer' }}>Anterior</button>
                    <button type="submit" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', padding: '0.85rem 2.5rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar Encuesta</button>
                  </div>
                </div>
              )}

            </form>
          ) : (
            /* PANTALLA DE ÉXITO */
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981, #38bdf8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>
                💙
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ffffff' }}>¡Muchas Gracias por tu Visita!</h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Tus respuestas nos ayudan a atender siempre con alegría y cariño a cada familia que se acerca al Colegio Nazareth.
              </p>
              <button type="button" onClick={handleReset} style={{ background: '#ffffff', color: '#0b172a', border: 'none', padding: '0.85rem 2rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>
                Responder otra vez
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
