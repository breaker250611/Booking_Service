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

  async update(bookingId, data) {
    // try {
    //   const booking = await Booking.update(data, {
    //     where: {
    //       id: bookingId,
    //     },
    //   });
    try {
      const booking = await Booking.findByPk(bookingId);
      if (data.status) {
        booking.status = data.status;
        await booking.save();
      }
      return booking;
    } catch (error) {
      throw new AppError(
        "BookingRepositoryError",
        "Cannot update booking",
        "There was some error while updating the booking in the database",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = BookingRepository;
