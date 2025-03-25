const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql2/promise') // 使用 mysql2/promise 驱动
const app = express() // 创建 express 应用

app.use(cors()) // 允许跨域
app.use(bodyParser.json()) // 解析 JSON 请求体

// 真实数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'volunteer_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

/* SQL 数据库登录接口 */
app.post('/api/login', async (req, res) => {
  console.log('进入了backend:','req.body:', req.body)
  const { username, password } = req.body

  // 从SQL数据库中查找用户
  try {
    const [rows] = await pool.query(
      'SELECT * FROM admin WHERE username = ? AND password = ?',
      [username, password]
    )
    if (rows.length > 0) {
      // 用户验证成功，生成简单 token（token-用户名-时间戳），不依赖外部库 jsonwebtoken
      const token = `token-${rows[0].username}-${Date.now()}`; // 简单拼接生成 token

      res.json({ success: true, token })  // 返回 token 给前端
      console.log('后端登录成功, 生成 token:', token)
    } else {
      res.json({ success: false, message: 'back 用户名或密码错误' })
    }
  }
  catch (err) {
    console.error('数据库查询出错:', err.message);
    res.status(500).json({ success: false, message: '服务器内部错误' })
  }
})




/* 定义路由（pool已可用）
// 添加测试接口, 返回JASON 格式的 volunteers中的 admin 数组
// 浏览器访问 http://localhost:3000/api/test-db 查看
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
  */



app.listen(3000, () => {
  console.log('后端服务运行在 http://localhost:3000')
})