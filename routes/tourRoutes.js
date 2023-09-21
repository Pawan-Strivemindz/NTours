const express = require('express');
const {
  getAllTours,
  addNewTour,
  getSingleTour,
  updateTour,
  deleteTour,
  getTopFiveTours,
  getTourStats,
  getToursPlan,
} = require('./../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
// router.param('id');

//route alias example
router.route('/top-5-tours').get(getTopFiveTours, getAllTours);

//aggregate Example
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getToursPlan);
//other routes
router.route('/').get(protect, getAllTours).post(addNewTour);
router
  .route('/:id')
  .get(getSingleTour)
  .put(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
