import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

function DashboardLayout() {
  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
