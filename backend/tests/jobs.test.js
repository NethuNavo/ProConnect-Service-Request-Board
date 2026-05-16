const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const JobRequest = require('../models/JobRequest');
const User = require('../models/User');

let authToken;

beforeAll(async () => {
  jest.spyOn(User, 'findOne').mockResolvedValue({
    _id: '6455e38a1b1b3c001134d2ef',
    email: 'admin@proconnect.test',
    name: 'ProConnect Admin',
    role: 'admin',
    passwordHash: 'fakehash',
  });
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

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

  it('creates a job without auth', async () => {
    const createdJob = {
      _id: '6455e38a1b1b3c001134d2ef',
      title: 'Test',
      description: 'Desc',
      category: 'Plumbing',
      location: 'Glasgow',
      contactName: 'John',
      contactEmail: 'john@test.com',
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    jest.spyOn(JobRequest, 'create').mockResolvedValue(createdJob);

    const res = await request(app)
      .post('/api/jobs')
      .send({ title: 'Test', description: 'Desc', category: 'Plumbing', location: 'Glasgow', contactName: 'John', contactEmail: 'john@test.com' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test');
    expect(res.body.status).toBe('Open');
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
