  document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");

    const reservationForm = document.getElementById('reservationForm');
    console.log("Form found:", reservationForm);

    if (reservationForm) {
      reservationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log("Form submitted");

        const data = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          date: document.getElementById('date').value,
          time: document.getElementById('time').value,
          guests: document.getElementById('guests').value,
          'special-requests': document.getElementById('special-requests').value
        };

        console.log("Sending data:", data);

        fetch('http://localhost:3000/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
          })
          .then(data => {
            console.log("Success:", data);
            alert(data.message);
            reservationForm.reset(); // Clear form
            window.location.href = '/';
          })
          .catch(error => {
            console.error('Error submitting reservation:', error);
            alert('An error occurred. Please try again later.');
          });
      });
    } else {
      console.warn("reservationForm not found");
    }
  });
