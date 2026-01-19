import { useState } from 'react';
import { BookingRequest, Invoice } from '@/types/booking';
import { createInvoiceFromBooking } from '@/lib/booking-utils';
import { BookingForm } from '@/components/BookingForm';
import { InvoiceDisplay } from '@/components/InvoiceDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, MapPin, User, FileText } from 'lucide-react';

export const BookingPage = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleBookingSubmit = (booking: BookingRequest) => {
    setBookings([booking, ...bookings]);
    
    // Automatically generate invoice for confirmed bookings
    const invoice = createInvoiceFromBooking(booking);
    setInvoices([invoice, ...invoices]);
    setSelectedBooking(booking);
    setSelectedInvoice(invoice);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF download feature will be implemented soon');
  };

  const handleEmailInvoice = () => {
    alert('Email functionality will be implemented with backend integration');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Booking & Invoicing</h1>
          <p className="text-gray-600">Book your transport and manage invoices</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="booking" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="booking">New Booking</TabsTrigger>
            <TabsTrigger value="history">
              Bookings ({bookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Booking Tab */}
          <TabsContent value="booking" className="space-y-8">
            <BookingForm onBookingSubmit={handleBookingSubmit} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {bookings.length === 0 ? (
              <Alert>
                <AlertDescription>No bookings yet. Create your first booking above!</AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="cursor-pointer hover:shadow-lg transition"
                    onClick={() => {
                      setSelectedBooking(booking);
                      const invoice = invoices.find((inv) => inv.bookingId === booking.id);
                      setSelectedInvoice(invoice || null);
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{booking.passengerName}</h3>
                            <p className="text-sm text-gray-600">{booking.id}</p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.toUpperCase()}
                          </Badge>
                        </div>

                        {/* Trip Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-600">From: {booking.pickupLocation}</p>
                              <p className="text-gray-600">To: {booking.dropoffLocation}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <CalendarDays className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-600">
                                {booking.pickupDate} at {booking.pickupTime}
                              </p>
                              <p className="text-gray-600">{booking.passengers} passenger(s)</p>
                            </div>
                          </div>
                        </div>

                        {/* Fare */}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-gray-600">
                            {booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)}{' '}
                            Vehicle
                          </span>
                          <span className="font-bold text-primary">R{booking.estimatedFare}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Selected Booking & Invoice Details */}
        {selectedBooking && (
          <div className="mt-12 pt-12 border-t space-y-8">
            <h2 className="text-2xl font-bold">Booking Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Trip Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking Reference</p>
                    <p className="font-semibold">{selectedBooking.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Pickup</p>
                      <p className="font-semibold">{selectedBooking.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dropoff</p>
                      <p className="font-semibold">{selectedBooking.dropoffLocation}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{selectedBooking.pickupDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold">{selectedBooking.pickupTime}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-semibold">
                        {selectedBooking.vehicleType.charAt(0).toUpperCase() +
                          selectedBooking.vehicleType.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Passengers</p>
                      <p className="font-semibold">{selectedBooking.passengers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Passenger Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Passenger Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{selectedBooking.passengerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{selectedBooking.passengerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{selectedBooking.passengerPhone}</p>
                  </div>
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="font-semibold">{selectedBooking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Invoice */}
            {selectedInvoice && (
              <div className="pt-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Invoice
                </h2>
                <InvoiceDisplay
                  invoice={selectedInvoice}
                  onDownload={handleDownloadPDF}
                  onEmail={handleEmailInvoice}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
