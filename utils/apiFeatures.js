class APIFeatures {
  constructor(queryObj, queryStr) {
    this.queryObj = queryObj;
    this.queryStr = queryStr;
  }

  filter() {
    // Basic Filtering
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);

    this.queryObj = this.queryObj.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    //sorting
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.queryObj = this.queryObj.sort(sortBy);
    } else {
      this.queryObj = this.queryObj.sort('-createdAt');
    }
    return this;
  }

  limiting() {
    //sending limited data
    if (this.queryStr.fields) {
      const fieldsBy = this.queryStr.fields.split(',').join(' ');
      this.queryObj = this.queryObj.select(fieldsBy);
    } else {
      this.queryObj = this.queryObj.select('-__v');
    }

    return this;
  }

  pagination() {
    //pagination
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.queryObj = this.queryObj.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
