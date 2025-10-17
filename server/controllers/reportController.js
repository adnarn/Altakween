const Booking = require('../models/booking');
const User = require('../models/user');
const { format } = require('date-fns');

// @desc    Get reports data
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
  try {
    // Get date range from query params (default to last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get all bookings within date range
    const bookings = await Booking.find({
      createdAt: { $gte: startDate, $lte: endDate }
    })
    .populate('packageId', 'title')
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 });

    // Get user registration stats
    const userStats = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get booking stats by status
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$estimatedTotal" }
        }
      }
    ]);

    // Format the response
    const response = {
      dateRange: {
        start: startDate,
        end: endDate
      },
      stats: {
        totalUsers: await User.countDocuments(),
        totalBookings: await Booking.countDocuments(),
        totalRevenue: (await Booking.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$estimatedTotal" }
            }
          }
        ]))[0]?.total || 0,
        bookingsByStatus: bookingStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      },
      recentBookings: bookings.slice(0, 10).map(booking => ({
        _id: booking._id,
        bookingReference: booking.bookingReference,
        packageId: booking.packageId,
        customerInfo: {
          firstName: booking.userId?.firstName || 'N/A',
          lastName: booking.userId?.lastName || 'N/A',
          email: booking.userId?.email || 'N/A'
        },
        estimatedTotal: booking.estimatedTotal,
        bookingStatus: booking.bookingStatus,
        createdAt: booking.createdAt
      })),
      userStats: userStats.map(stat => ({
        date: stat._id,
        count: stat.count
      })),
      bookingStats: bookingStats
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReports
};
