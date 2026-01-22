// Google Apps Script for Overberg Transport Connect
// This script handles all API calls for booking and invoice management
// Deploy as a Web App and set "Who has access" to "Anyone"

const BOOKINGS_SHEET = "Bookings";
const INVOICES_SHEET = "Invoices";

// Handle CORS preflight requests
function doOptions(e) {
  return HtmlService.createHtmlOutput()
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.data;

    let result;

    switch (action) {
      case 'saveBooking':
        result = saveBooking(payload);
        break;
      case 'getBookings':
        result = getBookings();
        break;
      case 'updateBookingStatus':
        result = updateBookingStatus(payload.bookingId, payload.status);
        break;
      case 'cancelBooking':
        result = cancelBooking(payload.bookingId);
        break;
      case 'saveInvoice':
        result = saveInvoice(payload);
        break;
      case 'getInvoices':
        result = getInvoices();
        break;
      case 'updateInvoicePaymentStatus':
        result = updateInvoicePaymentStatus(payload.invoiceId, payload.paymentStatus);
        break;
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Unknown action'
        }))
          .setMimeType(ContentService.MimeType.JSON)
          .setHeader('Access-Control-Allow-Origin', '*')
          .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          .setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function saveBooking(booking) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BOOKINGS_SHEET);
  const row = [
    booking.id,
    booking.passengerName,
    booking.passengerPhone,
    booking.passengerEmail,
    booking.pickupLocation,
    booking.dropoffLocation,
    booking.pickupDate,
    booking.pickupTime,
    booking.vehicleType,
    booking.distanceKm,
    booking.estimatedFare,
    booking.status || 'pending',
    new Date().toISOString()
  ];
  sheet.appendRow(row);
  return booking;
}

function getBookings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BOOKINGS_SHEET);
  const data = sheet.getDataRange().getValues();
  const bookings = [];

  for (let i = 1; i < data.length; i++) {
    bookings.push({
      id: data[i][0],
      passengerName: data[i][1],
      passengerPhone: data[i][2],
      passengerEmail: data[i][3],
      pickupLocation: data[i][4],
      dropoffLocation: data[i][5],
      pickupDate: data[i][6],
      pickupTime: data[i][7],
      vehicleType: data[i][8],
      distanceKm: data[i][9],
      estimatedFare: data[i][10],
      status: data[i][11],
      createdAt: data[i][12]
    });
  }

  return bookings;
}

function updateBookingStatus(bookingId, status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BOOKINGS_SHEET);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === bookingId) {
      sheet.getRange(i + 1, 12).setValue(status);
      return { success: true };
    }
  }

  throw new Error('Booking not found');
}

function cancelBooking(bookingId) {
  return updateBookingStatus(bookingId, 'cancelled');
}

function saveInvoice(invoice) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INVOICES_SHEET);
  const row = [
    invoice.id,
    invoice.bookingId,
    invoice.invoiceNumber,
    invoice.passengerName,
    invoice.passengerEmail,
    JSON.stringify(invoice.items),
    invoice.subtotal,
    invoice.tax,
    invoice.total,
    invoice.paymentStatus || 'unpaid',
    new Date().toISOString()
  ];
  sheet.appendRow(row);
  return invoice;
}

function getInvoices() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INVOICES_SHEET);
  const data = sheet.getDataRange().getValues();
  const invoices = [];

  for (let i = 1; i < data.length; i++) {
    invoices.push({
      id: data[i][0],
      bookingId: data[i][1],
      invoiceNumber: data[i][2],
      passengerName: data[i][3],
      passengerEmail: data[i][4],
      items: JSON.parse(data[i][5]),
      subtotal: data[i][6],
      tax: data[i][7],
      total: data[i][8],
      paymentStatus: data[i][9],
      createdAt: data[i][10]
    });
  }

  return invoices;
}

function updateInvoicePaymentStatus(invoiceId, paymentStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INVOICES_SHEET);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === invoiceId) {
      sheet.getRange(i + 1, 10).setValue(paymentStatus);
      return { success: true };
    }
  }

  throw new Error('Invoice not found');
}
