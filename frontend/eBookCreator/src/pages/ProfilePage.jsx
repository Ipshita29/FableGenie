import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../utlis/axiosInstance'
import { API_PATHS } from '../utlis/apiPaths'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import { User, Mail, Calendar, Edit } from 'lucide-react'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
        setProfileData(response.data)
        // Update the auth context if needed
        if (!user.createdAt) {
          updateUser(response.data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user, updateUser])

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  const currentUser = profileData || user

  const handleSave = async () => {
    if (!name.trim()) return
    setIsLoading(true)
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, { name })
      updateUser(response.data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setName(currentUser.name)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Invalid date:', dateString)
      return 'Unknown'
    }
  }

  return (
    // FIX: Removed min-h-screen from here and rely on parent Layout. 
    // Added flex properties to ensure vertical centering of the content card itself.
    // Background: Subtle off-white/gray gradient
    <div className="flex justify-center items-start pt-12 pb-12 w-full min-h-[calc(100vh-6rem)] bg-gray-50/70">
      
      {/* Container: Centered, modern styling with subtle rose accents */}
      <div className="max-w-3xl w-full bg-white p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-10">
          {/* Title: Clean, professional heading */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Profile</h1>
          <p className="text-lg text-gray-500">Review and update your personal details</p>
        </div>

        {/* Layout: Consistent gap */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            {/* Avatar: Muted rose ring */}
            <div className="w-28 h-28 rounded-full border-4 border-rose-300/50 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-4xl mb-4 transition-transform duration-300 hover:scale-[1.03]">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Calendar size={16} className="text-rose-500" /> {/* Muted rose icon */}
                <span>Joined {formatDate(currentUser.createdAt)}</span>
              </div>
              {currentUser.isPro && (
                // Pro Member Badge: Subtle rose gradient
                <span className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md shadow-rose-200">
                  Pro Member
                </span>
              )}
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 w-full space-y-8">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                // Editing State
                <div className="flex gap-3 items-center">
                  <InputField
                    icon={User}
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 border-gray-300 focus:border-rose-500" // Rose focus
                  />
                  <Button 
                    onClick={handleSave} 
                    isLoading={isLoading} 
                    size="sm" 
                    // Save Button: Muted rose
                    className="bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200" 
                  >
                    Save
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleCancel} 
                    size="sm"
                    className="border border-gray-300 text-gray-700 hover:bg-gray-100" 
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                // Display State: Clean background, subtle rose border on hover
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl transition duration-300 hover:border-rose-300">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-rose-500" /> {/* Muted rose icon */}
                    <span className="text-lg font-bold text-gray-900">{currentUser.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="text-rose-600 hover:bg-rose-50" // Muted rose edit button
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              {/* Display State */}
              <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <Mail size={20} className="text-rose-500 mr-3" /> {/* Muted rose icon */}
                <span className="text-gray-900 font-medium">{currentUser.email}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">
                <span className="font-semibold text-rose-600">Note:</span> Email cannot be changed here.
              </p>
            </div>

            {/* Placeholder for future sections */}
            <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                    Need help? Contact support for advanced account changes.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage