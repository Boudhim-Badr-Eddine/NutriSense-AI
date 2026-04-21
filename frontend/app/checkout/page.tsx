import type { Metadata } from "next";

import { CheckoutPageClient } from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Secure checkout for NutriSense AI orders with receipt download and delivery details.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
