require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const { User } = require('../models/models');

const generateJwt = (id, email, role) => jwt.sign({ id, email, role }, process.env.SECRET_KEY);

class AuthController {
  async registration(req, res, next) {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return next(ApiError.badRequest('Incorrect user data'));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('User with this email already exists'));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    const token = generateJwt(user.id, user.email, user.role);
    return res.status(201).json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('User with this email was not found'));
    }
    if (user.status === 'blocked') {
      return next(ApiError.internal('User is blocked and cannot log in'));
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Invalid password'));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.status(200).json({ token });
  }

  async check(req, res, next) {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return next(ApiError.internal('User is deleted and cannot log in'));
    }
    if (user.status === 'blocked') {
      return next(ApiError.internal('User is blocked and cannot log in'));
    }
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.status(200).json({ token });
  }
}

module.exports = new AuthController();
