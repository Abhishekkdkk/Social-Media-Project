import { Route ,Routes } from "react-router-dom"
import Login from "./components/LoginandRegister.components"
import Home from "./components/home"

function App() {
    return (
        <Routes>
            <Route path = '/' element = {<Login className = 'LoginandRegister'/>} />
            <Route path = '/home' element = {<Home />} />
        </Routes>
    )
}

export default App