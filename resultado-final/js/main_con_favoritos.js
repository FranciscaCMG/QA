let productos = [];

fetch("./js/productos.json")
  .then(response => response.json())
  .then(data => {
    productos = data;
    cargarProductos(productos);
  });

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Ocultar menú móvil al hacer clic
botonesCategorias.forEach(boton => {
  boton.addEventListener("click", () => {
    aside?.classList.remove("aside-visible");
  });
});

// Cargar productos al DOM
function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  productosElegidos.forEach(producto => {
    const div = document.createElement("div");
    div.classList.add("producto");

    const esFavorito = favoritos.includes(String(producto.id));

    div.innerHTML = `
      <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
      <div class="producto-detalles">
        <h3 class="producto-titulo">${producto.titulo}</h3>
        <p class="producto-precio">$${producto.precio}</p>
        <div style="display: flex; align-items: center;">
          <button class="producto-agregar" id="${producto.id}">Agregar</button>
          <button class="producto-favorito" data-id="${producto.id}" style="background: none; border: none; font-size: 1.3rem; margin-left: 8px; cursor: pointer;">
            <i class="bi ${esFavorito ? 'bi-heart-fill' : 'bi-heart'}" style="color: ${esFavorito ? 'red' : '#999'};"></i>
          </button>
        </div>
      </div>
    `;

    contenedorProductos.append(div);
  });

  actualizarBotonesAgregar();
  actualizarBotonesFavorito(); // actualiza corazones
}

// Cambiar categoría activa y cargar productos
botonesCategorias.forEach(boton => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach(b => b.classList.remove("active"));
    e.currentTarget.classList.add("active");

    const categoriaId = e.currentTarget.id;

    if (categoriaId !== "todos") {
      const productosFiltrados = productos.filter(p => p.categoria.id === categoriaId);
      const categoria = productosFiltrados[0]?.categoria.nombre || "Categoría";
      tituloPrincipal.innerText = categoria;
      cargarProductos(productosFiltrados);
    } else {
      tituloPrincipal.innerText = "Todos los productos";
      cargarProductos(productos);
    }
  });
});

// Agregar producto al carrito
let productosEnCarrito = [];
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
}

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

function agregarAlCarrito(e) {
  Toastify({
    text: "Producto agregado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
      cursor: "pointer"
    },
    offset: {
      x: '1.5rem',
      y: '1.5rem'
    },
    onClick: function () {
      window.location.href = "carrito.html";
    }
  }).showToast();

  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(producto => producto.id === idBoton || producto.id === parseInt(idBoton));

  if (productosEnCarrito.some(producto => producto.id === idBoton || producto.id === parseInt(idBoton))) {
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton || producto.id === parseInt(idBoton));
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  numerito.innerText = nuevoNumerito;
}

// ✅ Favoritos: marcar/desmarcar y guardar
function actualizarBotonesFavorito() {
  const botonesFavorito = document.querySelectorAll(".producto-favorito");

  botonesFavorito.forEach(boton => {
    boton.addEventListener("click", () => {
      const id = String(boton.dataset.id);
      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

      const iconElement = boton.querySelector("i");

      if (favoritos.includes(id)) {
        favoritos = favoritos.filter(fid => fid !== id);
        iconElement.classList.replace("bi-heart-fill", "bi-heart");
        iconElement.style.color = "#999";
      } else {
        favoritos.push(id);
        iconElement.classList.replace("bi-heart", "bi-heart-fill");
        iconElement.style.color = "red";
      }

      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });
  });
}

// Logout
document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("logout");

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Tu sesión se cerrará y volverás a la página principal.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("auth");
          window.location.href = "home.html";
        }
      });
    });
  }
});
