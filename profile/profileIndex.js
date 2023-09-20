import { isAuthenticated } from "../js/authenticate.js";

if(!isAuthenticated()) {
    window.location = "/"
}