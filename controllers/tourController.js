const fs = require('fs');
const tourData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', result: tourData?.length, tours: { tourData } });
};

exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > tourData?.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: `invalid id: ${val}` });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res
      .status(400)
      .json({ status: 'fail', message: `Missing name and price` });

  next();
};
exports.addNewTour = (req, res) => {
  const newId = tourData?.length - 1 + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tourData.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tourData),
    (err) => {
      res.status(201).send({ status: 'success', data: { tour: newTour } });
    }
  );
};
exports.getSingleTour = (req, res) => {
  const singleTour = tourData.find(
    (item) => item.id === Number(req?.params?.id)
  );
  res.status(200).json({
    status: 'success',
    tour: { singleTour },
  });
};

exports.updateTour = (req, res) => {
  const foundTour = tourData.findIndex(
    (item) => item.id === Number(req?.params?.id)
  );
  if (foundTour >= 0) {
    let newArr = [...tourData];
    let updatedTour = Object.assign({ id: Number(req?.params?.id) }, req.body);
    newArr[foundTour] = { ...newArr[foundTour], ...updatedTour };
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(newArr),
      (err) => {
        res.status(200).send({
          status: 'success',
          message: 'Tour Updated!!',
          tour: { updatedTour },
        });
      }
    );
  }
};

exports.deleteTour = (req, res) => {
  const filteredTours = tourData?.filter(
    (item) => item.id !== Number(req?.params?.id)
  );
  if (filteredTours?.length > 0) {
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(filteredTours),
      (err) => {
        res.status(200).send({
          status: 'success',
          message: 'Tour Deleted!!',
        });
      }
    );
  }
};
