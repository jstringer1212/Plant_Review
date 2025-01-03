const request = require('supertest');
const express = require('express');
const router = require('../routes/plant'); // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use('/api/plants', router);

describe('Plant Search API', () => {
  it('should return plants matching the search criteria', async () => {
    const response = await request(app)
      .get('/api/plants/search')
      .query({ cName: 'Rose' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('cName', 'Rose');
  });

  it('should return an empty array if no plants match the search criteria', async () => {
    const response = await request(app)
      .get('/api/plants/search')
      .query({ cName: 'NonExistentPlant' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });

  it('should handle errors gracefully', async () => {
    const response = await request(app)
      .get('/api/plants/search')
      .query({ invalidField: 'value' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid query parameters');
  });
});