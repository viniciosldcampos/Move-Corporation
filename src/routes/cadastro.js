import { Router } from 'express'
import {
  listarDepartamentos, listarCargos, listarFuncionarios,
  listarMotoristas, listarMotoristasPendentes, listarMotoristasAprovados,
  listarVeiculos, cadastrarFuncionarioComUsuario, cadastrarDepartamento,
  cadastrarMotorista, cadastrarVeiculo, aprovarMotorista,
  editarFuncionario, desativarFuncionario,
  editarDepartamento, desativarDepartamento,
  editarVeiculo, desativarVeiculo,
  editarMotorista, desativarMotorista
} from '../controllers/CadastroController.js'

const router = Router()

router.get('/departamentos', listarDepartamentos)
router.get('/cargos', listarCargos)
router.get('/funcionarios', listarFuncionarios)
router.get('/motoristas', listarMotoristas)
router.get('/motoristas/pendentes', listarMotoristasPendentes)
router.get('/motoristas/aprovados', listarMotoristasAprovados)
router.get('/veiculos', listarVeiculos)
router.post('/funcionario', cadastrarFuncionarioComUsuario)
router.post('/departamento', cadastrarDepartamento)
router.post('/motorista', cadastrarMotorista)
router.post('/veiculo', cadastrarVeiculo)
router.patch('/motorista/:id/aprovar', aprovarMotorista)
router.patch('/funcionario/:id', editarFuncionario)
router.patch('/funcionario/:id/desativar', desativarFuncionario)
router.patch('/departamento/:id', editarDepartamento)
router.patch('/departamento/:id/desativar', desativarDepartamento)
router.patch('/veiculo/:id', editarVeiculo)
router.patch('/veiculo/:id/desativar', desativarVeiculo)
router.patch('/motorista/:id', editarMotorista)
router.patch('/motorista/:id/desativar', desativarMotorista)

export default router
