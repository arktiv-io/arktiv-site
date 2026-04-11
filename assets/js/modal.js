/* ============================================================
   Arktiv — Modal & Form Logic
   Shared across all pages.
   ============================================================ */

// ── CONFIG ──────────────────────────────────────────────────
// TODO: Replace with your HubSpot Form GUID from:
// HubSpot → Marketing → Forms → [your form] → Actions → Share → Embed code
const HS_PORTAL_ID = '245853125';
const HS_FORM_GUID = '15425c8d-32be-42d9-9d07-f60b0a2dc191';

// ── STATE ────────────────────────────────────────────────────
let _lastFocusedElement = null;

// ── OPEN MODAL ───────────────────────────────────────────────
function openModal(source) {
  const modal = document.getElementById('leadModal');
  if (!modal) return;

  // Store where focus was so we can return it on close
  _lastFocusedElement = document.activeElement;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Move focus to first input after animation
  requestAnimationFrame(() => {
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) firstInput.focus();
  });

  // GA4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'modal_open', { event_category: 'engagement', event_label: source || 'unknown' });
  }
}

// ── CLOSE MODAL ──────────────────────────────────────────────
function closeModal() {
  const modal = document.getElementById('leadModal');
  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';

  // Return focus to triggering element
  if (_lastFocusedElement) {
    _lastFocusedElement.focus();
    _lastFocusedElement = null;
  }
}

// ── FOCUS TRAP ───────────────────────────────────────────────
function trapFocus(modal) {
  const focusable = modal.querySelectorAll(
    'button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  modal.addEventListener('keydown', function handleTrap(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { last.focus(); e.preventDefault(); }
    } else {
      if (document.activeElement === last)  { first.focus(); e.preventDefault(); }
    }
  });
}

// ── FORM SUBMISSION ──────────────────────────────────────────
async function handleModalSubmit(e) {
  e.preventDefault();

  const btn      = document.getElementById('modalSubmitBtn');
  const errorEl  = document.getElementById('modalError');
  const origText = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Submitting…';
  if (errorEl) errorEl.style.display = 'none';

  const name    = document.getElementById('lead-name').value.trim();
  const email   = document.getElementById('lead-email').value.trim();
  const company = document.getElementById('lead-company').value.trim();
  const firstName = name.split(' ')[0];
  const lastName  = name.split(' ').slice(1).join(' ') || '';

  let hubspotOk = false;
  let netlifyOk = false;

  // 1. HubSpot Forms API
  if (HS_FORM_GUID !== 'REPLACE_WITH_HUBSPOT_FORM_GUID') {
    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${HS_FORM_GUID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: firstName },
              { name: 'lastname',  value: lastName },
              { name: 'email',     value: email },
              { name: 'company',   value: company }
            ],
            context: {
              pageUri: window.location.href,
              pageName: document.title
            }
          })
        }
      );
      hubspotOk = res.ok;
    } catch (err) {
      console.warn('HubSpot submission error:', err);
    }
  } else {
    // GUID not yet configured — skip HubSpot, rely on Netlify
    hubspotOk = true;
  }

  // 2. Netlify Forms (backup — also catches leads if HubSpot isn't configured yet)
  try {
    const fd = new FormData();
    fd.append('form-name', 'lead-capture');
    fd.append('name', name);
    fd.append('email', email);
    fd.append('company', company);
    const res = await fetch('/', { method: 'POST', body: fd });
    netlifyOk = res.ok;
  } catch (err) {
    console.warn('Netlify form backup error:', err);
  }

  // 3. Evaluate result
  if (!hubspotOk && !netlifyOk) {
    // Both failed — show error, re-enable button
    if (errorEl) errorEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = origText;
    return;
  }

  // 4. GA4 conversion
  if (typeof gtag !== 'undefined') {
    gtag('event', 'generate_lead', {
      event_category: 'conversion',
      event_label: 'beta_waitlist',
      value: 1
    });
  }

  // 5. Show success
  const formWrap = document.getElementById('modalFormWrap');
  const success  = document.getElementById('modalSuccess');
  if (formWrap) formWrap.style.display = 'none';
  if (success)  {
    success.style.display = 'block';
    // Move focus to success heading for screen readers
    const heading = success.querySelector('h3');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
  }
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('leadModal');
  if (!modal) return;

  // Close on overlay click
  modal.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Focus trap
  trapFocus(modal);

  // Wire close button
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Wire form submit
  const form = document.getElementById('leadForm');
  if (form) form.addEventListener('submit', handleModalSubmit);
});
