import prisma from '../database/prisma.js'

export async function criarSolicitacao(req, res) {
  const {
    solicitante_id,
    motivo,
    veiculo_id,
    motorista_id,
    ajudantes,
    data_partida,
    hora_partida,
    data_chegada,
    hora_chegada,
    local_origem,
    local_destino,
    passageiros,
    paradas
  } = req.body

  try {
    const ultima = await prisma.solicitacoes_transporte.findFirst({
      orderBy: { numero_solicitacao: 'desc' },
      select: { numero_solicitacao: true }
    })
    const numero_solicitacao = ultima ? Number(ultima.numero_solicitacao) + 1 : 1

    const solicitacao = await prisma.solicitacoes_transporte.create({
      data: {
        numero_solicitacao,
        solicitante_id: solicitante_id ? parseInt(solicitante_id) : 1,
        motivo,
        veiculo_id: veiculo_id ? parseInt(veiculo_id) : null,
        motorista_id: motorista_id ? parseInt(motorista_id) : null,
        ajudantes: parseInt(ajudantes) || 0,

        data_partida: data_partida && hora_partida
          ? new Date(`${data_partida}T${hora_partida}:00`)
          : null,

        hora_partida: data_partida && hora_partida
          ? new Date(`${data_partida}T${hora_partida}:00`)
          : null,

        data_chegada: data_chegada && hora_chegada
          ? new Date(`${data_chegada}T${hora_chegada}:00`)
          : null,

        hora_chegada: data_chegada && hora_chegada
          ? new Date(`${data_chegada}T${hora_chegada}:00`)
          : null,

        local_origem,
        local_destino,
      }
    })

    const solicitacaoId = Number(solicitacao.id)

    if (passageiros?.length > 0) {
      await prisma.passageiros_solicitacao.createMany({
        data: passageiros.map(nome => ({
          solicitacao_id: solicitacaoId,
          nome_passageiro: nome
        }))
      })
    }

    if (paradas?.length > 0) {
      await prisma.paradas_trajeto.createMany({
        data: paradas.map((endereco, i) => ({
          solicitacao_id: solicitacaoId,
          endereco,
          ordem: i + 1
        }))
      })
    }

    res.status(201).json({ sucesso: true, id: solicitacao.id.toString() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ sucesso: false, erro: error.message })
  }
}