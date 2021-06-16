const clearInput = (input) => {
  input.value = "";
};


document.addEventListener('DOMContentLoaded', (event) => {
  const element = document.getElementById('submitContactFrom');
  if (element) {
    element.addEventListener("click", function(event) {
      event.preventDefault();
      var url = 'https://hooks.zapier.com/hooks/catch/4061147/bogoyci/silent'
      const firstName = document.getElementById('first-name');
      const lastName = document.getElementById('last-name');
      const email = document.getElementById('email');
      const projet = document.getElementById('projet');
      var url = url + `?email=${email.value}`
      var url = url + `&first-name=${firstName.value}`
      var url = url + `&last-name=${lastName.value}`
      var url = url + `&projet=${projet.value}`
      fetch(url)
        .then(response => {
          console.log(response);
          clearInput(firstName);
          clearInput(lastName);
          clearInput(email);
          clearInput(projet);
          window.alert("Votre message a bien été envoyé");
        });
    }, false);
  }
})
