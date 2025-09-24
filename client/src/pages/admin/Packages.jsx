"use client"

import { useState } from "react"
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaEllipsisV,
  FaBoxOpen,
} from "react-icons/fa"

const Packages = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const packagesPerPage = 5

  const packages = [
    {
      id: 1,
      title: "Basic Travel Package",
      description: "Includes flights and hotel for 3 days.",
      category: "Travel",
      price: "$300",
      status: "active",
      lastUpdated: "2 days ago",
    },
    {
      id: 2,
      title: "Premium Vacation",
      description: "Luxury hotel and full-board meals.",
      category: "Vacation",
      price: "$1200",
      status: "active",
      lastUpdated: "1 week ago",
    },
    {
      id: 3,
      title: "Budget Tour",
      description: "Affordable package with basic amenities.",
      category: "Tour",
      price: "$150",
      status: "inactive",
      lastUpdated: "3 weeks ago",
    },
    {
      id: 4,
      title: "Business Trip Package",
      description: "Includes flights, hotel, and meeting spaces.",
      category: "Business",
      price: "$800",
      status: "active",
      lastUpdated: "5 days ago",
    },
    {
      id: 5,
      title: "Family Vacation",
      description: "Includes family activities and accommodation.",
      category: "Vacation",
      price: "$1000",
      status: "inactive",
      lastUpdated: "1 month ago",
    },
  ]

  // Filter packages based on search and category
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || pkg.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get current packages
  const indexOfLastPackage = currentPage * packagesPerPage
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage)
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const PackageCard = ({ pkg }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{pkg.title}</h3>
          <p className="text-xs text-gray-500 truncate">{pkg.description}</p>
        </div>
        <div className="flex space-x-1">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <FaEdit className="w-4 h-4" />
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
          <span className="text-gray-500 block mb-1">Category</span>
          <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-blue-100 text-blue-800">
            {pkg.category}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block mb-1">Status</span>
          <span
            className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
              pkg.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
        <span className="text-gray-500">Price: {pkg.price}</span>
        <span className="text-gray-500">Updated: {pkg.lastUpdated}</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Packages</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your packages and their details</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl">
              <FaPlus className="w-4 h-4 mr-2" />
              Add New Package
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Search packages by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <select
                className="block w-full sm:w-48 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Travel">Travel</option>
                <option value="Vacation">Vacation</option>
                <option value="Tour">Tour</option>
                <option value="Business">Business</option>
              </select>
              <button className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm font-medium">
                <FaFilter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Card Layout for Mobile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="block lg:hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">
                {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""} found
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {currentPackages.length > 0 ? (
                currentPackages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)
              ) : (
                <div className="text-center py-12">
                  <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Packages found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Table Layout for Desktop */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPackages.length > 0 ? (
                    currentPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pkg.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              pkg.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {pkg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.lastUpdated}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <FaEdit className="w-4 h-4" />
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
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Packages found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex justify-center sm:justify-start">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstPackage + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(indexOfLastPackage, filteredPackages.length)}</span> of{" "}
                    <span className="font-medium">{filteredPackages.length}</span> results
                  </p>
                </div>
                <div className="flex justify-center">
                  <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ←
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
                      →
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

export default Packages
