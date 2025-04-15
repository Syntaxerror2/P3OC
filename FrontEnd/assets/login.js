
const validateEmail = (email) => { 
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

document.addEventListener("DOMContentLoaded", function () {
    function loginForm() {
        const submit = document.getElementById("login-form");

        submit.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            console.log("Tentative de connexion avec :", email, password);

            if (!email || !password) {
                alert("Veuillez remplir tous les champs");
                return;
            }

            try {
                let response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });
                console.log(response);
                if (response.ok === true) {
                    // Connexion réussie
                    const data = await response.json();
                    console.log("Données reçues du serveur :", data);
                    console.log("Utilisateur connecté !");
                    localStorage.setItem("token", data.token);
                   window.location.href = "index.html"; 
                } else {
                    
                    
                  
                    alert("identifiants incorrects");
                }
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
                alert("Une erreur est survenue, veuillez réessayer plus tard.");
            }
        });
    }
    loginForm();
});





// A compléter

  //Recuperation des données utilisateurs

  function signInForm() {
    // async ?
      const loginForm = document.getElementById(".sign-in");
      loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const user = {
        name: event.target.document.querySelector("[name=name]").value,
        email: event.target.document.querySelector("[name=email]").value,
        message: event.target.document.querySelector("[name=message]").value
      }
    //Création de la charge utile au format JSON
  
      })
    }