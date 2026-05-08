const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Coleta passageiros (todos os inputs do campo passageiros)
  const passageiros = [...document.querySelectorAll('.passengers input[type="text"]')]
    .map(i => i.value.trim())
    .filter(v => v !== '')

  // Coleta paradas (todos os inputs de parada adicionados)
  const paradas = [...document.querySelectorAll('.localOrigin input[type="text"]')]
    .map(i => i.value.trim())
    .filter(v => v !== '')

  const userLogged = JSON.parse(localStorage.getItem('userLogged'))

  const payload = {
    numero_solicitacao: document.getElementById('numberSolicitation').value,
    solicitante_id: userLogged?.id,
    motivo: document.getElementById('request').value,
    veiculo_id: null,   // adicionar quando tiver select de veículo com id do banco
    motorista_id: null, // adicionar quando tiver motorista selecionado
    ajudantes: document.querySelector('.moreInformationSection input[type="number"]').value,
    data_partida: document.querySelectorAll('.date-input')[0]?.value,
    hora_partida: document.querySelectorAll('input[type="time"]')[0]?.value,
    data_chegada: document.querySelectorAll('.date-input')[1]?.value,
    hora_chegada: document.querySelectorAll('input[type="time"]')[1]?.value,
    local_origem: document.querySelector('.localOrigin input[type="text"]')?.value,
    local_destino: document.querySelector('.localDestination input[type="text"]')?.value,
    passageiros,
    paradas
  }

  try {
    const res = await fetch('http://localhost:3000/api/solicitacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (data.sucesso) {
      alert(`Solicitação #${payload.numero_solicitacao} criada com sucesso!`)
      form.reset()
    } else {
      alert(`Erro ao criar solicitação: ${data.erro}`)
    }
  } catch (error) {
    alert('Não foi possível conectar ao servidor.')
    console.error(error)
  }
})
