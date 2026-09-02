import './styles/tokens.css'
import './styles/global.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="app-shell">
    <section class="setup-card" aria-labelledby="setup-title">
      <div class="brand-mark" aria-hidden="true">
        <span class="brand-mark__moon">◒</span>
        <span class="brand-mark__word">LUNA</span>
      </div>

      <p class="eyebrow">Café & Eatery Operations System</p>

      <h1 id="setup-title">Luna POS is ready to build.</h1>

      <p class="setup-card__description">
        Staff POS, customer display, and owner Back Office—built for fast,
        reliable café operations.
      </p>

      <div class="setup-card__badges" aria-label="Project modules">
        <span class="badge">Staff POS</span>
        <span class="badge">Customer Display</span>
        <span class="badge">Back Office</span>
        <span class="badge">Offline-first</span>
      </div>

      <div class="setup-card__status" role="status">
        <span class="status-dot" aria-hidden="true"></span>
        <span>Phase 0 foundation complete</span>
      </div>
    </section>
  </main>
`