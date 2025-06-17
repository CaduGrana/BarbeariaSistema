// Sistema de Parallax Scrolling e Efeitos de Profundidade
class ParallaxEffects {
  constructor() {
    this.scrollY = 0
    this.ticking = false
    this.parallaxElements = []
    this.init()
  }

  init() {
    this.createParallaxElements()
    this.setupScrollListener()
    this.setupIntersectionObserver()
    this.createFloatingElements()
    this.setupMouseParallax()
  }

  // Criar elementos parallax
  createParallaxElements() {
    // Background parallax para header
    this.createHeaderParallax()

    // Elementos flutuantes
    this.createFloatingShapes()

    // Parallax para cards
    this.setupCardParallax()
  }

  // Parallax no header
  createHeaderParallax() {
    const header = document.querySelector("header")
    if (!header) return

    // Criar camadas de background
    const parallaxBg = document.createElement("div")
    parallaxBg.className = "parallax-background"
    parallaxBg.innerHTML = `
      <div class="parallax-layer" data-speed="0.2">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
      </div>
      <div class="parallax-layer" data-speed="0.5">
        <div class="bg-shape bg-shape-3"></div>
        <div class="bg-shape bg-shape-4"></div>
      </div>
      <div class="parallax-layer" data-speed="0.8">
        <div class="floating-scissors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
        </div>
      </div>
    `

    header.style.position = "relative"
    header.style.overflow = "hidden"
    header.insertBefore(parallaxBg, header.firstChild)

    this.parallaxElements.push(...parallaxBg.querySelectorAll(".parallax-layer"))
  }

  // Criar formas flutuantes
  createFloatingShapes() {
    const shapes = document.createElement("div")
    shapes.className = "floating-shapes"
    shapes.innerHTML = `
      <div class="floating-shape shape-1" data-speed="0.1"></div>
      <div class="floating-shape shape-2" data-speed="0.3"></div>
      <div class="floating-shape shape-3" data-speed="0.2"></div>
      <div class="floating-shape shape-4" data-speed="0.4"></div>
      <div class="floating-shape shape-5" data-speed="0.15"></div>
    `

    document.body.appendChild(shapes)
    this.parallaxElements.push(...shapes.querySelectorAll(".floating-shape"))
  }

  // Configurar parallax para cards
  setupCardParallax() {
    const cards = document.querySelectorAll(".card-form, .card-calendar, .appointment-item, .barber-item")
    cards.forEach((card, index) => {
      card.setAttribute("data-speed", 0.05 + index * 0.02)
      card.setAttribute("data-parallax", "true")
      this.parallaxElements.push(card)
    })
  }

  // Configurar listener de scroll
  setupScrollListener() {
    window.addEventListener("scroll", () => {
      this.scrollY = window.pageYOffset

      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateParallax()
          this.ticking = false
        })
        this.ticking = true
      }
    })
  }

  // Atualizar efeitos parallax
  updateParallax() {
    this.parallaxElements.forEach((element) => {
      const speed = Number.parseFloat(element.getAttribute("data-speed")) || 0.1
      const yPos = -(this.scrollY * speed)

      if (element.classList.contains("parallax-layer")) {
        element.style.transform = `translateY(${yPos}px)`
      } else if (element.classList.contains("floating-shape")) {
        const xOffset = Math.sin(this.scrollY * 0.001 + Number.parseFloat(element.style.left || 0)) * 20
        element.style.transform = `translate(${xOffset}px, ${yPos}px) rotate(${this.scrollY * 0.1}deg)`
      } else if (element.hasAttribute("data-parallax")) {
        element.style.transform = `translateY(${yPos}px)`
      }
    })

    // Atualizar elementos baseados em scroll
    this.updateScrollBasedAnimations()
  }

  // Animações baseadas em scroll
  updateScrollBasedAnimations() {
    const scrollProgress = this.scrollY / (document.body.scrollHeight - window.innerHeight)

    // Animar theme toggle baseado no scroll
    const themeToggle = document.querySelector(".theme-toggle")
    if (themeToggle) {
      const rotation = scrollProgress * 360
      themeToggle.style.transform = `translateY(-2px) scale(1.05) rotate(${rotation}deg)`
    }

    // Animar header baseado no scroll
    const header = document.querySelector("header")
    if (header) {
      const opacity = Math.max(0.7, 1 - scrollProgress * 0.3)
      header.style.opacity = opacity
    }
  }

  // Configurar intersection observer para animações
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.triggerScrollAnimation(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    // Observar elementos para animação
    const elementsToObserve = document.querySelectorAll(`
      .form-group, .calendar-day, .appointment-item, .barber-item,
      .nav-link, .btn-primary, .btn-secondary
    `)

    elementsToObserve.forEach((el) => {
      observer.observe(el)
    })
  }

  // Trigger animação de scroll
  triggerScrollAnimation(element) {
    if (element.classList.contains("scroll-animated")) return

    element.classList.add("scroll-animated")

    // Diferentes animações baseadas no tipo de elemento
    if (element.classList.contains("form-group")) {
      element.style.animation = "slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
    } else if (element.classList.contains("calendar-day")) {
      element.style.animation = "scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    } else if (element.classList.contains("appointment-item") || element.classList.contains("barber-item")) {
      element.style.animation = "slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
    } else {
      element.style.animation = "fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }

  // Criar elementos flutuantes
  createFloatingElements() {
    const floatingContainer = document.createElement("div")
    floatingContainer.className = "floating-elements-container"

    // Criar diferentes tipos de elementos flutuantes
    for (let i = 0; i < 8; i++) {
      const element = document.createElement("div")
      element.className = `floating-element floating-element-${i + 1}`
      element.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 1;
        opacity: 0.1;
        animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `

      // Posicionamento aleatório
      element.style.left = Math.random() * 100 + "%"
      element.style.top = Math.random() * 100 + "%"

      floatingContainer.appendChild(element)
    }

    document.body.appendChild(floatingContainer)
  }

  // Configurar parallax do mouse
  setupMouseParallax() {
    let mouseX = 0
    let mouseY = 0

    document.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1

      this.updateMouseParallax(mouseX, mouseY)
    })
  }

  // Atualizar parallax do mouse
  updateMouseParallax(mouseX, mouseY) {
    // Parallax sutil para cards
    const cards = document.querySelectorAll(".card-form, .card-calendar")
    cards.forEach((card) => {
      const intensity = 5
      const x = mouseX * intensity
      const y = mouseY * intensity

      card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(0)`
    })

    // Parallax para elementos flutuantes
    const floatingElements = document.querySelectorAll(".floating-element")
    floatingElements.forEach((element, index) => {
      const intensity = (index + 1) * 2
      const x = mouseX * intensity
      const y = mouseY * intensity

      element.style.transform = `translate(${x}px, ${y}px)`
    })

    // Parallax para formas de background
    const bgShapes = document.querySelectorAll(".bg-shape")
    bgShapes.forEach((shape, index) => {
      const intensity = (index + 1) * 3
      const x = mouseX * intensity
      const y = mouseY * intensity

      shape.style.transform = `translate(${x}px, ${y}px)`
    })
  }

  // Método para adicionar elemento parallax customizado
  addParallaxElement(element, speed = 0.1) {
    element.setAttribute("data-speed", speed)
    element.setAttribute("data-parallax", "true")
    this.parallaxElements.push(element)
  }

  // Método para remover elemento parallax
  removeParallaxElement(element) {
    const index = this.parallaxElements.indexOf(element)
    if (index > -1) {
      this.parallaxElements.splice(index, 1)
    }
  }
}
