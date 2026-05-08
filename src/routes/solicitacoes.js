import { Router } from 'express'
import { criarSolicitacao } from '../controllers/SolicitacoesController.js'

const router = Router()

router.post('/', criarSolicitacao)

export default router