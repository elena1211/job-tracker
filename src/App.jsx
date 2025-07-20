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

const JobTracker = () => {
  const [jobs, setJobs] = useState(() => {
    const stored = localStorage.getItem('jobs');
    return stored ? JSON.parse(stored) : initialData;
  });
  const [form, setForm] = useState({
    company: '',
    title: '',
    date: '',
    status: 'Applied',
    note: '',
  });

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company || !form.title || !form.date) return;
    setJobs([
      {
        id: uuidv4(),
        ...form,
      },
      ...jobs,
    ]);
    setForm({ company: '', title: '', date: '', status: 'Applied', note: '' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-10 text-center text-zinc-900 dark:text-white">Job Application Tracker</h1>
        {/* Add Job Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow mb-10 flex flex-col md:flex-row md:items-end gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
            className="border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 flex-1 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800"
            required
          />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Position"
            className="border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 flex-1 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 flex-1 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 flex-1 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800"
          >
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Note"
            className="border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 flex-1 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-800 transition w-full md:w-auto"
          >
            Add
          </button>
        </form>
        {/* Job List */}
        <div className="flex flex-col gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-zinc-900 text-white flex flex-row justify-between items-center rounded-xl shadow p-8 max-w-6xl mx-auto min-h-[150px]"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300">{job.company}</h2>
                <p className="text-lg text-zinc-200">{job.title}</p>
                <p className="text-md text-zinc-400 italic">Applied on: {job.date}</p>
                <p className="text-md text-zinc-400 italic">{job.note}</p>
              </div>
              <span className="ml-8 px-8 py-3 rounded-full text-lg font-medium bg-blue-800 text-blue-100 dark:bg-blue-800 dark:text-blue-200">
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobTracker;

