import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";

import { User, Mail, Calendar, Edit, Save, X, Loader2 } from "lucide-react"; // Added Save and X icons

import ProfileBg from "../assets/profile.png"; // your image

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setProfileData(response.data);

        if (!user.createdAt) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, updateUser]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const currentUser = profileData || user;

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name,
      });
      updateUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser.name);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      // Ensure the date is treated as UTC to prevent timezone issues shifting the date
      // Assuming createdAt is an ISO string like "2025-11-04T00:00:00.000Z"
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Unknown";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition duration-500 hover:shadow-3xl">
        <div className="w-full h-40 relative">
          <img
            src={ProfileBg}
            alt="Profile header background"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* PROFILE AVATAR */}
        <div className="relative -mt-16 flex justify-center">
          <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-rose-600 ring-2 ring-gray-100">
            {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

        {/* PROFILE CONTENT */}
        <div className="p-6 md:p-8">

          {/* Name + Edit */}
          <div className="text-center mb-6">
            {isEditing ? (
              <div className="flex flex-col gap-3 items-center">
                {/* Name Input */}
                <div className="space-y-2 w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter new name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>
                <div className="flex gap-2 w-full justify-center">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap flex-1 max-w-[120px] bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2.5 h-11 rounded-xl shadow-lg shadow-pink-300/50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap flex-1 max-w-[120px] bg-gray-100 hover:bg-pink-50 text-gray-700 border border-gray-200 px-4 py-2.5 h-11 rounded-xl"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 text-rose-600 hover:text-rose-700 transition duration-150 flex items-center justify-center mx-auto gap-1 text-base font-medium p-1 rounded-lg"
                >
                  <Edit size={15} /> Edit Profile
                </button>
              </>
            )}
          </div>
          
          <hr className="my-6 border-gray-100" />

          {/* Email */}
          <div className="flex items-center gap-4 bg-rose-50 p-4 rounded-xl mb-4 transition duration-200 hover:bg-rose-100">
            <Mail className="text-rose-600 flex-shrink-0" size={24} />
            <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs font-semibold uppercase text-rose-500">Email Address</span>
                <span className="font-medium text-gray-800 truncate">
                {currentUser.email}
                </span>
            </div>
          </div>

          {/* Joined Date */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl transition duration-200 hover:bg-gray-100">
            <Calendar className="text-gray-500 flex-shrink-0" size={24} />
            <div className="flex flex-col text-left">
                <span className="text-xs font-semibold uppercase text-gray-500">Member Since</span>
                <span className="font-medium text-gray-800">
                {formatDate(currentUser.createdAt)}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;