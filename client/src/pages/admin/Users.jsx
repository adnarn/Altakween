"use client"

import { useState } from "react"
import { FaSearch, FaUserPlus, FaUserEdit, FaTrash, FaFilter, FaEllipsisV, FaUser } from "react-icons/fa"

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2 hours ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "manager",
      status: "active",
      lastLogin: "1 day ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "user",
      status: "inactive",
      lastLogin: "1 week ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "user",
      status: "active",
      lastLogin: "3 days ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "manager",
      status: "inactive",
      lastLogin: "2 weeks ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 6,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "admin",
      status: "active",
      lastLogin: "5 hours ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 7,
      name: "Mike Ross",
      email: "mike@example.com",
      role: "user",
      status: "active",
      lastLogin: "1 hour ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 8,
      name: "Sarah Connor",
      email: "sarah@example.com",
      role: "manager",
      status: "inactive",
      lastLogin: "3 weeks ago",
      avatar: "/api/placeholder/40/40",
    },
  ]

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const UserCard = ({ user }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <FaUserEdit className="w-4 h-4" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FaTrash className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <FaEllipsisV className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-gray-500 block mb-1">Role</span>
          <span
            className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-800"
                : user.role === "manager"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block mb-1">Status</span>
          <span
            className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
              user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Last login: {user.lastLogin}</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your users and their permissions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl">
              <FaUserPlus className="w-4 h-4 mr-2" />
              Add New User
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <select
                className="block w-full sm:w-48 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
              <button className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm font-medium">
                <FaFilter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Mobile Card Layout */}
          <div className="block lg:hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => <UserCard key={user.id} user={user} />)
              ) : (
                <div className="text-center py-12">
                  <FaUser className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Login
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "manager"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <FaUserEdit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <FaTrash className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <FaEllipsisV className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <FaUser className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex justify-center sm:justify-start">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{" "}
                    <span className="font-medium">{filteredUsers.length}</span> results
                  </p>
                </div>
                <div className="flex justify-center">
                  <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Previous</span>←
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Next</span>→
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Users
