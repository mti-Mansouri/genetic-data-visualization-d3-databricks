# Nucleus 🧬

A clinical variant synthesizer built because interpretation is the real bottleneck, not sequencing. 

### What it is
Basically a D3 cluster map for genomic data. You click a gene, it pulls up a clinical context panel, and you run a mock Spring AI interpretation to get a summary based on ACMG guidelines. 

### Why it's cool
- **D3 + React:** Force-directed graph that actually zooms/focuses on selection.
- **Redux Cache:** AI results are saved by variant ID. No double API calls.
- **Pinterest Vibes:** High-density medical data but make it look nice (Tailwind v4).
- **Quality Gate:** Won't deploy unless the Vitest suite passes. 

### Tech Stack
- **Frontend:** React + Vite 6 + TS
- **State:** Redux Toolkit
- **Viz:** D3.js
- **Motion:** Framer Motion
- **Infra:** GitHub Actions + Firebase Hosting

### Setup
1. `npm install`
2. `npm run dev`
3. `npm run test` (if you're into that)

Live at: []