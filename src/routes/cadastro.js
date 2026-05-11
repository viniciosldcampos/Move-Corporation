import { Router } from 'express'
import {
  listarDepartamentos,
  listarFuncionarios,
  listarMotoristas,
  listarMotoristasPendentes,
  listarMotoristasAprovados,
  listarVeiculos,
  cadastrarFuncionario,
  cadastrarDepartamento,
  cadastrarMotorista,
  cadastrarVeiculo,
  aprovarMotorista
} from '../controllers/CadastroController.js'

const router = Router()

router.get('/departamentos', listarDepartamentos)
router.get('/funcionarios', listarFuncionarios)
router.get('/motoristas', listarMotoristas)
router.get('/motoristas/pendentes', listarMotoristasPendentes)
router.get('/motoristas/aprovados', listarMotoristasAprovados)
router.get('/veiculos', listarVeiculos)
router.post('/funcionario', cadastrarFuncionario)
router.post('/departamento', cadastrarDepartamento)
router.post('/motorista', cadastrarMotorista)
router.post('/veiculo', cadastrarVeiculo)
router.patch('/motorista/:id/aprovar', aprovarMotorista)

export default router
