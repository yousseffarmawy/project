import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { applicationsAPI } from '../services/api'
import { 
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const Applications = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getMyApplications()
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCV = async (filename) => {
    try {
      const response = await applicationsAPI.downloadCV(filename)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading CV:', error)
      alert('Error downloading CV')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'company' ? 'Job Applications' : 'My Applications'}
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'company' 
            ? 'Manage applications for your posted jobs'
            : 'Track your job applications and their status'
          }
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {user?.role === 'company' 
              ? 'No applications received yet.'
              : 'You haven\'t applied to any jobs yet.'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {user?.role === 'company' ? 'Candidate' : 'Job Title'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {user?.role === 'company' ? 'Position' : 'Company'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CV
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.role === 'company' 
                          ? application.user?.name || 'Unknown'
                          : application.job?.title || 'Job Title'
                        }
                      </div>
                      {user?.role === 'company' && application.user?.email && (
                        <div className="text-sm text-gray-500">
                          {application.user.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user?.role === 'company' 
                          ? application.job?.title || 'Position'
                          : application.job?.company || 'Company'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(application.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {application.status || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.cv && (
                        <button
                          onClick={() => handleDownloadCV(application.cv)}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Applications