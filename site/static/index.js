
document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const tabType = this.getAttribute('data-tab');
            handleTabSwitch(tabType);
        });
    });

    function handleTabSwitch(tabType) {
        const form = document.querySelector('.booking-form');
        switch (tabType) {
            case 'cab':
                console.log('Switched to cab booking');
                break;
            case 'pickup':
                console.log('Switched to pickup');
                break;
            case 'package':
                console.log('Switched to package');
                break;
        }
    }

    // Book Now button functionality
    const bookNowBtn = document.querySelector('.book-now-btn');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function () {
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Booking...';
            this.disabled = true;
            setTimeout(() => {
                alert('Booking confirmed! Your taxi will arrive shortly.');
                this.innerHTML = 'Book Now';
                this.disabled = false;
            }, 2000);
        });
    }

    // City dropdown
    const cityDropdown = document.querySelector('.dropdown-toggle');
    const cityItems = document.querySelectorAll('.dropdown-item');
    cityItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedCity = this.textContent;
            cityDropdown.textContent = selectedCity;
            updateContactInfo(selectedCity);
        });
    });

    function updateContactInfo(city) {
        const phoneNumber = document.querySelector('.phone-number');
        const contactNumbers = {
            'Chennai': '044 2888 0000',
            'Bangalore': '080 23456765',
            'Kolkata': '033 56712345',
            'Mumbai': '022 82314377'
        };
        if (contactNumbers[city]) {
            phoneNumber.textContent = contactNumbers[city];
        }
    }

    // Form validation
    function validateForm() {
        const mobileNumber = document.querySelector('input[type="tel"]').value;
        const fromLocation = document.querySelector('input[value="Nungambakkam"]').value;
        if (!mobileNumber || !fromLocation) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    }

    // Map marker hover interactions
    function initializeMapInteractions() {
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            marker.addEventListener('mouseenter', function () {
                this.style.transform = this.classList.contains('start-marker')
                    ? 'translate(-50%, -50%) scale(1.1)'
                    : 'translate(50%, -50%) scale(1.1)';
            });
            marker.addEventListener('mouseleave', function () {
                this.style.transform = this.classList.contains('start-marker')
                    ? 'translate(-50%, -50%) scale(1)'
                    : 'translate(50%, -50%) scale(1)';
            });
        });
    }
    initializeMapInteractions();

    // Responsive sidebar + map
    function handleResize() {
        const sidebar = document.querySelector('.booking-sidebar');
        const mapContainer = document.querySelector('.map-container');
        if (window.innerWidth < 992) {
            sidebar.style.position = 'relative';
            mapContainer.style.height = '400px';
        } else {
            sidebar.style.position = 'static';
            mapContainer.style.height = '100%';
        }
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    // Smooth scrolling mobile
    if (window.innerWidth < 768) {
        const bookingForm = document.querySelector('.booking-form-container');
        if (bookingForm) bookingForm.style.scrollBehavior = 'smooth';
    }

    // Simulated real-time price updates
    function simulateRealTimeUpdates() {
        const priceElement = document.querySelector('.price-main');
        const originalPrice = '₹ 1200.00';
        if (!priceElement) return;
        setInterval(() => {
            const variation = Math.random() * 100 - 50;
            const newPrice = 1200 + variation;
            priceElement.textContent = `₹ ${newPrice.toFixed(2)}`;
            setTimeout(() => {
                priceElement.textContent = originalPrice;
            }, 3000);
        }, 30000);
    }
    simulateRealTimeUpdates();
});

// Tab content switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tab = this.getAttribute('data-tab');
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.style.display = pane.id === tab ? 'block' : 'none';
            pane.classList.toggle('active', pane.id === tab);
        });
    });
});

// Utility functions
function formatPhoneNumber(number) {
    return number.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
}
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function updateEstimatedTime(distance) {
    const averageSpeed = 30;
    return Math.round((distance / averageSpeed) * 60);
}

function generateTimeSlots(selectedDate) {
    const times = [];
    const now = new Date();
    const isToday = selectedDate && selectedDate.toDateString() === now.toDateString();
    for (let h = 0; h < 24; h++) {
        [0, 30].forEach(m => {
            const slotDate = new Date();
            slotDate.setHours(h, m, 0, 0);
            if (isToday && slotDate.getTime() <= now.getTime() + 10 * 60 * 1000) return;
            const hr = h % 12 || 12;
            const ampm = h >= 12 ? "PM" : "AM";
            times.push({
                value: `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`,
                display: `${hr}:${m === 0 ? "00" : "30"} ${ampm}`
            });
        });
    }
    return times;
}

function setupDateTimePicker({ dateId, timeId, dropdownId }) {
    const dateInput = document.getElementById(dateId);
    const timeInput = document.getElementById(timeId);
    const dropdown = document.getElementById(dropdownId);
    if (!dateInput || !timeInput || !dropdown) return;

    const renderDropdown = () => {
        dropdown.innerHTML = "";
        const selectedDate = dateInput.value ? new Date(dateInput.value) : null;
        generateTimeSlots(selectedDate).forEach(slot => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "dropdown-item";
            btn.textContent = slot.display;
            btn.onclick = () => {
                timeInput.value = slot.display;
                timeInput.dataset.time = slot.value;
                dropdown.classList.remove("show");
            };
            dropdown.appendChild(btn);
        });
    };

    const toggleDropdown = () => {
        document.querySelectorAll(".time-dropdown").forEach(d => d.classList.remove("show"));
        renderDropdown();
        dropdown.classList.toggle("show");
    };

    timeInput.onclick = e => { e.stopPropagation(); toggleDropdown(); };
    timeInput.closest(".input-group")?.querySelector(".time-icon-btn")?.addEventListener("click", e => {
        e.stopPropagation();
        toggleDropdown();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const minDate = `${yyyy}-${mm}-${dd}`;
    const maxDate = `${yyyy}-12-31`;

    ["pickupDate", "packageDate"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.min = minDate;
            el.max = maxDate;
        }
    });

    setupDateTimePicker({ dateId: "pickupDate", timeId: "pickupTime", dropdownId: "pickupTimeDropdown" });
    setupDateTimePicker({ dateId: "packageDate", timeId: "packageTime", dropdownId: "packageTimeDropdown" });

    document.addEventListener("click", () =>
        document.querySelectorAll(".time-dropdown").forEach(d => d.classList.remove("show"))
    );
});
