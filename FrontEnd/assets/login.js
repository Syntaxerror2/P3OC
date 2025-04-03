export function loginForm() {
    const submit = document.querySelector("#connect-button");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nomRegex = /^[A-ZÀ-Ÿ][a-zà-ÿ'-]{1,49}$/;
    submit.addEventListener("submit", function(event) {
        const userlogs = {
         email: event.target.document.querySelector("[name=email]").value,
         password: event.target.document.querySelector("[name=password]").value   
        };


//Creation de la charge utile au format json
const chargeUtile = JSON.stringify(userlogs);
    })
fetch("http://localhost:5678/api/users/login", {
method: "POST",
accept: 'application/json', 
headers: {"content-type":  "application/json"}


})
}



  /*

  export function loginForm() {
    const submit = document.querySelector("#connect-button");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
  
  
  }
   document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Empêche la soumission classique du formulaire

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Stocker le token dans le localStorage
                localStorage.setItem("token", data.token);
            window.location.href = "index.html";
            } else if(email !== emailRegex) {
                alert("Identifiants incorrects !");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Une erreur est survenue, veuillez réessayer plus tard.");
        }
    });
});

*/

