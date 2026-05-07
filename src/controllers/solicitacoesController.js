import prisma from '../database/prisma.js'

export async function criarSolicitacao(req, res) {
  const {
    numero_solicitacao,
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
    passageiros,  // array de strings ex: ["João Silva", "Maria"]
    paradas       // array de strings ex: ["Rua A, 123", "Rua B, 456"]
  } = req.body

  try {
    const solicitacao = await prisma.solicitacoes_transporte.create({
      data: {
        numero_solicitacao: parseInt(numero_solicitacao),
        solicitante_id: parseInt(solicitante_id),
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
        passageiros_solicitacao: {
          create: passageiros?.map(nome => ({ nome_passageiro: nome })) ?? []
        },
        paradas_trajeto: {
          create: paradas?.map((endereco, i) => ({ endereco, ordem: i + 1 })) ?? []
        }
      }
    })

    res.status(201).json({ sucesso: true, id: solicitacao.id.toString() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ sucesso: false, erro: error.message })
  }
}