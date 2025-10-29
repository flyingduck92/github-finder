import type { GithubUser } from "../types"

type SuggestionDropDownProps = {
  suggestions: GithubUser[]
  show: boolean
  onSelect: (username: string) => void
}

const SuggestionDropDown = ({
  suggestions,
  show,
  onSelect,
}: SuggestionDropDownProps) => {
  if (!show || suggestions.length === 0) return null

  return (
    <ul className="suggestions">
      {suggestions.slice(0, 5).map((user: GithubUser) => (
        <li key={user.login} onClick={() => onSelect(user.login)}>
          <img src={user.avatar_url} alt={user.login} className="avatar-xs" />
          {user.login}
        </li>
      ))}
    </ul>
  )
}

export default SuggestionDropDown
