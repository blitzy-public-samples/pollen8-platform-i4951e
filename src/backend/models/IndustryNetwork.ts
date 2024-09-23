import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class IndustryNetwork extends Model {
  public id!: string;
  public industryId!: string;
  public name!: string;
  public createdAt!: Date;

  public static associate(models: any): void {
    IndustryNetwork.belongsTo(models.Industry, { foreignKey: 'industryId' });
    IndustryNetwork.belongsToMany(models.User, { through: 'UserIndustryNetworks' });
    IndustryNetwork.hasMany(models.Post);
  }
}

export const initIndustryNetwork = (): typeof IndustryNetwork => {
  IndustryNetwork.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      industryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Industries',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 100],
          notEmpty: true,
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'IndustryNetwork',
      tableName: 'industry_networks',
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['industryId', 'name'],
        },
      ],
    }
  );

  return IndustryNetwork;
};

export default IndustryNetwork;

// Human tasks:
// 1. Implement data validation for the name field (e.g., uniqueness within an industry, length restrictions)
// 2. Add methods for retrieving network statistics (e.g., member count, post count)
// 3. Ensure proper indexing is set up for industryId and name for efficient querying
// 4. Implement a method for suggesting related industry networks based on user interests
// 5. Add any necessary hooks for pre-save or post-save operations (e.g., updating related Industry data)