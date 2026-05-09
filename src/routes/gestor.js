import { Router } from 'express'
import { listarPendentes, atualizarStatus } from '../controllers/GestorControllers.js'

const router = Router()

router.get('/pendentes', listarPendentes)
router.patch('/solicitacao/:id', atualizarStatus)

export default router