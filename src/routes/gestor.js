import { Router } from 'express'
import { listarPendentes, atualizarStatus, listarHistorico, listarCalendario, remarcasSolicitacao } from '../controllers/GestorControllers.js'

const router = Router()

router.get('/pendentes', listarPendentes)
router.get('/historico', listarHistorico)
router.get('/calendario', listarCalendario)
router.patch('/solicitacao/:id', atualizarStatus)
router.patch('/solicitacao/:id/remarcar', remarcasSolicitacao)

export default router