import prisma from '../database/prisma.js'

export async function listarPendentes(req, res) {
  try {
    const solicitacoes = await prisma.solicitacoes_transporte.findMany({
      where: { status: 'pendente' },
      orderBy: { data_hora_solicitacao: 'desc' }
    })
    const resultado = await Promise.all(solicitacoes.map(async (s) => {
      const funcionario = await prisma.funcionarios.findFirst({ where: { id: s.solicitante_id } })
      const pessoa = funcionario ? await prisma.pessoas.findFirst({ where: { id: funcionario.pessoa_id } }) : null
      return {
        id: s.id.toString(),
        numero_solicitacao: s.numero_solicitacao,
        motivo: s.motivo,
        status: s.status,
        local_origem: s.local_origem,
        local_destino: s.local_destino,
        data_partida: s.data_partida,
        hora_partida: s.hora_partida,
        solicitante: pessoa?.nome ?? 'Desconhecido'
      }
    }))
    res.json({ sucesso: true, dados: resultado })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro ao buscar solicitações.' })
  }
}

export async function atualizarStatus(req, res) {
  const { id } = req.params
  const { status } = req.body
  try {
    await prisma.solicitacoes_transporte.update({
      where: { id: BigInt(id) },
      data: { status }
    })
    res.json({ sucesso: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro ao atualizar status.' })
  }
}

export async function listarHistorico(req, res) {
  const { status, data_inicio, data_fim } = req.query
  try {
    const filtro = {}
    if (status) filtro.status = status
    if (data_inicio || data_fim) {
      filtro.data_hora_solicitacao = {}
      if (data_inicio) filtro.data_hora_solicitacao.gte = new Date(data_inicio)
      if (data_fim) filtro.data_hora_solicitacao.lte = new Date(data_fim + 'T23:59:59')
    }
    const solicitacoes = await prisma.solicitacoes_transporte.findMany({
      where: filtro, orderBy: { data_hora_solicitacao: 'desc' }
    })
    const resultado = await Promise.all(solicitacoes.map(async (s) => {
      const funcionario = await prisma.funcionarios.findFirst({ where: { id: s.solicitante_id } })
      const pessoa = funcionario ? await prisma.pessoas.findFirst({ where: { id: funcionario.pessoa_id } }) : null
      return {
        id: s.id.toString(),
        numero_solicitacao: s.numero_solicitacao,
        motivo: s.motivo,
        status: s.status,
        local_origem: s.local_origem,
        local_destino: s.local_destino,
        data_partida: s.data_partida,
        data_hora_solicitacao: s.data_hora_solicitacao,
        solicitante: pessoa?.nome ?? 'Desconhecido'
      }
    }))
    res.json({ sucesso: true, dados: resultado })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro ao buscar histórico.' })
  }
}

export async function listarCalendario(req, res) {
  const { mes, ano, veiculo_id } = req.query
  const mesNum = parseInt(mes) || new Date().getMonth() + 1
  const anoNum = parseInt(ano) || new Date().getFullYear()
  const inicio = new Date(anoNum, mesNum - 1, 1)
  const fim = new Date(anoNum, mesNum, 0, 23, 59, 59)

  try {
    const filtro = {
      status: 'aprovado',
      data_partida: { gte: inicio, lte: fim }
    }
    if (veiculo_id) filtro.veiculo_id = parseInt(veiculo_id)

    const solicitacoes = await prisma.solicitacoes_transporte.findMany({
      where: filtro, orderBy: { hora_partida: 'asc' }
    })

    const resultado = await Promise.all(solicitacoes.map(async (s) => {
      const funcionario = await prisma.funcionarios.findFirst({ where: { id: s.solicitante_id } })
      const pessoa = funcionario ? await prisma.pessoas.findFirst({ where: { id: funcionario.pessoa_id } }) : null
      const veiculo = s.veiculo_id ? await prisma.veiculos.findFirst({ where: { id: s.veiculo_id } }) : null
      return {
        id: s.id.toString(),
        numero_solicitacao: s.numero_solicitacao,
        motivo: s.motivo,
        local_origem: s.local_origem,
        local_destino: s.local_destino,
        data_partida: s.data_partida,
        hora_partida: s.hora_partida,
        solicitante: pessoa?.nome ?? 'Desconhecido',
        veiculo: veiculo ? `${veiculo.modelo} (${veiculo.placa})` : '-'
      }
    }))

    res.json({ sucesso: true, dados: resultado })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro ao buscar calendário.' })
  }
}

export async function remarcasSolicitacao(req, res) {
  const { id } = req.params
  const { data_partida, hora_partida } = req.body
  try {
    await prisma.solicitacoes_transporte.update({
      where: { id: BigInt(id) },
      data: {
        data_partida: new Date(data_partida),
        hora_partida: hora_partida ? (() => {
          const [h, m] = hora_partida.split(':')
          return new Date(1970, 0, 1, parseInt(h), parseInt(m), 0)
        })() : null
      }
    })
    res.json({ sucesso: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: error.message })
  }
}