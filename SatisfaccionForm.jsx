'use client';

/**
 * COMPONENTE REACT / NEXT.JS - ENCUESTA DE SATISFACCIÓN Y ATENCIÓN AL USUARIO
 * Colegio Nuestra Señora de Nazareth - Purificación
 */

import React, { useState } from 'react';

export default function SatisfaccionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    tipoUsuario: '',
    canalAtencion: '',
    areaAtendida: '',
    telefono: '',
    correo: '',
    agilidad: '',
    amabilidad: '',
    claridad: '',
    efectividad: '',
    instalaciones: '',
    solicitudResuelta: '',
    aspectosSeleccionados: [],
    recomendariaServicio: '',
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
      if (!formData.tipoUsuario) { errs.tipoUsuario = true; valid = false; }
      if (!formData.canalAtencion) { errs.canalAtencion = true; valid = false; }
      if (!formData.areaAtendida) { errs.areaAtendida = true; valid = false; }
      const telDigits = formData.telefono.replace(/\D/g, '');
      if (!formData.telefono || telDigits.length < 10) { errs.telefono = true; valid = false; }
    }

    if (currentStep === 2) {
      ['agilidad', 'amabilidad', 'claridad', 'efectividad', 'instalaciones'].forEach(r => {
        if (!formData[r]) { errs[r] = true; valid = false; }
      });
    }

    if (currentStep === 3) {
      if (!formData.solicitudResuelta) { errs.solicitudResuelta = true; valid = false; }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    let valid = true;

    if (!formData.recomendariaServicio) { errs.recomendariaServicio = true; valid = false; }
    if (!formData.aceptaPoliticas) { errs.aceptaPoliticas = true; valid = false; }

    if (!valid) {
      setErrors(errs);
      return;
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({
      nombreCompleto: '', tipoUsuario: '', canalAtencion: '', areaAtendida: '',
      telefono: '', correo: '', agilidad: '', amabilidad: '', claridad: '',
      efectividad: '', instalaciones: '', solicitudResuelta: '', aspectosSeleccionados: [],
      recomendariaServicio: '', comentariosSugerencias: '', aceptaPoliticas: false
    });
    setErrors({});
  };

  return (
    <div style={{ background: 'radial-gradient(circle at 50% 0%, #162c4e 0%, #0b172a 70%)', color: '#ffffff', minHeight: '100vh', padding: '2rem 1.25rem' }}>
      <main style={{ maxWidth: '920px', margin: '0 auto' }}>
        
        {/* HERO BANNER (Se oculta al enviar) */}
        {!isSubmitted && (
          <section style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(15, 32, 60, 0.8)', border: '1px solid #1e3a63', padding: '0.5rem 1.2rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '1.2rem' }}>
              <i className="fa-solid fa-headset" style={{ color: '#38bdf8' }}></i>
              <span>COLEGIO NTRA. SRA. DE NAZARETH — PURIFICACIÓN</span>
            </div>
            <div style={{ display: 'block', fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0', color: '#ffffff' }}>
              ¡Tu Opinión nos Ayuda a Mejorar Cada Día!
            </div>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
              Queremos brindarte siempre la mejor atención. Cuéntanos cómo fue tu experiencia reciente al comunicarte o visitarnos.
            </p>
          </section>
        )}

        {/* TARJETA CONTENEDORA */}
        <div style={{ background: '#12243e', border: '1px solid #1e3a63', borderRadius: '18px', padding: '2.5rem 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          
          {/* STEPPER */}
          {!isSubmitted && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '22px', left: '3.5rem', right: '3.5rem', height: '3px', background: '#192d4b', zIndex: 1 }}>
                <div style={{ height: '100%', width: `${((currentStep - 1) / 3) * 100}%`, background: 'linear-gradient(90deg, #38bdf8, #10b981)', transition: 'width 0.4s ease' }}></div>
              </div>
              {['Datos & Canal', 'Evaluación', 'Experiencia', 'Sugerencias'].map((label, idx) => {
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
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Cuéntanos sobre tu contacto 💬</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Nombre y Apellidos (Opcional - Anonimato)</label>
                      <input type="text" value={formData.nombreCompleto} onChange={e => handleInputChange('nombreCompleto', e.target.value)} placeholder="Ej. María Gómez (Opcional)" style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: '1px solid #27436b', borderRadius: '12px', color: '#fff' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Tipo de Usuario *</label>
                      <select value={formData.tipoUsuario} onChange={e => handleInputChange('tipoUsuario', e.target.value)} style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: errors.tipoUsuario ? '1px solid #ec4899' : '1px solid #27436b', borderRadius: '12px', color: '#fff' }}>
                        <option value="">Selecciona tu perfil...</option>
                        <option value="Padre / Acudiente">Padre / Acudiente</option>
                        <option value="Aspirante / Familia Nueva">Aspirante / Familia Nueva</option>
                        <option value="Estudiante Actual">Estudiante Actual</option>
                        <option value="Egresado">Egresado(a)</option>
                        <option value="Proveedor / Aliado">Proveedor / Aliado</option>
                        <option value="Comunidad General">Comunidad General</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Canal de Atención *</label>
                      <select value={formData.canalAtencion} onChange={e => handleInputChange('canalAtencion', e.target.value)} style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: errors.canalAtencion ? '1px solid #ec4899' : '1px solid #27436b', borderRadius: '12px', color: '#fff' }}>
                        <option value="">Selecciona canal...</option>
                        <option value="Presencial">🏫 Atención Presencial</option>
                        <option value="WhatsApp">🟢 Línea WhatsApp Institucional</option>
                        <option value="Llamada">📞 Llamada Telefónica</option>
                        <option value="Correo">✉️ Correo Electrónico</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Área Atendida *</label>
                      <select value={formData.areaAtendida} onChange={e => handleInputChange('areaAtendida', e.target.value)} style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: errors.areaAtendida ? '1px solid #ec4899' : '1px solid #27436b', borderRadius: '12px', color: '#fff' }}>
                        <option value="">Selecciona área...</option>
                        <option value="Secretaría Académica">Secretaría Académica</option>
                        <option value="Tesorería y Pagaduría">Tesorería / Pagaduría</option>
                        <option value="Admisiones y Matrículas">Admisiones y Matrículas</option>
                        <option value="Rectoría y Coordinación">Rectoría / Coordinación</option>
                        <option value="Recepción General">Recepción General</option>
                        <option value="Psicorientación / Enfermería">Psicorientación</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Teléfono (Mín 10 dígitos) *</label>
                      <input type="tel" value={formData.telefono} onChange={e => handleInputChange('telefono', e.target.value)} placeholder="Ej. 300 123 4567" style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: errors.telefono ? '1px solid #ec4899' : '1px solid #27436b', borderRadius: '12px', color: '#fff' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Correo Electrónico (Opcional)</label>
                      <input type="email" value={formData.correo} onChange={e => handleInputChange('correo', e.target.value)} placeholder="correo@ejemplo.com" style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: '1px solid #27436b', borderRadius: '12px', color: '#fff' }} />
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
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Califica nuestro servicio ⭐</h2>
                  <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Evalúa de 1 a 5 los aspectos clave de la atención recibida:</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      { key: 'agilidad', label: 'Agilidad y Tiempo de Respuesta' },
                      { key: 'amabilidad', label: 'Amabilidad, Respeto y Cordialidad' },
                      { key: 'claridad', label: 'Claridad de la Información' },
                      { key: 'efectividad', label: 'Solución o Efectividad en el Trámite' },
                      { key: 'instalaciones', label: 'Comodidad / Disponibilidad del Canal' }
                    ].map(item => (
                      <div key={item.key} style={{ background: '#192d4b', padding: '1rem', borderRadius: '12px', border: errors[item.key] ? '1px solid #ec4899' : '1px solid #27436b' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.label}</div>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button type="button" key={star} onClick={() => handleInputChange(item.key, star)} style={{ flex: 1, padding: '0.4rem', background: formData[item.key] === star ? '#38bdf8' : 'rgba(255,255,255,0.05)', color: formData[item.key] === star ? '#0b172a' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                              {star}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
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
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tu percepción general 🤝</h2>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>¿Tu solicitud o consulta fue resuelta satisfactoriamente? *</label>
                    <div style={{ display: 'flex', gap: '1rem', maxWidth: '440px', margin: '0 auto' }}>
                      {['Sí, totalmente', 'Parcialmente', 'No fue resuelta'].map(v => (
                        <button type="button" key={v} onClick={() => handleInputChange('solicitudResuelta', v)} style={{ flex: 1, padding: '0.75rem', background: formData.solicitudResuelta === v ? '#fff' : '#192d4b', color: formData.solicitudResuelta === v ? '#0b172a' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>¿Qué aspectos positivos destacarías? *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {[
                        'Excelente trato y amabilidad', 'Rapidez en la respuesta',
                        'Información clara y precisa', 'Empatía y disposición',
                        'Instalaciones cómodas y limpias', 'Facilidad por WhatsApp',
                        'Solución efectiva'
                      ].map(asp => {
                        const active = formData.aspectosSeleccionados.includes(asp);
                        return (
                          <button type="button" key={asp} onClick={() => handleTagToggle(asp)} style={{ padding: '0.45rem 0.9rem', borderRadius: '9999px', background: active ? 'rgba(16,185,129,0.15)' : '#192d4b', color: active ? '#fff' : '#cbd5e1', border: active ? '1px solid #10b981' : '1px solid #27436b', cursor: 'pointer', fontWeight: 600 }}>
                            {active ? '✓ ' : '+ '}{asp}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button type="button" onClick={prevStep} style={{ background: 'transparent', color: '#cbd5e1', border: 'none', cursor: 'pointer' }}>Anterior</button>
                    <button type="button" onClick={nextStep} style={{ background: '#ffffff', color: '#0b172a', border: 'none', padding: '0.85rem 2rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente</button>
                  </div>
                </div>
              )}

              {/* PASO 4 */}
              {currentStep === 4 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sugerencias para mejorar 🚀</h2>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>¿Recomendarías nuestros canales de atención? *</label>
                    <div style={{ display: 'flex', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                      {['Sí, totalmente', 'Tal vez', 'No'].map(v => (
                        <button type="button" key={v} onClick={() => handleInputChange('recomendariaServicio', v)} style={{ flex: 1, padding: '0.75rem', background: formData.recomendariaServicio === v ? '#fff' : '#192d4b', color: formData.recomendariaServicio === v ? '#0b172a' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem' }}>Comentarios o sugerencias adicionales (Opcional)</label>
                    <textarea rows="3" value={formData.comentariosSugerencias} onChange={e => handleInputChange('comentariosSugerencias', e.target.value)} placeholder="Escribe tus sugerencias para mejorar el servicio..." style={{ width: '100%', padding: '0.85rem', background: '#192d4b', border: '1px solid #27436b', borderRadius: '12px', color: '#fff' }}></textarea>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.aceptaPoliticas} onChange={e => handleInputChange('aceptaPoliticas', e.target.checked)} />
                      <span>Acepto la política de tratamiento de datos personales *</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button type="button" onClick={prevStep} style={{ background: 'transparent', color: '#cbd5e1', border: 'none', cursor: 'pointer' }}>Anterior</button>
                    <button type="submit" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', padding: '0.85rem 2.5rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar Evaluación</button>
                  </div>
                </div>
              )}

            </form>
          ) : (
            /* PANTALLA DE ÉXITO DE AGRADECIMIENTO */
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981, #38bdf8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>
                💙
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Gracias por ayudarnos a mejorar!</h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Tu evaluación ha sido registrada satisfactoriamente. Trabajamos para brindarte la atención excelente que mereces.
              </p>
              <button type="button" onClick={handleReset} style={{ background: '#ffffff', color: '#0b172a', border: 'none', padding: '0.85rem 2rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>
                Registrar otra evaluación
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
