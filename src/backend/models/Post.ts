import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Post extends Model {
  public id!: string;
  public userId!: string;
  public industryNetworkId!: string;
  public content!: string;
  public createdAt!: Date;

  public static associate(models: any): void {
    Post.belongsTo(models.User, { foreignKey: 'userId' });
    Post.belongsTo(models.IndustryNetwork, { foreignKey: 'industryNetworkId' });
  }
}

const initPost = (): typeof Post => {
  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      industryNetworkId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'posts',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['userId'] },
        { fields: ['industryNetworkId'] },
        { fields: ['createdAt'] },
      ],
    }
  );

  return Post;
};

export { Post, initPost };