const userService = require('../services/user.service');

async function getMe(req, res, next) {
  try {
    const userId = req.user?.id;
    const user = await userService.getMe(userId);

    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const userId = req.user?.id;
    const user = await userService.updateMe(userId, req.body || {});

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const userId = req.user?.id;
    await userService.changePassword(
      userId,
      req.body?.currentPassword,
      req.body?.newPassword
    );

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const userId = req.user?.id;
    await userService.deleteAccount(userId);

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
  deleteAccount,
};
