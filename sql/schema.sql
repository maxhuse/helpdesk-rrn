PRAGMA encoding="UTF-8";

PRAGMA strict=ON;
PRAGMA foreign_keys = ON;

/* Table structure for table `users` */
DROP TABLE IF EXISTS `users`;

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

/* Table structure for table `tickets` */
DROP TABLE IF EXISTS `tickets`;

CREATE TABLE `tickets` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `customer_id` INTEGER NOT NULL,
  `status` varchar(10) DEFAULT 'new',            /*  new, assigned, pending, closed */
  `creation_date` INTEGER NOT NULL,
  `staff_id` INTEGER DEFAULT NULL,               /* staff who works with the tickets */
  `subject` text DEFAULT NULL,
  `message` text DEFAULT NULL,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (staff_id) REFERENCES users(id)
);
