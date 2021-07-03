//appel de la fonction basketPreview
basketPreview();

if (basketContent == 0) {
  document.getElementById("basketEmpty").textContent = "est vide";
} else {
  //------------- TAB HEAD --------------
  //récupération di template head tableau
  const templateHeadElt = document.getElementById("productHeadList");
  // clonage du template head tableau
  const cloneHeadElt = document.importNode(templateHeadElt.content, true);
  // affiachage du template head tableau
  document.getElementById("productsList").appendChild(cloneHeadElt);

  //------------- TAB TOTAL PRICE --------------
  //récupération di template total tableau
  const templatePriceElt = document.getElementById("templateTotalPrice");
  // clonage du template total tableau
  const clonePriceElt = document.importNode(templatePriceElt.content, true);
  // affiachage du template total tableau
  document.getElementById("totalPrice").appendChild(clonePriceElt);

  //------------- FORMULAIRE DISPLAY --------------
  //récupération di template total tableau
  const templateFormElt = document.getElementById("templateForm");
  // clonage du template total tableau
  const cloneFormElt = document.importNode(templateFormElt.content, true);
  // affiachage du template total tableau
  document.getElementById("orderPurchase").appendChild(cloneFormElt);

  //------------- TAB PRODUCT--------------
  // affichage du panier dans le tableau
  basketContent.forEach((product) => {
    //récupération du template tableau panier
    const templateElement = document.getElementById("productTemplate");

    // clonage du template
    const cloneElement = document.importNode(templateElement.content, true);

    //ajout des produits
    cloneElement.getElementById("productName").textContent = product.name;
    cloneElement.getElementById("productLenses").textContent = product.option;
    cloneElement.getElementById("productQuantity").textContent =
      product.quantity;
    cloneElement.getElementById("priceUnit").textContent = `${
      product.price / 100
    }.00 €`;
    cloneElement.getElementById("productPrice").textContent = `${
      (product.quantity * product.price) / 100
    }.00 €`;

    //affichage du template
    document.getElementById("productsList").appendChild(cloneElement);

    //initialisation de total
    let total = 0;
    for (i = 0; i < basketContent.length; i++) {
      total += (basketContent[i].price * basketContent[i].quantity) / 100;
    }
    //calcul et affichage du total
    document.getElementById("productTotalPrice").textContent = `${total}.00€`;
  });

  // supprimer un produit
  let btnDeleteElt = document.querySelectorAll(".btnDeleteElt");

  for (let i = 0; i < btnDeleteElt.length; i++) {
    btnDeleteElt[i].onclick = (event) => {
      event.preventDefault();
      basketContent.splice(i, 1);
      localStorage.setItem("cameras", JSON.stringify(basketContent));
      window.location.reload();
    };
  }
}

// ////////////////////////// Validation du formulaire et envoie en POST //////////////////////////

const regexName = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/;
const regexCity =/^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+)){1,10}$/;
const regexAddress = /^[0-9]{1,4}[ ,-][ A-Za-zÀ-ÿ0-9\-]+$/;
const regexEmail = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

document.getElementById("confirmPurchase").onclick = (event) => {
  event.preventDefault();
  // on prépare les infos pour l'envoie en POST
  var contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  // on valide que le formulaire soit correctement rempli
  if (firstName.value.length === 0 || !regexName.test(firstName.value)) {
    alert("Merci d'entrer un prénom valide.");
    firstName.style.borderColor = "red";
  } else if (lastName.value.length === 0 || !regexName.test(lastName.value)) {
    alert("Merci d'entrer un nom valide.");
    lastName.style.borderColor = "red";
  } else if (address.value.length === 0 || !regexAddress.test(address.value)) {
    alert("Merci d'entrer une adresse valide.");
    address.style.borderColor = "red";
  } else if (city.value.length === 0 || !regexCity.test(city.value)) {
    alert("Merci d'entrer une ville valide.");
    city.style.borderColor = "red";
  } else if (email.value.length === 0 || !regexEmail.test(email.value)) {
    alert("Merci d'entrer une adresse email valide");
    email.style.borderColor = "red";
  } else {
    localStorage.clear();
    var products = [];
    for (let listId of basketContent) {
      products.push(listId.id);
    }
    // on envoie en POST
    fetch(url + "/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, products }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("order", JSON.stringify(data));
        window.location.href = "commande.html";
      })
      .catch((error) =>
        alert("Un des champ du formulaire n'est pas correct !")
      );
  }
}
