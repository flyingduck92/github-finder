import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { fetchGithubUser, searchGithubUser } from "../api/github"
import UserCard from "./UserCard"
import RecentSearches from "./RecentSearches"
import { useDebounce } from "use-debounce"
import type { GithubUser } from "../types"

const UserSearch = () => {
  const [username, setUsername] = useState<string>("")
  const [submittedUsername, setSubmittedUsername] = useState<string>("")
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentUsers")
    return stored ? JSON.parse(stored) : []
  })

  // debounce
  const [debouncedUsername] = useDebounce(username, 300)
  const [showSuggestion, setShowSuggestion] = useState(false)

  // query to fetch particular user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername,
  })

  // query to fetch suggestion for user search
  const { data: suggestions } = useQuery({
    queryKey: ["github-user-suggestions", debouncedUsername],
    queryFn: () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmed = username.trim()
    if (!trimmed) return
    setSubmittedUsername(trimmed)
    setUsername("")

    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((user) => user !== trimmed)]
      return updated.slice(0, 5)
    })
  }

  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers))
  }, [recentUsers])

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="enter github username"
            value={username}
            onChange={(e) => {
              const val = e.target.value
              setUsername(val)
              setShowSuggestion(val.trim().length > 1)
            }}
          />

          {showSuggestion && suggestions?.length > 0 && (
            <ul className="suggestions">
              {suggestions.slice(0, 5).map((user: GithubUser) => (
                <li
                  key={user.login}
                  onClick={() => {
                    setUsername(user.login)
                    setShowSuggestion(false)

                    if (submittedUsername !== user.login) {
                      setSubmittedUsername(user.login)
                    } else {
                      refetch()
                    }
                  }}
                >
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="avatar-xs"
                  />
                  {user.login}
                </li>
              ))}
            </ul>
          )}
        </div>
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
