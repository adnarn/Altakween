const express = require("express")
const router = express.Router()
const {
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
} = require("../controllers/packageController")

// Package statistics route
router.get("/stats", getPackageStats)

router.get("/featured", getFeaturedPackages)
router.get("/category/:category", getPackagesByCategory)

// Main CRUD routes
router.route("/").get(getPackages).post(createPackage)

router.route("/:id").get(getPackageById).put(updatePackage).delete(deletePackage)

// Bulk operations
router.post("/bulk-update", bulkUpdatePackages)
router.post("/bulk-delete", bulkDeletePackages)

module.exports = router
