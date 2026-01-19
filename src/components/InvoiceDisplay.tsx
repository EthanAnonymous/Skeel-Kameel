import { Invoice } from '@/types/booking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';

interface InvoiceProps {
  invoice: Invoice;
  onDownload?: () => void;
  onEmail?: () => void;
}

export const InvoiceDisplay = ({ invoice, onDownload, onEmail }: InvoiceProps) => {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Invoice</CardTitle>
            <CardDescription>Reference: {invoice.bookingReference}</CardDescription>
          </div>
          <Badge className={getPaymentStatusColor(invoice.paymentStatus)}>
            {invoice.paymentStatus.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company & Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">Overberg Transport Connect</h3>
            <p className="text-sm text-gray-600">Professional Transport Services</p>
            <p className="text-sm text-gray-600">Contact: 071 987 1294</p>
          </div>

          <div className="text-right">
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-semibold">Invoice #</span> {invoice.id}
              </div>
              <div>
                <span className="font-semibold">Issue Date:</span> {invoice.issueDate}
              </div>
              <div>
                <span className="font-semibold">Due Date:</span> {invoice.dueDate}
              </div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-2">Bill To</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>{invoice.passengerName}</p>
            <p>{invoice.passengerEmail}</p>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="border-t pt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold">Description</th>
                <th className="text-right py-2 font-semibold">Qty</th>
                <th className="text-right py-2 font-semibold">Unit Price</th>
                <th className="text-right py-2 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-3">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">R{item.unitPrice.toFixed(2)}</td>
                  <td className="text-right font-semibold">R{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t pt-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-end gap-8">
              <span>Subtotal:</span>
              <span className="w-24 text-right">R{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-8">
              <span>Tax (15%):</span>
              <span className="w-24 text-right">R{invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-8 text-lg font-bold border-t pt-3">
              <span>Total:</span>
              <span className="w-24 text-right text-primary">R{invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-2 text-sm">Notes</h4>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Status */}
        <div className="border-t pt-6 bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-700 mb-2">
            {invoice.paymentStatus === 'paid'
              ? '✓ This invoice has been paid. Thank you!'
              : `Payment is due by ${invoice.dueDate}`}
          </p>
          {invoice.paymentStatus === 'unpaid' && (
            <p className="text-sm text-gray-600">
              Please contact us to arrange payment at 071 987 1294
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end border-t pt-6">
          {onEmail && (
            <Button variant="outline" onClick={onEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email Invoice
            </Button>
          )}
          {onDownload && (
            <Button onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
