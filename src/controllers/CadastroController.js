import prisma from '../database/prisma.js'

const serializeBigInt = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v))

export async function listarDepartamentos(req, res) {
  try {
    const departamentos = await prisma.departamentos.findMany({ orderBy: { nome: 'asc' } })
    const centros = await prisma.centros_custo.findMany({ orderBy: { nome: 'asc' } })
    res.json({ sucesso: true, ...serializeBigInt({ departamentos, centros }) })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function listarFuncionarios(req, res) {
  try {
    const funcionarios = await prisma.funcionarios.findMany({ where: { status: 'ativo' }, orderBy: { id: 'asc' } })
    const resultado = await Promise.all(funcionarios.map(async (f) => {
      const pessoa = await prisma.pessoas.findFirst({ where: { id: f.pessoa_id } })
      const depto = f.departamento_id ? await prisma.departamentos.findFirst({ where: { id: f.departamento_id } }) : null
      return { id: f.id.toString(), matricula: f.matricula, nome: pessoa?.nome ?? '-', departamento: depto?.nome ?? '-', status: f.status }
    }))
    res.json({ sucesso: true, dados: resultado })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function listarMotoristas(req, res) {
  try {
    const motoristas = await prisma.motoristas.findMany({ orderBy: { id: 'asc' } })
    const resultado = await Promise.all(motoristas.map(async (m) => {
      const pessoa = await prisma.pessoas.findFirst({ where: { id: m.pessoa_id } })
      return { id: m.id.toString(), nome: pessoa?.nome ?? '-', cnh: m.cnh, validade_cnh: m.validade_cnh, tipo: m.tipo, status: m.status }
    }))
    res.json({ sucesso: true, dados: resultado })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function listarMotoristasPendentes(req, res) {
  try {
    const motoristas = await prisma.motoristas.findMany({ where: { status: 'pendente' }, orderBy: { id: 'asc' } })
    const resultado = await Promise.all(motoristas.map(async (m) => {
      const pessoa = await prisma.pessoas.findFirst({ where: { id: m.pessoa_id } })
      return { id: m.id.toString(), nome: pessoa?.nome ?? '-', cnh: m.cnh, validade_cnh: m.validade_cnh, tipo: m.tipo, status: m.status }
    }))
    res.json({ sucesso: true, dados: resultado })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function listarMotoristasAprovados(req, res) {
  try {
    const motoristas = await prisma.motoristas.findMany({ where: { status: 'aprovado' }, orderBy: { id: 'asc' } })
    const resultado = await Promise.all(motoristas.map(async (m) => {
      const pessoa = await prisma.pessoas.findFirst({ where: { id: m.pessoa_id } })
      return { id: m.id.toString(), nome: pessoa?.nome ?? '-', cnh: m.cnh, validade_cnh: m.validade_cnh, tipo: m.tipo, status: m.status }
    }))
    res.json({ sucesso: true, dados: resultado })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function aprovarMotorista(req, res) {
  const { id } = req.params
  try {
    await prisma.motoristas.update({
      where: { id: BigInt(id) },
      data: { status: 'aprovado', tipo: 'interno' }
    })
    res.json({ sucesso: true })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function cadastrarDepartamento(req, res) {
  const { nome, descricao } = req.body
  try {
    const depto = await prisma.departamentos.create({ data: { nome, descricao } })
    res.status(201).json({ sucesso: true, id: depto.id.toString() })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function cadastrarFuncionario(req, res) {
  const { nome, cpf, email, telefone, matricula, departamento_id, data_contratacao } = req.body
  try {
    const pessoa = await prisma.pessoas.create({ data: { nome, cpf, email, telefone } })
    const funcionario = await prisma.funcionarios.create({
      data: {
        pessoa_id: Number(pessoa.id),
        matricula,
        departamento_id: departamento_id ? Number(departamento_id) : null,
        data_contratacao: new Date(data_contratacao),
        status: 'ativo'
      }
    })
    res.status(201).json({ sucesso: true, id: funcionario.id.toString() })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function cadastrarMotorista(req, res) {
  const { nome, cpf, cnh, validade_cnh, tipo } = req.body
  try {
    const pessoa = await prisma.pessoas.create({ data: { nome, cpf } })
    const motorista = await prisma.motoristas.create({
      data: {
        pessoa_id: Number(pessoa.id),
        cnh,
        validade_cnh: new Date(validade_cnh),
        tipo: tipo ?? 'externo',
        status: tipo === 'interno' ? 'aprovado' : 'pendente'
      }
    })
    res.status(201).json({ sucesso: true, id: motorista.id.toString() })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function listarVeiculos(req, res) {
  try {
    const veiculos = await prisma.veiculos.findMany({ orderBy: { id: 'asc' } })
    const resultado = veiculos.map(v => ({
      id: v.id.toString(), tipo: v.tipo, placa: v.placa,
      modelo: v.modelo, capacidade: v.capacidade, status: v.status
    }))
    res.json({ sucesso: true, dados: resultado })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

export async function cadastrarVeiculo(req, res) {
  const { tipo, placa, modelo, capacidade } = req.body
  try {
    const veiculo = await prisma.veiculos.create({
      data: { tipo, placa: placa.toUpperCase(), modelo, capacidade: capacidade ? parseInt(capacidade) : null, status: 'disponivel' }
    })
    res.status(201).json({ sucesso: true, id: veiculo.id.toString() })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}
