
import { Route, Routes } from 'react-router-dom'

import Header from './components/Header.tsx'
import Nav from './components/Nav.tsx'

import Home from './pages/Home.tsx'
import Events from './pages/Events.tsx'
import Partners from './pages/Partners.tsx'
import About from './pages/About.tsx'
import Contact from './pages/Contact.tsx'

function App() {

  return (
    <>
      <div className="min-h-dvh w-full overflow-x-hidden">
        <Header />
        <Nav />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Fallback route */}
          <Route path="*" element={<div className="p-8">Page not found</div>} />
        </Routes>
      </div>
      
    </>
  )
}

export default App
