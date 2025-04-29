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
  try {
    // 验证身份证号(非必填项)
    if (req.body.id_card) {
      if (req.body.id_card && !/^\d{17}[\dX]$/i.test(req.body.id_card)) {
        return res.status(400).json({ error: '身份证格式错误' })
      }
      // 检查身份证是否已注册
      const [idCardCheck] = await pool.query(
        'SELECT id FROM volunteers WHERE id_card = ?',
        [req.body.id_card]
      )
      if (idCardCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: '该身份证已注册'
        })
      }
    } else {
      req.body.id_card = null;
    }
    if (req.body.gender === '') {
      req.body.gender = null;
    }
    // 检查 birth_date 字段，如果为空则设置为 null，否则数据库报错
    if (req.body.birth_date === '') {
      req.body.birth_date = null;
    }
    // 验证JSON字段
    try {
      JSON.parse(req.body.specialties)
      JSON.parse(req.body.experiences)
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'JSON数据格式错误'
      })
    }
    // 插入新用户
    const [result] = await pool.query(
      'INSERT INTO volunteers SET ?', 
      {
        ...req.body,
        specialties: JSON.stringify(req.body.specialties),
        experiences: JSON.stringify(req.body.experiences)
      }
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
      'SELECT * FROM volunteers WHERE real_name = ?',
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
 * 志愿者服务管理接口, 包括：服务签到、服务积分查询
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

// 获取所有志愿者积分汇总
app.get('/api/services/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        v.id,
        v.real_name AS name,
        v.mobile,
        COALESCE(SUM(
            TIMESTAMPDIFF(HOUR, s.start_time, s.end_time) +
            (CASE WHEN TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time) % 60 >= 30 THEN 1 ELSE 0 END))
            , 0)
            AS total_points
      FROM volunteers v
      LEFT JOIN service_records s ON v.id = s.volunteer_id
      GROUP BY v.id
      ORDER BY total_points DESC
    `)
    res.json(rows.map(item => ({
      ...item,
      total_points: item.total_points || 0 // 处理null值
    })))
  } catch (err) {
    res.status(500).json({ error: '获取积分汇总失败' })
  }
})

// 获取单个志愿者详细积分，不能重名（重名需要在录入用户时就处理，否则服务登记无法正确关联）
// 小于半小时的服务记录不计入积分，大于等于30min的按1小时计算
app.get('/api/services/detail/:name', async (req, res) => {
  const { name } = req.params
  try {
    // 先查询volunteers表，获取volunteer_id
    const [volunteer_id] = await pool.query(`
      SELECT id FROM volunteers WHERE real_name = ?
    `, name)

    if (volunteer_id.length === 0) {
      return res.status(404).json({ error: '未找到匹配的志愿者' })
    }
    // 再查询service_records表
    const [rows] = await pool.query(`
        SELECT
          v.real_name AS name,
          v.mobile,
          s.service_date,
          s.start_time,
          s.end_time,
          s.content,
          COALESCE(
            TIMESTAMPDIFF(HOUR, s.start_time, s.end_time) +
            (CASE WHEN TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time) % 60 >= 30 THEN 1 ELSE 0 END), 0)
            AS points
        FROM volunteers v
        LEFT JOIN service_records s ON v.id = s.volunteer_id
        WHERE v.id = ?
        ORDER BY s.service_date DESC, s.start_time DESC
      `, volunteer_id[0].id)

      // 计算总积分
      const total_points = rows.reduce((acc, cur) => acc + cur.points, 0)

      res.json({
        detail: rows.map(item => ({
          ...item,
          points: item.points || 0 // 处理null值
        })),
        total_points: total_points || 0 // 计算总积分
       })
  } catch (err) {
    res.status(500).json({ error: '获取详细记录失败' })
  }
})

// 年度查询：所有志愿者的 year 年度服务汇总
app.get('/api/services/summary/:year', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        v.id,
        v.real_name AS name,
        v.mobile,
        COALESCE(SUM(
            TIMESTAMPDIFF(HOUR, s.start_time, s.end_time) +
            (CASE WHEN TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time) % 60 >= 30 THEN 1 ELSE 0 END))
            , 0)
        AS total_points
      FROM volunteers v
      LEFT JOIN service_records s ON v.id = s.volunteer_id
      WHERE YEAR(s.service_date) = ?
      GROUP BY v.id
      ORDER BY total_points DESC
    `, req.params.year)

    res.json(rows.map(item => ({
      ...item,
      total_points: item.total_points || 0 // 处理null值
    })))
  } catch (err) {
    res.status(500).json({ error: '获取积分汇总失败' })
  }
})

// 年度查询：单个志愿者的 year 年度服务详情
// 小于半小时的服务记录不计入积分，大于等于30min的按1小时计算
app.get('/api/services/year-detail/:year', async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT
          v.real_name AS name,
          v.mobile,
          s.service_date,
          s.start_time,
          s.end_time,
          s.content,
          COALESCE(
            TIMESTAMPDIFF(HOUR, s.start_time, s.end_time) +
            (CASE WHEN TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time) % 60 >= 30 THEN 1 ELSE 0 END), 0)
            AS points
        FROM volunteers v
        LEFT JOIN service_records s ON v.id = s.volunteer_id
        WHERE YEAR(s.service_date) = ?
        ORDER BY v.id, s.service_date DESC
    `, req.params.year)

    res.json(rows.map(item => ({
      ...item,
      points: item.points || 0 // 处理null值
    })))
  } catch (err) {
    res.status(500).json({ error: '获取详细记录失败' })
  }
})

app.listen(3000, () => {
  console.log('后端服务运行在 http://localhost:3000')
})