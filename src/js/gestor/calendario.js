const token = localStorage.getItem('token')
const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

let hoje = new Date()
let calMes = hoje.getMonth()
let calAno = hoje.getFullYear()
let visao = 'mensal'
let eventosCal = []
let dragEvento = null
let semanaOffset = 0

export async function iniciarCalendario() {
  await popularFiltroVeiculos()
  renderizar()
}

async function popularFiltroVeiculos() {
  const sel = document.getElementById('cal-filtro-veiculo')
  if (!sel) return
  const res = await fetch('http://localhost:3000/api/cadastro/veiculos', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  sel.innerHTML = '<option value="">Todos os veículos</option>'
  data.dados?.forEach(v => {
    sel.innerHTML += `<option value="${v.id}">${v.tipo} — ${v.modelo ?? ''} (${v.placa})</option>`
  })
}

export async function renderizar() {
  if (visao === 'mensal') await renderMensal()
  else await renderSemanal()
}

window.calAnterior = () => {
  if (visao === 'mensal') { calMes--; if (calMes < 0) { calMes = 11; calAno-- } }
  else { semanaOffset-- }
  renderizar()
}

window.calProximo = () => {
  if (visao === 'mensal') { calMes++; if (calMes > 11) { calMes = 0; calAno++ } }
  else { semanaOffset++ }
  renderizar()
}

window.calHoje = () => {
  calMes = hoje.getMonth(); calAno = hoje.getFullYear(); semanaOffset = 0
  renderizar()
}

window.alternarVisao = (v) => {
  visao = v
  document.querySelectorAll('.cal-visao-btn').forEach(b => b.classList.remove('ativo'))
  document.querySelector(`[data-visao="${v}"]`).classList.add('ativo')
  renderizar()
}

async function buscarEventos(mes, ano) {
  const veiculoId = document.getElementById('cal-filtro-veiculo')?.value ?? ''
  const params = new URLSearchParams({ mes, ano })
  if (veiculoId) params.append('veiculo_id', veiculoId)
  const res = await fetch(`http://localhost:3000/api/gestor/calendario?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  eventosCal = data.dados || []
}

async function renderMensal() {
  await buscarEventos(calMes + 1, calAno)
  document.getElementById('cal-titulo').textContent = `${meses[calMes]} ${calAno}`

  const primeiroDia = new Date(calAno, calMes, 1).getDay()
  const ultimoDia = new Date(calAno, calMes + 1, 0).getDate()
  const diasAnt = new Date(calAno, calMes, 0).getDate()

  let html = `<div class="cal-semana-header">${diasSemana.map(d => `<div>${d}</div>`).join('')}</div><div class="cal-grade-mensal">`

  for (let i = primeiroDia - 1; i >= 0; i--)
    html += diaHtml(diasAnt - i, true, null)

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const dataStr = `${calAno}-${String(calMes + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`
    const ehHoje = dia === hoje.getDate() && calMes === hoje.getMonth() && calAno === hoje.getFullYear()
    const eventos = eventosCal.filter(e => new Date(e.data_partida).getUTCDate() === dia)
    html += diaHtml(dia, false, dataStr, ehHoje, eventos)
  }

  const restantes = (primeiroDia + ultimoDia) % 7 === 0 ? 0 : 7 - ((primeiroDia + ultimoDia) % 7)
  for (let i = 1; i <= restantes; i++)
    html += diaHtml(i, true, null)

  html += '</div>'
  document.getElementById('cal-corpo').innerHTML = html
}

function diaHtml(dia, outroMes, dataStr, ehHoje = false, eventos = []) {
  const classes = ['cal-dia-mensal', outroMes ? 'outro-mes' : '', ehHoje ? 'hoje' : ''].filter(Boolean).join(' ')
  const numClasse = ehHoje ? 'cal-dia-num hoje-num' : 'cal-dia-num'
  const droppable = !outroMes ? `ondragover="event.preventDefault()" ondrop="calDrop(event,'${dataStr}')"` : ''
  const clickAttr = !outroMes ? `onclick="calCriarSolicitacao('${dataStr}')"` : ''
  const visiveis = eventos.slice(0, 3)
  const extras = eventos.length - 3
  const eventosHtml = visiveis.map(e => eventoChip(e)).join('')
  const maisHtml = extras > 0 ? `<div class="cal-mais">+${extras} mais</div>` : ''
  return `<div class="${classes}" ${droppable} ${clickAttr}>
    <div class="${numClasse}">${dia}</div>
    ${eventosHtml}${maisHtml}
  </div>`
}

async function renderSemanal() {
  const base = new Date(hoje)
  base.setDate(base.getDate() + semanaOffset * 7)
  const diaSemana = base.getDay()
  const inicioSemana = new Date(base)
  inicioSemana.setDate(base.getDate() - diaSemana)

  const mes = inicioSemana.getMonth() + 1
  const ano = inicioSemana.getFullYear()
  await buscarEventos(mes, ano)

  const fimSemana = new Date(inicioSemana)
  fimSemana.setDate(fimSemana.getDate() + 6)
  if (fimSemana.getMonth() !== inicioSemana.getMonth()) {
    const veiculoId = document.getElementById('cal-filtro-veiculo')?.value ?? ''
    const params2 = new URLSearchParams({ mes: fimSemana.getMonth()+1, ano: fimSemana.getFullYear() })
    if (veiculoId) params2.append('veiculo_id', veiculoId)
    const res2 = await fetch(`http://localhost:3000/api/gestor/calendario?${params2}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const d2 = await res2.json()
    eventosCal = [...eventosCal, ...(d2.dados || [])]
  }

  const dias = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(inicioSemana); d.setDate(d.getDate() + i); dias.push(d)
  }

  const inicioStr = inicioSemana.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  const fimStr = fimSemana.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  document.getElementById('cal-titulo').textContent = `${inicioStr} – ${fimStr}`

  const horas = Array.from({ length: 24 }, (_, i) => i)

  let html = `<div class="cal-semanal-wrapper">
    <div class="cal-semanal-header">
      <div class="cal-hora-col"></div>
      ${dias.map(d => {
        const ehHoje = d.toDateString() === hoje.toDateString()
        const dataStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        return `<div class="cal-semanal-dia-header ${ehHoje ? 'hoje' : ''}" onclick="calCriarSolicitacao('${dataStr}')">
          <span class="cal-semanal-diaSemana">${diasSemana[d.getDay()]}</span>
          <span class="cal-semanal-diaNum ${ehHoje ? 'hoje-num' : ''}">${d.getDate()}</span>
        </div>`
      }).join('')}
    </div>
    <div class="cal-semanal-body">
      <div class="cal-horas-col">
        ${horas.map(h => `<div class="cal-hora-label">${String(h).padStart(2,'0')}:00</div>`).join('')}
      </div>
      ${dias.map(d => {
        const dataStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        const eventos = eventosCal.filter(e => {
          const ed = new Date(e.data_partida)
          return ed.getUTCFullYear() === d.getFullYear() && ed.getUTCMonth() === d.getMonth() && ed.getUTCDate() === d.getDate()
        })
        const eventosHtml = eventos.map(e => {
          const hora = e.hora_partida ? new Date(e.hora_partida) : null
          const h = hora ? hora.getUTCHours() : 8
          const m = hora ? hora.getUTCMinutes() : 0
          const top = (h * 60 + m) * (40 / 60)
          return `<div class="cal-evento-semanal" style="top:${top}px"
            draggable="true"
            ondragstart="calDragStart(event,'${e.id}')"
            onclick="calAbrirEvento('${e.id}', event)">
            <span>${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}</span>
            ${e.solicitante} ${e.veiculo !== '-' ? '· ' + e.veiculo : ''}
          </div>`
        }).join('')
        return `<div class="cal-semanal-col"
          ondragover="event.preventDefault()"
          ondrop="calDropSemanal(event,'${dataStr}')">
          ${horas.map(h => `<div class="cal-semanal-slot" onclick="calCriarSolicitacao('${dataStr}', ${h})"></div>`).join('')}
          ${eventosHtml}
        </div>`
      }).join('')}
    </div>
  </div>`

  document.getElementById('cal-corpo').innerHTML = html
}

function eventoChip(e) {
  const hora = e.hora_partida ? new Date(e.hora_partida) : null
  const horaStr = hora ? `${String(hora.getUTCHours()).padStart(2,'0')}:${String(hora.getUTCMinutes()).padStart(2,'0')} ` : ''
  return `<div class="cal-evento-chip"
    draggable="true"
    ondragstart="calDragStart(event,'${e.id}')"
    onclick="calAbrirEvento('${e.id}', event)"
    title="${e.motivo ?? ''}">
    ${horaStr}${e.solicitante}
  </div>`
}

window.calDragStart = (event, id) => { dragEvento = id; event.stopPropagation() }

window.calDrop = async (event, dataStr) => {
  event.stopPropagation()
  if (!dragEvento) return
  await remarcaEvento(dragEvento, dataStr, null)
  dragEvento = null
}

window.calDropSemanal = async (event, dataStr) => {
  event.stopPropagation()
  if (!dragEvento) return
  const rect = event.currentTarget.getBoundingClientRect()
  const y = event.clientY - rect.top + event.currentTarget.scrollTop
  const totalMinutos = Math.round((y / 40) * 60)
  const horas = Math.floor(totalMinutos / 60)
  const minutos = Math.round((totalMinutos % 60) / 15) * 15
  const horaStr = `${String(Math.min(horas, 23)).padStart(2,'0')}:${String(Math.min(minutos, 59)).padStart(2,'0')}`
  await remarcaEvento(dragEvento, dataStr, horaStr)
  dragEvento = null
}

async function remarcaEvento(id, dataStr, horaStr) {
  await fetch(`http://localhost:3000/api/gestor/solicitacao/${id}/remarcar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ data_partida: dataStr, hora_partida: horaStr })
  })
  renderizar()
}

window.calAbrirEvento = (id, event) => {
  event.stopPropagation()
  const e = eventosCal.find(e => e.id === id)
  if (!e) return
  const hora = e.hora_partida ? new Date(e.hora_partida) : null
  const horaStr = hora ? `${String(hora.getUTCHours()).padStart(2,'0')}:${String(hora.getUTCMinutes()).padStart(2,'0')}` : '-'
  document.getElementById('modal-titulo').textContent = `Solicitação #${e.numero_solicitacao}`
  document.getElementById('modal-body').innerHTML = `
    <p><strong>Solicitante:</strong> ${e.solicitante}</p>
    <p><strong>Motivo:</strong> ${e.motivo ?? '-'}</p>
    <p><strong>Origem:</strong> ${e.local_origem ?? '-'}</p>
    <p><strong>Destino:</strong> ${e.local_destino ?? '-'}</p>
    <p><strong>Data:</strong> ${new Date(e.data_partida).toLocaleDateString('pt-BR')}</p>
    <p><strong>Horário:</strong> ${horaStr}</p>
    <p><strong>Veículo:</strong> ${e.veiculo}</p>`
  document.getElementById('modalEvento').classList.add('aberto')
}

window.calCriarSolicitacao = (dataStr, hora = null) => {
  const url = hora !== null ? `/index.html?data=${dataStr}&hora=${String(hora).padStart(2,'0')}:00` : `/index.html?data=${dataStr}`
  window.location.href = url
}

window.fecharModal = (event) => {
  if (event.target === document.getElementById('modalEvento'))
    document.getElementById('modalEvento').classList.remove('aberto')
}

window.fecharModalBtn = () => document.getElementById('modalEvento').classList.remove('aberto')