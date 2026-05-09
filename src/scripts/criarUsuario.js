import bcrypt from 'bcrypt'
import prisma from '../database/prisma.js'

async function criarUsuario() {
  const senhaHash = await bcrypt.hash('123456', 10)

  // Usuário comum
  await prisma.usuarios.create({
    data: {
      pessoa_id: 1,
      email: 'usuario@teste.com',
      senha_hash: 123456,
      perfil: 'usuario'
    }
  })

  // Gestor
  await prisma.usuarios.create({
    data: {
      pessoa_id: 1,
      email: 'gestor@teste.com',
      senha_hash: 123456,
      perfil: 'gestor'
    }
  })

  console.log('Usuários criados com sucesso!')
}

criarUsuario()
  .catch(console.error)
  .finally(() => prisma.$disconnect())