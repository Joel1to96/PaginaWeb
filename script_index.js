
  // Elementos del DOM
  const menuItemsContainer = document.getElementById('menu-items');
  const sidebarMenu = document.getElementById('sidebar-menu');
  
  // Variables globales
  let categories = {}; // Almacena las categorías y subcategorías
  
  

  
  // Modo Oscuro (opcional)
  // Modo Oscuro
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Verificar si hay una preferencia almacenada en localStorage
    const darkModePreference = localStorage.getItem('darkMode');

    if (darkModePreference === 'enabled') {
        enableDarkMode();
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDarkModeEnabled = document.body.classList.contains('dark-mode');
            if (isDarkModeEnabled) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        localStorage.setItem('darkMode', 'enabled');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        localStorage.setItem('darkMode', 'disabled');
    }
});

