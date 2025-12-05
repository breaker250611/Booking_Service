const { Booking } = require("../models/index");
const { StatusCodes } = require("http-status-codes");
const {
  ServiceError,
  ValidationError,
  AppError,
} = require("../utils/errors/index");
class BookingRepository {
  async create(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      throw new AppError(
        "BookingRepositoryError",
        "Cannot create booking",
        "There was some error while creating the booking in the database",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(data) {}
}

module.exports = BookingRepository;
