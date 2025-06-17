// Sistema de Efeitos Sonoros
class SoundSystem {
  constructor() {
    this.sounds = {}
    this.audioContext = null
    this.masterVolume = 0.3
    this.enabled = true
    this.soundQueue = []
    this.isInitialized = false
    this.init()
  }

  async init() {
    try {
      // Criar contexto de áudio
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // Criar sons procedurais
      await this.createProceduralSounds()

      // Configurar listeners
      this.setupEventListeners()

      // Configurar controles de usuário
      this.createVolumeControl()

      this.isInitialized = true
      console.log("🔊 Sistema de som inicializado")
    } catch (error) {
      console.warn("⚠️ Sistema de som não disponível:", error)
      this.enabled = false
    }
  }

  // Criar sons procedurais (sem arquivos externos)
  async createProceduralSounds() {
    this.sounds = {
      click: this.createClickSound(),
      hover: this.createHoverSound(),
      success: this.createSuccessSound(),
      error: this.createErrorSound(),
      notification: this.createNotificationSound(),
      typing: this.createTypingSound(),
      whoosh: this.createWhooshSound(),
      pop: this.createPopSound(),
      chime: this.createChimeSound(),
      tick: this.createTickSound(),
    }
  }

  // Criar som de clique
  createClickSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.1)
    }
  }

  // Criar som de hover
  createHoverSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.05)

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.05)
    }
  }

  // Criar som de sucesso
  createSuccessSound() {
    return () => {
      // Acorde de sucesso
      const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime)
        oscillator.type = "sine"

        const startTime = this.audioContext.currentTime + index * 0.1
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4)

        oscillator.start(startTime)
        oscillator.stop(startTime + 0.4)
      })
    }
  }

  // Criar som de erro
  createErrorSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.2)
      oscillator.type = "sawtooth"

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.2)
    }
  }

  // Criar som de notificação
  createNotificationSound() {
    return () => {
      const frequencies = [800, 1000, 800]

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime)
        oscillator.type = "sine"

        const startTime = this.audioContext.currentTime + index * 0.15
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1)

        oscillator.start(startTime)
        oscillator.stop(startTime + 0.1)
      })
    }
  }

  // Criar som de digitação
  createTypingSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(1200 + Math.random() * 200, this.audioContext.currentTime)
      oscillator.type = "square"

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.05, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.03)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.03)
    }
  }

  // Criar som whoosh
  createWhooshSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      const filter = this.audioContext.createBiquadFilter()

      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3)
      oscillator.type = "sawtooth"

      filter.type = "lowpass"
      filter.frequency.setValueAtTime(2000, this.audioContext.currentTime)
      filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3)

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    }
  }

  // Criar som pop
  createPopSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.1)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.1)
    }
  }

  // Criar som chime
  createChimeSound() {
    return () => {
      const frequencies = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime)
        oscillator.type = "sine"

        const startTime = this.audioContext.currentTime + index * 0.2
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.15, startTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1)

        oscillator.start(startTime)
        oscillator.stop(startTime + 1)
      })
    }
  }

  // Criar som tick
  createTickSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime)
      oscillator.type = "square"

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime + 0.005)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.02)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.02)
    }
  }

  // Configurar listeners de eventos
  setupEventListeners() {
    // Som em cliques
    document.addEventListener("click", (e) => {
      if (e.target.matches("button, .btn-primary, .btn-secondary, .btn-danger")) {
        this.play("click")
      } else {
        this.play("tick")
      }
    })

    // Som em hover
    document.addEventListener("mouseover", (e) => {
      if (e.target.matches("button, .btn-primary, .btn-secondary, .btn-danger, .nav-link")) {
        this.play("hover")
      }
    })

    // Som em digitação
    document.addEventListener("input", (e) => {
      if (e.target.matches("input, textarea")) {
        this.play("typing")
      }
    })

    // Som em submissão de formulário
    document.addEventListener("submit", () => {
      this.play("whoosh")
    })

    // Som em mudança de página
    window.addEventListener("beforeunload", () => {
      this.play("whoosh")
    })

    // Ativar contexto de áudio na primeira interação
    document.addEventListener(
      "click",
      () => {
        if (this.audioContext && this.audioContext.state === "suspended") {
          this.audioContext.resume()
        }
      },
      { once: true },
    )
  }

  // Criar controle de volume
  createVolumeControl() {
    const volumeControl = document.createElement("div")
    volumeControl.className = "sound-control"
    volumeControl.innerHTML = `
      <button class="sound-toggle" title="Ativar/Desativar Sons">
        <svg class="sound-on" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        <svg class="sound-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="display: none;">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      </button>
      <div class="volume-slider" style="display: none;">
        <input type="range" min="0" max="1" step="0.1" value="${this.masterVolume}" class="volume-input">
      </div>
    `

    volumeControl.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 12px;
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.3s ease;
    `

    document.body.appendChild(volumeControl)

    // Configurar toggle
    const toggle = volumeControl.querySelector(".sound-toggle")
    const slider = volumeControl.querySelector(".volume-slider")
    const volumeInput = volumeControl.querySelector(".volume-input")
    const soundOn = volumeControl.querySelector(".sound-on")
    const soundOff = volumeControl.querySelector(".sound-off")

    toggle.addEventListener("click", () => {
      this.enabled = !this.enabled
      soundOn.style.display = this.enabled ? "block" : "none"
      soundOff.style.display = this.enabled ? "none" : "block"

      if (this.enabled) {
        this.play("pop")
      }
    })

    // Mostrar slider no hover
    volumeControl.addEventListener("mouseenter", () => {
      slider.style.display = "block"
      volumeControl.style.width = "auto"
    })

    volumeControl.addEventListener("mouseleave", () => {
      slider.style.display = "none"
    })

    // Controle de volume
    volumeInput.addEventListener("input", (e) => {
      this.masterVolume = Number.parseFloat(e.target.value)
      this.play("tick")
    })

    // Estilos para o controle
    const controlStyles = document.createElement("style")
    controlStyles.textContent = `
      .sound-toggle {
        background: none;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sound-toggle:hover {
        background: var(--bg-secondary);
        color: var(--accent-primary);
      }

      .sound-toggle svg {
        width: 20px;
        height: 20px;
      }

      .volume-slider {
        transition: all 0.3s ease;
      }

      .volume-input {
        width: 80px;
        height: 4px;
        background: var(--bg-tertiary);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }

      .volume-input::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        background: var(--accent-primary);
        border-radius: 50%;
        cursor: pointer;
      }

      .volume-input::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: var(--accent-primary);
        border-radius: 50%;
        cursor: pointer;
        border: none;
      }
    `

    document.head.appendChild(controlStyles)
  }

  // Tocar som
  play(soundName, options = {}) {
    if (!this.enabled || !this.isInitialized || !this.sounds[soundName]) {
      return
    }

    try {
      // Verificar se contexto está ativo
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume()
      }

      // Tocar som
      this.sounds[soundName]()
    } catch (error) {
      console.warn("⚠️ Erro ao tocar som:", error)
    }
  }

  // Tocar sequência de sons
  playSequence(sounds, interval = 200) {
    sounds.forEach((sound, index) => {
      setTimeout(() => {
        this.play(sound)
      }, index * interval)
    })
  }

  // Configurar volume
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  // Ativar/desativar sons
  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }

  // Tocar som de sucesso com efeito especial
  playSuccess() {
    this.play("success")
    setTimeout(() => this.play("chime"), 500)
  }

  // Tocar som de erro com efeito especial
  playError() {
    this.play("error")
    setTimeout(() => this.play("error"), 100)
  }

  // Tocar som de carregamento (loop)
  startLoadingSound() {
    if (this.loadingInterval) return

    this.loadingInterval = setInterval(() => {
      this.play("tick")
    }, 500)
  }

  stopLoadingSound() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval)
      this.loadingInterval = null
    }
  }

  // Limpar recursos
  destroy() {
    this.stopLoadingSound()
    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}
