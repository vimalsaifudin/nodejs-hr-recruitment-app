module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      contactinfo: {
        type: Sequelize.STRING
      }
    });
  
    return Contact;
  };