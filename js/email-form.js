// email_form.js
emailjs.init('e_qjk3cLqcaE2CrFT');

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const params = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    emailjs.send('service_g4rziic', 'template_n0s009a', params)
      .then(function() {
          alert('Message sent successfully!');
          document.getElementById('contact-form').reset();
      }, function(error) {
          alert('Failed to send message: ' + JSON.stringify(error));
      });
});
