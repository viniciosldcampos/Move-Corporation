import prisma from '../database/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function login(req, res) {
  const { email, senha, perfil } = req.body

  try {
    const usuario = await prisma.usuarios.findFirst({
      where: { email, perfil, ativo: true },
      include: { pessoas: true }
    })

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' })
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash)
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta.' })
    }

    await prisma.usuarios.update({
      where: { id: usuario.id },
      data: { ultimo_acesso: new Date() }
    })

    const token = jwt.sign(
      {
        id: usuario.id.toString(),
        perfil: usuario.perfil,
        nome: usuario.pessoas.nome,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      sucesso: true,
      token,
      perfil: usuario.perfil,
      nome: usuario.pessoas.nome
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}