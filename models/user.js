'use strict';
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_AUTH_SECRET_KEY } = require('./../config');
const { UserInfo } = require('./../skeletons/user');
const { tryCatchHelper, errorsHelper } = require('./../helpers/formatting');
let Event, Visitor, Notification, Message;

const hashPassword = async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
}

function validateName(value) {
  const regExp = /^[a-z0-9 \-.']+$/img;
  if (value.replace(/\s+/g, '').length < 6)
    throw new Error('name must be at least 6 characters long');
  
  if (value.length > 50)
    throw new Error('name must be at most 50 characters long');

  if (regExp.test(value) === false)
    throw new Error('name can contain only alphanumeric symbols');
}

function validateEmail(value) {
  const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (value.length > 50)
    throw new Error('email must be at most 50 characters long');

  if (regExp.test(value) === false)
    throw new Error('email is incorrect');
}

function validatePassword(value) {
  if (value.replace(/\s+/g, '').length < 6)
    throw new Error('password must be at least 6 characters long');
  
  if (value.length > 30)
    throw new Error('password must be at most 30 characters long');
}

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    name: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
      validate: { validateName }
    },
    email: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
      validate: { validateEmail }
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: { validatePassword }
    },
    notified: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },
    token: Sequelize.STRING
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    }
  });

  User.associate = function(models) {
    ({ Event, Visitor, Notification, Message } = models);
    User.hasMany(Event);
    User.hasMany(Visitor);
    User.hasMany(Notification);
    User.hasMany(Message);
  };
  
  User.confirmNotification = async id => {
    await User.update({ notified: true }, { where: { id } });

    return [null, null]
  }

  User.ensureToken = token => {
    let decoded;
  
    try {
      decoded = jwt.verify(token, JWT_AUTH_SECRET_KEY);
    } catch(err) {
      return [errorsHelper.unauthenticated()];
    }
    return [null, decoded]
  }

  User.findByToken = async token => {
    let err, decoded;
  
    [err, decoded] = User.ensureToken(token);
    if (err)
      return [err];
    
    const userObj = await User.findOne({ where: { token } });
    if (userObj === null)
      return [errorsHelper.unauthenticated()];
    const user = { ...userObj.dataValues };

    return [null, new UserInfo(user)];
  }

  User.findByCredentials = async ({ email, password }) => {
    let err, match;
  
    const userObj = await User.findOne({ where: { email } });
    if (userObj === null)
      return [errorsHelper.wrongEmail()]
    const user = { ...userObj.dataValues };
    
    [err, match] = await tryCatchHelper(bcrypt.compare(password, user.password));
    if(!match)
       return [errorsHelper.wrongPass()];
  
    return [null, new UserInfo(user)];
  }

  User.generateAuthToken = async user => {
    const token = jwt.sign({ ...user }, JWT_AUTH_SECRET_KEY);
    
    await User.update({ token }, { where: { id: user.id } });

    return token;
  }

  User.createUser = async payload => {
    let err, userObj;
  
    [err, userObj] = await tryCatchHelper(User.create({ ...payload, notified: true }));
    if (err)
      return [errorsHelper.invalidModel(err)]
    const user = { ...userObj.dataValues };
  
    return [null, new UserInfo(user)]
  }

  User.removeToken = async id => {
    await User.update({ token: null }, { where: { id } });
  
    return null;
  }

  return User;
};