// Sistema de Animações de Dados e Estatísticas
class DataAnimations {
  constructor() {
    this.counters = []
    this.charts = []
    this.progressBars = []
    this.init()
  }

  init() {
    this.setupCounterAnimations()
    this.createStatisticsPanel()
    this.setupProgressBars()
    this.createCharts()
    this.setupRealTimeUpdates()
  }

  // Configurar animações de contador
  setupCounterAnimations() {
    // Encontrar todos os contadores
    const counters = document.querySelectorAll("[data-counter]")
    counters.forEach((counter) => {
      this.setupCounter(counter)
    })

    // Contador de visitas existente
    const visitCounter = document.getElementById("visitCount")
    if (visitCounter) {
      this.animateCounter(visitCounter, 0, Number.parseInt(visitCounter.textContent) || 0, 2000)
    }
  }

  // Configurar contador individual
  setupCounter(element) {
    const target = Number.parseInt(element.getAttribute("data-counter"))
    const duration = Number.parseInt(element.getAttribute("data-duration")) || 2000
    const start = Number.parseInt(element.getAttribute("data-start")) || 0

    this.animateCounter(element, start, target, duration)
  }

  // Animar contador
  animateCounter(element, start, end, duration) {
    const startTime = performance.now()
    const difference = end - start

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(start + difference * easeProgress)

      element.textContent = this.formatNumber(current)

      // Adicionar efeito de brilho durante a animação
      if (progress < 1) {
        element.style.textShadow = `0 0 ${10 * (1 - progress)}px var(--accent-primary)`
        requestAnimationFrame(updateCounter)
      } else {
        element.style.textShadow = ""
        element.classList.add("counter-complete")
      }
    }

    requestAnimationFrame(updateCounter)
  }

  // Formatar número
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Criar painel de estatísticas
  createStatisticsPanel() {
    const statsPanel = document.createElement("div")
    statsPanel.className = "statistics-panel"
    statsPanel.innerHTML = `
      <div class="stats-header">
        <h3>Estatísticas em Tempo Real</h3>
        <button class="stats-toggle" data-tooltip="Mostrar/Ocultar Estatísticas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </button>
      </div>
      <div class="stats-content">
        <div class="stat-item">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-label">Total de Agendamentos</span>
            <span class="stat-value" data-counter="0" data-duration="2000">0</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" data-progress="0"></div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">✂️</div>
          <div class="stat-info">
            <span class="stat-label">Barbeiros Ativos</span>
            <span class="stat-value" data-counter="3" data-duration="1500">0</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" data-progress="100"></div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <span class="stat-label">Agendamentos Hoje</span>
            <span class="stat-value" data-counter="0" data-duration="1800">0</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" data-progress="0"></div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <span class="stat-label">Satisfação</span>
            <span class="stat-value" data-counter="98" data-duration="2500">0</span>
            <span class="stat-unit">%</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" data-progress="98"></div>
          </div>
        </div>

        <div class="stats-chart">
          <canvas id="appointmentsChart" width="300" height="150"></canvas>
        </div>
      </div>
    `

    // Adicionar estilos
    statsPanel.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      width: 320px;
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      box-shadow: var(--shadow-xl);
      z-index: 1000;
      transform: translateX(100%);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `

    document.body.appendChild(statsPanel)

    // Configurar toggle
    this.setupStatsToggle(statsPanel)

    // Animar entrada após delay
    setTimeout(() => {
      this.updateStatistics()
      this.animateStatsPanel(statsPanel)
    }, 2000)
  }

  // Configurar toggle do painel
  setupStatsToggle(panel) {
    const toggle = panel.querySelector(".stats-toggle")
    const content = panel.querySelector(".stats-content")
    let isExpanded = true

    toggle.addEventListener("click", () => {
      isExpanded = !isExpanded

      if (isExpanded) {
        content.style.maxHeight = content.scrollHeight + "px"
        content.style.opacity = "1"
        toggle.style.transform = "rotate(0deg)"
      } else {
        content.style.maxHeight = "0"
        content.style.opacity = "0"
        toggle.style.transform = "rotate(180deg)"
      }
    })
  }

  // Animar painel de estatísticas
  animateStatsPanel(panel) {
    panel.style.transform = "translateX(0)"

    // Animar itens individualmente
    const items = panel.querySelectorAll(".stat-item")
    items.forEach((item, index) => {
      item.style.opacity = "0"
      item.style.transform = "translateX(30px)"

      setTimeout(() => {
        item.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
        item.style.opacity = "1"
        item.style.transform = "translateX(0)"
      }, index * 200)
    })

    // Animar contadores
    setTimeout(() => {
      const counters = panel.querySelectorAll("[data-counter]")
      counters.forEach((counter) => {
        this.setupCounter(counter)
      })
    }, 800)
  }

  // Configurar barras de progresso
  setupProgressBars() {
    const progressBars = document.querySelectorAll("[data-progress]")
    progressBars.forEach((bar) => {
      this.animateProgressBar(bar)
    })
  }

  // Animar barra de progresso
  animateProgressBar(bar) {
    const progress = Number.parseInt(bar.getAttribute("data-progress"))
    const duration = Number.parseInt(bar.getAttribute("data-duration")) || 2000

    bar.style.width = "0%"
    bar.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

    setTimeout(() => {
      bar.style.width = progress + "%"

      // Adicionar efeito de brilho
      bar.style.boxShadow = `0 0 10px var(--accent-primary)`

      setTimeout(() => {
        bar.style.boxShadow = ""
      }, duration)
    }, 500)
  }

  // Criar gráficos
  createCharts() {
    const canvas = document.getElementById("appointmentsChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    this.createAppointmentsChart(ctx, canvas)
  }

  // Criar gráfico de agendamentos
  createAppointmentsChart(ctx, canvas) {
    const data = this.generateChartData()
    const width = canvas.width
    const height = canvas.height

    // Limpar canvas
    ctx.clearRect(0, 0, width, height)

    // Configurações
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Animar desenho do gráfico
    this.animateChart(ctx, data, padding, chartWidth, chartHeight)
  }

  // Animar gráfico
  animateChart(ctx, data, padding, chartWidth, chartHeight) {
    const maxValue = Math.max(...data.values)
    let animationProgress = 0
    const animationDuration = 2000
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      animationProgress = Math.min(elapsed / animationDuration, 1)

      // Easing
      const easeProgress = 1 - Math.pow(1 - animationProgress, 3)

      // Limpar canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      // Desenhar gráfico
      this.drawChart(ctx, data, padding, chartWidth, chartHeight, maxValue, easeProgress)

      if (animationProgress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  // Desenhar gráfico
  drawChart(ctx, data, padding, chartWidth, chartHeight, maxValue, progress) {
    const stepX = chartWidth / (data.labels.length - 1)

    // Configurar estilo
    ctx.strokeStyle = "var(--accent-primary)"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Desenhar linha
    ctx.beginPath()
    data.values.forEach((value, index) => {
      const x = padding + index * stepX
      const y = padding + chartHeight - (value / maxValue) * chartHeight * progress

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Desenhar pontos
    ctx.fillStyle = "var(--accent-primary)"
    data.values.forEach((value, index) => {
      const x = padding + index * stepX
      const y = padding + chartHeight - (value / maxValue) * chartHeight * progress

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Desenhar labels
    ctx.fillStyle = "var(--text-secondary)"
    ctx.font = "12px Inter"
    ctx.textAlign = "center"

    data.labels.forEach((label, index) => {
      const x = padding + index * stepX
      const y = padding + chartHeight + 20

      ctx.fillText(label, x, y)
    })
  }

  // Gerar dados do gráfico
  generateChartData() {
    return {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      values: [12, 19, 8, 15, 22, 18],
    }
  }

  // Configurar atualizações em tempo real
  setupRealTimeUpdates() {
    // Simular atualizações em tempo real
    setInterval(() => {
      this.updateStatistics()
    }, 30000) // Atualizar a cada 30 segundos
  }

  // Atualizar estatísticas
  updateStatistics() {
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const today = new Date().toISOString().split("T")[0]
    const todayAppointments = appointments.filter((apt) => apt.date === today)

    // Atualizar contadores
    this.updateCounter("[data-counter]", appointments.length, 0)
    this.updateCounter(".stat-item:nth-child(3) .stat-value", todayAppointments.length, 1)

    // Atualizar barras de progresso
    this.updateProgressBar(".stat-item:nth-child(1) .progress-bar", (appointments.length / 100) * 100)
    this.updateProgressBar(".stat-item:nth-child(3) .progress-bar", (todayAppointments.length / 20) * 100)
  }

  // Atualizar contador específico
  updateCounter(selector, newValue, index = 0) {
    const elements = document.querySelectorAll(selector)
    const element = elements[index]

    if (element) {
      const currentValue = Number.parseInt(element.textContent) || 0
      if (currentValue !== newValue) {
        this.animateCounter(element, currentValue, newValue, 1000)
      }
    }
  }

  // Atualizar barra de progresso específica
  updateProgressBar(selector, newProgress) {
    const bar = document.querySelector(selector)
    if (bar) {
      bar.style.transition = "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
      bar.style.width = Math.min(newProgress, 100) + "%"
    }
  }

  // Criar animação de número flutuante
  createFloatingNumber(element, value, color = "var(--success)") {
    const floatingNumber = document.createElement("div")
    floatingNumber.textContent = `+${value}`
    floatingNumber.style.cssText = `
      position: absolute;
      color: ${color};
      font-weight: bold;
      font-size: 14px;
      pointer-events: none;
      z-index: 1000;
      animation: floatingNumber 2s ease-out forwards;
    `

    const rect = element.getBoundingClientRect()
    floatingNumber.style.left = rect.right + "px"
    floatingNumber.style.top = rect.top + "px"

    document.body.appendChild(floatingNumber)

    setTimeout(() => {
      floatingNumber.remove()
    }, 2000)
  }

  // Método público para animar qualquer número
  animateNumber(element, targetValue, duration = 2000) {
    const startValue = Number.parseInt(element.textContent) || 0
    this.animateCounter(element, startValue, targetValue, duration)
  }

  // Método público para criar gráfico customizado
  createCustomChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    this.createAppointmentsChart(ctx, canvas)
  }
}
