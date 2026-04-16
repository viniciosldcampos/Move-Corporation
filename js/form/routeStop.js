/*====================================*/
/* Adicionar Paradas no trajeto do Transporte */
function addRouteStop() {
    let routeStop = document.querySelector('.localOrigin');
    let divLocalOrigin = document.createElement('div');

    divLocalOrigin.classList.add('localOrigin');
    divLocalOrigin.innerHTML = `
        <div class="input-group">
            <input type="text" name="" id="">
            <button type="button" onclick="removeInputRouteStop(this)">
            <i class="fa-solid fa-minus"></i>
            </button>
        </div>
    `
    routeStop.appendChild(divLocalOrigin);
}

/* Remover botão de Paradas do Transporte*/
    function removeInputRouteStop(button) {
        button.closest('.localOrigin').remove();
    }
