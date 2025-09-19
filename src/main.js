// Generate time slots (every 30 minutes)
function generateTimeSlots() {
  const times = [];
  for (let h = 0; h < 24; h++) {
    [0, 30].forEach(m => {
      let hr = h % 12 || 12;
      let ampm = h >= 12 ? "PM" : "AM";
      times.push({
        value: `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`,
        display: `${hr}:${m === 0 ? "00" : "30"} ${ampm}`
      });
    });
  }
  return times;
}

// Create time dropdown
function setupTimePicker(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  dropdown.innerHTML = "";
  generateTimeSlots().forEach((slot, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dropdown-item";
    btn.textContent = slot.display;
    btn.onclick = () => {
      input.value = slot.display;
      input.dataset.time = slot.value;
      dropdown.classList.remove("show");
    };
    dropdown.appendChild(btn);
  });

  const toggle = () => {
    document.querySelectorAll(".time-dropdown").forEach(d => d.classList.remove("show"));
    dropdown.classList.toggle("show");
  };

  input.onclick = e => { e.stopPropagation(); toggle(); };
  input.closest(".input-group")?.querySelector(".time-icon-btn")?.addEventListener("click", e => {
    e.stopPropagation();
    toggle();
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  // date functionality unchanged
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;
  ["pickupDate", "packageDate"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.min = minDate;
  });

  // time pickers
  setupTimePicker("pickupTime", "pickupTimeDropdown");
  setupTimePicker("packageTime", "packageTimeDropdown");

  // close when clicking outside
  document.addEventListener("click", () =>
    document.querySelectorAll(".time-dropdown").forEach(d => d.classList.remove("show"))
  );
});
