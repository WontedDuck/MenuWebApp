const productos = document.querySelectorAll('.productos li');

productos.forEach(producto => {
    producto.addEventListener('click', () => {
        const subproductosId = producto.dataset.subproductos;
        const subproductos = document.getElementById(subproductosId);

        if (subproductos.style.display === 'block') {
            subproductos.style.display = 'none';
        } else {
            subproductos.style.display = 'block';
        }
    });
});

// Agrega esta función para abrir detalles en nueva pestaña
document.querySelectorAll('.subproductos').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        window.open(`detalle.html?id=${item.id}`, '_blank');
    });
});

// Importar jsPDF desde CDN
const { jsPDF } = window.jspdf;

// Array para almacenar los pedidos seleccionados
let pedidosSeleccionados = JSON.parse(localStorage.getItem('pedidosSeleccionados') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar la lista de pedidos al cargar la página
    actualizarListaPedidos();

    // Manejar clics en los productos
    const productos = document.querySelectorAll('.subproductos');
    productos.forEach(producto => {
        producto.style.cursor = 'pointer';
        
        // Agregar botón para seleccionar pedido
        const botonSeleccionar = document.createElement('button');
        botonSeleccionar.textContent = 'Agregar al pedido';
        botonSeleccionar.className = 'seleccionar-pedido';
        producto.appendChild(botonSeleccionar);

        // Evento para abrir detalle
        producto.addEventListener('click', (e) => {
            if (e.target !== botonSeleccionar) {
                window.open(`detalle.html?id=${producto.id}`, '_blank');
            }
        });

        // Evento para agregar al pedido
        botonSeleccionar.addEventListener('click', () => {
            const id = producto.id;
            const titulo = producto.querySelector('h4').textContent;
            
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

    // Manejar el formulario
    const formulario = document.getElementById('formulario-reserva');
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
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
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const personas = document.getElementById('personas').value;

    // Configurar el contenido del PDF
    doc.setFontSize(20);
    doc.text('Confirmación de Reserva', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 40);
    doc.text(`Email: ${email}`, 20, 50);
    doc.text(`Fecha: ${fecha}`, 20, 60);
    doc.text(`Hora: ${hora}`, 20, 70);
    doc.text(`Número de personas: ${personas}`, 20, 80);
    
    doc.text('Pedidos:', 20, 100);
    
    // Agregar los pedidos al PDF
    pedidosSeleccionados.forEach((pedido, index) => {
        doc.text(`- ${pedido}`, 30, 110 + (index * 10));
    });

    // Guardar el PDF
    doc.save(`reserva_${nombre}_${fecha}.pdf`);

    // Resetear el formulario y los pedidos
    document.getElementById('formulario-reserva').reset();
    pedidosSeleccionados = [];
    localStorage.setItem('pedidosSeleccionados', JSON.stringify(pedidosSeleccionados));
    actualizarListaPedidos();
}

// Estilos para el botón de seleccionar pedido
const style = document.createElement('style');
style.textContent = `
    .seleccionar-pedido {
        background-color: #63b3ed;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        margin-top: 1rem;
    }
    .seleccionar-pedido:hover {
        background-color: #3182ce;
    }
`;
document.head.appendChild(style);