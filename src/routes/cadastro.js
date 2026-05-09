import { Router } from 'express'
import {
  listarDepartamentos,
  listarFuncionarios,
  listarMotoristas,
  cadastrarFuncionario,
  cadastrarDepartamento,
  cadastrarMotorista
} from '../controllers/CadastroController.js'

const router = Router()

router.get('/departamentos', listarDepartamentos)
router.get('/funcionarios', listarFuncionarios)
router.get('/motoristas', listarMotoristas)
router.post('/funcionario', cadastrarFuncionario)
router.post('/departamento', cadastrarDepartamento)
router.post('/motorista', cadastrarMotorista)

export default router