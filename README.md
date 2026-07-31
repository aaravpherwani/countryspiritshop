# Liquor Catalog — Google Sites embed

This is a static, mobile-friendly catalog. It shows **only** products where `inStock: true`, and supports product search, category filters, and sorting. It does not process alcohol purchases or collect customer data.

## Update your inventory and images

`products.js` has already been generated from your supplied inventory export. It contains 1,896 currently in-stock beer, liquor, and wine products. Cigarettes, cigars, tobacco, grocery, and miscellaneous items are excluded.

When you export a new CSV, run this from PowerShell while inside this folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-catalog.ps1 -CsvPath "C:\path\to\your-new-export.csv"
```

The script includes products only when `Total Qty On Hand` is greater than zero and they are not marked hidden from the web store. Category-group filter buttons are automatically generated, with a type dropdown for the detailed POS category.

Product images are looked up on demand by UPC from Open Food Facts (a public product database), then cached in the visitor's browser. If no matching photo exists, the catalog shows a category bottle illustration instead. This keeps the site fast and avoids building a large image database yourself. Prices display in US dollars; change the `currency` value in `app.js` if needed.

## Publish with GitHub Pages

1. Create a **new public repository** on GitHub, for example `liquor-catalog`.
2. Upload the four files in this folder (`index.html`, `styles.css`, `app.js`, and `products.js`) to the top level of that repository.
3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. Wait a minute or two. GitHub will show a public address similar to `https://YOUR-USERNAME.github.io/liquor-catalog/`.

## Embed in Google Sites

1. In the Google Site editor, choose **Insert → Embed → By URL**.
2. Paste the GitHub Pages address from the previous step and click **Insert**.
3. Drag the embedded panel taller (about 1,000 px is a good starting height), then publish the Google Site.

GitHub Pages serves the catalog securely over HTTPS, so it works inside Google Sites. Changes pushed to the repository normally appear shortly afterward.

## Important compliance note

Verify local alcohol-advertising, pricing, age-gating, and delivery rules before publishing. This catalog deliberately omits checkout and sales functionality.
