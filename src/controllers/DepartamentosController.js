export async function listarDepartamentos(req, res) {
  try {
    const departamentos = await db.query('SELECT * FROM departamentos')
    res.json(departamentos.rows)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar departamentos' })
  }
}