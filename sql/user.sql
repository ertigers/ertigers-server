/*
用户部分：
  用户信息表
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(13) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `username` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '用户名(唯一标识)',
  `realname` varchar(100) NOT NULL DEFAULT '' COMMENT '真实姓名',
  `nickname` varchar(100) NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '头像',
  `gender` tinyint(1) NOT NULL DEFAULT '0' COMMENT '性别：0未知，1男，2女',
  `mobile` varchar(25) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '手机号',
  `email` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '邮箱',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT '密码',
  `invitecode` varchar(30) NOT NULL DEFAULT '' COMMENT '邀请码',
  `referrer` bigint(13) unsigned COMMENT '推荐人ID',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1正常，0禁用',
  `role` tinyint(1) NOT NULL DEFAULT '1' COMMENT '角色:1学生，2学长，3代理',
  `create_time` bigint(13) NOT NULL COMMENT '创建时间',
  `update_time` bigint(13) NOT NULL COMMENT '更新时间',
  `_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态：0未删除，1已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`) USING BTREE,
  UNIQUE KEY `mobile` (`mobile`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';
