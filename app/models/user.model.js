module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      educationlevel: {
        type: Sequelize.STRING
      },
      workexperience: {
        type: Sequelize.STRING
      },
      technicalknowledge: {
        type: Sequelize.STRING
      },
      cvattachment: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };