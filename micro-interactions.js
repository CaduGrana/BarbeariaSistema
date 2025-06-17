// Sistema de Micro-interações e Animações
class MicroInteractions {
  constructor() {
    this.init()
  }

  init() {
    this.setupButtonAnimations()
    this.setupFormAnimations()
    this.setupCardAnimations()
    this.setupScrollAnimations()
    this.setupRippleEffects()
    this.setupTooltips()
    this.setupLoadingStates()
    this.setupSuccessErrorStates()
    this.setupStaggerAnimations()
  }

  // Animações para botões
  setupButtonAnimations() {
    document.addEventListener("click", (e) => {
      const button = e.target.closest("button, .btn-primary, .btn-secondary, .btn-danger")
      if (button) {
        this.createRipple(button, e)
        this.addClickAnimation(button)
      }
    })

    // Hover effects para botões
    document.addEventListener("mouseover", (e) => {
      const button = e.target.closest("button, .btn-primary, .btn-secondary, .btn-danger")
      if (button) {
        this.addHoverAnimation(button)
      }
    })
  }

  // Criar efeito ripple
  createRipple(element, event) {
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const ripple = document.createElement("div")
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      margin-left: -10px;
      margin-top: -10px;
      z-index: 1000;
    `

    element.style.position = "relative"
    element.style.overflow = "hidden"
    element.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  // Animação de clique
  addClickAnimation(button) {
    button.style.transform = "scale(0.95)"

    setTimeout(() => {
      button.style.transform = ""
    }, 150)
  }

  // Animação de hover
  addHoverAnimation(button) {
    if (!button.classList.contains("loading")) {
      button.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }

  // Animações para formulários
  setupFormAnimations() {
    // Animação de foco em inputs
    document.addEventListener("focusin", (e) => {
      if (e.target.matches(".form-input, .form-select, .form-textarea")) {
        this.animateInputFocus(e.target)
      }
    })

    // Animação de blur em inputs
    document.addEventListener("focusout", (e) => {
      if (e.target.matches(".form-input, .form-select, .form-textarea")) {
        this.animateInputBlur(e.target)
      }
    })

    // Validação em tempo real
    document.addEventListener("input", (e) => {
      if (e.target.matches(".form-input, .form-select, .form-textarea")) {
        this.validateInput(e.target)
      }
    })
  }

  animateInputFocus(input) {
    const formGroup = input.closest(".form-group")
    if (formGroup) {
      formGroup.style.transform = "scale(1.02)"
      formGroup.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }

    // Animação da label
    const label = formGroup?.querySelector(".form-label")
    if (label) {
      label.style.color = "var(--accent-primary)"
      label.style.transform = "translateY(-2px)"
      label.style.transition = "all 0.3s ease"
    }
  }

  animateInputBlur(input) {
    const formGroup = input.closest(".form-group")
    if (formGroup) {
      formGroup.style.transform = ""
    }

    // Reset da label
    const label = formGroup?.querySelector(".form-label")
    if (label) {
      label.style.color = ""
      label.style.transform = ""
    }
  }

  validateInput(input) {
    const formGroup = input.closest(".form-group")
    if (!formGroup) return

    // Remove classes anteriores
    formGroup.classList.remove("error", "success")

    // Validação básica
    if (input.required && !input.value.trim()) {
      return // Não mostra erro enquanto digita
    }

    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(input.value)) {
        formGroup.classList.add("success")
        this.showSuccessIcon(input)
      } else {
        formGroup.classList.add("error")
        this.showErrorIcon(input)
      }
    }

    if (input.value.trim() && input.type !== "email") {
      formGroup.classList.add("success")
      this.showSuccessIcon(input)
    }
  }

  showSuccessIcon(input) {
    this.removeValidationIcon(input)
    const icon = document.createElement("div")
    icon.className = "validation-icon success-icon"
    icon.innerHTML = "✓"
    icon.style.cssText = `
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      color: var(--success);
      font-weight: bold;
      animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `

    input.style.position = "relative"
    input.parentElement.style.position = "relative"
    input.parentElement.appendChild(icon)
  }

  showErrorIcon(input) {
    this.removeValidationIcon(input)
    const icon = document.createElement("div")
    icon.className = "validation-icon error-icon"
    icon.innerHTML = "✕"
    icon.style.cssText = `
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      color: var(--error);
      font-weight: bold;
      animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `

    input.style.position = "relative"
    input.parentElement.style.position = "relative"
    input.parentElement.appendChild(icon)
  }

  removeValidationIcon(input) {
    const existingIcon = input.parentElement.querySelector(".validation-icon")
    if (existingIcon) {
      existingIcon.remove()
    }
  }

  // Animações para cards
  setupCardAnimations() {
    const cards = document.querySelectorAll(".card-form, .card-calendar, .appointment-item, .barber-item")

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        this.animateCardHover(card)
      })

      card.addEventListener("mouseleave", () => {
        this.resetCardAnimation(card)
      })
    })
  }

  animateCardHover(card) {
    card.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"

    // Adiciona um brilho sutil
    const overlay = document.createElement("div")
    overlay.className = "card-overlay"
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `

    card.style.position = "relative"
    card.appendChild(overlay)

    setTimeout(() => {
      overlay.style.opacity = "1"
    }, 10)
  }

  resetCardAnimation(card) {
    const overlay = card.querySelector(".card-overlay")
    if (overlay) {
      overlay.style.opacity = "0"
      setTimeout(() => {
        overlay.remove()
      }, 300)
    }
  }

  // Animações baseadas em scroll
  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateElementEntry(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observa elementos que devem animar na entrada
    const elementsToAnimate = document.querySelectorAll(`
      .card-form, .card-calendar, .appointment-item, .barber-item,
      .form-group, .calendar-day, .nav-link
    `)

    elementsToAnimate.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      observer.observe(el)
    })
  }

  animateElementEntry(element) {
    const delay = Math.random() * 200 // Delay aleatório para efeito stagger

    setTimeout(() => {
      element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }, delay)
  }

  // Efeitos ripple globais
  setupRippleEffects() {
    document.addEventListener("click", (e) => {
      const rippleElements = document.querySelectorAll(".ripple-effect")

      rippleElements.forEach((element) => {
        if (element.contains(e.target)) {
          this.createAdvancedRipple(element, e)
        }
      })
    })
  }

  createAdvancedRipple(element, event) {
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    element.style.setProperty("--x", `${x}px`)
    element.style.setProperty("--y", `${y}px`)

    element.classList.add("active")

    setTimeout(() => {
      element.classList.remove("active")
    }, 600)
  }

  // Sistema de tooltips
  setupTooltips() {
    document.addEventListener("mouseover", (e) => {
      const tooltipElement = e.target.closest("[data-tooltip]")
      if (tooltipElement) {
        this.showTooltip(tooltipElement)
      }
    })

    document.addEventListener("mouseout", (e) => {
      const tooltipElement = e.target.closest("[data-tooltip]")
      if (tooltipElement) {
        this.hideTooltip(tooltipElement)
      }
    })
  }

  showTooltip(element) {
    element.classList.add("tooltip")
  }

  hideTooltip(element) {
    element.classList.remove("tooltip")
  }

  // Estados de loading
  setupLoadingStates() {
    // Intercepta submissões de formulário para mostrar loading
    document.addEventListener("submit", (e) => {
      const form = e.target
      const submitButton = form.querySelector('button[type="submit"]')

      if (submitButton) {
        this.showLoadingState(submitButton)

        // Simula loading (remover em produção)
        setTimeout(() => {
          this.hideLoadingState(submitButton)
        }, 2000)
      }
    })
  }

  showLoadingState(button) {
    button.classList.add("loading")
    button.disabled = true

    const originalText = button.textContent
    button.setAttribute("data-original-text", originalText)
    button.textContent = "Carregando..."
  }

  hideLoadingState(button) {
    button.classList.remove("loading")
    button.disabled = false

    const originalText = button.getAttribute("data-original-text")
    if (originalText) {
      button.textContent = originalText
      button.removeAttribute("data-original-text")
    }
  }

  // Estados de sucesso e erro
  setupSuccessErrorStates() {
    // Método para mostrar sucesso
    window.showSuccess = (element, message) => {
      this.showSuccessState(element, message)
    }

    // Método para mostrar erro
    window.showError = (element, message) => {
      this.showErrorState(element, message)
    }
  }

  showSuccessState(element, message) {
    element.classList.add("success-state")

    if (message) {
      const originalText = element.textContent
      element.setAttribute("data-original-text", originalText)
      element.textContent = message
    }

    setTimeout(() => {
      element.classList.remove("success-state")
      const originalText = element.getAttribute("data-original-text")
      if (originalText) {
        element.textContent = originalText
        element.removeAttribute("data-original-text")
      }
    }, 2000)
  }

  showErrorState(element, message) {
    element.classList.add("error-state")

    if (message) {
      const originalText = element.textContent
      element.setAttribute("data-original-text", originalText)
      element.textContent = message
    }

    setTimeout(() => {
      element.classList.remove("error-state")
      const originalText = element.getAttribute("data-original-text")
      if (originalText) {
        element.textContent = originalText
        element.removeAttribute("data-original-text")
      }
    }, 2000)
  }

  // Animações stagger
  setupStaggerAnimations() {
    const staggerContainers = document.querySelectorAll(".stagger-animation")

    staggerContainers.forEach((container) => {
      const children = container.children

      Array.from(children).forEach((child, index) => {
        child.style.animationDelay = `${index * 0.1}s`
      })
    })
  }

  // Método público para animar elementos
  animateElement(element, animation, duration = 600) {
    element.style.animation = `${animation} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

    setTimeout(() => {
      element.style.animation = ""
    }, duration)
  }

  // Método para criar notificações animadas
  createNotification(message, type = "info", duration = 3000) {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 16px 20px;
      color: var(--text-primary);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      transform: translateX(400px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 300px;
      word-wrap: break-word;
    `

    if (type === "success") {
      notification.style.borderLeftColor = "var(--success)"
      notification.style.borderLeftWidth = "4px"
    } else if (type === "error") {
      notification.style.borderLeftColor = "var(--error)"
      notification.style.borderLeftWidth = "4px"
    }

    document.body.appendChild(notification)

    // Anima entrada
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 10)

    // Remove após duração
    setTimeout(() => {
      notification.style.transform = "translateX(400px)"
      setTimeout(() => {
        notification.remove()
      }, 400)
    }, duration)

    return notification
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new MicroInteractions()
})

// Exportar para uso global
window.MicroInteractions = MicroInteractions
