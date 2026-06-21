/* ==========================================================================
   AURALIS GRAND FOREST RESERVE — CINEMATIC LUXURY INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("AURALIS SCRIPT VERSION 4 ACTIVE");

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

    // ==========================================
    // 14. CINEMATIC PORTAL ENGINE DATA & TEMPLATES
    // ==========================================
    const residenceData = {
        '1': {
            title: 'Forest Canopy Villa',
            coords: 'COORDS: 47.3820° N, 12.1804° E',
            altitude: 'ALTITUDE: 1,240M',
            badge: 'THE CANOPY COLLECTION',
            subtitle: 'An Architectural Sanctuary Elevated High Above Ancient Pine Forests',
            narrative: 'Suspended twelve meters above the woodland floor, the Forest Canopy Villa is a glass-enclosed masterpiece. Anchored to centuries-old redwoods, its floor-to-ceiling panoramic glass windows erase the boundary between luxurious interior warmth and the wild canopy. Experience private morning mist drifts, thermal hearth comfort, and absolute pine sanctuary silence.',
            specs: [
                { label: 'Guests', value: '2-3 Adults' },
                { label: 'Size', value: '120 m² Canopy Suite' },
                { label: 'Thermal', value: 'Volcanic Bronze Hearth' },
                { label: 'View', value: 'Ancient Valley & Canopies' }
            ],
            sound: 'forest',
            back: 'images/suite_forest.png',
            mid: 'images/hero_forest_villa.png',
            front: 'images/spa_sanctuary.png',
            atmospheric: 'images/hero_sanctuary.png'
        },
        '2': {
            title: 'Emerald Pool Residence',
            coords: 'COORDS: 47.3812° N, 12.1820° E',
            altitude: 'ALTITUDE: 1,180M',
            badge: 'THE WATER COLLECTION',
            subtitle: 'An Indoor-Outdoor Thermal Spring Pavilion Embedded in Volcanic Stone',
            narrative: 'Designed around a private, geothermally heated spring, the Emerald Pool Residence offers a deep wellness sanctuary. The pool flows seamlessly from the glass-walled living room out to a secluded stone garden terrace, enclosed by volcanic river rocks and wild botanical ferns. Immerse yourself in mineral-rich hot waters and absolute volcanic tranquility.',
            specs: [
                { label: 'Guests', value: '2-4 Adults' },
                { label: 'Size', value: '150 m² Stone Pavilion' },
                { label: 'Thermal', value: 'Natural Spring Hot Pool' },
                { label: 'View', value: 'Volcanic Gardens & River' }
            ],
            sound: 'water',
            back: 'images/suite_emerald.png',
            mid: 'images/dining_artistry.png',
            front: 'images/founders_story.jpg',
            atmospheric: 'images/luxury_lobby.jpg'
        },
        '3': {
            title: 'Moonlight Pavilion',
            coords: 'COORDS: 47.3835° N, 12.1790° E',
            altitude: 'ALTITUDE: 1,310M',
            badge: 'THE SKYLINE COLLECTION',
            subtitle: 'A Geodesic Glass Dome Built For Stargazing and Celestial Meditation',
            narrative: 'Perched on the highest ridge of the reserve, the Moonlight Pavilion features a double-reinforced astronomical glass dome. Observe the pristine mountain night skies from the absolute warmth of your botanical suite. At sunset, the pavilion is bathed in soft amber glows, which slowly transition to cool silver moon rays and flickering starlight.',
            specs: [
                { label: 'Guests', value: '2 Adults' },
                { label: 'Size', value: '110 m² Dome Suite' },
                { label: 'Thermal', value: 'Heated Skyline Observatory' },
                { label: 'View', value: 'Celestial Heavens & Peaks' }
            ],
            sound: 'space',
            back: 'images/suite_skyline.png',
            mid: 'images/hero_forest_villa.png',
            front: 'images/founders_story.jpg',
            atmospheric: 'images/luxury_lobby.jpg'
        }
    };

    function getResidenceData(cardId, cardTitle, cardDesc, cardSpecs, cardImg) {
        if (residenceData[cardId]) {
            return residenceData[cardId];
        }
        
        // Default template for cards 4-9
        return {
            title: cardTitle || 'Luxury Reserve Retreat',
            coords: `COORDS: 47.38${cardId}0° N, 12.18${cardId}4° E`,
            altitude: 'ALTITUDE: 1,220M',
            badge: 'THE RESERVE SUITE COLLECTION',
            subtitle: 'A Secluded Luxury Retreat Harmonizing With The Wilderness',
            narrative: (cardDesc || 'A handcrafted luxury retreat design') + ' Handcrafted with premium local stone, volcanic river beds, and timber hearth details, this residence is designed to align precisely with the shift of daylight and shadows. Relax in spacious, premium glass chambers, offering butler hosting service, volcanic gardens, and absolute wilderness sanctuary silence.',
            specs: [
                { label: 'Guests', value: '2-4 Guests' },
                { label: 'Size', value: '130 m² Estate' },
                { label: 'Thermal', value: 'Woodland Stone Hearth' },
                { label: 'View', value: 'Secluded Forest Clearing' }
            ],
            sound: 'luxury',
            back: cardImg || 'images/hero_forest_villa.png',
            mid: 'images/suite_forest.png',
            front: 'images/spa_sanctuary.png',
            atmospheric: 'images/hero_sanctuary.png'
        };
    }

    // ==========================================
    // 15. PORTAL INTERACTION MECHANICS & ANIMATIONS
    // ==========================================
    const colCards = document.querySelectorAll('.col-card');
    const portalOverlay = document.getElementById('portalOverlay');
    const portalEnv = document.getElementById('portalEnv');
    const portalCloseBtn = document.getElementById('portalCloseBtn');
    const portalTitle = document.getElementById('portalTitle');
    const portalSubtitle = document.getElementById('portalSubtitle');
    const portalNarrative = document.getElementById('portalNarrative');
    const portalSpecs = document.getElementById('portalSpecs');
    const portalCoords = document.getElementById('portalCoords');
    const portalAltitude = document.getElementById('portalAltitude');
    const portalBadge = document.getElementById('portalBadge');
    const portalVolumetricGlow = document.getElementById('portalVolumetricGlow');
    const hudActionSound = document.getElementById('hudActionSound');

    // Parallax layers
    const layerBack = document.getElementById('portalLayerBack');
    const layerMid = document.getElementById('portalLayerMid');
    const layerFront = document.getElementById('portalLayerFront');
    const layerAtmospheric = document.getElementById('portalLayerAtmospheric');

    let portalActive = false;
    let particleLoopId = null;
    let typewriterTimeout = null;
    let soundActive = false;
    let soundType = '';
    let originalCardBounds = null;
    let originalImgBounds = null;
    let originalBorderRadius = '28px';
    let activeCardId = null;

    // Mouse coordinates for parallax
    const parallaxOffset = { x: 0, y: 0, targetX: 0, targetY: 0 };

    colCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            if (portalActive) return;

            const cardId = card.getAttribute('data-card') || '1';
            const cardImg = card.querySelector('.col-card-img')?.src || '';
            const cardTitle = card.querySelector('.col-card-title')?.textContent || '';
            const cardDesc = card.querySelector('.col-card-desc')?.textContent || '';
            const cardSpecsText = card.querySelector('.col-card-specs')?.textContent || '';
            
            triggerPortalTransition(card, cardId, cardTitle, cardDesc, cardSpecsText, cardImg);
        });
    });

    portalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exitPortalTransition();
    });

    hudActionSound.addEventListener('click', () => {
        soundActive = !soundActive;
        hudActionSound.classList.toggle('active', soundActive);
        if (soundActive) {
            hudActionSound.querySelector('.btn-text').textContent = 'Mute Soundscape';
            startSoundscape(soundType);
        } else {
            hudActionSound.querySelector('.btn-text').textContent = 'Ambient Soundscape';
            stopSoundscape();
        }
    });

    function triggerPortalTransition(card, cardId, title, desc, specsText, img) {
        portalActive = true;
        activeCardId = cardId;
        originalCardBounds = card.getBoundingClientRect();

        // 1. Surrounding Cards Dissolve and Trigger Canvas Particles
        colCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.add('dissolve');
            }
        });

        // Start local canvas dissolve particles at surrounding card centers
        startDissolveParticles(card);

        // 2. Clone Clicked Card Image & Animate to Fullscreen (Spring Physics)
        const imgEl = card.querySelector('.col-card-img') || card.querySelector('.dining-card-image img') || card.querySelector('img');
        originalImgBounds = imgEl ? imgEl.getBoundingClientRect() : card.getBoundingClientRect();

        const clone = document.createElement('div');
        clone.className = 'portal-card-clone';
        clone.id = 'portalCardClone';
        clone.style.top = `${originalImgBounds.top}px`;
        clone.style.left = `${originalImgBounds.left}px`;
        clone.style.width = `${originalImgBounds.width}px`;
        clone.style.height = `${originalImgBounds.height}px`;

        const visualParent = imgEl ? (imgEl.closest('.col-card-visual') || imgEl.closest('.dining-card-image')) : null;
        originalBorderRadius = visualParent ? window.getComputedStyle(visualParent).borderRadius : '28px';
        clone.style.borderRadius = originalBorderRadius;

        const cloneImg = document.createElement('img');
        cloneImg.src = img;
        cloneImg.className = 'clone-img';
        clone.appendChild(cloneImg);
        document.body.appendChild(clone);

        // Disable scrolling on body
        bodyEl.style.overflow = 'hidden';
        bodyEl.classList.add('portal-active');

        // Trigger spring-like expansion after a microscopic delay
        requestAnimationFrame(() => {
            setTimeout(() => {
                clone.classList.add('expanding');
            }, 30);
        });

        // 3. Bring in the Portal Overlay and volumetric lighting sweep
        setTimeout(() => {
            const data = getResidenceData(cardId, title, desc, specsText, img);
            soundType = data.sound;
            
            // Populate Parallax Layers
            layerBack.style.backgroundImage = `url(${data.back})`;
            layerMid.style.backgroundImage = `url(${data.back})`;
            layerFront.style.backgroundImage = `url(${data.back})`;
            layerAtmospheric.style.backgroundImage = `url(${data.back})`;

            // Video background logic
            const bgVideo = document.getElementById('portalBgVideo');
            if (bgVideo) {
                if (data.video) {
                    bgVideo.src = data.video;
                    bgVideo.load();
                    bgVideo.play().catch(err => console.log("Video auto-play failed: ", err));
                    bgVideo.classList.add('active');
                    layerBack.style.opacity = '0';
                } else {
                    bgVideo.pause();
                    bgVideo.src = '';
                    bgVideo.classList.remove('active');
                    layerBack.style.opacity = '';
                }
            }

            // Populate HUD elements
            portalTitle.textContent = data.title;
            portalSubtitle.textContent = data.subtitle;
            portalBadge.textContent = data.badge;
            portalCoords.textContent = data.coords;
            portalAltitude.textContent = data.altitude;

            // Clear specifications grid
            portalSpecs.innerHTML = '';
            data.specs.forEach(spec => {
                const item = document.createElement('div');
                item.className = 'hud-spec-item';
                
                const label = document.createElement('span');
                label.className = 'hud-spec-label';
                label.textContent = spec.label;
                
                const val = document.createElement('span');
                val.className = 'hud-spec-val';
                val.textContent = spec.value;

                item.appendChild(label);
                item.appendChild(val);
                portalSpecs.appendChild(item);
            });

            // Activate volumetric glow sweep
            portalVolumetricGlow.classList.add('sweep');

            // Open portal overlay
            portalOverlay.classList.add('active');

            // Start themed background loop
            startPortalParticles(data.sound);

            // Initiate storytelling typewriter text
            startTypewriter(data.narrative);

            // Clean up card clone
            setTimeout(() => {
                clone.remove();
            }, 500);

        }, 750); // Overlay hits before final expansion ends to cover seams
    }

    function exitPortalTransition() {
        if (!portalActive) return;

        // Stop Web Audio
        soundActive = false;
        hudActionSound.classList.remove('active');
        hudActionSound.querySelector('.btn-text').textContent = 'Ambient Soundscape';
        stopSoundscape();

        // Clear typewriter loops
        clearTimeout(typewriterTimeout);
        portalNarrative.textContent = '';

        // Video background clean up
        const bgVideo = document.getElementById('portalBgVideo');
        if (bgVideo) {
            bgVideo.pause();
            bgVideo.src = '';
            bgVideo.classList.remove('active');
        }
        layerBack.style.opacity = '';

        // Capture static background image of active card
        const data = getResidenceData(activeCardId, '', '', '', '');
        
        // 1. Recreate Card Clone at fullscreen dimensions
        const clone = document.createElement('div');
        clone.className = 'portal-card-clone expanding';
        clone.id = 'portalCardClone';
        
        const cloneImg = document.createElement('img');
        cloneImg.src = data.back;
        cloneImg.className = 'clone-img';
        clone.appendChild(cloneImg);
        document.body.appendChild(clone);

        // 2. Fade out Portal Overlay
        portalOverlay.classList.remove('active');
        portalVolumetricGlow.classList.remove('sweep');

        // Stop canvas particle loop
        cancelAnimationFrame(particleLoopId);
        particleLoopId = null;

        // 3. Shrink Card Clone back to grid coordinates
        requestAnimationFrame(() => {
            setTimeout(() => {
                clone.classList.remove('expanding');
                clone.style.top = `${originalImgBounds.top}px`;
                clone.style.left = `${originalImgBounds.left}px`;
                clone.style.width = `${originalImgBounds.width}px`;
                clone.style.height = `${originalImgBounds.height}px`;
                clone.style.borderRadius = originalBorderRadius;
            }, 50);
        });

        // 4. Reveal original website grids
        setTimeout(() => {
            colCards.forEach(otherCard => {
                otherCard.classList.remove('dissolve');
            });
            bodyEl.style.overflow = '';
            bodyEl.classList.remove('portal-active');
            
            clone.remove();
            portalActive = false;
            activeCardId = null;
        }, 1250);
    }

    function startTypewriter(text) {
        clearTimeout(typewriterTimeout);
        portalNarrative.textContent = '';
        
        let index = 0;
        function type() {
            if (index < text.length) {
                portalNarrative.textContent += text.charAt(index);
                index++;
                typewriterTimeout = setTimeout(type, 15); // 15ms typewriter delay
            }
        }
        type();
    }

    document.addEventListener('mousemove', (e) => {
        if (!portalActive) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        parallaxOffset.targetX = nx;
        parallaxOffset.targetY = ny;
    });

    function updateParallaxLoop() {
        if (portalActive) {
            parallaxOffset.x += (parallaxOffset.targetX - parallaxOffset.x) * 0.07;
            parallaxOffset.y += (parallaxOffset.targetY - parallaxOffset.y) * 0.07;

            layerBack.style.transform = `scale(1.05) translate(${parallaxOffset.x * -12}px, ${parallaxOffset.y * -12}px)`;
            
            const bgVideo = document.getElementById('portalBgVideo');
            if (bgVideo && bgVideo.classList.contains('active')) {
                bgVideo.style.transform = `scale(1.05) translate(${parallaxOffset.x * -12}px, ${parallaxOffset.y * -12}px)`;
            }

            layerMid.style.transform = `scale(1.08) translate(${parallaxOffset.x * -25}px, ${parallaxOffset.y * -25}px)`;
            layerFront.style.transform = `scale(1.12) translate(${parallaxOffset.x * -42}px, ${parallaxOffset.y * -42}px)`;
            layerAtmospheric.style.transform = `scale(1.15) translate(${parallaxOffset.x * -60}px, ${parallaxOffset.y * -60}px)`;
        }
        requestAnimationFrame(updateParallaxLoop);
    }
    requestAnimationFrame(updateParallaxLoop);

    // ==========================================
    // 16. CANVAS PARTICLE SYSTEM ENGINE
    // ==========================================
    const portalCanvas = document.getElementById('portalParticleCanvas');
    const pCtx = portalCanvas.getContext('2d');
    let portalParticles = [];

    function resizePortalCanvas() {
        portalCanvas.width = window.innerWidth;
        portalCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizePortalCanvas);

    function startPortalParticles(theme) {
        resizePortalCanvas();
        portalParticles = [];
        cancelAnimationFrame(particleLoopId);

        // Populate base particles based on theme
        const count = theme === 'forest' ? 90 : (theme === 'water' ? 60 : (theme === 'space' ? 110 : 50));
        
        for (let i = 0; i < count; i++) {
            portalParticles.push(createPortalParticle(theme, true));
        }

        function loop() {
            pCtx.clearRect(0, 0, portalCanvas.width, portalCanvas.height);

            // Special background aurora streaks for Moonlight Pavilion
            if (theme === 'space') {
                drawAuroraOverlay();
            }

            portalParticles.forEach((p, idx) => {
                p.update();
                p.draw();
                if (p.isDead && p.isDead()) {
                    portalParticles[idx] = createPortalParticle(theme, false);
                }
            });

            particleLoopId = requestAnimationFrame(loop);
        }
        particleLoopId = requestAnimationFrame(loop);
    }

    function createPortalParticle(theme, init) {
        const x = Math.random() * portalCanvas.width;
        const y = init ? Math.random() * portalCanvas.height : (theme === 'water' ? -20 : portalCanvas.height + 20);

        if (theme === 'forest') {
            // Mist, leaves, fireflies, pine dust
            const type = Math.random() < 0.35 ? 'firefly' : (Math.random() < 0.65 ? 'leaf' : 'pine');
            return {
                x: x,
                y: y,
                size: type === 'firefly' ? Math.random() * 3 + 1.2 : Math.random() * 8 + 4,
                speedX: (Math.random() - 0.5) * 0.3 + (type === 'firefly' ? 0.05 : -0.2),
                speedY: type === 'firefly' ? -0.4 - Math.random() * 0.4 : 0.6 + Math.random() * 0.8,
                opacity: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.03 + 0.01,
                color: type === 'firefly' ? '180, 215, 107' : (type === 'leaf' ? '136, 155, 105' : '176, 122, 69'),
                type: type,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: (Math.random() - 0.5) * 0.02,
                update: function() {
                    this.pulse += this.pulseSpeed;
                    this.angle += this.angleSpeed;
                    this.x += this.speedX + Math.sin(this.angle) * 0.12;
                    this.y += this.speedY;
                },
                draw: function() {
                    const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
                    pCtx.save();
                    pCtx.translate(this.x, this.y);
                    pCtx.rotate(this.angle);
                    pCtx.fillStyle = `rgba(${this.color}, ${alpha})`;

                    if (this.type === 'firefly') {
                        const grad = pCtx.createRadialGradient(0, 0, 0, 0, 0, this.size * 3);
                        grad.addColorStop(0, `rgba(${this.color}, ${alpha * 1.5})`);
                        grad.addColorStop(0.3, `rgba(215, 180, 107, ${alpha * 0.7})`);
                        grad.addColorStop(1, 'rgba(215, 180, 107, 0)');
                        pCtx.fillStyle = grad;
                        pCtx.beginPath();
                        pCtx.arc(0, 0, this.size * 3, 0, Math.PI * 2);
                        pCtx.fill();
                    } else if (this.type === 'leaf') {
                        pCtx.beginPath();
                        pCtx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
                        pCtx.fill();
                    } else {
                        pCtx.strokeStyle = `rgba(${this.color}, ${alpha})`;
                        pCtx.lineWidth = 1;
                        pCtx.beginPath();
                        pCtx.moveTo(-this.size, -this.size * 0.5);
                        pCtx.lineTo(this.size, this.size * 0.5);
                        pCtx.stroke();
                    }
                    pCtx.restore();
                },
                isDead: function() {
                    return this.y > portalCanvas.height + 30 || this.y < -30 || this.x > portalCanvas.width + 30 || this.x < -30;
                }
            };
        } else if (theme === 'water') {
            // concentric ripples, droplets, emerald glows
            const type = Math.random() < 0.25 ? 'ripple' : (Math.random() < 0.65 ? 'droplet' : 'spore');
            return {
                x: x,
                y: y,
                size: type === 'ripple' ? 1 : Math.random() * 2.5 + 1.0,
                maxSize: type === 'ripple' ? Math.random() * 100 + 40 : 0,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: type === 'droplet' ? 1.5 + Math.random() * 1.2 : -0.2 - Math.random() * 0.3,
                opacity: type === 'ripple' ? 0.6 : Math.random() * 0.5 + 0.15,
                color: type === 'spore' ? '180, 215, 107' : '160, 210, 230',
                type: type,
                pulse: Math.random() * Math.PI * 2,
                update: function() {
                    if (this.type === 'ripple') {
                        this.size += 0.8;
                        this.opacity -= 0.005;
                    } else {
                        this.x += this.speedX;
                        this.y += this.speedY;
                        this.pulse += 0.01;
                    }
                },
                draw: function() {
                    if (this.opacity <= 0) return;
                    pCtx.save();
                    if (this.type === 'ripple') {
                        pCtx.strokeStyle = `rgba(160, 215, 190, ${this.opacity})`;
                        pCtx.lineWidth = 1.2;
                        pCtx.beginPath();
                        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        pCtx.stroke();
                    } else if (this.type === 'droplet') {
                        pCtx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                        pCtx.beginPath();
                        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        pCtx.fill();
                    } else {
                        const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
                        const grad = pCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
                        grad.addColorStop(0, `rgba(40, 185, 130, ${alpha})`);
                        grad.addColorStop(0.5, `rgba(180, 215, 107, ${alpha * 0.3})`);
                        grad.addColorStop(1, 'rgba(180, 215, 107, 0)');
                        pCtx.fillStyle = grad;
                        pCtx.beginPath();
                        pCtx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
                        pCtx.fill();
                    }
                    pCtx.restore();
                },
                isDead: function() {
                    if (this.type === 'ripple') return this.opacity <= 0 || this.size >= this.maxSize;
                    return this.y > portalCanvas.height + 30 || this.y < -30;
                }
            };
        } else if (theme === 'space') {
            // twinkling stars, cosmic dust
            const type = Math.random() < 0.6 ? 'star' : 'cosmic';
            return {
                x: x,
                y: y,
                size: type === 'star' ? Math.random() * 2 + 0.6 : Math.random() * 4 + 1.5,
                speedX: (Math.random() - 0.5) * 0.15,
                speedY: (Math.random() - 0.5) * 0.15,
                opacity: Math.random() * 0.6 + 0.1,
                twinkleSpeed: Math.random() * 0.05 + 0.015,
                pulse: Math.random() * Math.PI * 2,
                color: type === 'star' ? '255, 255, 255' : '150, 120, 220',
                type: type,
                update: function() {
                    this.pulse += this.twinkleSpeed;
                    this.x += this.speedX;
                    this.y += this.speedY;
                },
                draw: function() {
                    const alpha = this.opacity * (0.3 + 0.7 * Math.sin(this.pulse));
                    pCtx.save();
                    pCtx.fillStyle = `rgba(${this.color}, ${alpha})`;
                    
                    if (this.type === 'star') {
                        pCtx.beginPath();
                        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        pCtx.fill();
                    } else {
                        const grad = pCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5);
                        grad.addColorStop(0, `rgba(${this.color}, ${alpha * 0.6})`);
                        grad.addColorStop(1, 'rgba(150, 120, 220, 0)');
                        pCtx.fillStyle = grad;
                        pCtx.beginPath();
                        pCtx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
                        pCtx.fill();
                    }
                    pCtx.restore();
                },
                isDead: function() {
                    return this.x > portalCanvas.width + 30 || this.x < -30 || this.y > portalCanvas.height + 30 || this.y < -30;
                }
            };
        } else {
            // Default Luxury sparks
            const type = Math.random() < 0.5 ? 'spark' : 'gold';
            return {
                x: x,
                y: y,
                size: type === 'spark' ? Math.random() * 2 + 0.8 : Math.random() * 7 + 3,
                speedX: (Math.random() - 0.5) * 0.4 + (type === 'spark' ? 0.05 : -0.1),
                speedY: type === 'spark' ? -1.2 - Math.random() * 1.5 : 0.4 + Math.random() * 0.6,
                opacity: Math.random() * 0.6 + 0.15,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                color: type === 'spark' ? '214, 123, 45' : '176, 122, 69',
                type: type,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: (Math.random() - 0.5) * 0.03,
                update: function() {
                    this.pulse += this.pulseSpeed;
                    this.angle += this.angleSpeed;
                    this.x += this.speedX + Math.sin(this.pulse) * 0.08;
                    this.y += this.speedY;
                },
                draw: function() {
                    const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
                    pCtx.save();
                    pCtx.translate(this.x, this.y);
                    pCtx.rotate(this.angle);

                    if (this.type === 'spark') {
                        pCtx.fillStyle = `rgba(${this.color}, ${alpha})`;
                        pCtx.beginPath();
                        pCtx.arc(0, 0, this.size, 0, Math.PI * 2);
                        pCtx.fill();
                    } else {
                        pCtx.fillStyle = `rgba(${this.color}, ${alpha})`;
                        pCtx.beginPath();
                        pCtx.moveTo(-this.size * 0.5, -this.size * 0.5);
                        pCtx.lineTo(this.size * 0.5, -this.size * 0.3);
                        pCtx.lineTo(this.size * 0.3, this.size * 0.5);
                        pCtx.lineTo(-this.size * 0.3, this.size * 0.4);
                        pCtx.closePath();
                        pCtx.fill();
                    }
                    pCtx.restore();
                },
                isDead: function() {
                    return this.y > portalCanvas.height + 30 || this.y < -30 || this.x > portalCanvas.width + 30 || this.x < -30;
                }
            };
        }
    }

    let auroraTime = 0;
    function drawAuroraOverlay() {
        auroraTime += 0.005;
        pCtx.save();
        pCtx.globalCompositeOperation = 'screen';
        
        for (let j = 0; j < 3; j++) {
            const opacity = 0.06 - j * 0.015;
            const segments = 20;
            const step = portalCanvas.width / segments;
            const heightBase = portalCanvas.height * 0.25;

            pCtx.beginPath();
            pCtx.moveTo(0, heightBase);

            for (let i = 0; i <= segments; i++) {
                const px = i * step;
                const phase = auroraTime + i * 0.2 + j * 1.5;
                const py = heightBase + Math.sin(phase) * 60 + Math.cos(phase * 0.5) * 40;
                pCtx.lineTo(px, py);
            }

            pCtx.strokeStyle = j === 0 ? `rgba(40, 200, 160, ${opacity})` : (j === 1 ? `rgba(140, 80, 220, ${opacity})` : `rgba(40, 120, 220, ${opacity})`);
            pCtx.lineWidth = 120 - j * 30;
            pCtx.lineCap = 'round';
            pCtx.lineJoin = 'round';
            pCtx.stroke();
        }
        
        pCtx.restore();
    }

    function startDissolveParticles(clickedCard) {
        resizePortalCanvas();
        cancelAnimationFrame(particleLoopId);
        portalParticles = [];

        colCards.forEach(card => {
            if (card !== clickedCard) {
                const bounds = card.getBoundingClientRect();
                const cardCenterX = bounds.left + bounds.width / 2;
                const cardCenterY = bounds.top + bounds.height / 2;
                const cardId = card.getAttribute('data-card') || '1';

                for (let i = 0; i < 35; i++) {
                    const speedMultiplier = Math.random() * 2 + 1.2;
                    const angle = Math.random() * Math.PI * 2;
                    
                    const p = {
                        x: cardCenterX,
                        y: cardCenterY,
                        speedX: Math.cos(angle) * speedMultiplier,
                        speedY: Math.sin(angle) * speedMultiplier - 1.2,
                        opacity: Math.random() * 0.8 + 0.2,
                        decay: Math.random() * 0.015 + 0.008,
                        rotation: Math.random() * Math.PI * 2,
                        rotSpeed: (Math.random() - 0.5) * 0.1,
                    };

                    if (cardId === '1') {
                        // Forest Canopy Villa: forest mist, leaves, fireflies, pine particles
                        const r = Math.random();
                        if (r < 0.25) {
                            p.type = 'mist';
                            p.size = Math.random() * 12 + 8;
                            p.color = '240, 245, 240';
                            p.opacity = Math.random() * 0.3 + 0.1;
                            p.decay = Math.random() * 0.008 + 0.005;
                            p.scaleSpeed = Math.random() * 0.1 + 0.05;
                        } else if (r < 0.55) {
                            p.type = 'leaf';
                            p.size = Math.random() * 6 + 3;
                            p.color = '136, 155, 105';
                            p.speedY += 0.5;
                        } else if (r < 0.8) {
                            p.type = 'firefly';
                            p.size = Math.random() * 2.5 + 1;
                            p.color = '180, 215, 107';
                            p.pulse = Math.random() * Math.PI;
                            p.pulseSpeed = Math.random() * 0.1 + 0.05;
                        } else {
                            p.type = 'pine';
                            p.size = Math.random() * 4 + 2;
                            p.color = '176, 122, 69';
                        }
                    } else if (cardId === '2') {
                        // Emerald Pool Residence: water ripples, droplets, reflections, emerald glow
                        const r = Math.random();
                        if (r < 0.25) {
                            p.type = 'ripple';
                            p.size = Math.random() * 10 + 5;
                            p.maxSize = Math.random() * 50 + 40;
                            p.color = '160, 210, 230';
                            p.opacity = Math.random() * 0.6 + 0.3;
                            p.decay = Math.random() * 0.015 + 0.01;
                            p.speedX *= 0.1;
                            p.speedY *= 0.1;
                        } else if (r < 0.6) {
                            p.type = 'droplet';
                            p.size = Math.random() * 3 + 1;
                            p.color = '120, 200, 230';
                            p.speedY += 0.8;
                        } else if (r < 0.8) {
                            p.type = 'reflection';
                            p.size = Math.random() * 5 + 3;
                            p.color = '255, 255, 255';
                            p.decay = Math.random() * 0.03 + 0.02;
                        } else {
                            p.type = 'emerald';
                            p.size = Math.random() * 8 + 4;
                            p.color = '40, 185, 130';
                        }
                    } else if (cardId === '3') {
                        // Moonlight Pavilion: stars, moon particles, cosmic dust, aurora streaks
                        const r = Math.random();
                        if (r < 0.3) {
                            p.type = 'star';
                            p.size = Math.random() * 3 + 1;
                            p.color = '255, 255, 255';
                            p.twinkle = Math.random() * Math.PI;
                        } else if (r < 0.5) {
                            p.type = 'moon';
                            p.size = Math.random() * 4 + 2;
                            p.color = '245, 240, 220';
                        } else if (r < 0.8) {
                            p.type = 'cosmic';
                            p.size = Math.random() * 8 + 4;
                            p.color = '150, 120, 220';
                        } else {
                            p.type = 'aurora';
                            p.size = Math.random() * 12 + 6;
                            p.color = '40, 200, 160';
                            p.decay = Math.random() * 0.01 + 0.005;
                        }
                    } else {
                        // Other cards: golden/amber sparks, gold leaf flakes
                        const r = Math.random();
                        if (r < 0.6) {
                            p.type = 'spark';
                            p.size = Math.random() * 2.5 + 0.8;
                            p.color = '214, 123, 45';
                        } else {
                            p.type = 'flake';
                            p.size = Math.random() * 5 + 2;
                            p.color = '176, 122, 69';
                            p.speedY += 0.3;
                        }
                    }

                    p.update = function() {
                        this.x += this.speedX;
                        this.y += this.speedY;
                        this.opacity -= this.decay;
                        this.rotation += this.rotSpeed;

                        if (this.type === 'ripple') {
                            this.size += 1.8;
                        } else if (this.type === 'mist') {
                            this.size += this.scaleSpeed;
                        } else if (this.type === 'firefly') {
                            this.pulse += this.pulseSpeed;
                            this.x += Math.sin(this.pulse) * 0.15;
                        } else if (this.type === 'star') {
                            this.twinkle += 0.1;
                        }

                        if (this.type !== 'ripple') {
                            this.speedX *= 0.96;
                            this.speedY *= 0.96;
                        }
                    };

                    p.draw = function() {
                        if (this.opacity <= 0) return;
                        pCtx.save();
                        pCtx.translate(this.x, this.y);
                        pCtx.rotate(this.rotation);

                        let currentAlpha = this.opacity;
                        if (this.type === 'firefly') {
                            currentAlpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
                        } else if (this.type === 'star') {
                            currentAlpha = this.opacity * (0.4 + 0.6 * Math.sin(this.twinkle));
                        }

                        if (this.type === 'mist' || this.type === 'cosmic' || this.type === 'emerald' || this.type === 'aurora') {
                            const grad = pCtx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                            grad.addColorStop(0, `rgba(${this.color}, ${currentAlpha})`);
                            grad.addColorStop(1, `rgba(${this.color}, 0)`);
                            pCtx.fillStyle = grad;
                            pCtx.beginPath();
                            pCtx.arc(0, 0, this.size, 0, Math.PI * 2);
                            pCtx.fill();
                        } else if (this.type === 'ripple') {
                            pCtx.strokeStyle = `rgba(${this.color}, ${currentAlpha})`;
                            pCtx.lineWidth = 1.0;
                            pCtx.beginPath();
                            pCtx.arc(0, 0, this.size, 0, Math.PI * 2);
                            pCtx.stroke();
                        } else if (this.type === 'leaf') {
                            pCtx.fillStyle = `rgba(${this.color}, ${currentAlpha})`;
                            pCtx.beginPath();
                            pCtx.ellipse(0, 0, this.size, this.size * 0.4, 0, 0, Math.PI * 2);
                            pCtx.fill();
                        } else if (this.type === 'flake') {
                            pCtx.fillStyle = `rgba(${this.color}, ${currentAlpha})`;
                            pCtx.beginPath();
                            pCtx.moveTo(-this.size * 0.5, -this.size * 0.4);
                            pCtx.lineTo(this.size * 0.4, -this.size * 0.5);
                            pCtx.lineTo(this.size * 0.3, this.size * 0.4);
                            pCtx.lineTo(-this.size * 0.4, this.size * 0.3);
                            pCtx.closePath();
                            pCtx.fill();
                        } else if (this.type === 'star') {
                            pCtx.fillStyle = `rgba(${this.color}, ${currentAlpha})`;
                            pCtx.beginPath();
                            pCtx.moveTo(0, -this.size);
                            pCtx.lineTo(this.size * 0.2, -this.size * 0.2);
                            pCtx.lineTo(this.size, 0);
                            pCtx.lineTo(this.size * 0.2, this.size * 0.2);
                            pCtx.lineTo(0, this.size);
                            pCtx.lineTo(-this.size * 0.2, this.size * 0.2);
                            pCtx.lineTo(-this.size, 0);
                            pCtx.lineTo(-this.size * 0.2, -this.size * 0.2);
                            pCtx.closePath();
                            pCtx.fill();
                        } else if (this.type === 'reflection') {
                            const grad = pCtx.createLinearGradient(-this.size, 0, this.size, 0);
                            grad.addColorStop(0, `rgba(${this.color}, 0)`);
                            grad.addColorStop(0.5, `rgba(${this.color}, ${currentAlpha})`);
                            grad.addColorStop(1, `rgba(${this.color}, 0)`);
                            pCtx.strokeStyle = grad;
                            pCtx.lineWidth = 1.5;
                            pCtx.beginPath();
                            pCtx.moveTo(-this.size, 0);
                            pCtx.lineTo(this.size, 0);
                            pCtx.stroke();
                        } else {
                            pCtx.fillStyle = `rgba(${this.color}, ${currentAlpha})`;
                            pCtx.beginPath();
                            pCtx.arc(0, 0, this.size, 0, Math.PI * 2);
                            pCtx.fill();
                        }

                        pCtx.restore();
                    };

                    p.isDead = function() {
                        return this.opacity <= 0;
                    };

                    portalParticles.push(p);
                }
            }
        });

        let dissolveLoopId = null;
        function dissolveLoop() {
            pCtx.clearRect(0, 0, portalCanvas.width, portalCanvas.height);
            let aliveCount = 0;

            portalParticles.forEach(p => {
                p.update();
                p.draw();
                if (!p.isDead()) aliveCount++;
            });

            if (aliveCount > 0 && portalActive) {
                dissolveLoopId = requestAnimationFrame(dissolveLoop);
            }
        }
        dissolveLoop();

        setTimeout(() => {
            cancelAnimationFrame(dissolveLoopId);
        }, 1200);
    }

    portalCanvas.addEventListener('click', (e) => {
        if (!portalActive || soundType !== 'water') return;
        
        for (let i = 0; i < 2; i++) {
            portalParticles.push({
                x: e.clientX,
                y: e.clientY,
                size: 1,
                maxSize: Math.random() * 120 + 60 + i * 30,
                opacity: 0.8,
                type: 'ripple',
                update: function() {
                    this.size += 1.2;
                    this.opacity -= 0.008;
                },
                draw: function() {
                    if (this.opacity <= 0) return;
                    pCtx.save();
                    pCtx.strokeStyle = `rgba(160, 215, 190, ${this.opacity})`;
                    pCtx.lineWidth = 1.5;
                    pCtx.beginPath();
                    pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    pCtx.stroke();
                    pCtx.restore();
                },
                isDead: function() {
                    return this.opacity <= 0;
                }
            });
        }
    });

    // ==========================================
    // 17. LUXURY PORTAL WEB AUDIO SYNTHESIZER
    // ==========================================
    let audioCtx = null;
    let synthNodes = [];

    function startSoundscape(type) {
        stopSoundscape();
        
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const now = audioCtx.currentTime;

            if (type === 'forest') {
                const osc = audioCtx.createOscillator();
                const filter = audioCtx.createBiquadFilter();
                const gain = audioCtx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(78, now);
                osc.frequency.linearRampToValueAtTime(80, now + 5);

                filter.type = 'lowpass';
                filter.Q.setValueAtTime(3, now);
                filter.frequency.setValueAtTime(200, now);

                const sweep = audioCtx.createOscillator();
                const sweepGain = audioCtx.createGain();
                sweep.frequency.setValueAtTime(0.15, now);
                sweepGain.gain.setValueAtTime(40, now);
                
                sweep.connect(sweepGain);
                sweepGain.connect(filter.frequency);
                sweep.start();

                gain.gain.setValueAtTime(0.15, now);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start();
                synthNodes.push(osc, sweep, sweepGain, filter, gain);

                const bufferSize = audioCtx.sampleRate * 2;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;
                noise.loop = true;

                const noiseFilter = audioCtx.createBiquadFilter();
                noiseFilter.type = 'bandpass';
                noiseFilter.frequency.setValueAtTime(400, now);
                noiseFilter.Q.setValueAtTime(1.0, now);

                const noiseSweep = audioCtx.createOscillator();
                const noiseSweepGain = audioCtx.createGain();
                noiseSweep.frequency.setValueAtTime(0.08, now);
                noiseSweepGain.gain.setValueAtTime(150, now);
                noiseSweep.connect(noiseSweepGain);
                noiseSweepGain.connect(noiseFilter.frequency);
                noiseSweep.start();

                const noiseGain = audioCtx.createGain();
                noiseGain.gain.setValueAtTime(0.03, now);

                noise.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                noiseGain.connect(audioCtx.destination);

                noise.start();
                synthNodes.push(noise, noiseFilter, noiseSweep, noiseSweepGain, noiseGain);

            } else if (type === 'water') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(65, now);
                
                const lfo = audioCtx.createOscillator();
                const lfoGain = audioCtx.createGain();
                lfo.frequency.setValueAtTime(0.2, now);
                lfoGain.gain.setValueAtTime(3, now);
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();

                gain.gain.setValueAtTime(0.2, now);

                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                synthNodes.push(osc, lfo, lfoGain, gain);

                const bubbleInterval = setInterval(() => {
                    if (!audioCtx || audioCtx.state === 'suspended') return;
                    const bOsc = audioCtx.createOscillator();
                    const bGain = audioCtx.createGain();
                    
                    bOsc.type = 'sine';
                    bOsc.frequency.setValueAtTime(300 + Math.random() * 500, audioCtx.currentTime);
                    bOsc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);

                    bGain.gain.setValueAtTime(0.005, audioCtx.currentTime);
                    bGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);

                    bOsc.connect(bGain);
                    bGain.connect(audioCtx.destination);
                    bOsc.start();
                    bOsc.stop(audioCtx.currentTime + 0.2);
                }, 300);

                synthNodes.push({ stop: () => clearInterval(bubbleInterval) });

            } else if (type === 'space') {
                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();

                osc1.type = 'sawtooth';
                osc1.frequency.setValueAtTime(110, now);
                
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(220.5, now);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(180, now);
                filter.Q.setValueAtTime(4, now);

                gain.gain.setValueAtTime(0.12, now);

                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);

                osc1.start();
                osc2.start();

                const auroraSweep = audioCtx.createOscillator();
                const auroraGain = audioCtx.createGain();
                auroraSweep.frequency.setValueAtTime(0.05, now);
                auroraGain.gain.setValueAtTime(80, now);
                auroraSweep.connect(auroraGain);
                auroraGain.connect(filter.frequency);
                auroraSweep.start();

                synthNodes.push(osc1, osc2, filter, gain, auroraSweep, auroraGain);

            } else {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(90, now);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(300, now);

                gain.gain.setValueAtTime(0.15, now);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();

                const crackleInterval = setInterval(() => {
                    if (!audioCtx || audioCtx.state === 'suspended') return;
                    const bOsc = audioCtx.createOscillator();
                    const bGain = audioCtx.createGain();
                    
                    bOsc.type = 'triangle';
                    bOsc.frequency.setValueAtTime(1000 + Math.random() * 2000, audioCtx.currentTime);
                    bGain.gain.setValueAtTime(0.003 * Math.random(), audioCtx.currentTime);
                    bGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

                    bOsc.connect(bGain);
                    bGain.connect(audioCtx.destination);
                    bOsc.start();
                    bOsc.stop(audioCtx.currentTime + 0.05);
                }, 150);

                synthNodes.push(osc, filter, gain, { stop: () => clearInterval(crackleInterval) });
            }

        } catch (e) {
            console.error('Audio initialization failed:', e);
        }
    }

    function stopSoundscape() {
        synthNodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                else if (node.disconnect) node.disconnect();
            } catch (err) {}
        });
        synthNodes = [];
    }

    console.log('%c🌿 AURALIS GRAND FOREST RESERVE — Welcome to the Sanctuary', 'color: #889B69; font-size: 14px; font-family: serif; font-weight: bold;');
    console.log('%cA living dimension of luxury, architecture, and wilderness.', 'color: #B07A45; font-size: 11px; font-family: serif;');
});
