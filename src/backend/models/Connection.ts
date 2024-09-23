import { Model, DataTypes, Sequelize, Association } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Connection extends Model {
  public id!: string;
  public userId!: string;
  public connectedUserId!: string;
  public connectedAt!: Date;

  // Associations
  public static associations: {
    user: Association<Connection, User>;
    connectedUser: Association<Connection, User>;
  };

  public static associate(models: any): void {
    Connection.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Connection.belongsTo(models.User, { as: 'connectedUser', foreignKey: 'connectedUserId' });
  }
}

const initConnection = (): typeof Connection => {
  Connection.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      connectedUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      connectedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Connection',
      tableName: 'connections',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'connectedUserId'],
        },
      ],
      hooks: {
        beforeValidate: (connection: Connection) => {
          if (connection.userId === connection.connectedUserId) {
            throw new Error('A user cannot connect with themselves');
          }
        },
      },
    }
  );

  return Connection;
};

export default initConnection();