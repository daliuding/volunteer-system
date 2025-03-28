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

// 志愿者注册接口
app.post('/api/register', async (req, res) => {
  const { name, id_card, age, phone } = req.body

  try {
    // 检查身份证是否已注册
    const [idCardCheck] = await pool.query(
      'SELECT id FROM volunteers WHERE id_card = ?',
      [id_card]
    )
    if (idCardCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: '该身份证已注册'
      })
    }

    // 插入新用户
    const [result] = await pool.query(
      'INSERT INTO volunteers (name, id_card, age, phone) VALUES (?, ?, ?, ?)',
      [name, id_card, age, phone]
    )

    res.json({
      success: true,
      userId: result.insertId
    })
  } catch (err) {
    console.error('注册失败:', err)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

// 查询所有志愿者接口
app.get('/api/volunteers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM volunteers')
    res.json({
      success: true,
      data: rows
    })
  } catch (err) {
    console.error('查询志愿者信息失败:', err)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

// 查询指定志愿者姓名的接口
app.get('/api/volunteer/:name', async (req, res) => {
  const { name } = req.params

  try {
    const [rows] = await pool.query(
      'SELECT * FROM volunteers WHERE name = ?',
      [name]
    )
    if (rows.length > 0) {
      res.json({
        success: true,
        data: rows
      })
    } else {
      res.status(404).json({
        success: false,
        message: '未找到匹配的志愿者'
      })
    }
  } catch (err) {
    console.error('查询志愿者信息失败:', err)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/*
 * 志愿者服务管理接口, 包括：服务签到、服务记录查询
 */
// 提交服务记录
app.post('/api/service-registery', async (req, res) => {
  const { volunteer_id, service_date, start_time, end_time, content } = req.body
  try {
    // 验证时间有效性
    if (start_time >= end_time) {
      return res.status(400).json({ error: '结束时间必须晚于开始时间' })
    }
    const [result] = await pool.query(
      `INSERT INTO service_records
        (volunteer_id, service_date, start_time, end_time, content)
      VALUES (?, ?, ?, ?, ?)`,
      [volunteer_id, service_date, start_time, end_time, content]
    )
    res.json({
      success: true,
      recordId: result.insertId
    })
  } catch (err) {
    res.status(500).json({ error: '服务记录创建失败' })
  }
})


app.listen(3000, () => {
  console.log('后端服务运行在 http://localhost:3000')
})