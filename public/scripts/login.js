// public/scripts/login.js

window.iniciarLogicaPassword = function() {
    // Usamos un pequeño delay para asegurar que Next.js haya renderizado el DOM
    setTimeout(() => {
        const togglePassword = document.querySelector('#togglePassword');
        const password = document.querySelector('#password');

        if (togglePassword && password) {
            // 1. Limpiamos eventos previos clonando el nodo para evitar ejecuciones dobles
            const oldToggle = togglePassword;
            const newToggle = oldToggle.cloneNode(true);
            oldToggle.parentNode.replaceChild(newToggle, oldToggle);

            // 2. Agregamos el escuchador de eventos al nuevo icono
            newToggle.addEventListener('click', function() {
                // Alternar el tipo de input entre password y text
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                
                // 3. Alternar las clases de FontAwesome para el icono
                // Asegúrate de que los nombres de las clases coincidan con tu versión de FontAwesome
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
    }, 50); // 50ms es suficiente para que el DOM se estabilice
};