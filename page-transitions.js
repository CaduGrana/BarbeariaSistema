// Sistema de Transições de Página e Loading States
class PageTransitions {
  constructor() {
    this.isTransitioning = false
    this.loadingOverlay = null
    this.progressBar = null
    this.init()
  }

  init() {
    this.createLoadingOverlay()
    this.setupPageTransitions()
    this.setupPreloader()
    this.setupNavigationInterceptor()
    this.initializeCurrentPage()
  }

  // Criar overlay de loading
  createLoadingOverlay() {
    this.loadingOverlay = document.createElement("div")
    this.loadingOverlay.className = "page-loading-overlay"
    this.loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-logo">
          <svg class="loading-scissors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
          <h2 class="loading-title">Barbearia Corte Nobre</h2>
        </div>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <p class="loading-text">Carregando...</p>
        </div>
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
      </div>
    `

    this.loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, 
        rgba(220, 38, 38, 0.95) 0%, 
        rgba(37, 99, 235, 0.95) 50%, 
        rgba(107, 114, 128, 0.95) 100%);
      backdrop-filter: blur(20px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `

    document.body.appendChild(this.loadingOverlay)
    this.progressBar = this.loadingOverlay.querySelector(".progress-fill")
  }

  // Mostrar loading
  showLoading(text = "Carregando...") {
    if (this.isTransitioning) return

    this.isTransitioning = true
    const loadingText = this.loadingOverlay.querySelector(".loading-text")
    loadingText.textContent = text

    this.loadingOverlay.style.visibility = "visible"
    this.loadingOverlay.style.opacity = "1"

    // Animar progress bar
    this.animateProgressBar()

    // Animar elementos
    this.animateLoadingElements()
  }

  // Esconder loading
  hideLoading() {
    setTimeout(() => {
      this.loadingOverlay.style.opacity = "0"
      setTimeout(() => {
        this.loadingOverlay.style.visibility = "hidden"
        this.isTransitioning = false
        this.resetProgressBar()
      }, 400)
    }, 500)
  }

  // Animar progress bar
  animateProgressBar() {
    this.progressBar.style.width = "0%"
    this.progressBar.style.transition = "width 2s cubic-bezier(0.4, 0, 0.2, 1)"

    setTimeout(() => {
      this.progressBar.style.width = "100%"
    }, 100)
  }

  // Reset progress bar
  resetProgressBar() {
    this.progressBar.style.width = "0%"
    this.progressBar.style.transition = "none"
  }

  // Animar elementos de loading
  animateLoadingElements() {
    const logo = this.loadingOverlay.querySelector(".loading-logo")
    const progress = this.loadingOverlay.querySelector(".loading-progress")
    const spinner = this.loadingOverlay.querySelector(".loading-spinner")

    // Reset animations
    logo.style.animation = "none"
    progress.style.animation = "none"
    spinner.style.animation = "none"

    setTimeout(() => {
      logo.style.animation = "fadeInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
      progress.style.animation = "slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both"
      spinner.style.animation = "rotateIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both"
    }, 100)
  }

  // Configurar transições de página
  setupPageTransitions() {
    // Interceptar cliques em links
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]")
      if (link && this.shouldInterceptLink(link)) {
        e.preventDefault()
        this.navigateToPage(link.href, link.textContent.trim())
      }
    })
  }

  // Verificar se deve interceptar o link
  shouldInterceptLink(link) {
    const href = link.getAttribute("href")
    return (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      !href.startsWith("http") &&
      !link.hasAttribute("target")
    )
  }

  // Navegar para página
  async navigateToPage(url, linkText = "") {
    if (this.isTransitioning) return

    // Determinar texto de loading baseado no link
    let loadingText = "Carregando..."
    if (linkText.includes("Agendar")) loadingText = "Preparando agendamento..."
    else if (linkText.includes("Calendário")) loadingText = "Carregando calendário..."
    else if (linkText.includes("Gerenciar")) loadingText = "Acessando gerenciamento..."

    // Mostrar loading
    this.showLoading(loadingText)

    // Animar saída da página atual
    await this.animatePageOut()

    // Simular carregamento
    await this.simulateLoading()

    // Navegar
    window.location.href = url
  }

  // Animar saída da página
  animatePageOut() {
    return new Promise((resolve) => {
      const elements = document.querySelectorAll("main, nav, header")
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          el.style.transform = "translateY(-30px)"
          el.style.opacity = "0"
        }, index * 100)
      })

      setTimeout(resolve, 600)
    })
  }

  // Simular carregamento
  simulateLoading() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000 + Math.random() * 1000)
    })
  }

  // Configurar preloader
  setupPreloader() {
    // Mostrar preloader na primeira carga
    if (document.readyState === "loading") {
      this.showLoading("Inicializando...")

      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          this.hideLoading()
          this.animatePageIn()
        }, 1500)
      })
    } else {
      this.animatePageIn()
    }
  }

  // Animar entrada da página
  animatePageIn() {
    const elements = document.querySelectorAll("header, nav, main, footer")
    elements.forEach((el, index) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"

      setTimeout(() => {
        el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
        el.style.opacity = "1"
        el.style.transform = "translateY(0)"
      }, index * 200)
    })
  }

  // Configurar interceptor de navegação
  setupNavigationInterceptor() {
    // Interceptar navegação do browser
    window.addEventListener("beforeunload", () => {
      if (!this.isTransitioning) {
        this.showLoading("Saindo...")
      }
    })

    // Interceptar botão voltar
    window.addEventListener("popstate", () => {
      this.showLoading("Navegando...")
      setTimeout(() => {
        this.hideLoading()
      }, 800)
    })
  }

  // Inicializar página atual
  initializeCurrentPage() {
    // Adicionar classe baseada na página atual
    const path = window.location.pathname
    const page = path.split("/").pop().replace(".html", "") || "index"
    document.body.classList.add(`page-${page}`)

    // Configurações específicas por página
    this.setupPageSpecificAnimations(page)
  }

  // Configurações específicas por página
  setupPageSpecificAnimations(page) {
    switch (page) {
      case "agendamento":
      case "index":
        this.setupAgendamentoAnimations()
        break
      case "calendario":
        this.setupCalendarioAnimations()
        break
      case "gerenciar":
        this.setupGerenciarAnimations()
        break
    }
  }

  setupAgendamentoAnimations() {
    // Animações específicas da página de agendamento
    const form = document.querySelector("#appointmentForm")
    if (form) {
      this.animateFormElements(form)
    }
  }

  setupCalendarioAnimations() {
    // Animações específicas do calendário
    const calendar = document.querySelector(".calendar-days-grid")
    if (calendar) {
      this.animateCalendarElements(calendar)
    }
  }

  setupGerenciarAnimations() {
    // Animações específicas da página de gerenciamento
    const cards = document.querySelectorAll(".card-form")
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = "slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      }, index * 200)
    })
  }

  animateFormElements(form) {
    const groups = form.querySelectorAll(".form-group")
    groups.forEach((group, index) => {
      group.style.opacity = "0"
      group.style.transform = "translateX(-30px)"

      setTimeout(
        () => {
          group.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
          group.style.opacity = "1"
          group.style.transform = "translateX(0)"
        },
        index * 100 + 500,
      )
    })
  }

  animateCalendarElements(calendar) {
    const days = calendar.querySelectorAll(".calendar-day")
    days.forEach((day, index) => {
      day.style.opacity = "0"
      day.style.transform = "scale(0.8)"

      setTimeout(
        () => {
          day.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          day.style.opacity = "1"
          day.style.transform = "scale(1)"
        },
        index * 20 + 800,
      )
    })
  }
}
