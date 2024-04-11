import { DataTypes, Model, QueryInterface } from 'sequelize';
import { Team } from '../../types/Team';

export default {
    up(queryInterface: QueryInterface) {
      return queryInterface.createTable<Model<Team>>('teams', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        teamName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'team_name',
        },
      });
    },
    down(queryInterface: QueryInterface) {
      return queryInterface.dropTable('teams');
    }
  };