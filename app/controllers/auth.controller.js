const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

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
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};





exports.updateProfile = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
    if (user) {
      user.update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        address: req.body.address,
        educationlevel: req.body.educationlevel,
        workexperience: req.body.workexperience,
        technicalknowledge: req.body.technicalknowledge,
        cvattachment: req.body.cvattachment,
      })
      .then(() => {
        res.send({ message: "User updated successfully!" });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
    }
  })
};

exports.resetPassword = (req, res) => {
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
    if (user) {
      user.update({
        password: hash
      })
      .then(() => {
        res.send({ message: "Password has been reset successfully!" });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
    }
  })
};