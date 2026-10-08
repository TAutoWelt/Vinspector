# Vinspector

Vehicle Inspection Tracker for documenting and assessing vehicle condition during import, sale, or inspection workflows.

This project is a mobile-first web app built as a single-page inspection checklist. It helps inspectors capture vehicle metadata, evaluate a standard set of inspection points, record defects, attach photos, save reports locally, and export a printable PDF-style summary.

## Overview

Vinspector is designed for vehicle inspectors, importers, and dealerships that need a quick and structured way to:

- record vehicle details such as VIN, brand, model, year, inspector, and date
- assess a predefined inspection checklist
- mark items as OK or NOT OK
- add defect notes and photo evidence
- save draft and archived reports in the browser
- print or export a clean inspection summary

## Features

- 42-point vehicle inspection checklist
- Exterior and interior category filters
- Status tracking for OK / NOT OK items
- Quick defect tag suggestions for common issues
- Comment fields for observations and repair notes
- Photo attachment support for defects
- Vehicle metadata modal and inspection summary banner
- Local auto-save and archived report storage using browser localStorage
- Printable / PDF-friendly report layout
- Responsive design optimized for mobile and desktop screens

## Tech Stack

- HTML
- CSS / Tailwind CSS (via CDN)
- JavaScript
- Vue 3 (via CDN)
- Font Awesome icons
- Browser localStorage for persistence

## Project Structure

- `index.html` — main application UI and logic
- `inspection-points.json` — inspection checklist definitions and item configuration
- `Project Specs.md` — product and functional specification document

## Getting Started

Because this project is a static front-end app, you can run it without a build step.

### Option 1: Open directly in a browser

1. Download or clone the repository.
2. Open `index.html` in your browser.
3. Start using the inspection tracker.

### Option 2: Serve locally

If you prefer using a local web server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How It Works

1. Enter the vehicle information (brand, model, VIN, inspector, etc.).
2. Review the checklist and mark each item as OK or NOT OK.
3. For defects, add notes and attach supporting photos.
4. Save the inspection report to the archive.
5. Print or export the final PDF-style inspection sheet.

## Notes

- Data is stored in the browser using `localStorage`, so reports persist on the same browser/device.
- The project appears to be tailored to Macedonian-language inspection workflows, with labels and UI text presented in Macedonian.
- The UI is designed to resemble a clean iOS-inspired light theme.

## License

This repository does not currently declare a license. If you plan to distribute or reuse it publicly, consider adding an appropriate open-source license.

## Repository Context

- Repository: `TAutoWelt/Vinspector`
- Description: `Vehicle Inspection Tracker`
- Primary language: HTML
