"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { MoreHorizontalIcon, EditIcon, TrashIcon, AlertTriangleIcon, MinusIcon, ArrowDownIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { deleteIdea, updateIdeaStatus } from "@/lib/idea-service"
import type { Idea } from "@/lib/types"

interface IdeaCardProps {
  idea: Idea
  onEdit: (idea: Idea) => void
  onDelete: (id: string) => void
  onStatusChange: (idea: Idea) => void,
  ideas: Idea[]
}

export function IdeaCard({ idea, onEdit, onDelete, onStatusChange, ideas }: IdeaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar esta idea?")) {
      setIsDeleting(true)
      try {
        await deleteIdea(idea.id, ideas)
        onDelete(idea.id)
      } catch (error) {
        console.error("Error deleting idea:", error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleStatusChange = async () => {
    setIsUpdating(true)
    try {
      const newStatus = idea.status === "pendiente" ? "completado" : "pendiente"
      const updatedIdea = { ...idea, status: newStatus }
      await updateIdeaStatus(idea.id, newStatus, ideas)
      onStatusChange(updatedIdea)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "alta":
        return <AlertTriangleIcon className="h-3 w-3" />
      case "media":
        return <MinusIcon className="h-3 w-3" />
      case "baja":
        return <ArrowDownIcon className="h-3 w-3" />
      default:
        return <MinusIcon className="h-3 w-3" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "text-red-400 bg-red-950/30 border-red-900"
      case "media":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-900"
      case "baja":
        return "text-green-400 bg-green-950/30 border-green-900"
      default:
        return "text-zinc-400 bg-zinc-900 border-zinc-800"
    }
  }

  const formattedDate = idea.created_at
    ? formatDistanceToNow(new Date(idea.created_at), { addSuffix: true, locale: es })
    : ""

  return (
    <Card className="border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg font-medium mb-2">{idea.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className={`text-xs px-2 py-0 h-6 ${getPriorityColor(idea.priority)}`}>
              {getPriorityIcon(idea.priority)}
              <span className="ml-1 capitalize">{idea.priority}</span>
            </Button>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
            <DropdownMenuItem
              className="cursor-pointer flex items-center text-zinc-400 hover:text-white"
              onClick={() => onEdit(idea)}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center text-red-500 hover:text-red-400"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400 text-sm">{idea.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`text-xs px-2 py-0 h-6 ${idea.status === "pendiente"
              ? "bg-zinc-900 text-zinc-400 border-zinc-800"
              : idea.status === "en_progreso"
                ? "bg-blue-950/30 text-blue-400 border-blue-900"
                : "bg-teal-950/30 text-teal-400 border-teal-900"
              }`}
            onClick={handleStatusChange}
            disabled={isUpdating}
          >
            {isUpdating ? "Actualizando..." : idea.status}
          </Button>
          <span className="text-xs text-zinc-500">{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
