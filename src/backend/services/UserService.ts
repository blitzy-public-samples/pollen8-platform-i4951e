import { User } from '../models/User';
import { Industry } from '../models/Industry';
import { Interest } from '../models/Interest';
import { Connection } from '../models/Connection';
import { NetworkValue } from '../models/NetworkValue';
import { Op } from 'sequelize';

export class UserService {
  async getUserProfile(userId: string): Promise<User> {
    try {
      const user = await User.findByPk(userId, {
        include: [
          { model: Industry },
          { model: Interest },
          { model: NetworkValue }
        ]
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Update user properties
      Object.assign(user, updateData);

      await user.save();

      return user;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      throw error;
    }
  }

  async getUserConnections(userId: string): Promise<Connection[]> {
    try {
      const connections = await Connection.findAll({
        where: {
          [Op.or]: [{ userId }, { connectedUserId: userId }]
        },
        include: [
          {
            model: User,
            as: 'connectedUser',
            attributes: ['id', 'username', 'phoneNumber']
          }
        ]
      });

      return connections;
    } catch (error) {
      console.error('Error in getUserConnections:', error);
      throw error;
    }
  }

  async addUserConnection(userId: string, connectedUserId: string): Promise<Connection> {
    try {
      const existingConnection = await Connection.findOne({
        where: {
          [Op.or]: [
            { userId, connectedUserId },
            { userId: connectedUserId, connectedUserId: userId }
          ]
        }
      });

      if (existingConnection) {
        throw new Error('Connection already exists');
      }

      const newConnection = await Connection.create({
        userId,
        connectedUserId,
        connectedAt: new Date()
      });

      return newConnection;
    } catch (error) {
      console.error('Error in addUserConnection:', error);
      throw error;
    }
  }

  async updateNetworkValue(userId: string): Promise<NetworkValue> {
    try {
      const connectionCount = await Connection.count({
        where: {
          [Op.or]: [{ userId }, { connectedUserId: userId }]
        }
      });

      // Simple calculation for network value, can be made more complex
      const calculatedValue = connectionCount * 10;

      const [networkValue, created] = await NetworkValue.findOrCreate({
        where: { userId },
        defaults: {
          value: calculatedValue,
          calculatedAt: new Date()
        }
      });

      if (!created) {
        networkValue.value = calculatedValue;
        networkValue.calculatedAt = new Date();
        await networkValue.save();
      }

      return networkValue;
    } catch (error) {
      console.error('Error in updateNetworkValue:', error);
      throw error;
    }
  }
}