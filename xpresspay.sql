/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 5.7.42-log : Database - xpresspay
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`xpresspay` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `xpresspay`;

/*Table structure for table `audit_logs` */

DROP TABLE IF EXISTS `audit_logs`;

CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `actor_userid` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `deduction_types` */

DROP TABLE IF EXISTS `deduction_types`;

CREATE TABLE `deduction_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` enum('percent_of_gross','percent_of_net','fixed_amount') COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` decimal(10,4) NOT NULL DEFAULT '0.0000',
  `applies_to` enum('all','selected_employees') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `is_mandatory` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_deduction_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `employee_deductions` */

DROP TABLE IF EXISTS `employee_deductions`;

CREATE TABLE `employee_deductions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userid` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deduction_id` int(10) unsigned NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_empded_ded` (`deduction_id`),
  KEY `idx_empded_user` (`userid`),
  KEY `idx_ded_user` (`userid`),
  CONSTRAINT `fk_empded_ded` FOREIGN KEY (`deduction_id`) REFERENCES `deduction_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `employee_incomes` */

DROP TABLE IF EXISTS `employee_incomes`;

CREATE TABLE `employee_incomes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userid` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `income_type` enum('rate_override','incentive','extra','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `pay_type` enum('once','recurring') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'recurring',
  `effective_from` date DEFAULT NULL,
  `effective_to` date DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_incomes_user` (`userid`,`active`),
  KEY `idx_inc_user` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `employee_loans` */

DROP TABLE IF EXISTS `employee_loans`;

CREATE TABLE `employee_loans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userid` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loan_type` enum('bank','ona','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `principal_amount` decimal(12,2) NOT NULL,
  `start_deduction` date NOT NULL,
  `installment_amt` decimal(12,2) NOT NULL,
  `periodicity` enum('biweekly','monthly') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'biweekly',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_loans_user` (`userid`,`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ot_rules` */

DROP TABLE IF EXISTS `ot_rules`;

CREATE TABLE `ot_rules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rule_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `condition_type` enum('weekday','holiday','leave_type','manual') COLLATE utf8mb4_unicode_ci NOT NULL,
  `condition_value` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `multiplier` decimal(5,2) NOT NULL DEFAULT '1.50',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `payroll_periods` */

DROP TABLE IF EXISTS `payroll_periods`;

CREATE TABLE `payroll_periods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `period_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `frequency` enum('weekly','biweekly','monthly','custom') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'biweekly',
  `is_open` tinyint(1) NOT NULL DEFAULT '1',
  `locked_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_period_range` (`date_start`,`date_end`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `payroll_run_items` */

DROP TABLE IF EXISTS `payroll_run_items`;

CREATE TABLE `payroll_run_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `run_id` bigint(20) unsigned NOT NULL,
  `userid` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gross_income` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_deductions` decimal(12,2) NOT NULL DEFAULT '0.00',
  `meal_deductions` decimal(12,2) NOT NULL DEFAULT '0.00',
  `net_income` decimal(12,2) NOT NULL DEFAULT '0.00',
  `details_json` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_items_run` (`run_id`),
  KEY `idx_items_user` (`userid`),
  CONSTRAINT `fk_items_run` FOREIGN KEY (`run_id`) REFERENCES `payroll_runs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `payroll_runs` */

DROP TABLE IF EXISTS `payroll_runs`;

CREATE TABLE `payroll_runs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `period_id` int(10) unsigned NOT NULL,
  `status` enum('calculated','reviewed','approved','locked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'calculated',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `locked_by` int(11) DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_runs_period` (`period_id`),
  CONSTRAINT `fk_runs_period` FOREIGN KEY (`period_id`) REFERENCES `payroll_periods` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `payroll_settings` */

DROP TABLE IF EXISTS `payroll_settings`;

CREATE TABLE `payroll_settings` (
  `id` tinyint(3) unsigned NOT NULL,
  `default_ot_multiplier` decimal(5,2) NOT NULL DEFAULT '1.50',
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HTG',
  `locale` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'fr-HT',
  `rounding_rule` enum('none','half_up_0.5','ceil_0.25') COLLATE utf8mb4_unicode_ci DEFAULT 'none',
  `meal_price_breakfast` decimal(10,2) NOT NULL DEFAULT '25.00',
  `meal_price_lunch_std` decimal(10,2) NOT NULL DEFAULT '35.00',
  `meal_price_lunch_premium` decimal(10,2) NOT NULL DEFAULT '50.00',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* Function  structure for function  `fn_calculate_meal_cost` */

/*!50003 DROP FUNCTION IF EXISTS `fn_calculate_meal_cost` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `fn_calculate_meal_cost`(
    p_userid VARCHAR(30),
    p_start_date DATE,
    p_end_date DATE
) RETURNS decimal(12,2)
    DETERMINISTIC
BEGIN
    DECLARE total_cost DECIMAL(12,2) DEFAULT 0;

    SELECT COALESCE(SUM(total_daily_cost), 0)
    INTO total_cost
    FROM v_daily_meal_costs
    WHERE userid = p_userid
      AND meal_date BETWEEN p_start_date AND p_end_date;

    RETURN total_cost;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_apply_meal_deductions` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_apply_meal_deductions` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_apply_meal_deductions`(
    IN p_run_id BIGINT
)
BEGIN
    DECLARE v_period_start DATE;
    DECLARE v_period_end DATE;

    -- Récupérer la période liée au run
    SELECT pp.date_start, pp.date_end
    INTO v_period_start, v_period_end
    FROM payroll_runs pr
    JOIN payroll_periods pp ON pr.period_id = pp.id
    WHERE pr.id = p_run_id;

    -- Mettre à jour chaque employé du payroll_run avec ses coûts repas
    UPDATE payroll_run_items pri
    JOIN (
        SELECT userid, fn_calculate_meal_cost(userid, v_period_start, v_period_end) AS meal_cost
        FROM v_employee_summary
    ) mc ON mc.userid = pri.userid
    SET pri.meal_deductions = mc.meal_cost,
        pri.total_deductions = pri.total_deductions + mc.meal_cost,
        pri.net_income = pri.gross_income - (pri.total_deductions + mc.meal_cost)
    WHERE pri.run_id = p_run_id;
END */$$
DELIMITER ;

/*Table structure for table `v_attendance_full` */

DROP TABLE IF EXISTS `v_attendance_full`;

/*!50001 DROP VIEW IF EXISTS `v_attendance_full` */;
/*!50001 DROP TABLE IF EXISTS `v_attendance_full` */;

/*!50001 CREATE TABLE  `v_attendance_full`(
 `userid` varchar(30) ,
 `full_name` varchar(96) ,
 `department` varchar(200) ,
 `designation` varchar(100) ,
 `date` date ,
 `att_in` varchar(5) ,
 `att_break` varchar(5) ,
 `att_resume` varchar(5) ,
 `att_out` varchar(5) ,
 `workhour` decimal(4,2) ,
 `overtime` decimal(4,2) ,
 `undertime` decimal(4,2) ,
 `leavetype` int(11) 
)*/;

/*Table structure for table `v_company_info` */

DROP TABLE IF EXISTS `v_company_info`;

/*!50001 DROP VIEW IF EXISTS `v_company_info` */;
/*!50001 DROP TABLE IF EXISTS `v_company_info` */;

/*!50001 CREATE TABLE  `v_company_info`(
 `id` int(11) ,
 `company_name` varchar(100) ,
 `Email` varchar(50) ,
 `Address1` longtext ,
 `Address2` longtext ,
 `City` varchar(100) ,
 `State` varchar(100) ,
 `Zip` varchar(50) ,
 `Country` varchar(50) ,
 `phone` varchar(20) ,
 `fax` varchar(20) ,
 `timezone` varchar(10) ,
 `report_logo` longtext 
)*/;

/*Table structure for table `v_daily_meal_costs` */

DROP TABLE IF EXISTS `v_daily_meal_costs`;

/*!50001 DROP VIEW IF EXISTS `v_daily_meal_costs` */;
/*!50001 DROP TABLE IF EXISTS `v_daily_meal_costs` */;

/*!50001 CREATE TABLE  `v_daily_meal_costs`(
 `userid` varchar(45) ,
 `meal_date` date ,
 `count_breakfast` bigint(21) ,
 `count_lunch_std` bigint(21) ,
 `count_lunch_premium` bigint(21) ,
 `total_meals` bigint(21) ,
 `cost_breakfast` decimal(30,2) ,
 `cost_lunch_std` decimal(30,2) ,
 `cost_lunch_premium` decimal(30,2) ,
 `total_daily_cost` decimal(32,2) 
)*/;

/*Table structure for table `v_daily_meal_summary` */

DROP TABLE IF EXISTS `v_daily_meal_summary`;

/*!50001 DROP VIEW IF EXISTS `v_daily_meal_summary` */;
/*!50001 DROP TABLE IF EXISTS `v_daily_meal_summary` */;

/*!50001 CREATE TABLE  `v_daily_meal_summary`(
 `userid` varchar(45) ,
 `meal_date` date ,
 `count_breakfast` bigint(21) ,
 `count_lunch_std` bigint(21) ,
 `count_lunch_premium` bigint(21) ,
 `total_meals` bigint(21) 
)*/;

/*Table structure for table `v_device_transactions` */

DROP TABLE IF EXISTS `v_device_transactions`;

/*!50001 DROP VIEW IF EXISTS `v_device_transactions` */;
/*!50001 DROP TABLE IF EXISTS `v_device_transactions` */;

/*!50001 CREATE TABLE  `v_device_transactions`(
 `userid` varchar(45) ,
 `transaction_date` date ,
 `workcode` int(11) 
)*/;

/*Table structure for table `v_employee_summary` */

DROP TABLE IF EXISTS `v_employee_summary`;

/*!50001 DROP VIEW IF EXISTS `v_employee_summary` */;
/*!50001 DROP TABLE IF EXISTS `v_employee_summary` */;

/*!50001 CREATE TABLE  `v_employee_summary`(
 `userid` varchar(30) ,
 `full_name` varchar(96) ,
 `department` varchar(200) ,
 `designation` varchar(100) ,
 `hire_date` datetime ,
 `pay_rate` decimal(9,3) ,
 `pay_type` varchar(11) ,
 `last_30d_meal_cost` decimal(12,2) 
)*/;

/*Table structure for table `v_holidays` */

DROP TABLE IF EXISTS `v_holidays`;

/*!50001 DROP VIEW IF EXISTS `v_holidays` */;
/*!50001 DROP TABLE IF EXISTS `v_holidays` */;

/*!50001 CREATE TABLE  `v_holidays`(
 `id` int(11) ,
 `holidayname` varchar(45) ,
 `start_date` date ,
 `end_date` date ,
 `year` int(4) ,
 `createdate` datetime ,
 `lastupdate` timestamp 
)*/;

/*Table structure for table `v_leave_types` */

DROP TABLE IF EXISTS `v_leave_types`;

/*!50001 DROP VIEW IF EXISTS `v_leave_types` */;
/*!50001 DROP TABLE IF EXISTS `v_leave_types` */;

/*!50001 CREATE TABLE  `v_leave_types`(
 `id` int(11) ,
 `name` varchar(45) ,
 `description` varchar(200) ,
 `createdate` datetime ,
 `lastupdate` timestamp 
)*/;

/*Table structure for table `v_payroll_meal_reports` */

DROP TABLE IF EXISTS `v_payroll_meal_reports`;

/*!50001 DROP VIEW IF EXISTS `v_payroll_meal_reports` */;
/*!50001 DROP TABLE IF EXISTS `v_payroll_meal_reports` */;

/*!50001 CREATE TABLE  `v_payroll_meal_reports`(
 `userid` varchar(45) ,
 `full_name` varchar(96) ,
 `department` varchar(200) ,
 `period_start` date ,
 `period_end` date ,
 `total_breakfast` decimal(42,0) ,
 `total_lunch_std` decimal(42,0) ,
 `total_lunch_premium` decimal(42,0) ,
 `total_meals` decimal(42,0) ,
 `total_cost_breakfast` decimal(52,2) ,
 `total_cost_lunch_std` decimal(52,2) ,
 `total_cost_lunch_premium` decimal(52,2) ,
 `total_meal_cost` decimal(54,2) 
)*/;

/*Table structure for table `v_period_meal_costs` */

DROP TABLE IF EXISTS `v_period_meal_costs`;

/*!50001 DROP VIEW IF EXISTS `v_period_meal_costs` */;
/*!50001 DROP TABLE IF EXISTS `v_period_meal_costs` */;

/*!50001 CREATE TABLE  `v_period_meal_costs`(
 `userid` varchar(45) ,
 `period_start` date ,
 `period_end` date ,
 `total_breakfast` decimal(42,0) ,
 `total_lunch_std` decimal(42,0) ,
 `total_lunch_premium` decimal(42,0) ,
 `total_meals` decimal(42,0) ,
 `total_cost_breakfast` decimal(52,2) ,
 `total_cost_lunch_std` decimal(52,2) ,
 `total_cost_lunch_premium` decimal(52,2) ,
 `total_period_cost` decimal(54,2) 
)*/;

/*View structure for view v_attendance_full */

/*!50001 DROP TABLE IF EXISTS `v_attendance_full` */;
/*!50001 DROP VIEW IF EXISTS `v_attendance_full` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_attendance_full` AS select `a`.`userid` AS `userid`,concat(`u`.`Name`,' ',`u`.`lastname`) AS `full_name`,`ug`.`gName` AS `department`,`u`.`designation` AS `designation`,`a`.`date` AS `date`,`a`.`att_in` AS `att_in`,`a`.`att_break` AS `att_break`,`a`.`att_resume` AS `att_resume`,`a`.`att_out` AS `att_out`,`a`.`workhour` AS `workhour`,`a`.`othour` AS `overtime`,`a`.`shorthour` AS `undertime`,`a`.`leavetype` AS `leavetype` from ((`ingress`.`attendance` `a` left join `ingress`.`user` `u` on((`u`.`userid` = `a`.`userid`))) left join `ingress`.`user_group` `ug` on((`ug`.`id` = `u`.`User_Group`))) */;

/*View structure for view v_company_info */

/*!50001 DROP TABLE IF EXISTS `v_company_info` */;
/*!50001 DROP VIEW IF EXISTS `v_company_info` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_company_info` AS select `ingress`.`systemsetting_company`.`id` AS `id`,`ingress`.`systemsetting_company`.`CompanyName` AS `company_name`,`ingress`.`systemsetting_company`.`Email` AS `Email`,`ingress`.`systemsetting_company`.`Address1` AS `Address1`,`ingress`.`systemsetting_company`.`Address2` AS `Address2`,`ingress`.`systemsetting_company`.`City` AS `City`,`ingress`.`systemsetting_company`.`State` AS `State`,`ingress`.`systemsetting_company`.`Zip` AS `Zip`,`ingress`.`systemsetting_company`.`Country` AS `Country`,`ingress`.`systemsetting_company`.`phone` AS `phone`,`ingress`.`systemsetting_company`.`fax` AS `fax`,`ingress`.`systemsetting_company`.`timezone` AS `timezone`,`ingress`.`systemsetting_company`.`report_logo` AS `report_logo` from `ingress`.`systemsetting_company` limit 1 */;

/*View structure for view v_daily_meal_costs */

/*!50001 DROP TABLE IF EXISTS `v_daily_meal_costs` */;
/*!50001 DROP VIEW IF EXISTS `v_daily_meal_costs` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_daily_meal_costs` AS select `dms`.`userid` AS `userid`,`dms`.`meal_date` AS `meal_date`,`dms`.`count_breakfast` AS `count_breakfast`,`dms`.`count_lunch_std` AS `count_lunch_std`,`dms`.`count_lunch_premium` AS `count_lunch_premium`,`dms`.`total_meals` AS `total_meals`,(`dms`.`count_breakfast` * `ps`.`meal_price_breakfast`) AS `cost_breakfast`,(`dms`.`count_lunch_std` * `ps`.`meal_price_lunch_std`) AS `cost_lunch_std`,(`dms`.`count_lunch_premium` * `ps`.`meal_price_lunch_premium`) AS `cost_lunch_premium`,(((`dms`.`count_breakfast` * `ps`.`meal_price_breakfast`) + (`dms`.`count_lunch_std` * `ps`.`meal_price_lunch_std`)) + (`dms`.`count_lunch_premium` * `ps`.`meal_price_lunch_premium`)) AS `total_daily_cost` from (`xpresspay`.`v_daily_meal_summary` `dms` join `xpresspay`.`payroll_settings` `ps`) */;

/*View structure for view v_daily_meal_summary */

/*!50001 DROP TABLE IF EXISTS `v_daily_meal_summary` */;
/*!50001 DROP VIEW IF EXISTS `v_daily_meal_summary` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_daily_meal_summary` AS select `vdt`.`userid` AS `userid`,`vdt`.`transaction_date` AS `meal_date`,count((case when (`vdt`.`workcode` = 1) then 1 end)) AS `count_breakfast`,count((case when (`vdt`.`workcode` = 2) then 1 end)) AS `count_lunch_std`,count((case when (`vdt`.`workcode` = 3) then 1 end)) AS `count_lunch_premium`,count(0) AS `total_meals` from `xpresspay`.`v_device_transactions` `vdt` group by `vdt`.`userid`,`vdt`.`transaction_date` */;

/*View structure for view v_device_transactions */

/*!50001 DROP TABLE IF EXISTS `v_device_transactions` */;
/*!50001 DROP VIEW IF EXISTS `v_device_transactions` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_device_transactions` AS select `dt`.`userid` AS `userid`,cast(`dt`.`checktime` as date) AS `transaction_date`,`dt`.`workcode` AS `workcode` from `ingress`.`device_transaction_log` `dt` where (`dt`.`workcode` > 0) */;

/*View structure for view v_employee_summary */

/*!50001 DROP TABLE IF EXISTS `v_employee_summary` */;
/*!50001 DROP VIEW IF EXISTS `v_employee_summary` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_employee_summary` AS select `u`.`userid` AS `userid`,concat(`u`.`Name`,' ',`u`.`lastname`) AS `full_name`,`ug`.`gName` AS `department`,`u`.`designation` AS `designation`,`u`.`CreateDate` AS `hire_date`,coalesce(`u`.`pay_rate`,0) AS `pay_rate`,coalesce(`u`.`pay_type`,'monthly') AS `pay_type`,`fn_calculate_meal_cost`(`u`.`userid`,(curdate() - interval 30 day),curdate()) AS `last_30d_meal_cost` from (`ingress`.`user` `u` left join `ingress`.`user_group` `ug` on((`u`.`User_Group` = `ug`.`id`))) */;

/*View structure for view v_holidays */

/*!50001 DROP TABLE IF EXISTS `v_holidays` */;
/*!50001 DROP VIEW IF EXISTS `v_holidays` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_holidays` AS select `ingress`.`holiday_date`.`idholiday_date` AS `id`,`ingress`.`holiday_date`.`holidayname` AS `holidayname`,str_to_date(concat(`ingress`.`holiday_date`.`year`,'-',lpad(`ingress`.`holiday_date`.`startmonth`,2,'0'),'-',lpad(`ingress`.`holiday_date`.`startday`,2,'0')),'%Y-%m-%d') AS `start_date`,str_to_date(concat(`ingress`.`holiday_date`.`year`,'-',lpad(`ingress`.`holiday_date`.`endmonth`,2,'0'),'-',lpad(`ingress`.`holiday_date`.`endday`,2,'0')),'%Y-%m-%d') AS `end_date`,`ingress`.`holiday_date`.`year` AS `year`,`ingress`.`holiday_date`.`createdate` AS `createdate`,`ingress`.`holiday_date`.`lastupdate` AS `lastupdate` from `ingress`.`holiday_date` */;

/*View structure for view v_leave_types */

/*!50001 DROP TABLE IF EXISTS `v_leave_types` */;
/*!50001 DROP VIEW IF EXISTS `v_leave_types` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_leave_types` AS select `ingress`.`leavetype`.`idleavetype` AS `id`,`ingress`.`leavetype`.`leavetypename` AS `name`,`ingress`.`leavetype`.`leavetypedesc` AS `description`,`ingress`.`leavetype`.`createdate` AS `createdate`,`ingress`.`leavetype`.`lastupdate` AS `lastupdate` from `ingress`.`leavetype` */;

/*View structure for view v_payroll_meal_reports */

/*!50001 DROP TABLE IF EXISTS `v_payroll_meal_reports` */;
/*!50001 DROP VIEW IF EXISTS `v_payroll_meal_reports` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_payroll_meal_reports` AS select `pmc`.`userid` AS `userid`,concat(`u`.`Name`,' ',`u`.`lastname`) AS `full_name`,`ug`.`gName` AS `department`,`pmc`.`period_start` AS `period_start`,`pmc`.`period_end` AS `period_end`,`pmc`.`total_breakfast` AS `total_breakfast`,`pmc`.`total_lunch_std` AS `total_lunch_std`,`pmc`.`total_lunch_premium` AS `total_lunch_premium`,`pmc`.`total_meals` AS `total_meals`,`pmc`.`total_cost_breakfast` AS `total_cost_breakfast`,`pmc`.`total_cost_lunch_std` AS `total_cost_lunch_std`,`pmc`.`total_cost_lunch_premium` AS `total_cost_lunch_premium`,`pmc`.`total_period_cost` AS `total_meal_cost` from ((`xpresspay`.`v_period_meal_costs` `pmc` join `ingress`.`user` `u` on((`u`.`userid` = `pmc`.`userid`))) left join `ingress`.`user_group` `ug` on((`ug`.`id` = `u`.`User_Group`))) */;

/*View structure for view v_period_meal_costs */

/*!50001 DROP TABLE IF EXISTS `v_period_meal_costs` */;
/*!50001 DROP VIEW IF EXISTS `v_period_meal_costs` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_period_meal_costs` AS select `dmc`.`userid` AS `userid`,min(`dmc`.`meal_date`) AS `period_start`,max(`dmc`.`meal_date`) AS `period_end`,sum(`dmc`.`count_breakfast`) AS `total_breakfast`,sum(`dmc`.`count_lunch_std`) AS `total_lunch_std`,sum(`dmc`.`count_lunch_premium`) AS `total_lunch_premium`,sum(`dmc`.`total_meals`) AS `total_meals`,sum(`dmc`.`cost_breakfast`) AS `total_cost_breakfast`,sum(`dmc`.`cost_lunch_std`) AS `total_cost_lunch_std`,sum(`dmc`.`cost_lunch_premium`) AS `total_cost_lunch_premium`,sum(`dmc`.`total_daily_cost`) AS `total_period_cost` from `xpresspay`.`v_daily_meal_costs` `dmc` group by `dmc`.`userid` */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
