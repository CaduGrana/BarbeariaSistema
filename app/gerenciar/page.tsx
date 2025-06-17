"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { User, Calendar, Trash2, Edit, LogOut, Lock } from "lucide-react"
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

export default function GerenciarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [newBarberName, setNewBarberName] = useState("")
  const [editingBarber, setEditingBarber] = useState<string | null>(null)
  const [editBarberName, setEditBarberName] = useState("")
  const [filterBarber, setFilterBarber] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "barber" | "appointment"
    id: string
    name: string
  } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Verificar se já está autenticado
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  const loadData = () => {
    const savedBarbers = localStorage.getItem("barbers")
    const savedAppointments = localStorage.getItem("appointments")

    if (savedBarbers) {
      setBarbers(JSON.parse(savedBarbers))
    }

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (loginData.username === "barba123" && loginData.password === "barba123") {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      loadData()
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo à área de gerenciamento.",
      })
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
    setLoginData({ username: "", password: "" })
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
  }

  const addBarber = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newBarberName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome do barbeiro.",
        variant: "destructive",
      })
      return
    }

    if (barbers.some((b) => b.name.toLowerCase() === newBarberName.toLowerCase())) {
      toast({
        title: "Erro",
        description: "Já existe um barbeiro com este nome.",
        variant: "destructive",
      })
      return
    }

    const newBarber: Barber = {
      id: Date.now().toString(),
      name: newBarberName.trim(),
    }

    const updatedBarbers = [...barbers, newBarber]
    setBarbers(updatedBarbers)
    localStorage.setItem("barbers", JSON.stringify(updatedBarbers))
    setNewBarberName("")

    toast({
      title: "Sucesso!",
      description: "Barbeiro adicionado com sucesso.",
    })
  }

  const startEditBarber = (barber: Barber) => {
    setEditingBarber(barber.id)
    setEditBarberName(barber.name)
  }

  const saveEditBarber = (barberId: string) => {
    if (!editBarberName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do barbeiro não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    const updatedBarbers = barbers.map((b) => (b.id === barberId ? { ...b, name: editBarberName.trim() } : b))

    // Atualizar também os agendamentos
    const updatedAppointments = appointments.map((apt) =>
      apt.barberId === barberId ? { ...apt, barberName: editBarberName.trim() } : apt,
    )

    setBarbers(updatedBarbers)
    setAppointments(updatedAppointments)
    localStorage.setItem("barbers", JSON.stringify(updatedBarbers))
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))

    setEditingBarber(null)
    setEditBarberName("")

    toast({
      title: "Sucesso!",
      description: "Barbeiro atualizado com sucesso.",
    })
  }

  const deleteBarber = (barberId: string) => {
    const updatedBarbers = barbers.filter((b) => b.id !== barberId)
    const updatedAppointments = appointments.filter((apt) => apt.barberId !== barberId)

    setBarbers(updatedBarbers)
    setAppointments(updatedAppointments)
    localStorage.setItem("barbers", JSON.stringify(updatedBarbers))
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))

    setDeleteConfirm(null)

    toast({
      title: "Barbeiro excluído",
      description: "Barbeiro e seus agendamentos foram removidos.",
    })
  }

  const deleteAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.filter((apt) => apt.id !== appointmentId)
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
    setDeleteConfirm(null)

    toast({
      title: "Agendamento excluído",
      description: "Agendamento removido com sucesso.",
    })
  }

  const getFilteredAppointments = () => {
    return appointments
      .filter((apt) => {
        const barberMatch = !filterBarber || apt.barberId === filterBarber
        const dateMatch = !filterDate || apt.date === filterDate
        return barberMatch && dateMatch
      })
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.time.localeCompare(b.time)
      })
  }

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("pt-BR")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-600 flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" />
              Acesso Restrito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite o usuário"
                  value={loginData.username}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                Entrar
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                Usuário: <strong>barba123</strong>
              </p>
              <p>
                Senha: <strong>barba123</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <Link href="/" className="px-4 py-3 text-gray-600 hover:text-orange-600 font-semibold transition-colors">
              Agendar Horário
            </Link>
            <Link
              href="/calendario"
              className="px-4 py-3 text-gray-600 hover:text-orange-600 font-semibold transition-colors"
            >
              Calendário
            </Link>
            <Link href="/gerenciar" className="px-4 py-3 text-orange-600 border-b-2 border-orange-600 font-semibold">
              Gerenciar
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Logout Button */}
        <div className="flex justify-end">
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Gerenciar Barbeiros */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 flex items-center gap-2">
              <User className="h-6 w-6" />
              Gerenciar Barbeiros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Adicionar Barbeiro */}
            <form onSubmit={addBarber} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Nome do barbeiro"
                  value={newBarberName}
                  onChange={(e) => setNewBarberName(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                Adicionar
              </Button>
            </form>

            {/* Lista de Barbeiros */}
            <div className="space-y-3">
              {barbers.map((barber) => (
                <div key={barber.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  {editingBarber === barber.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editBarberName}
                        onChange={(e) => setEditBarberName(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => saveEditBarber(barber.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingBarber(null)}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{barber.name}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditBarber(barber)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirm({ type: "barber", id: barber.id, name: barber.name })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gerenciar Agendamentos */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Gerenciar Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filtrar por Barbeiro</Label>
                <Select value={filterBarber} onValueChange={setFilterBarber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os barbeiros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os barbeiros</SelectItem>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filtrar por Data</Label>
                <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>
            </div>

            {/* Lista de Agendamentos */}
            <div className="space-y-3">
              {getFilteredAppointments().length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum agendamento encontrado com os filtros aplicados.
                </p>
              ) : (
                getFilteredAppointments().map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-white rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-semibold text-orange-600">
                          {formatDateForDisplay(appointment.date)} às {appointment.time}
                        </div>
                        <div className="text-gray-700">
                          <strong>Cliente:</strong> {appointment.clientName}
                        </div>
                        <div className="text-gray-600">
                          <strong>Telefone:</strong> {appointment.clientPhone}
                        </div>
                        <div className="text-gray-600">
                          <strong>E-mail:</strong> {appointment.clientEmail}
                        </div>
                        <div className="text-gray-600">
                          <strong>Barbeiro:</strong> {appointment.barberName}
                        </div>
                        {appointment.notes && (
                          <div className="text-gray-600">
                            <strong>Observações:</strong> {appointment.notes}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          setDeleteConfirm({
                            type: "appointment",
                            id: appointment.id,
                            name: `${appointment.clientName} - ${formatDateForDisplay(appointment.date)} ${appointment.time}`,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Tem certeza que deseja excluir {deleteConfirm?.type === "barber" ? "o barbeiro" : "o agendamento"}{" "}
              <strong>"{deleteConfirm?.name}"</strong>?
            </p>
            {deleteConfirm?.type === "barber" && (
              <p className="text-sm text-red-600">
                Isso também removerá todos os agendamentos futuros associados a este barbeiro.
              </p>
            )}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteConfirm?.type === "barber") {
                    deleteBarber(deleteConfirm.id)
                  } else {
                    deleteAppointment(deleteConfirm.id)
                  }
                }}
              >
                Excluir
              </Button>
            </div>
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
