// Demonstração dos Efeitos - Para Testes e Showcase
class EffectsDemo {
  constructor() {
    this.coordinator = null
    this.demoPanel = null
    this.init()
  }

  init() {
    // Aguardar inicialização do coordenador
    setTimeout(() => {
      this.coordinator = window.app?.getSystem("Effects Coordinator")
      if (this.coordinator) {
        this.createDemoPanel()
      }
    }, 3000)
  }

  createDemoPanel() {
    this.demoPanel = document.createElement("div")
    this.demoPanel.className = "effects-demo-panel"
    this.demoPanel.innerHTML = `
      <div class="demo-header">
        <h3>🎭 Demo de Efeitos</h3>
        <button class="demo-toggle">×</button>
      </div>
      <div class="demo-content">
        <div class="demo-section">
          <h4>🎵 Sons</h4>
          <div class="demo-buttons">
            <button data-sound="click">Click</button>
            <button data-sound="hover">Hover</button>
            <button data-sound="success">Success</button>
            <button data-sound="error">Error</button>
            <button data-sound="notification">Notification</button>
            <button data-sound="whoosh">Whoosh</button>
            <button data-sound="pop">Pop</button>
            <button data-sound="chime">Chime</button>
          </div>
        </div>

        <div class="demo-section">
          <h4>✨ Partículas</h4>
          <div class="demo-buttons">
            <button data-particles="explosion">Explosão</button>
            <button data-particles="confetti">Confetti</button>
            <button data-particles="sparkles">Sparkles</button>
            <button data-particles="smoke">Fumaça</button>
            <button data-particles="rain">Chuva</button>
            <button data-particles="fireworks">Fogos</button>
          </div>
        </div>

        <div class="demo-section">
          <h4>🎪 Efeitos Combinados</h4>
          <div class="demo-buttons">
            <button data-combo="celebration">Celebração</button>
            <button data-combo="achievement">Conquista</button>
            <button data-combo="magic">Mágica</button>
            <button data-combo="portal">Portal</button>
            <button data-combo="rainbow">Arco-íris</button>
          </div>
        </div>

        <div class="demo-section">
          <h4>⚙️ Controles</h4>
          <div class="demo-controls">
            <label>
              <input type="checkbox" id="enableSounds" checked> Sons
            </label>
            <label>
              <input type="checkbox" id="enableParticles" checked> Partículas
            </label>
            <label>
              <input type="range" id="volumeControl" min="0" max="1" step="0.1" value="0.3"> Volume
            </label>
          </div>
        </div>
      </div>
    `

    this.demoPanel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      width: 280px;
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      box-shadow: var(--shadow-xl);
      z-index: 15000;
      font-family: 'Inter', sans-serif;
      transition: all 0.3s ease;
    `

    document.body.appendChild(this.demoPanel)

    this.setupDemoListeners()
    this.addDemoStyles()
  }

  setupDemoListeners() {
    // Toggle panel
    const toggle = this.demoPanel.querySelector(".demo-toggle")
    const content = this.demoPanel.querySelector(".demo-content")
    let isExpanded = true

    toggle.addEventListener("click", () => {
      isExpanded = !isExpanded
      content.style.display = isExpanded ? "block" : "none"
      toggle.textContent = isExpanded ? "×" : "🎭"
    })

    // Sound buttons
    this.demoPanel.querySelectorAll("[data-sound]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const sound = e.target.dataset.sound
        this.coordinator.soundSystem?.play(sound)
        this.createButtonEffect(e.target)
      })
    })

    // Particle buttons
    this.demoPanel.querySelectorAll("[data-particles]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const type = e.target.dataset.particles
        this.createParticleDemo(type, e.clientX, e.clientY)
        this.createButtonEffect(e.target)
      })
    })

    // Combo buttons
    this.demoPanel.querySelectorAll("[data-combo]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const combo = e.target.dataset.combo
        this.createComboEffect(combo)
        this.createButtonEffect(e.target)
      })
    })

    // Controls
    const enableSounds = this.demoPanel.querySelector("#enableSounds")
    const enableParticles = this.demoPanel.querySelector("#enableParticles")
    const volumeControl = this.demoPanel.querySelector("#volumeControl")

    enableSounds.addEventListener("change", (e) => {
      if (this.coordinator.soundSystem) {
        this.coordinator.soundSystem.enabled = e.target.checked
      }
    })

    enableParticles.addEventListener("change", (e) => {
      if (this.coordinator.particleSystem) {
        if (e.target.checked) {
          this.coordinator.particleSystem.start()
        } else {
          this.coordinator.particleSystem.stop()
        }
      }
    })

    volumeControl.addEventListener("input", (e) => {
      if (this.coordinator.soundSystem) {
        this.coordinator.soundSystem.setVolume(Number.parseFloat(e.target.value))
      }
    })
  }

  createButtonEffect(button) {
    button.style.transform = "scale(0.95)"
    button.style.background = "var(--accent-primary)"
    button.style.color = "white"

    setTimeout(() => {
      button.style.transform = ""
      button.style.background = ""
      button.style.color = ""
    }, 150)
  }

  createParticleDemo(type, x, y) {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    switch (type) {
      case "explosion":
        this.coordinator.particleSystem?.explode(centerX, centerY, {
          count: 30,
          colors: ["#ef4444", "#f97316", "#eab308"],
          size: 4,
          speed: 6,
          type: "circle",
        })
        break

      case "confetti":
        this.coordinator.particleSystem?.explode(centerX, centerY, {
          count: 50,
          colors: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"],
          size: 5,
          speed: 8,
          type: "confetti",
        })
        break

      case "sparkles":
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            this.coordinator.particleSystem?.explode(
              centerX + (Math.random() - 0.5) * 200,
              centerY + (Math.random() - 0.5) * 200,
              {
                count: 5,
                colors: ["#ffffff", "#fbbf24"],
                size: 3,
                speed: 3,
                type: "sparkle",
              },
            )
          }, i * 100)
        }
        break

      case "smoke":
        this.coordinator.particleSystem?.explode(centerX, centerY, {
          count: 25,
          colors: ["#6b7280", "#9ca3af"],
          size: 6,
          speed: 2,
          type: "smoke",
        })
        break

      case "rain":
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            this.coordinator.particleSystem?.rain({
              count: 5,
              colors: ["#3b82f6", "#60a5fa"],
              type: "circle",
            })
          }, i * 200)
        }
        break

      case "fireworks":
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const x = Math.random() * window.innerWidth
            const y = Math.random() * window.innerHeight * 0.6

            this.coordinator.particleSystem?.explode(x, y, {
              count: 25,
              colors: ["#ef4444", "#10b981", "#3b82f6", "#fbbf24", "#8b5cf6"],
              size: 4,
              speed: 7,
              type: "confetti",
            })
          }, i * 800)
        }
        break
    }
  }

  createComboEffect(combo) {
    switch (combo) {
      case "celebration":
        this.coordinator.createCelebrationEffect()
        break

      case "achievement":
        this.coordinator.createAchievementEffect("Demo Achievement!")
        break

      case "magic":
        this.coordinator.soundSystem?.play("chime")
        this.createMagicEffect()
        break

      case "portal":
        this.coordinator.soundSystem?.play("whoosh")
        this.createPortalEffect()
        break

      case "rainbow":
        this.createRainbowEffect()
        break
    }
  }

  createMagicEffect() {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    // Círculo mágico
    for (let i = 0; i < 36; i++) {
      setTimeout(() => {
        const angle = (i * 10 * Math.PI) / 180
        const radius = 100
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        this.coordinator.particleSystem?.explode(x, y, {
          count: 3,
          colors: ["#8b5cf6", "#a855f7"],
          size: 2,
          speed: 2,
          type: "sparkle",
        })
      }, i * 50)
    }
  }

  createPortalEffect() {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    // Espiral de portal
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const angle = (i * 20 * Math.PI) / 180
        const radius = i * 3
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        this.coordinator.particleSystem?.explode(x, y, {
          count: 2,
          colors: ["#3b82f6", "#1d4ed8"],
          size: 3,
          speed: 4,
          type: "circle",
        })
      }, i * 30)
    }
  }

  createRainbowEffect() {
    const colors = ["#ef4444", "#f97316", "#eab308", "#10b981", "#3b82f6", "#8b5cf6"]
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    colors.forEach((color, index) => {
      setTimeout(() => {
        for (let i = 0; i < 20; i++) {
          const angle = (i * 18 * Math.PI) / 180
          const radius = 80 + index * 20
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          this.coordinator.particleSystem?.explode(x, y, {
            count: 2,
            colors: [color],
            size: 3,
            speed: 2,
            type: "circle",
          })
        }
      }, index * 200)
    })
  }

  addDemoStyles() {
    const styles = document.createElement("style")
    styles.textContent = `
      .effects-demo-panel {
        font-size: 14px;
      }

      .demo-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-secondary);
        border-radius: 16px 16px 0 0;
      }

      .demo-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
      }

      .demo-toggle {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .demo-toggle:hover {
        background: var(--bg-tertiary);
        color: var(--accent-primary);
      }

      .demo-content {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }

      .demo-section {
        margin-bottom: 20px;
      }

      .demo-section h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
      }

      .demo-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .demo-buttons button {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12px;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .demo-buttons button:hover {
        background: var(--bg-tertiary);
        border-color: var(--accent-primary);
        transform: translateY(-1px);
      }

      .demo-controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .demo-controls label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--text-primary);
      }

      .demo-controls input[type="checkbox"] {
        width: 16px;
        height: 16px;
      }

      .demo-controls input[type="range"] {
        flex: 1;
        height: 4px;
        background: var(--bg-tertiary);
        border-radius: 2px;
        outline: none;
      }

      .demo-controls input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        background: var(--accent-primary);
        border-radius: 50%;
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .effects-demo-panel {
          display: none;
        }
      }
    `

    document.head.appendChild(styles)
  }

  // Método para mostrar/esconder o painel
  toggle() {
    if (this.demoPanel) {
      const isVisible = this.demoPanel.style.display !== "none"
      this.demoPanel.style.display = isVisible ? "none" : "block"
    }
  }

  // Método para executar demo automático
  runAutoDemo() {
    const effects = ["celebration", "magic", "portal", "rainbow"]
    let index = 0

    const runNext = () => {
      if (index < effects.length) {
        this.createComboEffect(effects[index])
        index++
        setTimeout(runNext, 3000)
      }
    }

    runNext()
  }
}

// Inicializar demo quando a aplicação estiver pronta
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.effectsDemo = new EffectsDemo()

    // Atalho de teclado para mostrar/esconder demo (Ctrl+Shift+D)
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault()
        window.effectsDemo?.toggle()
      }
    })
  }, 4000)
})
