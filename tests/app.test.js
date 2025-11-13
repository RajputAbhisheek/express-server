const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
    it('should respond with a 200 status and a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Welcome to the Express server!');
    });
});

// Additional tests can be added here for other routes and controllers.