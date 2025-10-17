const Booking = require('../models/booking');
const User = require('../models/user');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments({ role: 'client' });
    
    // Get total bookings count
    const totalBookings = await Booking.countDocuments();
    
    // Get bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$bookingStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: { $toDouble: '$estimatedTotal' } }
        }
      }
    ]);

    // Calculate total revenue (sum of all confirmed and completed bookings)
    const totalRevenue = bookingsByStatus
      .filter(stat => ['confirmed', 'completed'].includes(stat._id))
      .reduce((sum, stat) => sum + (stat.totalAmount || 0), 0);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('packageId', 'title')
      .select('bookingReference customerInfo bookingStatus estimatedTotal createdAt');

    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          bookingStatus: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: { $toDouble: '$estimatedTotal' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format the response
    const stats = {
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue.toFixed(2),
      bookingsByStatus: bookingsByStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentBookings,
      monthlyRevenue
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
