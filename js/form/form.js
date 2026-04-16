/*====================================*/
/* Preencher dados nome, numero de registro e departamento do usuário logado*/
const userLogged = JSON.parse(localStorage.getItem('userLogged'));

    if(userLogged) {
    /* Nome*/
    document.querySelector('.name input').value = userLogged.name;
    /* Num do colaborador*/
    document.querySelector('.numberRegistry input').value = userLogged.registry;
    /* Departamento*/
    document.getElementById('departament').value = userLogged.departament;
    }