getCategories()
createWorks();


//fetch des travaux à afficher
async function getWorks() {
    const url = 'http://localhost:5678/api/works';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
   
      return json;
      

    } catch (error) {
      console.error(error.message);

    }

}

//fetch des catégories

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
 
    return json;
    

  } catch (error) {
    console.error(error.message);

  }
  

}


//Affichage global
async function createWorks() {
   
  const works = await getWorks()
  const gallery = document.querySelector(".gallery")


  if (!gallery) {
    console.error("Élément .gallery introuvable dans le DOM");
    return;
}

// On vide la galerie avant d'ajouter les nouvelles figures
gallery.innerHTML = "";

if (works.length === 0) {
    gallery.innerHTML = "<p>Aucun projet trouvé.</p>";
    return;
}
  works.forEach(work => {
    const figure = document.createElement("figure");
    const image = document.createElement("img")
    image.src = work.imageUrl
    image.alt = work.title
    const figcaption = document.createElement("figcaption")
    figcaption.innerHTML = work.title;
    
    figure.appendChild(image);
    figure.appendChild(figcaption)
    gallery.appendChild(figure);

})
    

    const filters = document.getElementById("filters")
    const categories = await getCategories();

    

      //// Création séparée du bouton "Tous"
      const allButton = document.createElement("button")
      allButton.dataset.categoryId = 0;
      allButton.innerHTML = "Tous";
      filters.appendChild(allButton);

       

  
      // Création des boutons par récupération des catégories via fetch
      categories.forEach(category => {
      const button = document.createElement("button")
      button.dataset.categoryId = category.id;
      button.innerHTML = category.name;
      filters.appendChild(button);



        button.addEventListener("click", function(e) {
        console.log(e)

// ParseInt me renvoie un entier, target me renvoie le nombre correspondant au dataset 
// que j'ai ajouté à mon button, qui est le works.categoryId du boutton cliqué
        const categoryId = parseInt(e.target.dataset.categoryId);
// renommer targetCategoryId ?
        console.log(categoryId);
//Je demande si categoryId (l'ID obtenue au click) est égal à 0, si oui on affiche tout.
//Si non, on utilise la fonction filter pour me renvoyer les objets correspondants dans le tableau work
        const filteredWork = categoryId === 0 ? works : works.filter(work => work.categoryId === categoryId)
      
        updateGallery(filteredWork)
         })

         function updateGallery(filteredWork) {
         const gallery = document.querySelector(".gallery")
         gallery.innerHTML = "";
      
         filteredWork.forEach(work => {
          const figure = document.createElement("figure");
          const image = document.createElement("img");
          image.src = work.imageUrl;
          image.alt = work.title;
          const figcaption = document.createElement("figcaption");
          figcaption.innerHTML = work.title;
  
          figure.appendChild(image);
          figure.appendChild(figcaption);
          gallery.appendChild(figure);

         }
         )
         }


         // Au click sur le bouton "Tous", l'ensemble du tableau works est appelé
         allButton.addEventListener("click", function () {
          updateGallery(works);  // Affiche tous les travaux
        }); 

        //Ajout d'une classe aux boutons pour le css 
        button.classList.add("buttons");
        allButton.classList.add("buttons");

        
    
      filters.appendChild(button);
    
      filters.addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON") {
            // Supprimer la classe active de tous les boutons
            document.querySelectorAll("#filters button").forEach(btn => btn.classList.remove("active-filter"));
    
            // Ajouter la classe active uniquement au bouton cliqué
            e.target.classList.add("active-filter");
        }
    });
 
    
    }) 


  
   }

 
 



   document.getElementById("login-button").addEventListener("click", function() {
    window.location.href = "login.html";
   })

   document.getElementById("index-button").addEventListener("click", function() {
    window.location.href = "index.html";
   })



   /*
   document.addEventListener("DOMContentLoaded", function () {
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
            const response = await fetch("http://localhost:5678/api/login", {
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

                // Rediriger vers la page d'administration ou une autre page
                window.location.href = "admin.html";
            } else {
                alert("Identifiants incorrects !");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Une erreur est survenue, veuillez réessayer plus tard.");
        }
    });
});

*/



  


        