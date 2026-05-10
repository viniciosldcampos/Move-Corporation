/*====================================*/
/* MOTORISTA INTERNO */

async function openModalInternalDriver() {
  document.getElementById('modalInternalDriver').style.display = 'flex'
  await carregarMotoristasAprovados()
}

function closeModalInternalDriver() {
  document.getElementById('modalInternalDriver').style.display = 'none'
}

async function carregarMotoristasAprovados() {
  try {
    const res = await fetch('http://localhost:3000/api/cadastro/motoristas/aprovados')
    const data = await res.json()
    const select = document.getElementById('selectDrivers')
    select.innerHTML = '<option value="">Selecione um motorista</option>'

    if (!data.dados || data.dados.length === 0) {
      select.innerHTML = '<option value="">Nenhum motorista aprovado</option>'
      return
    }

    data.dados.forEach(m => {
      const option = document.createElement('option')
      option.value = m.id
      option.textContent = m.nome
      option.dataset.nome = m.nome
      select.appendChild(option)
    })
  } catch (error) {
    console.error('Erro ao carregar motoristas:', error)
  }
}

/*====================================*/
/* MOTORISTA EXTERNO */

function openModalExternalDriver() {
  document.getElementById('modalExternalDriver').style.display = 'flex'
}

function closeModalExternalDriver() {
  document.getElementById('modalExternalDriver').style.display = 'none'
  document.getElementById('ext-nome').value = ''
  document.getElementById('ext-rg').value = ''
  document.getElementById('ext-cpf').value = ''
  document.getElementById('ext-cnh').value = ''
}

async function salvarMotoristaExterno() {
  const nome = document.getElementById('ext-nome').value.trim()
  const cpf = document.getElementById('ext-cpf').value.trim()
  const cnh = document.getElementById('ext-cnh').value.trim()
  const validade = document.getElementById('ext-validade')?.value || '2099-12-31'

  if (!nome || !cpf || !cnh) {
    alert('Nome, CPF e CNH são obrigatórios.')
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/cadastro/motorista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cpf, cnh, validade_cnh: validade, tipo: 'externo' })
    })
    const data = await res.json()
    if (data.sucesso) {
      alert(`Motorista "${nome}" cadastrado e aguardando aprovação do gestor.`)
      closeModalExternalDriver()
    } else {
      alert('Erro ao cadastrar: ' + data.erro)
    }
  } catch (error) {
    alert('Erro ao conectar ao servidor.')
  }
}

/*====================================*/
/* DOM carregado */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('selectDrivers')
    ?.addEventListener('change', function () {
      const selected = this.options[this.selectedIndex]
      document.getElementById('selectedDriver').value = selected?.dataset.nome ?? ''
      document.getElementById('selectedDriver').dataset.motoristaId = this.value
    })

  document.querySelector('#modalExternalDriver .btn-save')
    ?.addEventListener('click', salvarMotoristaExterno)

  document.querySelector('#modalInternalDriver .btn-save')
    ?.addEventListener('click', closeModalInternalDriver)
})

/*====================================*/
/* Expõe funções globalmente */
window.openModalInternalDriver = openModalInternalDriver
window.closeModalInternalDriver = closeModalInternalDriver
window.openModalExternalDriver = openModalExternalDriver
window.closeModalExternalDriver = closeModalExternalDriver
