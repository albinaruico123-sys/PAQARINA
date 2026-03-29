# Design System: Andean Modern Editorial

## 1. Overview & Creative North Star: "The Stone & The Sky"
The Creative North Star for this system is **"The Stone & The Sky."** It draws inspiration from the precision of Inca masonry—where stones fit perfectly without mortar—and the vast, high-altitude clarity of the Cusco sky. 

This is not a "generic marketplace" template. It is a high-end editorial experience that rejects the cluttered, grid-heavy "SaaS" look. Instead, we use **intentional asymmetry**, wide-open "breathing room," and **tonal layering** to build trust. We honor regional identity through minimalist geometric silhouettes and textile-inspired patterns, treated as subtle watermarks rather than decorative distractions. The result is a digital environment that feels as solid as a Sacsayhuamán wall and as modern as a luxury boutique.

---

### 2. Colors & Surface Philosophy
The palette is rooted in the UNSAAC Deep Blue and Gold accents, but its power lies in how we layer the neutrals to create depth without using lines.

#### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using `1px solid` borders for sectioning or containment. Boundaries must be defined solely through background color shifts or subtle tonal transitions. A `surface-container-low` section sitting on a `surface` background provides all the definition a professional UI needs.

#### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine Andean paper.
*   **Surface (`#f9f9f9`):** The canvas. Used for the widest layout areas.
*   **Surface Container Low (`#f3f3f3`):** Use this for secondary content blocks or to "recede" a section.
*   **Surface Container Lowest (`#ffffff`):** Use this for interactive cards and elevated components to create a soft, natural lift.

#### Glass & Gradient Signature
To move beyond "out-of-the-box" flat design:
*   **Glassmorphism:** For floating headers or navigation overlays, use `surface_container_lowest` at 80% opacity with a `backdrop-filter: blur(12px)`. This makes the layout feel integrated and premium.
*   **Signature Gradient:** For Hero backgrounds and Primary CTAs, use a subtle linear gradient: `primary` (#001e40) to `primary_container` (#003366) at a 135-degree angle. This adds "soul" and prevents the deep blue from feeling "heavy."

---

### 3. Typography: The Editorial Voice
We utilize a high-contrast scale to create an authoritative, curated feel.

*   **Display & Headline (Manrope):** Chosen for its geometric precision and modern "tech" feel. Use `display-lg` for hero statements, ensuring tight letter-spacing (-0.02em) to maintain a premium look.
*   **Title & Body (Inter):** Chosen for its world-class legibility. Inter handles the "work" of the marketplace—job descriptions, bios, and data.
*   **The Hierarchy Goal:** By pairing a large, bold Manrope headline with a clean, understated Inter body, we signal that the platform is both visionary (Cusco’s future) and reliable (Inter’s functional clarity).

---

### 4. Elevation & Depth: Tonal Layering
Traditional shadows are often a crutch for poor layout. In this system, we use **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The slight shift in brightness creates elevation without the visual "noise" of a shadow.
*   **Ambient Shadows:** When a true "float" is required (e.g., a modal or floating action button), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 30, 64, 0.06)`. Note the color—it is a tint of our `primary` blue, not a dead grey.
*   **The "Ghost Border" Fallback:** If accessibility demands a border, use `outline_variant` at **20% opacity**. This creates a suggestion of a container rather than a hard cage.

---

### 5. Components: Precision Primitives

#### Buttons
*   **Primary:** Uses the Signature Gradient (`primary` to `primary_container`). Text is `on_primary`. Corner radius: `md` (0.375rem) for a crisp, professional edge.
*   **Secondary (The Gold Standard):** Text and icon in `secondary` (#735c00). No background. On hover, a subtle `secondary_fixed` (#ffe088) background appears at 10% opacity.
*   **Tertiary:** `on_surface_variant` text. Use for low-priority actions like "Cancel."

#### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Execution:** Separate list items using the Spacing Scale (e.g., `space-y-4`). For cards, use `surface-container-lowest` and rely on the background transition against the `surface` to define the card's footprint.

#### Input Fields
*   **State:** Default background is `surface_container_high`. No border.
*   **Focus:** A 2px "Ghost Border" in `secondary` (Gold) appears only on focus to signal activity without cluttering the form.

#### Specialized Component: The "Patterned Scrim"
For freelancer profile headers, use a subtle, geometric textile pattern (Inca Cross/Chakana silhouettes) rendered in `on_surface` at **3% opacity**. This embeds regional identity into the very fabric of the UI.

---

### 6. Do's and Don'ts

#### Do
*   **DO** use whitespace as a functional element. If in doubt, increase the margin from `8` (2rem) to `12` (3rem).
*   **DO** use "Gold" (`secondary`) sparingly. It is a highlighter for success, confirmation, and premium badges, not a primary UI color.
*   **DO** align text to a strict vertical rhythm, but feel free to offset imagery and icons to create an asymmetrical, editorial flow.

#### Don't
*   **DON'T** use 100% black. Use `primary` (#001e40) or `on_surface` (#1a1c1c) for text to maintain a high-end softness.
*   **DON'T** use the `full` (9999px) roundedness scale for anything other than utility chips. Buttons and cards must stay between `md` and `xl` to maintain the "Andean Modern" architectural feel.
*   **DON'T** crowd the edges. A minimum of `spacing.6` (1.5rem) should exist between any content and the screen edge.