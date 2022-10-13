import { saveCarritoStorage, obtenerCarritoStorage } from "/js/storage.js";
let carrito;

function cargarStorage(){
document.addEventListener("DOMContentLoaded", () => {
  carrito = obtenerCarritoStorage() || [];
  counter()
  renderizarCarrito();
});
}
cargarStorage();


//Mostramos los productos del stock
function mostrarProductos() {
  const contenedor = document.getElementById("producto-contenedor");

  //Recorremos nuestro array de objetos productos y le asignamos clases
  //IMPLEMENTACION DE FETCH Y JSON
  fetch('/js/stock.json')
    .then((response) => response.json())
    .catch(error => console.log(error))
    .then((productos) => {
      productos.forEach((producto) => {
            const div = document.createElement('div');

            div.classList.add("product-container");
            div.classList.add("col-sm-6");
            div.classList.add("col-md-4");
            div.classList.add("col-lg-3");
            div.classList.add('d-flex');
            div.classList.add('justify-content-center');

            div.innerHTML = `
            <div class='box-img'>
            <div class="card-top p-2">
                <div class = "d-inline-flex">
                   <h3>${producto.descripcion}</h3>
                   <div class="p-2 bd-highlight d-flex justify-content-end">${enDescuento(producto)}</div>
               </div>
            </div>
              <img src='${producto.img}'/>
              <h4>$${producto.precio}</h4>
             <button class='button-add rounded-pill' id='${producto.id}'>agregar</button>
             </div>
            `
            contenedor.appendChild(div);

            div.querySelector('button').addEventListener('click', () => {

              agregarProductos(producto.id);
        
            });
     })
  });  
}

function enDescuento({ descuento }) { 
  return descuento 
    ? `<div class="pike left"></div><h5>%sale</h5>` 
    : "";
}

//uso la funcion para mostrar los productos 
mostrarProductos();

//FUNCION QUE VERIFICA QUE EL PRODUCTO SEA AGREGADO CORRECTAMENTE
//Y SI EL PRODUCTO YA EXISTE EN EL CARRITO
function agregarProductos(id){
  fetch('/js/stock.json')
    .then((response) => response.json())
    .catch(error => console.log(error))
    .then((productos) => {  
  let producto = productos.find(producto => producto.id === id);

  let productoEnCarrito = carrito.find(producto => producto.id === id);


  if(productoEnCarrito){
      
      productoEnCarrito.cantidad++;

      console.log(carrito);

      //TOASTIFY 
      Toastify({
        text: `Se agrego nuevamente ${producto.descripcion} al carrito`,
        duration: 2500,
        close:true,
        style: {
           background: 'linear-gradient(to right, #19A273, #255846)'
          }
    }).showToast();

  }else {
      
      producto.cantidad = 1;

      carrito.push(producto);

      console.log(carrito);

      //TOASTIFY 
      Toastify({
        text: `Se agrego ${producto.descripcion} al carrito`,
        duration: 2500,
        close:true,
        className: "info",
        style: {
           background: 'linear-gradient(to right, #167233, #0E441F)',
          }
      }).showToast();
  }

  renderizarCarrito();
  calcularTotal();
  saveCarritoStorage(carrito);
  mostrarBotones(carrito);
  counter();
})}


//ESTA FUNCION VALIDA Y MUESTRA LOS PRODUCTOS INGRESADOS AL CARRITO
function renderizarCarrito(){

  let carritoHTML =  document.querySelector('#carrito');

  carritoHTML.innerHTML = '';

  carrito.forEach((producto, index)=> {
  
      let div = document.createElement('div');
      div.classList.add('col-12');
      div.classList.add('col-md-4');
      div.classList.add('mb-5');
      div.classList.add('d-flex');
      div.classList.add('justify-content-center');

      div.innerHTML = `
      
      <div class="card text-dark" style="width: 18rem;">
          <img class="card-img-top" src="${producto.img}" alt="Card image cap">
          <div class="card-body rounded">
              <h5 class="card-title">${producto.descripcion}</h5>
              <p>$${producto.precio}</p>
              <p>Cantidad: ${producto.cantidad}</p>
              <button class="btn btn-danger">Eliminar</button>
          </div>
      </div>
      `

      div.querySelector('button').addEventListener('click', ()=>{
      
          eliminarProductoDelCarrito(index)
      })

      carritoHTML.appendChild(div);
  })
  saveCarritoStorage(carrito);
  mostrarBotones(carrito);
  counter();
}

//FUNCION PARA ELIMIAR PRODUCTOS
function eliminarProductoDelCarrito(indice){

  Swal.fire({
    title: 'Esta seguro?',
    text: `Va a eleminar el producto`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
   }).then((result) => {
    if (result.isConfirmed) {
    carrito[indice].cantidad--;
    //OPERADOR TERNARIO IF
    (carrito[indice].cantidad === 0) ? 
    carrito.splice(indice,1)
    : 
    console.log(`La cantidad del producto ${carrito[indice].nombre} disminuyo`);
    renderizarCarrito();
    calcularTotal();
    Swal.fire(
            'Eliminado!',
            'El producto ha sido eliminado',
            'success'
    )
    }
  });
  mostrarBotones(carrito);
}

//CALCULO DEL TOTAL A PAGAR
function calcularTotal(){

  //ACUMULADOR
  let total = 0;

  //OPERADOR DE DESESTRUCTURACION 
  carrito.forEach(({ precio, cantidad }) =>{
  
      total += precio * cantidad;
  })

  console.log(total);

  const CompraFinal = document.getElementById('total');

  CompraFinal.innerHTML = `<h5>Precio total: $${total}</h5>`
}
 



//VACIAR TODO EL CARRITO
const btnVaciar = document.getElementById('vaciar-carrito');

btnVaciar.addEventListener('click', () => {

  Swal.fire({
    title: 'Esta seguro?',
    text: `Va a eliminar todos los productos`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
   }).then((result) => {
   if (result.isConfirmed) {
     carrito = [];
     renderizarCarrito();
     calcularTotal();
     Swal.fire(
      'Eliminado!',
      'Los productos se eliminaron',
      'success'
     )
    }
  })
  mostrarBotones(carrito);
  counter();
});

//Creamos una funcion para actualizar el contador de productos
function counter(){
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const contadorCarrito = document.getElementById("contador-carrito");
  contadorCarrito.innerText = totalCantidad;
}

//Validamos que sea necesario mostrar o no los botones del modal
function mostrarBotones(carrito){

(carrito.length == 0) ? (btnFin.style.display = 'none',
btnVaciar.style.display = 'none')
: 
(btnFin.style.display = '',
btnVaciar.style.display = '')
}

//FINALIZAR COMPRA
const btnFin = document.getElementById('finalizar-compra');

btnFin.addEventListener('click', () => {
  (async () => {
    const { value: email } = await Swal.fire({
      icon: 'warning',
      title: 'Ingrese su email',
      input: 'email',
      inputLabel: 'Le enviaremos toda la informacion a su email',
      inputPlaceholder: 'ejemplo@gmail.com',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    })
     if (email) {
      Swal.fire({
        title: 'Compra Finalizada!',
        text: `los datos de su compra estaran en su email ${email}.
        Gracias por comprar en My Gym Fitness`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Terminar',
       }).then((result) => {
       if (result.isConfirmed) {
         carrito = [];
         renderizarCarrito();
         calcularTotal();
         counter()
        }
      })
    }
  })()
})


