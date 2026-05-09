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
    const numero_solicitacao = Date.now()

    // 1. Cria a solicitação principal
    const solicitacao = await prisma.solicitacoes_transporte.create({
      data: {
        numero_solicitacao,
        solicitante_id: solicitante_id ? parseInt(solicitante_id) : 1,
        motivo,
        veiculo_id: veiculo_id ? parseInt(veiculo_id) : null,
        motorista_id: motorista_id ? parseInt(motorista_id) : null,
        ajudantes: parseInt(ajudantes) || 0,
        data_partida: data_partida ? new Date(data_partida) : null,
        hora_partida: hora_partida || null,
        data_chegada: data_chegada ? new Date(data_chegada) : null,
        hora_chegada: hora_chegada || null,
        local_origem,
        local_destino,
      }
    })

    const solicitacaoId = Number(solicitacao.id)

    // 2. Cria os passageiros separadamente
    if (passageiros?.length > 0) {
      await prisma.passageiros_solicitacao.createMany({
        data: passageiros.map(nome => ({
          solicitacao_id: solicitacaoId,
          nome_passageiro: nome
        }))
      })
    }

    // 3. Cria as paradas separadamente
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