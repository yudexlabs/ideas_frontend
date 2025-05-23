"use client"

import type React from "react"

import { useState } from "react"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createIdea, updateIdea } from "@/lib/idea-service"
import type { Idea } from "@/lib/types"

interface IdeaFormProps {
  onClose: () => void
  onIdeaAdded: (idea: Idea) => void
  onIdeaUpdated: (idea: Idea) => void
  idea?: Idea | null
}

export function IdeaForm({ onClose, onIdeaAdded, onIdeaUpdated, idea }: IdeaFormProps) {
  const [title, setTitle] = useState(idea?.title || "")
  const [description, setDescription] = useState(idea?.description || "")
  const [status, setStatus] = useState(idea?.status || "pendiente")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({ title: "", description: "" })

  const isEditing = !!idea

  const validate = () => {
    const newErrors = { title: "", description: "" }
    let isValid = true

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio"
      isValid = false
    }

    if (!description.trim()) {
      newErrors.description = "La descripción es obligatoria"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      if (isEditing && idea) {
        const updatedIdea = await updateIdea({
          ...idea,
          title,
          description,
          status,
        })
        onIdeaUpdated(updatedIdea)
      } else {
        const newIdea = await createIdea({
          title,
          description,
          status,
        })
        onIdeaAdded(newIdea)
      }
      onClose()
    } catch (error) {
      console.error("Error saving idea:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{isEditing ? "Editar idea" : "Nueva idea"}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-zinc-400">
              Título
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus-visible:ring-teal-500"
              placeholder="Escribe un título para tu idea"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-400">
              Descripción
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus-visible:ring-teal-500 min-h-[100px]"
              placeholder="Describe tu idea con más detalle"
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-zinc-400">
              Estado
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en-progreso">En progreso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-800 hover:bg-zinc-900 text-zinc-400"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
            >
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
