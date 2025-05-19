const productos = document.querySelectorAll('.producto');

// Datos de los productos
const productosData = {
    "sub-entrada-1-1": {
        titulo: "Ensalada César con Pollo",
        imagen: "images/entradas/ensaladadepollo.png",
        descripcion: "Clásica ensalada César con pollo a la parrilla.",
        precio: 120
    },
    "sub-entrada-1-2": {
        titulo: "Ensalada César con Camarones",
        imagen: "images/entradas/ensaladadecamarones.png",
        descripcion: "Deliciosa ensalada César con camarones frescos.",
        precio: 150
    },
    "sub-entrada-1-3": {
        titulo: "Ensalada César Vegetariana",
        imagen: "images/entradas/ensaladavegetariana.png",
        descripcion: "Opción vegetariana de la ensalada César.",
        precio: 100
    },
    "sub-entrada-2-1": {
        titulo: "Croquetas de Jamón",
        imagen: "images/entradas/croquetasdejamon.png",
        descripcion: "Croquetas cremosas rellenas de jamón.",
        precio: 80
    },
    "sub-entrada-2-2": {
        titulo: "Croquetas de Pollo",
        imagen: "images/entradas/croquetasdepollo.jpg",
        descripcion: "Croquetas caseras de pollo, ¡un clásico!",
        precio: 80
    },
    "sub-plato-1-1": {
        titulo: "Paella de Mariscos",
        imagen: "images/platos_fuertes/paellamariscos.png",
        descripcion: "Paella con una variedad de mariscos frescos.",
        precio: 250
    },
    "sub-plato-1-2": {
        titulo: "Paella Valenciana",
        imagen: "images/platos_fuertes/paellavalenciana.png",
        descripcion: "Paella tradicional con pollo y conejo.",
        precio: 220
    },
    "sub-plato-1-3": {
        titulo: "Paella Negra",
        imagen: "images/platos_fuertes/paellanegra.png",
        descripcion: "Paella cocinada con tinta de calamar.",
        precio: 230
    },
    "sub-plato-2-1": {
        titulo: "Solomillo al Vino Tinto",
        imagen: "images/platos_fuertes/solomillo.png",
        descripcion: "Solomillo tierno cocinado en salsa de vino tinto.",
        precio: 280
    },
    "sub-plato-2-2": {
        titulo: "Solomillo a la Pimienta",
        imagen: "images/platos_fuertes/solomillopimienta.jpg",
        descripcion: "Solomillo con un toque de pimienta.",
        precio: 270
    },
    "sub-postre-1-1": {
        titulo: "Tarta de Chocolate con Nueces",
        imagen: "images/postres/tartadechocolateconnueces.png",
        descripcion: "Deliciosa tarta de chocolate con trozos de nueces.",
        precio: 90
    },
    "sub-postre-1-2": {
        titulo: "Tarta de Chocolate con Fresas",
        imagen: "images/postres/tartadechocolateconfresas.png",
        descripcion: "Tarta de chocolate decorada con fresas frescas.",
        precio: 95
    },
    "sub-postre-1-3": {
        titulo: "Tarta de Chocolate con Dulce de Leche",
        imagen: "images/postres/tartadechocolatecondulcedeleche.png",
        descripcion: "Tarta de chocolate con un corazón de dulce de leche.",
        precio: 95
    },
    "sub-postre-2-1": {
        titulo: "Helado de Vainilla",
        imagen: "images/postres/heladodevainilla.png",
        descripcion: "Clásico helado de vainilla, perfecto para cualquier ocasión.",
        precio: 60
    },
    "sub-postre-2-2": {
        titulo: "Helado de Chocolate",
        imagen: "images/postres/heladodechocolate.png",
        descripcion: "Rico helado de chocolate, ideal para los amantes del chocolate.",
        precio: 60
    }
};

// Importar jsPDF desde CDN
const { jsPDF } = window.jspdf;

// Array para almacenar los pedidos seleccionados temporalmente
let pedidosSeleccionados = JSON.parse(localStorage.getItem('pedidosSeleccionados') || '[]');
// Array para almacenar pedidos completos
let pedidosCompletos = JSON.parse(localStorage.getItem('pedidosCompletos') || '[]');

// Generar un ID único para cada pedido
function generarIdUnico() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar las listas al cargar la página
    actualizarListaPedidos();
    actualizarListaPedidosAnteriores();

    // Establecer la fecha mínima en el campo de fecha (hoy)
    const fechaInput = document.getElementById('fecha');
    const hoy = new Date();
    const fechaMinima = hoy.toISOString().split('T')[0];
    fechaInput.setAttribute('min', fechaMinima);

    // Configurar el campo de hora para restringir de 7:00 AM a 7:00 PM
    const horaInput = document.getElementById('hora');
    horaInput.setAttribute('min', '07:00');
    horaInput.setAttribute('max', '19:00');

    // Manejar clics en los productos
    productos.forEach(producto => {
        producto.style.cursor = 'pointer';
        
        // Agregar precio a la tarjeta del producto
        const id = producto.dataset.subproductos;
        const precioElement = producto.querySelector('.precio');
        if (productosData[id] && precioElement) {
            precioElement.textContent = `$${productosData[id].precio} MXN`;
        }

        // Agregar botón para seleccionar pedido
        const botonSeleccionar = document.createElement('button');
        botonSeleccionar.textContent = 'Agregar al pedido';
        botonSeleccionar.className = 'seleccionar-pedido';
        producto.appendChild(botonSeleccionar);

        // Evento para mostrar detalles
        producto.addEventListener('click', (e) => {
            if (e.target !== botonSeleccionar && !e.target.classList.contains('cantidad-input')) {
                if (productosData[id]) {
                    const detallePlatillo = document.getElementById('detalle-platillo');
                    document.getElementById('detalle-titulo').textContent = productosData[id].titulo;
                    document.getElementById('detalle-imagen').src = productosData[id].imagen;
                    document.getElementById('detalle-descripcion').textContent = productosData[id].descripcion;
                    document.getElementById('detalle-precio').textContent = `$${productosData[id].precio} MXN`;
                    document.getElementById('detalle-cantidad').value = 1;
                    detallePlatillo.style.display = 'block';
                    detallePlatillo.scrollIntoView({ behavior: 'smooth' });

                    // Configurar el botón "Agregar al pedido" en el contenedor de detalles
                    const botonAgregarDetalle = document.getElementById('agregar-pedido');
                    botonAgregarDetalle.onclick = () => {
                        const titulo = productosData[id].titulo;
                        const precio = productosData[id].precio;
                        const cantidad = parseInt(document.getElementById('detalle-cantidad').value);
                        if (cantidad < 1) {
                            alert('Por favor, selecciona una cantidad válida.');
                            return;
                        }
                        const existingIndex = pedidosSeleccionados.findIndex(item => item.titulo === titulo);
                        if (existingIndex !== -1) {
                            pedidosSeleccionados[existingIndex].cantidad += cantidad;
                        } else {
                            pedidosSeleccionados.push({ titulo, precio, cantidad });
                        }
                        localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
                        actualizarListaPedidos();
                        alert('¡Platillo agregado al pedido!');
                    };
                }
            }
        });

        // Evento para agregar al pedido desde el producto
        botonSeleccionar.addEventListener('click', () => {
            const id = producto.dataset.subproductos;
            const titulo = productosData[id].titulo;
            const precio = productosData[id].precio;
            const cantidadInput = document.getElementById(`cantidad-${id}`);
            const cantidad = parseInt(cantidadInput.value);
            
            if (cantidad < 1) {
                alert('Por favor, selecciona una cantidad válida.');
                return;
            }
            const existingIndex = pedidosSeleccionados.findIndex(item => item.titulo === titulo);
            if (existingIndex !== -1) {
                pedidosSeleccionados[existingIndex].cantidad += cantidad;
            } else {
                pedidosSeleccionados.push({ titulo, precio, cantidad });
            }
            localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
            actualizarListaPedidos();
            alert('¡Platillo agregado al pedido!');
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
        const hora = document.getElementById('hora').value;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Validar que la fecha no sea un lunes
        if (fecha.getDay() === 0) {
            alert('Lo sentimos, no aceptamos pedidos para los lunes.');
            return;
        }

        // Validar el horario de 7:00 AM a 7:00 PM
        const [hours, minutes] = hora.split(':').map(Number);
        if (hours < 7 || (hours > 19) || (hours === 19 && minutes > 0)) {
            alert('Por favor, selecciona un horario entre las 7:00 AM y las 7:00 PM.');
            return;
        }

        // Guardar o actualizar el pedido
        const pedidoId = document.getElementById('pedido-id').value;
        const pedidoData = {
            id: pedidoId || generarIdUnico(),
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            comentarios: document.getElementById('comentarios').value,
            productos: [...pedidosSeleccionados]
        };

        if (pedidoId) {
            // Actualizar pedido existente
            const index = pedidosCompletos.findIndex(p => p.id === pedidoId);
            if (index !== -1) {
                pedidosCompletos[index] = pedidoData;
            }
        } else {
            // Nuevo pedido
            pedidosCompletos.push(pedidoData);
        }

        localStorage.setItem('pedidosCompletos', JSON.stringify(pedidosCompletos));
        generarPDF(pedidoData);

        // Resetear el formulario y los pedidos
        formulario.reset();
        document.getElementById('pedido-id').value = '';
        pedidosSeleccionados = [];
        localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
        actualizarListaPedidos();
        actualizarListaPedidosAnteriores();
    });
});

// Actualizar la lista de pedidos seleccionados
function actualizarListaPedidos() {
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';

    pedidosSeleccionados.forEach((pedido, index) => {
        const li = document.createElement('li');
        const subtotal = pedido.precio * pedido.cantidad;
        li.textContent = `${pedido.titulo} - $${pedido.precio} MXN x ${pedido.cantidad} = $${subtotal} MXN`;
        
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => {
            pedidosSeleccionados.splice(index, 1); // Corrección del error anterior
            localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
            actualizarListaPedidos();
        });

        li.appendChild(botonEliminar);
        listaPedidos.appendChild(li);
    });
}

// Actualizar la lista de pedidos anteriores
function actualizarListaPedidosAnteriores() {
    const listaPedidosAnteriores = document.getElementById('lista-pedidos-anteriores');
    listaPedidosAnteriores.innerHTML = '';

    if (pedidosCompletos.length === 0) {
        listaPedidosAnteriores.innerHTML = '<p>No hay pedidos anteriores.</p>';
        return;
    }

    pedidosCompletos.forEach((pedido, index) => {
        const div = document.createElement('div');
        div.className = 'pedido-anterior';
        let total = 0;
        const productosTexto = pedido.productos.map(p => {
            const subtotal = p.precio * p.cantidad;
            total += subtotal;
            return `${p.titulo} ($${p.precio} MXN x ${p.cantidad} = $${subtotal} MXN)`;
        }).join(', ');

        div.innerHTML = `
            <p><strong>Pedido #${index + 1}</strong> - ${pedido.nombre} (${pedido.fecha}, ${pedido.hora})</p>
            <p>Productos: ${productosTexto}</p>
            <p>Total: $${total} MXN</p>
        `;

        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.className = 'editar-pedido';
        botonEditar.addEventListener('click', () => {
            cargarPedidoParaEditar(pedido);
        });

        div.appendChild(botonEditar);
        listaPedidosAnteriores.appendChild(div);
    });
}

// Cargar un pedido para editar
function cargarPedidoParaEditar(pedido) {
    // Rellenar el formulario
    document.getElementById('pedido-id').value = pedido.id;
    document.getElementById('nombre').value = pedido.nombre;
    document.getElementById('email').value = pedido.email;
    document.getElementById('telefono').value = pedido.telefono;
    document.getElementById('direccion').value = pedido.direccion;
    document.getElementById('fecha').value = pedido.fecha;
    document.getElementById('hora').value = pedido.hora;
    document.getElementById('comentarios').value = pedido.comentarios;

    // Cargar productos seleccionados
    pedidosSeleccionados = [...pedido.productos];
    localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
    actualizarListaPedidos();

    // Desplazar al formulario
    document.getElementById('pedido-domicilio').scrollIntoView({ behavior: 'smooth' });
}

// Generar PDF
function generarPDF(pedidoData) {
    const doc = new jsPDF();
    
    // Configurar el contenido del PDF
    doc.setFontSize(20);
    doc.text('Confirmación de Pedido - Comiditas', 20, 20);
    
    doc.setFontSize(12);
    doc.text('Gracias por tu pedido!', 20, 30);
    doc.text(`Nombre: ${pedidoData.nombre}`, 20, 40);
    doc.text(`Email: ${pedidoData.email}`, 20, 50);
    doc.text(`Teléfono: ${pedidoData.telefono}`, 20, 60);
    doc.text(`Dirección: ${pedidoData.direccion}`, 20, 70);
    doc.text(`Fecha de entrega: ${pedidoData.fecha}`, 20, 80);
    doc.text(`Hora de entrega: ${pedidoData.hora}`, 20, 90);
    let yPosition = 100;
    if (pedidoData.comentarios) {
        doc.text(`Comentarios: ${pedidoData.comentarios}`, 20, yPosition);
        yPosition += 10;
    }
    doc.text('Pedidos:', 20, yPosition);
    
    // Agregar los pedidos al PDF con cantidades y subtotales
    let total = 0;
    pedidoData.productos.forEach((pedido, index) => {
        const subtotal = pedido.precio * pedido.cantidad;
        doc.text(`- ${pedido.titulo}: $${pedido.precio} MXN x ${pedido.cantidad} = $${subtotal} MXN`, 30, yPosition + 10 + (index * 10));
        total += subtotal;
    });

    // Mostrar el total
    yPosition += pedidoData.productos.length * 10 + 10;
    doc.text(`Total: $${total} MXN`, 30, yPosition);

    // Guardar el PDF
    doc.save(`pedido_${pedidoData.nombre}_${pedidoData.fecha}.pdf`);
}
