import type { Metadata } from "next";

import { AdminPageClient } from "./AdminPageClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Manage products, monitor customers, and view client activity in NutriSense AI.",
};

/**
 * WHY: Entry point for admin product management and customer/client monitoring.
 */
export default function AdminPage() {
  return <AdminPageClient />;
}
