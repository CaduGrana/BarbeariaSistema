"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, User, Phone, Mail, Scissors } from "lucide-react"
import Link from "next/link"

interface Barber {
  id: string
  name: string
}

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

export default function AgendamentoPage() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    date: "",
    time: "",
    barberId: "",
    notes: "",
  })
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [visitCount, setVisitCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Carregar dados do localStorage
    const savedBarbers = localStorage.getItem("barbers")
    const savedAppointments = localStorage.getItem("appointments")
    const savedVisitCount = localStorage.getItem("visitCount")

    if (savedBarbers) {
      setBarbers(JSON.parse(savedBarbers))
    } else {
      // Barbeiros padrão
      const defaultBarbers = [
        { id: "1", name: "João Silva" },
        { id: "2", name: "Pedro Oliveira" },
        { id: "3", name: "Carlos Santos" },
      ]
      setBarbers(defaultBarbers)
      localStorage.setItem("barbers", JSON.stringify(defaultBarbers))
    }

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }

    const count = savedVisitCount ? Number.parseInt(savedVisitCount) + 1 : 1
    setVisitCount(count)
    localStorage.setItem("visitCount", count.toString())
  }, [])

  useEffect(() => {
    if (formData.date && formData.barberId) {
      const bookedTimes = appointments
        .filter((apt) => apt.date === formData.date && apt.barberId === formData.barberId)
        .map((apt) => apt.time)

      const available = timeSlots.filter((time) => !bookedTimes.includes(time))
      setAvailableTimes(available)
    } else {
      setAvailableTimes([])
    }
  }, [formData.date, formData.barberId, appointments])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clientName || !formData.clientEmail || !formData.date || !formData.time || !formData.barberId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const selectedBarber = barbers.find((b) => b.id === formData.barberId)
    if (!selectedBarber) return

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      date: formData.date,
      time: formData.time,
      barberId: formData.barberId,
      barberName: selectedBarber.name,
      notes: formData.notes,
    }

    const updatedAppointments = [...appointments, newAppointment]
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))

    toast({
      title: "Sucesso!",
      description: "Agendamento realizado com sucesso!",
      variant: "default",
    })

    // Limpar formulário
    setFormData({
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      date: "",
      time: "",
      barberId: "",
      notes: "",
    })
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

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
            <Link href="/" className="px-4 py-3 text-orange-600 border-b-2 border-orange-600 font-semibold">
              Agendar Horário
            </Link>
            <Link
              href="/calendario"
              className="px-4 py-3 text-gray-600 hover:text-orange-600 font-semibold transition-colors"
            >
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
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-600 flex items-center justify-center gap-2">
              <Scissors className="h-6 w-6" />
              Agendar um Horário
            </CardTitle>
            <CardDescription>Preencha os dados abaixo para agendar seu horário</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="clientName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  required
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="clientPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone de Contato *
                </Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                  required
                />
              </div>

              {/* E-mail */}
              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail *
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                  required
                />
              </div>

              {/* Barbeiro */}
              <div className="space-y-2">
                <Label htmlFor="barberId" className="flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  Nome do Barbeiro *
                </Label>
                <Select value={formData.barberId} onValueChange={(value) => handleInputChange("barberId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um barbeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data *
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={getTodayDate()}
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>

              {/* Horário */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário *
                </Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => handleInputChange("time", value)}
                  disabled={!formData.date || !formData.barberId}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.date || !formData.barberId
                          ? "Selecione um barbeiro e data primeiro"
                          : "Selecione um horário"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.date && formData.barberId && availableTimes.length === 0 && (
                  <p className="text-sm text-red-600">Não há horários disponíveis para esta data e barbeiro.</p>
                )}
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Alguma observação sobre o corte ou serviço?"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                Agendar Agora
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Visitas na página: <span className="font-bold text-orange-600">{visitCount}</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-8">
        <p>&copy; 2023 Barbearia Corte Nobre. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
