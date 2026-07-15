import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom'
import './index.css'
import Dashboard from './Dashboard/Dashboard.jsx'
import EventDetail from './Dashboard/EventDetail.jsx'
import './Dashboard/Dashboard.css'

// ݁₊ ⊹ Adding a global sidebar that will stay visible across all of the pages ⊹ . ݁˖ . ݁
function Sidebar() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        {/* Sidebar content */}
        <div className="sidebar-brand">🎫 TicketPulse</div>
        <nav className="sidebar-nav">
        <Link to="/" className="nav-link">🏠 Dashboard</Link>
        <a href="#about" className="nav-link">ℹ️ About Data</a>
        </nav>
      </aside>
    
    <main className="main-content">
      <Outlet /> {/* So the Dashboard/EventDetail will render here */}
    </main>
    </div>
  )
}

// ݁₊ ⊹ I'm also just going to wrap my application so that it can handle switching between 
// the main dashboard view and event details ⊹ . ݁˖ . ݁
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="event/:id" element={<EventDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
