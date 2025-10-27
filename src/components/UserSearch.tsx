import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { fetchGithubUser } from "../api/github"
import UserCard from "./UserCard"

const UserSearch = () => {
  const [username, setUsername] = useState<string>("")
  const [submittedUsername, setSubmittedUsername] = useState<string>("")

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
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

      {data && <UserCard user={data} />}
    </>
  )
}

export default UserSearch
