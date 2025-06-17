import { getBarbers, getAppointmentsForDate } from "./utils.js"

// Horários disponíveis
const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
]

// Elementos do DOM
const appointmentForm = document.getElementById("appointmentForm")
const barberSelect = document.getElementById("barberSelect")
const dateInput = document.getElementById("dateInput")
const timeSelect = document.getElementById("timeSelect")
const messageElement = document.getElementById("message")
const visitCountElement = document.getElementById("visitCount")

// Inicialização
document.addEventListener("DOMContentLoaded", async () => {
  await loadBarbers()
  setupEventListeners()
  updateVisitCount()
  setMinDate()
  initializeAnimations()
})

// Inicializar animações
function initializeAnimations() {
  // Animar contador de visitas
  animateCounter()

  // Adicionar animações de entrada para elementos
  const elements = document.querySelectorAll(".form-group")
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

// Animar contador
function animateCounter() {
  const counter = visitCountElement
  const finalValue = Number.parseInt(counter.textContent)
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

// Carregar barbeiros
async function loadBarbers() {
  try {
    // Mostrar loading
    barberSelect.innerHTML = '<option value="">Carregando barbeiros...</option>'
    barberSelect.classList.add("loading")

    const barbers = await getBarbers()

    // Simular delay para mostrar animação
    setTimeout(() => {
      barberSelect.classList.remove("loading")
      barberSelect.innerHTML = '<option value="">Selecione um barbeiro</option>'

      barbers.forEach((barber, index) => {
        const option = document.createElement("option")
        option.value = barber.id
        option.textContent = barber.name
        barberSelect.appendChild(option)

        // Animar entrada das opções
        setTimeout(() => {
          option.style.animation = "fadeIn 0.3s ease-out"
        }, index * 50)
      })
    }, 800)
  } catch (error) {
    console.error("Erro ao carregar barbeiros:", error)
    showMessage("Erro ao carregar barbeiros", "error")
    barberSelect.classList.remove("loading")
  }
}

// Configurar event listeners
function setupEventListeners() {
  appointmentForm.addEventListener("submit", handleSubmit)
  barberSelect.addEventListener("change", updateAvailableTimes)
  dateInput.addEventListener("change", updateAvailableTimes)

  // Adicionar animações aos inputs
  const inputs = document.querySelectorAll(".form-input, .form-select, .form-textarea")
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.style.transform = "scale(1.02)"
    })

    input.addEventListener("blur", () => {
      input.parentElement.style.transform = "scale(1)"
    })
  })
}

// Atualizar horários disponíveis
async function updateAvailableTimes() {
  const barberId = barberSelect.value
  const date = dateInput.value

  if (!barberId || !date) {
    timeSelect.innerHTML = '<option value="">Selecione um barbeiro e data</option>'
    timeSelect.disabled = true
    return
  }

  try {
    // Mostrar loading
    timeSelect.classList.add("loading")
    timeSelect.disabled = true

    const appointments = await getAppointmentsForDate(date, barberId)
    const bookedTimes = appointments.map((apt) => apt.time)
    const availableTimes = timeSlots.filter((time) => !bookedTimes.includes(time))

    // Filtrar horários passados se a data selecionada for hoje
    const today = new Date()
    const selectedDate = new Date(date + "T00:00:00")
    const isToday = selectedDate.toDateString() === today.toDateString()

    let finalAvailableTimes = availableTimes

    if (isToday) {
      const currentTime = today.getHours() * 100 + today.getMinutes()
      finalAvailableTimes = availableTimes.filter((time) => {
        const [hours, minutes] = time.split(":").map(Number)
        const timeInMinutes = hours * 100 + minutes
        return timeInMinutes > currentTime
      })
    }

    // Simular delay para mostrar animação
    setTimeout(() => {
      timeSelect.classList.remove("loading")
      timeSelect.innerHTML = ""
      timeSelect.disabled = false

      if (finalAvailableTimes.length === 0) {
        timeSelect.innerHTML = '<option value="">Nenhum horário disponível</option>'
        timeSelect.disabled = true
        showTimeError(
          "Não há horários disponíveis para esta data e barbeiro. Por favor, selecione outra data ou barbeiro.",
        )
      } else {
        timeSelect.innerHTML = '<option value="">Selecione um horário</option>'
        finalAvailableTimes.forEach((time, index) => {
          const option = document.createElement("option")
          option.value = time
          option.textContent = time
          timeSelect.appendChild(option)

          // Animar entrada das opções
          setTimeout(() => {
            option.style.animation = "slideInRight 0.3s ease-out"
          }, index * 30)
        })
        hideTimeError()
      }
    }, 500)
  } catch (error) {
    console.error("Erro ao buscar horários:", error)
    showTimeError("Erro ao carregar horários disponíveis.")
    timeSelect.classList.remove("loading")
  }
}

// Manipular envio do formulário
async function handleSubmit(e) {
  e.preventDefault()

  const submitButton = e.target.querySelector('button[type="submit"]')

  // Mostrar loading no botão
  showButtonLoading(submitButton)

  const formData = new FormData(appointmentForm)
  const appointmentData = {
    id: Date.now().toString(),
    clientName: formData.get("clientName"),
    clientPhone: formData.get("clientPhone"),
    clientEmail: formData.get("clientEmail"),
    date: formData.get("date"),
    time: formData.get("time"),
    barberId: formData.get("barber"),
    notes: formData.get("notes") || "",
  }

  // Validações com animações
  if (
    !appointmentData.clientName ||
    !appointmentData.clientPhone ||
    !appointmentData.clientEmail ||
    !appointmentData.date ||
    !appointmentData.time ||
    !appointmentData.barberId
  ) {
    hideButtonLoading(submitButton)
    showMessage("Por favor, preencha todos os campos obrigatórios.", "error")
    shakeForm()
    return
  }

  // Validar email
  if (!isValidEmail(appointmentData.clientEmail)) {
    hideButtonLoading(submitButton)
    showMessage("Por favor, insira um e-mail válido.", "error")
    shakeInput(document.getElementById("clientEmail"))
    return
  }

  // Validar se a data/hora não é no passado
  const selectedDateTime = new Date(`${appointmentData.date}T${appointmentData.time}:00`)
  const now = new Date()

  if (selectedDateTime <= now) {
    hideButtonLoading(submitButton)
    showMessage("Não é possível agendar para datas e horários passados.", "error")
    shakeInput(dateInput)
    shakeInput(timeSelect)
    return
  }

  try {
    // Buscar nome do barbeiro
    const barbers = await getBarbers()
    const selectedBarber = barbers.find((b) => b.id === appointmentData.barberId)
    appointmentData.barberName = selectedBarber ? selectedBarber.name : "Barbeiro não encontrado"

    // Verificar se o horário ainda está disponível
    const existingAppointments = await getAppointmentsForDate(appointmentData.date, appointmentData.barberId)
    const isTimeBooked = existingAppointments.some((apt) => apt.time === appointmentData.time)

    if (isTimeBooked) {
      hideButtonLoading(submitButton)
      showMessage("Este horário já foi agendado. Por favor, selecione outro horário.", "error")
      await updateAvailableTimes()
      shakeInput(timeSelect)
      return
    }

    // Simular processamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Salvar agendamento
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    appointments.push(appointmentData)
    localStorage.setItem("appointments", JSON.stringify(appointments))

    // Mostrar sucesso
    hideButtonLoading(submitButton)
    showButtonSuccess(submitButton)
    showMessage("Agendamento realizado com sucesso!", "success")

    // Animar sucesso no formulário
    successAnimation()

    // Limpar formulário com animação
    setTimeout(() => {
      resetForm()
    }, 2000)
  } catch (error) {
    console.error("Erro ao salvar agendamento:", error)
    hideButtonLoading(submitButton)
    showButtonError(submitButton)
    showMessage("Erro ao realizar agendamento. Tente novamente.", "error")
  }
}

// Animações de feedback
function showButtonLoading(button) {
  button.classList.add("loading")
  button.disabled = true
  const originalText = button.textContent
  button.setAttribute("data-original-text", originalText)
  button.textContent = "Processando..."
}

function hideButtonLoading(button) {
  button.classList.remove("loading")
  button.disabled = false
  const originalText = button.getAttribute("data-original-text")
  if (originalText) {
    button.textContent = originalText
  }
}

function showButtonSuccess(button) {
  button.classList.add("success-state")
  button.textContent = "✓ Agendado!"

  setTimeout(() => {
    button.classList.remove("success-state")
    const originalText = button.getAttribute("data-original-text")
    if (originalText) {
      button.textContent = originalText
    }
  }, 2000)
}

function showButtonError(button) {
  button.classList.add("error-state")
  button.textContent = "✕ Erro!"

  setTimeout(() => {
    button.classList.remove("error-state")
    const originalText = button.getAttribute("data-original-text")
    if (originalText) {
      button.textContent = originalText
    }
  }, 2000)
}

function shakeForm() {
  appointmentForm.style.animation = "shake 0.5s ease-in-out"
  setTimeout(() => {
    appointmentForm.style.animation = ""
  }, 500)
}

function shakeInput(input) {
  input.style.animation = "shake 0.5s ease-in-out"
  input.style.borderColor = "var(--error)"

  setTimeout(() => {
    input.style.animation = ""
    input.style.borderColor = ""
  }, 500)
}

function successAnimation() {
  const card = document.querySelector(".card-form")
  card.style.animation = "pulse 0.6s ease-out"
  card.style.borderColor = "var(--success)"

  setTimeout(() => {
    card.style.animation = ""
    card.style.borderColor = ""
  }, 600)
}

function resetForm() {
  // Animar saída dos valores
  const inputs = appointmentForm.querySelectorAll("input, select, textarea")
  inputs.forEach((input, index) => {
    setTimeout(() => {
      input.style.transition = "all 0.3s ease"
      input.style.opacity = "0.5"
      input.value = ""

      setTimeout(() => {
        input.style.opacity = "1"
      }, 150)
    }, index * 50)
  })

  timeSelect.innerHTML = '<option value="">Selecione um barbeiro e data</option>'
  timeSelect.disabled = true
  hideTimeError()
}

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Mostrar mensagem com animação
function showMessage(message, type) {
  messageElement.textContent = message
  messageElement.className = `mt-4 text-center text-sm font-semibold ${type === "error" ? "text-red-500" : "text-green-500"}`
  messageElement.classList.remove("hidden")
  messageElement.style.animation = "slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)"

  // Criar notificação também
  if (window.MicroInteractions) {
    const microInteractions = new window.MicroInteractions()
    microInteractions.createNotification(message, type)
  }

  setTimeout(() => {
    messageElement.style.animation = "slideInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    setTimeout(() => {
      messageElement.classList.add("hidden")
      messageElement.style.animation = ""
    }, 400)
  }, 5000)
}

// Mostrar erro de horário
function showTimeError(message) {
  const timeErrorElement = document.getElementById("timeErrorMessage")
  timeErrorElement.textContent = message
  timeErrorElement.classList.remove("hidden")
  timeErrorElement.style.animation = "slideInUp 0.3s ease-out"
}

// Esconder erro de horário
function hideTimeError() {
  const timeErrorElement = document.getElementById("timeErrorMessage")
  timeErrorElement.style.animation = "slideInDown 0.3s ease-out"
  setTimeout(() => {
    timeErrorElement.classList.add("hidden")
    timeErrorElement.style.animation = ""
  }, 300)
}

// Atualizar contador de visitas
function updateVisitCount() {
  let count = Number.parseInt(localStorage.getItem("visitCount") || "0")
  count++
  localStorage.setItem("visitCount", count.toString())
  visitCountElement.textContent = count
}

// Definir data mínima (hoje)
function setMinDate() {
  const today = new Date()
  const todayString = today.toISOString().split("T")[0]
  dateInput.min = todayString
}
