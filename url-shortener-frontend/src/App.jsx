import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Main } from './pages/main/main';
import { Stats } from './pages/stats/stats';
import './App.css'
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/stats/:alias" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
