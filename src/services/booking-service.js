const axios = require("axios");

const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH } = require("../config/server-config");
const { ServiceError, ValidationError } = require("../utils/errors");
class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightId = data.flightId;
      const flightServiceUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const response = await axios.get(flightServiceUrl);
      const flightData = response.data.data;
      let priceOftheFlight = flightData.price;

      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError(
          "Requested number of seats not available",
          "Seats unavailable"
        );
      }
      const totalCost = priceOftheFlight * data.noOfSeats;
      const bookingPayload = { ...data, totalCost: totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);
      const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      await axios.patch(updateFlightRequestUrl, {
        totalSeats: flightData.totalSeats - data.noOfSeats,
      });
      const final_booking = await this.bookingRepository.update(booking.id, {
        status: "BOOKED",
      });
      return final_booking;
      //   return response.data;
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "BookingRepositoryError"
      ) {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
