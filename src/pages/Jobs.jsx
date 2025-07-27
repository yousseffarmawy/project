import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../services/api'
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    type: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await jobsAPI.getAllJobs(filters)
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Jobs</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={filters.title}
                  onChange={handleFilterChange}
                  placeholder="Search jobs..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, State"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ title: '', location: '', type: '' })}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link 
                      to={`/jobs/${job._id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    {job.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                    
                    {job.salary && (
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        {formatSalary(job.salary)}
                      </div>
                    )}
                    
                    {job.type && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {job.type}
                      </span>
                    )}
                    
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Posted {formatDate(job.createdAt)}
                    </div>
                  </div>
                  
                  {job.description && (
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {job.description}
                    </p>
                  )}
                </div>
                
                <div className="ml-6">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Jobs