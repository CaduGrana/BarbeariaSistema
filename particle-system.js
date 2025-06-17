// Sistema de Partículas Avançado
class ParticleSystem {
  constructor() {
    this.canvas = null
    this.ctx = null
    this.particles = []
    this.emitters = []
    this.particlePool = []
    this.isRunning = false
    this.lastTime = 0
    this.maxParticles = 500
    this.init()
  }

  init() {
    this.createCanvas()
    this.setupEventListeners()
    this.preloadParticlePool()
    this.start()
  }

  // Criar canvas para partículas
  createCanvas() {
    this.canvas = document.createElement("canvas")
    this.canvas.id = "particle-canvas"
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `

    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext("2d")
    this.resizeCanvas()

    // Redimensionar canvas quando janela muda
    window.addEventListener("resize", () => this.resizeCanvas())
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  // Pré-carregar pool de partículas para performance
  preloadParticlePool() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particlePool.push(this.createParticle())
    }
  }

  // Criar partícula individual
  createParticle() {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 1,
      maxLife: 1,
      size: 1,
      color: "#ffffff",
      type: "circle",
      rotation: 0,
      rotationSpeed: 0,
      gravity: 0,
      friction: 1,
      alpha: 1,
      scale: 1,
      active: false,
    }
  }

  // Obter partícula do pool
  getParticle() {
    for (const particle of this.particlePool) {
      if (!particle.active) {
        particle.active = true
        return particle
      }
    }
    return null // Pool esgotado
  }

  // Retornar partícula ao pool
  releaseParticle(particle) {
    particle.active = false
    const index = this.particles.indexOf(particle)
    if (index > -1) {
      this.particles.splice(index, 1)
    }
  }

  // Configurar listeners de eventos
  setupEventListeners() {
    // Partículas em cliques
    document.addEventListener("click", (e) => {
      this.createClickEffect(e.clientX, e.clientY)
    })

    // Partículas em hover de botões
    document.addEventListener("mouseover", (e) => {
      if (e.target.matches("button, .btn-primary, .btn-secondary, .btn-danger")) {
        this.createHoverEffect(e.target)
      }
    })

    // Partículas em submissão de formulário
    document.addEventListener("submit", (e) => {
      const rect = e.target.getBoundingClientRect()
      this.createSuccessEffect(rect.left + rect.width / 2, rect.top + rect.height / 2)
    })
  }

  // Efeito de clique
  createClickEffect(x, y) {
    const colors = ["#dc2626", "#2563eb", "#10b981", "#f59e0b"]

    for (let i = 0; i < 15; i++) {
      const particle = this.getParticle()
      if (!particle) break

      const angle = (Math.PI * 2 * i) / 15
      const speed = 2 + Math.random() * 4

      Object.assign(particle, {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "circle",
        gravity: 0.1,
        friction: 0.98,
        alpha: 1,
      })

      this.particles.push(particle)
    }
  }

  // Efeito de hover
  createHoverEffect(element) {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    for (let i = 0; i < 8; i++) {
      const particle = this.getParticle()
      if (!particle) break

      Object.assign(particle, {
        x: centerX + (Math.random() - 0.5) * rect.width,
        y: centerY + (Math.random() - 0.5) * rect.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2 - 1,
        life: 1,
        maxLife: 1,
        size: 1 + Math.random() * 2,
        color: "#ffffff",
        type: "sparkle",
        gravity: 0.05,
        friction: 0.99,
        alpha: 0.8,
      })

      this.particles.push(particle)
    }
  }

  // Efeito de sucesso
  createSuccessEffect(x, y) {
    // Confetti explosion
    const colors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"]

    for (let i = 0; i < 30; i++) {
      const particle = this.getParticle()
      if (!particle) break

      const angle = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 6

      Object.assign(particle, {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "confetti",
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.15,
        friction: 0.98,
        alpha: 1,
      })

      this.particles.push(particle)
    }
  }

  // Efeito de erro
  createErrorEffect(x, y) {
    const colors = ["#ef4444", "#f87171", "#fca5a5"]

    for (let i = 0; i < 20; i++) {
      const particle = this.getParticle()
      if (!particle) break

      Object.assign(particle, {
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "smoke",
        gravity: -0.05,
        friction: 0.95,
        alpha: 0.8,
      })

      this.particles.push(particle)
    }
  }

  // Efeito de carregamento
  createLoadingEffect(x, y) {
    const colors = ["#3b82f6", "#60a5fa", "#93c5fd"]

    for (let i = 0; i < 12; i++) {
      const particle = this.getParticle()
      if (!particle) break

      const angle = (Math.PI * 2 * i) / 12
      const radius = 30 + Math.sin(Date.now() * 0.005 + i) * 10

      Object.assign(particle, {
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 0.5,
        vy: Math.sin(angle) * 0.5,
        life: 1,
        maxLife: 1,
        size: 2 + Math.sin(Date.now() * 0.01 + i) * 1,
        color: colors[i % colors.length],
        type: "circle",
        gravity: 0,
        friction: 1,
        alpha: 0.7 + Math.sin(Date.now() * 0.01 + i) * 0.3,
      })

      this.particles.push(particle)
    }
  }

  // Efeito de trail do mouse
  createMouseTrail(x, y) {
    if (Math.random() > 0.7) return // Reduzir frequência

    const particle = this.getParticle()
    if (!particle) return

    Object.assign(particle, {
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      life: 1,
      maxLife: 0.5,
      size: 1 + Math.random() * 2,
      color: "#ffffff",
      type: "trail",
      gravity: 0,
      friction: 0.95,
      alpha: 0.3,
    })

    this.particles.push(particle)
  }

  // Atualizar partículas
  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]

      // Atualizar física
      particle.vy += particle.gravity
      particle.vx *= particle.friction
      particle.vy *= particle.friction

      particle.x += particle.vx
      particle.y += particle.vy

      particle.rotation += particle.rotationSpeed

      // Atualizar vida
      particle.life -= deltaTime * 0.001
      particle.alpha = particle.life / particle.maxLife

      // Remover partículas mortas
      if (particle.life <= 0 || particle.y > window.innerHeight + 100) {
        this.releaseParticle(particle)
      }
    }
  }

  // Renderizar partículas
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const particle of this.particles) {
      this.ctx.save()

      this.ctx.globalAlpha = particle.alpha
      this.ctx.translate(particle.x, particle.y)
      this.ctx.rotate(particle.rotation)

      switch (particle.type) {
        case "circle":
          this.renderCircle(particle)
          break
        case "sparkle":
          this.renderSparkle(particle)
          break
        case "confetti":
          this.renderConfetti(particle)
          break
        case "smoke":
          this.renderSmoke(particle)
          break
        case "trail":
          this.renderTrail(particle)
          break
      }

      this.ctx.restore()
    }
  }

  renderCircle(particle) {
    this.ctx.fillStyle = particle.color
    this.ctx.beginPath()
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
    this.ctx.fill()
  }

  renderSparkle(particle) {
    this.ctx.fillStyle = particle.color
    this.ctx.beginPath()
    this.ctx.moveTo(0, -particle.size)
    this.ctx.lineTo(particle.size * 0.3, -particle.size * 0.3)
    this.ctx.lineTo(particle.size, 0)
    this.ctx.lineTo(particle.size * 0.3, particle.size * 0.3)
    this.ctx.lineTo(0, particle.size)
    this.ctx.lineTo(-particle.size * 0.3, particle.size * 0.3)
    this.ctx.lineTo(-particle.size, 0)
    this.ctx.lineTo(-particle.size * 0.3, -particle.size * 0.3)
    this.ctx.closePath()
    this.ctx.fill()
  }

  renderConfetti(particle) {
    this.ctx.fillStyle = particle.color
    this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
  }

  renderSmoke(particle) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size)
    gradient.addColorStop(0, particle.color)
    gradient.addColorStop(1, "transparent")
    this.ctx.fillStyle = gradient
    this.ctx.beginPath()
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
    this.ctx.fill()
  }

  renderTrail(particle) {
    this.ctx.fillStyle = particle.color
    this.ctx.beginPath()
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
    this.ctx.fill()
  }

  // Loop principal
  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.lastTime = performance.now()

    const loop = (currentTime) => {
      if (!this.isRunning) return

      const deltaTime = currentTime - this.lastTime
      this.lastTime = currentTime

      this.update(deltaTime)
      this.render()

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }

  stop() {
    this.isRunning = false
  }

  // Métodos públicos para efeitos específicos
  explode(x, y, options = {}) {
    const { count = 20, colors = ["#dc2626", "#2563eb", "#10b981"], size = 3, speed = 5, type = "circle" } = options

    for (let i = 0; i < count; i++) {
      const particle = this.getParticle()
      if (!particle) break

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const particleSpeed = speed * (0.5 + Math.random() * 0.5)

      Object.assign(particle, {
        x: x,
        y: y,
        vx: Math.cos(angle) * particleSpeed,
        vy: Math.sin(angle) * particleSpeed,
        life: 1,
        maxLife: 1 + Math.random(),
        size: size * (0.5 + Math.random() * 0.5),
        color: colors[Math.floor(Math.random() * colors.length)],
        type: type,
        gravity: 0.1,
        friction: 0.98,
        alpha: 1,
      })

      this.particles.push(particle)
    }
  }

  // Efeito de chuva de partículas
  rain(options = {}) {
    const { count = 5, colors = ["#3b82f6"], type = "circle" } = options

    for (let i = 0; i < count; i++) {
      const particle = this.getParticle()
      if (!particle) break

      Object.assign(particle, {
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        life: 1,
        maxLife: 3,
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: type,
        gravity: 0.05,
        friction: 0.99,
        alpha: 0.7,
      })

      this.particles.push(particle)
    }
  }

  // Limpar todas as partículas
  clear() {
    for (const particle of this.particles) {
      this.releaseParticle(particle)
    }
    this.particles = []
  }

  // Configurar trail do mouse
  enableMouseTrail() {
    document.addEventListener("mousemove", (e) => {
      this.createMouseTrail(e.clientX, e.clientY)
    })
  }

  // Efeito de digitação
  createTypingEffect(element) {
    const rect = element.getBoundingClientRect()

    const particle = this.getParticle()
    if (!particle) return

    Object.assign(particle, {
      x: rect.right,
      y: rect.top + rect.height / 2,
      vx: 1,
      vy: -0.5,
      life: 1,
      maxLife: 0.5,
      size: 2,
      color: "#10b981",
      type: "circle",
      gravity: 0,
      friction: 0.95,
      alpha: 0.8,
    })

    this.particles.push(particle)
  }
}
