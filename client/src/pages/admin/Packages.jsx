"use client"

import { useState, useEffect, useContext } from "react"
import ApiContext, { useApi } from "../../contexts/ApiContext"
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBoxOpen, FaTimes, FaSave, FaSpinner, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa"

const Packages = () => {
  const { get, post, put, del } = useApi()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const packagesPerPage = 6

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    price: "",
    duration: "",
    rating: 0,
    reviews: 0,
    image: "",
    featured: false,
    includes: [],
    overview: "",
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
  })

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await get('/v1/categories')
      // Handle different response formats
      let categoriesData = []
      
      if (Array.isArray(response)) {
        categoriesData = response
      } else if (response && Array.isArray(response.data)) {
        categoriesData = response.data
      } else if (response && Array.isArray(response.result)) {
        categoriesData = response.result
      }
      
      setCategories(categoriesData)
    } catch (err) {
      console.error('Error fetching categories:', err)
      // Don't show error to user as it's not critical for package operations
    } finally {
      setLoadingCategories(false)
    }
  }

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await get("/packages")
      setPackages(response.data || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching packages:", err)
      setError("Failed to fetch packages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
    fetchCategories()
  }, [])

  // Filter packages based on search and category
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle array inputs (includes, highlights, etc.)
  const handleArrayInput = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item)
    setFormData((prev) => ({
      ...prev,
      [field]: items,
    }))
  }

  // Open add modal
  const openAddModal = () => {
    setModalMode("add")
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      price: "",
      duration: "",
      rating: 0,
      reviews: 0,
      image: "",
      featured: false,
      includes: [],
      overview: "",
      highlights: [],
      itinerary: [],
      inclusions: [],
      exclusions: [],
    })
    setShowModal(true)
  }

  // Open edit modal
  const openEditModal = (pkg) => {
    setModalMode("edit")
    setSelectedPackage(pkg)
    setFormData({
      title: pkg.title || "",
      description: pkg.description || "",
      category: pkg.category || "",
      location: pkg.location || "",
      price: pkg.price || "",
      duration: pkg.duration || "",
      rating: pkg.rating || 0,
      reviews: pkg.reviews || 0,
      image: pkg.image || "",
      featured: pkg.featured || false,
      includes: pkg.includes || [],
      overview: pkg.overview || "",
      highlights: pkg.highlights || [],
      itinerary: pkg.itinerary || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
    })
    setShowModal(true)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const packageData = {
        ...formData,
        rating: Number.parseFloat(formData.rating) || 0,
        reviews: Number.parseInt(formData.reviews) || 0,
      }

      if (modalMode === "add") {
        await post("/packages", packageData)
      } else {
        await put(`/packages/${selectedPackage._id}`, packageData)
      }

      await fetchPackages()
      setShowModal(false)
      setError(null)
    } catch (err) {
      console.error("Error saving package:", err)
      setError(`Failed to ${modalMode} package`)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!packageToDelete) return

    try {
      await del(`/packages/${packageToDelete._id}`)
      await fetchPackages()
      setShowDeleteModal(false)
      setPackageToDelete(null)
      setError(null)
    } catch (err) {
      console.error("Error deleting package:", err)
      setError("Failed to delete package")
    }
  }

  // Open delete confirmation
  const openDeleteModal = (pkg) => {
    setPackageToDelete(pkg)
    setShowDeleteModal(true)
  }

  const PackageCard = ({ pkg }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-base font-semibold text-gray-900 truncate">{pkg.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>
        </div>
        <div className="flex space-x-1 flex-shrink-0">
          <button
            onClick={() => openEditModal(pkg)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit package"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(pkg)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete package"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-500 text-xs block mb-1">Category</span>
          <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
            {pkg.category}
          </span>
        </div>
        <div>
          <span className="text-gray-500 text-xs block mb-1">Featured</span>
          <span
            className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
              pkg.featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {pkg.featured ? "Yes" : "No"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">${pkg.price}</span>
          <span className="text-gray-500">Rating: {pkg.rating}/5</span>
        </div>
        <span className="text-gray-500 text-xs">{pkg.duration}</span>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Packages</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your travel packages and their details</p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Package
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
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

            {/* Filters Toggle for Mobile */}
            <div className="block sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100"
              >
                <span className="flex items-center">
                  <FaFilter className="w-4 h-4 mr-2" />
                  Filters
                </span>
                {showFilters ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {loadingCategories ? (
                    <option>Loading categories...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
                
                {/* Additional filters can be added here */}
                <div className="flex-1 flex space-x-3">
                  <select className="flex-1 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {currentPackages.length} of {filteredPackages.length} packages
          </p>
          <div className="sm:hidden">
            <select
              value={currentPage}
              onChange={(e) => paginate(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2"
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Packages Grid/Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Mobile Card Layout */}
          <div className="block lg:hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">
                {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""} found
              </h3>
            </div>
            <div className="p-3 sm:p-4 grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              {currentPackages.length > 0 ? (
                currentPackages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
              ) : (
                <div className="col-span-2 text-center py-8 sm:py-12">
                  <FaBoxOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Packages found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tablet Card Layout */}
          <div className="hidden lg:block xl:hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">
                {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""} found
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentPackages.length > 0 ? (
                currentPackages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
              ) : (
                <div className="col-span-2 text-center py-12">
                  <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Packages found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden xl:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPackages.length > 0 ? (
                    currentPackages.map((pkg) => (
                      <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{pkg.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 capitalize">{pkg.category}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{pkg.location}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 font-medium">${pkg.price}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{pkg.rating}/5</td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              pkg.featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {pkg.featured ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(pkg)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              aria-label="Edit package"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(pkg)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Delete package"
                            >
                              <FaTrash className="w-4 h-4" />
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
            <div className="bg-white px-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstPackage + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(indexOfLastPackage, filteredPackages.length)}</span> of{" "}
                    <span className="font-medium">{filteredPackages.length}</span> results
                  </p>
                </div>
                
                {/* Mobile Pagination */}
                <div className="flex justify-center sm:hidden">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Desktop Pagination */}
                <div className="hidden sm:flex justify-center">
                  <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {modalMode === "add" ? "Add New Package" : "Edit Package"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loadingCategories}
                    required
                  >
                    <option value="">Select a category</option>
                    {loadingCategories ? (
                      <option>Loading categories...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 7 days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reviews Count</label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Includes (comma-separated)</label>
                <textarea
                  value={formData.includes.join(", ")}
                  onChange={(e) => handleArrayInput("includes", e.target.value)}
                  rows="2"
                  placeholder="Flight tickets, Hotel accommodation, Meals"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highlights (comma-separated)</label>
                <textarea
                  value={formData.highlights.join(", ")}
                  onChange={(e) => handleArrayInput("highlights", e.target.value)}
                  rows="2"
                  placeholder="Visit holy sites, Professional guide, Group activities"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Package</span>
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 sm:space-y-0 space-x-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4 mr-2" />
                      {modalMode === "add" ? "Add Package" : "Update Package"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Package</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{packageToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Packages