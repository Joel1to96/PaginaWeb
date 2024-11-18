// script.js

// Función para obtener los parámetros de la URL
function getURLParameter(name) {
    const value = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
        .exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    console.log(`getURLParameter('${name}') = '${value}'`);
    return value;
}

let familiasData = []; // Array para almacenar los datos organizados
let menuItemsContainer = document.getElementById('menu-items');
let sidebarMenu = document.getElementById('sidebar-menu');

fetch('menu.json')
    .then(response => {
        console.log('Fetch realizado correctamente.');
        return response.json();
    })
    .then(data => {
        console.log('Datos del menú cargados:', data);
        familiasData = []; // Reiniciar la variable

        // Organizar los artículos por familias y subfamilias utilizando arrays
        data.forEach(item => {
            console.log('Procesando artículo:', item);
            const familiaNombre = item.Familia;
            const ordenFamilia = parseInt(item.OrdenFamilia) || 999;
            const subfamiliaNombre = item.Subfamilia || null;
            const ordenSubfamilia = parseInt(item.OrdenSubfamilia) || 999;
            const ordenArticulo = parseInt(item.OrdenArticulo) || 999;

            // Buscar o crear la familia
            let familia = familiasData.find(f => f.nombre === familiaNombre);
            if (!familia) {
                familia = {
                    nombre: familiaNombre,
                    orden: ordenFamilia,
                    subfamilias: [],
                    articulos: []
                };
                familiasData.push(familia);
                console.log(`Familia añadida: ${familiaNombre}`);
            }

            if (subfamiliaNombre) {
                // Buscar o crear la subfamilia
                let subfamilia = familia.subfamilias.find(s => s.nombre === subfamiliaNombre);
                if (!subfamilia) {
                    subfamilia = {
                        nombre: subfamiliaNombre,
                        orden: ordenSubfamilia,
                        articulos: []
                    };
                    familia.subfamilias.push(subfamilia);
                    console.log(`Subfamilia añadida: ${subfamiliaNombre} en familia ${familiaNombre}`);
                }
                // Añadir el artículo a la subfamilia
                subfamilia.articulos.push({
                    ...item,
                    orden: ordenArticulo
                });
                console.log(`Artículo añadido a subfamilia: ${item.Artículo}`);
            } else {
                // Añadir el artículo directamente a la familia
                familia.articulos.push({
                    ...item,
                    orden: ordenArticulo
                });
                console.log(`Artículo añadido a familia: ${item.Artículo}`);
            }
        });

        // Ordenar las familias
        familiasData.sort((a, b) => a.orden - b.orden);
        console.log('Familias organizadas:', familiasData);

        // Generar la barra lateral con las familias
        familiasData.forEach(familia => {
            const familiaLi = document.createElement('li');
            const familiaLink = document.createElement('a');
            familiaLink.href = "#";
            familiaLink.textContent = familia.nombre;
            familiaLink.dataset.familia = familia.nombre;
            familiaLink.classList.add('familia-link');
            familiaLi.appendChild(familiaLink);

            if (familia.subfamilias.length === 0) {
                // La familia no tiene subfamilias
                familiaLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    cargarArticulos(familia.nombre, null);
                });
            } else {
                // La familia tiene subfamilias
                // Ordenar las subfamilias
                familia.subfamilias.sort((a, b) => a.orden - b.orden);

                // Contenedor para las subfamilias (inicialmente oculto)
                const subfamiliasUl = document.createElement('ul');
                subfamiliasUl.classList.add('subfamilias-list');
                subfamiliasUl.style.display = 'none'; // Oculto por defecto

                familiaLi.appendChild(subfamiliasUl);

                // Event listener para desplegar las subfamilias
                familiaLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const subfamiliasList = e.target.nextElementSibling;
                    const isDisplayed = subfamiliasList.style.display === 'block';
                    // Ocultar todas las subfamilias
                    document.querySelectorAll('.subfamilias-list').forEach(ul => ul.style.display = 'none');
                    // Ocultar todas las familias activas
                    document.querySelectorAll('.familia-link.active').forEach(link => link.classList.remove('active'));
                    // Mostrar u ocultar la subfamilia seleccionada
                    if (!isDisplayed) {
                        subfamiliasList.style.display = 'block';
                        e.target.classList.add('active');
                    }
                });

                // Añadir las subfamilias al contenedor
                familia.subfamilias.forEach(subfamilia => {
                    const subfamiliaLi = document.createElement('li');
                    const subfamiliaLink = document.createElement('a');
                    subfamiliaLink.href = "#";
                    subfamiliaLink.textContent = subfamilia.nombre;
                    subfamiliaLink.dataset.familia = familia.nombre;
                    subfamiliaLink.dataset.subfamilia = subfamilia.nombre;
                    subfamiliaLink.classList.add('subfamilia-link');
                    subfamiliaLi.appendChild(subfamiliaLink);
                    subfamiliasUl.appendChild(subfamiliaLi);

                    // Event listener para cargar los artículos al hacer clic
                    subfamiliaLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        cargarArticulos(familia.nombre, subfamilia.nombre);
                    });
                });
            }

            sidebarMenu.appendChild(familiaLi);
        });

        // Después de generar la barra lateral, procesar los parámetros de la URL
        procesarParametrosURL();
    })
    .catch(error => {
        console.error('Error al cargar el menú:', error);
    });

// Función para cargar y mostrar los artículos de una subfamilia o familia
function cargarArticulos(familiaNombre, subfamiliaNombre) {
    console.log(`Cargando artículos de familia: ${familiaNombre}, subfamilia: ${subfamiliaNombre}`);
    menuItemsContainer.innerHTML = ''; // Limpiar contenido anterior

    let familia = familiasData.find(f => f.nombre === familiaNombre);
    if (!familia) {
        console.log(`Familia no encontrada: ${familiaNombre}`);
        menuItemsContainer.innerHTML = '<p>La categoría seleccionada no existe.</p>';
        return;
    }

    let articulos = [];
    let titulo = '';

    if (subfamiliaNombre) {
        let subfamilia = familia.subfamilias.find(s => s.nombre === subfamiliaNombre);
        if (!subfamilia) {
            console.log(`Subfamilia no encontrada: ${subfamiliaNombre} en familia ${familiaNombre}`);
            menuItemsContainer.innerHTML = '<p>La subcategoría seleccionada no existe.</p>';
            return;
        }
        articulos = subfamilia.articulos.slice(); // Copiar el array
        titulo = `${familiaNombre} - ${subfamiliaNombre}`;
    } else {
        articulos = familia.articulos.slice(); // Copiar el array
        titulo = familiaNombre;
    }

    if (articulos.length > 0) {
        console.log(`Artículos encontrados: ${articulos.length}`);
        // Ordenar los artículos
        articulos.sort((a, b) => a.orden - b.orden);

        const tituloElemento = document.createElement('h3');
        tituloElemento.textContent = titulo;
        menuItemsContainer.appendChild(tituloElemento);

        const itemsDiv = document.createElement('div');
        itemsDiv.classList.add('menu-items');

        articulos.forEach(item => {
            console.log('Mostrando artículo:', item.Artículo);
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');

            const imagenSrc = `imagenes/${item.Imagen}`;

            menuItem.innerHTML = `
                <div class="image-container">
                    <img src="${imagenSrc}" alt="${item.Artículo}">
                </div>
                <h5>${item.Artículo}</h5>
                <p class="precio">${parseFloat(item.Precio).toFixed(2)} €</p>
            `;

            itemsDiv.appendChild(menuItem);
        });

        menuItemsContainer.appendChild(itemsDiv);
    } else {
        console.log('No hay artículos en esta categoría.');
        menuItemsContainer.innerHTML = '<p>No hay artículos disponibles en esta categoría.</p>';
    }
}

// Función para procesar los parámetros de la URL y cargar la familia/subfamilia correspondiente
function procesarParametrosURL() {
    const familiaParam = getURLParameter('familia');
    const subfamiliaParam = getURLParameter('subfamilia');

    console.log(`Parámetros URL - familia: ${familiaParam}, subfamilia: ${subfamiliaParam}`);

    if (familiaParam) {
        const familiaNombre = decodeURIComponent(familiaParam);
        if (subfamiliaParam) {
            const subfamiliaNombre = decodeURIComponent(subfamiliaParam);
            cargarArticulos(familiaNombre, subfamiliaNombre);
            expandirMenu(familiaNombre, subfamiliaNombre);
        } else {
            cargarArticulos(familiaNombre, null);
            expandirMenu(familiaNombre);
        }
    }
}

// Función para expandir el menú lateral y resaltar la familia/subfamilia seleccionada
function expandirMenu(familiaNombre, subfamiliaNombre = null) {
    console.log(`Expandiendo menú - familia: ${familiaNombre}, subfamilia: ${subfamiliaNombre}`);
    // Ocultar todas las subfamilias
    document.querySelectorAll('.subfamilias-list').forEach(ul => ul.style.display = 'none');
    // Remover clases activas
    document.querySelectorAll('.familia-link.active').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.subfamilia-link.active').forEach(link => link.classList.remove('active'));

    // Buscar el enlace de la familia
    const familiaLink = document.querySelector(`.familia-link[data-familia="${familiaNombre}"]`);
    if (familiaLink) {
        familiaLink.classList.add('active');
        // Si tiene subfamilias, mostrar el submenú
        const subfamiliasList = familiaLink.nextElementSibling;
        if (subfamiliasList) {
            subfamiliasList.style.display = 'block';
            if (subfamiliaNombre) {
                // Resaltar la subfamilia
                const subfamiliaLink = subfamiliasList.querySelector(`.subfamilia-link[data-subfamilia="${subfamiliaNombre}"]`);
                if (subfamiliaLink) {
                    subfamiliaLink.classList.add('active');
                } else {
                    console.log(`SubfamiliaLink no encontrado para: ${subfamiliaNombre}`);
                }
            }
        }
    } else {
        console.log(`FamiliaLink no encontrado para: ${familiaNombre}`);
    }
}
