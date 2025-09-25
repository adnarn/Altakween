"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plane, MapPin, Star, Clock, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { useApi } from "../contexts/ApiContext"
import PageLayout from "../components/PageLayout"

const Services = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { get } = useApi()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await get("/packages")
        setPackages(response.data || response.packages || response)
      } catch (err) {
        console.error("Error fetching packages:", err)
        setError(err.message || "Failed to load packages")
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [get])

  const categories = [
    { id: "all", name: "All Packages" },
    { id: "featured", name: "Featured" },
    { id: "pilgrimage", name: "Pilgrimage" },
    { id: "travel", name: "Travel" },
  ]

  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === "all") return true
    if (activeTab === "featured") return pkg.featured
    return pkg.category === activeTab
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Travel Packages</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover handpicked destinations and create unforgettable memories with our exclusive travel packages.
            </p>
          </div>
        </div>

        {/* Loading State */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg text-gray-600">Loading packages...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Travel Packages</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover handpicked destinations and create unforgettable memories with our exclusive travel packages.
            </p>
          </div>
        </div>

        {/* Error State */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Packages</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageLayout> 
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Travel Packages</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover handpicked destinations and create unforgettable memories with our exclusive travel packages.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === category.id ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {filteredPackages.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Plane className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Packages Found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "all"
                  ? "No packages are currently available."
                  : `No packages found in the ${activeTab} category.`}
              </p>
              {activeTab !== "all" && (
                <button
                  onClick={() => setActiveTab("all")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Packages
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Packages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id || pkg.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-50"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={pkg.image || "/placeholder.svg"}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                    }}
                  />
                  {pkg.featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-1">{pkg.title}</h3>
                      <div className="flex items-center text-white/90 text-sm">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        <span>{pkg.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full">
                      <Clock className="h-4 w-4 mr-1.5" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center bg-amber-50 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-full">
                      <Star className="h-4 w-4 fill-amber-400 mr-1.5" />
                      {pkg.rating} ({pkg.reviews})
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Package Includes
                    </h4>
                    <ul className="space-y-2.5">
                      {pkg.includes.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-blue-500 mr-2.5 mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                      {pkg.includes.length > 3 && (
                        <li className="text-sm text-blue-600 font-medium pl-7">+{pkg.includes.length - 3} more</li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Starting from</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {typeof pkg.price === "string" && pkg.price.startsWith("₦") ? pkg.price : `₦${pkg.price}`}
                          {!pkg.price.toString().includes("₦") && !pkg.price.toString().includes("$") && (
                            <span className="ml-1 text-sm font-normal text-gray-500">NGN</span>
                          )}
                        </p>
                        {!pkg.price.toString().toLowerCase().includes("custom") && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {pkg.duration.toLowerCase().includes("flexible")
                              ? "Flexible payment options"
                              : "Per person"}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/package/${pkg._id || pkg.id}`}
                        className="group relative inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:from-blue-700 hover:to-blue-800"
                      >
                        <span className="relative z-10">View Details</span>
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-blue-100 mb-8">
              Our travel experts can create a customized itinerary tailored to your preferences and budget.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Contact Our Experts
              </Link>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Call: +234 816 768 2378
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  )
}

export default Services
