import { getAppointmentsForDate, formatDateForDisplay } from "./utils.js"

// Nomes dos meses
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

// Elementos do DOM
const currentMonthYearElement = document.getElementById("currentMonthYear")
const calendarDaysGrid = document.getElementById("calendarDaysGrid")
const prevMonthBtn = document.getElementById("prevMonthBtn")
const nextMonthBtn = document.getElementById("nextMonthBtn")
const dailyAppointmentsModal = document.getElementById("dailyAppointmentsModal")
const modalDateElement = document.getElementById("modalDate")
const dailyAppointmentsList = document.getElementById("dailyAppointmentsList")
const noAppointmentsMessage = document.getElementById("noAppointmentsMessage")
const closeModalBtn = document.getElementById("closeDailyAppointmentsModalBtn")

// Estado atual
const currentDate = new Date()

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  renderCalendar()
})

// Configurar event listeners
function setupEventListeners() {
  prevMonthBtn.addEventListener("click", () => navigateMonth(-1))
  nextMonthBtn.addEventListener("click", () => navigateMonth(1))
  closeModalBtn.addEventListener("click", closeModal)
  dailyAppointmentsModal.addEventListener("click", (e) => {
    if (e.target === dailyAppointmentsModal) {
      closeModal()
    }
  })
}

// Navegar entre meses
function navigateMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction)
  renderCalendar()
}

// Renderizar calendário
async function renderCalendar() {
  // Atualizar título
  currentMonthYearElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  // Limpar grid
  calendarDaysGrid.innerHTML = ""

  // Calcular dias do mês
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Adicionar dias vazios do mês anterior
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyDay = document.createElement("div")
    emptyDay.className = "calendar-day empty"
    calendarDaysGrid.appendChild(emptyDay)
  }

  // Adicionar dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = await createDayElement(day, month, year)
    calendarDaysGrid.appendChild(dayElement)
  }
}

// Criar elemento do dia
async function createDayElement(day, month, year) {
  const dayElement = document.createElement("div")
  dayElement.className = "calendar-day"
  dayElement.textContent = day

  // Verificar se é hoje
  const today = new Date()
  if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
    dayElement.classList.add("current-day")
  }

  // Buscar agendamentos para este dia
  const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  try {
    const appointments = await getAppointmentsForDate(dateString)

    if (appointments.length > 0) {
      const countElement = document.createElement("div")
      countElement.className = "appointment-count"
      countElement.textContent = appointments.length
      dayElement.appendChild(countElement)
    }

    // Adicionar evento de clique
    dayElement.addEventListener("click", () => showDayAppointments(dateString, appointments))
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
  }

  return dayElement
}

// Mostrar agendamentos do dia
function showDayAppointments(dateString, appointments) {
  modalDateElement.textContent = `Agendamentos para ${formatDateForDisplay(dateString)}`

  if (appointments.length === 0) {
    dailyAppointmentsList.innerHTML = ""
    noAppointmentsMessage.classList.remove("hidden")
  } else {
    noAppointmentsMessage.classList.add("hidden")
    renderAppointmentsList(appointments)
  }

  showModal()
}

// Renderizar lista de agendamentos
function renderAppointmentsList(appointments) {
  // Ordenar por horário
  appointments.sort((a, b) => a.time.localeCompare(b.time))

  dailyAppointmentsList.innerHTML = ""

  appointments.forEach((appointment) => {
    const listItem = document.createElement("li")
    listItem.className = "appointment-item"

    listItem.innerHTML = `
      <div class="appointment-time">${appointment.time}</div>
      <div class="appointment-client"><strong>Cliente:</strong> ${appointment.clientName}</div>
      <div class="appointment-phone"><strong>Telefone:</strong> ${appointment.clientPhone}</div>
      <div class="appointment-email"><strong>E-mail:</strong> ${appointment.clientEmail}</div>
      <div class="appointment-barber"><strong>Barbeiro:</strong> ${appointment.barberName}</div>
      ${appointment.notes ? `<div class="appointment-notes"><strong>Observações:</strong> ${appointment.notes}</div>` : ""}
    `

    dailyAppointmentsList.appendChild(listItem)
  })
}

// Mostrar modal
function showModal() {
  dailyAppointmentsModal.classList.remove("hidden")
  dailyAppointmentsModal.classList.add("show")
}

// Fechar modal
function closeModal() {
  dailyAppointmentsModal.classList.add("hidden")
  dailyAppointmentsModal.classList.remove("show")
}
