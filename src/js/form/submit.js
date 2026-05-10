const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const passageiros = [...document.querySelectorAll('.passengers input[type="text"]')]
    .map(i => i.value.trim()).filter(v => v !== '')

  const paradas = [...document.querySelectorAll('.localOrigin input[type="text"]')]
    .map(i => i.value.trim()).filter(v => v !== '')

  const token = localStorage.getItem('token')
  let solicitante_id = null
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      solicitante_id = payload.id
    } catch {}
  }

  // Pega o motorista_id selecionado no modal interno
  const motoristaId = document.getElementById('selectedDriver')?.dataset.motoristaId || null

  const payload = {
    solicitante_id,
    motivo: document.getElementById('request').value,
    veiculo_id: document.getElementById('selectVeiculo')?.value || null,
    motorista_id: motoristaId,
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
      alert(`Solicitação criada com sucesso! ID: ${data.id}`)
      form.reset()
    } else {
      alert(`Erro ao criar solicitação: ${data.erro}`)
    }
  } catch (error) {
    alert('Não foi possível conectar ao servidor.')
    console.error(error)
  }
})
