import { Router } from 'express'
import { listarDepartamentos } from '../controllers/DepartamentosController.js'

const router = Router()

router.get('/', listarDepartamentos)

export default router