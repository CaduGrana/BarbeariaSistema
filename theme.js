// Gerenciador de Efeitos Visuais - Tema Único
class VisualEffectsManager {
  constructor() {
    this.init()
  }

  init() {
    this.addAnimations()
    this.setupInteractions()
    this.createVisualEnhancements()
  }

  addAnimations() {
    // Animar contador de visitas
    this.animateCounter()

    // Adicionar animações de entrada para elementos
    const elements = document.querySelectorAll(".form-group, .card-form, .card-calendar")
    elements.forEach((element, index) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"

      setTimeout(
        () => {
          element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        },
        100 + index * 100,
      )
    })
  }

  animateCounter() {
    const counter = document.getElementById("visitCount")
    if (!counter) return

    const finalValue = Number.parseInt(counter.textContent) || 0
    let currentValue = 0
    const increment = finalValue / 30

    const timer = setInterval(() => {
      currentValue += increment
      if (currentValue >= finalValue) {
        currentValue = finalValue
        clearInterval(timer)
      }
      counter.textContent = Math.floor(currentValue)
    }, 50)
  }

  setupInteractions() {
    // Efeitos de hover melhorados
    document.addEventListener("mouseover", (e) => {
      if (e.target.matches("button, .btn-primary, .btn-secondary, .btn-danger")) {
        this.addHoverEffect(e.target)
      }
    })

    // Efeitos de clique
    document.addEventListener("click", (e) => {
      if (e.target.matches("button, .btn-primary, .btn-secondary, .btn-danger")) {
        this.addClickEffect(e.target)
      }
    })

    // Efeitos de foco em inputs
    document.addEventListener("focusin", (e) => {
      if (e.target.matches(".form-input, .form-select, .form-textarea")) {
        this.addFocusEffect(e.target)
      }
    })

    document.addEventListener("focusout", (e) => {
      if (e.target.matches(".form-input, .form-select, .form-textarea")) {
        this.removeFocusEffect(e.target)
      }
    })
  }

  addHoverEffect(element) {
    element.style.transform = "translateY(-2px) scale(1.02)"
  }

  addClickEffect(element) {
    element.style.transform = "scale(0.98)"
    setTimeout(() => {
      element.style.transform = ""
    }, 150)
  }

  addFocusEffect(input) {
    const formGroup = input.closest(".form-group")
    if (formGroup) {
      formGroup.style.transform = "scale(1.02)"
    }
  }

  removeFocusEffect(input) {
    const formGroup = input.closest(".form-group")
    if (formGroup) {
      formGroup.style.transform = ""
    }
  }

  createVisualEnhancements() {
    // Adicionar efeitos de partículas sutis
    this.createFloatingElements()

    // Adicionar efeitos de scroll
    this.setupScrollEffects()
  }

  createFloatingElements() {
    const container = document.createElement("div")
    container.className = "floating-elements"
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    `

    // Criar elementos flutuantes
    for (let i = 0; i < 6; i++) {
      const element = document.createElement("div")
      element.style.cssText = `
        position: absolute;
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        background: linear-gradient(45deg, #2563eb, #8b5cf6);
        border-radius: 50%;
        opacity: 0.1;
        animation: float ${8 + Math.random() * 4}s ease-in-out infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
      `
      container.appendChild(element)
    }

    document.body.appendChild(container)
  }

  setupScrollEffects() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "slideIn 0.6s ease-out"
          }
        })
      },
      { threshold: 0.1 },
    )

    // Observar elementos para animação
    document.querySelectorAll(".appointment-item, .barber-item, .calendar-day").forEach((el) => {
      observer.observe(el)
    })
  }

  // Método para criar notificações visuais
  createNotification(message, type = "info", duration = 3000) {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    const colors = {
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#2563eb",
    }

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      z-index: 10000;
      transform: translateX(400px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 300px;
      font-weight: 500;
    `

    document.body.appendChild(notification)

    // Animar entrada
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 10)

    // Remover após duração
    setTimeout(() => {
      notification.style.transform = "translateX(400px)"
      setTimeout(() => {
        notification.remove()
      }, 400)
    }, duration)

    return notification
  }
}

// Adicionar keyframes para animações
const animationStyles = document.createElement("style")
animationStyles.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-20px) rotate(120deg);
    }
    66% {
      transform: translateY(10px) rotate(240deg);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }
`

document.head.appendChild(animationStyles)

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new VisualEffectsManager()
})

// Exportar para uso global
window.VisualEffectsManager = VisualEffectsManager
