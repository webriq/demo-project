"use client"

import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading, login, signup } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/todos")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsSubmitting(true)

    const result = isSignUp
      ? await signup(email, password)
      : await login(email, password)

    if (result.success) {
      if (isSignUp) {
        setMessage("Check your email to confirm your account.")
      } else {
        router.push("/todos")
      }
    } else {
      setError(result.error || "Authentication failed")
    }

    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-sm sm:max-w-md">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            {isSignUp ? "Create account" : "Sign in"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your email to create an account"
              : "Enter your credentials to access your todos"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 sm:h-10 text-base sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 sm:h-10 text-base sm:text-sm"
              />
            </div>
            <Button type="submit" className="w-full h-12 sm:h-10 text-base sm:text-sm" disabled={isSubmitting}>
              {isSubmitting
                ? (isSignUp ? "Creating account..." : "Signing in...")
                : (isSignUp ? "Create account" : "Sign in")}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                  setMessage("")
                }}
                className="text-primary underline-offset-4 hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
