import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialData = [
  {
    id: uuidv4(),
    company: 'Spotify',
    title: 'Frontend Engineer',
    status: 'Applied',
    date: '2025-07-21',
    note: 'Via referral',
  },
  {
    id: uuidv4(),
    company: 'Monzo',
    title: 'UI Developer',
    status: 'Interviewing',
    date: '2025-07-15',
    note: 'First round done',
  },
  {
    id: uuidv4(),
    company: 'Revolut',
    title: 'Frontend Developer',
    status: 'Rejected',
    date: '2025-06-30',
    note: 'No response',
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
    const stored = localStorage.getItem('jobs');
    return stored ? JSON.parse(stored) : initialData;
  });

  const [form, setForm] = useState({
    company: '',
    title: '',
    status: 'Applied',
    date: '',
    note: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddJob = () => {
    if (!form.company || !form.title || !form.date) return alert('Please fill in all required fields.');
    const newJob = {
      id: uuidv4(),
      ...form,
    };
    setJobs([newJob, ...jobs]);
    setForm({ company: '', title: '', status: 'Applied', date: '', note: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-zinc-900 dark:text-white">
          🎯 Job Application Tracker
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : '✚ Add Job'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white/90 dark:bg-zinc-800/90 p-6 rounded-xl shadow-md mb-10 max-w-xl mx-auto">
            <div className="grid gap-4">
              <input type="text" name="company" placeholder="Company" value={form.company} onChange={handleChange} className="p-2 rounded border border-zinc-300 dark:border-white dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300" />
              <input type="text" name="title" placeholder="Job Title" value={form.title} onChange={handleChange} className="p-2 rounded border border-zinc-300 dark:border-white dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300" />
              <input type="date" name="date" value={form.date} onChange={handleChange} className="p-2 rounded border border-zinc-300 dark:border-white dark:bg-zinc-700 dark:text-white" />
              <select name="status" value={form.status} onChange={handleChange} className="p-2 rounded border border-zinc-300 dark:border-white dark:bg-zinc-700 dark:text-white">
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
              <textarea name="note" placeholder="Notes (optional)" value={form.note} onChange={handleChange} className="p-2 rounded border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-300"></textarea>
              <button onClick={handleAddJob} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                ✅ Save Job
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="backdrop-blur-sm bg-white/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-600 p-5 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">{job.company}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-300">{job.title}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[job.status]}`}>
                  {job.status}
                </span>
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-200">
                <p>📅 Applied on: <span className="font-medium">{job.date}</span></p>
                {job.note && <p className="italic mt-1">📝 {job.note}</p>}
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-300"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobTracker;
