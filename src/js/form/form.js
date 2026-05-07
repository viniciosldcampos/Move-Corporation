import { departaments } from './departaments.js'

const selectDepartament = document.getElementById('departament');
const selectCostCenter = document.getElementById('costCenter');

/* Preencher o campo do select Departamentos */
    departaments.forEach(departament => {
        let option = document.createElement('option');
        option.value = departament.code;
        option.text = `${departament.code} - ${departament.name}`;
        selectDepartament.appendChild(option);
    });

/* Evento mudança departamento */
selectDepartament.addEventListener('change', function() {
    const departamentSelected = this.value;
    selectCostCenter.innerHTML = '';

    const departament = departaments.find(dep => dep.code === departamentSelected);

    if(departament) {
        departament.costCenters.forEach(costCenter => {
            let option = document.createElement('option');
            option.value = costCenter.code;
            option.text = `${costCenter.code} - ${costCenter.name}`;
            selectCostCenter.appendChild(option);
        });
    }
});


/* Preencher dados do usuário logado - login.js */
const userLogged = JSON.parse(localStorage.getItem('userLogged'));

    if(userLogged) {
    /* Nome*/
    document.querySelector('.name input').value = userLogged.name;
    /* Num do colaborador*/
    document.querySelector('.numberRegistry input').value = userLogged.registry;
    /* Departamento*/
    selectDepartament.value = userLogged.departament;
    /* Seu departamento está sendo preenchido, mas isso não dispara o evento change automaticamente. */
    selectDepartament.dispatchEvent(new Event('change'));
    }


import { employees } from './employees.js'
import './drivers.js'
import './date.js'
import './modal.js'
import '../utils/clock.js'
import './passengers.js'
import './routeStop.js'