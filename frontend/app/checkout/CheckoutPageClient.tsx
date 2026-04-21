"use client";

import {
  CheckCircle2,
  CreditCard,
  Download,
  MapPin,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CompletedOrder, useCart } from "@/app/CartContext";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/productPricing";

interface CheckoutFormState {
  customerName: string;
  city: string;
  deliveryAddress: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const initialFormState: CheckoutFormState = {
  customerName: "",
  city: "",
  deliveryAddress: "",
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
};

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiryDate = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const formatReceiptDate = (value: string): string => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const CheckoutPageClient = () => {
  const { items, subtotal, completeOrder, lastOrder } = useCart();
  const [formState, setFormState] =
    useState<CheckoutFormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(
    null,
  );

  const shippingFee = useMemo(() => {
    if (subtotal === 0) {
      return 0;
    }

    return subtotal >= 1200 ? 0 : 35;
  }, [subtotal]);

  const total = subtotal + shippingFee;
  const displayedOrder =
    completedOrder ?? (items.length === 0 ? lastOrder : null);

  const handleFieldChange = (field: keyof CheckoutFormState, value: string) => {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
    setError(null);
  };

  const handleDownloadReceipt = async (order: CompletedOrder) => {
    if (typeof window === "undefined") {
      return;
    }

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const leftPadding = 48;
    const rightPadding = 48;
    const contentWidth = pageWidth - leftPadding - rightPadding;
    const rightColX = pageWidth - rightPadding;

    let y = 64;

    doc.setFillColor(11, 30, 67);
    doc.rect(0, 0, pageWidth, 122, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("NutriSense AI", leftPadding, y);

    y += 24;
    doc.setFontSize(13);
    doc.text("Official Order Receipt", leftPadding, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Order: ${order.orderNumber}`, rightColX, 56, { align: "right" });
    doc.text(`Placed: ${formatReceiptDate(order.placedAt)}`, rightColX, 74, {
      align: "right",
    });
    doc.text(`Card ending: **** ${order.cardLast4}`, rightColX, 92, {
      align: "right",
    });

    y = 154;
    doc.setTextColor(20, 23, 33);
    doc.setDrawColor(220, 225, 235);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(leftPadding, y, contentWidth, 86, 8, 8, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Customer & Delivery", leftPadding + 16, y + 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${order.customerName}`, leftPadding + 16, y + 44);
    doc.text(`City: ${order.city}`, leftPadding + 16, y + 60);

    const addressLines = doc.splitTextToSize(
      `Address: ${order.deliveryAddress}`,
      contentWidth - 220,
    ) as string[];
    addressLines.forEach((line, index) => {
      doc.text(line, leftPadding + 210, y + 44 + index * 14);
    });

    y += 108;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Items", leftPadding, y);

    y += 14;
    doc.setDrawColor(206, 214, 226);
    doc.line(leftPadding, y, pageWidth - rightPadding, y);

    y += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Product", leftPadding, y);
    doc.text("Qty", pageWidth - rightPadding - 190, y);
    doc.text("Unit", pageWidth - rightPadding - 120, y);
    doc.text("Amount", rightColX, y, { align: "right" });

    y += 10;
    doc.setDrawColor(232, 236, 242);
    doc.line(leftPadding, y, pageWidth - rightPadding, y);

    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);

    order.items.forEach((item) => {
      const productNameLines = doc.splitTextToSize(
        item.name,
        contentWidth - 250,
      ) as string[];
      const rowHeight = Math.max(18, productNameLines.length * 13 + 5);

      if (y + rowHeight > pageHeight - 170) {
        doc.addPage();
        y = 72;
      }

      productNameLines.forEach((line, index) => {
        doc.text(line, leftPadding, y + index * 13);
      });

      doc.text(String(item.quantity), pageWidth - rightPadding - 190, y);
      doc.text(formatPrice(item.price), pageWidth - rightPadding - 120, y);
      doc.text(formatPrice(item.price * item.quantity), rightColX, y, {
        align: "right",
      });

      y += rowHeight;
      doc.setDrawColor(240, 242, 246);
      doc.line(leftPadding, y - 8, pageWidth - rightPadding, y - 8);
    });

    y += 10;
    const totalsBoxX = pageWidth - rightPadding - 240;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(totalsBoxX, y, 240, 86, 8, 8, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Subtotal", totalsBoxX + 14, y + 24);
    doc.text(formatPrice(order.subtotal), totalsBoxX + 226, y + 24, {
      align: "right",
    });
    doc.text("Shipping", totalsBoxX + 14, y + 42);
    doc.text(formatPrice(order.shippingFee), totalsBoxX + 226, y + 42, {
      align: "right",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total Paid", totalsBoxX + 14, y + 66);
    doc.text(formatPrice(order.total), totalsBoxX + 226, y + 66, {
      align: "right",
    });

    y += 108;
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(leftPadding, y, contentWidth, 62, 8, 8, "FD");
    doc.setTextColor(6, 95, 70);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Delivery window", leftPadding + 14, y + 22);
    doc.setFont("helvetica", "normal");
    doc.text(`Expected: ${order.estimatedDelivery}`, leftPadding + 14, y + 40);
    doc.text(`Latest: ${order.maxDeliveryDate}`, leftPadding + 14, y + 55);

    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "Thank you for shopping with NutriSense AI.",
      leftPadding,
      pageHeight - 24,
    );

    doc.save(`${order.orderNumber.toLowerCase()}-receipt.pdf`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    const cardDigits = formState.cardNumber.replace(/\D/g, "");

    if (
      !formState.customerName ||
      !formState.city ||
      !formState.deliveryAddress ||
      !formState.cardholderName ||
      cardDigits.length !== 16 ||
      formState.expiryDate.length !== 5 ||
      formState.cvv.length < 3
    ) {
      setError("Please complete all payment and delivery fields correctly.");
      return;
    }

    setIsSubmitting(true);

    const placedAt = new Date();
    const estimatedDelivery = new Date(placedAt);
    estimatedDelivery.setDate(placedAt.getDate() + 2);

    const maxDeliveryDate = new Date(placedAt);
    maxDeliveryDate.setDate(placedAt.getDate() + 4);

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const order: CompletedOrder = {
      orderNumber: `NS-${Date.now().toString().slice(-8)}`,
      items: items.map((item) => ({ ...item })),
      subtotal,
      shippingFee,
      total,
      customerName: formState.customerName,
      deliveryAddress: formState.deliveryAddress,
      city: formState.city,
      cardLast4: cardDigits.slice(-4),
      placedAt: placedAt.toLocaleString(),
      estimatedDelivery: `${dateFormatter.format(estimatedDelivery)} before 6:00 PM`,
      maxDeliveryDate: dateFormatter.format(maxDeliveryDate),
    };

    completeOrder(order);
    setCompletedOrder(order);
    setFormState(initialFormState);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <div className="mb-8 flex flex-col gap-3">
          <Badge className="w-fit">Secure Checkout</Badge>
          <h1 className="text-4xl font-bold text-slate-900">
            Complete your order
          </h1>
          <p className="max-w-3xl text-slate-600">
            Review your selected products, enter your card details, and confirm
            delivery to your home. After payment, you can download your receipt
            instantly.
          </p>
        </div>

        {items.length === 0 && displayedOrder ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-emerald-200 bg-emerald-50/40 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  <div>
                    <CardTitle>Payment confirmed</CardTitle>
                    <p className="text-sm text-slate-600">
                      Your order has been placed successfully.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/70 bg-white p-4">
                    <p className="text-sm text-slate-500">Order number</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {displayedOrder.orderNumber}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/70 bg-white p-4">
                    <p className="text-sm text-slate-500">Total paid</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-700">
                      {formatPrice(displayedOrder.total)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/70 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-900">
                      <Truck className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Expected delivery</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {displayedOrder.estimatedDelivery}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Latest arrival by {displayedOrder.maxDeliveryDate}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/70 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-900">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Delivery address</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {displayedOrder.deliveryAddress}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {displayedOrder.city}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleDownloadReceipt(displayedOrder)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/supplements">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayedOrder.items.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment by bank card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full name</Label>
                      <Input
                        id="customerName"
                        value={formState.customerName}
                        onChange={(event) =>
                          handleFieldChange("customerName", event.target.value)
                        }
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formState.city}
                        onChange={(event) =>
                          handleFieldChange("city", event.target.value)
                        }
                        placeholder="Casablanca"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Home address</Label>
                    <Textarea
                      id="deliveryAddress"
                      value={formState.deliveryAddress}
                      onChange={(event) =>
                        handleFieldChange("deliveryAddress", event.target.value)
                      }
                      placeholder="Street, apartment, building, district"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder name</Label>
                    <Input
                      id="cardholderName"
                      value={formState.cardholderName}
                      onChange={(event) =>
                        handleFieldChange("cardholderName", event.target.value)
                      }
                      placeholder="Name on card"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input
                      id="cardNumber"
                      inputMode="numeric"
                      value={formState.cardNumber}
                      onChange={(event) =>
                        handleFieldChange(
                          "cardNumber",
                          formatCardNumber(event.target.value),
                        )
                      }
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry date</Label>
                      <Input
                        id="expiryDate"
                        inputMode="numeric"
                        value={formState.expiryDate}
                        onChange={(event) =>
                          handleFieldChange(
                            "expiryDate",
                            formatExpiryDate(event.target.value),
                          )
                        }
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        inputMode="numeric"
                        value={formState.cvv}
                        onChange={(event) =>
                          handleFieldChange(
                            "cvv",
                            event.target.value.replace(/\D/g, "").slice(0, 4),
                          )
                        }
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                  >
                    {isSubmitting
                      ? "Processing payment..."
                      : `Pay ${formatPrice(total)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                      No items in your shopping bag yet.
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            Qty {item.quantity} · {item.category}
                          </p>
                        </div>
                        <span className="font-semibold text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))
                  )}

                  <div className="space-y-3 border-t pt-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Products</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Shipping</span>
                      <span>
                        {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold text-slate-900">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Home delivery window
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <p>
                    Your order is prepared within 24 hours after payment
                    confirmation.
                  </p>
                  <p>Expected home delivery: 2 business days.</p>
                  <p>Maximum delivery time: 4 business days.</p>
                  <p>Delivery hours: 9:00 AM to 6:00 PM.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
