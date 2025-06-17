import { getBarbers, formatDateForDisplay } from "./utils.js"

// Elementos do DOM
const mainContent = document.getElementById("mainContent")
const loginModal = document.getElementById("loginModal")
const loginForm = document.getElementById("loginForm")
const usernameInput = document.getElementById("usernameInput")
const passwordInput = document.getElementById("passwordInput")
const loginErrorMessage = document.getElementById("loginErrorMessage")

// Modais de confirmação
const deleteBarberModal = document.getElementById("deleteBarberModal")
const deleteAppointmentModal = document.getElementById("deleteAppointmentModal")

// Estado da aplicação
let isAuthenticated = false
let barbers = []
let appointments = []
let barberToDelete = null
let appointmentToDelete = null

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  setupEventListeners()
})

// Verificar autenticação
function checkAuthentication() {
  const authStatus = localStorage.getItem("isAuthenticated")
  if (authStatus === "true") {
    isAuthenticated = true
    showManagementInterface()
  } else {
    showLoginModal()
  }
}

// Configurar event listeners
function setupEventListeners() {
  loginForm.addEventListener("submit", handleLogin)

  // Adicionar event listener para o botão voltar
  document.getElementById("backBtn").addEventListener("click", handleBack)
}

// Mostrar modal de login
function showLoginModal() {
  loginModal.classList.remove("hidden")
}

// Esconder modal de login
function hideLoginModal() {
  loginModal.classList.add("hidden")
}

// Manipular login
function handleLogin(e) {
  e.preventDefault()

  const username = usernameInput.value
  const password = passwordInput.value

  if (username === "barba123" && password === "barba123") {
    isAuthenticated = true
    localStorage.setItem("isAuthenticated", "true")
    hideLoginModal()
    showManagementInterface()
    showMessage("Login realizado com sucesso!", "success")
  } else {
    showLoginError("Usuário ou senha incorretos.")
  }
}

// Manipular botão voltar
function handleBack() {
  // Redirecionar para a página de agendamento
  window.location.href = "index.html"
}

// Mostrar erro de login
function showLoginError(message) {
  loginErrorMessage.textContent = message
  loginErrorMessage.classList.remove("hidden")

  setTimeout(() => {
    loginErrorMessage.classList.add("hidden")
  }, 5000)
}

// Mostrar interface de gerenciamento
async function showManagementInterface() {
  await loadData()
  renderManagementInterface()
}

// Carregar dados
async function loadData() {
  try {
    barbers = await getBarbers()
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    appointments = allAppointments
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
  }
}

// Renderizar interface de gerenciamento
function renderManagementInterface() {
  mainContent.innerHTML = `
    <div class="space-y-8">
      <!-- Logout Button -->
      <div class="flex justify-end">
        <button id="logoutBtn" class="btn-secondary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Sair
        </button>
      </div>

      <!-- Management Sections in Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Gerenciar Barbeiros -->
        <div class="bg-white rounded-xl shadow-xl p-6">
          <h2 class="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Gerenciar Barbeiros
          </h2>

          <!-- Adicionar Barbeiro -->
          <form id="addBarberForm" class="flex gap-3 mb-6">
            <input type="text" id="newBarberName" class="form-input flex-1" placeholder="Nome do barbeiro" required>
            <button type="submit" class="btn-primary px-4 py-2 whitespace-nowrap">Adicionar</button>
          </form>

          <!-- Lista de Barbeiros -->
          <div id="barbersList" class="space-y-3 max-h-96 overflow-y-auto">
            ${renderBarbersList()}
          </div>
        </div>

        <!-- Gerenciar Agendamentos -->
        <div class="bg-white rounded-xl shadow-xl p-6">
          <h2 class="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Gerenciar Agendamentos
          </h2>

          <!-- Filtros -->
          <div class="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label for="filterBarber" class="form-label text-sm">Filtrar por Barbeiro</label>
              <select id="filterBarber" class="form-select">
                <option value="">Todos os barbeiros</option>
                ${barbers.map((barber) => `<option value="${barber.id}">${barber.name}</option>`).join("")}
              </select>
            </div>
            <div>
              <label for="filterDate" class="form-label text-sm">Filtrar por Data</label>
              <input type="date" id="filterDate" class="form-input">
            </div>
          </div>

          <!-- Lista de Agendamentos -->
          <div id="appointmentsList" class="max-h-96 overflow-y-auto">
            ${renderAppointmentsList()}
          </div>
        </div>
      </div>

      <!-- Mensagem -->
      <div id="message" class="hidden text-center text-sm font-semibold"></div>
    </div>
  `

  setupManagementEventListeners()
}

// Renderizar lista de barbeiros
function renderBarbersList() {
  if (barbers.length === 0) {
    return '<div class="text-center text-gray-500 py-8 text-sm">Nenhum barbeiro cadastrado.</div>'
  }

  return barbers
    .map(
      (barber) => `
    <div class="barber-item flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors" data-barber-id="${barber.id}">
      <span class="barber-name font-medium text-gray-800 flex-1">${barber.name}</span>
      <div class="barber-actions flex items-center gap-2">
        <button class="btn-secondary edit-barber-btn p-2 text-xs" data-barber-id="${barber.id}" title="Editar barbeiro">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button class="btn-danger delete-barber-btn p-2 text-xs" data-barber-id="${barber.id}" data-barber-name="${barber.name}" title="Excluir barbeiro">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Renderizar lista de agendamentos
function renderAppointmentsList() {
  const filteredAppointments = getFilteredAppointments()

  if (filteredAppointments.length === 0) {
    return '<div class="text-center text-gray-500 py-8 text-sm">Nenhum agendamento encontrado com os filtros aplicados.</div>'
  }

  return filteredAppointments
    .map(
      (appointment) => `
    <div class="appointment-item bg-gray-50 rounded-lg p-4 mb-3 border hover:bg-gray-100 transition-colors">
      <div class="flex items-start justify-between">
        <div class="flex-1 space-y-1">
          <div class="appointment-time text-red-600 font-bold text-sm">${formatDateForDisplay(appointment.date)} às ${appointment.time}</div>
          <div class="appointment-client text-gray-700 text-sm"><strong>Cliente:</strong> ${appointment.clientName}</div>
          <div class="appointment-phone text-gray-600 text-xs"><strong>Tel:</strong> ${appointment.clientPhone}</div>
          <div class="appointment-email text-gray-600 text-xs"><strong>Email:</strong> ${appointment.clientEmail}</div>
          <div class="appointment-barber text-gray-600 text-xs"><strong>Barbeiro:</strong> ${appointment.barberName}</div>
          ${appointment.notes ? `<div class="appointment-notes text-gray-600 text-xs"><strong>Obs:</strong> ${appointment.notes}</div>` : ""}
        </div>
        <button class="btn-danger delete-appointment-btn p-2 text-xs flex-shrink-0 ml-3" 
                data-appointment-id="${appointment.id}"
                data-client-name="${appointment.clientName}"
                data-barber-name="${appointment.barberName}"
                data-date-time="${formatDateForDisplay(appointment.date)} ${appointment.time}"
                title="Excluir agendamento">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Obter agendamentos filtrados
function getFilteredAppointments() {
  const filterBarber = document.getElementById("filterBarber")?.value || ""
  const filterDate = document.getElementById("filterDate")?.value || ""

  return appointments
    .filter((appointment) => {
      const barberMatch = !filterBarber || appointment.barberId === filterBarber
      const dateMatch = !filterDate || appointment.date === filterDate
      return barberMatch && dateMatch
    })
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })
}

// Configurar event listeners de gerenciamento
function setupManagementEventListeners() {
  // Logout
  document.getElementById("logoutBtn").addEventListener("click", handleLogout)

  // Adicionar barbeiro
  document.getElementById("addBarberForm").addEventListener("submit", handleAddBarber)

  // Filtros
  document.getElementById("filterBarber").addEventListener("change", updateAppointmentsList)
  document.getElementById("filterDate").addEventListener("change", updateAppointmentsList)

  // Botões de ação dos barbeiros
  document.querySelectorAll(".edit-barber-btn").forEach((btn) => {
    btn.addEventListener("click", handleEditBarber)
  })

  document.querySelectorAll(".delete-barber-btn").forEach((btn) => {
    btn.addEventListener("click", handleDeleteBarber)
  })

  // Botões de ação dos agendamentos
  document.querySelectorAll(".delete-appointment-btn").forEach((btn) => {
    btn.addEventListener("click", handleDeleteAppointment)
  })

  // Modais de confirmação
  setupModalEventListeners()
}

// Configurar event listeners dos modais
function setupModalEventListeners() {
  // Modal de deletar barbeiro
  document.getElementById("cancelDeleteBarberBtn").addEventListener("click", () => {
    deleteBarberModal.classList.add("hidden")
  })

  document.getElementById("confirmDeleteBarberBtn").addEventListener("click", confirmDeleteBarber)

  // Modal de deletar agendamento
  document.getElementById("cancelDeleteAppointmentBtn").addEventListener("click", () => {
    deleteAppointmentModal.classList.add("hidden")
  })

  document.getElementById("confirmDeleteAppointmentBtn").addEventListener("click", confirmDeleteAppointment)
}

// Manipular logout
function handleLogout() {
  isAuthenticated = false
  localStorage.removeItem("isAuthenticated")
  location.reload()
}

// Manipular adição de barbeiro
function handleAddBarber(e) {
  e.preventDefault()

  const newBarberName = document.getElementById("newBarberName").value.trim()

  if (!newBarberName) {
    showMessage("Por favor, insira o nome do barbeiro.", "error")
    return
  }

  // Verificar se já existe um barbeiro com este nome
  if (barbers.some((barber) => barber.name.toLowerCase() === newBarberName.toLowerCase())) {
    showMessage("Já existe um barbeiro com este nome.", "error")
    return
  }

  // Adicionar novo barbeiro
  const newBarber = {
    id: Date.now().toString(),
    name: newBarberName,
  }

  barbers.push(newBarber)
  localStorage.setItem("barbers", JSON.stringify(barbers))

  // Atualizar interface
  document.getElementById("barbersList").innerHTML = renderBarbersList()
  document.getElementById("newBarberName").value = ""

  // Reconfigurar event listeners para os novos botões
  setupBarbersEventListeners()

  showMessage("Barbeiro adicionado com sucesso!", "success")
}

// Manipular edição de barbeiro
function handleEditBarber(e) {
  const barberId = e.target.closest("button").dataset.barberId
  const barberItem = document.querySelector(`[data-barber-id="${barberId}"]`)
  const barberNameElement = barberItem.querySelector(".barber-name")
  const currentName = barberNameElement.textContent

  // Criar input de edição
  barberNameElement.innerHTML = `
    <input type="text" class="form-input" value="${currentName}" id="editBarberInput-${barberId}">
  `

  // Alterar botões
  const actionsElement = barberItem.querySelector(".barber-actions")
  actionsElement.innerHTML = `
    <button class="btn-primary save-barber-btn" data-barber-id="${barberId}">Salvar</button>
    <button class="btn-secondary cancel-edit-btn" data-barber-id="${barberId}" data-original-name="${currentName}">Cancelar</button>
  `

  // Configurar novos event listeners
  actionsElement.querySelector(".save-barber-btn").addEventListener("click", handleSaveBarber)
  actionsElement.querySelector(".cancel-edit-btn").addEventListener("click", handleCancelEdit)
}

// Manipular salvamento de barbeiro editado
function handleSaveBarber(e) {
  const barberId = e.target.dataset.barberId
  const newName = document.getElementById(`editBarberInput-${barberId}`).value.trim()

  if (!newName) {
    showMessage("Nome do barbeiro não pode estar vazio.", "error")
    return
  }

  // Verificar se já existe outro barbeiro com este nome
  if (barbers.some((barber) => barber.id !== barberId && barber.name.toLowerCase() === newName.toLowerCase())) {
    showMessage("Já existe um barbeiro com este nome.", "error")
    return
  }

  // Atualizar barbeiro
  const barberIndex = barbers.findIndex((barber) => barber.id === barberId)
  if (barberIndex !== -1) {
    barbers[barberIndex].name = newName
    localStorage.setItem("barbers", JSON.stringify(barbers))

    // Atualizar também os agendamentos
    appointments.forEach((appointment) => {
      if (appointment.barberId === barberId) {
        appointment.barberName = newName
      }
    })
    localStorage.setItem("appointments", JSON.stringify(appointments))

    // Atualizar interface
    document.getElementById("barbersList").innerHTML = renderBarbersList()
    setupBarbersEventListeners()
    updateAppointmentsList()

    showMessage("Barbeiro atualizado com sucesso!", "success")
  }
}

// Manipular cancelamento de edição
function handleCancelEdit(e) {
  const barberId = e.target.dataset.barberId
  const originalName = e.target.dataset.originalName
  const barberItem = document.querySelector(`[data-barber-id="${barberId}"]`)

  // Restaurar nome original
  barberItem.querySelector(".barber-name").textContent = originalName

  // Restaurar botões originais
  const actionsElement = barberItem.querySelector(".barber-actions")
  actionsElement.innerHTML = `
    <button class="btn-secondary edit-barber-btn" data-barber-id="${barberId}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
    </button>
    <button class="btn-danger delete-barber-btn" data-barber-id="${barberId}" data-barber-name="${originalName}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    </button>
  `

  setupBarbersEventListeners()
}

// Configurar event listeners dos barbeiros
function setupBarbersEventListeners() {
  document.querySelectorAll(".edit-barber-btn").forEach((btn) => {
    btn.addEventListener("click", handleEditBarber)
  })

  document.querySelectorAll(".delete-barber-btn").forEach((btn) => {
    btn.addEventListener("click", handleDeleteBarber)
  })
}

// Manipular exclusão de barbeiro
function handleDeleteBarber(e) {
  const barberId = e.target.closest("button").dataset.barberId
  const barberName = e.target.closest("button").dataset.barberName

  barberToDelete = { id: barberId, name: barberName }
  document.getElementById("barberToDeleteName").textContent = barberName
  deleteBarberModal.classList.remove("hidden")
}

// Confirmar exclusão de barbeiro
function confirmDeleteBarber() {
  if (!barberToDelete) return

  // Remover barbeiro
  barbers = barbers.filter((barber) => barber.id !== barberToDelete.id)
  localStorage.setItem("barbers", JSON.stringify(barbers))

  // Remover agendamentos do barbeiro
  appointments = appointments.filter((appointment) => appointment.barberId !== barberToDelete.id)
  localStorage.setItem("appointments", JSON.stringify(appointments))

  // Atualizar interface
  document.getElementById("barbersList").innerHTML = renderBarbersList()
  setupBarbersEventListeners()
  updateAppointmentsList()

  deleteBarberModal.classList.add("hidden")
  barberToDelete = null

  showMessage("Barbeiro e seus agendamentos foram removidos com sucesso.", "success")
}

// Manipular exclusão de agendamento
function handleDeleteAppointment(e) {
  const appointmentId = e.target.closest("button").dataset.appointmentId
  const clientName = e.target.closest("button").dataset.clientName
  const barberName = e.target.closest("button").dataset.barberName
  const dateTime = e.target.closest("button").dataset.dateTime

  appointmentToDelete = appointmentId
  document.getElementById("appointmentToDeleteClient").textContent = clientName
  document.getElementById("appointmentToDeleteBarber").textContent = barberName
  document.getElementById("appointmentToDeleteDateTime").textContent = dateTime
  deleteAppointmentModal.classList.remove("hidden")
}

// Confirmar exclusão de agendamento
function confirmDeleteAppointment() {
  if (!appointmentToDelete) return

  // Remover agendamento
  appointments = appointments.filter((appointment) => appointment.id !== appointmentToDelete)
  localStorage.setItem("appointments", JSON.stringify(appointments))

  // Atualizar interface
  updateAppointmentsList()

  deleteAppointmentModal.classList.add("hidden")
  appointmentToDelete = null

  showMessage("Agendamento removido com sucesso.", "success")
}

// Atualizar lista de agendamentos
function updateAppointmentsList() {
  document.getElementById("appointmentsList").innerHTML = renderAppointmentsList()

  // Reconfigurar event listeners
  document.querySelectorAll(".delete-appointment-btn").forEach((btn) => {
    btn.addEventListener("click", handleDeleteAppointment)
  })
}

// Mostrar mensagem
function showMessage(message, type) {
  const messageElement = document.getElementById("message")
  messageElement.textContent = message
  messageElement.className = `text-center text-sm font-semibold ${type === "error" ? "text-red-500" : "text-green-500"}`
  messageElement.classList.remove("hidden")

  setTimeout(() => {
    messageElement.classList.add("hidden")
  }, 5000)
}

// Modais de confirmação - Títulos
document.getElementById("deleteBarberModal").querySelector(".modal-title").classList.add("text-red-600")
document.getElementById("deleteAppointmentModal").querySelector(".modal-title").classList.add("text-red-600")

// Atualizar os títulos dos modais de confirmação:
document.getElementById("deleteBarberModal").querySelector(".modal-title").textContent =
  "Confirmar Exclusão de Barbeiro"
document.getElementById("deleteAppointmentModal").querySelector(".modal-title").textContent =
  "Confirmar Exclusão de Agendamento"

// Atualizar os títulos dos modais de confirmação:
const deleteBarberModalTitle = document.getElementById("deleteBarberModal").querySelector(".modal-title")
deleteBarberModalTitle.classList.add("text-xl", "font-bold", "text-red-600")
deleteBarberModalTitle.textContent = "Confirmar Exclusão de Barbeiro"

const deleteAppointmentModalTitle = document.getElementById("deleteAppointmentModal").querySelector(".modal-title")
deleteAppointmentModalTitle.classList.add("text-xl", "font-bold", "text-red-600")
deleteAppointmentModalTitle.textContent = "Confirmar Exclusão de Agendamento"
