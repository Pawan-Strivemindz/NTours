const APIFeatures = require('../utils/apiFeatures');
const Tour = require('./../modals/toursModal');

exports.getTopFiveTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';
  next();
};
exports.getAllTours = async (req, res) => {
  try {
    //sending response
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sorting()
      .limiting()
      .pagination();
    const tours = await features.queryObj;
    res
      .status(200)
      .json({ status: 'success', records: tours.length, tours: { tours } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message });
  }
};

//add new tour
exports.addNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (error) {
    res.status(404).json({ status: 'failed', message: 'Invalid Request' });
  }
};

exports.getSingleTour = async (req, res) => {
  try {
    const singleTour = await Tour.findById(req?.params.id).select('-__v');
    res.status(200).json({
      status: 'success',
      tour: { singleTour },
    });
  } catch (error) {
    res.status(404).json({ status: 'failed', message: 'Invalid Request' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send({
      status: 'success',
      message: 'Tour Updated!!',
      tour: { updatedTour },
    });
  } catch (error) {}
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).send({
      status: 'success',
      message: 'Tour Deleted!!',
    });
  } catch (error) {}
};

exports.getTourStats = async (req, res) => {
  try {
    const tourStats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantiy' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({ status: 'success', stats: { tourStats } });
  } catch (error) {
    res.status(404).json({ status: 'failed', message: error.message });
  }
};

exports.getToursPlan = async (req, res) => {
  try {
    const year = req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: { plan } });
  } catch (error) {
    res.status(404).json({ status: 'failed', message: error.message });
  }
};
