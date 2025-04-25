
/*****Formulaire permettant à l'utilisateur de se log******* */

//Event permettant de vérifier les entrées et d'envoyer les informations à l'API
//Pour rappel |sophie.bluel@test.tld|S0phie|

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
                if (response.ok === true) {
                    // Si la réponse de l'API est valide on connecte l'utilisateur
                    //Et on stocke ses données dans le localStorage
                    const data = await response.json();
                    console.log("Données reçues du serveur :", data);
                    console.log("Utilisateur connecté !");
                    localStorage.setItem("token", data.token);
                   window.location.href = "index.html"; 
                } else {
                    alert("identifiants incorrects");
                }
            } catch (error) {
                alert("Une erreur est survenue, veuillez réessayer plus tard.");
            }
        });
    }
    loginForm();
});