import { Router } from 'express'
import { listarPendentes, atualizarStatus, listarHistorico } from '../controllers/GestorControllers.js'

const router = Router()

router.get('/pendentes', listarPendentes)
router.get('/historico', listarHistorico)
router.patch('/solicitacao/:id', atualizarStatus)

export default router