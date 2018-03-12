PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `Sessions` (`sid` VARCHAR(32) PRIMARY KEY, `expires` DATETIME, `data` TEXT, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
INSERT INTO Sessions VALUES('LW_xYOCwADYRjGSCuTIBuE_5JfQdAz4I','2018-03-13 12:31:27.746 +00:00','{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"role":"admin"}}','2018-03-12 12:24:40.495 +00:00','2018-03-12 12:31:27.747 +00:00');
CREATE TABLE `users` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` varchar(255) NOT NULL,
  `login` varchar(100) NOT NULL UNIQUE,
  `password` varchar(128) NOT NULL,
  `role` varchar(20) NOT NULL,                   /* admin, engineer, customer */
  `description` text DEFAULT NULL,
  `salt` varchar(48) NOT NULL,
  `active` TINYINT(1) DEFAULT '1',
  `email` varchar(255) DEFAULT NULL
);
INSERT INTO users VALUES(1,'Administrator','admin1','58368473de545abcb0ed43eeea3191ede747f60525facec9650a40344479ee20009a15696b97df6dfbf645fbacb70574a95bffd4dbe14ded15328dfa46cbc097','admin','','c6c8d748dfe468c2891251949ea1cf5db9013877ce87af26',1,'');
INSERT INTO users VALUES(2,'Engineer#1','engineer','65148f5cea4062ef0304af64f058710e449105c7d5ce450b2968e9022bd15d8b36eb0262d7f6bb61b27a0ceb38a0e69036561361d51ffe8c348d1320557e1d78','engineer','','a332222dc406e5f143941e5fd0e12ef9d4455facc6398111',1,'');
INSERT INTO users VALUES(3,'Customer1','customer1','377fd6e951f2c076773f081c83db24cdb2719ebad077fc2a93a1f21402819db453d1c899d2e9172bf8dc08f3813b40bfd40edc31791be1c621949a398ba1ecf2','customer','','ce92503a9892a97c0b92498b89395223ee3d31d67c3cacb4',1,'');
INSERT INTO users VALUES(4,'Customer2','customer2','b627cca09bf854ffcdb2593038cdf2493ea1bcc9146cf39b5316ea1211a795b5f6d906fd56283233296623f8b03d6abe6be0d250d44653cd5f05188036bf0254','customer',NULL,'4f49ee103d9f00b71e33e7c357b83b64069eb4a340bc7402',1,NULL);
INSERT INTO users VALUES(5,'Customer3','customer3','92e799254377143d48403ebacb629d55aa967a8368f1477390b29cc9319d424ea6974508f527a71130838067da771ab31f3b2cd3719c727da99616f9ceb0e3a3','customer','','8464813b5f1bcd9c8919ebe44e6eb464fde40dc392f29eda',1,'');
INSERT INTO users VALUES(6,'Customer4','customer4','bf3b3c4b8b53f27432114f64540e31eafda12a96d5c8236c76f0418ca20a907a5a00091c9dd5890283b493c565b28b6e575438b0865bbf35816526eca32dea95','customer','test note','9773f54ec120b005cb2767e08ca0faae5af6479771ce31e9',1,'');
INSERT INTO users VALUES(7,'Engineer#2','engineer2','ca1d2807f165a33164480bcbcd27672beb6cf51ead67fa6495faed86329d8bfc7386684c48b0517d2af4002f989747893d4b0377cc9e4fbaad897144a1ac6218','engineer',NULL,'81a933d351b88020be1f429cedba33143c4be784ed8727b9',1,NULL);
CREATE TABLE `messages` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `user_id` INTEGER NOT NULL,
  `ticket_id` INTEGER NOT NULL,
  `date` INTEGER NOT NULL,
  `text` text NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);
INSERT INTO messages VALUES(1,3,1,1516445460,'I can''t attach file to the email message');
INSERT INTO messages VALUES(2,4,2,1516465797,'Nothing works on my computer');
INSERT INTO messages VALUES(3,5,3,1516465883,'I did nothing and it broke');
CREATE TABLE IF NOT EXISTS "tickets" (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `customer_id` INTEGER NOT NULL,
  `status` varchar(10) DEFAULT 'new',
  `creation_date` INTEGER NOT NULL,
  `staff_id` INTEGER DEFAULT NULL,
  `subject` text DEFAULT NULL,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (staff_id) REFERENCES users(id)
);
INSERT INTO tickets VALUES(1,3,'new',1516445460,NULL,'Can not upload file');
INSERT INTO tickets VALUES(2,4,'assigned',1516465797,2,'Nothing works');
INSERT INTO tickets VALUES(3,5,'pending',1516465883,NULL,'Everything broke');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',7);
INSERT INTO sqlite_sequence VALUES('messages',12);
INSERT INTO sqlite_sequence VALUES('tickets',9);
COMMIT;
