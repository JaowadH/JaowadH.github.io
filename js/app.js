// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Footer year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2) Contact form via Firebase Function
  const form = document.getElementById('firebaseContactForm');
  const statusEl = document.getElementById('form-status');
  let statusTimeoutId = null; // To manage auto-hiding the success/error message

  if (form && statusEl) {
    // Helper function to update status message using Bootstrap alerts
    const updateStatus = (message, type) => {
      // Clear any existing auto-hide timeout
      if (statusTimeoutId) {
        clearTimeout(statusTimeoutId);
        statusTimeoutId = null;
      }

      statusEl.textContent = message;

      // Define all possible Bootstrap alert type classes
      const alertTypes = ['alert-success', 'alert-danger', 'alert-info', 'alert-secondary', 'alert-warning', 'alert-light', 'alert-dark'];
      
      // Remove any existing alert type, 'show', and ensure 'd-none' is not forcing it hidden if we are about to show it
      statusEl.classList.remove(...alertTypes, 'show');
      // statusEl.classList.add('d-none'); // Temporarily hide to reset if needed, then remove for show

      let alertClass = '';
      switch (type) {
        case 'success':
          alertClass = 'alert-success';
          break;
        case 'error':
          alertClass = 'alert-danger';
          break;
        case 'sending':
          alertClass = 'alert-info'; // Bootstrap's 'info' alert is suitable for "sending"
          break;
        default:
          alertClass = 'alert-secondary'; // A neutral default
      }
      statusEl.classList.add(alertClass, 'fade'); // Ensure 'fade' is present for animation

      // Make it visible: remove 'd-none', then add 'show' to trigger Bootstrap's fade-in
      statusEl.classList.remove('d-none');
      void statusEl.offsetWidth; // Force reflow to ensure CSS changes apply before 'show' transition
      statusEl.classList.add('show');
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      updateStatus('Sending…', 'sending');

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        updateStatus('Please fill in all fields.', 'error');
        // Set a timeout to hide error messages too, if desired
        statusTimeoutId = setTimeout(() => {
            statusEl.classList.remove('show');
            // After fade out, ensure it's hidden from layout
            setTimeout(() => { if (!statusEl.classList.contains('show')) statusEl.classList.add('d-none'); }, 150); // 150ms is Bootstrap's fade duration
        }, 5000); // Hide error after 5 seconds
        return;
      }

      try {
        const resp = await fetch(
          'https://submitcontactform-25up3pxdcq-uc.a.run.app',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
          }
        );
        const contentType = resp.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
          ? await resp.json()
          : { messageFromServer: await resp.text() };

        if (!resp.ok) {
          const errorMessage = data.error || (data.messageFromServer ? data.messageFromServer : resp.statusText);
          throw new Error(errorMessage || `HTTP error ${resp.status}`);
        }

        updateStatus("Thank you for your message! We'll be in touch shortly.", 'success');
        form.reset();

        // Auto-hide the success message after 5 seconds
        statusTimeoutId = setTimeout(() => {
          statusEl.classList.remove('show');
          // After fade out (Bootstrap's .fade transition is 0.15s), add d-none to remove from layout
          setTimeout(() => {
            if (!statusEl.classList.contains('show')) { // Check if it's still meant to be hidden
                 statusEl.classList.add('d-none');
            }
          }, 150); // Match Bootstrap's default fade transition duration
        }, 5000);

      } catch (err) {
        console.error('Submit error:', err);
        updateStatus(err.message && !err.message.toLowerCase().includes('http error') ? `Error: ${err.message}` : 'An unexpected error occurred. Please try again.', 'error');
        // Set a timeout to hide error messages too
        statusTimeoutId = setTimeout(() => {
            statusEl.classList.remove('show');
            setTimeout(() => { if (!statusEl.classList.contains('show')) statusEl.classList.add('d-none'); }, 150);
        }, 5000); // Hide error after 5 seconds
      }
    });
  }

  // 3) GitHub projects loader (Your existing code for this section)
  async function fetchGitHubProjects() {
    const username = 'JaowadH'; // Assuming 'JaowadH' is the correct username
    const container = document.getElementById('github-projects-container');
    const loading  = document.querySelector('.loading-projects-message');

    if (!container) return;

    // Note on your original GitHub username check:
    // The block: `if (username === 'JaowadH') { ... return; }` in your original code
    // would prevent projects from loading if the username *is* 'JaowadH'.
    // This was likely a misconfiguration. The code below assumes you want to load for 'JaowadH'.
    // If 'JaowadH' was a placeholder you meant to change, you'd use a check like:
    // if (username === 'YOUR_DEFAULT_PLACEHOLDER') { /* show 'not configured' message */ return; }

    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?type=public&sort=pushed&direction=desc`
      );
      if (!res.ok) throw new Error(`GitHub API: ${res.statusText} (status: ${res.status})`);
      const repos = (await res.json())
        .filter(r => !r.fork)
        .slice(0, 6);

      if (loading) loading.remove();
      if (!repos.length) {
        container.innerHTML = '<p>No public projects to display.</p>';
        return;
      }

      const html = repos.map(repo => `
        <div class="item project-card">
          <div class="project-info">
            ${repo.homepage
              ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer">
                  <img src="images/project/project-placeholder.png" class="img-fluid" alt="${repo.name}">
                </a>`
              : `<img src="images/project/project-placeholder.png" class="img-fluid" alt="${repo.name}">`
            }
            <h3>
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                ${repo.name}
              </a>
            </h3>
            <p>${repo.description || 'No description available.'}</p>
            ${repo.language ? `<p><strong>Language:</strong> ${repo.language}</p>` : ''}
            <div class="project-links">
              <a href="${repo.html_url}" class="btn custom-btn custom-btn-sm" target="_blank">View on GitHub</a>
              ${repo.homepage
                ? `<a href="${repo.homepage}" class="btn custom-btn custom-btn-bg custom-btn-sm custom-btn-link" target="_blank">
                    Live Demo
                  </a>`
                : ''}
            </div>
          </div>
        </div>
      `).join('');

      container.innerHTML = html;

      if (typeof $ !== 'undefined' && $.fn.owlCarousel && container.classList.contains('owl-carousel')) {
        if ($(container).data('owl.carousel')) {
            $(container).trigger('destroy.owl.carousel').empty();
        } else {
            $(container).empty();
        }
        
        $(container).html(html).owlCarousel({
          loop: repos.length > 1,
          margin: 20,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayTimeout: 4000,
          autoplayHoverPause: true,
          responsive: {
            0:    { items: 1 },
            600:  { items: 2 },
            1000: { items: 3 }
          }
        });
      }
    } catch (err) {
      console.error('Error fetching GitHub projects:', err);
      if (loading) loading.remove();
      container.innerHTML = '<p>Could not load GitHub projects at this time.</p>';
    }
  }

  if (document.getElementById('github-projects-container')) {
    fetchGitHubProjects();
  }
});