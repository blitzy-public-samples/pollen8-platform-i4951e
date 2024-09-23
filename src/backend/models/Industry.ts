import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';
import sequelize from '../config/database';

class Industry extends Model {
  public id!: string;
  public name!: string;

  public static associate(models: { [key: string]: ModelStatic<Model> }): void {
    Industry.belongsToMany(models.User, { through: 'UserIndustries' });
    Industry.hasMany(models.IndustryNetwork, { foreignKey: 'industryId' });
  }
}

export const initIndustry = (): ModelStatic<Industry> => {
  Industry.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
    },
    {
      sequelize,
      modelName: 'Industry',
      tableName: 'industries',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['name'],
        },
      ],
    }
  );

  Industry.beforeCreate((industry: Industry) => {
    industry.name = industry.name.trim().toLowerCase();
  });

  return Industry;
};

export default Industry;