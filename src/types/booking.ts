export interface BookingRequest {
  id: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  vehicleType: 'standard' | 'premium' | 'van';
  passengers: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedFare: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  bookingReference: string;
  passengerName: string;
  passengerEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'unpaid' | 'paid' | 'overdue';
  paymentMethod?: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const VEHICLE_RATES: Record<string, number> = {
  standard: 15, // Base rate per km
  premium: 22,
  van: 25,
};

export const BASE_FARE: Record<string, number> = {
  standard: 50,
  premium: 75,
  van: 100,
};
