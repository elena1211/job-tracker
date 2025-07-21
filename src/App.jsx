import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialData = [
  {
    id: uuidv4(),
    company: 'Spotify',
    title: 'Frontend Engineer',
    location: 'Stockholm',
    workStyle: 'Hybrid',
    status: 'Applied',
    salary: '$85,000',
    date: '2025-07-21',
    note: 'Via referral',
    link: 'https://jobs.spotify.com/frontend-engineer',
  },
  {
    id: uuidv4(),
    company: 'Monzo',
    title: 'UI Developer',
    location: 'London',
    workStyle: 'Remote',
    status: 'Interviewing',
    salary: '£65,000',
    date: '2025-07-15',
    note: 'First round done',
    link: 'https://monzo.com/careers/ui-developer',
  },
  {
    id: uuidv4(),
    company: 'Revolut',
    title: 'Frontend Developer',
    location: 'London',
    workStyle: 'Onsite',
    status: 'Rejected',
    salary: '£70,000',
    date: '2025-06-30',
    note: 'No response',
  },
  {
    id: uuidv4(),
    company: 'Netflix',
    title: 'Senior React Developer',
    location: 'Los Angeles',
    workStyle: 'Remote',
    status: 'Applied',
    salary: '$120,000',
    date: '2025-07-20',
    note: 'Applied through LinkedIn',
    link: 'https://jobs.netflix.com/senior-react-dev',
  },
  {
    id: uuidv4(),
    company: 'Stripe',
    title: 'Full Stack Engineer',
    location: 'San Francisco',
    workStyle: 'Hybrid',
    status: 'Offer',
    salary: '$140,000',
    date: '2025-07-10',
    note: 'Final round scheduled',
    link: 'https://stripe.com/jobs/fullstack',
  },
  {
    id: uuidv4(),
    company: 'Shopify',
    title: 'JavaScript Developer',
    location: 'Toronto',
    workStyle: 'Remote',
    status: 'Interviewing',
    salary: 'CAD $90,000',
    date: '2025-07-18',
    note: 'Technical interview next week',
  },
  {
    id: uuidv4(),
    company: 'Airbnb',
    title: 'Frontend Engineer',
    location: 'Amsterdam',
    workStyle: 'Onsite',
    status: 'Applied',
    salary: '€75,000',
    date: '2025-07-19',
    note: 'Waiting for response',
    link: 'https://careers.airbnb.com/frontend',
  },
  {
    id: uuidv4(),
    company: 'Microsoft',
    title: 'Software Engineer II',
    location: 'Seattle',
    workStyle: 'Hybrid',
    status: 'Interviewing',
    salary: '$110,000',
    date: '2025-07-12',
    note: 'Phone screen completed',
  },
  {
    id: uuidv4(),
    company: 'GitHub',
    title: 'Web Developer',
    location: 'Berlin',
    workStyle: 'Remote',
    status: 'Applied',
    salary: '€80,000',
    date: '2025-07-17',
    note: 'Portfolio submitted',
    link: 'https://github.com/careers',
  },
];

const statusColors = {
  Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-500 dark:text-white',
  Interviewing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:text-white',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-500 dark:text-white',
  Offer: 'bg-green-100 text-green-800 dark:bg-green-500 dark:text-white',
};

const JobTracker = () => {
  const [jobs, setJobs] = useState(() => {
    // Force reset localStorage to use the new initialData with all 9 jobs
    localStorage.setItem('jobs', JSON.stringify(initialData));
    return initialData;
  });

  const [form, setForm] = useState({
    company: '',
    title: '',
    location: '',
    workStyle: 'Remote',
    status: 'Applied',
    salary: '',
    date: '',
    note: '',
    link: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    status: 'All',
    workStyle: 'All',
    location: 'All',
    search: '',
  });

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddJob = () => {
    if (!form.company || !form.title || !form.date) return alert('Please fill in all required fields.');
    
    if (editingId) {
      // Update existing job
      setJobs(jobs.map(job => 
        job.id === editingId ? { ...job, ...form } : job
      ));
      setEditingId(null);
    } else {
      // Add new job
      const newJob = {
        id: uuidv4(),
        ...form,
      };
      setJobs([newJob, ...jobs]);
    }
    
    setForm({ company: '', title: '', location: '', workStyle: 'Remote', status: 'Applied', salary: '', date: '', note: '', link: '' });
    setShowForm(false);
  };

  const handleEdit = (job) => {
    setForm({
      company: job.company,
      title: job.title,
      location: job.location || '',
      workStyle: job.workStyle || job.location || 'Remote', // Handle legacy data
      status: job.status,
      salary: job.salary || '',
      date: job.date,
      note: job.note || '',
      link: job.link || '',
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ company: '', title: '', location: '', workStyle: 'Remote', status: 'Applied', salary: '', date: '', note: '', link: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filters.status === 'All' || job.status === filters.status;
    const matchesWorkStyle = filters.workStyle === 'All' || (job.workStyle || 'Remote') === filters.workStyle;
    const matchesLocation = filters.location === 'All' || (job.location || '').toLowerCase().includes(filters.location.toLowerCase()) || filters.location === '';
    const matchesSearch = filters.search === '' || 
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesWorkStyle && matchesLocation && matchesSearch;
  });

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(jobs.map(job => job.location).filter(Boolean))].sort();

  // Stats for dashboard
  const stats = {
    total: jobs.length,
    applied: jobs.filter(job => job.status === 'Applied').length,
    interviewing: jobs.filter(job => job.status === 'Interviewing').length,
    offers: jobs.filter(job => job.status === 'Offer').length,
    rejected: jobs.filter(job => job.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-zinc-900 dark:text-white">
          🎯 Job Application Tracker
        </h1>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-zinc-800/80 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-zinc-800 dark:text-white">{stats.total}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">Total Jobs</div>
          </div>
          <div className="bg-blue-100/80 dark:bg-blue-800/80 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.applied}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Applied</div>
          </div>
          <div className="bg-yellow-100/80 dark:bg-yellow-800/80 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{stats.interviewing}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Interviewing</div>
          </div>
          <div className="bg-green-100/80 dark:bg-green-800/80 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">{stats.offers}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Offers</div>
          </div>
          <div className="bg-red-100/80 dark:bg-red-800/80 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">{stats.rejected}</div>
            <div className="text-sm text-red-700 dark:text-red-300">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 dark:bg-zinc-800/80 p-4 rounded-xl mb-8">
          <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">🔍 Filter Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search company or title..."
              value={filters.search}
              onChange={handleFilterChange}
              className="p-2 rounded border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-2 rounded border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            >
              <option>All</option>
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Rejected</option>
              <option>Offer</option>
            </select>
            <select
              name="workStyle"
              value={filters.workStyle}
              onChange={handleFilterChange}
              className="p-2 rounded border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            >
              <option>All</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="p-2 rounded border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            >
              <option value="All">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>

        {/* Add Job Button */}
        {!showForm && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              ✚ Add Job
            </button>
          </div>
        )}

        {/* Popup/Modal Overlay */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
                  {editingId ? '✏️ Edit Job' : '✚ Add New Job'}
                </h2>
                <button 
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid gap-4">
                <input type="text" name="company" placeholder="Company *" value={form.company} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input type="text" name="title" placeholder="Job Title *" value={form.title} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input type="text" name="location" placeholder="Location (e.g., London, Edinburgh, etc.)" value={form.location} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input type="url" name="link" placeholder="Job Link (optional)" value={form.link} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select name="workStyle" value={form.workStyle} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>Onsite</option>
                  </select>
                  <input type="text" name="salary" placeholder="Salary (optional)" value={form.salary} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                
                <input type="date" name="date" value={form.date} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <select name="status" value={form.status} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Applied</option>
                  <option>Interviewing</option>
                  <option>Rejected</option>
                  <option>Offer</option>
                </select>
                <textarea name="note" placeholder="Notes (optional)" rows="3" value={form.note} onChange={handleChange} className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
                
                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-600">
                  <button onClick={handleAddJob} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium">
                    {editingId ? 'Update Job' : 'Save Job'}
                  </button>
                  <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition duration-200">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? filteredJobs.map((job) => (
            <div
              key={job.id}
              className="backdrop-blur-sm bg-white/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-600 p-5 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">{job.company}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-300">{job.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {job.location && (
                      <span className="text-xs bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        📍 {job.location}
                      </span>
                    )}
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                      {job.workStyle === 'Remote' && '🏡'} 
                      {job.workStyle === 'Hybrid' && '🔄'} 
                      {job.workStyle === 'Onsite' && '🏢'} 
                      {!job.workStyle && '🏡'} {job.workStyle || job.location || 'Remote'}
                    </span>
                    {job.salary && (
                      <span className="text-xs bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                        💰 {job.salary}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[job.status]}`}>
                  {job.status}
                </span>
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-200 flex-grow">
                <p>📅 Applied on: <span className="font-medium">{job.date}</span></p>
                {job.note && <p className="italic mt-1">📝 {job.note}</p>}
                {job.link && (
                  <p className="mt-1">
                    🔗 <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      View Job Posting
                    </a>
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleEdit(job)}
                  className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-300"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-zinc-500 dark:text-zinc-400">
              <p className="text-xl mb-2">😔 No jobs found</p>
              <p>Try adjusting your filters or add a new job application</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTracker;
