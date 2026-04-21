import type { Metadata } from "next";

import { OrdersHistoryPageClient } from "./OrdersHistoryPageClient";

export const metadata: Metadata = {
  title: "Order History",
  description:
    "View your complete NutriSense AI purchase history with order dates.",
};

export default function OrdersHistoryPage() {
  return <OrdersHistoryPageClient />;
}
