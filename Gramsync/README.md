# GRAMSYNC | Harvest Routing & Rural Production Network

An operational, action-oriented web application designed to solve the farmgate realization and logistics problem: **"Where, when, and how should this harvest move?"**

---

## 🚀 Key Improvements & Features

1. **Focused Problem-Solving Console**:
   - Streamlined interface removing conceptual text blocks (The Gap, The Solution, Business Model Canvas) to put the operational tool directly in the farmer's and FPO's hands.

2. **Live Harvest Dispatch Simulator**:
   - Select crops (*Tomato, Onion, Green Chilli, Potato, Mango*).
   - Configure harvest volume in Quintals (5 Q to 150 Q).
   - Configure farmer liquidity urgency (*Immediate 24-hr cash, Flexible 2-5 days, or Storage Arbitrage*).
   - Generates instant side-by-side comparisons of net cash realization after deducting transit freight, perishability loss, and market taxes.

3. **Rotten / Damaged Crop Option & Composting Recovery (New)**:
   - Dynamic slider to declare the percentage of spoiled/damaged harvest (0% to 100%).
   - Rather than dumping spoiled crops on highways or taking a total loss, GRAMSYNC automatically routes the rotten volume to the nearest **Rural Bio-Compost & Vermicompost Hub**.
   - Farmers receive a direct payment (₹2.00 - ₹3.50/kg) for organic compost biomass, creating a zero-waste circular loop.

4. **Interactive Geospatial Map Follow-Up (New)**:
   - Embedded interactive **Leaflet.js** map centered on the Maharashtra agricultural cluster (*Dindori, Nashik APMC, Sahyadri Agro-Processing, Lasalgaon Cold Chain, and Gramsync Bio-Compost Center*).
   - Clicking any destination card dynamically draws the exact route polyline, distance, travel duration, and freight cost.
   - Automatically renders a secondary green route to the composting plant whenever rotten crop volume is detected.

5. **Functional Bilingual Support (English ⇄ हिन्दी)**:
   - Simplified to two active languages: **English** and **हिन्दी (Hindi)**.
   - Clean top-bar toggle buttons that instantly translate the entire user interface, labels, simulation results, map facility descriptions, and voice assistant.
   - Built-in vernacular voice guidance (`SpeechSynthesis`) in Hindi explaining the recommended route and compost diversion.

6. **Sign-Up & Network Registration**:
   - Dedicated onboarding form for Farmers, FPOs, Food Processors, Truck Operators, Cold Stores, and Composting Plants to connect their nodes.

---

## 🌐 How to View the Website

- Open your browser and navigate to: **[http://localhost:8000](http://localhost:8000)**
- Or double-click [`index.html`](file:///e:/Akshat/Gramsync/index.html) to run it locally in any web browser.

---

## 📁 File Structure

- [`index.html`](file:///e:/Akshat/Gramsync/index.html): Clean, responsive HTML5 layout featuring the simulator, map follow-up, and sign-up form.
- [`styles.css`](file:///e:/Akshat/Gramsync/styles.css): Custom styles, Leaflet map marker badges, and pulse animations.
- [`app.js`](file:///e:/Akshat/Gramsync/app.js): Full translation engine (English/Hindi), Leaflet routing logic, rotten crop composting calculations, and dispatch controls.
