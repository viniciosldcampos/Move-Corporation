import prisma from '../database/prisma.js'

export async function listarPendentes(req, res) {
  try {
    const solicitacoes = await prisma.solicitacoes_transporte.findMany({
      where: { status: 'pendente' },
      orderBy: { data_hora_solicitacao: 'desc' }
    })

    // Busca o nome do solicitante separadamente
    const resultado = await Promise.all(solicitacoes.map(async (s) => {
      const funcionario = await prisma.funcionarios.findFirst({
        where: { id: s.solicitante_id }
      })
      const pessoa = funcionario
        ? await prisma.pessoas.findFirst({ where: { id: funcionario.pessoa_id } })
        : null

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