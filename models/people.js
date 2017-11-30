'use strict';
module.exports = (sequelize, DataTypes) => {
  var People = sequelize.define('People', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return People;
};