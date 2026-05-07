import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

// Permite o frontend acessar o backend (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Rotas
import solicitacoesRoutes from './routes/solicitacoes.js'
app.use('/api/solicitacoes', solicitacoesRoutes)

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})