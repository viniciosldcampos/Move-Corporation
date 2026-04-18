/*====================================*/
/* Importar lista de motoristas */
import { drivers } from "./drivers.js";


/*====================================*/
/* Modal para Adicionar informações do motorista interno */

export function openModalInternalDriver() {
    document.getElementById('modalInternalDriver').style.display = 'flex';
    LoadingDrivers();
}

export function closeModalInternalDriver() {
    document.getElementById('modalInternalDriver').style.display = 'none';
}


/*====================================*/
/* Função para preencher o select */

function LoadingDrivers() {
    const select = document.getElementById('selectDrivers');

    select.innerHTML = '<option value="">Selecione um motorista</option>';

    drivers.forEach(({ name }) => {
        const option = document.createElement('option');

        option.value = name;
        option.textContent = name;

        select.appendChild(option);
    });
}


/*====================================*/
/* Modal para Adicionar informações do motorista externo */

export function openModalExternalDriver() {
    document.getElementById('modalExternalDriver').style.display = 'flex';
}

export function closeModalExternalDriver() {
    document.getElementById('modalExternalDriver').style.display = 'none';
}


/*====================================*/
/* DOM carregado */

document.addEventListener("DOMContentLoaded", () => {

    /* Quando selecionar motorista */
    document.getElementById('selectDrivers')
    ?.addEventListener("change", function () {
        document.getElementById('selectedDriver').value = this.value;
    });
});

/* Tornar funções globais */
window.openModalInternalDriver = openModalInternalDriver;
window.closeModalInternalDriver = closeModalInternalDriver;
window.openModalExternalDriver = openModalExternalDriver;
window.closeModalExternalDriver = closeModalExternalDriver;