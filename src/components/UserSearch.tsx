import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { fetchGithubUser } from "../api/github"
import UserCard from "./UserCard"
import RecentSearches from "./RecentSearches"

const UserSearch = () => {
  const [username, setUsername] = useState<string>("")
  const [submittedUsername, setSubmittedUsername] = useState<string>("")
  const [recentUsers, setRecentUsers] = useState<string[]>([])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmed = username.trim()
    if (!trimmed) return
    setSubmittedUsername(trimmed)

    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((user) => user !== trimmed)]
      return updated.slice(0, 5)
    })
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter github username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}

      {data && <UserCard user={data} />}

      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(username) => {
            setUsername(username)
            setSubmittedUsername(username)
          }}
        />
      )}
    </>
  )
}

export default UserSearch
