import { Router } from 'express'
import { listarPendentes } from '../controllers/GestorController.js'

const router = Router()

router.get('/pendentes', listarPendentes)

export default router