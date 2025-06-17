"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Phone, Mail, Scissors } from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  clientEmail: string
  date: string
  time: string
  barberId: string
  barberName: string
  notes?: string
}

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

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export default function CalendarioPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments")
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getAppointmentsForDate = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.filter((apt) => apt.date === dateString)
  }

  const handleDateClick = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayAppointments = getAppointmentsForDate(day)

    setSelectedDate(dateString)
    setSelectedAppointments(dayAppointments)
    setIsModalOpen(true)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center tracking-wider">BARBEARIA CORTE NOBRE</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8">
            <Link href="/" className="px-4 py-3 text-gray-600 hover:text-orange-600 font-semibold transition-colors">
              Agendar Horário
            </Link>
            <Link href="/calendario" className="px-4 py-3 text-orange-600 border-b-2 border-orange-600 font-semibold">
              Calendário
            </Link>
            <Link
              href="/gerenciar"
              className="px-4 py-3 text-gray-600 hover:text-orange-600 font-semibold transition-colors"
            >
              Gerenciar
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-600 flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              Calendário de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <h2 className="text-xl font-bold text-orange-600">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg overflow-hidden">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 bg-gray-100">
                {weekDays.map((day) => (
                  <div key={day} className="p-3 text-center font-semibold text-gray-700 border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="h-24 border-r border-b last:border-r-0"></div>
                  }

                  const dayAppointments = getAppointmentsForDate(day)
                  const hasAppointments = dayAppointments.length > 0
                  const todayClass = isToday(day) ? "bg-orange-100 border-orange-400 border-2" : ""

                  return (
                    <div
                      key={day}
                      className={`h-24 border-r border-b last:border-r-0 p-2 cursor-pointer hover:bg-gray-50 transition-colors relative ${todayClass}`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="font-semibold text-gray-800">{day}</div>
                      {hasAppointments && (
                        <div className="absolute bottom-2 right-2 bg-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          {dayAppointments.length}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Appointments Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-orange-600">
              Agendamentos para {selectedDate && formatDateForDisplay(selectedDate)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedAppointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum agendamento para esta data.</p>
            ) : (
              selectedAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <Card key={appointment.id} className="border-l-4 border-l-orange-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-lg font-semibold text-orange-600">
                            <Clock className="h-4 w-4" />
                            {appointment.time}
                          </div>

                          <div className="flex items-center gap-2 text-gray-700">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{appointment.clientName}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            {appointment.clientPhone}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            {appointment.clientEmail}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Scissors className="h-4 w-4" />
                            {appointment.barberName}
                          </div>

                          {appointment.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                              <strong>Observações:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-8">
        <p>&copy; 2023 Barbearia Corte Nobre. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
