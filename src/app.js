import express from 'express'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const app = express()

// Descobre o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Serve os arquivos estáticos do frontend
app.use(express.static(join(__dirname, './')))

app.use(express.json())

// Permite o frontend acessar o backend (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})


// Rotas
import solicitacoesRoutes from './routes/solicitacoes.js'
import departamentosRoutes from './routes/departamentos.js'
app.use('/api/solicitacoes', solicitacoesRoutes)
app.use('/api/departamentos', departamentosRoutes)

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})