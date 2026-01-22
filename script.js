/* =========================================
   0. Auth System Initialization
   ========================================= */
const AUTH_CONFIG = {
    usersKey: 'math_users',
    sessionKey: 'math_current_user'
};

// Initialize Users DB if empty
if (!localStorage.getItem(AUTH_CONFIG.usersKey)) {
    localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify({}));
}

const Auth = {
    register: (username, password, phone) => {
        const users = JSON.parse(localStorage.getItem(AUTH_CONFIG.usersKey));
        if (users[username]) return { success: false, message: "Ushbu foydalanuvchi nomi band!" };
        users[username] = {
            password: password,
            phone: phone,
            regDate: new Date().toISOString(),
            activity: []
        };
        localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));
        return { success: true, message: "Ro'yxatdan o'tish muvaffaqiyatli!" };
    },
    login: (username, password) => {
        const users = JSON.parse(localStorage.getItem(AUTH_CONFIG.usersKey));
        if (users[username] && users[username].password === password) {
            localStorage.setItem(AUTH_CONFIG.sessionKey, username);
            return { success: true };
        }
        return { success: false, message: "Login yoki parol noto'g'ri!" };
    },
    logout: () => {
        localStorage.removeItem(AUTH_CONFIG.sessionKey);
        location.reload();
    },
    getCurrentUser: () => localStorage.getItem(AUTH_CONFIG.sessionKey),
    isLoggedIn: () => !!localStorage.getItem(AUTH_CONFIG.sessionKey),
    logActivity: (type, data) => {
        const username = Auth.getCurrentUser();
        if (!username) return;
        const users = JSON.parse(localStorage.getItem(AUTH_CONFIG.usersKey));
        if (users[username]) {
            users[username].activity.push({
                type: type,
                data: data,
                time: new Date().toISOString()
            });
            localStorage.setItem(AUTH_CONFIG.usersKey, JSON.stringify(users));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Preloader Logic
       ========================================= */
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="loader-content">
            <div class="loader-circle"></div>
            <div class="loader-math">∑</div>
        </div>
    `;
    document.body.prepend(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
                initTypewriter();
                initRevealText(); // Reveal animations
            }, 500);
        }, 1000);
    });

    /* =========================================
       2. Advanced Custom Cursor (REMOVED)
       ========================================= */
    // User requested to use default mouse pointer.
    // Logic removed.

    /* =========================================
       3. Magnetic Buttons Logic
       ========================================= */
    document.querySelectorAll('.btn-neon, .nav-links a').forEach(btn => {
        btn.classList.add('magnetic-btn');
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    /* =========================================
       4. Typewriter Effect
       ========================================= */
    function initTypewriter() {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && !heroTitle.dataset.typed) {
            const originalText = heroTitle.innerText;
            heroTitle.innerHTML = '';
            heroTitle.dataset.typed = "true";
            let i = 0;
            function type() {
                if (i < originalText.length) {
                    heroTitle.innerHTML += originalText.charAt(i);
                    i++;
                    setTimeout(type, 50);
                }
            }
            type();
        }
    }

    /* =========================================
       5. Scroll Progress Bar
       ========================================= */
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });

    /* =========================================
       6. Scroll Animations (Observer)
       ========================================= */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .hero-card, .timeline-item, .card-flip-container, .service-card').forEach(el => {
        el.classList.add('fade-on-scroll');
        observer.observe(el);
    });

    /* =========================================
       7. Interactive Canvas Background (3D Warp Starfield)
       ========================================= */
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    // Ensure it's the very first element
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');

    let stars = [];
    const numStars = 2000;
    let speed = 2; // Warp speed

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width - canvas.width / 2;
            this.y = Math.random() * canvas.height - canvas.height / 2;
            this.z = Math.random() * canvas.width;
            this.pz = this.z; // Previous z
        }

        update() {
            this.z = this.z - speed;
            if (this.z < 1) {
                this.z = canvas.width;
                this.x = Math.random() * canvas.width - canvas.width / 2;
                this.y = Math.random() * canvas.height - canvas.height / 2;
                this.pz = this.z;
            }
        }

        draw() {
            let x = (this.x / this.z) * canvas.width / 2 + canvas.width / 2;
            let y = (this.y / this.z) * canvas.height / 2 + canvas.height / 2;

            let radius = (1 - this.z / canvas.width) * 2; // Size based on depth

            // Tail effect (Warp)
            let px = (this.x / this.pz) * canvas.width / 2 + canvas.width / 2;
            let py = (this.y / this.pz) * canvas.height / 2 + canvas.height / 2;

            this.pz = this.z;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${1 - this.z / canvas.width})`;
            ctx.lineWidth = radius;
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Star head
            ctx.beginPath();
            ctx.fillStyle = "#fff";
            ctx.arc(x, y, radius > 0 ? radius : 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) stars.push(new Star());
    }

    // Scroll speed interaction
    window.addEventListener('wheel', (e) => {
        speed += e.deltaY * 0.01;
        if (speed < 2) speed = 2;
        if (speed > 50) speed = 50;
        // Decay speed back to normal
        setTimeout(() => { if (speed > 2) speed *= 0.95; }, 100);
    });

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function animateParticles() {
        ctx.fillStyle = "rgba(5, 5, 16, 0.3)"; // Trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* =========================================
       8. Infinite Marquee
       ========================================= */
    const marquee = document.createElement('div');
    marquee.className = 'marquee-container';
    marquee.innerHTML = `
        <div class="marquee-content">
            E = mc² &nbsp;&nbsp; • &nbsp;&nbsp; a² + b² = c² &nbsp;&nbsp; • &nbsp;&nbsp; e^(iπ) + 1 = 0 &nbsp;&nbsp; • &nbsp;&nbsp; F = ma &nbsp;&nbsp; • &nbsp;&nbsp; ∫ f(x) dx &nbsp;&nbsp; • &nbsp;&nbsp;
            E = mc² &nbsp;&nbsp; • &nbsp;&nbsp; a² + b² = c² &nbsp;&nbsp; • &nbsp;&nbsp; e^(iπ) + 1 = 0 &nbsp;&nbsp; • &nbsp;&nbsp; F = ma &nbsp;&nbsp; • &nbsp;&nbsp; ∫ f(x) dx &nbsp;&nbsp; • &nbsp;&nbsp;
            E = mc² &nbsp;&nbsp; • &nbsp;&nbsp; a² + b² = c² &nbsp;&nbsp; • &nbsp;&nbsp; e^(iπ) + 1 = 0 &nbsp;&nbsp; • &nbsp;&nbsp; F = ma &nbsp;&nbsp; • &nbsp;&nbsp; ∫ f(x) dx &nbsp;&nbsp; • &nbsp;&nbsp;
        </div>
    `;
    document.body.appendChild(marquee);

    /* =========================================
       9. Spotlight Effect (Torch)
       ========================================= */
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-overlay';
    document.body.appendChild(spotlight);

    // Toggle spotlight with 'L' key
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'l') {
            spotlight.style.opacity = spotlight.style.opacity === '1' ? '0' : '1';
        }
    });

    /* =========================================
       10. Custom Context Menu
       ========================================= */
    const ctxMenu = document.createElement('div');
    ctxMenu.className = 'custom-context-menu';
    ctxMenu.innerHTML = `
        <div class="ctx-item" onclick="window.history.back()">⬅ Orqaga</div>
        <div class="ctx-item" onclick="location.reload()">↻ Yangilash</div>
        <div class="ctx-item" onclick="document.body.classList.toggle('matrix-active')">🕶 Matrix Rejimi</div>
        <div class="ctx-item" onclick="print()">🖨 Chop etish</div>
    `;
    document.body.appendChild(ctxMenu);

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        ctxMenu.style.display = 'block';
        ctxMenu.style.left = e.clientX + 'px';
        ctxMenu.style.top = e.clientY + 'px';
    });

    document.addEventListener('click', () => {
        ctxMenu.style.display = 'none';
    });

    /* =========================================
       11. Matrix Mode (Konami Code / Menu)
       ========================================= */
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.id = 'matrix-canvas';
    document.body.appendChild(matrixCanvas);
    const mCtx = matrixCanvas.getContext('2d');

    let matrixInterval;
    const matrixChars = '01';
    let drops = [];

    function startMatrix() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        matrixCanvas.style.display = 'block';
        const columns = matrixCanvas.width / 20;
        drops = [];
        for (let i = 0; i < columns; i++) drops[i] = 1;

        clearInterval(matrixInterval);
        matrixInterval = setInterval(drawMatrix, 50);
    }

    function drawMatrix() {
        mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        mCtx.fillStyle = '#0F0';
        mCtx.font = '15px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
            mCtx.fillText(text, i * 20, drops[i] * 20);
            if (drops[i] * 20 > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    // Toggle Matrix on click from Context Menu (handled via class observer)
    // Or Konami Code: Up Up Down Down Left Right Left Right B A
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                startMatrix();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Watch for class change on body to trigger matrix from menu
    const bodyObserver = new MutationObserver((mutations) => {
        if (document.body.classList.contains('matrix-active')) {
            startMatrix();
        } else {
            matrixCanvas.style.display = 'none';
            clearInterval(matrixInterval);
        }
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    /* =========================================
       12. Particle Explosion on Click
       ========================================= */
    document.addEventListener('click', (e) => {
        const symbols = ['+', '-', '×', '÷', '∑', 'π', '√'];
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            particle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            particle.style.left = (e.clientX + (Math.random() * 40 - 20)) + 'px'; // Randomize slightly
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    });

    /* =========================================
       13. 3D Tilt Effect for Cards
       ========================================= */
    document.querySelectorAll('.service-card, .hero-card').forEach(card => {
        card.classList.add('tilt-card');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });

    /* =========================================
       14. Reveal Text Animation
       ========================================= */
    function initRevealText() {
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (!p.classList.contains('reveal-text')) {
                // Split words safely
                const text = p.textContent.trim();
                p.innerHTML = '';
                p.classList.add('reveal-text');

                // Use a non-breaking space for layout safety or standard space
                text.split(/\s+/).forEach((word, index) => {
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.className = 'word-span';
                    p.appendChild(span);

                    // Add space after word (except last)
                    if (index < text.split(/\s+/).length - 1) {
                        const space = document.createTextNode(' '); // Plain space
                        p.appendChild(space);
                    }

                    // Animation delay logic on the span (requires inline-block in CSS to animate transform)
                    span.style.animationDelay = (Math.random() * 0.5) + 's';
                });
                observer.observe(p);
            }
        });
    }

    /* =========================================
       15. Ripple Effect on Buttons
       ========================================= */
    document.querySelectorAll('.service-btn, .btn-neon').forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripples = document.createElement('span');
            ripples.className = 'ripple';
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 1000);
        });
    });

    /* =========================================
       16. Glitch Text on Hover
       ========================================= */
    document.querySelectorAll('h1, h2, h3').forEach(header => {
        header.addEventListener('mouseenter', () => {
            header.classList.add('glitch-text');
            header.setAttribute('data-text', header.innerText);
        });
        header.addEventListener('mouseleave', () => {
            header.classList.remove('glitch-text');
        });
    });

    /* =========================================
       17. Project Modal Logic (Robust & Global)
       ========================================= */
    // Helper to get modal elements dynamically since they might not be in DOM at start? No, they are static.
    // But let's make sure we find them safely.

    window.openProjectModal = function (title, desc) {
        const modal = document.getElementById('projectModal');
        // If modal doesn't exist on this page, do nothing or Create it? 
        // For now, assume it exists on Index and Innovation.
        if (!modal) return;

        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = modal.querySelector('#modalDesc'); // Use querySelector for safer scope

        if (modalTitle) modalTitle.innerText = title;
        // Handle HTML content vs Text
        if (modalDesc) {
            modalDesc.innerHTML = desc; // Use innerHTML to allow tags
        } else {
            // Fallback if modalDesc is missing (e.g. replaced by simulation container)
            const container = modal.querySelector('#modalDescContainer') || modal.querySelector('.modal-content');
            // Reset if needed or append
        }

        modal.classList.add('active');

        // Modal Entrance Animation
        const content = modal.querySelector('.modal-content');
        content.style.transform = 'scale(0.8)';
        setTimeout(() => content.style.transform = 'scale(1)', 10);
    }

    window.closeProjectModal = function () {
        const modal = document.getElementById('projectModal');
        if (modal) modal.classList.remove('active');

        // Reset simulation content if any
        setTimeout(() => {
            const screen = document.getElementById('simScreen');
            if (screen) screen.remove();
            // We might want to reset the modal description to default state here if needed
        }, 300);
    }

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('projectModal');
        if (modal && e.target === modal) closeProjectModal();
    });

    /* =========================================
       18. Tilt-Shift & Mouse Parallax for Visual Layers
       ========================================= */
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;

        const aurora = document.querySelector('.aurora-bg');
        if (aurora) aurora.style.transform = `translate(${-x}px, ${-y}px) scale(1.1)`;

        const grid = document.querySelector('.grid-floor');
        if (grid) grid.style.transform = `perspective(500px) rotateX(60deg) translateX(${x}px)`;
    });

    /* =========================================
       19. Init Liquid Buttons
       ========================================= */
    // Logic handled via CSS mainly, but we can add ripple on hover enter
    document.querySelectorAll('.btn-liquid').forEach(btn => {
        btn.addEventListener('mouseenter', function (e) {
            this.style.transform = 'translateY(-3px)';
        });
        btn.addEventListener('mouseleave', function (e) {
            this.style.transform = 'translateY(0)';
        });
    });

    /* =========================================
       20. Three.js Initialization (Moved to Hero)
       ========================================= */
    function initThreeJS() {
        const container = document.getElementById('three-container');
        if (!container) return;

        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x050510); // Transparent now via CSS

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Alpha for overlay
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Geometry: Icosahedron
        const geometry = new THREE.IcosahedronGeometry(1.5, 0); // Smaller for hero
        const material = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15; // Spread out
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xff00ff
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 4;

        // Mouse Interactivity
        let mouseX = 0;
        let mouseY = 0;

        // Use window listener for hero effect
        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const animate = function () {
            requestAnimationFrame(animate);

            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.002;

            // Interaction
            sphere.rotation.x += mouseY * 0.01;
            sphere.rotation.y += mouseX * 0.01;
            particlesMesh.rotation.y = -mouseX * 0.1;

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // Attempt to init Three.js if library is loaded
    const checkThreeIter = setInterval(() => {
        if (typeof THREE !== 'undefined') {
            initThreeJS();
            clearInterval(checkThreeIter);
        }
    }, 100);

    /* =========================================
       21. O'ktamov Grapher Tool Logic
       ========================================= */
    const graphCanvas = document.getElementById('graphCanvas');
    if (graphCanvas) {
        const ctx = graphCanvas.getContext('2d');
        let width, height;
        let scale = 40; // Pixels per unit
        let offsetX = 0;
        let offsetY = 0;

        function resizeCanvas() {
            width = graphCanvas.clientWidth;
            height = graphCanvas.clientHeight;
            graphCanvas.width = width;
            graphCanvas.height = height;
            drawGraph();
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // State for input
        window.plotGraph = function () {
            drawGraph();
        }

        window.resetGraph = function () {
            scale = 40;
            offsetX = 0;
            offsetY = 0;
            document.getElementById('functionInput').value = "sin(x) * x";
            drawGraph();
        }

        window.zoomIn = function () {
            scale *= 1.2;
            drawGraph();
        }

        window.zoomOut = function () {
            scale /= 1.2;
            drawGraph();
        }

        window.setFunction = function (funcStr) {
            document.getElementById('functionInput').value = funcStr;
            drawGraph();
        }

        function drawGrid() {
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;

            const centerX = width / 2 + offsetX;
            const centerY = height / 2 + offsetY;

            // Vertical lines
            for (let x = centerX % scale; x < width; x += scale) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = centerY % scale; y < height; y += scale) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // X and Y Axes
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, height);
            ctx.stroke();
        }

        function drawGraph() {
            drawGrid();

            const funcStr = document.getElementById('functionInput').value;
            ctx.strokeStyle = '#00f3ff';
            ctx.lineWidth = 3;
            ctx.beginPath();

            const centerX = width / 2 + offsetX;
            const centerY = height / 2 + offsetY;

            let firstPoint = true;

            for (let i = 0; i < width; i++) {
                // Convert pixel x to graph x
                const x = (i - centerX) / scale;
                // Calculate y
                let y;
                try {
                    // Safe-ish eval using Function with Math context
                    // Allowing simple Math functions
                    const safeFunc = funcStr
                        .replace(/sin/g, "Math.sin")
                        .replace(/cos/g, "Math.cos")
                        .replace(/tan/g, "Math.tan")
                        .replace(/log/g, "Math.log")
                        .replace(/sqrt/g, "Math.sqrt")
                        .replace(/pi/g, "Math.PI")
                        .replace(/\^/g, "**");

                    y = new Function("x", "return " + safeFunc)(x);
                } catch (e) {
                    continue;
                }

                // Convert graph y to pixel y
                const pixelY = centerY - (y * scale);

                if (firstPoint) {
                    ctx.moveTo(i, pixelY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(i, pixelY);
                }
            }
            ctx.stroke();
        }

        // Initial Draw
        drawGraph();
    }

    /* =========================================
       22. Page Specific Logic (Auto-Detect)
       ========================================= */
    const path = window.location.pathname;

    // Contact Page: 3D Marker Follow
    if (path.includes('contact.html')) {
        const marker = document.querySelector('.location-icon');
        const container = document.querySelector('.contact-wrapper');

        if (marker && container) {
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Rotate based on mouse pos
                marker.style.transform = `rotateY(${x * 0.1}deg) rotateX(${- y * 0.1}deg)`;
            });

            container.addEventListener('mouseleave', () => {
                marker.style.transform = `rotateY(0deg) rotateX(0deg)`;
            });
        }
    }

    // Test Page: Auto Matrix Rain for "Hacker" feel
    if (path.includes('test.html')) {
        // We can trigger the existing startMatrix function
        // Need to expose it or move it out of local scope. 
        // For now, let's just trigger it via the class hack
        setTimeout(() => {
            document.body.classList.add('matrix-active');
        }, 1000);
    }

    // Global: Ensure Text Reveal triggers
    setTimeout(() => {
        document.querySelectorAll('.reveal-text').forEach(el => el.classList.add('visible'));
    }, 500);

    /* =========================================
       23. Auth UI Logic
       ========================================= */
    const updateNavAuth = () => {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        // Remote existing auth link if any
        const existingAuth = navLinks.querySelector('.auth-link');
        if (existingAuth) existingAuth.remove();

        const user = Auth.getCurrentUser();
        const authLink = document.createElement('a');
        authLink.className = 'auth-link';

        if (user) {
            authLink.innerHTML = `👤 ${user}`;
            authLink.href = '#';
            authLink.onclick = (e) => {
                e.preventDefault();
                if (confirm("Chiqishni xohlaysizmi?")) Auth.logout();
            };
        } else {
            authLink.innerHTML = '🔑 Kirish';
            authLink.href = '#';
            authLink.onclick = (e) => {
                e.preventDefault();
                openAuthModal();
            };
        }
        navLinks.appendChild(authLink);
    };

    window.openAuthModal = () => {
        let modal = document.getElementById('authModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'authModal';
            modal.className = 'auth-modal';
            modal.innerHTML = `
                <div class="auth-modal-content">
                    <span class="close-auth" onclick="document.getElementById('authModal').classList.remove('active')">×</span>
                    <h2 id="authTitle">Tizimga Kirish</h2>
                    <form id="authForm">
                        <input type="text" id="authUser" placeholder="Foydalanuvchi nomi" required>
                        <input type="tel" id="authPhone" placeholder="Telefon raqami" style="display:none">
                        <input type="password" id="authPass" placeholder="Parol" required>
                        <button type="submit" class="btn-neon">TASDIQLASH</button>
                    </form>
                    <p id="authSwitch">Hisobingiz yo'qmi? <span onclick="toggleAuthMode()">Ro'yxatdan o'tish</span></p>
                    <p id="authMsg" style="margin-top: 10px; font-size: 0.9rem;"></p>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('authForm').onsubmit = (e) => {
                e.preventDefault();
                const u = document.getElementById('authUser').value;
                const p = document.getElementById('authPass').value;
                const ph = document.getElementById('authPhone').value;
                const mode = document.getElementById('authTitle').innerText.includes('Kirish') ? 'login' : 'register';

                if (mode === 'login') {
                    const res = Auth.login(u, p);
                    if (res.success) {
                        location.reload();
                    } else {
                        const msg = document.getElementById('authMsg');
                        msg.innerText = res.message;
                        msg.style.color = 'red';
                    }
                } else {
                    if (!ph) {
                        const msg = document.getElementById('authMsg');
                        msg.innerText = "Telefon raqamini kiriting!";
                        msg.style.color = 'red';
                        return;
                    }
                    const res = Auth.register(u, p, ph);
                    const msg = document.getElementById('authMsg');
                    msg.innerText = res.message;
                    msg.style.color = res.success ? 'lime' : 'red';
                    if (res.success) {
                        setTimeout(() => toggleAuthMode(), 1500);
                    }
                }
            };
        }
        modal.classList.add('active');
    };

    window.toggleAuthMode = () => {
        const title = document.getElementById('authTitle');
        const sw = document.getElementById('authSwitch');
        const phoneInput = document.getElementById('authPhone');
        if (title.innerText.includes('Kirish')) {
            title.innerText = "Ro'yxatdan o'tish";
            sw.innerHTML = 'Hisobingiz bormi? <span onclick="toggleAuthMode()">Kirish</span>';
            phoneInput.style.display = 'block';
            phoneInput.required = true;
        } else {
            title.innerText = "Tizimga Kirish";
            sw.innerHTML = 'Hisobingiz yo\'qmi? <span onclick="toggleAuthMode()">Ro\'yxatdan o\'tish</span>';
            phoneInput.style.display = 'none';
            phoneInput.required = false;
        }
    };

    updateNavAuth();

});
