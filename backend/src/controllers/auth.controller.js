const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { token, user } = await authService.registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { token, user } = await authService.loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const userId = req.user?.id;
    const user = await authService.getUserById(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  me,
};
