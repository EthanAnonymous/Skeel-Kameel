import { BookingRequest, Invoice } from '@/types/booking';
import { createInvoiceFromBooking } from './booking-utils';

// API base URL - configure in .env.example
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5510/api';

// Generic API call function
const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// Booking functions
export const saveBooking = async (booking: BookingRequest): Promise<BookingRequest> => {
  try {
    const response = await apiCall('/bookings', 'POST', booking);
    return response;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const fetchAllBookings = async (): Promise<BookingRequest[]> => {
  try {
    const bookings = await apiCall('/bookings', 'GET');
    return bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: string): Promise<void> => {
  try {
    await apiCall(`/bookings/${bookingId}/status`, 'PATCH', { status });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    await apiCall(`/bookings/${bookingId}`, 'DELETE');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Invoice functions
export const saveInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    const response = await apiCall('/invoices', 'POST', invoice);
    return response;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
};

export const createAndSaveInvoice = async (booking: BookingRequest): Promise<Invoice> => {
  try {
    const invoice = createInvoiceFromBooking(booking);
    const savedInvoice = await saveInvoice(invoice);
    return savedInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const fetchAllInvoices = async (): Promise<Invoice[]> => {
  try {
    const invoices = await apiCall('/invoices', 'GET');
    return invoices || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};
  }
};

export const fetchAllInvoices = async (): Promise<Invoice[]> => {
  try {
    const invoices = await callGoogleAppsScript('getInvoices');
    return invoices || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const updateInvoicePaymentStatus = async (invoiceId: string, paymentStatus: string): Promise<void> => {
  try {
    await callGoogleAppsScript('updateInvoicePaymentStatus', {
      invoiceId,
      paymentStatus,
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};
