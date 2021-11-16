const db = require("../models");
const User = db.user;
const Role = db.role;
var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
    res.status(200).send("Welcome to Human Resources Recruitment Management System");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("Candidates - Job Listing Page");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

  exports.getuserDetails = (req, res) => {
    //console.log(req)
    User.findOne({
      where: {
        username: req.query.username
      }
    })
      .then(user => {
        var authorities = [];
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }
          res.status(200).send({
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            address: user.address,
            educationlevel: user.educationlevel,
            workexperience: user.workexperience,
            technicalknowledge: user.technicalknowledge,
            cvattachment: user.cvattachment,
            roles: authorities
          });
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };


  exports.getCandidates = async (req, res) => {
    await User.findAll({
      include: [{
          model: Role,
          where: { name: "user" }
      }]
  }).then(data => {
      res.send(data);
    }) 
    .catch(err => {
      res.status(500).send({ message: err.message });
    });;
  };

  exports.getModerators = async (req, res) => {
    await User.findAll({
      include: [{
          model: Role,
          where: { name: "moderator" }
      }]
  }).then(data => {
      res.send(data);
    }) 
    .catch(err => {
      res.status(500).send({ message: err.message });
    });;
  };


  exports.createUser = (req, res) => {
    // Save User to Database
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    })
      .then(user => {
          user.setRoles([req.body.role]).then(() => {
            res.send({ message: "User was created successfully!" });
          });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };

  