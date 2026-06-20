/* ==========================================================================
   AURALIS GRAND FOREST RESERVE — CINEMATIC LUXURY INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. TIME OF DAY SANCTUARY SYSTEM
    // ==========================================
    const htmlEl = document.documentElement;
    const timeDayBtn = document.getElementById('timeDayBtn');
    const timeSunsetBtn = document.getElementById('timeSunsetBtn');
    const timeNightBtn = document.getElementById('timeNightBtn');
    let timeOverride = false;

    function getSanctuaryTimeState(hour) {
        if (hour >= 6 && hour < 17) {
            return 'day';
        } else if (hour >= 17 && hour < 20) {
            return 'sunset';
        } else {
            return 'night';
        }
    }

    function applySanctuaryTime(timeState) {
        htmlEl.setAttribute('data-time', timeState);
        
        // Update active preview button states
        [timeDayBtn, timeSunsetBtn, timeNightBtn].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        
        if (timeState === 'day' && timeDayBtn) timeDayBtn.classList.add('active');
        if (timeState === 'sunset' && timeSunsetBtn) timeSunsetBtn.classList.add('active');
        if (timeState === 'night' && timeNightBtn) timeNightBtn.classList.add('active');

        // Trigger particle color update after theme switch delay
        setTimeout(() => {
            particleColor = getParticleColor();
            updateParticleParameters(timeState);
        }, 300);
    }

    // Auto-detect time of day
    function initializeAutoTime() {
        if (!timeOverride) {
            const currentHour = new Date().getHours();
            const timeState = getSanctuaryTimeState(currentHour);
            applySanctuaryTime(timeState);
        }
    }

    // Manual Time override click event listeners
    if (timeDayBtn) {
        timeDayBtn.addEventListener('click', () => {
            timeOverride = true;
            applySanctuaryTime('day');
        });
    }
    if (timeSunsetBtn) {
        timeSunsetBtn.addEventListener('click', () => {
            timeOverride = true;
            applySanctuaryTime('sunset');
        });
    }
    if (timeNightBtn) {
        timeNightBtn.addEventListener('click', () => {
            timeOverride = true;
            applySanctuaryTime('night');
        });
    }

    // Initialize auto time
    initializeAutoTime();


    // ==========================================
    // 2. FLOATING PARTICLES & NIGHT FIREFLIES
    // ==========================================
    const particleCanvas = document.getElementById('particleCanvas');
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let particleColor = getParticleColor();
    let particleSettings = {
        count: 60,
        speedMinX: -0.08,
        speedMaxX: 0.08,
        speedMinY: -0.15,
        speedMaxY: -0.02,
        minSize: 0.3,
        maxSize: 2.2,
        type: 'dust' // dust | firefly
    };

    function getParticleColor() {
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue('--particle-color').trim() || '245, 238, 226';
    }

    function updateParticleParameters(timeState) {
        if (timeState === 'night') {
            particleSettings = {
                count: 50,
                speedMinX: -0.15,
                speedMaxX: 0.15,
                speedMinY: -0.18,
                speedMaxY: 0.05,
                minSize: 0.8,
                maxSize: 3.5,
                type: 'firefly'
            };
        } else {
            // Day or Sunset dust particles
            particleSettings = {
                count: 70,
                speedMinX: -0.05,
                speedMaxX: 0.05,
                speedMinY: -0.12,
                speedMaxY: -0.01,
                minSize: 0.3,
                maxSize: 2.0,
                type: 'dust'
            };
        }
        createParticles();
    }

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(particleSettings.count, Math.floor((window.innerWidth * window.innerHeight) / 18000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                size: Math.random() * (particleSettings.maxSize - particleSettings.minSize) + particleSettings.minSize,
                speedX: Math.random() * (particleSettings.speedMaxX - particleSettings.speedMinX) + particleSettings.speedMinX,
                speedY: Math.random() * (particleSettings.speedMaxY - particleSettings.speedMinY) + particleSettings.speedMinY,
                opacity: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.008 + 0.003,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: (Math.random() - 0.5) * 0.02 // Firefly sinusoidal float speed
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        particles.forEach(p => {
            p.pulse += p.pulseSpeed;

            // Movement logic
            if (particleSettings.type === 'firefly') {
                p.angle += p.angleSpeed;
                p.x += p.speedX + Math.sin(p.angle) * 0.15;
                p.y += p.speedY + Math.cos(p.angle) * 0.1;
            } else {
                p.x += p.speedX;
                p.y += p.speedY;
            }

            // Screen boundary check
            if (p.x < -10) p.x = particleCanvas.width + 10;
            if (p.x > particleCanvas.width + 10) p.x = -10;
            if (p.y < -10) {
                p.y = particleCanvas.height + 10;
                p.x = Math.random() * particleCanvas.width;
            }
            if (p.y > particleCanvas.height + 10) {
                p.y = -10;
                p.x = Math.random() * particleCanvas.width;
            }

            // Calculate opacity with pulse
            const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

            if (particleSettings.type === 'firefly') {
                // Fireflies have a warm glowing green-gold aura
                const glowGradients = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
                glowGradients.addColorStop(0, `rgba(180, 215, 107, ${currentOpacity * 1.5})`);
                glowGradients.addColorStop(0.3, `rgba(215, 180, 107, ${currentOpacity * 0.8})`);
                glowGradients.addColorStop(1, 'rgba(215, 180, 107, 0)');
                ctx.fillStyle = glowGradients;
                ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
            } else {
                // Dust particles are sharp gold dust
                ctx.fillStyle = `rgba(${particleColor}, ${currentOpacity})`;
            }
            
            ctx.fill();
        });

        requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    updateParticleParameters(htmlEl.getAttribute('data-time') || 'day');
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });


    // ==========================================
    // 3. CURSOR REACTION BACKDROP LIGHT
    // ==========================================
    const mouseState = { x: 0, y: 0, targetX: 0, targetY: 0 };

    document.addEventListener('mousemove', (e) => {
        mouseState.targetX = e.clientX;
        mouseState.targetY = e.clientY;
    });

    function updateMouseSmooth() {
        mouseState.x += (mouseState.targetX - mouseState.x) * 0.08;
        mouseState.y += (mouseState.targetY - mouseState.y) * 0.08;
        requestAnimationFrame(updateMouseSmooth);
    }
    updateMouseSmooth();

    const bgGlow = document.getElementById('bgGlow');
    function updateBgGlow() {
        if (bgGlow) {
            const nx = mouseState.x / window.innerWidth;
            const ny = mouseState.y / window.innerHeight;
            const style = getComputedStyle(document.documentElement);
            const g1 = style.getPropertyValue('--glow-color-1').trim() || 'rgba(176,122,69,0.06)';
            const g2 = style.getPropertyValue('--glow-color-2').trim() || 'rgba(136,155,105,0.04)';

            bgGlow.style.background = `
                radial-gradient(circle 550px at ${nx * 100}% ${ny * 100}%, ${g1} 0%, transparent 60%),
                radial-gradient(circle 450px at ${(1 - nx) * 100}% ${(1 - ny) * 100}%, ${g2} 0%, transparent 50%)
            `;
        }
        requestAnimationFrame(updateBgGlow);
    }
    updateBgGlow();


    // ==========================================
    // 4. 3D CARD TILT & REFLECTION SYSTEM
    // ==========================================
    function setupCardTilt(card, shineEl) {
        let bounds;

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', (e) => {
            if (!bounds) bounds = card.getBoundingClientRect();

            const offsetX = e.clientX - bounds.left;
            const offsetY = e.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            // Rotations values capped at 3.5 degrees max
            const rotateX = ((offsetY - centerY) / centerY) * -3.5;
            const rotateY = ((offsetX - centerX) / centerX) * 3.5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

            if (shineEl) {
                shineEl.style.left = `${offsetX}px`;
                shineEl.style.top = `${offsetY}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            bounds = null;
        });
    }

    // Bind cards and interactive elements
    const heroCard = document.getElementById('heroCard');
    const heroCardShine = document.getElementById('heroCardShine');
    if (heroCard && heroCardShine) setupCardTilt(heroCard, heroCardShine);

    const storyFrame = document.getElementById('storyFrame');
    const storyShine = storyFrame?.querySelector('.story-image-shine');
    if (storyFrame && storyShine) setupCardTilt(storyFrame, storyShine);

    const reservationCard = document.getElementById('reservationCard');
    const reservationShine = reservationCard?.querySelector('.reservation-card-shine');
    if (reservationCard && reservationShine) setupCardTilt(reservationCard, reservationShine);

    document.querySelectorAll('.col-card').forEach(card => {
        setupCardTilt(card, card.querySelector('.col-card-shine'));
    });

    document.querySelectorAll('.dining-card').forEach(card => {
        setupCardTilt(card, card.querySelector('.dining-card-shine'));
    });

    // Parallax on hero image wrapper relative to cursor coordinates
    const heroImageWrapper = document.getElementById('heroImageWrapper');
    if (heroImageWrapper) {
        document.addEventListener('mousemove', (e) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            heroImageWrapper.style.transform = `perspective(1000px) rotateX(${ny * -2.5}deg) rotateY(${nx * 3.5}deg)`;
        });
    }


    // ==========================================
    // 5. STICKY NAVIGATION SCROLL EFFECTS
    // ==========================================
    const nav = document.getElementById('mainNav');
    const scrollHint = document.getElementById('scrollHint');
    let ticking = false;

    function onScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        if (scrollHint) {
            scrollHint.style.opacity = Math.max(0, 0.6 - scrollY / 300);
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });


    // ==========================================
    // 6. SCROLL REVEAL ENGINE
    // ==========================================
    const revealElements = [];

    const elementsToReveal = [
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.col-card'),
        ...document.querySelectorAll('.experience-item'),
        ...document.querySelectorAll('.story-visual'),
        ...document.querySelectorAll('.story-content'),
        ...document.querySelectorAll('.wellness-visual'),
        ...document.querySelectorAll('.wellness-content'),
        ...document.querySelectorAll('.menu-categories'),
        ...document.querySelectorAll('.dining-card'),
        ...document.querySelectorAll('.reservation-content'),
        ...document.querySelectorAll('.reservation-form-wrapper'),
        ...document.querySelectorAll('.cinematic-divider'),
    ];

    elementsToReveal.forEach((el, idx) => {
        el.classList.add('reveal');
        el.style.setProperty('--i', idx % 6);
        revealElements.push(el);
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rect = entry.target.getBoundingClientRect();
                const col = Math.floor(rect.left / 400);
                const delay = col * 80;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Math.min(delay, 300));

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // 7. STORY STATS ANIMATED COUNTERS
    // ==========================================
    const statsList = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function runCounters() {
        statsList.forEach(stat => {
            const countTo = parseInt(stat.getAttribute('data-count'), 10);
            const suffix = stat.getAttribute('data-suffix') || '+';
            let start = 0;
            const duration = 2000; // 2s duration
            const increment = countTo / (duration / 16); // ~60fps

            const updateCount = () => {
                start += increment;
                if (start < countTo) {
                    if (countTo >= 1000) {
                        stat.textContent = Math.floor(start / 1000) + suffix;
                    } else {
                        stat.textContent = Math.floor(start) + '+';
                    }
                    requestAnimationFrame(updateCount);
                } else {
                    if (countTo >= 1000) {
                        stat.textContent = (countTo / 1000) + suffix;
                    } else {
                        stat.textContent = countTo + '+';
                    }
                }
            };
            updateCount();
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                runCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const statsGrid = document.querySelector('.story-stats');
    if (statsGrid) statsObserver.observe(statsGrid);


    // ==========================================
    // 8. DINING DESTINATIONS CATEGORY FILTER
    // ==========================================
    const diningButtons = document.querySelectorAll('.menu-cat-btn');
    const diningCards = document.querySelectorAll('.dining-card');

    diningButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diningButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;

            let showIndex = 0;
            diningCards.forEach(card => {
                const isMatch = card.dataset.category === category;
                
                if (isMatch) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(25px)';
                    const idx = showIndex++;
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, idx * 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => card.classList.add('hidden'), 250);
                }
            });
        });
    });


    // ==========================================
    // 9. RESERVATION EXPERIENCE SUBMIT
    // ==========================================
    const reservationForm = document.getElementById('reservationForm');
    const submitBtn = document.getElementById('submitReservation');

    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            // Success state morph animation
            btnText.textContent = 'Sanctuary Reserved ✓';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.classList.add('success-state');

            // Set glow pulses and feedback
            submitBtn.style.boxShadow = '0 0 30px rgba(180, 215, 107, 0.8)';

            setTimeout(() => {
                btnText.textContent = originalText;
                submitBtn.style.pointerEvents = '';
                submitBtn.classList.remove('success-state');
                submitBtn.style.boxShadow = '';
                reservationForm.reset();
            }, 4000);
        });
    }


    // ==========================================
    // 10. ATMOSPHERIC SHAFTS OF LIGHT ANIMATION
    // ==========================================
    const sunrays = document.querySelectorAll('.sunray');
    let time = 0;

    function animateSunrays() {
        time += 0.004;
        sunrays.forEach((ray, i) => {
            const baseRotations = [-10, 2, 8, -5][i] || 0;
            const sway = Math.sin(time + i * 1.6) * 1.8;
            const scrollOffset = window.scrollY * (0.02 + i * 0.007);
            
            ray.style.transform = `rotate(${baseRotations + sway}deg) translateY(${scrollOffset}px)`;
        });
        requestAnimationFrame(animateSunrays);
    }
    animateSunrays();


    // ==========================================
    // 11. ATMOSPHERE THEME CONTROL PANEL
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const themePanel = document.getElementById('themePanel');
    const themeOptions = document.querySelectorAll('.theme-option');
    let panelOpen = false;

    // Open/Close atmosphere selector panel
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panelOpen = !panelOpen;
        themePanel.classList.toggle('open', panelOpen);
    });

    document.addEventListener('click', (e) => {
        if (panelOpen && !themePanel.contains(e.target) && e.target !== themeToggle) {
            panelOpen = false;
            themePanel.classList.remove('open');
        }
    });

    // Theme Selector Buttons
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;

            if (htmlEl.getAttribute('data-theme') === theme) return;

            themeOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            htmlEl.setAttribute('data-theme', theme);

            // Update particle color variable after transitions
            setTimeout(() => {
                particleColor = getParticleColor();
            }, 300);

            // Store choice
            try { localStorage.setItem('auralis-hotel-theme', theme); } catch (err) {}
        });
    });

    // Restore saved settings
    try {
        const savedTheme = localStorage.getItem('auralis-hotel-theme');
        if (savedTheme && savedTheme !== 'forest') {
            htmlEl.setAttribute('data-theme', savedTheme);
            themeOptions.forEach(o => {
                o.classList.toggle('active', o.dataset.theme === savedTheme);
            });
            setTimeout(() => {
                particleColor = getParticleColor();
            }, 300);
        }
    } catch (err) {}


    // ==========================================
    // 12. LUXURY PAGE ENTRANCE & IMAGE FADING
    // ==========================================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.8s ease';
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });
        });

        // Trigger loaded transition if cached
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // ==========================================
    // 13. MOBILE NAVIGATION DRAWER SYSTEM
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link, .mobile-menu-cta');
    const bodyEl = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu on overlay background click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });

        // Close mobile menu when a link inside it is clicked
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        function openMobileMenu() {
            menuToggle.classList.add('active');
            mobileMenu.classList.add('open');
            bodyEl.classList.add('mobile-menu-active');
        }

        function closeMobileMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            bodyEl.classList.remove('mobile-menu-active');
        }
    }

    console.log('%c🌿 AURALIS GRAND FOREST RESERVE — Welcome to the Sanctuary', 'color: #889B69; font-size: 14px; font-family: serif; font-weight: bold;');
    console.log('%cA living dimension of luxury, architecture, and wilderness.', 'color: #B07A45; font-size: 11px; font-family: serif;');
});
