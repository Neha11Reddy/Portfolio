/* ============================================================
   NEHA ANNAPUREDDY — Portfolio Script
   Features: AOS, Typewriter, Counters, Dark Mode, Radar Chart,
             Progress Bars, Project Filter, Testimonials, Back-to-Top,
             Cursor Glow, Loading Screen, EmailJS Contact Form
   ============================================================ */

/* ---------- Loading Screen ---------- */
(function initLoader() {
    const loader    = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');

    if (!loader) return;

    // Lock body scroll during load
    document.body.classList.add('loading');

    // Start bar animation shortly after paint
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            loaderBar.style.width = '100%';
        });
    });

    // Fade out after 1.2s
    setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('loading');

        // Remove from DOM after transition ends
        loader.addEventListener('transitionend', () => {
            loader.style.display = 'none';
        }, { once: true });
    }, 1200);
})();

/* ---------- Dark Mode ---------- */
const htmlEl      = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    // Update chart colors when theme changes
    if (window.skillsRadarChart) {
        updateChartTheme();
        skillsRadarChart.update();
    }
}

// Read saved preference on load
(function loadTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    applyTheme(saved);
})();

themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
});

/* ---------- AOS Init ---------- */
AOS.init({
    duration: 700,
    once: true,
    easing: 'ease-out-cubic',
    offset: 60,
});

/* ---------- Scroll Progress Bar ---------- */
const scrollProgressEl = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressEl.style.width = pct + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ---------- Navbar Scroll ---------- */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ---------- Mobile Menu ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

/* ---------- Active Nav Link on Scroll ---------- */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
        const top    = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-link[href="#${id}"]`);

        if (link) {
            if (scrollY >= top && scrollY < bottom) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ---------- Typewriter Effect ---------- */
const roles = [
    'Data Analyst',
    'BI Developer',
    'Analytics Engineer',
    'ML Practitioner',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const roleEl   = document.getElementById('heroRole');

function typeRole() {
    if (!roleEl) return;

    const current = roles[roleIndex];

    if (isDeleting) {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
    } else {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        delay = 300;
    }

    setTimeout(typeRole, delay);
}

setTimeout(typeRole, 1400); // start after loader fades

/* ---------- Counter Animation ---------- */
function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current);
    }, 16);
}

const counterEls = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

/* ---------- Skills Radar Chart ---------- */
function getChartColors() {
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';
    return {
        gridColor:   isDark ? 'rgba(245,232,230,0.1)'  : 'rgba(42,26,23,0.08)',
        tickColor:   isDark ? '#C4A0A0'                : '#8C6560',
        labelColor:  isDark ? '#F5E8E6'                : '#2A1A17',
        pointLabel:  isDark ? '#C4A0A0'                : '#8C6560',
    };
}

function buildRadarConfig() {
    const c = getChartColors();
    return {
        type: 'radar',
        data: {
            labels: [
                'Python & SQL',
                'Data Visualization',
                'Machine Learning',
                'Cloud & Big Data',
                'ETL Pipelines',
                'Statistical Analysis'
            ],
            datasets: [{
                label: 'Skill Level',
                data: [92, 88, 82, 80, 85, 84],
                borderColor: '#C9818A',
                backgroundColor: 'rgba(201,129,138,0.15)',
                borderWidth: 2,
                pointBackgroundColor: '#C9818A',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(201,129,138,0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: ctx => ` ${ctx.raw}%`
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        color: c.tickColor,
                        backdropColor: 'transparent',
                        font: { size: 10, family: "'DM Sans', sans-serif" }
                    },
                    grid:     { color: c.gridColor },
                    angleLines: { color: c.gridColor },
                    pointLabels: {
                        color: c.pointLabel,
                        font: { size: 12, family: "'DM Sans', sans-serif", weight: '500' }
                    }
                }
            }
        }
    };
}

window.skillsRadarChart = null;

function updateChartTheme() {
    if (!skillsRadarChart) return;
    const c = getChartColors();
    const r = skillsRadarChart.options.scales.r;
    r.ticks.color        = c.tickColor;
    r.grid.color         = c.gridColor;
    r.angleLines.color   = c.gridColor;
    r.pointLabels.color  = c.pointLabel;
}

const radarCanvas = document.getElementById('skillsRadar');
if (radarCanvas) {
    window.skillsRadarChart = new Chart(radarCanvas, buildRadarConfig());
}

/* ---------- Progress Bars (animate on scroll) ---------- */
const skillBarsSection = document.getElementById('skillBars');

const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
                if (!fill.dataset.animated) {
                    fill.dataset.animated = 'true';
                    const targetW = fill.dataset.width;
                    // Slight delay for stagger effect
                    setTimeout(() => {
                        fill.style.width = targetW + '%';
                    }, 80);
                }
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (skillBarsSection) {
    barObserver.observe(skillBarsSection);
}

/* ---------- Project Filter Tabs ---------- */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            const cat = card.dataset.cat;
            if (filter === 'all' || cat === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ---------- Back To Top Button ---------- */
const backToTop = document.getElementById('backToTop');

function handleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
}

window.addEventListener('scroll', handleBackToTop, { passive: true });
handleBackToTop();

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Cursor Glow (fine pointer / desktop only) ---------- */
(function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    // Only activate on devices with fine pointer (mouse, not touch)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) {
        glow.style.display = 'none';
        return;
    }

    let glowVisible = false;

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';

        if (!glowVisible) {
            glow.style.opacity = '1';
            glowVisible = true;
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
        glowVisible = false;
    });
})();

/* ---------- EmailJS Contact Form ---------- */
/*
   HOW TO SET UP EMAILJS (FREE):
   1. Visit https://www.emailjs.com and sign up for a free account
   2. Add an Email Service (Gmail / Outlook / etc.) — copy the SERVICE ID
   3. Create an Email Template with variables:
        {{from_name}}, {{reply_to}}, {{subject}}, {{message}}
      Copy the TEMPLATE ID
   4. Go to Account > API Keys — copy your PUBLIC KEY
   5. In index.html, replace "YOUR_PUBLIC_KEY" in emailjs.init(...)
   6. Replace "YOUR_SERVICE_ID" and "YOUR_TEMPLATE_ID" below
*/

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

if (contactForm) {
    contactForm.addEventListener('submit', () => {
        const submitBtn    = contactForm.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
        submitBtn.disabled  = true;
        formSuccess.style.display = 'none';
        formError.style.display   = 'none';

        // Form submits natively to Google Forms via the hidden iframe target.
        // Show success UI after a short delay.
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled  = false;
            contactForm.reset();
            formSuccess.style.display = 'block';
            setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
        }, 1000);
    });
}

/* ---------- Copy Email Button ---------- */
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyIcon     = document.getElementById('copyIcon');

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('annapureddy.neha@gmail.com').then(() => {
            copyEmailBtn.classList.add('copied');
            copyIcon.classList.replace('fa-copy', 'fa-check');
            copyEmailBtn.title = 'Copied!';

            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                copyIcon.classList.replace('fa-check', 'fa-copy');
                copyEmailBtn.title = 'Copy to clipboard';
            }, 2500);
        });
    });
}

/* ---------- Smooth Scroll for all anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return; // Let download/placeholder links pass
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = navbar.offsetHeight + 16;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
