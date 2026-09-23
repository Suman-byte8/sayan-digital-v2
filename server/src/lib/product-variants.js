import { ApiError } from "../utils/api-error.js";

// Deterministic key for a variant's option-value combination, e.g.
// {"Size":"8x12","Thickness":"1 inch"} -> "Size:8x12|Thickness:1 inch".
// Sorted by option name so the same combination always produces the same
// key regardless of what order the admin picked the options in.
export function computeSelectionKey(selection) {
  return Object.entries(selection)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${name}:${value}`)
    .join("|");
}

// Human-readable, frozen at order time onto OrderItem.variantLabel, e.g.
// "Size: 8x12, Thickness: 1 inch".
export function formatVariantLabel(selection) {
  return Object.entries(selection)
    .map(([name, value]) => `${name}: ${value}`)
    .join(", ");
}

// Cross-checks a create/update product payload's variants against its own
// declared options before anything touches the database - every variant's
// selection must reference option names and values that actually exist on
// this same payload, and no two variants may collapse to the same
// combination.
export function validateVariantPayload(variantOptions = [], variants = []) {
  if (variants.length === 0) return;

  const valuesByOption = new Map(variantOptions.map((opt) => [opt.name, new Set(opt.values)]));
  const seenKeys = new Set();

  for (const variant of variants) {
    const selectionEntries = Object.entries(variant.selection ?? {});
    if (selectionEntries.length === 0) {
      throw new ApiError(400, "Each variant must select a value for at least one option.");
    }

    for (const [name, value] of selectionEntries) {
      const allowedValues = valuesByOption.get(name);
      if (!allowedValues) {
        throw new ApiError(400, `Variant references an option "${name}" that isn't defined on this product.`);
      }
      if (!allowedValues.has(value)) {
        throw new ApiError(400, `Variant references "${value}" which isn't one of "${name}"'s defined values.`);
      }
    }

    const key = computeSelectionKey(variant.selection);
    if (seenKeys.has(key)) {
      throw new ApiError(400, `Duplicate variant combination: ${formatVariantLabel(variant.selection)}.`);
    }
    seenKeys.add(key);
  }
}
