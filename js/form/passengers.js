/*====================================*/
/* Adicionar botão de Passageiros*/
function addInputPassengers() {
    let passengers = document.querySelector('.passengers');
    let divPassengersInputs = document.createElement('div');

    divPassengersInputs.classList.add('passenger');
    divPassengersInputs.innerHTML = ` 
    <div class="input-group">
    <input type="text" name="" id="">
    <button type="button" onclick="removeInputPassengers(this)">
    <i class="fa-solid fa-minus"></i>
    </button>
    </div>
    `;

    passengers.appendChild(divPassengersInputs);
}

/* Remover botão de Passageiros*/
function removeInputPassengers(button) {
    button.closest('.passenger').remove();
}