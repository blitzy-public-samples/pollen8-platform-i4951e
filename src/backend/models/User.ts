import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: string;
  public phoneNumber!: string;
  public username!: string;
  public location!: string;
  public createdAt!: Date;
  public lastLogin!: Date;

  // Define associations with other models
  static associate(models: any) {
    User.hasMany(models.Invite);
    User.hasMany(models.Connection);
    User.hasMany(models.Post);
    User.belongsToMany(models.Industry, { through: 'UserIndustries' });
    User.belongsToMany(models.Interest, { through: 'UserInterests' });
  }
}

const initUser = () => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^\+[1-9]\d{1,14}$/, // E.164 format validation
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 30], // Username length between 3 and 30 characters
          is: /^[a-zA-Z0-9_]+$/, // Alphanumeric and underscore only
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      indexes: [
        { fields: ['phoneNumber'] },
        { fields: ['username'] },
      ],
    }
  );

  return User;
};

export default initUser();

// Human tasks:
// TODO: Implement a method for securely handling user authentication and password hashing if needed
// TODO: Add any necessary hooks for pre-save or post-save operations (e.g., data normalization)