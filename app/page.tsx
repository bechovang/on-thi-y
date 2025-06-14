"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediately navigate to the /select-exam page
    router.push("/select-exam")
  }, [router]) // router is included in the dependency array

  // Return null or a minimal loading indicator, as the page will redirect.
  // This content will likely not be visible or only for a flash.
  return null 
  // Alternatively, you could show a simple loading message:
  // return <div>Redirecting to practice area...</div>;
}