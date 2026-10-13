# ST Electric Store

A database-free product catalog for ST Electric Store.

## Run on localhost

1. Open PowerShell in this folder.
2. Run `npm start`.
3. Open `http://localhost:3000`.
4. Open the editor at `http://localhost:3000/admin.html`.

No installation, database, API, or environment file is required. Python must be installed because the start command uses Python's static file server.

## Add or edit products

Each new or edited product requires:

- Product name
- Optional PKR price; leave it empty to display **Ask for price**
- Color
- Two to five JPG, PNG, or WebP photos selected from the computer
- One to three short description points

Selected photos are resized and compressed before the catalog is saved in the browser. A Windows file path cannot be pasted into a website, so use **Choose photos** instead.

Product cards open a dedicated detail page with a gallery. The WhatsApp message includes the product name, color, price, and full product-page link.

## Publish catalog changes

Browser edits are immediately visible on the same browser and computer. To make those changes visible to every visitor:

1. Finish editing all products.
2. Select **Export public catalog**.
3. Replace `public/data/products.json` with the downloaded `products.json` file.
4. Run `npm start` and check the storefront and product pages.
5. Upload the contents of `public` to your static host.

For Cloudflare Pages connected to GitHub, commit and push the replaced `public/data/products.json` file. Do not manage products from a unique Cloudflare preview URL: every preview address has separate browser storage. Use localhost for editing, or use one stable production/custom-domain address, and always publish the exported catalog through GitHub before deploying other site changes.

The exported JSON contains the optimized product photos, so there are no extra image files to copy. Existing legacy products with one image stay visible, but the editor will require a second image before the public catalog can be exported.

Use **Download backup** to save the browser catalog without publication validation. Use **Restore backup** to load that file later.
