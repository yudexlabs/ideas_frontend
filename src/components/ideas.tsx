"use client"

import { useState, useEffect, useMemo } from "react"
import { PlusIcon, Loader2Icon, SearchIcon, SortAscIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IdeaCard } from "@/components/idea-card"
import { IdeaForm } from "@/components/idea-form"
import { getAllIdeas } from "@/lib/idea-service"
import type { Idea } from "@/lib/types"

export function Ideas() {
  const [allIdeas, setAllIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"priority" | "status" | "date">("priority")

  useEffect(() => {
    const loadIdeas = async () => {
      setIsLoading(true)
      try {
        const data = await getAllIdeas()
        setAllIdeas(data)
      } catch (error) {
        console.error("Error loading ideas:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadIdeas()
  }, []);

  // Función para ordenar ideas
  const sortIdeas = (ideas: Idea[], sortBy: "priority" | "status" | "date"): Idea[] => {
    const priorityOrder = { alta: 3, media: 2, baja: 1 }
    const statusOrder = { pendiente: 1, "en-progreso": 2, completado: 3 }

    return [...ideas].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "status":
          return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
        case "date":
        default:
          return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()
      }
    })
  }

  // Función para filtrar ideas por búsqueda
  const filterIdeas = (ideas: Idea[], searchTerm: string): Idea[] => {
    if (!searchTerm.trim()) return ideas

    const term = searchTerm.toLowerCase()
    return ideas.filter(
      (idea) => idea.title.toLowerCase().includes(term) || idea.description.toLowerCase().includes(term),
    )
  }

  // Memoizar las ideas filtradas y ordenadas para optimizar rendimiento
  const filteredAndSortedIdeas = useMemo(() => {
    const filtered = filterIdeas(allIdeas, searchTerm)
    return sortIdeas(filtered, sortBy)
  }, [allIdeas, searchTerm, sortBy])

  const handleAddIdea = (newIdea: Idea) => {
    setAllIdeas((prev) => [newIdea, ...prev])
  }

  const handleUpdateIdea = (updatedIdea: Idea) => {
    setAllIdeas((prev) => prev.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea)))
  }

  const handleDeleteIdea = (id: string) => {
    setAllIdeas((prev) => prev.filter((idea) => idea.id !== id))
  }

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-light">Tus ideas</h2>
        <Button
          onClick={() => {
            setEditingIdea(null)
            setIsFormOpen(!isFormOpen)
          }}
          variant="outline"
          className="border-zinc-800 hover:bg-zinc-900 text-zinc-400"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nueva idea
        </Button>
      </div>

      {/* Controles de búsqueda y ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 focus-visible:ring-teal-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <SortAscIcon className="h-4 w-4 text-zinc-500" />
          <Select value={sortBy} onValueChange={(value: "priority" | "status" | "date") => setSortBy(value)}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="priority">Prioridad</SelectItem>
              <SelectItem value="status">Estado</SelectItem>
              <SelectItem value="date">Fecha</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mostrar contador de resultados */}
      {!isLoading && searchTerm && (
        <div className="text-sm text-zinc-500">
          {filteredAndSortedIdeas.length} de {allIdeas.length} ideas encontradas
        </div>
      )}

      {isFormOpen && (
        <IdeaForm
          onClose={() => setIsFormOpen(false)}
          onIdeaAdded={handleAddIdea}
          onIdeaUpdated={handleUpdateIdea}
          idea={editingIdea}
          ideas={allIdeas}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : filteredAndSortedIdeas.length === 0 ? (
        <div className="border border-zinc-800 rounded-lg p-8 text-center">
          <p className="text-zinc-500">
            {searchTerm
              ? "No se encontraron ideas que coincidan con tu búsqueda."
              : "No tienes ideas guardadas. Crea tu primera idea."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={handleEditIdea}
              onDelete={handleDeleteIdea}
              onStatusChange={handleUpdateIdea}
              ideas={allIdeas}
            />
          ))}
        </div>
      )}
    </div>
  )
}
