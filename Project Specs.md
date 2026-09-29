# Project Specification: AutoWeltInspector (Vehicle Inspection Tracker)

Version: 1.0

Target Platform: Web Browsers (Mobile-First / Desktop Responsive)

Primary Language: Macedonian (mk)

Design Paradigm: Apple iOS Light Theme & Google Sans Typography System

## 1. Executive Summary

AutoWeltInspector is a web-based vehicle inspection and condition tracking application for car importers, dealerships, and field inspectors in North Macedonia. It streamlines the multi-point quality check required when receiving and preparing imported used or new vehicles.

The application replaces paper checklists with a responsive browser-based inspection workflow. Inspectors can evaluate the 53 checklist points plus an uncategorized notes point, record defects and photos, enter vehicle metadata, save an active draft, archive reports, and print a report or save it as PDF through the browser. The app requires its external CDN dependencies and an HTTP server for the JSON catalog; it does not provide guaranteed offline operation.

## 2. Technology Stack & System Architecture

### 2.1 Core Stack

Frontend Framework: Vue 3 Composition API (`createApp` and `setup`) loaded from a CDN; the app is inline in `index.html` and has no build step

Styling Framework: Tailwind CSS v3, compiled locally with the Tailwind CLI

CSS Build: Run `npm install` and `npm run build:css` to generate `tailwind.css` from `tailwind.input.css` using `tailwind.config.js`.

Typography: Google Sans ('Google Sans', 'Google Sans Text', 'Plus Jakarta Sans')

Iconography: FontAwesome 6 Free Web Icons

Data Persistence: Web Storage API (`localStorage` for browser-local draft auto-saves and report archives)

Print Engine: CSS @media print rules targeting custom printable DOM modals

### 2.2 System Layout Architecture

* `index.html` contains the Vue 3 application, responsive interface, inspection workflow, editor, archive, and print view.
* `inspection-points.json` is fetched at runtime and is the source of the ordered checklist definitions, sections, categories, defect tags, and specialized control configuration.
* Five walkaround sections are displayed in catalog order. The first four map to `EXTERIOR`; `ЕНТЕРИЕР` maps to `INTERIOR`. The filters remain `СИТЕ`, `Надворешно`, `Внатрешно`, `NOT OK`, and `OK`.
* The uncategorized “ОСТАНАТИ ЗАБЕЛЕШКИ” point follows the five sections and is excluded from Exterior/Interior category filters and counts. It remains eligible for the `NOT OK` and `OK` status filters when marked.
* The current draft and report archive are stored separately in browser `localStorage`, scoped to the app's origin. Photos are stored as data URLs and consume browser storage quota.
* Tailwind utilities are compiled into the local `tailwind.css` file. Vue, Font Awesome, and fonts still load from external CDNs, and the catalog is fetched from the server; use the app through an HTTP server with those dependencies available. There is no service worker or bundled offline dependency cache.

---

## 3. UI/UX Design System Guidelines

### 3.1 Color Palette (Apple Light Theme Accent)

| Element Type | Color Code | Description |
| :--- | :--- | :--- |
| **Canvas / Background** | `#F2F2F7` | iOS System Gray 6 (Grouped background) |
| **Card / Container** | `#FFFFFF` | Solid white container background |
| **Primary Accent / Red** | `#DC2626` / `#EF4444` | Primary brand color, alerts, and NOT OK triggers |
| **Success / Green** | `#059669` / `#10B981` | Pass status indicator, OK buttons |
| **Text Primary** | `#0F172A` | Slate 900 for high-contrast titles |
| **Text Secondary** | `#64748B` | Slate 500 for captions and subtitles |
| **Borders** | `#E2E8F0` | Subtle Slate 200 border system |

### 3.2 Visual Interactions

* **Active Card Focus Ring:** Tapping an inspection item applies a subtle drop shadow (`shadow-xl`), upward elevation (`-translate-y-0.5`), and red accent ring highlight (`ring-2 ring-red-500/20`).
* **Glassmorphism Header:** Pinned top header uses `backdrop-blur-xl` over an 85% opaque white layer (`bg-white/85`) to mimic native iOS frosted glass navigation bars.
* **Interactive Pills & Badges:** Touch targets feature standard iOS rounded corners (`rounded-2xl` and `rounded-full`) with active state scaling animations (`active:scale-95`).

---

## 4. Functional Specifications & Features

### 4.1 Sticky Header & Navigation

* **Brand Bar:** Displays system name (*AutoWeltInspector*), beta version, and application subtitle (*Проверка на Возила*).
* **Action Controls:** Vehicle metadata modal and saved-report archive drawer with a dynamic archive count.
* **Vehicle Details Display:** Shows brand/model, VIN, inspector, and inspection date.
* **Category and Status Filters:** `СИТЕ` (54 entries), `Надворешно`, `Внатрешно`, `NOT OK`, and `OK`. All, Exterior, and Interior counts are data-driven; defect and passed filters show live status counts.

### 4.2 Interactive Checklist Engine

Each card represents a distinct vehicle component or system:

* **Item Header:** Title and descriptive subtitle when one is available; checklist details from the source list are shown on the card.
* **Status Indicator:** Displays dynamic status pill (`OK` or `NOT OK`) once evaluated.
* **Decision Controls:**
  * **`ОК (Исправно)` Button:** Sets status to `OK`, collapses defect options if previously open, triggers draft auto-save.
  * **`NOT OK (Дефект)` Button:** Sets status to `NOT OK`, expands defect detail drawer.
* **Defect Detail Drawer (Triggered on NOT OK):**
  * **Smart Defect Tag Chips:** Contextual 1-tap quick tags based on item type (e.g., *ИЗГРЕБАНО, ПУКНАТО, ВЛАГА, НЕ РАБОТИ*). Tapping appends tag to comment text field.
  * **Comment Text Field:** Multi-line text field for additional observations.
  * **Photo Uploader:** Supports attaching images directly via device camera or photo picker with base64 client-side previews and deletion capability.

### 4.3 Specialized Item Controls

Certain inspection points render specialized quick selectors:

* **Бандажи/гуми:** Required radio selection for rim type on each side-specific wheel point (`ALU`, `Метални`, `Раткапни`).
* **ПАЛЕЊЕ:** Required radio selection (`Нормално пали`, `Со кабли (испразнет акумулатор)`, `Не пали`).
* **Резервна Гума / Сет:** Required radio selection for spare wheel/foam-compressor kit availability.
* **Километража (*Запис на км*):** Required numeric entry for the current odometer reading in kilometers. The earlier “Километража” checklist point remains a separate visual check without a numeric field.
* Custom points can reuse one of the catalog's configured control presets. The editor does not create arbitrary control definitions.

### 4.4 Report Archiving & Persistence

* **Draft Auto-Save:** Persists current vehicle data, checklist state, specialized values, and photos in `localStorage.autocheck_current_draft` after edits.
* **Draft Versioning:** Draft schema version 5 is used. A draft from an earlier schema version is discarded when the app loads; catalog changes that split points are not guessed or migrated.
* **Report Archiving:**
  * **`Зачувај го извештајот` Button:** Compiles current vehicle metadata, checklist states, defect notes, photo arrays, and timestamps into `localStorage.autocheck_reports`.
  * **Archive Drawer:** Lists past saved inspections. Supports loading archived reports into the active editor, deleting records, and exporting an archive backup. Archived report snapshots are retained across the checklist/draft schema update.
* **Form Reset:** Clears active inputs with user confirmation dialog.

### 4.5 Printable Report & PDF Export

* **Print Action:** Validates required vehicle and specialized-control values, then opens the browser print dialog for the A4-formatted report. The browser can save the report as PDF.
* **Print Layout Inclusions:**
  * Document header and issue date.
  * Vehicle metadata summary block.
  * Highlighted Defect & Damage Summary block (filtered to show only `NOT OK` items with notes).
  * Complete 54-entry checklist summary (53 catalog points plus the notes point), grouped by walkaround section and numbered by display order.
  * Custom CSS hiding non-printable header and action UI elements during `window.print()` executions.

---

## 5. Inspection Checklist Scope (53 Checklist Points)

The app preserves the order of the supplied checklist and assigns unique display numbers by catalog position. The source list repeats the number 7 and the odometer entry number 50; these are separate rows, not IDs. The first four walkaround sections are `EXTERIOR`; the Interior section is `INTERIOR`.

### 5.1 НАПРЕД (`EXTERIOR`)

* Проверка Течности (*Масло, Антифриз, Гориво*)
* Акумулатор (*Состојба и напон*)
* Преден Браник
* Фарови (*Оштетени + Влага*)
* Хауба
* Шофершајбна (*Камчиња и пукнатини*)
* Кров

### 5.2 ДЕСНА СТРАНА (`EXTERIOR`)

* Крило Предно - Десна Страна
* Ретровизор - Десна Страна
* Врати - Десна Страна
* Стакла - Десна Страна
* Прагови - Десна Страна
* Бандажи/ГУМИ ДЕСНИ
* Крило Задно - Десна Страна

### 5.3 ПОЗАДИ (`EXTERIOR`)

* Заден Браник
* Кука
* Штопови
* Гепек
* Задно Стакло
* Даска/Ролетна
* Наслони за глава
* Кабли за полнење (*За електрични / хибридни возила*)
* Компресор Пена
* Резервна Гума / Сет (*Резервна гума / Пена + компресор / Нема*)
* Дизалица
* Ајдучки клуч (*Клуч за тркала*)
* Антена

### 5.4 ЛЕВА СТРАНА (`EXTERIOR`)

* Крило Задно - Лева Страна
* Врати - Лева Страна
* Стакла - Лева Страна
* Прагови - Лева Страна
* Бандажи/ГУМИ ЛЕВИ
* Ретровизор - Лева Страна
* Крило Предно - Лева Страна

### 5.5 ЕНТЕРИЕР (`INTERIOR`)

* ПАТОСНИЦИ
* Седишта (*Предни и задни седишта*)
* Влага / Мувла (*Мирис или влага под теписи*)
* Кров Тапацир
* Сончев кров (*Стакло, механизам, Ролетна*)
* Волан
* ПАЛЕЊЕ (*Нормално пали / Со кабли*)
* Мотор - Работа (*Нестандардни звуци и тропање*)
* Тест возење & Менувач (*Кочење, дискови, предница, амортизација*)
* Панели, Копчиња, Пластики
* Екрани (*Централен дисплеј и калориметар*)
* Километража
* Warning Lights на табла (*Check Engine, Airbag, etc.*)
* Навигација (*Мапи, SD Картичка*)
* Паркинг Камера (*Задна / 360 камера*)
* Клима Уред (*Ладење и греење*)
* Километража (*Запис на км*)
* Радио / Звук
* ОПЕМА (*Триаголник, прва помош, елеци*)

### 5.6 Unsectioned Notes Point

* ОСТАНАТИ ЗАБЕЛЕШКИ — uncategorized; excluded from Exterior/Interior filters and counts, but eligible for `NOT OK` and `OK` status filters when marked.

---
