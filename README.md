# Country Spirit Shop Catalog

This is a GitHub Pages catalog designed to be embedded in Google Sites.

## Files
- `index.html` — searchable/filterable/sortable catalog UI
- `catalog.json` — generated from the uploaded inventory CSV

## GitHub Pages
1. Create a GitHub repository, e.g. `country-spirit-catalog`.
2. Upload `index.html` and `catalog.json` to the repository root.
3. In GitHub: **Settings → Pages → Deploy from a branch → main → / (root)**.
4. Open the generated Pages URL.
5. In Google Sites choose **Insert → Embed → By URL** and paste the GitHub Pages URL.

## Updating inventory
Replace `catalog.json` with a newly generated version whenever the POS inventory CSV changes. The website code does not need to change.

## Images
The catalog automatically attempts to show product images from Open Food Facts using UPC/barcode data. Some alcoholic products will not have an image there; those cards automatically show initials instead. For complete image coverage, add an `image` URL for products to `catalog.json`.
