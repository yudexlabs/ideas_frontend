"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  AlertTriangleIcon,
  MinusIcon,
  ArrowDownIcon,
  ChevronDownIcon,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { deleteIdea, updateIdea } from "@/lib/idea-service"
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false)

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

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      const updatedIdea = { ...idea, status: newStatus }
      await updateIdea(updatedIdea, ideas)
      onStatusChange(updatedIdea)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handlePriorityChange = async (newPriority: "alta" | "media" | "baja") => {
    setIsUpdatingPriority(true)
    try {
      const updatedIdea = { ...idea, priority: newPriority }
      await updateIdea(updatedIdea, ideas)
      onStatusChange(updatedIdea)
    } catch (error) {
      console.error("Error updating priority:", error)
    } finally {
      setIsUpdatingPriority(false)
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
        return "text-red-400 bg-red-950/30 border-red-900 hover:bg-red-900/50"
      case "media":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-900 hover:bg-yellow-900/50"
      case "baja":
        return "text-green-400 bg-green-950/30 border-green-900 hover:bg-green-900/50"
      default:
        return "text-zinc-400 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
      case "en-progreso":
        return "bg-blue-950/30 text-blue-400 border-blue-900 hover:bg-blue-900/50"
      case "completado":
        return "bg-teal-950/30 text-teal-400 border-teal-900 hover:bg-teal-900/50"
      default:
        return "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
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
            {/* Dropdown para cambiar prioridad */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`text-xs px-2 py-0 h-6 transition-colors cursor-pointer ${getPriorityColor(idea.priority)}`}
                  disabled={isUpdatingPriority}
                >
                  {getPriorityIcon(idea.priority)}
                  <span className="ml-1 capitalize">{isUpdatingPriority ? "..." : idea.priority}</span>
                  <ChevronDownIcon className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-800">
                <DropdownMenuItem
                  className="cursor-pointer flex items-center text-red-400 hover:text-red-300"
                  onClick={() => handlePriorityChange("alta")}
                >
                  <AlertTriangleIcon className="mr-2 h-3 w-3" />
                  Alta
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer flex items-center text-yellow-400 hover:text-yellow-300"
                  onClick={() => handlePriorityChange("media")}
                >
                  <MinusIcon className="mr-2 h-3 w-3" />
                  Media
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer flex items-center text-green-400 hover:text-green-300"
                  onClick={() => handlePriorityChange("baja")}
                >
                  <ArrowDownIcon className="mr-2 h-3 w-3" />
                  Baja
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          {/* Dropdown para cambiar estado */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs px-2 py-0 h-6 transition-colors cursor-pointer ${getStatusColor(idea.status)}`}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Actualizando..." : idea.status}
                <ChevronDownIcon className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-800">
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-zinc-400 hover:text-white"
                onClick={() => handleStatusChange("pendiente")}
              >
                <div className="w-2 h-2 rounded-full bg-zinc-500 mr-2"></div>
                Pendiente
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-blue-400 hover:text-blue-300"
                onClick={() => handleStatusChange("en-progreso")}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                En progreso
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-teal-400 hover:text-teal-300"
                onClick={() => handleStatusChange("completado")}
              >
                <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
                Completado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-xs text-zinc-500">{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
