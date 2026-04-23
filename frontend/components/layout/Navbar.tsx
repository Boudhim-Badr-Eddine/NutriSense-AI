"use client";

import { Menu, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { useAuth } from "@/app/AuthContext";
import { useCart } from "@/app/CartContext";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/productPricing";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Supplements", href: "/supplements" },
  { label: "Complements", href: "/complements" },
  { label: "Materials", href: "/materials" },
  { label: "Nutrition Guide", href: "/nutrition" },
  {
    label: "Symptom Checker",
    href: "/symptom-checker",
    badge: "AI",
    badgeClassName:
      "text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full ml-1",
  },
  {
    label: "Stack Builder",
    href: "/stack-builder",
    badge: "AI",
    badgeClassName:
      "text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-full ml-1",
  },
  {
    label: "Meal Analyzer",
    href: "/meal-analyzer",
    badge: "Vision",
    badgeClassName:
      "text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full ml-1",
  },
  { label: "Orders", href: "/orders" },
  { label: "Admin", href: "/admin" },
];

/**
 * WHY: Provide a consistent navigation bar with auth state handling and scroll-aware styling.
 */
export const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const hasHydratedCart = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const safeItems = hasHydratedCart ? items : [];
  const safeItemCount = hasHydratedCart ? itemCount : 0;
  const safeSubtotal = hasHydratedCart ? subtotal : 0;
  const visibleNavLinks = navLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartButton = (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Shopping cart"
      className="relative"
    >
      <ShoppingCart className="h-5 w-5 text-slate-600" />
      {safeItemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
          {safeItemCount}
        </span>
      )}
    </Button>
  );

  const cartContent = (
    <>
      <SheetHeader className="border-b pb-4">
        <div className="flex items-center justify-between gap-3">
          <SheetTitle>Shopping Bag</SheetTitle>
          {safeItems.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart}>
              Clear all
            </Button>
          )}
        </div>
      </SheetHeader>

      {safeItems.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500">
          <ShoppingCart className="h-10 w-10 text-slate-300" />
          <p className="text-lg font-semibold text-slate-700">
            Your shopping bag is empty
          </p>
          <p className="max-w-sm text-sm">
            Add supplements, complements, or materials from product pages and
            they will appear here.
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            {safeItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 p-2">
                    <img
                      src={item.image ?? "/images/placeholders/product.svg"}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "/images/placeholders/product.svg";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="line-clamp-2 font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {item.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id, item.type)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.type,
                              item.quantity - 1,
                            )
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.type,
                              item.quantity + 1,
                            )
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-700">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={item.detailPath}>
                            View details & how to use
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-lg font-bold text-slate-900">
                {formatPrice(safeSubtotal)}
              </span>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              Review your order here, then continue to secure checkout for card
              payment, receipt download, and delivery details.
            </p>
            <SheetClose asChild>
              <Button className="w-full" asChild>
                <Link href="/checkout">Proceed to Secure Checkout</Link>
              </Button>
            </SheetClose>
          </div>
        </div>
      )}
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-all duration-300 ${scrolled ? "shadow-[0_10px_35px_-20px_rgba(15,23,42,0.45)]" : "shadow-none"}`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-lg font-bold text-slate-900"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 text-sm font-black text-white shadow-md">
              N
            </span>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent transition group-hover:from-cyan-700 group-hover:to-sky-700">
              NutriSense AI
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${pathname === link.href ? "bg-cyan-50 text-cyan-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                {link.label}
                {link.badge ? (
                  <span
                    className={
                      link.badgeClassName ??
                      "text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full ml-1"
                    }
                  >
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>{cartButton}</SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg">
                {cartContent}
              </SheetContent>
            </Sheet>

            {!user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{user.name}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>{cartButton}</SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg">
                {cartContent}
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 transition-transform duration-300"
              >
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-4">
                  {visibleNavLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-6 flex flex-col gap-2">
                  {!user ? (
                    <>
                      <SheetClose asChild>
                        <Button variant="ghost" asChild>
                          <Link href="/login">Login</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild>
                          <Link href="/register">Register</Link>
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button variant="outline" asChild>
                          <Link href="/profile">Profile</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="outline" asChild>
                          <Link href="/orders">Order History</Link>
                        </Button>
                      </SheetClose>
                      <Button variant="destructive" onClick={logout}>
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
};
