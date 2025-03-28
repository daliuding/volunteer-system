
CREATE DATABASE IF NOT EXISTS volunteer_db;
USE volunteer_db;

CREATE TABLE IF NOT EXISTS admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(20)
);

INSERT INTO admin (username, password) VALUES ('admin', '1234');


CREATE TABLE IF NOT EXISTS volunteers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,    -- 新增真实姓名
  id_card VARCHAR(18) UNIQUE NOT NULL, -- 新增身份证号
  age INT NOT NULL,                  -- 新增年龄
  phone VARCHAR(11) NOT NULL         -- 新增电话
);

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