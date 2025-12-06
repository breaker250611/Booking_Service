const { BookingService } = require("../services/booking-service");

const { StatusCodes } = require("http-status-codes");

const bookingService = new BookingService();

const create = async (req, res) => {
  try {
    const response = await bookingService.createBooking(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Successfully created booking",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({
      message: error.message,
      data: {},
      err: error.explanation,
      success: false,
    });
  }
};

module.exports = {
  create,
};
