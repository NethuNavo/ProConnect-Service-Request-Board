'use client';

import Link from 'next/link';

const statusStyles = {
  Open: 'tag open',
  'In Progress': 'tag progress',
  Closed: 'tag closed',
};

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`} className="job-card">
      <div className="card-top">
        <span className="category-chip">{job.category}</span>
        <span className={statusStyles[job.status] || 'tag'}>{job.status}</span>
      </div>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <div className="job-meta">
        <span className="meta-item">
          <img src="/assets/location-icon.svg" alt="Location" className="meta-icon" />
          <span>{job.location}</span>
        </span>
        <span className="meta-item">
          <span className="meta-icon" aria-hidden="true">📅</span>
          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
        </span>
      </div>
    </Link>
  );
}
