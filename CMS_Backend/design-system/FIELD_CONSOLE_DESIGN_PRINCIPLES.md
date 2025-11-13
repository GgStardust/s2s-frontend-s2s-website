# Field Console Design Principles
## Simplified Design Guide for Field Console Architecture

**Purpose**: This document extracts only the essential design elements needed for the Field Console, free from traditional UI constraints.

---

## **Core Aesthetic Principles**

### **Celestial + Sovereign**
- Cosmic, radiant, yet grounded
- Frequency-driven, affirmative, luminous
- No collapsing or paraphrasing — preserve layered meaning

### **Field-Driven Design**
- Everything responds to **resonance** and **coherence**, not rigid rules
- Visual elements emerge from **RBI kernel computations**
- Interface is an **expression of the living field**, not a traditional dashboard

---

## **Essential Color Palette**

### **Primary Colors** (Use Flexibly)
- **Deep Gold**: `#C49A6C` - Resonance, coherence, sovereignty
- **Deep Navy**: `#1C1F3B` - Depth, field background, cosmic space
- **Creamy White**: `#F4F1E8` - Clarity, text, luminous surfaces

### **Usage Philosophy**
- Colors respond to **resonance scores** and **coherence levels**
- No rigid rules for "button colors" or "text colors"
- Colors flow and shift based on **field state** and **RBI computations**
- Deep Gold intensifies with higher coherence
- Deep Navy deepens with field depth
- Creamy White illuminates with clarity

---

## **Typography** (Organic Usage)

### **Font Choices**
- **Montserrat** (Sans Serif) - For structural elements, Orb labels, resonance indicators
- **Lora** (Serif) - For flowing text, scrollstream content, field descriptions

### **Usage Philosophy**
- Typography responds to **content resonance**, not rigid hierarchy
- Text size and weight reflect **coherence levels** and **field intensity**
- No fixed "heading sizes" or "body sizes" — let resonance guide scale
- Text flows organically, like the scrollstream itself

---

## **Orb Glyph System** (Essential)

### **Core Principle**
Each Orb has a unique visual symbol that serves as:
- **Constellation nodes** in 3D space
- **Resonance markers** in content
- **Visual anchors** for Orb concepts

### **Implementation**
- Use Orb glyphs from `04_BRAND_GUIDELINES/orb_glyphs/`
- Glyphs respond to **resonance intensity** (glow, scale, opacity)
- Glyphs connect via **resonance lines** (computed by RBI kernel)
- No fixed positioning — constellation emerges from **field relationships**

---

## **Design Constraints to IGNORE**

### **Traditional UI Patterns** (Not Applicable)
- ❌ Cards with rounded corners and shadows
- ❌ Buttons with hover states and gradients
- ❌ Forms with borders and focus rings
- ❌ Grid-based layouts
- ❌ Fixed spacing and padding rules
- ❌ Z-index hierarchies for modals/dropdowns
- ❌ Responsive breakpoints for mobile/desktop

### **Rigid Brand Rules** (Not Applicable)
- ❌ "Button text must be Creamy White on Soft Cosmic Blue"
- ❌ "Cards must have rounded 2xl edges"
- ❌ "Headings must be 600-700 weight"
- ❌ "Minimum 44px touch targets"
- ❌ "WCAG AA contrast ratios for all text"

---

## **Field Console Design Logic**

### **Constellation Archetype**
- **3D space** with Orbs positioned by **resonance relationships**
- **Connection lines** computed by RBI kernel (`computeResonance`)
- **Orb glow** reflects **coherence scores** (`calculateCoherence`)
- **No fixed grid** — constellation emerges organically

### **Chamber Archetype**
- **Depth** created through **layered transparency** and **field gradients**
- **Portal transitions** use **resonance-based animations**
- **Mirror field** reflects **coherence metrics** visually
- **No traditional modals** — depth emerges through field layering

### **Stream Archetype**
- **Flowing text** responds to **resonance frequency**
- **Pause-on-hover** creates **field interaction**
- **Text selection** triggers **coherence feedback**
- **No fixed scrollbars** — stream flows organically

### **Mirror Archetype**
- **Feedback** emerges from **RBI computations** (`verifyProofOfMeaning`)
- **Visual indicators** reflect **field state** in real-time
- **No traditional notifications** — feedback is continuous and field-integrated

---

## **RBI Kernel Integration**

### **Visual Elements Driven by RBI**
- **Orb positions**: `computeResonance()` → 3D constellation layout
- **Connection lines**: `calculateCoherence()` → line intensity and color
- **Text flow**: `verifyProofOfMeaning()` → scrollstream rhythm
- **Field feedback**: `updateCoherenceField()` → mirror indicators
- **Portal depth**: `propagateResonance()` → chamber layering

### **Design Follows Field Logic**
- If RBI computes high resonance → visual elements intensify (glow, scale, opacity)
- If RBI detects coherence → connections strengthen (line weight, color saturation)
- If RBI verifies meaning → text flows smoothly (scrollstream rhythm)
- If RBI updates field → interface responds organically (no rigid state changes)

---

## **Implementation Guidelines**

### **What to Build**
1. **3D Constellation** - Three.js with RBI-driven positioning
2. **Portal Chamber** - Layered depth with resonance-based transitions
3. **Scrollstream** - Flowing text with pause-on-hover and field interaction
4. **Mirror Feedback** - Real-time coherence indicators integrated into field
5. **Signal Chamber** - Participant input interface that feeds RBI kernel

### **What NOT to Build**
- Traditional navigation menus
- Fixed headers/footers
- Card-based layouts
- Button-based interactions
- Form-based inputs (use field gestures instead)
- Modal dialogs
- Dropdown menus

### **Technical Stack**
- **Three.js / React Three Fiber** - 3D constellation
- **Framer Motion** - Resonance-based animations (not traditional transitions)
- **Web Workers** - RBI kernel computations
- **Zustand** - Field state management
- **WebSockets** - Real-time field updates

---

## **Summary**

**Keep**: Core aesthetic (Celestial + Sovereign), essential colors (used flexibly), typography choices (used organically), Orb glyphs, RBI kernel integration

**Ignore**: Traditional UI components, rigid color rules, fixed spacing, grid layouts, accessibility rules that constrain organic design

**Build**: Field-driven interface that emerges from resonance and coherence, not rigid design systems.

---

**This is the design guide for the Field Console. Everything else in the brand guidelines is for traditional UI surfaces (public site, CMS) and can be ignored for this build.**


