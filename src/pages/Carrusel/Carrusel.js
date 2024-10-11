//creacion de carrusel javascript
const img = [
    {
      src: "https://i.blogs.es/403357/los-caballeros-del-zodiaco-portada-f/1366_2000.jpeg",
      title: "Los Caballeros del Zodiaco",
      trailerLink: "https://www.youtube.com/embed/M_SBjSWBAs4"
    },
    {
      src: "https://cdn.colombia.com/sdi/2024/02/16/godzilla-x-kong-the-new-empire-se-conocen-nuevos-detalles-de-la-trama-de-la-esperada-cinta-del-monsterverse-1224747.jpg",
      title: "Godzilla vs Kong",
      trailerLink: "https://www.youtube.com/embed/odM92ap8_c0"
    },
    {
      src: "https://www.bizcochito.es/Films/Movil/tt14539740.webp",
      title: "Godzilla y Kong: El nuevo imperio",
      trailerLink: "https://www.youtube.com/embed/rmoneJ_797s"
    },
    {
      src: "https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2018/12/infinity-war.jpg?w=1000&quality=55&strip=all&ssl=1",
      title: "Avengers: Infinity War",
      trailerLink: "https://www.youtube.com/embed/6ZfuNTqbHE8"
    }
  ];

const CrsCarrusel = document.getElementById("carrusel");
const Anterior = document.getElementById("Anterior");
const Siguiente = document.getElementById("Siguiente");
const txtMovieTitle = document.getElementById("movie-title");
const txtTrailerLink = document.getElementById("trailer-link");

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const trailerFrame = document.getElementById("trailer-frame");

let count = 0;

const showImage = (index) => {
  CrsCarrusel.setAttribute("src", img[index].src);
  txtMovieTitle.innerText = img[index].title;
  txtTrailerLink.href = img[index].trailerLink;
  
};

// Mostrar la primera imagen al cargar la página
showImage(count);

const autoSlide = () => {
  count = (count + 1) % img.length;
  showImage(count);
};

// Configurar el intervalo para cambiar la imagen automáticamente cada 3 segundos
let slideInterval = setInterval(autoSlide, 5000);

// Función para reiniciar el intervalo automático
const resetAutoSlide = () => {
  clearInterval(slideInterval);
  slideInterval = setInterval(autoSlide, 3000);
};

Anterior.addEventListener('click', () => {
  count = (count - 1 + img.length) % img.length;
  showImage(count);
  resetAutoSlide();
});

Siguiente.addEventListener('click', () => {
  count = (count + 1) % img.length;
  showImage(count);
  resetAutoSlide();
});

txtTrailerLink.addEventListener('click', (e) => {
  e.preventDefault();
  trailerFrame.src = img[count].trailerLink;
  modal.style.display = "block";
});

span.onclick = () => {
  modal.style.display = "none";
  trailerFrame.src = ""; // Detener el video al cerrar el modal
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    trailerFrame.src = ""; // Detener el video al cerrar el modal
  }
};