document.getElementById('loginFormUser').addEventListener('submit', async (e) => {
  e.preventDefault()
  await fazerLogin(
    document.getElementById('emailUser').value,
    document.getElementById('passwordUser').value,
    'usuario'
  )
})

document.getElementById('loginFormBoss').addEventListener('submit', async (e) => {
  e.preventDefault()
  await fazerLogin(
    document.getElementById('emailBoss').value,
    document.getElementById('passwordBoss').value,
    'gestor'
  )
})

async function fazerLogin(email, senha, perfil) {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha, perfil })
    })

    const data = await res.json()

    if (data.sucesso) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('perfil', data.perfil)
      localStorage.setItem('nome', data.nome)

      if (data.perfil === 'gestor') {
        window.location.href = '/src/pages/gestor.html'
      } else {
        window.location.href = '/src/pages/usuario.html'
      }
    } else {
      alert(data.erro)
    }

  } catch (error) {
    alert('Não foi possível conectar ao servidor.')
    console.error(error)
  }
}
