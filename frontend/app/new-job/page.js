'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '../../lib/api';

const categories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'IT/Software', 'Other'];

const initialState = {
  title: '',
  description: '',
  category: 'Plumbing',
  customCategory: '',
  location: '',
  contactName: '',
  contactEmail: '',
};

export default function NewJobPage() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required';
    if (!form.description.trim()) nextErrors.description = 'Description is required';
    if (!form.location.trim()) nextErrors.location = 'Location is required';
    if (!form.contactName.trim()) nextErrors.contactName = 'Contact name is required';
    if (!form.contactEmail.trim()) {
      nextErrors.contactEmail = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.contactEmail)) {
      nextErrors.contactEmail = 'Email is invalid';
    }
    if (form.category === 'Other' && !form.customCategory.trim()) {
      nextErrors.customCategory = 'Please enter a category';
    }
    return nextErrors;
  };

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerError('');
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        category: form.category === 'Other' ? form.customCategory.trim() : form.category,
      };
      const response = await fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || 'Unable to create request');
      }
      router.push('/');
    } catch (err) {
      setServerError(err.message || 'Failed to save request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <header className="page-header smaller">
        <div className="brand">
          <img src="/assets/Logo.png" alt="ProConnect logo" className="brand-logo" />
          <div>
            <p className="brand-title">ProConnect</p>
            <p className="brand-subtitle">Service Request Board</p>
            <h1>Create Service Request</h1>
            <p className="subtitle">Fill out the form below to post a new service request.</p>
          </div>
        </div>
        <a href="/" className="button secondary">Back to requests</a>
      </header>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="title">Request Title *</label>
          <input id="title" value={form.title} onChange={handleChange('title')} placeholder="e.g., Leaking kitchen tap repair" />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div className="form-row">
          <label htmlFor="description">Description *</label>
          <textarea id="description" value={form.description} onChange={handleChange('description')} placeholder="Provide detailed information about the service you need..." rows="5" />
          {errors.description && <p className="field-error">{errors.description}</p>}
        </div>

        <div className="grid-two">
          <div className="form-row">
            <label htmlFor="category">Category *</label>
            <select id="category" value={form.category} onChange={handleChange('category')}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="location">Location *</label>
            <input id="location" value={form.location} onChange={handleChange('location')} placeholder="e.g., Glasgow" />
            {errors.location && <p className="field-error">{errors.location}</p>}
          </div>
        </div>
        {form.category === 'Other' && (
          <div className="form-row">
            <label htmlFor="customCategory">New Category *</label>
            <input id="customCategory" value={form.customCategory} onChange={handleChange('customCategory')} placeholder="Enter a new category" />
            {errors.customCategory && <p className="field-error">{errors.customCategory}</p>}
          </div>
        )}

        <div className="section-title">Contact Information</div>

        <div className="grid-two">
          <div className="form-row">
            <label htmlFor="contactName">Your Name *</label>
            <input id="contactName" value={form.contactName} onChange={handleChange('contactName')} placeholder="John Smith" />
            {errors.contactName && <p className="field-error">{errors.contactName}</p>}
          </div>
          <div className="form-row">
            <label htmlFor="contactEmail">Email Address *</label>
            <input id="contactEmail" type="email" value={form.contactEmail} onChange={handleChange('contactEmail')} placeholder="john.smith@email.com" />
            {errors.contactEmail && <p className="field-error">{errors.contactEmail}</p>}
          </div>
        </div>

        {serverError && <div className="feedback error">{serverError}</div>}

        <div className="form-actions">
          <a href="/" className="button secondary">Cancel</a>
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Request'}
          </button>
        </div>
      </form>
    </main>
  );
}
