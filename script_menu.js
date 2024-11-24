// Inicializar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCpu2EGKchqvCh44EKskHG2_NRvXaUuAs4",
    authDomain: "menupaginaweb.firebaseapp.com",
    projectId: "menupaginaweb",
    storageBucket: "menupaginaweb.firebasestorage.app",
    messagingSenderId: "643673132476",
    appId: "1:643673132476:web:07b5a396f30b6d55afefb9",
    measurementId: "G-QVXN6M6ZP8"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Elementos del DOM
  const menuItemsContainer = document.getElementById('menu-items');
  const sidebarMenu = document.getElementById('sidebar-menu');
  
  // Variables globales
  let categories = {}; // Almacena las categorías y subcategorías
  
  // Función para cargar las categorías y subcategorías desde Firestore
  async function loadCategories() {
      sidebarMenu.innerHTML = '';
  
      try {
          const querySnapshot = await db.collection("menu").get();
          categories = {};
  
          querySnapshot.forEach((docSnap) => {
              const item = docSnap.data();
              const family = item.Familia;
              const subfamily = item.Subfamilia || 'Sin Subfamilia';
  
              if (!categories[family]) {
                  categories[family] = {};
              }
  
              if (!categories[family][subfamily]) {
                  categories[family][subfamily] = [];
              }
  
              categories[family][subfamily].push({ ...item, id: docSnap.id });
          });
  
          // Construir el menú lateral
          for (const family in categories) {
              const familyLi = document.createElement('li');
              const familyLink = document.createElement('a');
              familyLink.textContent = family;
              familyLink.href = '#';
              familyLink.addEventListener('click', () => {
                  highlightActiveLink(familyLink);
                  displayItems(categories[family]);
              });
              familyLi.appendChild(familyLink);
  
              const subfamilyUl = document.createElement('ul');
              for (const subfamily in categories[family]) {
                  if (subfamily !== 'Sin Subfamilia') {
                      const subfamilyLi = document.createElement('li');
                      const subfamilyLink = document.createElement('a');
                      subfamilyLink.textContent = subfamily;
                      subfamilyLink.href = '#';
                      subfamilyLink.addEventListener('click', () => {
                          highlightActiveLink(subfamilyLink);
                          displayItems({ [subfamily]: categories[family][subfamily] });
                      });
                      subfamilyLi.appendChild(subfamilyLink);
                      subfamilyUl.appendChild(subfamilyLi);
                  }
              }
  
              if (subfamilyUl.children.length > 0) {
                  familyLi.appendChild(subfamilyUl);
              }
  
              sidebarMenu.appendChild(familyLi);
          }
      } catch (error) {
          console.error("Error al cargar las categorías:", error);
          menuItemsContainer.innerHTML = '<p>Error al cargar el menú. Por favor, inténtelo más tarde.</p>';
      }
  }
  
  // Función para mostrar los artículos de una categoría
  function displayItems(categoryItems) {
      menuItemsContainer.innerHTML = '';
  
      for (const subfamily in categoryItems) {
          categoryItems[subfamily].forEach(item => {
              const menuItemElement = createMenuItemElement(item, item.id);
              menuItemsContainer.appendChild(menuItemElement);
          });
      }
  }
  
  // Función para crear elementos de menú
  function createMenuItemElement(item, id) {
      const menuItem = document.createElement('div');
      menuItem.classList.add('menu-item');
  
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
  
      const img = document.createElement('img');
      // Asumiendo que las imágenes están en la carpeta 'imagenes' en GitHub Pages
      const baseImageUrl = 'https://joel1to96.github.io/PaginaWeb/imagenes/';
      img.src = item.Imagen ? baseImageUrl + item.Imagen : 'imagenes/default.png';
      imageContainer.appendChild(img);
  
      const title = document.createElement('h5');
      title.textContent = item.Artículo;
  
      const price = document.createElement('p');
      price.classList.add('precio');
      price.textContent = `${item.Precio.toFixed(2)} €`;
  
      // Añadir elementos al menú
      menuItem.appendChild(imageContainer);
      menuItem.appendChild(title);
      menuItem.appendChild(price);
  
      return menuItem;
  }
  
  // Función para resaltar el enlace activo en la barra lateral
  function highlightActiveLink(activeLink) {
      // Eliminar la clase 'active' de todos los enlaces
      const links = sidebarMenu.querySelectorAll('a');
      links.forEach(link => {
          link.classList.remove('active');
      });
      // Añadir la clase 'active' al enlace seleccionado
      activeLink.classList.add('active');
  }
  
  // Inicializar la aplicación
  loadCategories();
  
  // Modo Oscuro (opcional)
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const icon = darkModeToggle.querySelector('i');
      if (document.body.classList.contains('dark-mode')) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
      } else {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
      }
  });
  
