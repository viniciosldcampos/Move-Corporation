import { Router } from 'express'
import { criarSolicitacao } from '../controllers/solicitacoesController.js'

const router = Router()

router.post('/', criarSolicitacao)

export default router