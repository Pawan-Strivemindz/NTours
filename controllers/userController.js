const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../modals/userModal');

//filterObj logic
const filter = (obj, ...allowdFields) => {
  let newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowdFields.includes(el)) newObject[el] = obj[el];
  });

  return newObject;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {}
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError('This route is not for updating the passowrd', 400)
    );

  const filteredObj = filter(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    rtunValidators: true,
  });

  res.status(200).json({ status: 'success', data: { updatedUser } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(200).json({ status: 'success' });
};

exports.getSingleUser = async (req, res, next) => {
  res.status(200).json({ status: 'success' });
};

exports.updateUser = (req, res) => {
  res.status(200).json({ status: 'success' });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({ status: 'success' });
};
