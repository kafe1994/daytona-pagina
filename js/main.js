/**
 * DAYTONA MOTOS - MAIN.JS
 * Funcionalidades interactivas de la landing page
 */

class DaytonaMotos {
  constructor() {
    this.motosData = {};
    this.currentSlide = 0;
    this.slideInterval = null;
    this.searchResults = [];
    
    this.init();
  }

  async init() {
    await this.loadMotosData();
    this.setupEventListeners();
    this.initializeSlider();
    this.renderBrands();
    this.initializeTheme(); // Después de renderBrands para que los logos existan en el DOM
    this.setupSearch();
    this.setupImageZoom();
    this.addZoomToImages();
  }

  // ============================================================
  // CARGAR DATOS DE MOTOS
  // ============================================================
  async loadMotosData() {
    try {
      const response = await fetch('data/motos.json');
      this.motosData = await response.json();
      console.log('Datos de motos cargados:', Object.keys(this.motosData).length, 'marcas');
    } catch (error) {
      console.error('Error cargando datos de motos:', error);
      // Datos de fallback
      this.motosData = this.getFallbackData();
    }
  }

  getFallbackData() {
    return {
      honda: {
        name: "Honda",
        logo: "motos/honda/honda-seeklogo.png",
        models: [
          {
            model: "CG 125",
            cilindrada: 125,
            colors: ["Rojo", "Negro", "Blanco"],
            images: ["images/honda_cg125_1.jpg"]
          }
        ]
      },
      zanella: {
        name: "Zanella", 
        logo: "motos/zanella/zanella-seeklogo.png",
        models: [
          {
            model: "ZB 110",
            cilindrada: 110,
            colors: ["Azul", "Negro"],
            images: ["images/zanella_zb110_1.jpg"]
          }
        ]
      }
    };
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================
  setupEventListeners() {
    // Toggle búsqueda
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle && searchBar) {
      searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
          setTimeout(() => searchInput?.focus(), 300);
        }
      });
    }

    // Cerrar búsqueda con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchBar?.classList.remove('active');
        this.closeSidePanel();
        this.closeCTAModal();
      }
    });

    // Navegación del slider
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');

    prevBtn?.addEventListener('click', () => this.previousSlide());
    nextBtn?.addEventListener('click', () => this.nextSlide());

    // Toggle tema
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => this.toggleTheme());

    // Panel lateral
    const sidePanelOverlay = document.querySelector('.side-panel-overlay');
    const sidePanelClose = document.querySelector('.side-panel-close');

    sidePanelOverlay?.addEventListener('click', () => this.closeSidePanel());
    sidePanelClose?.addEventListener('click', () => this.closeSidePanel());

    // Modal CTA
    const ctaModalOverlay = document.querySelector('.cta-modal');
    const ctaModalClose = document.querySelector('.cta-modal-close');

    ctaModalOverlay?.addEventListener('click', (e) => {
      if (e.target === ctaModalOverlay) this.closeCTAModal();
    });
    ctaModalClose?.addEventListener('click', () => this.closeCTAModal());

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Mejorar compatibilidad de enlaces externos SOLO cuando sea necesario
    document.querySelectorAll('a[target="_blank"]').forEach(externalLink => {
      externalLink.addEventListener('click', (e) => {
        const url = externalLink.href;
        const isExternal = url.startsWith('http://') || url.startsWith('https://');
        
        // Solo aplicar lógica especial en casos muy específicos donde sepamos que hay problemas
        if (isExternal && this.isMobileDevice() && this.hasPopupBlocker()) {
          e.preventDefault();
          
          // En caso de bloqueador de popups muy restrictivo
          if (confirm('¿Deseas abrir este enlace?')) {
            window.location.href = url;
          }
        }
        // Para la mayoría de casos, dejar que el enlace funcione normalmente
      });
    });
  }

  // Detectar si es dispositivo móvil
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Detectar si hay bloqueador de popups muy restrictivo
  hasPopupBlocker() {
    // Solo para casos extremos donde sabemos que window.open no funciona
    return false; // Simplificado para evitar problemas
  }

  // ============================================================
  // SLIDER HERO
  // ============================================================
  initializeSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    // Mostrar primera slide
    slides[0]?.classList.add('active');

    // Auto-play
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);

    // Pausar en hover
    const heroSection = document.querySelector('.hero');
    heroSection?.addEventListener('mouseenter', () => {
      clearInterval(this.slideInterval);
    });

    heroSection?.addEventListener('mouseleave', () => {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    });

    // Soporte para swipe en móvil
    this.setupSwipeGestures(heroSection);
  }

  nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    slides[this.currentSlide]?.classList.remove('active');
    this.currentSlide = (this.currentSlide + 1) % slides.length;
    slides[this.currentSlide]?.classList.add('active');
  }

  previousSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    slides[this.currentSlide]?.classList.remove('active');
    this.currentSlide = this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1;
    slides[this.currentSlide]?.classList.add('active');
  }

  setupSwipeGestures(element) {
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    element.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.previousSlide();
        } else {
          this.nextSlide();
        }
      }
    });
  }

  // ============================================================
  // TEMA OSCURO/CLARO
  // ============================================================
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
    this.updateBrandLogos(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
    this.updateBrandLogos(newTheme);
  }

  updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const icon = theme === 'dark' 
      ? '<svg viewBox="0 0 24 24"><path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z"></path></svg>';
    
    themeToggle.innerHTML = icon;
  }

  updateBrandLogos(theme) {
    // Marcas que necesitan logos especiales para modo oscuro
    const darkModeBrands = {
      'yamaha': 'yamaha-logo-dark.jpg',
      'siam': 'siam-logo-dark.png', 
      'voge': 'voge-logo-dark.png'
    };

    // Obtener todos los logos de marcas
    const brandLogos = document.querySelectorAll('.brand-logo');
    
    brandLogos.forEach(logo => {
      const brandCard = logo.closest('.brand-card');
      if (!brandCard) return;
      
      const brandKey = brandCard.getAttribute('data-brand');
      if (!darkModeBrands[brandKey]) return;
      
      const img = logo;
      
      if (theme === 'dark') {
        // Cambiar a logo de modo oscuro
        if (!img.getAttribute('data-original-logo')) {
          img.setAttribute('data-original-logo', img.src);
        }
        
        const logoPath = img.getAttribute('data-original-logo').replace(/\/[^\/]+\.png$|\/[^\/]+\.jpg$/, '');
        img.src = `motos/${brandKey}/${darkModeBrands[brandKey]}`;
      } else {
        // Restaurar logo original
        const originalLogo = img.getAttribute('data-original-logo');
        if (originalLogo) {
          img.src = originalLogo;
        }
      }
    });
  }

  // ============================================================
  // RENDERIZAR MARCAS
  // ============================================================
  renderBrands() {
    const brandsGrid = document.querySelector('.brands-grid');
    if (!brandsGrid) return;

    const brandsHTML = Object.entries(this.motosData).map(([key, brand]) => `
      <div class="brand-card" data-brand="${key}">
        <img src="${brand.logo}" alt="${brand.name}" class="brand-logo" loading="lazy" onerror="this.style.display='none'">
        <h3 class="brand-name">${brand.name}</h3>
      </div>
    `).join('');

    brandsGrid.innerHTML = brandsHTML;

    // Event listeners para las tarjetas de marca
    brandsGrid.querySelectorAll('.brand-card').forEach(card => {
      card.addEventListener('click', () => {
        const brandKey = card.dataset.brand;
        this.openBrandPanel(brandKey);
      });
    });
  }

  // ============================================================
  // PANEL LATERAL DE MARCA
  // ============================================================
  openBrandPanel(brandKey) {
    const brand = this.motosData[brandKey];
    if (!brand) return;

    const sidePanel = document.querySelector('.side-panel');
    const sidePanelOverlay = document.querySelector('.side-panel-overlay');
    const sidePanelTitle = document.querySelector('.side-panel-title');
    const sidePanelContent = document.querySelector('.side-panel-content');

    if (!sidePanel || !sidePanelContent) return;

    // Actualizar título
    if (sidePanelTitle) {
      sidePanelTitle.textContent = brand.name;
    }

    // Obtener cilindradas únicas
    const cilindradas = [...new Set(brand.models.map(model => model.cilindrada))].sort((a, b) => a - b);

    // Generar contenido
    const contentHTML = `
      <div class="cilindrada-section">
        <h4>Cilindradas disponibles:</h4>
        <div class="cilindrada-grid">
          ${cilindradas.map(cc => `
            <div class="cilindrada-btn" data-cc="${cc}">${cc}cc</div>
          `).join('')}
        </div>
      </div>
      <div class="models-grid" id="models-container">
        <p class="text-muted">Selecciona una cilindrada para ver los modelos disponibles.</p>
      </div>
    `;

    sidePanelContent.innerHTML = contentHTML;

    // Event listeners para cilindradas
    sidePanelContent.querySelectorAll('.cilindrada-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Remover active de otros botones
        sidePanelContent.querySelectorAll('.cilindrada-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCC = parseInt(btn.dataset.cc);
        this.renderModelsForCilindrada(brand, selectedCC);
      });
    });

    // Mostrar panel
    sidePanel.classList.add('active');
    sidePanelOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  renderModelsForCilindrada(brand, cilindrada) {
    const modelsContainer = document.getElementById('models-container');
    if (!modelsContainer) return;

    const filteredModels = brand.models.filter(model => model.cilindrada === cilindrada);

    const modelsHTML = filteredModels.map(model => `
      <div class="model-card" data-model='${JSON.stringify(model)}' data-brand="${brand.name}">
        <img src="${model.images[0] || 'images/placeholder.jpg'}" alt="${model.model}" class="model-image" loading="lazy" onerror="this.src='images/placeholder.jpg'">
        <div class="model-info">
          <h4>${model.model}</h4>
          <p>${cilindrada}cc</p>
          <p>Colores disponibles: ${model.colors.join(', ')}</p>
          <div class="model-colors">
            ${model.colors.map(color => `
              <div class="color-swatch color-${color.toLowerCase()}" title="${color}"></div>
            `).join('')}
          </div>
          <button class="cta-btn" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--red-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
            Pedir asesoramiento
          </button>
        </div>
      </div>
    `).join('');

    modelsContainer.innerHTML = modelsHTML || '<p class="text-muted">No hay modelos disponibles para esta cilindrada.</p>';

    // Event listeners para imágenes de modelos (zoom)
    modelsContainer.querySelectorAll('.model-image').forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const modelCard = img.closest('.model-card');
        const modelData = JSON.parse(modelCard.dataset.model);
        const selectedColor = modelCard.dataset.selectedColor;
        
        // Información adicional para mostrar en el zoom
        const colorInfo = selectedColor ? `${modelData.model} - ${selectedColor}` : `${modelData.model}`;
        
        // Abrir zoom con la imagen actual
        this.openImageZoom(img.src, img.alt, colorInfo);
        
        console.log(`Zoom abierto para: ${modelData.model}`);
      });
    });

    // Event listeners para botones CTA
    modelsContainer.querySelectorAll('.cta-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modelCard = btn.closest('.model-card');
        const modelData = JSON.parse(modelCard.dataset.model);
        const brandName = modelCard.dataset.brand;
        const selectedColor = modelCard.dataset.selectedColor || null;
        this.openCTAModal(brandName, modelData, selectedColor);
      });
    });

    // Event listeners para color swatches
    modelsContainer.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remover active de otros swatches en la misma tarjeta
        const modelCard = swatch.closest('.model-card');
        const allSwatches = modelCard.querySelectorAll('.color-swatch');
        allSwatches.forEach(s => s.classList.remove('active'));
        
        // Agregar active al swatch clickeado
        swatch.classList.add('active');
        
        // Obtener el color seleccionado y cambiar la imagen
        const selectedColor = swatch.title;
        modelCard.dataset.selectedColor = selectedColor;
        
        // Obtener datos del modelo
        const modelData = JSON.parse(modelCard.dataset.model);
        
        // Encontrar el índice del color seleccionado
        const colorIndex = modelData.colors.findIndex(color => color === selectedColor);
        
        // Cambiar la imagen si existe para este color
        if (colorIndex !== -1 && modelData.images[colorIndex]) {
          const modelImage = modelCard.querySelector('.model-image');
          if (modelImage) {
            modelImage.src = modelData.images[colorIndex];
            console.log(`Cambiando imagen a: ${modelData.images[colorIndex]} para color: ${selectedColor}`);
          }
        }
        
        console.log(`Color seleccionado: ${selectedColor}`);
      });
    });
  }

  closeSidePanel() {
    const sidePanel = document.querySelector('.side-panel');
    const sidePanelOverlay = document.querySelector('.side-panel-overlay');

    sidePanel?.classList.remove('active');
    sidePanelOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ============================================================
  // BÚSQUEDA
  // ============================================================
  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      
      if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
      }

      this.performSearch(query);
    });

    // Cerrar resultados al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-input-wrapper')) {
        searchResults.style.display = 'none';
      }
    });
  }

  performSearch(query) {
    const results = [];

    Object.entries(this.motosData).forEach(([brandKey, brand]) => {
      // Buscar en nombre de marca
      if (brand.name.toLowerCase().includes(query)) {
        brand.models.forEach(model => {
          results.push({
            type: 'brand',
            brand: brand.name,
            brandKey,
            model: model.model,
            cilindrada: model.cilindrada,
            image: model.images[0] || 'images/placeholder.jpg',
            colors: model.colors
          });
        });
      } else {
        // Buscar en modelos
        brand.models.forEach(model => {
          if (model.model.toLowerCase().includes(query)) {
            results.push({
              type: 'model',
              brand: brand.name,
              brandKey,
              model: model.model,
              cilindrada: model.cilindrada,
              image: model.images[0] || 'images/placeholder.jpg',
              colors: model.colors
            });
          }
        });
      }
    });

    this.displaySearchResults(results.slice(0, 8)); // Limitar a 8 resultados
  }

  displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item">No se encontraron resultados</div>';
      searchResults.style.display = 'block';
      return;
    }

    const resultsHTML = results.map(result => `
      <div class="search-result-item" data-brand-key="${result.brandKey}" data-model='${JSON.stringify(result)}'>
        <img src="${result.image}" alt="${result.model}" class="search-result-image" loading="lazy" onerror="this.src='images/placeholder.jpg'">
        <div class="search-result-info">
          <h4>${result.brand} ${result.model}</h4>
          <p>${result.cilindrada}cc • ${result.colors.join(', ')}</p>
        </div>
      </div>
    `).join('');

    searchResults.innerHTML = resultsHTML;
    searchResults.style.display = 'block';

    // Event listeners para resultados de búsqueda
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const brandKey = item.dataset.brandKey;
        const modelData = JSON.parse(item.dataset.model);
        
        // Cerrar búsqueda
        document.querySelector('.search-bar')?.classList.remove('active');
        
        // Abrir panel de marca y seleccionar modelo
        this.openBrandPanel(brandKey);
        
        // Pequeño delay para permitir que se renderice el panel
        setTimeout(() => {
          this.selectModelInPanel(modelData);
        }, 300);
      });
    });
  }

  selectModelInPanel(modelData) {
    // Buscar y activar la cilindrada correspondiente
    const cilindradaBtn = document.querySelector(`[data-cc="${modelData.cilindrada}"]`);
    if (cilindradaBtn) {
      cilindradaBtn.click();
    }
  }

  // ============================================================
  // MODAL CTA ASESORAMIENTO
  // ============================================================
  openCTAModal(brandName, modelData, selectedColor = null) {
    const modal = document.querySelector('.cta-modal');
    if (!modal) return;

    // Actualizar información del modelo en el modal
    const modelInfo = modal.querySelector('.model-info');
    if (modelInfo) {
      modelInfo.innerHTML = `
        <h3>${brandName} ${modelData.model}</h3>
        <p>Cilindrada: ${modelData.cilindrada}cc</p>
      `;
    }

    // Actualizar select de colores
    const colorSelect = modal.querySelector('#color-select');
    if (colorSelect) {
      colorSelect.innerHTML = modelData.colors.map(color => 
        `<option value="${color}" ${selectedColor === color ? 'selected' : ''}>${color}</option>`
      ).join('');
    }

    // Configurar botones de WhatsApp
    this.setupWhatsAppButtons(brandName, modelData);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  setupWhatsAppButtons(brandName, modelData) {
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    const nameInput = document.querySelector('#customer-name');
    const phoneInput = document.querySelector('#customer-phone');
    const colorSelect = document.querySelector('#color-select');

    whatsappButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = nameInput?.value.trim() || 'Cliente';
        const phone = phoneInput?.value.trim();
        const color = colorSelect?.value || modelData.colors[0];
        const isOwner = btn.dataset.contact === 'owner';
        
        const whatsappNumber = isOwner ? '5493572592411' : '5493572501539';
        const contactName = isOwner ? 'Franco Giraudo (Dueño)' : 'Francisco Salgado (Socio)';
        
        const message = `Hola, soy ${name}. Me interesa el modelo ${brandName} ${modelData.model} (${modelData.cilindrada}cc) color ${color}. Consulto por precio y opciones de financiación. Gracias.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Cerrar modal después de enviar
        setTimeout(() => {
          this.closeCTAModal();
        }, 1000);
      });
    });
  }

  closeCTAModal() {
    const modal = document.querySelector('.cta-modal');
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ============================================================
  // ZOOM DE IMÁGENES
  // ============================================================
  setupImageZoom() {
    const zoomOverlay = document.getElementById('image-zoom-overlay');
    const zoomImg = document.getElementById('image-zoom-img');
    const zoomInfo = document.getElementById('image-zoom-info');
    const zoomClose = document.getElementById('image-zoom-close');

    // Event listener para cerrar zoom
    zoomClose?.addEventListener('click', () => this.closeImageZoom());
    zoomOverlay?.addEventListener('click', (e) => {
      if (e.target === zoomOverlay) this.closeImageZoom();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && zoomOverlay?.classList.contains('active')) {
        this.closeImageZoom();
      }
    });
  }

  openImageZoom(imageSrc, imageAlt, colorInfo = '') {
    const zoomOverlay = document.getElementById('image-zoom-overlay');
    const zoomImg = document.getElementById('image-zoom-img');
    const zoomInfo = document.getElementById('image-zoom-info');

    if (zoomOverlay && zoomImg) {
      zoomImg.src = imageSrc;
      zoomImg.alt = imageAlt || 'Imagen ampliada';
      zoomInfo.textContent = colorInfo || '';
      
      zoomOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      console.log(`Zoom abierto: ${imageSrc} - ${colorInfo}`);
    }
  }

  closeImageZoom() {
    const zoomOverlay = document.getElementById('image-zoom-overlay');
    if (zoomOverlay) {
      zoomOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      // Limpiar fuente de imagen después de la animación
      setTimeout(() => {
        const zoomImg = document.getElementById('image-zoom-img');
        if (zoomImg) {
          zoomImg.src = '';
        }
      }, 300);
    }
  }

  addZoomToImages() {
    // Agregar event listeners para zoom en imágenes de modelos
    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('model-image')) {
        e.preventDefault();
        e.stopPropagation();
        
        const img = e.target;
        const modelCard = img.closest('.model-card');
        const modelData = modelCard ? JSON.parse(modelCard.dataset.model || '{}') : {};
        const selectedColor = modelCard?.dataset.selectedColor || '';
        
        const altText = img.alt || 'Motocicleta';
        const colorInfo = selectedColor ? `Color: ${selectedColor}` : '';
        
        this.openImageZoom(img.src, altText, colorInfo);
      }
    });
  }

  // ============================================================
  // UTILIDADES
  // ============================================================
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  new DaytonaMotos();
});

// Optimizaciones de rendimiento
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
}

// Lazy loading para imágenes
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}