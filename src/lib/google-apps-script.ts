import { BookingRequest, Invoice } from '@/types/booking';
import { createInvoiceFromBooking } from './booking-utils';

// Google Apps Script deployment URL
// Get this after deploying your Google Apps Script as a web app
const GAS_DEPLOYMENT_URL = import.meta.env.VITE_GAS_DEPLOYMENT_URL || 'YOUR_DEPLOYMENT_URL_HERE';

// Helper function to call Google Apps Script
const callGoogleAppsScript = async (action: string, data?: any) => {
  try {
    const response = await fetch(GAS_DEPLOYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Google Apps Script request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Google Apps Script error:', error);
    throw error;
  }
};

// Booking functions
export const saveBooking = async (booking: BookingRequest): Promise<BookingRequest> => {
  try {
    const response = await callGoogleAppsScript('saveBooking', booking);
    return response;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const fetchAllBookings = async (): Promise<BookingRequest[]> => {
  try {
    const bookings = await callGoogleAppsScript('getBookings');
    return bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: string): Promise<void> => {
  try {
    await callGoogleAppsScript('updateBookingStatus', {
      bookingId,
      status,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    await callGoogleAppsScript('cancelBooking', {
      bookingId,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Invoice functions
export const saveInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    const response = await callGoogleAppsScript('saveInvoice', invoice);
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
