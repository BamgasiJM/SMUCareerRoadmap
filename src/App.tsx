import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage'
import MajorDetailPage from './pages/MajorDetailPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/major/:id" element={<MajorDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
