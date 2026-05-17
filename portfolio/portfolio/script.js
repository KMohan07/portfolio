document.addEventListener('DOMContentLoaded', () => {
    // 0. Custom Cursor & Terminal Setup
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const cursor = document.getElementById('custom-cursor');
    const cursorGlow = document.getElementById('cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if(cursor && cursorGlow) {
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
            
            // Adding a slight delay to glow for smooth trailing effect
            setTimeout(() => {
                cursorGlow.style.left = `${mouseX}px`;
                cursorGlow.style.top = `${mouseY}px`;
            }, 50);
        }
    });

    // Hover effect for cursor
    const hoverElements = document.querySelectorAll('a, button, .project-card, .glitch-hover');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(cursorGlow) {
                cursorGlow.style.width = '60px';
                cursorGlow.style.height = '60px';
                cursorGlow.style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if(cursorGlow) {
                cursorGlow.style.width = '40px';
                cursorGlow.style.height = '40px';
                cursorGlow.style.backgroundColor = 'transparent';
            }
        });
    });

    // Terminal Typing Effect for Hero
    const terminalContainer = document.getElementById('terminal-container');
    const heroName = document.getElementById('hero-name');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroHighlights = document.getElementById('hero-highlights');
    
    if (terminalContainer) {
        const lines = [
            "> Initializing Quantum State...",
            "> Importing qiskit, qrng, aes_gcm_cipher...",
            "> Running E91 Protocol Simulation...",
            "> Profile decrypted successfully."
        ];
        
        let currentLine = 0;
        let currentChar = 0;
        
        function typeWriter() {
            if (currentLine < lines.length) {
                if (currentChar < lines[currentLine].length) {
                    terminalContainer.innerHTML += lines[currentLine].charAt(currentChar);
                    currentChar++;
                    setTimeout(typeWriter, 40);
                } else {
                    terminalContainer.innerHTML += '<br>';
                    currentLine++;
                    currentChar = 0;
                    setTimeout(typeWriter, 300);
                }
            } else {
                // Reveal main hero content
                setTimeout(() => {
                    terminalContainer.style.opacity = '0.5';
                    if (heroName) {
                        heroName.style.opacity = '1';
                        heroName.style.transform = 'translateY(0)';
                    }
                    if (heroSubtitle) {
                        heroSubtitle.style.opacity = '1';
                        heroSubtitle.style.transform = 'translateY(0)';
                    }
                    if (heroHighlights) {
                        heroHighlights.style.opacity = '1';
                        heroHighlights.style.transform = 'translateY(0)';
                    }
                }, 500);
            }
        }
        setTimeout(typeWriter, 500);
    }

    // 1. Theme Configuration
    const themeToggle = document.getElementById('theme-toggle');
    let isDarkMode = localStorage.getItem('theme') === 'light' ? false : true;
    
    if (!localStorage.getItem('theme')) {
        isDarkMode = true; // Always default to dark for this theme
        localStorage.setItem('theme', 'dark');
    }

    function updateTheme(darkMode) {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        if (themeToggle) {
            themeToggle.classList.toggle('light-mode', !darkMode);
        }
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
    updateTheme(isDarkMode);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            updateTheme(isDarkMode);
        });
    }

    // 2. Dynamic Quotes Logic
    const quotes = [
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "The universe is built on a plan the profound symmetry of which is somehow present in the inner structure of our intellect.", author: "Paul Dirac" },
        { text: "If quantum mechanics hasn't profoundly shocked you, you haven't understood it yet.", author: "Niels Bohr" },
        { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
        { text: "Code is poetry, cryptography is the rhythm.", author: "Anonymous" }
    ];

    function updateQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const quoteElement = document.querySelector('.about-quote');
        if (quoteElement) {
            quoteElement.innerHTML = `"${randomQuote.text}" <br><span style="font-size: 0.9em; opacity: 0.8">- ${randomQuote.author}</span>`;
        }
    }

    setInterval(updateQuote, 7000);
    updateQuote();

    // 3. Carousel Drag/Swipe Logic
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid || projectCards.length === 0) return;

    let currentIndex = 0;
    let startX = 0;
    let currentTranslateX = 0;
    let isDragging = false;

    function setTransform(element, transform) {
        element.style.transform = transform;
    }

    function updateCards(instant = false) {
        projectCards.forEach((card, index) => {
            card.style.transition = instant ? 'none' : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.className = 'project-card';
            
            if (index === currentIndex) {
                card.classList.add('active');
                setTransform(card, `translate(-50%, -50%) scale(1)`);
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === projectCards.length - 1)) {
                card.classList.add('prev');
                setTransform(card, `translate(-150%, -50%) scale(0.8)`);
            } else if (index === currentIndex + 1 || (currentIndex === projectCards.length - 1 && index === 0)) {
                card.classList.add('next');
                setTransform(card, `translate(50%, -50%) scale(0.8)`);
            } else {
                card.classList.add('inactive');
                const direction = index < currentIndex ? -200 : 150;
                setTransform(card, `translate(${direction}%, -50%) scale(0.8)`);
            }
        });
    }

    function handleDragStart(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        currentTranslateX = 0;
        projectCards.forEach(card => card.style.transition = 'none');
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const diff = currentX - startX;
        currentTranslateX = diff;
        
        projectCards.forEach((card, index) => {
            let baseTransform = '';
            if (index === currentIndex) baseTransform = 'translate(-50%, -50%) scale(1)';
            else if (index === currentIndex - 1 || (currentIndex === 0 && index === projectCards.length - 1)) baseTransform = 'translate(-150%, -50%) scale(0.8)';
            else if (index === currentIndex + 1 || (currentIndex === projectCards.length - 1 && index === 0)) baseTransform = 'translate(50%, -50%) scale(0.8)';
            else baseTransform = `translate(${index < currentIndex ? -200 : 150}%, -50%) scale(0.8)`;
            
            setTransform(card, `${baseTransform} translateX(${diff * 0.5}px)`);
        });
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        projectCards.forEach(card => card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)');
        
        if (Math.abs(currentTranslateX) > 50) {
            scrollProjects(currentTranslateX > 0 ? 'left' : 'right');
        } else {
            updateCards();
        }
    }

    function scrollProjects(direction) {
        if (direction === 'left') {
            currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
        } else {
            currentIndex = (currentIndex + 1) % projectCards.length;
        }
        updateCards();
    }

    // Bind Carousel Events
    projectGrid.addEventListener('touchstart', handleDragStart, { passive: false });
    projectGrid.addEventListener('touchmove', handleDragMove, { passive: false });
    projectGrid.addEventListener('touchend', handleDragEnd);
    
    projectGrid.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    const btnLeft = document.getElementById('scrollLeft');
    const btnRight = document.getElementById('scrollRight');
    if(btnLeft) btnLeft.onclick = () => scrollProjects('left');
    if(btnRight) btnRight.onclick = () => scrollProjects('right');

    projectCards.forEach(card => card.addEventListener('dragstart', e => e.preventDefault()));
    updateCards();

    // 4. Scroll Reveal Animation for Sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section:not(.float-element)').forEach(section => {
        section.style.opacity = '0'; // hide initially
        section.style.animation = 'none'; // remove default animation
        observer.observe(section);
    });

    // 5. Quantum Background Particle Animation (Updated for repulsor effect)
    const canvas = document.getElementById('quantum-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        const particleCount = Math.floor((width * height) / 10000); // Slightly more particles

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#00ffff' : '#b026ff'; // Cyan or Violet
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction - Repulsion
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.vx -= (dx / distance) * force * 0.5;
                    this.vy -= (dy / distance) * force * 0.5;
                }
                
                // Speed limit
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 2) {
                    this.vx = (this.vx / speed) * 2;
                    this.vy = (this.vy / speed) * 2;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.6;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 - distance/800})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }
});
