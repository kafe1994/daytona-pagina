# Daytona Motos - Landing Page

> Sitio web estático moderno para la concesionaria Daytona Motos en Pilar, Córdoba

## 🏍️ Descripción

Landing page profesional y responsive para **Daytona Motos**, concesionaria con más de 5 años de trayectoria en Pilar, Córdoba. El sitio presenta un catálogo completo de motocicletas, información de financiación y contacto directo vía WhatsApp.

### ✨ Características principales

- **Responsive design** - Optimizado para móviles, tablets y desktop
- **Modo nocturno** - Toggle entre tema claro y oscuro
- **Catálogo dinámico** - Filtrado por marca y cilindrada
- **Búsqueda inteligente** - Buscar por marca y modelo
- **Integración WhatsApp** - Contacto directo con Franco y Francisco
- **SEO optimizado** - Meta tags, structured data y performance
- **Accesibilidad** - ARIA labels, contraste y navegación por teclado

## 🚀 Tecnologías utilizadas

- **HTML5** - Semántico y accesible
- **CSS3** - Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+** - Vanilla JS, módulos, async/await
- **SVG** - Iconos y logo vectorial
- **WebP** - Imágenes optimizadas

## 📁 Estructura del proyecto

```
daytona-motos/
├── index.html              # Página principal
├── README.md               # Este archivo
├── css/
│   └── styles.css          # Estilos principales
├── js/
│   └── main.js            # JavaScript principal
├── data/
│   └── motos.json         # Datos de motocicletas
├── images/                # Imágenes del slider hero
├── logo/
│   └── logo-daytona.svg   # Logo vectorial
├── motos/                 # Logos y thumbnails por marca
│   ├── honda/
│   ├── zanella/
│   ├── bajaj/
│   └── ...
└── recursos/              # Assets adicionales
    ├── estructuras-backround-css.css
    └── iconos/
```

## 🎨 Paleta de colores

```css
--red-primary: #c62828;    /* Rojo principal */
--red-dark: #8e1a1a;       /* Rojo oscuro */
--red-light: #ff6659;      /* Rojo claro */
--white: #ffffff;          /* Blanco */
--black: #0b0b0b;          /* Negro */
```

## 🔧 Instalación local

### Requisitos previos
- Navegador web moderno
- Servidor HTTP local (opcional)

### Pasos de instalación

1. **Clonar o descargar el proyecto**
```bash
# Si tienes Git
git clone <repository-url>
cd daytona-motos

# O simplemente descomprimir el ZIP
```

2. **Abrir en navegador**
```bash
# Opción 1: Abrir directamente
open index.html

# Opción 2: Servidor local con Python
python -m http.server 8000
# Luego ir a http://localhost:8000

# Opción 3: Servidor local con Node.js
npx serve .
# Luego ir a http://localhost:3000
```

## ☁️ Despliegue en Cloudflare Pages

### Método 1: Dashboard Web

1. **Ir a Cloudflare Pages**
   - Visita [pages.cloudflare.com](https://pages.cloudflare.com)
   - Inicia sesión en tu cuenta de Cloudflare

2. **Crear nuevo proyecto**
   - Click en "Create a project"
   - Selecciona "Upload assets"

3. **Subir archivos**
   - Arrastra toda la carpeta `daytona-motos/` 
   - O selecciona todos los archivos del proyecto
   - Asegúrate de mantener la estructura de carpetas

4. **Configurar dominio**
   - Elige un subdominio gratuito: `tu-proyecto.pages.dev`
   - O configura un dominio personalizado

5. **Deploy**
   - Click en "Save and Deploy"
   - En pocos minutos estará disponible online

### Método 2: Wrangler CLI

```bash
# Instalar Wrangler
npm install -g wrangler

# Autenticarse
wrangler login

# Crear y desplegar
wrangler pages project create daytona-motos
wrangler pages publish . --project-name=daytona-motos
```

### Configuración recomendada

**Build settings:**
- Build command: `(none)` - Es sitio estático
- Build output directory: `/` 
- Root directory: `/`

**Environment variables:** No necesarias para la versión estática

## 🔄 Migración a Cloudflare Workers (Futuro)

El proyecto está preparado para evolucionar a una aplicación dinámica con Cloudflare Workers:

### Funcionalidades que se pueden añadir:

1. **API dinámico**
   - Catálogo desde base de datos
   - Sistema de inventario en tiempo real
   - Gestión de leads y consultas

2. **Formularios avanzados**
   - Captura de leads en D1 (SQLite)
   - Notificaciones automáticas
   - Sistema CRM básico

3. **Analytics y tracking**
   - Métricas de visitas
   - Conversiones de WhatsApp
   - Reportes automáticos

### Estructura para Workers:

```
src/
├── worker.js              # Entry point del Worker
├── handlers/
│   ├── api.js            # API routes
│   ├── static.js         # Servir archivos estáticos
│   └── forms.js          # Procesamiento de formularios
├── database/
│   ├── schema.sql        # Esquema D1
│   └── queries.js        # Consultas SQL
└── utils/
    ├── whatsapp.js       # Integración WhatsApp Business
    └── email.js          # Notificaciones email
```

## 🎯 SEO y Performance

### Optimizaciones incluidas:

- ✅ **Meta tags** completos
- ✅ **Structured data** (JSON-LD)
- ✅ **Open Graph** para redes sociales
- ✅ **Lazy loading** de imágenes
- ✅ **WebP** con fallback JPG
- ✅ **Minificación** CSS/JS
- ✅ **Critical CSS** inline
- ✅ **Preconnect** a Google Fonts

### Lighthouse Score esperado:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 📱 Compatibilidad

### Navegadores soportados:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- iOS Safari 13+
- Android Chrome 80+

### Responsive breakpoints:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🔐 Seguridad

- CSP headers configurados
- No dependencias externas críticas
- Validación de formularios client-side
- Sanitización de datos de entrada

## 📊 Monitoreo y Analytics

### Métricas a trackear:
- Visitas por página
- Clicks en WhatsApp (Franco/Francisco)
- Interacciones con catálogo
- Conversiones de búsqueda
- Tiempo en página

### Herramientas recomendadas:
- Google Analytics 4
- Cloudflare Web Analytics
- Google Search Console
- PageSpeed Insights

## 🛠️ Mantenimiento

### Tareas regulares:
- Actualizar catálogo en `data/motos.json`
- Optimizar nuevas imágenes
- Revisar enlaces rotos
- Actualizar información de contacto
- Monitorear métricas de rendimiento

### Actualizaciones de contenido:

**Agregar nueva moto:**
1. Subir imágenes a `/images/`
2. Actualizar `data/motos.json`
3. Redeploy en Cloudflare Pages

**Cambiar información de contacto:**
1. Actualizar números en HTML
2. Actualizar enlaces WhatsApp
3. Actualizar structured data

## 🚨 Troubleshooting

### Problemas comunes:

**Las imágenes no cargan:**
- Verificar rutas relativas
- Comprobar nombres de archivo
- Validar formato WebP compatible

**JavaScript no funciona:**
- Verificar consola del navegador
- Comprobar que `data/motos.json` sea válido
- Validar sintaxis ES6

**Problemas de responsive:**
- Verificar meta viewport
- Comprobar CSS media queries
- Validar flexbox/grid support

## 🤝 Contribución

### Para desarrolladores:

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Convenciones de código:
- 2 espacios para indentación
- Comentarios en español
- Classes CSS en kebab-case
- Variables JS en camelCase

## 📞 Soporte

### Contacto técnico:
- **MiniMax Agent** - Desarrollo y soporte técnico

### Contacto comercial:
- **Franco Giraudo** (Dueño) - +54 9 3572 59-2411
- **Francisco Salgado** (Socio) - +54 9 3572 50-1539
- **Instagram**: [@daytona.motocicletas](https://instagram.com/daytona.motocicletas)

---

## 📄 Licencia

© 2025 Daytona Motos. Todos los derechos reservados.

**Desarrollado con ❤️ para Daytona Motos**