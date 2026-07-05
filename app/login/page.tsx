"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const finishGoogleSignIn = (user: { displayName: string | null; email: string | null }) => {
    localStorage.setItem("user", JSON.stringify({ name: user.displayName || "User", email: user.email }))
    toast({
      title: "Google Sign-in successful",
      description: "Welcome to VitalTrack!",
    })
    router.push("/dashboard")
  }

  // Complete the redirect-based Google sign-in flow when the browser blocks popups
  // and we fall back to signInWithRedirect. Runs on mount after Google redirects back.
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) finishGoogleSignIn(result.user)
      })
      .catch((error: any) => {
        console.error("Google redirect error:", error.message)
        toast({
          title: "Google Sign-in failed",
          description: error.message,
          variant: "destructive",
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Firebase sign in
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({ name: user.displayName || "User", email: user.email }));

      toast({
        title: "Login successful",
        description: "Welcome back to VitalTrack!",
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Firebase sign up
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      const user = userCredential.user;

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({ name: signupName, email: user.email }));

      toast({
        title: "Account created",
        description: "Welcome to VitalTrack!",
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error.message);
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      finishGoogleSignIn(result.user);
    } catch (error: any) {
      // Popup blocked / closed by the browser (common on prod + mobile) — fall back
      // to a full-page redirect, which getRedirectResult picks up on return.
      if (
        error.code === "auth/popup-blocked" ||
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      console.error("Google Sign-in error:", error.message);
      toast({
        title: "Google Sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-soft-blue/10 to-gentle-lavender/30 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-poppins text-3xl font-bold text-soft-blue">VitalTrack</CardTitle>
          <CardDescription>Track your whole-body wellness in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 rounded-full">
              <TabsTrigger value="login" className="rounded-full">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-soft-blue hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="rounded-full"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-soft-blue hover:bg-soft-blue/90 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full border-input bg-white text-rich-navy shadow-sm hover:bg-light-gray"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in with Google..." : "Sign in with Google"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="rounded-full"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-soft-blue hover:bg-soft-blue/90 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full border-input bg-white text-rich-navy shadow-sm hover:bg-light-gray"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up with Google..." : "Sign up with Google"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  )
}
