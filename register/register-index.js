// 1. hente ut navn, epost og passord fra det brukeren har skrevet på html'en
// 2. send informasjonen vi har hentet ut til api'et for å registrere bruker
// 2a. hvis det ikke går bra, vis feilmelding til brukeren (gi de hjelp?)
// 2b. hvis det gikk bra, så sende call til api for å logge in brukeren
// 3. hvis brukeren fikk logget inn, samme oppførsel som på log in siden, hvis ikke, sende til log in siden. 

import { logInUser, registerNewUser } from "../js/authenticate-api.js";


const registerForm = document.querySelector("#registerForm");


registerForm.addEventListener("submit", event => {
    event.stopPropagation();
    event.preventDefault();
    if(registerForm.checkValidity()) {
        const nameInput = document.querySelector("#nameInput").value;
        const emailInput = document.querySelector("#emailInput").value;
        const passwordInput = document.querySelector("#pwInput").value;
        registerNewUser(nameInput, emailInput, passwordInput).then(registrationErrors => {
            if(registrationErrors.length === 0) {
                logInUser(emailInput, passwordInput).then(successfulLogin => {
                    if(successfulLogin) {
                        window.location = "/profile"
                    } else {
                        window.location = "/"
                    }
                }).catch(error => {

                    window.location = "/"
                    console.error(error);
                });
            } else {
                const concatenatedErrors = registrationErrors.join(", ");
                const registrationError = document.querySelector("#registrationError");
                registrationError.innerHTML = concatenatedErrors;
                registrationError.classList.remove("d-none");
                setTimeout(() => {
                    registrationError.classList.add("d-none");
                }, 3000);
            }
        }).catch(error => {
                const registrationError = document.querySelector("#registrationError");
                registrationError.innerHTML = "Unable to register user, please try again later";
                registrationError.classList.remove("d-none");
                console.error(error);
                
        });
    } else {
        registerForm.classList.add('was-validated');
    }
}) 