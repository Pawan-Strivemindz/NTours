const express = require('express');
const {
  getAllTours,
  addNewTour,
  getSingleTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require('./../controllers/tourController');

const router = express.Router();
router.param('id', checkID);
router.route('/').get(getAllTours).post(checkBody, addNewTour);
router.route('/:id').get(getSingleTour).put(updateTour).delete(deleteTour);

module.exports = router;
