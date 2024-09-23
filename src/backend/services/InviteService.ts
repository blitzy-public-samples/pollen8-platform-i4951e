import { Invite } from '../models/Invite';
import { InviteActivity } from '../models/InviteActivity';
import { User } from '../models/User';
import { Transaction } from 'sequelize';
import { nanoid } from 'nanoid';
import { MAX_INVITE_LINKS } from '../config/constants';

export class InviteService {
  async createInvite(userId: string, linkName: string): Promise<Invite> {
    // Check if the user has reached the maximum number of invite links
    const userInviteCount = await Invite.count({ where: { userId } });
    if (userInviteCount >= MAX_INVITE_LINKS) {
      throw new Error('Maximum number of invite links reached');
    }

    // Generate a unique link URL using nanoid
    const linkUrl = nanoid(10);

    // Create a new Invite record in the database
    const invite = await Invite.create({
      userId,
      linkName,
      linkUrl,
      clickCount: 0,
    });

    return invite;
  }

  async getUserInvites(userId: string): Promise<Invite[]> {
    // Find all invites for the given userId
    const invites = await Invite.findAll({
      where: { userId },
      include: [{ model: InviteActivity, as: 'activities' }],
    });

    return invites;
  }

  async deleteInvite(inviteId: string, userId: string): Promise<boolean> {
    // Find the invite by ID and userId
    const invite = await Invite.findOne({ where: { id: inviteId, userId } });

    if (!invite) {
      return false;
    }

    // Delete the invite and its associated activities
    await Invite.destroy({ where: { id: inviteId, userId } });
    await InviteActivity.destroy({ where: { inviteId } });

    return true;
  }

  async trackInviteClick(linkUrl: string): Promise<void> {
    const transaction = await Invite.sequelize!.transaction();

    try {
      // Find the invite by linkUrl
      const invite = await Invite.findOne({ where: { linkUrl }, transaction });

      if (!invite) {
        throw new Error('Invite not found');
      }

      // Increment the clickCount of the invite
      await invite.increment('clickCount', { transaction });

      // Create or update an InviteActivity record for the current date
      const today = new Date().toISOString().split('T')[0];
      const [activity, created] = await InviteActivity.findOrCreate({
        where: { inviteId: invite.id, activityDate: today },
        defaults: { clicks: 1 },
        transaction,
      });

      if (!created) {
        await activity.increment('clicks', { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getInviteStats(inviteId: string): Promise<object> {
    const invite = await Invite.findByPk(inviteId, {
      include: [{ model: InviteActivity, as: 'activities' }],
    });

    if (!invite) {
      throw new Error('Invite not found');
    }

    const totalClicks = invite.clickCount;
    const dailyStats = invite.activities.map(activity => ({
      date: activity.activityDate,
      clicks: activity.clicks,
    }));

    const avgClicksPerDay = totalClicks / dailyStats.length || 0;

    return {
      totalClicks,
      dailyStats,
      avgClicksPerDay,
    };
  }
}