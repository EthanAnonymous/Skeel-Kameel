import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { BookingRequest, Invoice } from '@/types/booking';
import { createInvoiceFromBooking } from './booking-utils';

// Firebase configuration - Update these with your Firebase project credentials
// Get these from Firebase Console: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your-app-id',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export collections
export const bookingsCollection = collection(db, 'bookings');
export const invoicesCollection = collection(db, 'invoices');

// Firebase functions for bookings
export const saveBooking = async (booking: BookingRequest): Promise<BookingRequest> => {
  try {
    const docRef = await addDoc(bookingsCollection, booking);
    return { ...booking, id: docRef.id };
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const fetchAllBookings = async (): Promise<BookingRequest[]> => {
  try {
    const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const bookings: BookingRequest[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ ...doc.data() as BookingRequest, id: doc.id });
    });
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: string): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Firebase functions for invoices
export const saveInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    const docRef = await addDoc(invoicesCollection, invoice);
    return { ...invoice, id: docRef.id };
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
    const q = query(invoicesCollection, orderBy('issueDate', 'desc'));
    const querySnapshot = await getDocs(q);
    const invoices: Invoice[] = [];
    querySnapshot.forEach((doc) => {
      invoices.push({ ...doc.data() as Invoice, id: doc.id });
    });
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const updateInvoicePaymentStatus = async (invoiceId: string, paymentStatus: string): Promise<void> => {
  try {
    const invoiceRef = doc(db, 'invoices', invoiceId);
    await updateDoc(invoiceRef, {
      paymentStatus,
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};
