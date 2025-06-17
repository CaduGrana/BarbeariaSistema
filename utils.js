// Constantes do localStorage
export const BARBERS_KEY = "barbers"
export const APPOINTMENTS_KEY = "appointments"

/**
 * Obtém todos os barbeiros do localStorage
 * @returns {Promise<Array>} Lista de barbeiros
 */
export async function getBarbers() {
  return new Promise((resolve) => {
    const savedBarbers = localStorage.getItem(BARBERS_KEY)

    if (savedBarbers) {
      resolve(JSON.parse(savedBarbers))
    } else {
      // Barbeiros padrão
      const defaultBarbers = [
        { id: "1", name: "João Silva" },
        { id: "2", name: "Pedro Oliveira" },
        { id: "3", name: "Carlos Santos" },
      ]

      localStorage.setItem(BARBERS_KEY, JSON.stringify(defaultBarbers))
      resolve(defaultBarbers)
    }
  })
}

/**
 * Obtém agendamentos para uma data específica e/ou barbeiro
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {string} barberId - ID do barbeiro (opcional)
 * @returns {Promise<Array>} Lista de agendamentos
 */
export async function getAppointmentsForDate(date = null, barberId = null) {
  return new Promise((resolve) => {
    const savedAppointments = localStorage.getItem(APPOINTMENTS_KEY)
    const appointments = savedAppointments ? JSON.parse(savedAppointments) : []

    let filteredAppointments = appointments

    if (date) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.date === date)
    }

    if (barberId) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.barberId === barberId)
    }

    resolve(filteredAppointments)
  })
}

/**
 * Formata uma data para exibição em português
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada
 */
export function formatDateForDisplay(dateString) {
  try {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    return "Data inválida"
  }
}

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns {string} Data atual
 */
export function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Valida se uma string é um email válido
 * @param {string} email - Email para validar
 * @returns {boolean} True se válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida se uma string é um telefone válido (formato brasileiro)
 * @param {string} phone - Telefone para validar
 * @returns {boolean} True se válido
 */
export function isValidPhone(phone) {
  const phoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
  return phoneRegex.test(phone)
}
