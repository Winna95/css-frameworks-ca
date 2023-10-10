import { logInUser } from "./js/authenticate-api.js" 

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.needs-validation')

/**
 * Adds submit event listeners to a list of forms to handle login actions.
 *
 * @param {NodeList} forms - The list of HTML form elements to attach event listeners to.
 */
Array.from(forms).forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity()) {
      const emailInput = document.querySelector("#emailInput").value;
      const passwordInput = document.querySelector("#pwInput").value;
      logInUser(emailInput, passwordInput).then(sucessfulLogin => {
        if(sucessfulLogin === true) {
          window.location = "/profile"
        } else {
          form.classList.remove('was-validated');
          document.querySelector("#loginError").classList.remove("d-none");
        }
      })
      setTimeout(() => {
        document.querySelector("#loginError").classList.add("d-none");
    }, 3000);
      
    } else {
      form.classList.add('was-validated')
    }

  }, false)
})






