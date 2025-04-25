import { getWorks, getCategories, createWorks } from './script.js';

async function init() {
  await getWorks();
  await getCategories();
  //await createWorks();
}

init();


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
    divProjets.appendChild(image);

    // Création de l'icône "delete"
    const deleteButton = document.createElement("i");
    divProjets.appendChild(deleteButton);
    deleteButton.classList.add("delete-icon");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;




    //Suppression au click 
    deleteButton.addEventListener("click", async () => {
      const isUserProject = JSON.parse(localStorage.getItem("userProjects") || "[]").includes(work.id);
      //Suppression définitive côté API
      if (isUserProject) {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (res.ok) {
            divProjets.remove(); // Supprime visuellement de la galerie
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


//Récupération de la de gallerie en global scope
const gallery = document.querySelector(".gallery");

// On enregistre l'id des projets supprimés afin de mémoriser les projets supprimés localement
function saveDeletedWork(id) {
  let deletedWork = JSON.parse(localStorage.getItem("deletedWork")) || [];
// On vérifie que l'ID n'est pas déjà présente dans les projets supprimés
  if (!deletedWork.includes(id)) {
  //Auquel cas on ajoute l'id et l'objet dans le localStorage
    deletedWork.push(id);
  //On met à jour le LocalStorage en convertissant à nouveau l'élément en json
    localStorage.setItem("deletedWork", JSON.stringify(deletedWork));
  }
}




//************Supprimer des projets dans la modale****************/

export function getDeleteWork() {
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

    //Création de la div contenant un input de type "file"
    const imageUpload = document.createElement("div");
    imageUpload.classList.add("image-upload");
    imageUpload.innerHTML = `
    <i class="fa-regular fa-image"></i>
    <button class="button-upload">+ Ajouter photo</button>
    <p class="p-file" id="p-file">jpg, png : 4mo max</p>`;
    divAddModal.appendChild(imageUpload);


    //Création de l'input de type "file", permettant d'ajouter des fichiers
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/png, image/jpeg";
    inputFile.id = "input-file";
    inputFile.style.display = "none"
    imageUpload.appendChild(inputFile);

    //Au click sur la div, on génère un click sur l'input
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
    categories.forEach(category => {
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
    //Permet la lecture d'un fichier à partir d'un input, côté utilisateur
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

        };
        // fonction permettant de lire le fichier de manière asynchrone 
        // convertit le fichier en URL de données, directement utilisable dans le navigateur
        reader.readAsDataURL(file); 
      }
    });



    /*******************Fonction permettant l'envoi de projets type "jpg/png" via formData*************/


    async function addProject() {
      validateButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const newWork = document.getElementById("input-file");
        if (!newWork) {
          alert("Merci d'envoyer un fichier au format jpeg/png.");
          return;
        }

        // Récupération des valeurs des champs de saisie et de l'image
        const title = inputTitle.value.trim();
        const category = inputCategory.value.trim();
        const image = newWork.files[0];

        if (!category || !title || !image) {
          alert("Merci de remplir tous les champs");
          return;
        }

        // On impose une valeur max à la taille de l'image (4 Mo)
        const maxSize = 4 * 1024 * 1024;
        if (image.size > maxSize) {
          alert("Votre image dépasse la taille maximale autorisée.");
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
            //Si l'API renvoie une réponse valide, on vide la galerie
            gallery.innerHTML = "";
            //Puis on fait appel à notre fonction de display de la galerie
            await createWorks();
            //Et enfin on push le nouveau projet au sein du localStorage
            let userProjects = JSON.parse(localStorage.getItem("userProjects")) || [];
            userProjects.push(data.id);
            localStorage.setItem("userProjects", JSON.stringify(userProjects));
            localStorage.setItem("newWork", JSON.stringify(data));
            alert("Votre projet a été ajouté à la galerie !");

            //On vide le formulaire si la réponse de l'API est valide
            const previewImage = imageUpload.querySelector(".image-preview");
            if (previewImage) {
              previewImage.remove();
            }
            inputTitle.value = "";
            inputFile.value = "";

            //On réinitialise le style du bouton
            validateButton.classList.add("modale-validate-button");
            validateButton.classList.remove("modale-validated-button");


          } else {
            alert("Un problème est survenu, merci de réessayer ultérieurement");
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