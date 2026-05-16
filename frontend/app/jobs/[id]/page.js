'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '../../../lib/api';

const statuses = ['Open', 'In Progress', 'Closed'];
const categories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'IT/Software', 'Other'];

export default function JobDetailPage({ params }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    customCategory: '',
    location: '',
    contactName: '',
    contactEmail: '',
    status: 'Open',
  });
  const router = useRouter();

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/jobs/${params.id}`);
        if (!res.ok) {
          throw new Error('Job not found');
        }
        const data = await res.json();
        setJob(data);
        setForm({
          title: data.title,
          description: data.description,
          category: categories.includes(data.category) ? data.category : 'Other',
          customCategory: categories.includes(data.category) ? '' : data.category,
          location: data.location,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          status: data.status,
        });
      } catch (err) {
        setError(err.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [params.id]);

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleStatusUpdate = async (event) => {
    const nextStatus = event.target.value;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/jobs/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to update status');
      }
      const updated = await res.json();
      setJob(updated);
      setForm((current) => ({ ...current, status: updated.status }));
    } catch (err) {
      setError(err.message || 'Unable to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((current) => !current);
    if (job) {
      setForm({
        title: job.title,
        description: job.description,
        category: categories.includes(job.category) ? job.category : 'Other',
        customCategory: categories.includes(job.category) ? '' : job.category,
        location: job.location,
        contactName: job.contactName,
        contactEmail: job.contactEmail,
        status: job.status,
      });
    }
  };

  const handleSave = async () => {
    if (form.category === 'Other' && !form.customCategory.trim()) {
      setError('Please enter a custom category');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category === 'Other' ? form.customCategory.trim() : form.category,
        location: form.location,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        status: form.status,
      };
      const res = await fetch(`${API_BASE}/jobs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to save changes');
      }
      const updated = await res.json();
      setJob(updated);
      setForm({
        title: updated.title,
        description: updated.description,
        category: categories.includes(updated.category) ? updated.category : 'Other',
        customCategory: categories.includes(updated.category) ? '' : updated.category,
        location: updated.location,
        contactName: updated.contactName,
        contactEmail: updated.contactEmail,
        status: updated.status,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Unable to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this request?')) return;
    try {
      const res = await fetch(`${API_BASE}/jobs/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Unable to delete request');
      router.push('/');
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  if (loading) return <main className="page-shell"><div className="feedback">Loading request…</div></main>;
  if (error) return <main className="page-shell"><div className="feedback error">{error}</div></main>;
  if (!job) return null;

  return (
    <main className="page-shell">
      <header className="page-header smaller">
        <div className="brand">
          <img src="/assets/Logo.png" alt="ProConnect logo" className="brand-logo" />
          <div>
            <p className="brand-title">ProConnect</p>
            <p className="brand-subtitle">Service Request Board</p>
            <h1>{job.title}</h1>
            <p className="subtitle">{job.category} • {job.location} • Posted {new Date(job.createdAt).toLocaleDateString()}</p>
            {job.updatedAt && new Date(job.updatedAt).getTime() !== new Date(job.createdAt).getTime() && (
              <p className="subtitle">Updated {new Date(job.updatedAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        <a href="/" className="button secondary">Back to requests</a>
      </header>

      <div className="card detail-card">
        {!isEditing ? (
          <>
            <section>
              <div className="section-title">Description</div>
              <p>{job.description}</p>
            </section>

            <section>
              <div className="section-title">Contact Information</div>
              <div className="contact-row">
                <div>
                  <span className="contact-label">Contact Name</span>
                  <p>{job.contactName}</p>
                </div>
                <div>
                  <span className="contact-label">Email Address</span>
                  <p>{job.contactEmail}</p>
                </div>
              </div>
            </section>

            <section>
              <div className="section-title">Manage Request</div>
              <div className="form-row">
                <label htmlFor="status">Update Status</label>
                <select id="status" value={job.status} onChange={handleStatusUpdate} disabled={saving}>
                  {statuses.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="button-row">
                <button className="button secondary" type="button" onClick={handleEditToggle}>
                  Edit Request
                </button>
                <button className="button danger" type="button" onClick={handleDelete}>
                  Delete Request
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <section>
              <div className="section-title">Edit Request</div>
              <div className="form-row">
                <label htmlFor="title">Title</label>
                <input id="title" value={form.title} onChange={handleChange('title')} />
              </div>
              <div className="form-row">
                <label htmlFor="description">Description</label>
                <textarea id="description" value={form.description} onChange={handleChange('description')} rows="5" />
              </div>
              <div className="grid-two">
                <div className="form-row">
                  <label htmlFor="category">Category</label>
                  <select id="category" value={form.category} onChange={handleChange('category')}>
                    {categories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label htmlFor="location">Location</label>
                  <input id="location" value={form.location} onChange={handleChange('location')} />
                </div>
              </div>
              {form.category === 'Other' && (
                <div className="form-row">
                  <label htmlFor="customCategory">New Category</label>
                  <input id="customCategory" value={form.customCategory || ''} onChange={handleChange('customCategory')} placeholder="Enter a new category" />
                </div>
              )}
              <div className="section-title">Contact Information</div>
              <div className="grid-two">
                <div className="form-row">
                  <label htmlFor="contactName">Contact Name</label>
                  <input id="contactName" value={form.contactName} onChange={handleChange('contactName')} />
                </div>
                <div className="form-row">
                  <label htmlFor="contactEmail">Email Address</label>
                  <input id="contactEmail" type="email" value={form.contactEmail} onChange={handleChange('contactEmail')} />
                </div>
              </div>
              <div className="form-row">
                <label htmlFor="status">Status</label>
                <select id="status" value={form.status} onChange={handleChange('status')}>
                  {statuses.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="button-row">
                <button className="button secondary" type="button" onClick={handleEditToggle} disabled={saving}>
                  Cancel
                </button>
                <button className="button primary" type="button" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </section>
          </>
        )}
        {error && <div className="feedback error">{error}</div>}
      </div>
    </main>
  );
}
