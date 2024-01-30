CREATE DATABASE IF NOT EXISTS cmsc127;

use cmsc127;

CREATE TABLE IF NOT EXISTS person (
	person_id INT(5) NOT NULL AUTO_INCREMENT,
	total_outstanding_balance INT(9),
	first_name VARCHAR(20),
	middle_name VARCHAR(20),
	last_name VARCHAR(20),
	PRIMARY KEY(person_id)
);

CREATE TABLE IF NOT EXISTS circle (
	circle_id INT(3) NOT NULL AUTO_INCREMENT,
	circle_name VARCHAR(20),
	PRIMARY KEY(circle_id)
);

CREATE TABLE IF NOT EXISTS transaction (
	transaction_id INT(3) NOT NULL AUTO_INCREMENT,
	date_of_transaction DATE,
	value INT(9),
	outstanding_balance INT(9),
	payer_id INT(5),
	type VARCHAR(20),
	is_settled BOOLEAN,
	PRIMARY KEY(transaction_id)
);

CREATE TABLE IF NOT EXISTS person_joins_circle(
	person_id INT(5) NOT NULL,
	circle_id INT(3) NOT NULL,
	CONSTRAINT person_joins_circle_uk UNIQUE(person_id, circle_id)
);

CREATE TABLE IF NOT EXISTS circle_has_transaction (
	circle_id INT(3) NOT NULL,
	transaction_id INT(3) NOT NULL,
	CONSTRAINT circle_has_transaction_uk UNIQUE(circle_id, transaction_id)
);

CREATE TABLE IF NOT EXISTS person_has_transaction (
	person_id INT(5) NOT NULL,
	transaction_id INT(3) NOT NULL,
	CONSTRAINT person_has_transaction_uk UNIQUE(person_id, transaction_id)
);

CREATE USER IF NOT EXISTS 'end_user'@'localhost' IDENTIFIED BY 'cmsc127';

grant select, insert, update, delete on cmsc127.person to 'end_user'@'localhost';
grant select, insert, update, delete on cmsc127.circle to 'end_user'@'localhost';
grant select, insert, update, delete on cmsc127.transaction to 'end_user'@'localhost';
grant select, insert, update, delete on cmsc127.person_joins_circle to 'end_user'@'localhost';
grant select, insert, update, delete on cmsc127.circle_has_transaction to 'end_user'@'localhost';
grant select, insert, update, delete on cmsc127.person_has_transaction to 'end_user'@'localhost';