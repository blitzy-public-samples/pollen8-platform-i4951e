import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class InviteActivity extends Model {
  public id!: string;
  public inviteId!: string;
  public activityDate!: Date;
  public clicks!: number;

  public static associate(models: any): void {
    InviteActivity.belongsTo(models.Invite, { foreignKey: 'inviteId' });
  }
}

const initInviteActivity = (): typeof InviteActivity => {
  InviteActivity.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      inviteId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Invites',
          key: 'id',
        },
      },
      activityDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      clicks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: 'InviteActivity',
      tableName: 'invite_activities',
      timestamps: true,
      indexes: [
        {
          fields: ['inviteId'],
        },
        {
          fields: ['activityDate'],
        },
      ],
    }
  );

  return InviteActivity;
};

export { InviteActivity, initInviteActivity };