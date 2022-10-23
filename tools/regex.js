/**
 * Created by ertigers on 2022/10/18.
 */

 const Regexs = {
  alphabetNumber_: /[a-zA-Z0-9_]/,
  alphabetNumber_1: /^[a-zA-Z0-9_]+$/,
  fullWidthAlphabetNumber_: /[\u4e00-\u9fa5_a-zA-Z0-9]/,
  fullWidthAlphabet: /^[\u4e00-\u9fa5a-zA-Z]+$/,
  fullWidthAlphabetNumber: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
  idcardReg: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  fullWidthAlphabetNumber_1: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
  numberComma: /[-0-9\,]/,
  extAlphabetNumber_: /[\@\._a-zA-Z0-9]/,
  indexs_: /^[\d,]+$/,
  domain:/^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
  //date:/\d{4}-\d{1,2}-\d{1,2}/,
  //date: /([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/,
  month: /^[1-9]\d{3}-(0[1-9]|1[0-2])$/,
  date: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
  datetime: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/,
  FAILED: -1,
  fields: /^[_a-zA-Z0-9]+(,[_a-zA-Z0-9]+)*$/,
  orders: /^(asc|desc)+(,(asc|desc)+)*$/i,
}



module.exports = Regexs;