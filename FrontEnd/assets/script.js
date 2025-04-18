import { getDeleteWork } from './modale.js';

async function init() {
  await getDeleteWork();

}

init();
getCategories()
createWorks();


console.log(localStorage.getItem("token"));

document.addEventListener("DOMContentLoaded", () => {
  /* localStorage.removeItem("deletedWork"); */
  // Reset les projets supprimés dans la modale au rechargement de la page

});

/****************Fetch des travaux à afficher****************/

export async function getWorks() {
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


/********************Fetch des catégories**********************/

export async function getCategories() {
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


/***********Affichage dynamique de la page index via fetch global*******/

export async function createWorks() {
  const allWorks = await getWorks();
  const deletedWorks = getDeleteWork();
  const userWorks = JSON.parse(localStorage.getItem("userProjects")) || [];
  console.log(deletedWorks);

  // On supprime de userWorks les ID qui ne sont plus présents dans allWorks
  const currentWorkIds = allWorks.map(work => work.id);
  const updatedUserProjects = userWorks.filter(id => currentWorkIds.includes(id));
  localStorage.setItem("userProjects", JSON.stringify(updatedUserProjects));

  //On filtre les projets en excluant ceux marqués comme supprimés
  const works = allWorks.filter(work => !deletedWorks.includes(work.id));
  const gallery = document.querySelector(".gallery")


  if (!gallery) {
    console.error("Élément .gallery introuvable dans le DOM");
    return;
  }

  //On vide la galerie avant d'ajouter les nouvelles figures
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


  /*************Affichage dynamique des filtres******************* */

  const filters = document.getElementById("filters")
  const categories = await getCategories();

  //// Création séparée du bouton et de la catégorie "Tous"
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

    button.addEventListener("click", function (e) {
      console.log(e)

      // ParseInt me renvoie un entier, target me renvoie le nombre correspondant au dataset 
      // que j'ai ajouté à mon button, à savoir le works.categoryId du boutton cliqué
      const categoryId = parseInt(e.target.dataset.categoryId);
      console.log(categoryId);
      //Je demande si categoryId (l'ID obtenue au click) est égal à 0, si oui on affiche tout.
      //Si non, on utilise la fonction filter pour afficher les objets correspondants dans le tableau work
      const filteredWork = categoryId === 0 ? works : works.filter(work => work.categoryId === categoryId)

      updateGallery(filteredWork)
    })
    //On filtre les travaux par catégorie
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

    //Ajout d'un effet sur les filtres lors de leur selection

    filters.addEventListener("click", function (e) {
      if (e.target.className === "buttons") {
        // Supprimer la classe active de tous les boutons
        document.querySelectorAll(".buttons").forEach(btn => btn.classList.remove("active-filter"));
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

document.getElementById("login-button").addEventListener("click", function () {
  window.location.href = "login.html";
})

document.getElementById("index-button").addEventListener("click", function () {
  window.location.href = "index.html";
})




/************Chargement et modification de la page index si l'utilisateur est connecté ******************/

document.addEventListener("DOMContentLoaded", function () {
  const authentification = document.getElementById("authentification");

  function checkLogIn() {
    const token = localStorage.getItem("token");
    // On permet à l'utilisateur de se log out en supprimant les données obtenues dans le localStorage
    if (token) {
      authentification.textContent = "logout";
      authentification.href = "#";

      // Si l'utilisateur est connecté, on ajoute le bouton ouvrant la modale
      // On change "log in" par "log out"
      //On supprime les filtres

      const filters = document.getElementById("filters");
      filters.style.display = "none"; // Si l'utilisateur est connecté, on supprime les filtres
      const button = document.getElementById("modify");
      button.classList.remove("no-display-button"); // Ajoute le bouton "modifier" à la connexion
      authentification.addEventListener("click", function (event) {
        event.preventDefault();
        logout();
      });
    } else {
      authentification.textContent = "login";
      authentification.href = "login.html"; // Redirige vers la page de connexion
    }
  }

  function logout() {
    localStorage.removeItem("token");
    alert("Vous avez été déconnecté !");
    window.location.reload();
  }

  checkLogIn();
});

/*********Ajout d'une fonction simulant un envoi du formulaire de contact à l'API ******/

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".sign-in");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche l'envoi du formulaire

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
    const nameInput = document.getElementById("name").value;
    const messageInput = document.getElementById("message").value;

    // Regex simple pour valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Veuillez entrer une adresse email valide.");
      emailInput.focus();
      return;
    }

    if (!nameInput || !messageInput) {
      alert("Veuillez remplir tous les champs")
      return;
    }


    //On simule un envoi à l'API
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: email,
      message: document.getElementById("message").value.trim()
    };

    console.log("Formulaire prêt à être envoyé à l'API :", formData);

    alert("Message envoyé avec succès !");
    //On réinitialise le formulaire
    form.reset();
  });
});











