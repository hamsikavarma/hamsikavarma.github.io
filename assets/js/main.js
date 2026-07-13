// ==========================================================================
// Load Site Configuration (Meta Tags)
// ==========================================================================
async function loadSiteConfig() {
    try {
        const response = await fetch('data/site-config.json');
        const config = await response.json();

        // Update meta tags
        document.title = config.meta.title;
        document.querySelector('meta[name="description"]').setAttribute('content', config.meta.description);
        document.querySelector('meta[name="author"]').setAttribute('content', config.meta.author);
        document.querySelector('meta[name="keywords"]').setAttribute('content', config.meta.keywords);
    } catch (error) {
        console.error('Error loading site config:', error);
    }
}

// ==========================================================================
// Load Navigation
// ==========================================================================
async function loadNavigation() {
    try {
        const response = await fetch('data/navigation.json');
        const navData = await response.json();

        // Update brand name
        const navBrand = document.querySelector('.nav-brand a');
        if (navBrand) {
            navBrand.textContent = navData.brand.name;
            navBrand.setAttribute('href', navData.brand.href);
        }

        // Build navigation menu
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.innerHTML = '';
            navData.menuItems.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${item.href}" class="nav-link">${item.label}</a>`;
                navMenu.appendChild(li);
            });

            // Re-attach event listeners for smooth scroll and mobile menu close
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// ==========================================================================
// Load Hero Section
// ==========================================================================
async function loadHero() {
    try {
        const response = await fetch('data/hero.json');
        const hero = await response.json();

        // Update hero content
        const heroKicker = document.getElementById('heroKicker');
        const heroGreeting = document.getElementById('heroGreeting');
        const heroName = document.getElementById('heroName');
        const heroTitle = document.getElementById('heroTitle');
        const heroSummary = document.getElementById('heroSummary');
        const heroPhoto = document.getElementById('heroPhoto');

        if (heroKicker) heroKicker.textContent = hero.kicker || '';
        if (heroGreeting) heroGreeting.textContent = hero.greeting;
        if (heroName) heroName.textContent = hero.name;
        if (heroTitle) heroTitle.textContent = hero.title;
        if (heroSummary) heroSummary.innerHTML = hero.summary;
        if (heroPhoto && hero.avatarUrl) {
            heroPhoto.src = hero.avatarUrl;
            heroPhoto.alt = hero.name || 'Profile photo';
        }

        // Build highlights
        const highlightsContainer = document.getElementById('heroHighlights');
        if (highlightsContainer) {
            highlightsContainer.innerHTML = '';
            hero.highlights.forEach(highlight => {
                const div = document.createElement('div');
                div.className = 'highlight-item';
                div.innerHTML = `
                    <i class="${highlight.icon}"></i>
                    <span>${highlight.text}</span>
                `;
                highlightsContainer.appendChild(div);
            });
        }

        // Build CTA buttons
        const ctaContainer = document.getElementById('heroCTA');
        if (ctaContainer) {
            ctaContainer.innerHTML = '';
            hero.cta.buttons.forEach(button => {
                const a = document.createElement('a');
                a.href = button.href;
                a.className = `btn btn-${button.type}`;
                if (button.external) { a.target = '_blank'; a.rel = 'noopener'; }
                if (button.download) a.setAttribute('download', '');
                a.innerHTML = button.icon ? `<i class="${button.icon}"></i> ${button.text}` : button.text;
                ctaContainer.appendChild(a);
            });
        }

        // Build social links
        const socialContainer = document.getElementById('heroSocial');
        if (socialContainer) {
            socialContainer.innerHTML = '';
            hero.socialLinks.forEach(social => {
                const a = document.createElement('a');
                a.href = social.url;
                a.target = '_blank';
                a.setAttribute('aria-label', social.platform);
                a.innerHTML = `<i class="${social.icon}"></i>`;
                socialContainer.appendChild(a);
            });
        }
    } catch (error) {
        console.error('Error loading hero data:', error);
    }
}

// ==========================================================================
// Load About Section
// ==========================================================================
async function loadAbout() {
    try {
        const response = await fetch('data/about.json');
        const about = await response.json();

        // Update section title
        const sectionTitle = document.querySelector('#about .section-title');
        if (sectionTitle) sectionTitle.textContent = about.sectionTitle;

        // Build paragraphs
        const textContainer = document.getElementById('aboutText');
        if (textContainer) {
            textContainer.innerHTML = '';
            about.paragraphs.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                textContainer.appendChild(p);
            });
        }

        // Build statistics
        const statsContainer = document.getElementById('aboutStats');
        if (statsContainer) {
            statsContainer.innerHTML = '';
            about.statistics.forEach(stat => {
                const div = document.createElement('div');
                div.className = 'stat-item';
                const suffix = stat.suffix || '';
                const isNumeric = typeof stat.value === 'number';
                const numAttrs = isNumeric ? ` data-target="${stat.value}" data-suffix="${suffix}"` : '';
                const numText = isNumeric ? '0' + suffix : stat.value;
                div.innerHTML = `
                    <h3 class="stat-number"${numAttrs}>${numText}</h3>
                    <p>${stat.label}</p>
                `;
                statsContainer.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading about data:', error);
    }
}

// ==========================================================================
// Load Contact Section
// ==========================================================================
async function loadContact() {
    try {
        const response = await fetch('data/contact.json');
        const contact = await response.json();

        // Update section title
        const sectionTitle = document.querySelector('#contact .section-title');
        if (sectionTitle) sectionTitle.textContent = contact.sectionTitle;

        // Intro line
        const contactIntro = document.getElementById('contactIntro');
        if (contactIntro) contactIntro.textContent = contact.intro || '';

        // Build contact info
        const contactInfoContainer = document.getElementById('contactInfo');
        if (contactInfoContainer) {
            contactInfoContainer.innerHTML = '';
            contact.contactInfo.forEach(info => {
                const div = document.createElement('div');
                div.className = 'contact-item';

                const valueContent = info.href
                    ? `<a href="${info.href}">${info.value}</a>`
                    : `<p>${info.value}</p>`;

                div.innerHTML = `
                    <i class="${info.icon}"></i>
                    <div>
                        <h3>${info.label}</h3>
                        ${valueContent}
                    </div>
                `;
                contactInfoContainer.appendChild(div);
            });
        }

        // Build contact form
        const formContainer = document.getElementById('contactFormContainer');
        if (formContainer) {
            let formHTML = '<form class="contact-form" id="contactForm">';

            contact.form.fields.forEach(field => {
                formHTML += '<div class="form-group">';
                if (field.type === 'textarea') {
                    formHTML += `<textarea id="${field.id}" name="${field.id}" rows="${field.rows}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}></textarea>`;
                } else {
                    formHTML += `<input type="${field.type}" id="${field.id}" name="${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`;
                }
                formHTML += '</div>';
            });

            // Honeypot (bots fill hidden fields; humans never see it)
            formHTML += '<input type="text" name="_honey" class="form-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">';
            formHTML += `<button type="submit" class="btn btn-${contact.form.submitButton.type}">${contact.form.submitButton.text}</button>`;
            formHTML += '<p class="form-status" role="status" aria-live="polite"></p>';
            formHTML += '</form>';

            formContainer.innerHTML = formHTML;

            // Attach submit handler — POST to the configured endpoint (FormSubmit)
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                const statusEl = contactForm.querySelector('.form-status');
                const submitBtn = contactForm.querySelector('button[type="submit"]');

                contactForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    // Spam trap: if the honeypot is filled, silently drop.
                    if (contactForm.querySelector('[name="_honey"]').value) return;

                    const endpoint = contact.form.endpoint;
                    const setStatus = (msg, type) => {
                        statusEl.textContent = msg;
                        statusEl.className = 'form-status' + (type ? ' ' + type : '');
                    };

                    // No endpoint configured → keep the old friendly acknowledgement.
                    if (!endpoint) {
                        setStatus(contact.form.successMessage, 'success');
                        contactForm.reset();
                        return;
                    }

                    const payload = {};
                    new FormData(contactForm).forEach((v, k) => { payload[k] = v; });
                    delete payload._honey;
                    if (contact.form.subject) payload._subject = contact.form.subject;
                    payload._captcha = 'false';
                    payload._template = 'table';

                    const originalLabel = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Sending…';
                    setStatus('', '');

                    try {
                        const res = await fetch(endpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        if (!res.ok) throw new Error('HTTP ' + res.status);
                        setStatus(contact.form.successMessage, 'success');
                        contactForm.reset();
                    } catch (err) {
                        console.error('Contact form error:', err);
                        setStatus(contact.form.errorMessage || 'Something went wrong. Please try again.', 'error');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalLabel;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
}

// ==========================================================================
// Load Footer
// ==========================================================================
async function loadFooter() {
    try {
        const response = await fetch('data/footer.json');
        const footer = await response.json();

        // Build copyright text
        const copyrightContainer = document.getElementById('footerCopyright');
        if (copyrightContainer) {
            copyrightContainer.textContent = `© ${footer.copyright.year} ${footer.copyright.name}. ${footer.copyright.text}`;
        }

        // Build footer links
        const linksContainer = document.getElementById('footerLinks');
        if (linksContainer) {
            linksContainer.innerHTML = '';
            footer.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.textContent = link.text;
                linksContainer.appendChild(a);
            });
        }
    } catch (error) {
        console.error('Error loading footer data:', error);
    }
}

// ==========================================================================
// Navigation Toggle for Mobile
// ==========================================================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ==========================================================================
// Navbar Scroll Effect
// ==========================================================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================================================
// Smooth Scroll for Navigation Links
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================================================
// Load Experience Data
// ==========================================================================
async function loadExperience() {
    try {
        const response = await fetch('data/experience.json');
        const data = await response.json();

        // Update section title
        const sectionTitle = document.querySelector('#experience .section-title');
        if (sectionTitle) sectionTitle.textContent = data.sectionTitle;

        const timeline = document.getElementById('experienceTimeline');
        const experiences = data.experiences || data; // Support both new and old format

        (Array.isArray(experiences) ? experiences : [experiences]).forEach(exp => {
            // Skip instruction entries
            if (exp._instructions) return;

            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';

            const responsibilities = exp.responsibilities
                ? `<ul>${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>`
                : '';

            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-header">
                        <div class="timeline-heading">
                            ${exp.logo ? `<img class="org-logo" src="${exp.logo}" alt="${exp.company} logo" loading="lazy">` : ''}
                            <div>
                                <h3 class="timeline-title">${exp.title}</h3>
                                <p class="timeline-company">${exp.company}</p>
                            </div>
                        </div>
                        <span class="timeline-period">${exp.period}</span>
                    </div>
                    <div class="timeline-description">
                        <p>${exp.description}</p>
                        ${responsibilities}
                    </div>
                </div>
            `;
            timeline.appendChild(timelineItem);
        });
    } catch (error) {
        console.error('Error loading experience data:', error);
    }
}

// ==========================================================================
// Load Skills Data
// ==========================================================================
async function loadSkills() {
    try {
        const response = await fetch('data/skills.json');
        const data = await response.json();

        // Update section title
        const sectionTitle = document.querySelector('#skills .section-title');
        if (sectionTitle) sectionTitle.textContent = data.sectionTitle;

        const skillsGrid = document.getElementById('skillsGrid');
        const categories = data.categories || data; // Support both new and old format

        (Array.isArray(categories) ? categories : [categories]).forEach(category => {
            // Skip instruction entries
            if (category._instructions) return;

            const skillCategory = document.createElement('div');
            skillCategory.className = 'skill-category';

            const hasBars = category.skills.some(
                s => typeof s === 'object' && s !== null && 'level' in s
            );

            let body;
            if (hasBars) {
                skillCategory.classList.add('has-bars');
                body = `<div class="skill-bars">${category.skills
                    .map(skill => {
                        const name = typeof skill === 'object' ? skill.name : skill;
                        const level = typeof skill === 'object' ? (skill.level || 0) : 0;
                        return `
                        <div class="skill-bar">
                            <div class="skill-bar-head">
                                <span class="skill-bar-name">${name}</span>
                                <span class="skill-bar-pct">${level}%</span>
                            </div>
                            <div class="skill-bar-track">
                                <span class="skill-bar-fill" data-level="${level}"></span>
                            </div>
                        </div>`;
                    })
                    .join('')}</div>`;
            } else {
                body = `<div class="skill-list">${category.skills
                    .map(skill => `<span class="skill-tag">${typeof skill === 'object' ? skill.name : skill}</span>`)
                    .join('')}</div>`;
            }

            skillCategory.innerHTML = `
                <h3><i class="${category.icon}"></i> ${category.category}</h3>
                ${body}
            `;
            skillsGrid.appendChild(skillCategory);
        });
    } catch (error) {
        console.error('Error loading skills data:', error);
    }
}

// ==========================================================================
// Load Projects Data
// ==========================================================================
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();

        // Update section title
        const sectionTitle = document.querySelector('#projects .section-title');
        if (sectionTitle) sectionTitle.textContent = data.sectionTitle;

        const projectsGrid = document.getElementById('projectsGrid');
        const projects = data.projects || data; // Support both new and old format

        (Array.isArray(projects) ? projects : [projects]).forEach(project => {
            // Skip instruction entries
            if (project._instructions) return;

            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';

            const techBadges = project.technologies
                .map(tech => `<span class="tech-badge">${tech}</span>`)
                .join('');

            const links = [];
            if (project.github) {
                links.push(`<a href="${project.github}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> View Code
                </a>`);
            }
            if (project.demo) {
                links.push(`<a href="${project.demo}" target="_blank" class="project-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>`);
            }

            projectCard.innerHTML = `
                <div class="project-image">
                    ${project.image ? `<img class="project-thumb" src="${project.image}" alt="${project.title}" loading="lazy">` : ''}
                    <div class="project-image-overlay">
                        <i class="${project.icon || 'fas fa-code'}"></i>
                        ${project.category ? `<span class="project-category">${project.category}</span>` : ''}
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${techBadges}
                    </div>
                    <div class="project-links">
                        ${links.join('')}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects data:', error);
    }
}

// ==========================================================================
// Load Education Data
// ==========================================================================
async function loadEducation() {
    try {
        const response = await fetch('data/education.json');
        const data = await response.json();

        // Update section title
        const sectionTitle = document.querySelector('#education .section-title');
        if (sectionTitle) sectionTitle.textContent = data.sectionTitle;

        // Certifications — hide the whole block when there are none
        const certBlock = document.querySelector('#education .certifications');
        const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
        if (certBlock) certBlock.style.display = hasCerts ? '' : 'none';

        const certTitle = document.querySelector('#education .certifications h3');
        if (certTitle) certTitle.textContent = data.certificationsTitle || 'Certifications';

        const educationGrid = document.getElementById('educationGrid');
        const certGrid = document.getElementById('certGrid');

        // Load education items
        data.education.forEach(edu => {
            // Skip instruction entries
            if (edu._instructions) return;

            const eduItem = document.createElement('div');
            eduItem.className = 'education-item';

            eduItem.innerHTML = `
                <div class="education-header">
                    <div class="education-heading">
                        ${edu.logo ? `<img class="org-logo" src="${edu.logo}" alt="${edu.school} logo" loading="lazy">` : ''}
                        <div>
                            <h3 class="education-degree">${edu.degree}</h3>
                            <p class="education-school">${edu.school}</p>
                        </div>
                    </div>
                    <span class="education-period">${edu.period}</span>
                </div>
                ${edu.details ? `<p class="timeline-description">${edu.details}</p>` : ''}
            `;
            educationGrid.appendChild(eduItem);
        });

        // Load certifications
        data.certifications.forEach(cert => {
            const certItem = document.createElement('div');
            certItem.className = 'cert-item';
            certItem.innerHTML = `
                <strong>${cert.name}</strong>
                ${cert.issuer ? `<p style="font-size: 0.875rem; margin-top: 0.25rem; opacity: 0.8;">${cert.issuer}</p>` : ''}
            `;
            certGrid.appendChild(certItem);
        });
    } catch (error) {
        console.error('Error loading education data:', error);
    }
}

// ==========================================================================
// Contact Form Handler (Now handled in loadContact())
// ==========================================================================
// Form handler is now attached dynamically in loadContact() function

// ==========================================================================
// Scroll Reveal Animation
// ==========================================================================
function revealOnScroll() {
    const elements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .education-item, .stat-item');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize elements for scroll animation
function initScrollAnimation() {
    const elements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .education-item, .stat-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

window.addEventListener('scroll', revealOnScroll);

// ==========================================================================
// Animated Stat Counters (count up when scrolled into view)
// ==========================================================================
function animateCounters() {
    const nums = document.querySelectorAll('.stat-number[data-target]');
    if (!nums.length || !('IntersectionObserver' in window)) {
        nums.forEach(el => {
            el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
        });
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-target')) || 0;
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1400;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = target + suffix;
            }
            requestAnimationFrame(tick);
            obs.unobserve(el);
        });
    }, { threshold: 0.4 });
    nums.forEach(n => observer.observe(n));
}

// ==========================================================================
// Animated Skill Proficiency Bars (fill when scrolled into view)
// ==========================================================================
function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill[data-level]');
    if (!fills.length) return;
    if (!('IntersectionObserver' in window)) {
        fills.forEach(el => { el.style.width = (parseFloat(el.getAttribute('data-level')) || 0) + '%'; });
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const level = parseFloat(el.getAttribute('data-level')) || 0;
            requestAnimationFrame(() => { el.style.width = level + '%'; });
            obs.unobserve(el);
        });
    }, { threshold: 0.3 });
    fills.forEach(f => observer.observe(f));
}

// ==========================================================================
// Initialize Everything When DOM is Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load all content from JSON files
    await loadSiteConfig();
    await loadNavigation();
    await loadHero();
    await loadAbout();
    await loadExperience();
    await loadSkills();
    await loadProjects();
    await loadEducation();
    await loadContact();
    await loadFooter();

    // Small delay to ensure elements are rendered before animation
    setTimeout(() => {
        initScrollAnimation();
        revealOnScroll();
        animateCounters();
        animateSkillBars();
    }, 100);
});

// ==========================================================================
// Active Navigation Link Highlight
// ==========================================================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
});
