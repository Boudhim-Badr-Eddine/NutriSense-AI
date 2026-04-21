"use client";

import { useSyncExternalStore } from "react";

import { CalendarClock, Package } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/app/CartContext";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/productPricing";

/**
 * WHY: Give users a persistent lifetime purchase timeline with order dates.
 */
export const OrdersHistoryPageClient = () => {
  const hasMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const { orderHistory } = useCart();

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <Container>
          <div className="mb-8 flex flex-col gap-3">
            <Badge className="w-fit">Order History</Badge>
            <h1 className="text-4xl font-bold text-slate-900">
              Your purchase history
            </h1>
            <p className="max-w-3xl text-slate-600">
              This page keeps the history of all your purchases on this device,
              with date and order details.
            </p>
          </div>
          <Card className="border-dashed shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Package className="h-12 w-12 text-slate-300" />
              <p className="text-lg font-semibold text-slate-800">
                Loading your orders...
              </p>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <div className="mb-8 flex flex-col gap-3">
          <Badge className="w-fit">Order History</Badge>
          <h1 className="text-4xl font-bold text-slate-900">
            Your purchase history
          </h1>
          <p className="max-w-3xl text-slate-600">
            This page keeps the history of all your purchases on this device,
            with date and order details.
          </p>
        </div>

        {orderHistory.length === 0 ? (
          <Card className="border-dashed shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Package className="h-12 w-12 text-slate-300" />
              <p className="text-lg font-semibold text-slate-800">
                No orders yet
              </p>
              <p className="max-w-md text-sm text-slate-500">
                Complete your first checkout and your orders will appear here
                with their dates.
              </p>
              <Button asChild>
                <Link href="/supplements">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {orderHistory.map((order) => (
              <Card key={order.orderNumber} className="shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-xl">
                      Order {order.orderNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarClock className="h-4 w-4" />
                      {order.placedAt}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.orderNumber}-${item.type}-${item.id}`}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-100/70 p-3 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">Delivery</p>
                      <p>{order.estimatedDelivery}</p>
                      <p className="mt-1 text-xs">
                        Latest: {order.maxDeliveryDate}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-100/70 p-3 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">Total paid</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
