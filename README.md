# Encuesta de Satisfacción y Admisiones — Colegio Ntra. Sra. de Nazareth 🏫

Formulario web interactivo, responsivo e intuitivo para capturar la evaluación de atención y recabar opiniones de prospectos y familias del colegio.

## 📂 Estructura Organizada del Proyecto

```text
satisfaccion-form/
├── public/                     # Recursos públicos estáticos (Imágenes e Íconos)
│   ├── escudo-nazareth.png
│   ├── icon-preescolar.png
│   ├── icon-primaria.png
│   ├── icon-secundaria.png
│   └── icon-otros.png
├── src/                        # Código fuente principal
│   ├── components/
│   │   └── SatisfaccionForm.jsx # Componente React espejo
│   ├── main.js                 # Lógica interactiva del formulario y envío
│   └── style.css               # Sistema de estilos institucionales y responsivos
├── index.html                  # Plantilla HTML principal
├── package.json                # Dependencias del proyecto
└── README.md                   # Documentación oficial
```

## 🚀 Ejecución en Desarrollo Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor local:
   ```bash
   npm run dev
   ```

3. Abrir la dirección mostrada en pantalla (ejemplo: `http://localhost:5173` o `http://localhost:5177`).

## 📊 Integración con Google Sheets

Para guardar las respuestas en tiempo real en una hoja de Google Sheets:
1. Abrir la hoja de cálculo en Google Sheets.
2. Ir a **Extensiones** -> **Apps Script**.
3. Pegar el código de sincronización `doPost(e)`.
4. Implementar como **Aplicación Web** con acceso para **Cualquier persona**.
5. Copiar la URL generada e incluirla en la constante `GOOGLE_SCRIPT_URL` de `src/main.js`.
