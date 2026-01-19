import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookingRequest } from '@/types/booking';
import { generateBookingId, estimateFare } from '@/lib/booking-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  onBookingSubmit: (booking: BookingRequest) => void;
}

export const BookingForm = ({ onBookingSubmit }: BookingFormProps) => {
  const [vehicleType, setVehicleType] = useState<'standard' | 'premium' | 'van'>('standard');
  const [estimatedFare, setEstimatedFare] = useState(estimateFare('standard'));
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      passengerName: '',
      passengerEmail: '',
      passengerPhone: '',
      pickupLocation: '',
      dropoffLocation: '',
      pickupDate: '',
      pickupTime: '',
      passengers: '1',
      notes: '',
    },
  });

  const handleVehicleChange = (value: 'standard' | 'premium' | 'van') => {
    setVehicleType(value);
    setEstimatedFare(estimateFare(value));
  };

  const onSubmit = (data: any) => {
    const booking: BookingRequest = {
      id: generateBookingId(),
      passengerName: data.passengerName,
      passengerEmail: data.passengerEmail,
      passengerPhone: data.passengerPhone,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      vehicleType,
      passengers: parseInt(data.passengers),
      notes: data.notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedFare,
    };

    onBookingSubmit(booking);
    setSubmitted(true);
    reset();

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Trip</CardTitle>
        <CardDescription>
          Fill in your details to request a transport booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Booking submitted successfully! We'll confirm your booking shortly.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Passenger Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Passenger Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  {...register('passengerName', { required: 'Name is required' })}
                />
                {errors.passengerName && (
                  <p className="text-sm text-red-600">{errors.passengerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('passengerEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.passengerEmail && (
                  <p className="text-sm text-red-600">{errors.passengerEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="071 987 1294"
                  {...register('passengerPhone', { required: 'Phone number is required' })}
                />
                {errors.passengerPhone && (
                  <p className="text-sm text-red-600">{errors.passengerPhone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengers">Number of Passengers *</Label>
                <Select defaultValue="1" {...register('passengers')}>
                  <SelectTrigger id="passengers">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num} {num === 1 ? 'passenger' : 'passengers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Trip Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location *</Label>
                <Input
                  id="pickup"
                  placeholder="e.g., Overberg Town Center"
                  {...register('pickupLocation', { required: 'Pickup location is required' })}
                />
                {errors.pickupLocation && (
                  <p className="text-sm text-red-600">{errors.pickupLocation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoff">Dropoff Location *</Label>
                <Input
                  id="dropoff"
                  placeholder="e.g., Hermanus Beach"
                  {...register('dropoffLocation', { required: 'Dropoff location is required' })}
                />
                {errors.dropoffLocation && (
                  <p className="text-sm text-red-600">{errors.dropoffLocation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('pickupDate', { required: 'Date is required' })}
                />
                {errors.pickupDate && (
                  <p className="text-sm text-red-600">{errors.pickupDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('pickupTime', { required: 'Time is required' })}
                />
                {errors.pickupTime && (
                  <p className="text-sm text-red-600">{errors.pickupTime.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Vehicle Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'standard', name: 'Standard', desc: 'Comfortable sedan' },
                { id: 'premium', name: 'Premium', desc: 'Luxury vehicle' },
                { id: 'van', name: 'Van', desc: 'Group transport' },
              ].map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => handleVehicleChange(vehicle.id as any)}
                  className={`p-4 rounded-lg border-2 transition ${
                    vehicleType === vehicle.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{vehicle.name}</div>
                  <div className="text-sm text-gray-600">{vehicle.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Fare */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Estimated Fare:</span>
                <span className="text-2xl font-bold text-primary">R{estimatedFare}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Final price may vary based on actual distance and traffic conditions
              </p>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or additional information..."
              {...register('notes')}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            Confirm Booking
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
