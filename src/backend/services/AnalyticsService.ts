import { User } from '../models/User';
import { Post } from '../models/Post';
import { Connection } from '../models/Connection';
import { IndustryNetwork } from '../models/IndustryNetwork';
import { Invite } from '../models/Invite';
import { sequelize, Op } from 'sequelize';

class AnalyticsService {
  async trackUserActivity(userId: string, activityType: string, activityData: object): Promise<void> {
    try {
      // Validate the user exists
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create a new activity record
      await user.createActivity({
        type: activityType,
        data: activityData,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error tracking user activity:', error);
      throw error;
    }
  }

  async generateUserEngagementReport(userId: string, startDate: Date, endDate: Date): Promise<object> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const postsCreated = await Post.count({
        where: {
          userId,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const newConnections = await Connection.count({
        where: {
          [Op.or]: [{ userId }, { connectedUserId: userId }],
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      // Calculate engagement rate (simplified example)
      const totalPosts = await Post.count({ where: { userId } });
      const totalInteractions = await Post.sum('likes') + await Post.sum('comments');
      const engagementRate = totalPosts > 0 ? (totalInteractions / totalPosts) * 100 : 0;

      return {
        postsCreated,
        newConnections,
        engagementRate: engagementRate.toFixed(2) + '%'
      };
    } catch (error) {
      console.error('Error generating user engagement report:', error);
      throw error;
    }
  }

  async getNetworkGrowthStats(startDate: Date, endDate: Date): Promise<object> {
    try {
      const newUserSignups = await User.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const newConnections = await Connection.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const newIndustryNetworks = await IndustryNetwork.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      return {
        newUserSignups,
        newConnections,
        newIndustryNetworks
      };
    } catch (error) {
      console.error('Error getting network growth stats:', error);
      throw error;
    }
  }

  async getInviteConversionRate(startDate: Date, endDate: Date): Promise<number> {
    try {
      const totalInvites = await Invite.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const newUserSignups = await User.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          },
          inviteId: {
            [Op.ne]: null
          }
        }
      });

      const conversionRate = totalInvites > 0 ? (newUserSignups / totalInvites) * 100 : 0;
      return parseFloat(conversionRate.toFixed(2));
    } catch (error) {
      console.error('Error calculating invite conversion rate:', error);
      throw error;
    }
  }

  async getMostActiveIndustryNetworks(limit: number): Promise<IndustryNetwork[]> {
    try {
      const activeNetworks = await IndustryNetwork.findAll({
        include: [{
          model: Post,
          attributes: []
        }],
        attributes: [
          'id',
          'name',
          [sequelize.fn('COUNT', sequelize.col('Posts.id')), 'postCount']
        ],
        group: ['IndustryNetwork.id'],
        order: [[sequelize.literal('postCount'), 'DESC']],
        limit
      });

      return activeNetworks;
    } catch (error) {
      console.error('Error getting most active industry networks:', error);
      throw error;
    }
  }
}

export default AnalyticsService;