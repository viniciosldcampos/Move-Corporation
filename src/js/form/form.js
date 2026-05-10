import './date.js'
import './modal.js'
import '../utils/clock.js'
import './passengers.js'
import './routeStop.js'
import './submit.js'
import { definirCapacidade } from './passengers.js'

const selectDepartament = document.getElementById('departament')
const selectCostCenter = document.getElementById('costCenter')
const selectVeiculo = document.getElementById('selectVeiculo')

async function carregarDepartamentos() {
  try {
    const res = await fetch('http://localhost:3000/api/cadastro/departamentos')
    const data = await res.json()

    data.departamentos.forEach(dep => {
      const option = document.createElement('option')
      option.value = dep.id
      option.text = dep.nome
      selectDepartament.appendChild(option)
    })

    selectDepartament.addEventListener('change', function () {
      selectCostCenter.innerHTML = ''
      data.centros.forEach(cc => {
        const option = document.createElement('option')
        option.value = cc.id
        option.text = cc.nome
        selectCostCenter.appendChild(option)
      })
    })

    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      document.querySelector('.name input').value = payload.nome ?? ''
      selectDepartament.dispatchEvent(new Event('change'))
    }
  } catch (error) {
    console.error('Erro ao carregar departamentos:', error)
  }
}

async function carregarVeiculos() {
  try {
    const res = await fetch('http://localhost:3000/api/cadastro/veiculos')
    const data = await res.json()
    let veiculosData = data.dados ?? []

    selectVeiculo.innerHTML = '<option value="">Selecione um veículo...</option>'
    veiculosData.forEach(v => {
      const option = document.createElement('option')
      option.value = v.id
      option.dataset.capacidade = v.capacidade ?? ''
      option.text = `${v.tipo} — ${v.modelo ?? ''} (${v.placa}) · ${v.capacidade ? v.capacidade + ' lugares' : 'capacidade não informada'}`
      selectVeiculo.appendChild(option)
    })

    selectVeiculo.addEventListener('change', function () {
      const selected = this.options[this.selectedIndex]
      const capacidade = selected?.dataset.capacidade
      definirCapacidade(capacidade || null)

      const maxPassageiros = capacidade ? parseInt(capacidade) - 1 : Infinity
      const inputs = document.querySelectorAll('.passengers .passenger')
      const excedentes = inputs.length - maxPassageiros
      if (excedentes > 0) {
        const lista = [...inputs]
        lista.slice(-excedentes).forEach(el => el.remove())
        if (capacidade) alert(`Passageiros excedentes removidos. Capacidade: ${maxPassageiros} passageiro(s).`)
      }
    })
  } catch (error) {
    console.error('Erro ao carregar veículos:', error)
  }
}

carregarDepartamentos()
carregarVeiculos()
