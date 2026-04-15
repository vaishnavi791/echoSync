document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    const proceedBtn = document.querySelector('.proceed-btn');
    proceedBtn.addEventListener('click', () => {
        alert("Initializing path to Concourse B... Recalculating route.");
    });

    // AR Canvas Logic
    const activateBtn = document.getElementById('activate-ar-btn');
    const arVideo = document.getElementById('ar-video');
    const arCanvas = document.getElementById('ar-canvas');
    if (!activateBtn || !arVideo || !arCanvas) return;
    const ctx = arCanvas.getContext('2d');

    let animationId;
    let startTime;
    let arActive = false;

    function resizeCanvas() {
        if (arCanvas.parentElement) {
            arCanvas.width = arCanvas.parentElement.clientWidth;
            arCanvas.height = arCanvas.parentElement.clientHeight;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawARInteraction(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        ctx.clearRect(0, 0, arCanvas.width, arCanvas.height);
        
        const w = arCanvas.width;
        const h = arCanvas.height;

        // 4. Scanning corner brackets
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 4;
        const armLength = 30;
        const padding = 20;

        ctx.beginPath();
        // Top Left
        ctx.moveTo(padding, padding + armLength); ctx.lineTo(padding, padding); ctx.lineTo(padding + armLength, padding);
        // Top Right
        ctx.moveTo(w - padding - armLength, padding); ctx.lineTo(w - padding, padding); ctx.lineTo(w - padding, padding + armLength);
        // Bottom Left
        ctx.moveTo(padding, h - padding - armLength); ctx.lineTo(padding, h - padding); ctx.lineTo(padding + armLength, h - padding);
        // Bottom Right
        ctx.moveTo(w - padding - armLength, h - padding); ctx.lineTo(w - padding, h - padding); ctx.lineTo(w - padding, h - padding - armLength);
        ctx.stroke();

        const pulse = (Math.sin(elapsed * Math.PI / 500) + 1) / 2; // cycles every second

        // 1. Animated Green Directional Arrows
        ctx.fillStyle = `rgba(16, 185, 129, ${0.4 + pulse * 0.6})`;
        ctx.save();
        ctx.translate(w / 2, h / 2 + 30);
        for (let i = 0; i < 3; i++) {
            const yOffset = -i * 30 + (pulse * 15);
            ctx.beginPath();
            ctx.moveTo(-20, yOffset + 10);
            ctx.lineTo(0, yOffset - 10);
            ctx.lineTo(20, yOffset + 10);
            ctx.lineTo(20, yOffset + 15);
            ctx.lineTo(0, yOffset - 5);
            ctx.lineTo(-20, yOffset + 15);
            ctx.fill();
        }
        ctx.restore();

        // 2. Floating Label (Purple Box)
        ctx.save();
        ctx.translate(w / 2, h / 2 - 80);
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(-100, -20, 200, 40);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.font = '700 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("→ CONCOURSE B — 40m", 0, 0);
        ctx.restore();

        // 3. Seat Highlight Circle
        ctx.save();
        ctx.translate(w - 90, 80);
        // Outer ring
        ctx.beginPath();
        ctx.arc(0, 0, 30 + pulse * 10, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.3 - pulse * 0.3})`;
        ctx.fill();
        // Inner circle
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#8b5cf6';
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 20;
        ctx.fill();
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("YOUR SEAT:", 0, 45);
        ctx.fillText("142-F", 0, 60);
        ctx.restore();

        if (arActive) {
            animationId = requestAnimationFrame(drawARInteraction);
        }
    }

    activateBtn.addEventListener('click', () => {
        if (!arActive) {
            arActive = true;
            activateBtn.innerText = "DEACTIVATE AR";
            activateBtn.style.background = "var(--purple)";
            arVideo.play().catch(e => console.log("Video autoplay blocked", e));
            startTime = null;
            resizeCanvas();
            animationId = requestAnimationFrame(drawARInteraction);
        } else {
            arActive = false;
            activateBtn.innerText = "ACTIVATE AR";
            activateBtn.style.background = "transparent";
            arVideo.pause();
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, arCanvas.width, arCanvas.height);
        }
    });

    // Alert Dismiss Logic
    const dismissBtns = document.querySelectorAll('.dismiss-btn');
    dismissBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.alert-card');
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateX(20px)';
                setTimeout(() => card.remove(), 300);
            }
        });
    });
});
