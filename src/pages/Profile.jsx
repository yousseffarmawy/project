import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  UserIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'

const Profile = () => {
  const { user } = useAuth()

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'candidate':
        return 'Job Seeker'
      case 'company':
        return 'Company'
      case 'admin':
        return 'Administrator'
      default:
        return role
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'candidate':
        return <UserIcon className="h-6 w-6 text-blue-600" />
      case 'company':
        return <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
      case 'admin':
        return <IdentificationIcon className="h-6 w-6 text-purple-600" />
      default:
        return <UserIcon className="h-6 w-6 text-gray-600" />
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'candidate':
        return 'bg-blue-100 text-blue-800'
      case 'company':
        return 'bg-green-100 text-green-800'
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-full">
              {getRoleIcon(user.role)}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-white">
                {user.name || 'User Profile'}
              </h1>
              <p className="text-blue-100 mt-1">
                Welcome to your profile dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Account Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900">{user.name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <IdentificationIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Type</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplay(user.role)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                {user.role === 'candidate' && (
                  <>
                    <a
                      href="/jobs"
                      className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Available Jobs
                    </a>
                    <a
                      href="/applications"
                      className="block w-full bg-gray-200 text-gray-700 text-center px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      View My Applications
                    </a>
                  </>
                )}
                
                {user.role === 'company' && (
                  <>
                    <a
                      href="/post-job"
                      className="block w-full bg-green-600 text-white text-center px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Post New Job
                    </a>
                    <a
                      href="/applications"
                      className="block w-full bg-gray-200 text-gray-700 text-center px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Manage Applications
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile