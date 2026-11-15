'use strict';

// Interactive portfolio — self-contained, no framework or build tooling required.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const projects = {
  audit: {
    category: 'AUTOMATION · OPERATIONS', stage: 'Applied at work',
    title: 'Case-response audit & governance',
    description: 'Designed the review logic for an automation-supported case-response auditing process, focused on clearer SLA checks, consistent attribution, and reducing repeated manual effort.',
    points: [
      'Defined operational review criteria and case eligibility rules, informed by real case workflows.',
      'Helped shape automation-assisted audit reporting and exception tracking.',
      'Reduced recurring manual audit work by approximately three hours per week (reported project outcome).'
    ]
  },
  slack: {
    category: 'AI · WORKFLOW DESIGN', stage: 'Applied at work',
    title: 'AI-assisted Slack support',
    description: 'A no-code AI-first support workflow created to make initial guidance quicker and give colleagues a clear handoff path when automated suggestions are not enough.',
    points: [
      'Created a prompt-driven first response for common internal support requests.',
      'Included a “Need assistance” action so users can alert a human colleague.',
      'Focused on workflow clarity and useful escalation, rather than claiming to have trained or coded a custom model.'
    ]
  },
  tableau: {
    category: 'ANALYTICS · OPERATIONS', stage: 'Built prototype',
    title: 'Operations performance dashboard',
    description: 'Explored visualizing operational team performance with Tableau to make case handling and service quality easier to understand at a glance.',
    points: [
      'Designed KPI views for case volume, SLA adherence, first-response time and workload trends.',
      'Worked with tailored data queries, chart choices and reporting structure.',
      'Built a learning/prototype dashboard rather than presenting it as a fully deployed production analytics service.'
    ]
  },
  radar: {
    category: 'OPERATIONAL DESIGN', stage: 'Design concept',
    title: 'Escalation-risk radar',
    description: 'A concept for surfacing support cases with a higher risk of delays or missed follow-ups by looking at observable operational signals.',
    points: [
      'Considered stalled follow-ups, reopened cases and sentiment as candidate risk indicators.',
      'Structured a prioritization approach to help focus attention on exceptions.',
      'An operational design concept; not described here as a deployed predictive system.'
    ]
  },
  cicd: {
    category: 'LEARNING LAB · CI/CD', stage: 'In progress',
    title: 'CI/CD status-page project',
    description: 'A practical learning project that begins with a small HTML status dashboard and adds Python checks and GitHub Actions workflow automation.',
    points: [
      'Built the initial HTML dashboard and a Python unittest to verify expected content.',
      'Wrote GitHub Actions YAML to run the test on push; cloud-run verification and publishing are still being completed.',
      'Next milestone: finish deployment through GitHub Pages and validate release gating.'
    ]
  },
  aws: {
    category: 'LEARNING LAB · AWS', stage: 'Hands-on labs',
    title: 'AWS infrastructure exercises',
    description: 'Scenario-led practice to make cloud infrastructure concepts concrete, complementing operational monitoring experience.',
    points: [
      'Practised IAM permissions, EC2 instances, security groups and foundational cloud networking.',
      'Explored VPCs, public/private subnet routing, load balancers and related infrastructure behavior.',
      'These are personal learning labs, not claims of production AWS infrastructure ownership.'
    ]
  }
};

function initializeTheme() {
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('aryan-portfolio-theme'); } catch (_) { /* local file or privacy mode */ }
  if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;
  const button = $('#themeToggle');
  button?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('aryan-portfolio-theme', next); } catch (_) { /* graceful fallback */ }
    button.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });
  button?.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

function initializeNavigation() {
  const button = $('#menuToggle');
  const nav = $('#mobileNav');
  if (!button || !nav) return;
  const close = () => { nav.hidden = true; button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-label', 'Open menu'); };
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    nav.hidden = isOpen;
    button.setAttribute('aria-expanded', String(!isOpen));
    button.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  });
  $$('a', nav).forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', e => { if (!nav.hidden && !nav.contains(e.target) && !button.contains(e.target)) close(); });
}

function initializeProjectFilters() {
  const filters = $$('.filter-pill');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => { filter.classList.toggle('is-active', filter === button); filter.setAttribute('aria-pressed', String(filter === button)); });
    $$('.project-card').forEach(card => { card.hidden = category !== 'all' && !(card.dataset.category || '').split(' ').includes(category); });
  }));
}

function initializeProjectDialog() {
  const dialog = $('#projectDialog');
  if (!dialog) return;
  const close = () => dialog.close();
  $$('.project-open').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    $('#dialogCategory').textContent = project.category;
    $('#dialogTitle').textContent = project.title;
    $('#dialogDescription').textContent = project.description;
    $('#dialogStage').textContent = project.stage;
    const list = $('#dialogBullets');
    list.replaceChildren(...project.points.map(point => { const li = document.createElement('li'); li.textContent = point; return li; }));
    dialog.showModal();
  }));
  $('#dialogClose')?.addEventListener('click', close);
  $('#dialogDone')?.addEventListener('click', close);
  dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
}

function initializeDemo() {
  const trigger = $('#simulateAlert');
  const restore = $('#resetDemo');
  const badge = $('#healthBadge');
  const log = $('#consoleLog');
  const readout = $('#chartReadout');
  const line = $('#linePath');
  const area = $('#areaPath');
  if (!trigger || !restore) return;
  const healthyLine = 'M0 85L27 76L55 84L84 61L113 72L140 52L167 63L193 44L222 49L250 29L277 42L306 24L337 30L370 16';
  const degradedLine = 'M0 85L27 75L55 82L84 66L113 75L140 57L167 66L193 50L222 58L250 85L277 46L306 95L337 97L370 108';
  function setIncident(isActive) {
    badge.classList.toggle('degraded', isActive);
    badge.innerHTML = '<span></span>' + (isActive ? 'Degraded' : 'Healthy');
    $$('[data-service]').forEach(item => {
      const warning = isActive && item.dataset.service === 'sync';
      item.classList.toggle('warning', warning);
      item.innerHTML = '<span class="state-dot"></span> ' + (warning ? 'Investigating' : 'Operational');
    });
    log.textContent = isActive ? 'Alert raised: simulated data sync latency exceeded threshold.' : 'All simulated services are operating normally.';
    readout.textContent = isActive ? 'Elevated latency detected*' : '99.9% uptime*';
    readout.style.color = isActive ? '#ffad88' : '#c8f76e';
    const path = isActive ? degradedLine : healthyLine;
    line.setAttribute('d', path); area.setAttribute('d', path + 'V127H0Z');
    line.style.stroke = isActive ? '#ffad88' : '#c8f76e';
    trigger.disabled = isActive;
    restore.disabled = !isActive;
  }
  trigger.addEventListener('click', () => setIncident(true));
  restore.addEventListener('click', () => setIncident(false));
  setIncident(false);
}

function initializeScroll() {
  const bar = $('#scrollProgress');
  const links = $$('.desktop-nav a');
  const sections = $$('main section[id]');
  let scheduled = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
    const active = [...sections].reverse().find(section => section.getBoundingClientRect().top < window.innerHeight * .42);
    links.forEach(link => link.classList.toggle('active', active && link.getAttribute('href') === '#' + active.id));
    scheduled = false;
  };
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; window.requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initializeCounters() {
  const counters = $$('[data-counter]');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const goal = Number(element.dataset.counter);
      const suffix = element.dataset.suffix || '';
      const start = performance.now();
      const duration = 1100;
      function tick(time) {
        const ratio = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - ratio, 3);
        const value = Math.floor(goal * eased);
        element.textContent = (goal === 3 ? '~' : '') + value.toLocaleString('en-IN') + suffix;
        if (ratio < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  }, { threshold: .3 });
  counters.forEach(element => observer.observe(element));
}

initializeTheme();
initializeNavigation();
initializeProjectFilters();
initializeProjectDialog();
initializeDemo();
initializeScroll();
initializeCounters();
$('#currentYear').textContent = new Date().getFullYear();
