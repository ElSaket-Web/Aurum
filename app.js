document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configurator Page Logic ---
    const configForm = document.getElementById('configForm');
    const successDialog = document.getElementById('successDialog');
    const closeDialogBtn = document.getElementById('closeDialogBtn');
    
    const swatches = document.querySelectorAll('.swatch');
    const carBaseImg = document.getElementById('carBaseImg');
    const colorNameDisplay = document.getElementById('colorNameDisplay');
    const selectedColorInput = document.getElementById('selectedColor');
    const colorPriceInput = document.getElementById('colorPrice');
    
    const trimSelect = document.getElementById('trimSelect');
    const wheelsSelect = document.getElementById('wheelsSelect');
    const interiorSelect = document.getElementById('interiorSelect');
    const priceOutputDisplay = document.getElementById('priceOutputDisplay');

    function updateTotalPrice() {
        if (!trimSelect || !colorPriceInput || !priceOutputDisplay) return;
        const trimPrice = parseInt(trimSelect.value) || 0;
        const paintPrice = parseInt(colorPriceInput.value) || 0;
        const wheelsPrice = wheelsSelect ? (parseInt(wheelsSelect.value) || 0) : 0;
        const interiorPrice = interiorSelect ? (parseInt(interiorSelect.value) || 0) : 0;
        
        const total = trimPrice + paintPrice + wheelsPrice + interiorPrice;
        priceOutputDisplay.textContent = total.toLocaleString();
    }

    if (swatches.length > 0) {
        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                // Remove active class
                swatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');

                // Update Visuals via CSS Filter
                const hueFilter = swatch.getAttribute('data-hue');
                const colorName = swatch.getAttribute('data-name');
                const colorPrice = swatch.getAttribute('data-price');
                
                if(carBaseImg) {
                    if (hueFilter.includes('grayscale')) {
                        carBaseImg.style.filter = hueFilter;
                    } else {
                        carBaseImg.style.filter = `hue-rotate(${hueFilter})`;
                    }
                }
                
                if(colorNameDisplay) colorNameDisplay.textContent = colorName;
                
                // Update Form Data
                if(selectedColorInput) selectedColorInput.value = colorName;
                if(colorPriceInput) {
                    colorPriceInput.value = colorPrice;
                    updateTotalPrice();
                }
            });
        });
    }

    if (trimSelect) trimSelect.addEventListener('change', updateTotalPrice);
    if (wheelsSelect) wheelsSelect.addEventListener('change', updateTotalPrice);
    if (interiorSelect) interiorSelect.addEventListener('change', updateTotalPrice);

    if (configForm && successDialog) {
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fullName').value;
            const color = document.getElementById('selectedColor').value;
            document.getElementById('dialogMsg').innerText = `Your bespoke E-GT in ${color} has been logged in our system, ${name}. A concierge will contact you shortly.`;
            successDialog.showModal();
            configForm.reset();
            // Reset to default visually
            if(swatches[0]) swatches[0].click(); 
        });

        closeDialogBtn.addEventListener('click', () => {
            successDialog.close();
        });
    }

    // --- Portal Page (Canvas & Template/Toast) ---
    const diagCanvas = document.getElementById('diagCanvas');
    if (diagCanvas) {
        const ctx = diagCanvas.getContext('2d');
        let width = diagCanvas.width = diagCanvas.offsetWidth;
        let height = diagCanvas.height = diagCanvas.offsetHeight;
        let t = 0;

        function drawTelemetry() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = '#00E5FF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < width; i++) {
                let y = height / 2 + Math.sin(i * 0.05 + t) * (Math.random() * 20 + 20);
                if (i === 0) ctx.moveTo(i, y);
                else ctx.lineTo(i, y);
            }
            ctx.stroke();

            ctx.fillStyle = '#D4AF37';
            ctx.font = '12px Space Grotesk';
            ctx.fillText(`RPM: ${Math.floor(8000 + Math.random()*200)}`, 10, 20);
            ctx.fillText(`Torque Output: ${Math.floor(1500 + Math.random()*50)} Nm`, 10, 40);

            t += 0.15;
            requestAnimationFrame(drawTelemetry);
        }
        
        window.addEventListener('resize', () => {
            width = diagCanvas.width = diagCanvas.offsetWidth;
            height = diagCanvas.height = diagCanvas.offsetHeight;
        });

        drawTelemetry();

        setTimeout(() => {
            showToast("System Check: All modules online.");
        }, 1500);
    }

    // Toast Notification logic
    function showToast(message) {
        const template = document.getElementById('toast-template');
        const container = document.getElementById('toast-container');
        if (template && container) {
            const clone = template.content.cloneNode(true);
            const toastDiv = clone.querySelector('div');
            clone.querySelector('.toast-msg').textContent = message;
            
            clone.querySelector('.toast-close').addEventListener('click', (e) => {
                e.target.closest('.glass-panel').remove();
            });

            container.appendChild(clone);
            
            setTimeout(() => {
                if (toastDiv.parentNode) {
                    toastDiv.remove();
                }
            }, 5000);
        }
    }
});
