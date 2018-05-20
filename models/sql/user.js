'use strict';

/**
 * Created by virgiawan
 * t: @sapi_mabur
 *
 * @class User
 */

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    email: {
      type: DataTypes.STRING(125),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
        len: [0, 125]
      }
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    fullname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100]
      }
    }
  }, {
    tableName: 'users',
    paranoid: true,
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: {
        name: 'roleId',
        allowNull: false
      },
      as: 'role',
    });
  };
  
  return User;
};