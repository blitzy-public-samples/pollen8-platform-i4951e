import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class NetworkValue extends Model {
  public id!: string;
  public userId!: string;
  public value!: number;
  public calculatedAt!: Date;

  static associate(models: any) {
    NetworkValue.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

const initNetworkValue = (): typeof NetworkValue => {
  NetworkValue.init(
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
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      calculatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'NetworkValue',
      tableName: 'network_values',
      indexes: [
        {
          fields: ['userId'],
        },
        {
          fields: ['calculatedAt'],
        },
      ],
    }
  );

  return NetworkValue;
};

export { NetworkValue, initNetworkValue };