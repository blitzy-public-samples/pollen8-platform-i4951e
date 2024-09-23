import { Model, DataTypes, Sequelize, ModelAttributes } from 'sequelize';
import sequelize from '../config/database';

class Invite extends Model {
  public id!: string;
  public userId!: string;
  public linkName!: string;
  public linkUrl!: string;
  public clickCount!: number;
  public readonly createdAt!: Date;

  // Define associations with other models
  static associate(models: any) {
    Invite.belongsTo(models.User, { foreignKey: 'userId' });
    Invite.hasMany(models.InviteActivity, { foreignKey: 'inviteId' });
  }

  // Method to increment clickCount
  async incrementClickCount() {
    this.clickCount += 1;
    await this.save();
  }
}

const initInvite = (): typeof Invite => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    linkName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50], // Validate linkName length
      },
    },
    linkUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUrl: true, // Validate linkUrl format
      },
    },
    clickCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  };

  const options = {
    sequelize,
    modelName: 'Invite',
    tableName: 'invites',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['linkUrl'] },
    ],
  };

  Invite.init(attributes, options);

  // Hook to generate linkUrl before saving
  Invite.beforeCreate(async (invite: Invite) => {
    invite.linkUrl = await generateUniqueInviteLink(invite.userId);
  });

  return Invite;
};

// Helper function to generate unique invite link
async function generateUniqueInviteLink(userId: string): Promise<string> {
  // Implement logic to generate a unique invite link
  // This is a placeholder implementation
  const baseUrl = 'https://pollen8.com/invite/';
  const uniqueId = Math.random().toString(36).substring(2, 15);
  return `${baseUrl}${userId}-${uniqueId}`;
}

export default initInvite();