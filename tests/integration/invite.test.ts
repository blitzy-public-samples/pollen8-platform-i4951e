import request from 'supertest';
import { app } from 'src/backend/app';
import { InviteService } from 'src/backend/services/InviteService';
import { User } from 'src/backend/models/User';
import { Invite } from 'src/backend/models/Invite';
import { sequelize } from 'src/backend/config/database';
import { redisClient } from 'src/backend/config/redis';

describe('Invite System Integration Tests', () => {
  let testUser: User;
  let testInvite: Invite;

  beforeAll(async () => {
    // Set up test database connection
    await sequelize.sync({ force: true });

    // Create test user
    testUser = await User.create({
      phoneNumber: '+1234567890',
      username: 'testuser',
      location: 'Test City'
    });
  });

  afterAll(async () => {
    // Clean up test data and close database connection
    await User.destroy({ where: {} });
    await Invite.destroy({ where: {} });
    await sequelize.close();
    await redisClient.quit();
  });

  it('should create a new invite', async () => {
    const response = await request(app)
      .post('/api/invites')
      .send({ userId: testUser.id, linkName: 'Test Invite' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.linkName).toBe('Test Invite');
    testInvite = response.body;
  });

  it('should retrieve user\'s invites', async () => {
    const response = await request(app)
      .get(`/api/invites?userId=${testUser.id}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].id).toBe(testInvite.id);
  });

  it('should track invite clicks', async () => {
    const response = await request(app)
      .post('/api/invites/track')
      .send({ linkUrl: testInvite.linkUrl })
      .expect(200);

    expect(response.body.clickCount).toBe(1);
  });

  it('should delete an invite', async () => {
    await request(app)
      .delete(`/api/invites/${testInvite.id}`)
      .expect(204);

    const checkResponse = await request(app)
      .get(`/api/invites?userId=${testUser.id}`)
      .expect(200);

    expect(checkResponse.body.length).toBe(0);
  });

  it('should enforce invite limits per user', async () => {
    // Create maximum allowed invites
    const maxInvites = 5; // Assuming 5 is the maximum allowed
    for (let i = 0; i < maxInvites; i++) {
      await request(app)
        .post('/api/invites')
        .send({ userId: testUser.id, linkName: `Invite ${i}` })
        .expect(201);
    }

    // Attempt to create one more invite
    const response = await request(app)
      .post('/api/invites')
      .send({ userId: testUser.id, linkName: 'Excess Invite' })
      .expect(400);

    expect(response.body.message).toContain('Maximum number of invites reached');
  });

  it('should handle invalid invite scenarios', async () => {
    // Test with non-existent user
    await request(app)
      .post('/api/invites')
      .send({ userId: 'non-existent-id', linkName: 'Invalid Invite' })
      .expect(404);

    // Test with invalid link name
    await request(app)
      .post('/api/invites')
      .send({ userId: testUser.id, linkName: '' })
      .expect(400);
  });

  it('should provide invite statistics', async () => {
    const invite = await Invite.findOne({ where: { userId: testUser.id } });
    if (!invite) {
      throw new Error('No invite found for statistics test');
    }

    const response = await request(app)
      .get(`/api/invites/${invite.id}/stats`)
      .expect(200);

    expect(response.body).toHaveProperty('clickCount');
    expect(response.body).toHaveProperty('conversionRate');
  });

  // Additional tests can be added here for more scenarios
});