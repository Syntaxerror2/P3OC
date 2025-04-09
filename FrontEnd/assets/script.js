


getCategories()
createWorks();

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("deletedWork"); // Reset les projets supprimés

  // Tu peux éventuellement appeler les fonctions ici si besoin
  // createWorks();
  // modaleDisplay();
});

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
   
  const allWorks = await getWorks();
  const deletedWorks = getDeleteWork();
  console.log(deletedWorks);
  //On filtre les projets 
  const works = allWorks.filter(work => !deletedWorks.includes(work.id)); 
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

//Affichage dynamique en récupérant chaque propriété du fetch
  works.forEach(work => {
    const figure = document.createElement("figure");
    const image = document.createElement("img")
    image.src = work.imageUrl
    image.alt = work.title
    const figcaption = document.createElement("figcaption")
    figcaption.innerHTML = work.title;
    console.log(work);
    figure.appendChild(image);
    figure.appendChild(figcaption)
    gallery.appendChild(figure);

})

    

    const filters = document.getElementById("filters")
    const categories = await getCategories();

    

//// Création séparée du bouton "Tous"
      const allButton = document.createElement("button")
      allButton.dataset.categoryId = 0;
      allButton.innerHTML = "Tous"
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
        console.log(categoryId);
//Je demande si categoryId (l'ID obtenue au click) est égal à 0, si oui on affiche tout.
//Si non, on utilise la fonction filter pour afficher les objets correspondants dans le tableau work
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
         )}
         // Au click sur le bouton "Tous", l'ensemble du tableau works est appelé
         allButton.addEventListener("click", function () {
          updateGallery(works);  // Affiche tous les travaux
        }); 





        //Ajout d'une classe aux boutons pour le css 
        button.classList.add("buttons");
        allButton.classList.add("buttons");
        filters.appendChild(button);

      //Ajout d'un effet sur les filtres lors de leur selection
    
      filters.addEventListener("click", function (e) {
        if (e.target.className === "buttons") {
            // Supprimer la classe active de tous les boutons
            document.querySelectorAll(".buttons").forEach(btn => btn.classList.remove("active-filter"));
          //  querySelectorAll("#filters button")
            // Ajouter la classe active uniquement au bouton cliqué
            e.target.classList.add("active-filter");
        }

        const test1 = document.querySelectorAll(".buttons")
        const test2 = document.querySelector(".buttons")
        console.log(test1);
        console.log(test2);
    });
 
    
    }) 


  
   }

   //Lien vers les pages au clic

   document.getElementById("login-button").addEventListener("click", function() {
    window.location.href = "login.html";
   })

   document.getElementById("index-button").addEventListener("click", function() {
    window.location.href = "index.html";
   })


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



// On permet à l'utilisateur de se log out en supprimant
// les données obtenues dans le localStorage

document.addEventListener("DOMContentLoaded", function () {
  const authentification = document.getElementById("authentification");

  function checkLogIn() {
      const user = localStorage.getItem("user");

      if (user) {
        authentification.textContent = "Log out";
        authentification.href = "#";
        const button = document.getElementById("modify");
        button.classList.remove("no-display-button"); // Ajoute le bouton "modifier" à la connexion
        authentification.addEventListener("click", function (event) {
              event.preventDefault();
              logout();
          });
      } else {
        authentification.textContent = "Log in";
        authentification.href = "login.html"; // Redirige vers la page de connexion
      }
  }

  function logout() {
      localStorage.removeItem("user");
      alert("Vous avez été déconnecté !");
      window.location.reload();
  }

  checkLogIn();
});


function addModale() {
  
  const modale = document.getElementById("myModal");
  const span = document.querySelector(".close");
  const button = document.getElementById("modify");
// Quand on clique sur le bouton, on ouvre la modale
  button.onclick = function() {
    modale.style.display = "block";
  }
  // quand l'utilisateur clique sur la croix on ferme la fenêtre modale
  span.onclick = function() {
    modale.style.display = "none";
  }
  // quand l'utilisateur clique en dehors de la modale, one ferme la fenêtre
  window.onclick = function(event) {
    if (event.target == modale) {
      modale.style.display = "none";
    }
  }
}
addModale();

async function modaleDisplay() {
  const modaleGallery = document.querySelector(".modal-main-display");
  const works = await getWorks()
  const deletedWork = getDeleteWork();
  const filteredWorks = works.filter(work => !deletedWork.includes(work.id));

  modaleGallery.innerHTML = "";

 //works.forEach(work => {
  filteredWorks.forEach(work => {
// Création d'une div qui contient l'icone et l'image
const divProjets = document.createElement("div");
modaleGallery.appendChild(divProjets)
divProjets.classList.add("image-display");

// Création de l'image récupérée via fetch
const image = document.createElement("img");
image.classList.add("modal-image");
image.src = work.imageUrl;
console.log(work.imageUrl);
divProjets.appendChild(image);

 // Création de l'icône "delete"
const deleteButton = document.createElement("i");
divProjets.appendChild(deleteButton);
deleteButton.classList.add("delete-icon");
deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

//Suppression au click

deleteButton.addEventListener("click", () => {
  saveDeletedWork(work.id);
  divProjets.remove(); // Supprime le projet de la modale
  displayFilteredWorks() //met à jour la gallerie
})

 })
}
modaleDisplay()




// Fonctions utilitaires pour le fonctionnement du LocalStorage
function saveDeletedWork(id) {
  let deletedWork = JSON.parse(localStorage.getItem("deletedWork")) || [];
  if(!deletedWork.includes(id)) {
    deletedWork.push(id);
    localStorage.setItem("deletedWork", JSON.stringify(deletedWork));
  }
}


function getDeleteWork() {
  return JSON.parse(localStorage.getItem("deletedWork")) || [];
}

// Fonction permettant l'affichage de la gallerie sans les projets supprimés
async function displayFilteredWorks() {
  const allWorks = await getWorks();
  const deletedWorks = getDeleteWork();
  const filteredWorks = allWorks.filter(work => !deletedWorks.includes(work.id));

  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  filteredWorks.forEach(work => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}




        