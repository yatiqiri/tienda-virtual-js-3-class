const cards = document.getElementById("cards");
const items = document.getElementById("items");
const templateCard = document.getElementById("template-card").content;
const templateCart = document.getElementById("content-data").content;
const footer = document.getElementById("footer-cart");
const templateFooter = document.getElementById("template-footer").content;
const fragment = document.createDocumentFragment();
let cart = {};

function BuscarCad(texto, subt, num)
{
  var i, x, n;
  n = num || 0;
  for (x = n; x <= texto.length - subt.length; x++)
  {
    i = 0;
    while (i < subt.length && texto[x + i] == subt[i])
      i++;
    if (i == subt.length)
      return x;
  }
  return -1;
}

function BuscarPro() {
  var Schp, Vp, k, ti, pr, padre;
  Schp = document.getElementById('buscador');
  Vp = document.querySelectorAll('.card-body  ');

  for (k = 0; k < Vp.length; k += 2)
  {
    ti = BuscarCad(Vp[k].innerHTML, Schp.value);
    pr = BuscarCad(Vp[k + 1].innerHTML, Schp.value);/*contenido*/
    padre = Vp[k].parentNode;
    if (ti == -1 && pr == -1)
      padre.style.display = "none";
    else
      padre.style.display = "inline-block";
    }
}

function Iniciar() {
  var k, Vmarp, Vdata;
  Vmarp = document.querySelectorAll('.card');
  
  for (k = 0; k < Vmarp.length; k++)
  {
    Vmarp[k].innerHTML += "<p>" 
    }
}
window.onload = Iniciar;
/* document.addEventListener("keyup", e => {
  
  if (e.target.matches("#buscador")) {

if(e.key ==="Escape")e.target.value = ""



    document.querySelectorAll(".content-title").forEach(fruta => {
      fruta.textContent.toLowerCase().includes(e.target.value.toLowerCase())
        ? fruta.classList.remove("filtro")
        :fruta.classList.add("filtro")
    })
  }
}) */










document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    pintarCart();
  }
});

cards.addEventListener("click", (e) => {
  addCart(e);
});

items.addEventListener("click", (e) => {
  btnAction(e);
});

const fetchData = async () => {
  try {
    const res = await fetch("products.json");
    const data = await res.json();
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};
const pintarCards = (data) => {
  data.forEach((producto) => {
    console.log("ccama", templateCard);
    templateCard.querySelector(".content-title").textContent = producto.name;
    templateCard.querySelector(".content-price").textContent =
      "$" + producto.sale_price;
    templateCard.querySelector(".content-descripcion").textContent =
      producto.description;
    templateCard
      .querySelector("img")
      .setAttribute("src", producto.image.thumbnail);
    templateCard
      .querySelector(".card-imag-disable")
      .setAttribute("src", producto.image.thumbnail);

    templateCard.querySelector(".btn-dark").dataset.id = producto.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCart = (e) => {
  console.log(e.target.classList.contains("btn-dark"));
  if (e.target.classList.contains("btn-dark")) {
    console.log("imagen", e.target.parentElement);
    setCart(e.target.parentElement);
  }
  //detener cualquier otro evento que se pueda generar en nuestro item , porque se podria heredar eventos del contenedor padre
  e.stopPropagation();
};

const setCart = (objeto) => {
  console.log("objeto ccama", objeto);
  const products = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    // imag: objeto.querySelector(".card-img-top").textContent,
    imag: objeto.querySelector(".card-imag-disable").getAttribute("src"),
    title: objeto.querySelector(".content-title").textContent,
    description: objeto.querySelector(".content-descripcion").textContent,
    price: objeto.querySelector(".content-price").textContent,
    quantity: 1,
  };
  if (cart.hasOwnProperty(products.id)) {
    products.quantity = cart[products.id].quantity + 1;
  }
  cart[products.id] = { ...products };
  console.log(cart);
  pintarCart();
};

const pintarCart = () => {
  items.innerHTML = "";
  console.log("carrito maximo", cart);
  Object.values(cart).forEach((producto) => {
    // templateCart.querySelector(".img-data").textContent = producto.imag;
    console.log(templateCart);
    console.log("ccama cruz", producto);
    templateCart
      .querySelector(".content-data-text")
      .querySelector(".content-title-data").textContent = producto.title;
    templateCart
      .querySelector(".content-data-text")
      .querySelector(".content-priceU-data").textContent =
      "Unit price: " + producto.price;

    templateCart
      .querySelector(".content-data-text")
      .querySelector(".content-cart-quantity")
      .querySelector(".cart-data-quantity").textContent = producto.quantity;
    templateCart
      .querySelector(".content-data-price")
      .querySelector(".content-price").textContent = `$${
      producto.quantity * producto.price.slice(1)
    }`;
    //botones
    templateCart.querySelector(".btn-sum").dataset.id = producto.id;
    templateCart.querySelector(".btn-rest").dataset.id = producto.id;

    templateCart.querySelector("img").setAttribute("src", producto.imag);
    const clone = templateCart.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  paintFooterCart();
  localStorage.setItem("cart", JSON.stringify(cart));
};

const paintFooterCart = () => {
  footer.innerHTML = "";
  const nPriceCart = Object.values(cart).reduce(
    (acc, { quantity, price }) => acc + quantity * price.slice(1),
    0
  );
  console.log("ccama precio final", nPriceCart);
  templateFooter.querySelectorAll("p")[1].textContent = nPriceCart.toFixed(2);
  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);
};
const btnAction = (e) => {
  console.log("cccc", e.target);
  if (e.target.classList.contains("btn-sum")) {
    console.log(cart[e.target.dataset.id]);
    const products = cart[e.target.dataset.id];
    products.quantity = cart[e.target.dataset.id].quantity + 1;
    cart[e.target.dataset.id] = { ...products };
    pintarCart();
  }
  if (e.target.classList.contains("btn-rest")) {
    const products = cart[e.target.dataset.id];
    products.quantity--;
    if (products.quantity === 0) {
      delete cart[e.target.dataset.id];
    }
    pintarCart();
  }
  e.stopPropagation();
};
