function generateTimeSlots(selectedDate) {
  const times = [];
  const now = new Date();
  const isToday = selectedDate &&
                  selectedDate.toDateString() === now.toDateString();

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

function setupDateTimePicker({dateId, timeId, dropdownId}) {
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

  setupDateTimePicker({dateId:"pickupDate", timeId:"pickupTime", dropdownId:"pickupTimeDropdown"});
  setupDateTimePicker({dateId:"packageDate", timeId:"packageTime", dropdownId:"packageTimeDropdown"});

  // Close all dropdowns when clicking outside
  document.addEventListener("click", () => 
    document.querySelectorAll(".time-dropdown").forEach(d => d.classList.remove("show"))
  );
});
