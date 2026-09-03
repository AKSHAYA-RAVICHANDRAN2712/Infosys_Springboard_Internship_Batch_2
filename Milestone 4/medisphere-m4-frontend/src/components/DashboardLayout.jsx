import { Outlet } from 'react-router-dom'
import TopNavbar from './TopNavbar'
import Sidebar from './Sidebar'

function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <TopNavbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
