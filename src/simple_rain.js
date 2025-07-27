
class SimpleRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.raindrops = [];
        this.mouse = {x: 0, y: 0};

        this.canvas.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: -1;
                    pointer-events: none;
                `;

        document.body.appendChild(this.canvas);
        this.resize();
        this.createRain();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createRain() {
        for (let i = 0; i < 100; i++) {
            this.raindrops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 1,
                length: Math.random() * 20 + 10,
                opacity: Math.random() * 0.5 + 0.3,
                vx: 0,
                vy: 0
            });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('resize', () => this.resize());
    }

    update() {
        this.raindrops.forEach(drop => {
            const dx = drop.x - this.mouse.x;
            const dy = drop.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 60) {
                const force = (60 - distance) / 60;
                drop.vx += (dx / distance) * force * 2;
                drop.vy += (dy / distance) * force * 2;
            } else {
                drop.vx *= 0.95;
                drop.vy *= 0.95;
            }

            drop.x += drop.vx;
            drop.y += drop.speed + drop.vy;

            if (drop.y > this.canvas.height + 20 ||
                drop.x < -20 ||
                drop.x > this.canvas.width + 20) {
                drop.x = Math.random() * this.canvas.width;
                drop.y = -20;
                drop.vx = 0;
                drop.vy = 0;
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.raindrops.forEach(drop => {
            this.ctx.strokeStyle = `rgba(173, 216, 230, ${drop.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.stroke();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SimpleRain();
});