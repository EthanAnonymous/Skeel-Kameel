import nodemailer from 'nodemailer';
import { BookingRequest } from '@/types/booking';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.xneelo.co.za',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email service ready');
  }
});

/**
 * Send booking confirmation email to customer and admin
 */
export const sendBookingConfirmationEmail = async (booking: BookingRequest) => {
  try {
    const bookingDate = booking.booking_date 
      ? new Date(booking.booking_date).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })
      : 'Not specified';

    const bookingDetails = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Booking ID:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.booking_id || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.customer_name}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.phone || 'N/A'}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Pickup Location:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.pickup_location || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Dropoff Location:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${booking.dropoff_location || 'N/A'}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Booking Date:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${bookingDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;"><span style="background-color: #fff3cd; padding: 4px 8px; border-radius: 4px;">${booking.status || 'pending'}</span></td>
        </tr>
      </table>
    `;

    // Email to customer
    const customerEmail = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: booking.email,
      subject: `Booking Confirmation - ${booking.booking_id || 'Reference'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .message { margin: 15px 0; line-height: 1.6; }
            .button { display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Overberg Transport Connect</h1>
            </div>
            <div class="content">
              <div class="message">
                <p>Dear ${booking.customer_name},</p>
                <p>Thank you for booking with Overberg Transport Connect. Your booking has been received and is being processed.</p>
              </div>
              
              <h3 style="margin-top: 20px;">Booking Details:</h3>
              ${bookingDetails}
              
              <div class="message">
                <p style="margin-top: 20px;">We will contact you shortly to confirm your booking and provide additional details.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 Overberg Transport Connect. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Email to admin
    const adminEmail = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Booking Received - ${booking.booking_id || 'Reference'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Alert</h1>
            </div>
            <div class="content">
              <h3>A new booking has been received:</h3>
              ${bookingDetails}
              <p style="margin-top: 20px;"><strong>Action Required:</strong> Please review and confirm this booking with the customer.</p>
            </div>
            <div class="footer">
              <p>Booking timestamp: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(customerEmail),
      transporter.sendMail(adminEmail)
    ]);

    console.log(`✓ Confirmation emails sent for booking ${booking.booking_id}`);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
};

/**
 * Send booking status update email to customer
 */
export const sendBookingStatusUpdateEmail = async (booking: BookingRequest, newStatus: string) => {
  try {
    const statusMessages: { [key: string]: string } = {
      confirmed: 'Your booking has been confirmed!',
      completed: 'Your booking has been completed.',
      cancelled: 'Your booking has been cancelled.',
      pending: 'Your booking is pending confirmation.'
    };

    const statusColors: { [key: string]: string } = {
      confirmed: '#28a745',
      completed: '#17a2b8',
      cancelled: '#dc3545',
      pending: '#ffc107'
    };

    const message = statusMessages[newStatus] || 'Your booking status has been updated';
    const color = statusColors[newStatus] || '#007bff';

    const mailContent = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: booking.email,
      subject: `Booking Status Update - ${booking.booking_id || 'Reference'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: ${color}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .status-badge { display: inline-block; padding: 8px 16px; background-color: ${color}; color: white; border-radius: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Status Update</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.customer_name},</p>
              <p style="font-size: 16px; margin: 20px 0;">${message}</p>
              
              <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                <tr style="background-color: #f5f5f5;">
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Booking ID:</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${booking.booking_id || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Current Status:</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;"><span class="status-badge">${newStatus.toUpperCase()}</span></td>
                </tr>
              </table>
              
              <p>If you have any questions or need assistance, please contact us.</p>
              <p>Thank you for using Overberg Transport Connect!</p>
            </div>
            <div class="footer">
              <p>© 2026 Overberg Transport Connect. All rights reserved.</p>
              <p>Updated: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailContent);
    console.log(`✓ Status update email sent for booking ${booking.booking_id}`);
    return true;
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
};

/**
 * Send invoice email
 */
export const sendInvoiceEmail = async (booking: BookingRequest, invoiceAmount: number) => {
  try {
    const mailContent = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: booking.email,
      subject: `Invoice - ${booking.booking_id || 'Reference'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .amount { font-size: 24px; font-weight: bold; color: #28a745; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.customer_name},</p>
              <p>Your invoice for the transport service is ready.</p>
              
              <div class="amount">Amount Due: R ${invoiceAmount.toFixed(2)}</div>
              
              <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                <tr style="background-color: #f5f5f5;">
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Booking ID:</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${booking.booking_id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</td>
                </tr>
              </table>
              
              <p>Please arrange payment as per the agreed terms.</p>
              <p>Thank you for your business!</p>
            </div>
            <div class="footer">
              <p>© 2026 Overberg Transport Connect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailContent);
    console.log(`✓ Invoice email sent for booking ${booking.booking_id}`);
    return true;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
};

/**
 * Send custom email
 */
export const sendCustomEmail = async (to: string, subject: string, htmlContent: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: htmlContent
    });
    console.log(`✓ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
