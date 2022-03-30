document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // Waiting for email to be submitted
  document.querySelector('#compose-form').onsubmit = send_email;
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-emails').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
} 

function send_email() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
      })
    })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
    })
  load_mailbox('sent')
  return false;
  }

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-emails').style.display = 'none';
  document.querySelector('#view-emails').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(result => {
    result.forEach(email => {
      const newelement = document.createElement('div');
      newelement.innerHTML = `${email.sender} sent ${email.subject} at ${email.timestamp}`;
      newelement.style.border = "0.1px solid";
      newelement.style.margin = "5px";
      if (email.read === false) {
          newelement.style.backgroundColor = "gray"
        } else {
        newelement.style.backgroundColor = "white"
        }
      newelement.addEventListener('click', () => {
        view_email(email);
      })
      document.querySelector('#emails-view').append(newelement);
    });
  });
}

function view_email(email) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-emails').style.display = 'block';
  const newelement = document.createElement('div');
  newelement.innerHTML = `${email.sender} sent ${email.subject} that says ${email.body}`;
  document.querySelector('#view-emails').append(newelement);
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: false
    })
  })
}