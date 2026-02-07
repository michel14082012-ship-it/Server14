// =======================================================
// 1. CONSTANTES Y UTILIDADES GENERALES
// =======================================================

// Referencias a elementos DOM comunes
const DOMElements = {
    panelLateral: document.getElementById("panelLateral"),
    adminBtn: document.getElementById("adminBtn"),
    loginSection: document.getElementById("loginSection"),
    adminSection: document.getElementById("adminSection"),
    mensajeError: document.getElementById("mensaje-error"),
    loginForm: document.getElementById("loginForm"),
    fondoSelector: document.getElementById('colorFondoSelector'),
    listaUsuariosModal: document.getElementById('listaUsuariosModal'),
    formAddUser: document.getElementById('formAddUser'),
    nuevoUsuarioInput: document.getElementById('nuevoUsuarioModal')
};

const SELECTORS = {
    dropdownBtn: '.dropdown-admin-btn',
    dropdownContent: '.dropdown-admin-content',
    visibleClass: 'visible',
    ocultoPostLoginClass: 'oculto-post-login',
    abiertoClass: 'abierto',
    extendidoClass: 'extendido',
    deleteBtn: '.delete-btn'
};


// =======================================================
// 2. FUNCIONES DE UI (PANEL LATERAL Y MODALES)
// =======================================================

function abrirPanel() {
    DOMElements.panelLateral.classList.add(SELECTORS.abiertoClass);
    DOMElements.adminBtn.style.display = "none";
}

function cerrarPanel() {
    DOMElements.panelLateral.classList.remove(SELECTORS.abiertoClass, SELECTORS.extendidoClass);
    
    DOMElements.loginSection.style.display = "block";
    DOMElements.adminSection.classList.add(SELECTORS.ocultoPostLoginClass);
    DOMElements.mensajeError.textContent = "";
    DOMElements.adminBtn.style.display = "block";
}

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function cerrarSesion() {
    // Reutiliza la función existente para resetear el estado
    cerrarPanel(); 
    // Opcional: limpiar credenciales si se gestionaran en memoria
}


// =======================================================
// 3. LÓGICA DE AUTENTICACIÓN
// =======================================================

const CREDENCIALES_VALIDAS = {
    usuario: "admin",
    contrasena: "Para que querias sabes la contraseña???. PD: era la misma que la de mi chromebook "
};

function manejarLogin(event) {
    event.preventDefault();

    const usuarioInput = document.getElementById("usuario").value;
    const contrasenaInput = document.getElementById("contrasena").value;
    
    const esValido = usuarioInput === CREDENCIALES_VALIDAS.usuario && 
                     contrasenaInput === CREDENCIALES_VALIDAS.contrasena;

    if (esValido) {
        mostrarMensaje("Acceso correcto.", "green");
        
        setTimeout(transicionPostLogin, 1000); 
    } else {
        mostrarMensaje("Usuario o contraseña incorrectos.", "red");
    }
}

function mostrarMensaje(texto, color) {
    DOMElements.mensajeError.textContent = texto;
    DOMElements.mensajeError.style.color = color;
}

function transicionPostLogin() {
    DOMElements.loginSection.style.display = "none";
    DOMElements.adminSection.classList.remove(SELECTORS.ocultoPostLoginClass);
    DOMElements.panelLateral.classList.add(SELECTORS.extendidoClass);
    DOMElements.mensajeError.textContent = "";
}

// Event listener para el formulario de login
DOMElements.loginForm.addEventListener("submit", manejarLogin);


// =======================================================
// 4. MANEJO DE EVENTOS DINÁMICOS (DROPDOWNS Y MODALES)
// =======================================================

// Centraliza toda la interactividad del panel lateral en un solo listener
DOMElements.panelLateral.addEventListener('click', function(event) {
    const target = event.target;

    // Lógica para los menús desplegables de admin
    if (target.classList.contains('dropdown-admin-btn')) {
        const submenu = target.nextElementSibling;
        
        // Cierra todos los otros submenús abiertos
        document.querySelectorAll(SELECTORS.dropdownContent).forEach(s => {
            if (s !== submenu) {
                s.classList.remove(SELECTORS.visibleClass);
            }
        });

        // Alterna la visibilidad del submenú clicado
        submenu.classList.toggle(SELECTORS.visibleClass);
    }

    // Lógica para abrir modales mediante data-attributes
    if (target.tagName === 'BUTTON' && target.dataset.modal) {
        event.stopPropagation(); // Evita que el clic cierre los menús desplegables
        abrirModal(target.dataset.modal);
    }
});

// Listener global para cerrar menús desplegables si se hace clic fuera del panel
document.addEventListener('click', function(event) {
    const target = event.target;
    // Comprueba si el clic fue fuera del panel lateral y de los botones de admin
    if (!DOMElements.panelLateral.contains(target) && target !== DOMElements.adminBtn) {
        document.querySelectorAll(SELECTORS.dropdownContent).forEach(s => {
            s.classList.remove(SELECTORS.visibleClass);
        });
    }
});


// =======================================================
// 5. LÓGICA DE GESTIÓN DE USUARIOS (DENTRO DE LA MODAL)
// =======================================================

function agregarUsuario(event) {
    event.preventDefault();
    const nuevoUsuario = DOMElements.nuevoUsuarioInput.value;
    if (nuevoUsuario) {
        const nuevoLi = document.createElement('li');
        // Usamos template literals para mayor claridad
        nuevoLi.innerHTML = `${nuevoUsuario} <button class="${SELECTORS.deleteBtn.substring(1)}">Eliminar</button>`;
        DOMElements.listaUsuariosModal.appendChild(nuevoLi);
        DOMElements.nuevoUsuarioInput.value = '';
    }
}

// Event listener para el formulario de añadir usuario
DOMElements.formAddUser.addEventListener('submit', agregarUsuario);

// Delegación de eventos para la lista de usuarios: 
// Escucha clics en la lista y reacciona solo si el target es un botón de eliminar.
DOMElements.listaUsuariosModal.addEventListener('click', function(event) {
    if (event.target.classList.contains(SELECTORS.deleteBtn.substring(1))) {
        event.target.parentElement.remove();
    }
});


// =======================================================
// 6. ALMACENAMIENTO LOCAL Y CONFIGURACIÓN
// =======================================================

function cargarEstado() {
    const colorGuardado = localStorage.getItem('colorFondo');
    if (colorGuardado) {
        document.body.style.backgroundColor = colorGuardado;
        if (DOMElements.fondoSelector) {
            DOMElements.fondoSelector.value = colorGuardado;
        }
    }
}

function aplicarColor() {
    const nuevoColor = DOMElements.fondoSelector.value;
    document.body.style.backgroundColor = nuevoColor;
    localStorage.setItem('colorFondo', nuevoColor);
}

// Inicialización: Carga el estado guardado al iniciar la página
document.addEventListener('DOMContentLoaded', cargarEstado);

// Event listener para el botón de aplicar color (si existe en el HTML)
const aplicarColorBtn = document.getElementById('aplicarColorBtn');
if (aplicarColorBtn) {
    aplicarColorBtn.addEventListener('click', aplicarColor);
}
// --- DOMElements y Credenciales (Mantener las tuyas) ---

/**
 * SISTEMA DE NAVEGACIÓN (SIN SUB-URL)
 */
function navegarA(idSeccion) {
    // 1. Ocultar todas las secciones
    const secciones = document.querySelectorAll('.pagina-seccion');
    secciones.forEach(sec => {
        sec.classList.remove('activa');
        sec.style.display = 'none';
    });

    // 2. Mostrar la seleccionada
    const activa = document.getElementById(idSeccion);
    if (activa) {
        activa.style.display = 'block';
        // Pequeño delay para que la transición CSS funcione
        setTimeout(() => activa.classList.add('activa'), 10);
    }

    // 3. Cerrar panel lateral si estuviera abierto al navegar
    cerrarPanel();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * LÓGICA DE ADMIN (Tus funciones mejoradas)
 */
function abrirPanel() {
    document.getElementById("panelLateral").classList.add("abierto");
}

function cerrarPanel() {
    document.getElementById("panelLateral").classList.remove("abierto", "extendido");
}

// Escuchar el login
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("contrasena").value;

    if (user === "admin" && pass === "Para que querias sabes la contraseña???. PD: era la misma que la de mi chromebook ") {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("adminSection").classList.remove("oculto-post-login");
        document.getElementById("panelLateral").classList.add("extendido");
    } else {
        const err = document.getElementById("mensaje-error");
        err.textContent = "Error de acceso";
        err.style.color = "red";
    }
});

// Modales y submenús (Tus funciones originales)
function abrirModal(id) { document.getElementById(id).style.display = 'block'; }
function cerrarModal(id) { document.getElementById(id).style.display = 'none'; }
/**
 * Lógica para cargar el sistema de Proxy mediante Iframe
 */
function cargarProxy() {
    const urlInput = document.getElementById('proxyInput').value;
    const frame = document.getElementById('proxyFrame');
    
    if (urlInput) {
        // Añadimos protocolo si no lo tiene
        let destino = urlInput;
        if (!destino.startsWith('http')) {
            destino = 'https://' + destino;
        }
        
        // Cargamos la URL en el Iframe
        frame.src = destino;
        console.log("Cargando en iframe: " + destino);
    } else {
        alert("Por favor, introduce una dirección válida.");
    }
}

/**
 * Modificamos la función navegarA para que el inicio sea por defecto
 */
function navegarA(idSeccion) {
    const secciones = document.querySelectorAll('.pagina-seccion');
    secciones.forEach(sec => {
        sec.classList.remove('activa');
        sec.style.display = 'none';
    });

    const activa = document.getElementById(idSeccion);
    if (activa) {
        activa.style.display = 'block';
        setTimeout(() => activa.classList.add('activa'), 10);
    }
}
/**
 * Lógica del Navegador Proxy
 */
const frame = document.getElementById('proxyFrame');

function cargarProxy() {
    let url = document.getElementById('proxyInput').value;
    if (url) {
        if (!url.startsWith('http')) url = 'https://' + url;
        frame.src = url;
    }
}

// Abrir Apps específicas en el mismo iframe del proxy (reutilización de ventana)
function abrirAppEnIframe(url) {
    navegarA('seccion-proxy'); // Cambiamos a la sección del navegador
    document.getElementById('proxyInput').value = url;
    frame.src = url;
}

// Controles de historial (Nota: Funcionan si el dominio permite acceso)
function proxyBack() {
    try { frame.contentWindow.history.back(); } 
    catch(e) { console.warn("Restricción de seguridad: No se puede acceder al historial externo."); }
}

function proxyForward() {
    try { frame.contentWindow.history.forward(); } 
    catch(e) { console.warn("Restricción de seguridad: No se puede acceder al historial externo."); }
}

function proxyReload() {
    frame.src = frame.src;
}

// Pantalla Completa para el Iframe
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        frame.requestFullscreen().catch(err => {
            alert(`Error al intentar modo pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Mejoramos la función navegarA para que resetee el input si es necesario
 */
function navegarA(idSeccion) {
    document.querySelectorAll('.pagina-seccion').forEach(sec => {
        sec.classList.remove('activa');
        sec.style.display = 'none';
    });

    const activa = document.getElementById(idSeccion);
    if (activa) {
        activa.style.display = 'block';
        setTimeout(() => activa.classList.add('activa'), 10);
    }
    cerrarPanel();
}
// Protección activa: si el ratón sale o la ventana pierde foco, el contenido desaparece
const secureZone = document.getElementById('contenido-sensible');

function enableProtection() {
    secureZone.style.filter = 'blur(40px)';
    secureZone.style.opacity = '0'; // Desaparece físicamente del render
}

function disableProtection() {
    secureZone.style.filter = 'none';
    secureZone.style.opacity = '1';
}

// Se activa al cambiar de pestaña o minimizar (muchos grabadores disparan esto)
document.addEventListener('visibilitychange', () => {
    document.hidden ? enableProtection() : disableProtection();
});

// Se activa si el usuario intenta sacar el cursor para configurar un grabador externo
document.addEventListener('mouseleave', enableProtection);
document.addEventListener('mouseenter', disableProtection);