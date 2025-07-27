import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { jobsAPI, applicationsAPI } from '../services/api'
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  DocumentArrowUpIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const JobDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [cvFile, setCvFile] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const response = await jobsAPI.getJobById(id)
      setJob(response.data)
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    
    if (!user) {
      navigate('/login')
      return
    }

    if (!cvFile) {
      alert('Please select a CV file')
      return
    }

    setApplying(true)
    
    try {
      const formData = new FormData()
      formData.append('cv', cvFile)
      
      await applicationsAPI.applyToJob(id, formData)
      setApplicationSuccess(true)
      setShowApplicationForm(false)
    } catch (error) {
      console.error('Error applying to job:', error)
      alert('Error submitting application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified'
    return `$${salary.toLocaleString()}`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
          <p className="text-gray-600 mt-2">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {applicationSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          Application submitted successfully! We'll be in touch soon.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                <span>Company</span>
              </div>
            </div>
            
            {user && user.role === 'candidate' && !applicationSuccess && (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Apply Now
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              {job.location && (
                <div className="flex items-center text-gray-700">
                  <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{job.location}</span>
                </div>
              )}
              
              {job.salary && (
                <div className="flex items-center text-gray-700">
                  <CurrencyDollarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-700">
                <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>
            
            <div>
              {job.type && (
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {job.type}
                </span>
              )}
            </div>
          </div>

          {job.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Apply for {job.title}
            </h3>
            
            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CV (PDF only)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetails