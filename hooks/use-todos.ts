"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Todo } from "@/types"
import { useAuth } from "@/hooks/use-auth"

export function useTodos() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const fetchTodos = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setTodos(data)
    }
    setIsLoaded(true)
  }, [user])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const addTodo = async (text: string) => {
    if (!text.trim() || !user) return
    const { data, error } = await supabase
      .from("todos")
      .insert({ text: text.trim(), user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setTodos((prev) => [data, ...prev])
    }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id)
    if (!error) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", id)

    if (!error) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    }
  }

  const editTodo = async (id: string, newText: string) => {
    const trimmedText = newText.trim()
    if (!trimmedText) {
      await deleteTodo(id)
      return
    }
    const { error } = await supabase
      .from("todos")
      .update({ text: trimmedText })
      .eq("id", id)

    if (!error) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmedText } : t))
      )
    }
  }

  return {
    todos,
    isLoaded,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
  }
}
