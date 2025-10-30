import { Toaster } from "sonner"
import UserSearch from "./components/UserSearch"

const App = () => {
  return (
    <div className="container">
      <h1>Github Finder</h1>
      <UserSearch />
      <Toaster richColors />
    </div>
  )
}

export default App
