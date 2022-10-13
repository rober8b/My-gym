//EVENTOS EN EL FORM
const form = document.getElementById("form1");
let correos = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  Swal.fire(
    'Mensaje enviado',
    'Su mensaje fue enviado con exito',
    'success'
  )

  const datos= new FormData(form);
  const nombre = datos.get('nombreForm');
  const email = datos.get('emailForm');
  const msg = datos.get('msgForm');

  const Mensaje = {
      nombre,
      email,
      msg
  };

  correos.push(Mensaje);
  createForm(correos);
  saveFormStorage(correos);

});

const createForm = () => {
  document.getElementById('form1').reset();
};


const saveFormStorage = (correos) => {
  localStorage.setItem('correos', JSON.stringify(correos));
};

const getFormStorage = () => {
  const formsStorage = JSON.parse(localStorage.getItem('correos'));
  return formsStorage;
};
