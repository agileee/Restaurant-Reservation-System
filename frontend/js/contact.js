document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
      name: form.elements['name'].value,
      email: form.elements['email'].value,
      subject: form.elements['subject'].value,
      message: form.elements['message'].value
    };

    fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        alert(data.message);
        form.reset();
      })
      .catch(error => {
        console.error('Error submitting contact message:', error);
        alert('There was a problem sending your message. Please try again later.');
      });
  });
});
