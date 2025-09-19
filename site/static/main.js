document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;

    const pickupDate = document.getElementById('pickupDate');
    if (pickupDate) pickupDate.min = minDate;

   
    const packageDate = document.getElementById('packageDate');
    if (packageDate) packageDate.min = minDate;


 

});


