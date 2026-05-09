import { Router } from 'express'
import { listarPendentes, atualizarStatus, listarHistorico, listarCalendario } from '../controllers/GestorControllers.js'

const router = Router()

router.get('/pendentes', listarPendentes)
router.get('/historico', listarHistorico)
router.get('/calendario', listarCalendario)
router.patch('/solicitacao/:id', atualizarStatus)

export default router