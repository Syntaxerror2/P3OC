const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


function loginForm() {
    const submit = document.getElementById("login-form");
    submit.addEventListener("submit", async function(event) {
        event.preventDefault();
        const email = document.querySelector("[name=email]").value;
        const password = document.querySelector("[name=password]").value
        console.log(email);
        console.log(password);
        
        if(!email || !password ) {
            alert("Veuillez remplir tous les champs")
            return;
        } else if(!validateEmail(email)) {
            alert("Veuillez rentrer une adresse mail valide")
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
            console.log(data);

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
  
  
  })

}

loginForm();

