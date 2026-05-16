'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import JobCard from '../components/JobCard';
import { API_BASE } from '../lib/api';

const statuses = ['All', 'Open', 'In Progress', 'Closed'];

export default function HomePage() {
  const [categories, setCategories] = useState(['All']);
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (status !== 'All') params.set('status', status);
    if (search.trim()) params.set('q', search.trim());
    return params.toString() ? `?${params.toString()}` : '';
  }, [category, status, search]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs/categories`);
        if (!res.ok) throw new Error('Unable to load categories');
        const data = await res.json();
        setCategories(['All', ...data]);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/jobs${queryString}`);
        if (!res.ok) throw new Error('Unable to load jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [queryString]);

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="brand-group">
          <div className="brand">
            <img src="/assets/Logo.png" alt="ProConnect logo" className="brand-logo" />
            <div>
              <p className="brand-title">ProConnect</p>
              <p className="brand-subtitle">Service Request Board</p>
            </div>
          </div>
          <p className="subtitle">Browse and manage service requests from homeowners.</p>
        </div>
        <Link href="/new-job" className="button primary">
          + New Request
        </Link>
      </header>

      <section className="filter-panel">
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statuses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="search-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description"
          />
        </div>

        <div className="count-text">Showing {jobs.length} of {jobs.length}</div>
      </section>

      {error && <div className="feedback error">{error}</div>}
      {loading ? (
        <div className="feedback">Loading jobs…</div>
      ) : jobs.length === 0 ? (
        <div className="feedback">No jobs match your filters.</div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </main>
  );
}
