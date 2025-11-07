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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-violet-200 object-cover mb-4"
            />
            <div className="text-center">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar size={16} />
                <span>Joined {formatDate(currentUser.createdAt)}</span>
              </div>
              {currentUser.isPro && (
                <span className="inline-block bg-gradient-to-r from-violet-400 to-violet-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Pro Member
                </span>
              )}
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 w-full">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="flex gap-3">
                    <InputField
                      icon={User}
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="flex-1"
                    />
                    <Button onClick={handleSave} isLoading={isLoading} size="sm">
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} size="sm">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-gray-400" />
                      <span className="text-lg font-semibold text-gray-900">{currentUser.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit size={16} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-gray-400 mr-3" />
                  <span className="text-gray-900">{currentUser.email}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
