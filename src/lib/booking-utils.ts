import { BookingRequest, Invoice, InvoiceItem, BASE_FARE, VEHICLE_RATES } from '@/types/booking';

export const generateBookingId = (): string => {
  return `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const generateInvoiceId = (): string => {
  return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const estimateFare = (
  vehicleType: 'standard' | 'premium' | 'van',
  distanceKm: number = 20 // Default estimate distance
): number => {
  const baseFare = BASE_FARE[vehicleType];
  const distanceFare = distanceKm * VEHICLE_RATES[vehicleType];
  return baseFare + distanceFare;
};

export const createInvoiceFromBooking = (booking: BookingRequest): Invoice => {
  const items: InvoiceItem[] = [
    {
      description: `Transport Service (${booking.vehicleType} vehicle)`,
      quantity: 1,
      unitPrice: booking.estimatedFare,
      total: booking.estimatedFare,
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round(subtotal * 0.15); // 15% tax
  const total = subtotal + tax;

  const issueDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return {
    id: generateInvoiceId(),
    bookingId: booking.id,
    bookingReference: booking.id,
    passengerName: booking.passengerName,
    passengerEmail: booking.passengerEmail,
    issueDate,
    dueDate,
    items,
    subtotal,
    tax,
    total,
    paymentStatus: 'unpaid',
  };
};
