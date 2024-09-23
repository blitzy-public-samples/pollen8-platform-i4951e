import { User } from '../models/User';
import { Industry } from '../models/Industry';
import { IndustryNetwork } from '../models/IndustryNetwork';
import { Connection } from '../models/Connection';
import { NetworkValue } from '../models/NetworkValue';
import { Post } from '../models/Post';
import { Op } from 'sequelize';

class NetworkService {
  async createIndustryNetwork(industryId: string, name: string): Promise<IndustryNetwork> {
    // Verify that the industry exists
    const industry = await Industry.findByPk(industryId);
    if (!industry) {
      throw new Error('Industry not found');
    }

    // Create a new IndustryNetwork record in the database
    const industryNetwork = await IndustryNetwork.create({
      industryId,
      name,
    });

    // Associate the network with the industry
    await industry.addIndustryNetwork(industryNetwork);

    return industryNetwork;
  }

  async getIndustryNetworks(): Promise<IndustryNetwork[]> {
    // Fetch all IndustryNetwork records from the database
    const industryNetworks = await IndustryNetwork.findAll({
      include: [{ model: Industry }],
    });

    return industryNetworks;
  }

  async joinIndustryNetwork(userId: string, networkId: string): Promise<boolean> {
    // Find the user and industry network by their IDs
    const user = await User.findByPk(userId);
    const industryNetwork = await IndustryNetwork.findByPk(networkId);

    if (!user || !industryNetwork) {
      return false;
    }

    // Add the user to the industry network's members
    await industryNetwork.addUser(user);

    return true;
  }

  async calculateNetworkValue(userId: string): Promise<NetworkValue> {
    // Retrieve the user's connections, posts, and other relevant data
    const user = await User.findByPk(userId, {
      include: [
        { model: Connection },
        { model: Post },
        { model: IndustryNetwork },
      ],
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate the network value based on number of connections, activity, and other factors
    const connectionCount = user.Connections.length;
    const postCount = user.Posts.length;
    const industryNetworkCount = user.IndustryNetworks.length;

    // This is a simple calculation and should be adjusted based on specific requirements
    const value = connectionCount * 10 + postCount * 5 + industryNetworkCount * 20;

    // Update or create a NetworkValue record for the user
    const [networkValue] = await NetworkValue.findOrCreate({
      where: { userId },
      defaults: { value },
    });

    networkValue.value = value;
    await networkValue.save();

    return networkValue;
  }

  async getNetworkFeed(userId: string, options: { limit?: number; offset?: number } = {}): Promise<Post[]> {
    // Retrieve the user's connections and industry networks
    const user = await User.findByPk(userId, {
      include: [
        { model: Connection },
        { model: IndustryNetwork },
      ],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const connectedUserIds = user.Connections.map(connection => connection.connectedUserId);
    const industryNetworkIds = user.IndustryNetworks.map(network => network.id);

    // Fetch posts from connected users and joined industry networks
    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { userId: { [Op.in]: connectedUserIds } },
          { industryNetworkId: { [Op.in]: industryNetworkIds } },
        ],
      },
      order: [['createdAt', 'DESC']],
      limit: options.limit,
      offset: options.offset,
      include: [{ model: User }, { model: IndustryNetwork }],
    });

    return posts;
  }
}

export default NetworkService;