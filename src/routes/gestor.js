import { Router } from 'express'
import { listarPendentes } from '../controllers/GestorControllers.js'

const router = Router()

router.get('/pendentes', listarPendentes)

export default router