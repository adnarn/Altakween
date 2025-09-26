const Package = require("../models/Package")

// Get all packages with filtering, searching, and pagination
const getPackages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      minPrice,
      maxPrice,
      featured,
      minRating,
      location,
    } = req.query

    // Build filter object
    const filter = {}

    if (category && category !== "all") {
      filter.category = category
    }

    if (status && status !== "all") {
      filter.status = status
    }

    if (featured === "true") {
      filter.featured = true
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" }
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { includes: { $elemMatch: { $regex: search, $options: "i" } } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ]
    }

    if (minPrice || maxPrice) {
      filter.numericPrice = {}
      if (minPrice) filter.numericPrice.$gte = Number(minPrice)
      if (maxPrice) filter.numericPrice.$lte = Number(maxPrice)
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Execute query with pagination
    const packages = await Package.find(filter).sort(sort).skip(skip).limit(Number(limit))

    // Get total count for pagination
    const total = await Package.countDocuments(filter)
    const totalPages = Math.ceil(total / Number(limit))

    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: Number(limit),
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching packages",
      error: error.message,
    })
  }
}

// Get single package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params

    const pkg = await Package.findById(id)

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      })
    }

    res.status(200).json({
      success: true,
      data: pkg,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching package",
      error: error.message,
    })
  }
}

// Create new package
const createPackage = async (req, res) => {
  try {
    const packageData = req.body

    const newPackage = new Package(packageData)
    const savedPackage = await newPackage.save()

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: savedPackage,
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Error creating package",
      error: error.message,
    })
  }
}

// Update package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedPackage = await Package.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: updatedPackage,
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Error updating package",
      error: error.message,
    })
  }
}

// Delete package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params

    const deletedPackage = await Package.findByIdAndDelete(id)

    if (!deletedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
      data: deletedPackage,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting package",
      error: error.message,
    })
  }
}

// Bulk operations
const bulkUpdatePackages = async (req, res) => {
  try {
    const { ids, updateData } = req.body

    const result = await Package.updateMany({ _id: { $in: ids } }, updateData, { runValidators: true })

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} packages updated successfully`,
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating packages",
      error: error.message,
    })
  }
}

const bulkDeletePackages = async (req, res) => {
  try {
    const { ids } = req.body

    const result = await Package.deleteMany({ _id: { $in: ids } })

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} packages deleted successfully`,
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting packages",
      error: error.message,
    })
  }
}

// Get package statistics
const getPackageStats = async (req, res) => {
  try {
    const stats = await Package.aggregate([
      {
        $group: {
          _id: null,
          totalPackages: { $sum: 1 },
          activePackages: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          inactivePackages: {
            $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
          },
          featuredPackages: {
            $sum: { $cond: ["$featured", 1, 0] },
          },
          averagePrice: { $avg: "$numericPrice" },
          totalValue: { $sum: "$numericPrice" },
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: "$reviews" },
        },
      },
    ])

    const categoryStats = await Package.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          averagePrice: { $avg: "$numericPrice" },
          averageRating: { $avg: "$rating" },
          featuredCount: { $sum: { $cond: ["$featured", 1, 0] } },
        },
      },
    ])

    const topRatedPackages = await Package.find({ status: "active" })
      .sort({ rating: -1, reviews: -1 })
      .limit(5)
      .select("title rating reviews category")

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalPackages: 0,
          activePackages: 0,
          inactivePackages: 0,
          featuredPackages: 0,
          averagePrice: 0,
          totalValue: 0,
          averageRating: 0,
          totalReviews: 0,
        },
        categoryBreakdown: categoryStats,
        topRatedPackages,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching package statistics",
      error: error.message,
    })
  }
}

// Get featured packages
const getFeaturedPackages = async (req, res) => {
  try {
    const { limit = 6 } = req.query

    const packages = await Package.find({ featured: true, status: "active" })
      .sort({ rating: -1, createdAt: -1 })
      .limit(Number(limit))

    res.status(200).json({
      success: true,
      data: packages,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured packages",
      error: error.message,
    })
  }
}

// Get packages by category
const getPackagesByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const { limit = 10, page = 1 } = req.query

    const filter = { category, status: "active" }
    const skip = (Number(page) - 1) * Number(limit)

    const packages = await Package.find(filter)
      .sort({ featured: -1, rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Package.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching packages by category",
      error: error.message,
    })
  }
}

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  bulkUpdatePackages,
  bulkDeletePackages,
  getPackageStats,
  getFeaturedPackages,
  getPackagesByCategory,
}
