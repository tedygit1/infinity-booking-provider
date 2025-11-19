import http from './index.js';

class BookingService {
  // Get booking statistics for a provider
  async getBookingStats(providerId) {
    try {
      const response = await http.get(`/bookings/stats/provider/${providerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }

  // Get all bookings for a provider
  async getProviderBookings(providerId) {
    try {
      const response = await http.get(`/bookings/provider/${providerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider bookings:', error);
      throw error;
    }
  }

  // Accept a booking
  async acceptBooking(bookingId) {
    try {
      const response = await http.put(`/bookings/${bookingId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Error accepting booking:', error);
      throw error;
    }
  }

  // Reject a booking
  async rejectBooking(bookingId, reason = '') {
    try {
      const response = await http.put(`/bookings/${bookingId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting booking:', error);
      throw error;
    }
  }

  // Get booking details
  async getBookingDetails(bookingId) {
    try {
      const response = await http.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }
}

export default new BookingService();