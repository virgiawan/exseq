'use strict';

/**
 * Created by virgiawan
 * t: @sapi_mabur
 *
 * @class Access
 */

export default (sequelize, DataTypes) => {
  const Access = sequelize.define('Access', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [0, 50]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'accesses',
    paranoid: true,
  });

  Access.associate = (models) => {
    Access.belongsToMany(models.Role, {
      through: {
        name: 'RoleAccess', 
        model: 'roleaccess'
      }, 
      foreignKey: 'accessId'
    });
  };

  return Access;
}