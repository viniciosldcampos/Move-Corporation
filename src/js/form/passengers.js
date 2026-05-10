let capacidadeMaxima = null

export function definirCapacidade(capacidade) {
  capacidadeMaxima = capacidade ? parseInt(capacidade) - 1 : null
}

function contarPassageiros() {
  return document.querySelectorAll('.passengers input[type="text"]').length
}

function addInputPassengers() {
  if (capacidadeMaxima !== null && contarPassageiros() >= capacidadeMaxima) {
    alert(`Capacidade máxima atingida! Este veículo comporta ${capacidadeMaxima} passageiro(s) além do motorista.`)
    return
  }

  const passengers = document.querySelector('.passengers')
  const div = document.createElement('div')
  div.classList.add('passenger')
  div.innerHTML = `
    <div class="input-group">
      <input type="text" placeholder="Digite o nome do passageiro">
      <button type="button" class="remove-button" onclick="removeInputPassengers(this)">
        <i class="fa-solid fa-minus"></i>
      </button>
    </div>`
  passengers.appendChild(div)
}

function removeInputPassengers(button) {
  button.closest('.passenger').remove()
}

window.addInputPassengers = addInputPassengers
window.removeInputPassengers = removeInputPassengers
