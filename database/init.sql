
USE volunteer_db;

CREATE TABLE IF NOT EXISTS admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(20)
);

INSERT INTO admin (username, password) VALUES ('admin', '1234');