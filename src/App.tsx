import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import UserStat from "./components/UserStat"

function App() {

  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/userStat" element={<UserStat/>}/>
      </Routes>
    </>
  )
}

export default App
