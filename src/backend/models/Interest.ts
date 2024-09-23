import { Model, DataTypes, Sequelize, ModelAttributes } from 'sequelize';
import sequelize from '../config/database';

class Interest extends Model {
  public id!: string;
  public name!: string;

  public static associate(models: any): void {
    Interest.belongsToMany(models.User, { through: 'UserInterests' });
  }
}

const interestAttributes: ModelAttributes = {
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
      len: [2, 50],
      notEmpty: true,
    },
  },
};

const interestOptions = {
  sequelize,
  modelName: 'Interest',
  tableName: 'interests',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['name'],
    },
  ],
};

Interest.init(interestAttributes, interestOptions);

export function initInterest(): typeof Interest {
  return Interest;
}

export default Interest;

// Human tasks:
// 1. Implement data validation for interest name (e.g., uniqueness, length restrictions)
// 2. Add methods for retrieving interests with associated user counts
// 3. Ensure proper indexing is set up for the name field for efficient querying
// 4. Implement a method for suggesting related interests based on user data
// 5. Add any necessary hooks for pre-save or post-save operations (e.g., name normalization)