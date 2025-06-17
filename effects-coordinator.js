// Coordenador de Efeitos - Integra Partículas e Sons
class EffectsCoordinator {
  constructor() {
    this.particleSystem = null
    this.soundSystem = null
    this.isInitialized = false
    this.effectsQueue = []
    this.init()
  }

  async init() {
    try {
      // Inicializar sistemas
      this.particleSystem = new ParticleSystem()
      this.soundSystem = new SoundSystem()

      // Aguardar inicialização
      await this.waitForSystems()

      // Configurar efeitos coordenados
      this.setupCoordinatedEffects()

      // Configurar efeitos especiais
      this.setupSpecialEffects()

      this.isInitialized = true
      console.log("🎭 Coordenador de efeitos inicializado")
    } catch (error) {
      console.error("❌ Erro ao inicializar coordenador:", error)
    }
  }

  async waitForSystems() {
    // Aguardar sistemas estarem prontos
    let attempts = 0
    while ((!this.particleSystem?.isRunning || !this.soundSystem?.isInitialized) && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }
  }

  // Configurar efeitos coordenados
  setupCoordinatedEffects() {
    // Substituir listeners padrão por versões coordenadas
    this.setupClickEffects()
    this.setupHoverEffects()
    this.setupFormEffects()
    this.setupNavigationEffects()
    this.setupThemeEffects()
  }

  setupClickEffects() {
    document.addEventListener("click", (e) => {
      const element = e.target

      if (element.matches(".btn-primary")) {
        this.createPrimaryButtonEffect(e.clientX, e.clientY)
      } else if (element.matches(".btn-secondary")) {
        this.createSecondaryButtonEffect(e.clientX, e.clientY)
      } else if (element.matches(".btn-danger")) {
        this.createDangerButtonEffect(e.clientX, e.clientY)
      } else if (element.matches(".calendar-day")) {
        this.createCalendarClickEffect(e.clientX, e.clientY)
      } else if (element.matches(".theme-toggle")) {
        this.createThemeToggleEffect(e.clientX, e.clientY)
      } else {
        this.createGenericClickEffect(e.clientX, e.clientY)
      }
    })
  }

  setupHoverEffects() {
    document.addEventListener("mouseover", (e) => {
      const element = e.target

      if (element.matches("button, .btn-primary, .btn-secondary, .btn-danger")) {
        this.createHoverEffect(element)
      } else if (element.matches(".nav-link")) {
        this.createNavHoverEffect(element)
      } else if (element.matches(".card-form, .card-calendar")) {
        this.createCardHoverEffect(element)
      }
    })
  }

  setupFormEffects() {
    // Efeitos de formulário
    document.addEventListener("input", (e) => {
      if (e.target.matches("input, textarea")) {
        this.createTypingEffect(e.target)
      }
    })

    document.addEventListener("submit", (e) => {
      this.createSubmitEffect(e.target)
    })

    // Efeitos de validação
    document.addEventListener("focusout", (e) => {
      if (e.target.matches("input[required], textarea[required]")) {
        this.createValidationEffect(e.target)
      }
    })
  }

  setupNavigationEffects() {
    // Efeitos de navegação
    document.addEventListener("click", (e) => {
      if (e.target.matches('a[href]:not([href^="#"])')) {
        this.createNavigationEffect(e.clientX, e.clientY)
      }
    })
  }

  setupThemeEffects() {
    // Observer para mudanças de tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          this.createThemeChangeEffect()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
  }

  // Efeitos específicos coordenados
  createPrimaryButtonEffect(x, y) {
    // Som
    this.soundSystem?.play("click")

    // Partículas
    this.particleSystem?.explode(x, y, {
      count: 12,
      colors: ["#dc2626", "#b91c1c"],
      size: 3,
      speed: 4,
      type: "circle",
    })

    // Efeito adicional após delay
    setTimeout(() => {
      this.particleSystem?.explode(x, y, {
        count: 6,
        colors: ["#ffffff"],
        size: 2,
        speed: 2,
        type: "sparkle",
      })
    }, 100)
  }

  createSecondaryButtonEffect(x, y) {
    this.soundSystem?.play("hover")
    this.particleSystem?.explode(x, y, {
      count: 8,
      colors: ["#2563eb", "#3b82f6"],
      size: 2,
      speed: 3,
      type: "circle",
    })
  }

  createDangerButtonEffect(x, y) {
    this.soundSystem?.play("error")
    this.particleSystem?.explode(x, y, {
      count: 15,
      colors: ["#ef4444", "#f87171"],
      size: 4,
      speed: 5,
      type: "confetti",
    })
  }

  createCalendarClickEffect(x, y) {
    this.soundSystem?.play("pop")
    this.particleSystem?.explode(x, y, {
      count: 10,
      colors: ["#10b981", "#34d399"],
      size: 3,
      speed: 3,
      type: "sparkle",
    })
  }

  createThemeToggleEffect(x, y) {
    this.soundSystem?.play("whoosh")

    // Efeito de explosão circular
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.particleSystem?.explode(x, y, {
          count: 3,
          colors: ["#fbbf24", "#f59e0b"],
          size: 2,
          speed: 2 + i * 0.2,
          type: "circle",
        })
      }, i * 50)
    }
  }

  createGenericClickEffect(x, y) {
    this.soundSystem?.play("tick")
    this.particleSystem?.explode(x, y, {
      count: 5,
      colors: ["#6b7280"],
      size: 1,
      speed: 2,
      type: "circle",
    })
  }

  createHoverEffect(element) {
    this.soundSystem?.play("hover")

    const rect = element.getBoundingClientRect()
    this.particleSystem?.createHoverEffect(element)
  }

  createNavHoverEffect(element) {
    this.soundSystem?.play("tick")

    const rect = element.getBoundingClientRect()
    this.particleSystem?.explode(rect.left + rect.width / 2, rect.bottom, {
      count: 3,
      colors: ["#2563eb"],
      size: 1,
      speed: 1,
      type: "circle",
    })
  }

  createCardHoverEffect(element) {
    const rect = element.getBoundingClientRect()

    // Partículas nas bordas do card
    for (let i = 0; i < 4; i++) {
      const x = rect.left + (rect.width * i) / 3
      const y = rect.top

      this.particleSystem?.explode(x, y, {
        count: 2,
        colors: ["#ffffff"],
        size: 1,
        speed: 1,
        type: "sparkle",
      })
    }
  }

  createTypingEffect(element) {
    this.soundSystem?.play("typing")
    this.particleSystem?.createTypingEffect(element)
  }

  createSubmitEffect(form) {
    const rect = form.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Som de whoosh
    this.soundSystem?.play("whoosh")

    // Explosão de partículas
    this.particleSystem?.explode(centerX, centerY, {
      count: 25,
      colors: ["#10b981", "#34d399", "#6ee7b7"],
      size: 4,
      speed: 6,
      type: "confetti",
    })

    // Efeito secundário
    setTimeout(() => {
      this.soundSystem?.play("success")
      this.particleSystem?.explode(centerX, centerY, {
        count: 15,
        colors: ["#ffffff"],
        size: 2,
        speed: 3,
        type: "sparkle",
      })
    }, 300)
  }

  createValidationEffect(element) {
    const rect = element.getBoundingClientRect()
    const isValid = element.checkValidity()

    if (isValid) {
      this.soundSystem?.play("tick")
      this.particleSystem?.explode(rect.right - 10, rect.top + rect.height / 2, {
        count: 5,
        colors: ["#10b981"],
        size: 2,
        speed: 2,
        type: "sparkle",
      })
    } else {
      this.soundSystem?.play("error")
      this.particleSystem?.explode(rect.right - 10, rect.top + rect.height / 2, {
        count: 8,
        colors: ["#ef4444"],
        size: 2,
        speed: 3,
        type: "smoke",
      })
    }
  }

  createNavigationEffect(x, y) {
    this.soundSystem?.play("whoosh")

    // Efeito de portal
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        this.particleSystem?.explode(x, y, {
          count: 2,
          colors: ["#3b82f6", "#1d4ed8"],
          size: 3,
          speed: 4 + i * 0.1,
          type: "circle",
        })
      }, i * 20)
    }
  }

  createThemeChangeEffect() {
    this.soundSystem?.play("chime")

    // Efeito de onda em toda a tela
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        this.particleSystem?.explode(centerX, centerY, {
          count: 5,
          colors: ["#fbbf24", "#f59e0b", "#d97706"],
          size: 2,
          speed: 3 + i * 0.2,
          type: "sparkle",
        })
      }, i * 30)
    }
  }

  // Configurar efeitos especiais
  setupSpecialEffects() {
    // Efeito de chuva de partículas ocasional
    setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% de chance a cada 10 segundos
        this.createAmbientEffect()
      }
    }, 10000)

    // Efeito de aniversário (se for uma data especial)
    this.checkSpecialDates()

    // Efeito de conquista
    this.setupAchievementEffects()
  }

  createAmbientEffect() {
    this.particleSystem?.rain({
      count: 3,
      colors: ["#ffffff", "#f8fafc"],
      type: "sparkle",
    })
  }

  checkSpecialDates() {
    const today = new Date()
    const isNewYear = today.getMonth() === 0 && today.getDate() === 1
    const isChristmas = today.getMonth() === 11 && today.getDate() === 25

    if (isNewYear || isChristmas) {
      this.createCelebrationEffect()
    }
  }

  createCelebrationEffect() {
    this.soundSystem?.playSequence(["chime", "success", "pop"], 300)

    // Fogos de artifício
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth
        const y = Math.random() * window.innerHeight * 0.5

        this.particleSystem?.explode(x, y, {
          count: 20,
          colors: ["#ef4444", "#10b981", "#3b82f6", "#fbbf24"],
          size: 4,
          speed: 6,
          type: "confetti",
        })
      }, i * 500)
    }
  }

  setupAchievementEffects() {
    // Monitorar conquistas (exemplo: primeiro agendamento)
    const originalSetItem = localStorage.setItem
    localStorage.setItem = (key, value) => {
      if (key === "appointments") {
        const appointments = JSON.parse(value)
        if (appointments.length === 1) {
          this.createAchievementEffect("Primeiro Agendamento!")
        } else if (appointments.length === 10) {
          this.createAchievementEffect("10 Agendamentos!")
        }
      }
      originalSetItem.call(localStorage, key, value)
    }
  }

  createAchievementEffect(message) {
    this.soundSystem?.playSuccess()

    // Mostrar mensagem de conquista
    const achievement = document.createElement("div")
    achievement.textContent = `🏆 ${message}`
    achievement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      padding: 20px 40px;
      border-radius: 20px;
      font-size: 24px;
      font-weight: bold;
      z-index: 20000;
      animation: achievementPop 3s ease-out forwards;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `

    document.body.appendChild(achievement)

    // Efeito de partículas
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    this.particleSystem?.explode(centerX, centerY, {
      count: 50,
      colors: ["#fbbf24", "#f59e0b", "#ffffff"],
      size: 5,
      speed: 8,
      type: "confetti",
    })

    // Remover após animação
    setTimeout(() => {
      achievement.remove()
    }, 3000)
  }

  // Métodos públicos para controle manual
  createCustomEffect(x, y, options = {}) {
    const { sound = "pop", particles = true, particleOptions = {} } = options

    if (sound) {
      this.soundSystem?.play(sound)
    }

    if (particles) {
      this.particleSystem?.explode(x, y, {
        count: 10,
        colors: ["#3b82f6"],
        size: 3,
        speed: 4,
        type: "circle",
        ...particleOptions,
      })
    }
  }

  // Ativar/desativar efeitos
  setEnabled(enabled) {
    if (this.soundSystem) {
      this.soundSystem.enabled = enabled
    }
    if (this.particleSystem) {
      if (enabled) {
        this.particleSystem.start()
      } else {
        this.particleSystem.stop()
      }
    }
  }

  // Limpar recursos
  destroy() {
    this.soundSystem?.destroy()
    this.particleSystem?.stop()
  }
}

// CSS para efeitos especiais
const effectsStyles = document.createElement("style")
effectsStyles.textContent = `
  @keyframes achievementPop {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    20% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  /* Efeitos de hover melhorados */
  button:hover,
  .btn-primary:hover,
  .btn-secondary:hover,
  .btn-danger:hover {
    transform: translateY(-2px) scale(1.02);
    filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  }

  /* Efeitos de clique */
  button:active,
  .btn-primary:active,
  .btn-secondary:active,
  .btn-danger:active {
    transform: translateY(0) scale(0.98);
  }

  /* Animação de pulsação para elementos importantes */
  .pulse-effect {
    animation: pulseGlow 2s ease-in-out infinite;
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    }
  }
`

document.head.appendChild(effectsStyles)

// Mock classes to avoid errors. In a real scenario, these would be imported.
class ParticleSystem {
  constructor() {
    this.isRunning = true
  }
  explode() {}
  createHoverEffect() {}
  createTypingEffect() {}
  rain() {}
  start() {}
  stop() {}
}

class SoundSystem {
  constructor() {
    this.isInitialized = true
    this.enabled = true
  }
  play() {}
  playSequence() {}
  playSuccess() {}
  destroy() {}
}
