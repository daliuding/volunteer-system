
CREATE DATABASE IF NOT EXISTS volunteer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE volunteer_db;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(20)
);

INSERT IGNORE INTO admin (username, password) VALUES ('admin', '1234');


-- 志愿者主表
CREATE TABLE IF NOT EXISTS volunteers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  real_name VARCHAR(10) NOT NULL COMMENT '姓名',
  gender ENUM('男','女') NULL COMMENT '性别',
  id_card VARCHAR(18) UNIQUE NULL COMMENT '身份证号',
  department VARCHAR(50) NOT NULL COMMENT '所属部门',
  birth_date DATE NULL COMMENT '出生日期',
  ethnicity VARCHAR(10) NULL COMMENT '民族',
  native_place VARCHAR(10) NULL COMMENT '籍贯',
  domicile VARCHAR(10) NULL COMMENT '户籍地',
  address VARCHAR(30) NULL COMMENT '联系地址',
  education VARCHAR(20) NULL COMMENT '学历',
  political_status VARCHAR(20) NULL COMMENT '政治面貌',
  health_status VARCHAR(10) NULL COMMENT '健康状况',
  mobile VARCHAR(20) UNIQUE NOT NULL COMMENT '手机号',
  wechat VARCHAR(20) NULL COMMENT '微信号',
  qq VARCHAR(20) NULL COMMENT 'QQ号',
  specialties JSON NULL COMMENT '个人特长',
  experiences JSON NULL COMMENT '服务经历',
  qualification TEXT NULL COMMENT '胜任原因',
  guarantee BOOLEAN NULL COMMENT '服从分配',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 服务记录表
CREATE TABLE IF NOT EXISTS service_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  volunteer_id INT NOT NULL,
  service_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
);
