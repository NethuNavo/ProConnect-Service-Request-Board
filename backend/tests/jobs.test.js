const request = require('supertest');
const app = require('../app');
const JobRequest = require('../models/JobRequest');

let authToken;

beforeAll(async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@proconnect.test', password: 'Password123' });

  authToken = loginRes.body.token;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Jobs API', () => {
  it('returns an empty list when there are no jobs', async () => {
    jest.spyOn(JobRequest, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('requires auth for creating a job', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ title: 'Test', description: 'Desc', category: 'Plumbing', location: 'Glasgow', contactName: 'John', contactEmail: 'john@test.com' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Authorization token required/);
  });

  it('creates a job with a valid JWT', async () => {
    const createdJob = {
      _id: '6455e38a1b1b3c001134d2ef',
      title: 'Fix tap',
      description: 'Leaking tap in kitchen',
      category: 'Plumbing',
      location: 'Glasgow',
      contactName: 'Jamie',
      contactEmail: 'jamie@test.com',
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    jest.spyOn(JobRequest, 'create').mockResolvedValue(createdJob);

    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Fix tap',
        description: 'Leaking tap in kitchen',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'Jamie',
        contactEmail: 'jamie@test.com',
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Fix tap');
    expect(res.body.status).toBe('Open');
  });

  it('deletes a job with a valid JWT', async () => {
    const mockRemove = jest.fn().mockResolvedValue();
    const jobDoc = {
      _id: '6455e38a1b1b3c001134d2ef',
      remove: mockRemove,
    };

    jest.spyOn(JobRequest, 'findById').mockResolvedValue(jobDoc);

    const res = await request(app)
      .delete(`/api/jobs/${jobDoc._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Job request deleted');
    expect(mockRemove).toHaveBeenCalled();
  });
});
