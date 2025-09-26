"use client"

import { useEffect, useState } from "react" 
import { User, Mail, Phone, MapPin, Edit, CalendarCheck, KeyRound } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useApi } from "../contexts/ApiContext"
import PageLayout from "../components/PageLayout"

const ClientProfile = () => {
  const { user: authUser, loading: authLoading } = useAuth()
  const { get } = useApi()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Starting fetchUserData');
      
      if (!authUser) {
        console.log('No authUser available in context');
        // Try to get user from localStorage as fallback
        try {
          const storedUser = localStorage.getItem("altaqween_user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            console.log('Using user data from localStorage');
            setUser(userData);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
        
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching fresh user data from server...');
        const response = await get("/users/get-user");
        console.log('Server response:', response);
        
        if (response && response.success) {
          console.log('Successfully fetched user data');
          const userData = response.user || response; // Handle both response formats
          setUser(userData);
        } else {
          console.warn('Using authUser as fallback');
          setUser(authUser);
        }
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        
        // Log detailed error information
        const errorInfo = {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText,
        };
        console.error('Error details:', errorInfo);
        
        // Use authUser as fallback if available
        if (authUser) {
          console.log('Falling back to authUser data');
          setUser(authUser);
        } else {
          setError("Failed to load user data. Please try logging in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if not loading and we have an auth user
    if (!authLoading) {
      console.log('Auth state loaded, checking authentication...');
      fetchUserData();
    }
  }, [authUser, authLoading, get])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-lg text-gray-600">
        You are not logged in.
      </div>
    )
  }

  return (
    <PageLayout>
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-2">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <User className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{user.role || "client"}</p>

            <div className="mt-6 w-full space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                <KeyRound className="w-4 h-4" />
                Change Password
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <CalendarCheck className="w-4 h-4" />
                My Bookings
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Information</h2>

            <InfoItem label="Full Name" icon={<User className="w-4 h-4 text-blue-600" />} value={user.name} />

            <InfoItem label="Email Address" icon={<Mail className="w-4 h-4 text-blue-600" />} value={user.email} />

            {user.phone && (
              <InfoItem label="Phone Number" icon={<Phone className="w-4 h-4 text-blue-600" />} value={user.phone} />
            )}

            {user.address && (
              <InfoItem
                label="Address"
                icon={<MapPin className="w-4 h-4 text-blue-600" />}
                value={`${user.address}${user.state ? `, ${user.state}` : ""}${user.country ? `, ${user.country}` : ""}`}
              />
            )}

            <InfoItem
              label="Account Type"
              icon={<User className="w-4 h-4 text-blue-600" />}
              value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Client"}
            />

            {user.createdAt && (
              <InfoItem
                label="Member Since"
                icon={<CalendarCheck className="w-4 h-4 text-blue-600" />}
                value={new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
    </PageLayout>
  )
}

const InfoItem = ({ label, icon, value }) => (
  <div className="border-b border-gray-100 pb-4 last:border-b-0">
    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
      {icon}
      {label}
    </p>
    <p className="text-lg font-semibold text-gray-800">{value || "Not provided"}</p>
  </div>
)

export default ClientProfile
