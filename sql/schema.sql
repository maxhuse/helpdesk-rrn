PRAGMA encoding="UTF-8";

PRAGMA strict=ON;

/* Table structure for table `users` */
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `login` varchar(100) DEFAULT NULL UNIQUE,
  `password` varchar(128) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,            /* admin, engineer, customer */
  `description` text,
  `salt` varchar(48) DEFAULT NULL,
  `active` TINYINT(1) DEFAULT '1',
  `email` varchar(255) DEFAULT NULL
);
