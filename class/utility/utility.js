/**
 * Created by lingsen on 2019/6/24.
 */

 var mysql = require('mysql');
 const crypto = require('crypto');
 class Utility {
     constructor() {}
     static response(ctx, responseBody) {
         ctx.status = 200;
         ctx.response.body = responseBody;
     }
 
     static formatSelectSql(searchs, sorts) {
         let wheres = [];
         let paramsvalue = [];
         let sortsql = "";
 
         for (let search of searchs) {
             let table = "";
             if (search.table) {
                 table = search.table + ".";
             }
             if (search.field) {
                 if (search.type && search.type == "like") {
                     wheres.push(table + search.field + " like ?");
                 } else if (search.type && search.type == "and") {
                     wheres.push(table + search.field + " between ? and ?");
                 } else if (search.type && search.type == "greater") {
                     wheres.push(table + search.field + " >= ?");
                 } else if (search.type && search.type == "less") {
                     wheres.push(table + search.field + " <= ?");
                 } else if (search.type && search.type == "in") {
                     wheres.push(table + search.field + " in(?)");
                 } else if (search.type && search.type == "unequal") {
                     wheres.push(table + search.field + " <>?");
                 } else if (search.type && search.type == "sql") {
                     wheres.push(search.value);
                 } else {
                     wheres.push(table + search.field + " =?");
                 }
                 if (search.minValue && search.maxValue) {
                     paramsvalue.push(search.minValue);
                     paramsvalue.push(search.maxValue);
                 } else if (search.type != "sql") {
                     paramsvalue.push(search.value);
                 }
             }
         }
 
         let split = "";
         for (let sort of sorts) {
             let table = "";
             if (sort.table) {
                 table = sort.table + ".";
             }
 
             if (sort.field) {
                 sortsql += split + "" + table + sort.field + "";
                 if (sort.type) {
                     sortsql += " " + sort.type + " ";
                 }
                 split = ",";
             }
         }
 
 
         return [wheres, paramsvalue, sortsql];
     }
 
     // ?????????MySQL??????
     static formatSQL(searchs, sorts, alias, backquote = false) {
         let searchSQL = this.formatWhereSQL(searchs, alias, backquote);
         let sortSQL = this.formatOrderSQL(sorts, alias, backquote);
 
         if (searchSQL) searchSQL = `${searchSQL}`;
         if (sortSQL) sortSQL = `${sortSQL}`;
 
         return [searchSQL, sortSQL];
     }
 
     // ?????????MySQL????????????
     static formatWhereSQL(searchs, alias, backquote = true) {
         let whereSQL = '';
         let split = '';
 
         for (let field in searchs) {
             let search = searchs[field];
             if (field.toLowerCase() === '$or') {
                 let orSQL = this.formatOrSQL(search, alias, backquote);
                 whereSQL += `${split}${orSQL}`;
             } else {
                 if (backquote) field = `\`${field}\``;
                 let table = alias ? `${alias}.` : '';
                 if (typeof search === 'object') {
                     if (search.table) table = `${search.table}.`;
                     for (let option in search) {
                         if (option === 'table') continue;
                         let value = search[option];
                         whereSQL += this.formatOptionSQL(option, split, table, field, value);
                         split = ' AND ';
                     }
                 } else {
                     whereSQL += `${split}${table}${field}=${mysql.escape(search)}`;
                 }
             }
             split = ' AND ';
         }
 
         return whereSQL;
     }
 
     // ?????????MySQL????????????
     static formatOrderSQL(sorts, alias, backquote = true) {
         let orderSQL = '';
         let split = '';
 
         for (let field in sorts) {
             let sort = sorts[field];
             if (backquote) field = `\`${field}\``;
             let table = alias ? `${alias}.` : '';
             if (typeof sort === 'object') {
                 if (sort.table) table = `${sort.table}.`;
                 if (sort.type) {
                     orderSQL += `${split}${table}${field} ${sort.type.toUpperCase()}`;
                 } else {
                     orderSQL += `${split}${table}${field}`;
                 }
             } else {
                 orderSQL += `${split}${table}${field} ${sort.toUpperCase()}`;
             }
             split = ',';
         }
 
         return orderSQL;
     }
 
     // ?????????MySQL???OR????????????
     static formatOrSQL(searchs, alias, backquote = true) {
         let orSQL = '';
         let split = '';
 
         if (Array.isArray(searchs)) {
             for (let search of searchs) {
                 let whereSQL = this.formatWhereSQL(search, alias, backquote);
                 orSQL += `${split} (${whereSQL})`;
                 split = ' OR '
             }
         } else {
             console.log('?????????MySQL???OR??????????????????', searchs);
         }
 
         if (orSQL) orSQL = `(${orSQL})`;
 
         return orSQL;
     }
 
     // ?????????MySQL??????????????????
     static formatOptionSQL(option, split, table, field, value) {
         let optionSQL = '';
 
         switch (option.toLowerCase()) {
             case '$e': // equal
                 optionSQL += `${split}${table}${field}=${mysql.escape(value)}`;
                 break;
             case '$ne': // not equal
                 optionSQL += `${split}${table}${field}<>${mysql.escape(value)}`;
                 break;
             case '$like': // like
                 optionSQL += `${split}${table}${field} LIKE ${mysql.escape(`%${value}%`)}`;
                 break;
             case '$clike': // like
                 optionSQL += `${split}${table}${field} LIKE ${mysql.escape(`${value}`)}`;
                 break;
             case '$nlike': // not like
                 optionSQL += `${split}${table}${field} NOT LIKE ${mysql.escape(`%${value}%`)}`;
                 break;
             case '$in': // in
                 if (Array.isArray(value)) value = value.join(',');
                 optionSQL += `${split}${table}${field} IN(${value})`;
                 break;
             case '$nin': // not in
                 if (Array.isArray(value)) value = value.join(',');
                 optionSQL += `${split}${table}${field} NOT IN(${value})`;
                 break;
             case '$gt': // greater than
                 optionSQL += `${split}${table}${field}>${mysql.escape(value)}`;
                 break;
             case '$gte': // greater than or equal
                 optionSQL += `${split}${table}${field}>=${mysql.escape(value)}`;
                 break;
             case '$lt': // less than
                 optionSQL += `${split}${table}${field}<${mysql.escape(value)}`;
                 break;
             case '$lte': // less than or equal
                 optionSQL += `${split}${table}${field}<=${mysql.escape(value)}`;
                 break;
             case '$btw': // between
                 optionSQL += `${split}${table}${field} BETWEEN ${mysql.escape(`${value[0]}`)} AND ${mysql.escape(`${value[1]}`)}`;
                 break;
             case '$nbtw': // between
                 optionSQL += `${split}${table}${field} NOT BETWEEN ${mysql.escape(`${value[0]}`)} AND ${mysql.escape(`${value[1]}`)}`;
                 break;
             case '$null': // is null
                 optionSQL += `${split}${table}${field} IS NULL`;
                 break;
             case '$nnull': // is not null
                 optionSQL += `${split}${table}${field} IS NOT NULL`;
                 break;
             case '$find': // find_in_set
                 optionSQL += `${split} FIND_IN_SET(${mysql.escape(value)},${table}${field})`;
                 break;
             case '$reversedfind': // find_in_set
                 optionSQL += `${split} FIND_IN_SET(${table}${field},${mysql.escape(value)})`;
                 break;
             case '$sql': // ??????SQL??????
                 optionSQL += `${split}${value}`;
                 break;
             default:
                 optionSQL += `${split}${table}${field}=${mysql.escape(value)}`;
         }
 
         return optionSQL;
     }
 
     static _mkdirSync(uri, mode, cb) {
         var arr = uri.split($path.sep);
         mode = mode || 755;
         cb = cb || function () {};
         if (arr[0] === ".") { //?????? ./aaa
             arr.shift();
         }
         if (arr[0] == "..") { //?????? ../ddd/d
             arr.splice(0, 2, arr[0] + "/" + arr[1])
         }
 
         function inner(cur) {
             if (!$fs.existsSync(cur)) { //????????????????????????
                 $fs.mkdirSync(cur, mode)
             }
             if (arr.length) {
                 inner(cur + $path.sep + arr.shift());
             } else {
                 cb();
             }
         }
         arr.length && inner(arr.shift());
     }
 
     static _rmdirSync(dir, cb) {
 
         cb = cb || function () {};
         var dirs = [];
 
         try {
             iterator(dir, dirs);
             for (var i = 0, el; el = dirs[i++];) {
                 // console.log(el)
                 $fs.rmdirSync(el); //???????????????????????????????????????
             }
             cb()
         } catch (e) { //??????????????????????????????????????????fs.statSync??????????????????????????????????????????????????????
             e.code === "ENOENT" ? cb() : cb(e);
         }
 
         function iterator(url, dirs) {
             var stat = $fs.statSync(url);
 
             if (stat.isDirectory()) {
                 dirs.unshift(url); //????????????
                 inner(url, dirs);
             } else if (stat.isFile()) {
                 $fs.unlinkSync(url); //??????????????????
             }
         }
 
         function inner(path, dirs) {
             var arr = $fs.readdirSync(path);
             for (var i = 0, el; el = arr[i++];) {
                 iterator(path + $path.sep + el, dirs);
             }
         }
     }
 
     static substr(str, len) {
         if (!str || !len) {
             return '';
         }
         //?????????????????????2???????????????1??????
         var a = 0;
         //????????????
         var i = 0;
         //????????????
         var temp = '';
         for (i = 0; i < str.length; i++) {
             if (str.charCodeAt(i) > 255) {
                 //????????????????????????2
                 a += 2;
             } else {
                 a++;
             }
             //??????????????????????????????????????????????????????????????????????????????
             if (a > len) {
                 return temp + "...";
             }
             //????????????????????????????????????
             temp += str.charAt(i);
         }
         //????????????????????????????????????????????????????????????
         return str;
     }
 
     static hashTemplate(templateData) {
         var s = "";
         var i = 0;
         while (i < templateData.length) {
             s += templateData[i++];
             if (i < arguments.length) {
                 s += arguments[i];
             }
         }
         return s;
     }
 
     // ???????????????
     static randText(options) {
         options = options || {};
 
         const size = options.size || 4;
         const ignoreChars = options.ignoreChars || '';
         let i = -1;
         let out = '';
         let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
 
         if (ignoreChars) {
             chars = string.split('').filter(char => ignoreChars.indexOf(char) === -1);
             // chars = stripCharsFromString(chars, ignoreChars);
         }
 
         const len = chars.length - 1;
 
         while (++i < size) {
             let idx = Math.round(0 + (Math.random() * (len - 0)));
             out += chars[idx];
         }
 
         return out;
     };
 
     // ?????????
     static randNum(min, max) {
         let num = Math.round(min + (Math.random() * (max - min)));
         return num;
     };
 
     // ?????????????????????
     static misPrivate(str) {
         return $md5(str.toUpperCase() + "B922AE48CAEEC97299BA8547E3F34263").toUpperCase();
     }
 
     /**
      * ?????????????????????(??????????????????????????????)
      * @param {Number} len 
      * @returns {String}
      */
     static getRandomNickname(len) {
         let val = "";
         for (let i = 0; i < len; i++) {
             // ????????????????????????
             let charOrNum = Math.round(Math.random()) ? "char" : "num";
             // ?????????
             if ("char" == charOrNum) {
                 // ????????????????????????????????????
                 let choice = Math.round(Math.random()) ? 65 : 97;
                 val += String.fromCharCode(choice + Math.floor(Math.random() * 26));
             } else if ("num" == charOrNum) { // ??????
                 val += Math.floor(Math.random() * 10);
             }
         }
         return val;
     }
 
     // ??????????????????????????????
     static randNumCode(num = 4) {
         let res = "";
         for (let i = 0; i < num; i++) {
             res += Math.floor(Math.random() * 10);
         }
         return res;
     };
 
         
     /**
      * AESbase64??????
      */
     static aesBase64Encryption(aesConf,data){
         let chipherChunks = [];
         let cipher = crypto.createCipheriv(aesConf.mode,aesConf.key,aesConf.iv);
         cipher.setAutoPadding(true);
         chipherChunks.push(cipher.update(data,'utf8','base64'));
         chipherChunks.push(cipher.final('base64'));
         return chipherChunks.join('');
     }
 
         
     /**
      * AESbase64??????
      */
     static aesBase64Decryption(aesConf,data){
         let chipherChunks = [];
         let cipher = crypto.createDecipheriv(aesConf.mode,aesConf.key,aesConf.iv);
         cipher.setAutoPadding(true);
         chipherChunks.push(cipher.update(data,'base64','utf8'));
         chipherChunks.push(cipher.final('utf8'));
         return chipherChunks.join('');
     }
 
 }
 
 module.exports = Utility;