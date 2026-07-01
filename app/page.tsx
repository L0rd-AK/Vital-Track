import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to welcome page instead of login
  redirect("/welcome")
  return null
}

