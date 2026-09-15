"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// wishlist entries come from the API as { id, product: {...} } — flatten
// to the shape this component's cards already display.
function toDisplayItem(entry) {
  return {
    id: entry.id,
    name: entry.product.name,
    category: entry.product.category,
    description: entry.product.description,
    price: entry.product.price,
    inStock: entry.product.stock > 0,
    image: entry.product.images?.[0],
  };
}

export function WishlistTab({ wishlist, onRemove }) {
  const [addedId, setAddedId] = useState(null);
  const items = wishlist.map(toDisplayItem);

  async function handleRemove(id) {
    await onRemove(id);
  }

  function handleAddToCart(id) {
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1800);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-foreground">
            Saved Gifts & Wishlist
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Products you saved for future gifting or corporate bulk order customization.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          <strong className="font-semibold text-foreground">{items.length}</strong> item(s)
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-(--paper-muted) text-muted-foreground">
            <Heart size={24} />
          </div>
          <h4 className="mt-4 font-serif text-lg text-foreground">Your wishlist is empty</h4>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Explore our collection of custom mugs, temperature bottles, photo gifts, and corporate
            lanyards to save your favorites.
          </p>
          <Button asChild size="sm" className="mt-5 rounded-full text-xs">
            <Link href="/products">Explore Catalog</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isAdded = addedId === item.id;

            return (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove from wishlist"
                    className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-card hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                  {item.inStock && (
                    <span className="absolute bottom-3 left-3 rounded-md bg-emerald-800/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      Ready to Customize
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] font-medium text-(--brand)">{item.category}</span>
                  <h4 className="mt-1 font-serif text-base font-normal text-foreground group-hover:text-(--brand) transition-colors">
                    {item.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-lg font-semibold text-foreground">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item.id)}
                      className={`w-full gap-1.5 rounded-full text-xs transition-all ${
                        isAdded
                          ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                          : ""
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 size={14} />
                          Added to Bag!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={13} />
                          Add to Bag
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
