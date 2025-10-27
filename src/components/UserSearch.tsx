import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { FaGithubAlt } from "react-icons/fa"

const UserSearch = () => {
  const [username, setUsername] = useState<string>("")
  const [submittedUsername, setSubmittedUsername] = useState<string>("")

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_GITHUB_API_URL}/users/${submittedUsername}`
      )

      if (!res.ok) {
        throw new Error("User not found")
      }

      const data = await res.json()
      console.log(data)
      return data
    },
    enabled: !!submittedUsername,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmittedUsername(username.trim())
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

      {data && (
        <div className="user-card">
          <img src={data.avatar_url} alt={data.name} className="avatar" />
          <h2>{data.name || data.login}</h2>
          <p className="bio">{data.bio}</p>
          <a
            href={data.html_url}
            className="profile-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithubAlt /> View Github Profile
          </a>
        </div>
      )}
    </>
  )
}

export default UserSearch
