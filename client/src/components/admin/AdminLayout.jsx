"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Plane,
  Building,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react"
import Sidebar from "./Sidebar"
import { useAuth } from "../../contexts/AuthContext"
import Navbar from "./Navbar"

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
    setSidebarOpen(false) // close after logout
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Packages", href: "/admin/packages", icon: Plane },
    { name: "Hotels", href: "/admin/hotels", icon: Building },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex items-center justify-center h-16 text-2xl font-bold text-indigo-600 shadow">
          TravelAdmin
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)} // close on link click
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="h-16">
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl shadow p-6 min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
export default AdminLayout
