const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql2/promise') // 使用 mysql2/promise 驱动

const app = express() // 创建 express 应用

app.use(cors()) // 允许跨域
app.use(bodyParser.json()) // 解析 JSON 请求体

/* 真实数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'volunteer_db'
})
*/
// 模拟数据库
let volunteers = [
  { id: 1, username: 'admin', password: '1234' }
]

/* SQL 真是数据库登录接口
app.post('/api/login', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM admin WHERE username = ? AND password = ?',
    [req.body.username, req.body.password]
  )
  res.json({ success: rows.length > 0 })
})
  */
 // 登录接口, 模拟数据库
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = volunteers.find(u => u.username === username && u.password === password)
  res.json(user ? { success: true } : { success: false })
})


// 添加测试接口
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM volunteers')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.listen(3000, () => {
  console.log('后端服务运行在 http://localhost:3000')
})