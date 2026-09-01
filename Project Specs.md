Project Specification: AutoCheck MK (Vehicle Inspection Tracker)

Version: 1.0

Target Platform: Web Browsers (Mobile-First / Desktop Responsive)

Primary Language: Macedonian (mk)

Design Paradigm: Apple iOS Light Theme & Google Sans Typography System

1. Executive Summary

AutoCheck MK is a web-based vehicle inspection and condition tracking application engineered specifically for car importers, dealerships, and field inspectors in North Macedonia. It streamlines the multi-point quality check required when receiving and preparing imported used or new vehicles.

The application eliminates paper checklists by offering a mobile-optimized, offline-capable interface where inspectors can rapidly perform 42-point checks, tag specific defects, attach photos, enter vehicle metadata, save inspection drafts, and generate printable PDF inspection certificates.

2. Technology Stack & System Architecture

2.1 Core Stack

Frontend Framework: Vue 3 (Options API / Single-File Runtime via CDN)

Styling Framework: Tailwind CSS (Utility-first framework via CDN)

Typography: Google Sans ('Google Sans', 'Google Sans Text', 'Plus Jakarta Sans')

Iconography: FontAwesome 6 Free Web Icons

Data Persistence: Web Storage API (localStorage for offline draft auto-saves and report archives)

Print Engine: CSS @media print rules targeting custom printable DOM modals

2.2 System Layout Architecture

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
1. **Brand Bar:** Displays system name (*AutoCheck MK*) and application subtitle (*Проверка & Следење на возила*).
2. **Action Controls:**
   * **`Возило` Modal Button:** Triggers modal dialog to edit vehicle metadata (Brand/Model, VIN, Inspector Name).
   * **`Архива` Drawer Toggle:** Opens/closes saved inspection reports with dynamic badge count.
3. **Vehicle Details Display Banner:**
   * Text-only display of core details: **Brand & Model**, **VIN**, **Inspector** (*Прегледал:*), and **Inspection Date**.
4. **Category Filter Ribbon:** Horizontal scrollable category pill buttons:
   * `СИТЕ` (All 42 Items)
   * `Надворешна` (Exterior Items)
   * `Внатрешност` (Interior Items)
   * `Со Оштетувања` (Defects Filter - items marked `NOT OK`)
   * `Останати OK` (Passed Filter - items marked `OK`)
   * *Real-time item count badges attached to each filter.*

### 4.2 Interactive Checklist Engine
Each card represents a distinct vehicle component or system:
* **Item Header:** Title and descriptive subtitle.
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
* **Тркала / Бандажи:** Radio buttons (`ALU`, `МЕТАЛНИ`, `Раткапни`).
* **ПАЛЕЊЕ:** Radio buttons (`Нормално пали`, `Со кабли`).
* **Резервна Гума / Сет:** Radio buttons (`Резервна гума`, `Сет Пена + Компресор`, `Нема`).
* **Резервен Клуч:** Radio buttons (`1 Клуч`, `2 Клуча`, `Без клуч`).
* **Километража:** Numeric entry input for current odometer reading in kilometers.

### 4.4 Report Archiving & Persistence
* **Draft Auto-Save:** Automatically persists current form state into `localStorage.autocheck_current_draft` on every status change or comment edit.
* **Report Archiving:**
  * **`Зачувај го извештајот` Button:** Compiles current vehicle metadata, checklist states, defect notes, photo arrays, and timestamps into `localStorage.autocheck_reports`.
  * **Archive Drawer:** Lists past saved inspections. Supports loading archived reports into active editor or deleting records.
* **Form Reset:** Clears active inputs with user confirmation dialog.

### 4.5 Printable Report & PDF Export
* **`Преглед за принт` Modal:** Generates an official print sheet formatted specifically for A4 paper and PDF export.
* **Print Layout Inclusions:**
  * Document header and issue date.
  * Vehicle metadata summary block.
  * Highlighted Defect & Damage Summary block (filtered to show only `NOT OK` items with notes).
  * Complete 42-point checklist summary grid.
  * Custom CSS hiding non-printable header and action UI elements during `window.print()` executions.

---

## 5. Inspection Checklist Scope (42 Standard Items)

### 5.1 Exterior & Mechanical Section (`EXTERIOR`)
1. Проверка Течности (*Масло, Антифриз, Гориво*)
2. Акумулатор (*Состојба и напон*)
3. Преден Браник
4. Фарови (*Оштетени + Влага*)
5. Хауба
6. Шофершајбна (*Камчиња и пукнатини*)
7. Кров (*Вдлабнатини од град и слично*)
8. Тркала / Бандажи (*ALU / Метални / Раткапни*)
9. Преглед на гуми (*Шара и состојба*)
10. Прагови (*Лева и десна страна*)
11. Врати (*Сите 4 врати*)
12. Гепек (*Задна врата*)
13. Ретровизори (*Лево и десно стакло + куќиште*)
14. Странични Стакла
15. Заден Браник
16. Задно стакло (*Греачи и стакло*)
17. Задни Штопови / Магленки (*Оштетени + Влага*)
18. Паркинг сензори (*Предни и задни*)
19. ПАЛЕЊЕ (*Нормално пали / Со кабли*)
20. Мотор - Работа (*Нестандардни звуци и тропање*)
21. Тест возење & Менувач (*Кочење, дискови, предница, амортизација*)
22. Кабли за полнење (*За електрични / хибридни возила*)
23. Ајдучки клуч (*Клуч за тркала*)
24. Даска / Ролетна во гепек
25. Наслони за глава
26. Резервна Гума / Сет (*Резервна гума / Пена + компресор / Нема*)
27. Дизалица

### 5.2 Interior Section (`INTERIOR`)
28. Седишта (*Предни и задни седишта*)
29. Екрани (*Централен дисплеј и калориметар*)
30. Панели, Копчиња, Пластики
31. Таван (*Небо / Тапацир*)
32. Сончев кров (*Стакло, механизам, дефект*)
33. Резервен Клуч (*1 Клуч / 2 Клуча / Без клуч*)
34. Навигација (*Мапи, SD Картичка*)
35. Влага / Мувла (*Мирис или влага под теписи*)
36. Warning Lights на табла (*Check Engine, Airbag, etc.*)
37. Паркинг Камера (*Задна / 360 камера*)
38. Клима Уред (*Ладење и греење*)
39. Километража (*Запис на км*)
40. Антени
41. Радио / Звук
42. ОПРЕМА (*Триаголник, прва помош, елеци*)

---