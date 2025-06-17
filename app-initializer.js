// Inicializador Principal da Aplicação
class AppInitializer {
  constructor() {
    this.systems = {}
    this.isInitialized = false
    this.init()
  }

  async init() {
    try {
      // Mostrar splash screen
      this.showSplashScreen()

      // Inicializar sistemas em ordem
      await this.initializeSystems()

      // Configurar listeners globais
      this.setupGlobalListeners()

      // Marcar como inicializado
      this.isInitialized = true

      // Esconder splash screen
      this.hideSplashScreen()

      // Executar animações de entrada
      this.executeEntryAnimations()

      console.log("🎉 Aplicação inicializada com sucesso!")
    } catch (error) {
      console.error("❌ Erro na inicialização:", error)
      this.handleInitializationError(error)
    }
  }

  showSplashScreen() {
    const splash = document.createElement("div")
    splash.id = "app-splash"
    splash.innerHTML = `
      <div class="splash-content">
        <div class="splash-logo">
          <svg class="splash-scissors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
          <h1>Barbearia Corte Nobre</h1>
        </div>
        <div class="splash-loading">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Inicializando sistema...</p>
        </div>
      </div>
    `

    splash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #dc2626 0%, #2563eb 50%, #6b7280 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20000;
      color: white;
      font-family: 'Inter', sans-serif;
    `

    document.body.appendChild(splash)
  }

  async initializeSystems() {
    const initSteps = [
      { name: "Theme Manager", init: () => new ThemeManager() },
      { name: "Page Transitions", init: () => new PageTransitions() },
      { name: "Parallax Effects", init: () => new ParallaxEffects() },
      { name: "Data Animations", init: () => new DataAnimations() },
      { name: "Micro Interactions", init: () => new MicroInteractions() },
      { name: "Particle System", init: () => new ParticleSystem() },
      { name: "Sound System", init: () => new SoundSystem() },
      { name: "Effects Coordinator", init: () => new EffectsCoordinator() },
    ]

    for (const step of initSteps) {
      try {
        this.updateSplashMessage(`Inicializando ${step.name}...`)
        await this.delay(300)
        this.systems[step.name] = step.init()
        await this.delay(200)
      } catch (error) {
        console.warn(`⚠️ Erro ao inicializar ${step.name}:`, error)
      }
    }
  }

  updateSplashMessage(message) {
    const splash = document.getElementById("app-splash")
    const messageEl = splash?.querySelector("p")
    if (messageEl) {
      messageEl.textContent = message
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  hideSplashScreen() {
    const splash = document.getElementById("app-splash")
    if (splash) {
      splash.style.transition = "opacity 0.6s ease-out"
      splash.style.opacity = "0"

      setTimeout(() => {
        splash.remove()
      }, 600)
    }
  }

  executeEntryAnimations() {
    // Animar entrada dos elementos principais
    const elements = document.querySelectorAll("header, nav, main, footer")
    elements.forEach((el, index) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"

      setTimeout(
        () => {
          el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        },
        index * 200 + 800,
      )
    })

    // Trigger stagger animations
    this.triggerStaggerAnimations()
  }

  triggerStaggerAnimations() {
    const staggerContainers = document.querySelectorAll(".stagger-animation")
    staggerContainers.forEach((container) => {
      const children = Array.from(container.children)
      children.forEach((child, index) => {
        child.style.opacity = "0"
        child.style.transform = "translateY(20px)"

        setTimeout(
          () => {
            child.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
            child.style.opacity = "1"
            child.style.transform = "translateY(0)"
          },
          index * 100 + 1200,
        )
      })
    })
  }

  setupGlobalListeners() {
    // Performance monitoring
    this.setupPerformanceMonitoring()

    // Error handling
    this.setupErrorHandling()

    // Accessibility enhancements
    this.setupAccessibilityEnhancements()

    // Analytics (se necessário)
    this.setupAnalytics()
  }

  setupPerformanceMonitoring() {
    // Monitor FPS
    let lastTime = performance.now()
    let frameCount = 0

    const checkFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

        if (fps < 30) {
          console.warn("⚠️ FPS baixo detectado:", fps)
          this.optimizePerformance()
        }

        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(checkFPS)
    }

    requestAnimationFrame(checkFPS)
  }

  optimizePerformance() {
    // Reduzir animações se performance estiver baixa
    const style = document.createElement("style")
    style.textContent = `
      * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
    `
    document.head.appendChild(style)

    console.log("🔧 Modo de performance otimizada ativado")
  }

  setupErrorHandling() {
    window.addEventListener("error", (event) => {
      console.error("❌ Erro global capturado:", event.error)
      this.handleError(event.error)
    })

    window.addEventListener("unhandledrejection", (event) => {
      console.error("❌ Promise rejeitada:", event.reason)
      this.handleError(event.reason)
    })
  }

  handleError(error) {
    // Mostrar notificação de erro amigável
    if (this.systems["Micro Interactions"]) {
      this.systems["Micro Interactions"].createNotification(
        "Ops! Algo deu errado. Recarregue a página se o problema persistir.",
        "error",
        5000,
      )
    }
  }

  setupAccessibilityEnhancements() {
    // Melhorar navegação por teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation")
      }
    })

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation")
    })

    // Skip links para acessibilidade
    this.createSkipLinks()
  }

  createSkipLinks() {
    const skipLinks = document.createElement("div")
    skipLinks.className = "skip-links"
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Pular para conteúdo principal</a>
      <a href="#navigation" class="skip-link">Pular para navegação</a>
    `

    skipLinks.style.cssText = `
      position: absolute;
      top: -100px;
      left: 0;
      z-index: 30000;
    `

    document.body.insertBefore(skipLinks, document.body.firstChild)

    // Adicionar IDs se não existirem
    const main = document.querySelector("main")
    const nav = document.querySelector("nav")

    if (main && !main.id) main.id = "main-content"
    if (nav && !nav.id) nav.id = "navigation"
  }

  setupAnalytics() {
    // Rastrear interações importantes (sem dados pessoais)
    const trackEvent = (action, category = "interaction") => {
      console.log(`📊 Analytics: ${category} - ${action}`)
      // Aqui você pode integrar com Google Analytics, etc.
    }

    // Rastrear cliques em botões importantes
    document.addEventListener("click", (e) => {
      const button = e.target.closest("button, .btn-primary, .btn-secondary")
      if (button) {
        trackEvent(`button_click_${button.textContent.trim().toLowerCase()}`)
      }
    })

    // Rastrear submissões de formulário
    document.addEventListener("submit", (e) => {
      const form = e.target
      if (form.id) {
        trackEvent(`form_submit_${form.id}`)
      }
    })
  }

  handleInitializationError(error) {
    // Fallback para modo básico
    console.warn("🔄 Iniciando modo básico devido a erro:", error)

    const errorMessage = document.createElement("div")
    errorMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px;
      border-radius: 8px;
      z-index: 10000;
      max-width: 300px;
    `
    errorMessage.textContent = "Sistema iniciado em modo básico. Algumas animações podem não funcionar."

    document.body.appendChild(errorMessage)

    setTimeout(() => {
      errorMessage.remove()
    }, 5000)
  }

  // Métodos públicos para controle da aplicação
  getSystem(name) {
    return this.systems[name]
  }

  isSystemReady(name) {
    return !!this.systems[name]
  }

  restartSystem(name) {
    if (this.systems[name]) {
      console.log(`🔄 Reiniciando sistema: ${name}`)
      // Implementar lógica de reinicialização específica
    }
  }
}

// CSS para splash screen e skip links
const splashStyles = document.createElement("style")
splashStyles.textContent = `
  .splash-content {
    text-align: center;
  }

  .splash-logo {
    margin-bottom: 40px;
  }

  .splash-scissors {
    width: 100px;
    height: 100px;
    animation: rotateScissors 2s ease-in-out infinite;
    margin-bottom: 20px;
  }

  .splash-logo h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    letter-spacing: 2px;
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }

  .splash-loading {
    animation: fadeInUp 0.8s ease-out 0.6s both;
  }

  .loading-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  .loading-dots span {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    animation: loadingDots 1.4s ease-in-out infinite both;
  }

  .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
  .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
  .loading-dots span:nth-child(3) { animation-delay: 0s; }

  .splash-loading p {
    margin: 0;
    font-size: 16px;
    opacity: 0.9;
  }

  .skip-links .skip-link {
    position: absolute;
    top: -100px;
    left: 0;
    background: var(--accent-primary);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 8px 0;
    transition: top 0.3s ease;
  }

  .skip-links .skip-link:focus {
    top: 0;
  }

  @keyframes loadingDots {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .splash-scissors {
      width: 80px;
      height: 80px;
    }

    .splash-logo h1 {
      font-size: 24px;
    }
  }
`

document.head.appendChild(splashStyles)

// Import the system classes
import { ThemeManager } from "./theme-manager.js"
import { PageTransitions } from "./page-transitions.js"
import { ParallaxEffects } from "./parallax-effects.js"
import { DataAnimations } from "./data-animations.js"
import { MicroInteractions } from "./micro-interactions.js"
import { ParticleSystem } from "./particle-system.js"
import { SoundSystem } from "./sound-system.js"
import { EffectsCoordinator } from "./effects-coordinator.js"

// Inicializar aplicação quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.app = new AppInitializer()
  })
} else {
  window.app = new AppInitializer()
}

// Exportar para uso global
window.AppInitializer = AppInitializer
