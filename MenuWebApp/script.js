const productos = document.querySelectorAll('.producto');

// Datos de los productos
const productosData = {
    "sub-entrada-1-1": {
        titulo: "Ensalada César con Pollo",
        imagen: "images/entradas/ensaladadepollo.png",
        descripcion: "Clásica ensalada César con pollo a la parrilla."
    },
    "sub-entrada-1-2": {
        titulo: "Ensalada César con Camarones",
        imagen: "images/entradas/ensaladadecamarones.png",
        descripcion: "Deliciosa ensalada César con camarones frescos."
    },
    "sub-entrada-1-3": {
        titulo: "Ensalada César Vegetariana",
        imagen: "images/entradas/ensaladavegetariana.png",
        descripcion: "Opción vegetariana de la ensalada César."
    },
    "sub-entrada-2-1": {
        titulo: "Croquetas de Jamón",
        imagen: "images/entradas/croquetasdejamon.png",
        descripcion: "Croquetas cremosas rellenas de jamón."
    },
    "sub-entrada-2-2": {
        titulo: "Croquetas de Pollo",
        imagen: "images/entradas/croquetasdepollo.jpg",
        descripcion: "Croquetas caseras de pollo, ¡un clásico!"
    },
    "sub-plato-1-1": {
        titulo: "Paella de Mariscos",
        imagen: "images/platos_fuertes/paellamariscos.png",
        descripcion: "Paella con una variedad de mariscos frescos."
    },
    "sub-plato-1-2": {
        titulo: "Paella Valenciana",
        imagen: "images/platos_fuertes/paellavalenciana.png",
        descripcion: "Paella tradicional con pollo y conejo."
    },
    "sub-plato-1-3": {
        titulo: "Paella Negra",
        imagen: "images/platos_fuertes/paellanegra.png",
        descripcion: "Paella cocinada con tinta de calamar."
    },
    "sub-plato-2-1": {
        titulo: "Solomillo al Vino Tinto",
        imagen: "images/platos_fuertes/solomillo.png",
        descripcion: "Solomillo tierno cocinado en salsa de vino tinto."
    },
    "sub-plato-2-2": {
        titulo: "Solomillo a la Pimienta",
        imagen: "images/platos_fuertes/solomillopimienta.jpg",
        descripcion: "Solomillo con un toque de pimienta."
    },
    "sub-postre-1-1": {
        titulo: "Tarta de Chocolate con Nueces",
        imagen: "images/postres/tartadechocolateconnueces.png",
        descripcion: "Deliciosa tarta de chocolate con trozos de nueces."
    },
    "sub-postre-1-2": {
        titulo: "Tarta de Chocolate con Fresas",
        imagen: "images/postres/tartadechocolateconfresas.png",
        descripcion: "Tarta de chocolate decorada con fresas frescas."
    },
    "sub-postre-1-3": {
        titulo: "Tarta de Chocolate con Dulce de Leche",
        imagen: "images/postres/tartadechocolatecondulcedeleche.png",
        descripcion: "Tarta de chocolate con un corazón de dulce de leche."
    },
    "sub-postre-2-1": {
        titulo: "Helado de Vainilla",
        imagen: "images/postres/heladodevainilla.png",
        descripcion: "Clásico helado de vainilla, perfecto para cualquier ocasión."
    },
    "sub-postre-2-2": {
        titulo: "Helado de Chocolate",
        imagen: "images/postres/heladodechocolate.png",
        descripcion: "Rico helado de chocolate, ideal para los amantes del chocolate."
    }
};

// Importar jsPDF desde CDN
const { jsPDF } = window.jspdf;

// Array para almacenar los pedidos seleccionados
let pedidosSeleccionados = JSON.parse(localStorage.getItem('pedidosSeleccionados') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar la lista de pedidos al cargar la página
    actualizarListaPedidos();

    // Establecer la fecha mínima en el campo de fecha
    const fechaInput = document.getElementById('fecha');
    const hoy = new Date();
    const fechaMinima = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    fechaInput.setAttribute('min', fechaMinima);

    // Manejar clics en los productos
    productos.forEach(producto => {
        producto.style.cursor = 'pointer';
        
        // Agregar botón para seleccionar pedido
        const botonSeleccionar = document.createElement('button');
        botonSeleccionar.textContent = 'Agregar al pedido';
        botonSeleccionar.className = 'seleccionar-pedido';
        producto.appendChild(botonSeleccionar);

        // Evento para mostrar detalles
        producto.addEventListener('click', (e) => {
            if (e.target !== botonSeleccionar) {
                const id = producto.dataset.subproductos;
                if (productosData[id]) {
                    const detallePlatillo = document.getElementById('detalle-platillo');
                    document.getElementById('detalle-titulo').textContent = productosData[id].titulo;
                    document.getElementById('detalle-imagen').src = productosData[id].imagen;
                    document.getElementById('detalle-descripcion').textContent = productosData[id].descripcion;
                    detallePlatillo.style.display = 'block';
                    // Desplazar la vista al contenedor de detalles
                    detallePlatillo.scrollIntoView({ behavior: 'smooth' });

                    // Configurar el botón "Agregar al pedido" en el contenedor de detalles
                    const botonAgregarDetalle = document.getElementById('agregar-pedido');
                    botonAgregarDetalle.onclick = () => {
                        const titulo = productosData[id].titulo;
                        if (!pedidosSeleccionados.includes(titulo)) {
                            pedidosSeleccionados.push(titulo);
                            localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
                            actualizarListaPedidos();
                            alert('¡Platillo agregado al pedido!');
                        } else {
                            alert('Este platillo ya está en el pedido.');
                        }
                    };
                }
            }
        });

        // Evento para agregar al pedido desde el producto
        botonSeleccionar.addEventListener('click', () => {
            const id = producto.dataset.subproductos;
            const titulo = productosData[id].titulo;
            
            if (!pedidosSeleccionados.includes(titulo)) {
                pedidosSeleccionados.push(titulo);
                localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
                actualizarListaPedidos();
                alert('¡Platillo agregado al pedido!');
            } else {
                alert('Este platillo ya está en el pedido.');
            }
        });
    });

    // Botón para cerrar el contenedor de detalles
    const botonCerrar = document.getElementById('cerrar-detalle');
    botonCerrar.addEventListener('click', () => {
        document.getElementById('detalle-platillo').style.display = 'none';
    });

    // Manejar el formulario
    const formulario = document.getElementById('formulario-pedido');
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const fecha = new Date(document.getElementById('fecha').value);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Normalizar la fecha actual a medianoche

        if (fecha < hoy) {
            alert('La fecha de entrega no puede ser anterior a hoy.');
            return;
        }

        generarPDF();
    });
});

// Actualizar la lista de pedidos en la interfaz
function actualizarListaPedidos() {
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';

    pedidosSeleccionados.forEach((pedido, index) => {
        const li = document.createElement('li');
        li.textContent = pedido;
        
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => {
            pedidosSeleccionados.splice(index, 1);
            localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
            actualizarListaPedidos();
        });

        li.appendChild(botonEliminar);
        listaPedidos.appendChild(li);
    });
}

// Generar PDF
function generarPDF() {
    const doc = new jsPDF();
    
    // Información del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const comentarios = document.getElementById('comentarios').value;

    // Configurar el contenido del PDF
    doc.setFontSize(20);
    doc.text('Confirmación de Pedido - Comiditas', 20, 20);
    
    doc.setFontSize(12);
    doc.text('Gracias por tu pedido!', 20, 30);
    doc.text(`Nombre: ${nombre}`, 20, 40);
    doc.text(`Email: ${email}`, 20, 50);
    doc.text(`Teléfono: ${telefono}`, 20, 60);
    doc.text(`Dirección: ${direccion}`, 20, 70);
    doc.text(`Fecha de entrega: ${fecha}`, 20, 80);
    doc.text(`Hora de entrega: ${hora}`, 20, 90);
    let yPosition = 100;
    if (comentarios) {
        doc.text(`Comentarios: ${comentarios}`, 20, yPosition);
        yPosition += 10;
    }
    doc.text('Pedidos:', 20, yPosition);
    
    // Agregar los pedidos al PDF
    pedidosSeleccionados.forEach((pedido, index) => {
        doc.text(`- ${pedido}`, 30, yPosition + 10 + (index * 10));
    });

    // Guardar el PDF
    doc.save(`pedido_${nombre}_${fecha}.pdf`);

    // Resetear el formulario y los pedidos
    document.getElementById('formulario-pedido').reset();
    pedidosSeleccionados = [];
    localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
    actualizarListaPedidos();
}
