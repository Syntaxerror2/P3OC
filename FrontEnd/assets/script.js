getCategories()
createWorks();

console.log(localStorage.getItem("token"));

document.addEventListener("DOMContentLoaded", () => {
  /* localStorage.removeItem("deletedWork"); */
  // Reset les projets supprimés dans la modale au rechargement de la page

});

/****************Fetch des travaux à afficher****************/

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


/********************Fetch des catégories**********************/

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


/***********Affichage dynamique de la page index via fetch global*******/

async function createWorks() {
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
    // On permet à l'utilisateur de se log out en supprimant
    // les données obtenues dans le localStorage
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

		// Regex simple pour valider un email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			alert("Veuillez entrer une adresse email valide.");
			emailInput.focus();
			return;
		}

        if(!nameInput || !messageInput) {
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



/**********Affichage dynamique de la modale*************/

function addModale() {

  const modale = document.getElementById("myModal");
  const span = document.querySelector(".close");
  const button = document.getElementById("modify");
  // Quand on clique sur le bouton, on ouvre la modale
  button.onclick = function () {
    modale.style.display = "block";
  }
  // quand l'utilisateur clique sur la croix on ferme la fenêtre modale
  span.onclick = function () {
    modale.style.display = "none";
  }
  // quand l'utilisateur clique en dehors de la modale, one ferme la fenêtre
  window.onclick = function (event) {
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
    deleteButton.addEventListener("click", async () => {
      const isUserProject = JSON.parse(localStorage.getItem("userProjects") || "[]").includes(work.id);
      //Suppression définitive côté API exclusivement si le projet est celui d'un utilisateur
      if (isUserProject) {
        // Suppression côté API
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (res.ok) {
            divProjets.remove(); // Supprime visuellement de la gallerie
            displayFilteredWorks();
            console.log("Projet supprimé définitivement.");
          } else {
            alert("Erreur lors de la suppression du projet.");
          }
        } catch (error) {
          console.error("Erreur lors de la requête DELETE", error);
        }
      } else {
        // Masquer seulement si le projet fait partie des projets initiaux (via localStorage)
        saveDeletedWork(work.id);
        divProjets.remove();
        displayFilteredWorks();
      }
    });


  })
  generateModal();
}
modaleDisplay()



//Récupération de la de gallerie en global Scope car elle reservira 
const gallery = document.querySelector(".gallery");

// Fonctions utilitaires pour le fonctionnement du LocalStorage
function saveDeletedWork(id) {
  let deletedWork = JSON.parse(localStorage.getItem("deletedWork")) || [];
  if (!deletedWork.includes(id)) {
    deletedWork.push(id);
    localStorage.setItem("deletedWork", JSON.stringify(deletedWork));
  }
}




//************Supprimer des projets dans la modale****************/

function getDeleteWork() {
  //Si on ne trouve rien dans le localStorage, on retourne un tableau vide
  return JSON.parse(localStorage.getItem("deletedWork")) || [];
}

// Fonction permettant l'affichage de la gallerie sans les projets supprimés
async function displayFilteredWorks() {
  const allWorks = await getWorks();
  const deletedWorks = getDeleteWork();
  //On filtre de façon à ne conserver que les projets dont l'id n'est pas inclue dans deletedWorks (localStorage)
  const filteredWorks = allWorks.filter(work => !deletedWorks.includes(work.id));

  //Si la gallerie n'existe pas, le code ci-dessous n'est pas exécuté
  if (!gallery) return;

  gallery.innerHTML = "";
  //On affiche dynamiquement les travaux ainsi filtrés après avoir vidé la gallerie
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


/***********Display de la section ajout des projets dans la modale*************/

//Affichage du menu "ajoutez un projet" de la modale
function generateModal() {
  const modale = document.getElementById("myModal");
  const addButton = document.querySelector(".modal-add-button");
  const modalContent = document.querySelector(".modal-content")
  addButton.addEventListener("click", async () => {
    // Au clic sur "Ajouter un contenu" on vide le contenu de la modale pour le modifier
    modalContent.innerHTML = "";

    // Création de la div contenant les spans et icones
    const spanContainer = document.createElement("div");
    spanContainer.classList.add("span-container");
    modalContent.appendChild(spanContainer)

    //Div contenant le menu de la seconde modale
    const divAddModal = document.createElement("div")
    divAddModal.classList.add("modale-add-content");
    modalContent.appendChild(divAddModal);

    //Création des spans delete et icone supprimer
    const backArrowSpan = document.createElement("i");
    backArrowSpan.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`
    spanContainer.appendChild(backArrowSpan);
    const closeSpan = document.createElement("span");
    closeSpan.innerHTML = `<span class="close">&times;</span>`
    spanContainer.appendChild(closeSpan);

    //Création du nouveau h3 de la modale
    const modalAddTitle = document.createElement("h3");
    modalAddTitle.classList.add("modale-add-title")
    divAddModal.appendChild(modalAddTitle);
    modalAddTitle.innerHTML = "Ajout photo";

    //Création de la div permettant un input de type "file" stylisé
    const imageUpload = document.createElement("div");
    imageUpload.classList.add("image-upload");
    imageUpload.innerHTML = `
  <i class="fa-regular fa-image"></i>
  <button class="button-upload">+ Ajouter photo</button>
  <p class="p-file">jpg, png : 4mo max</p>`;
    divAddModal.appendChild(imageUpload);


    //Création de l'input de type "file", permettant d'ajouter des fichiers
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/png, image/jpeg";
    inputFile.id = "input-file";
    inputFile.style.display = "none"
    imageUpload.appendChild(inputFile);

    //Au click sur le div, on génère un click sur l'input
    imageUpload.addEventListener("click", () => {
      inputFile.click();
    })


    //Création de l'input "Titre"
    const titreTitle = document.createElement("h4");
    titreTitle.classList.add("input-title")
    divAddModal.appendChild(titreTitle);
    titreTitle.innerHTML = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.classList.add("input-modale");
    inputTitle.id = "title";
    divAddModal.appendChild(inputTitle)

    //Création du <select> catégorie
    const selectTitle = document.createElement("h4");
    selectTitle.classList.add("input-title")
    divAddModal.appendChild(selectTitle);
    selectTitle.innerHTML = "Catégorie";
    const inputCategory = document.createElement("select");
    inputCategory.classList.add("input-modale");
    inputCategory.id = "category";
    divAddModal.appendChild(inputCategory);

    // Ligne de séparation (bordure)
    const border = document.createElement("div");
    border.classList.add("modal-border-2");
    divAddModal.appendChild(border);

    //Fetch des catégories pour affichage dans le <select>
    const categories = await getCategories()
    console.log(categories);
    categories.forEach(category => {
      console.log(category)
      const optionCategory = document.createElement("option");
      optionCategory.value = category.id;
      optionCategory.innerHTML = category.name;
      inputCategory.appendChild(optionCategory);
    })


    //Création du bouton permettant de valider la soumission de projets
    const validateButton = document.createElement("button");
    validateButton.classList.add("modale-validate-button");
    divAddModal.appendChild(validateButton);
    validateButton.textContent = "Valider";

    // Quand on clique sur supprimer ou en dehors de la modale, on ferme la fenêtre
    closeSpan.onclick = function () {
      modale.style.display = "none";
    }


    /*************Générer le contenu premier de la modale au click sur la back arrow**************** */

    backArrowSpan.addEventListener("click", async () => {
      const modalContent = document.querySelector(".modal-content");
      const modale = document.getElementById("myModal");

      //Quand on clique sur la span "back arrow", on efface le contenu via innerhtml = ""
      modalContent.innerHTML = "";

      // La croix de fermeture
      const closeSpan = document.createElement("span");
      closeSpan.innerHTML = `&times;`;
      closeSpan.classList.add("close");
      modalContent.appendChild(closeSpan);

      closeSpan.onclick = () => {
        modale.style.display = "none";
      };

      // Titre "Galerie photo"
      const header = document.createElement("div");
      header.classList.add("modale-header-display");

      const title = document.createElement("h3");
      title.classList.add("modale-title");
      title.textContent = "Galerie photo";

      header.appendChild(title);
      modalContent.appendChild(header);

      // Galerie des projets
      const mainDisplay = document.createElement("div");
      mainDisplay.classList.add("modal-main-display");
      modalContent.appendChild(mainDisplay);

      // Ligne de séparation (bordure)
      const border = document.createElement("div");
      border.classList.add("modal-border");
      modalContent.appendChild(border);

      // Bouton "Ajouter une photo"
      const addButton = document.createElement("button");
      addButton.classList.add("modal-add-button");
      addButton.textContent = "Ajouter une photo";
      modalContent.appendChild(addButton);

      // On fait appel à la fonction d'affichage de la modale
      await modaleDisplay();

      // On replace le bouton "Ajouter une photo"
      addButton.addEventListener("click", async () => {
        await generateModal(); // On appelle le formulaire de création de projet
      });
    });

    //Event permettant l'affichage d'une preview de l'image rentrée en input
    inputFile.addEventListener("change", () => {
      const file = inputFile.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.classList.add("image-preview");
          // supprime l'icone, le bouton et le texte

          imageUpload.appendChild(img);

          //Effet sur le bouton "valider" lorsqu'une image valide est rentrée en input
          validateButton.classList.remove("modale-validate-button")
          validateButton.classList.add("modale-validated-button")

          //Ajouter effet sur le bouton si un fichier est ajouté



        };
        reader.readAsDataURL(file);
      }
    });



    /*******************Fonction permettant l'envoi de projets type "jpg/png" via formData*************/


    async function addProject() {
      validateButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const newWork = document.getElementById("input-file");
        if (!newWork) {
          alert("Le champ de fichier n’a pas été trouvé.");
          return;
        }

        // Récupération des valeurs des champs de saisie et de l'image
        const title = inputTitle.value.trim();
        const category = inputCategory.value.trim();
        const image = newWork.files[0];

        if (!category || !title || !image) {
          alert("Veuillez remplir tous les champs");
          return;
        }

        // On impose une valeur max à la taille de l'image (4 Mo)
        const maxSize = 4 * 1024 * 1024;
        if (image.size > maxSize) {
          alert("L’image dépasse la taille maximale autorisée (4 Mo).");
          return;
        }

        // Conversion de l'image en un format récupérable par l'API
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", parseInt(category));

        // Envoi à l'API
        try {
          let response = await fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            let userProjects = JSON.parse(localStorage.getItem("userProjects")) || [];
            userProjects.push(data.id);
            localStorage.setItem("userProjects", JSON.stringify(userProjects));
            localStorage.setItem("newWork", JSON.stringify(data));
            alert("Votre projet a été ajouté à la galerie !");
            window.location.reload();
            //On vide le formulaire si la réponse de l'API est valide
            inputTitle.value = "";
          } else {
            alert("Un problème est survenu, veuillez réessayer ultérieurement");
          }
        } catch (error) {
          console.error("Erreur lors du chargement du fichier", error);
          alert("Erreur lors du chargement du fichier");
        }
      });
    }

    addProject()

  })
}












