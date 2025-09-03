// services/api.js
const API_BASE = 'http://localhost:5000/api';

export const jobsAPI = {
  // Get all jobs
  getAll: () => fetch(`${API_BASE}/jobs`, {
    credentials: 'include'
  }).then(res => res.json()),

  // Create new job
  create: (jobData) => fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(jobData)
  }).then(res => res.json()),

  // Update job status
  updateStatus: (jobId, status) => fetch(`${API_BASE}/jobs/${jobId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status })
  }).then(res => res.json()),

  // Delete job
  delete: (jobId) => fetch(`${API_BASE}/jobs/${jobId}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then(res => res.json()),

  // Reorder jobs in a column
  reorder: (columnId, items) => fetch(`${API_BASE}/jobs/reorder/${columnId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ items })
  }).then(res => res.json())
};

export const analyticsAPI = {
  // Get analytics data
  getAnalytics: () => fetch(`${API_BASE}/analytics`, {
    credentials: 'include'
  }).then(res => {
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  }),
};

