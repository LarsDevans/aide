import { useAuth } from "@/hooks/useAuth"

export const useCurrentUser = () => {
  const { currentUser } = useAuth()

  if (currentUser === null) {
    throw new Error(
      "useCurrentUser must be used within an authenticated context",
    )
  }

  return currentUser
}
