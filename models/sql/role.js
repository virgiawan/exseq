'use strict';

/**
 * Created by virgiawan
 * t: @sapi_mabur
 *
 * @class Role
 */

export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
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
    tableName: 'roles',
    paranoid: true,
  });

  Role.associate = (models) => {
    
    Role.hasOne(models.User, {
      foreignKey: 'roleId',
      as: 'user',
    });

    Role.belongsToMany(models.Access, {
      through: {
        name: 'RoleAccess', 
        model: 'roleaccess'
      }, 
      foreignKey: 'roleId'
    });

  };

  return Role;
}