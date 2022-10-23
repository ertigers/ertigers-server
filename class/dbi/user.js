
const DBI = require('../utility/mysql.interface');
class User extends DBI {
  // constructor(...args){
  //   super(...args);//调用此方法,this才用可以用,代表父类的构造函数，返回的却是子类
  // }

  constructor(knexPool, ...args) {
    super(...args); //调用此方法,this才用可以用,代表父类的构造函数，返回的却是子类      
    if (knexPool) {
      this.knexPool = knexPool;
    } else {
      this.knexPool = $knexPool;
    }
  }

  async fetch({
    limit = 0,
    offset = 0,
    searchs = [],
    sorts = [],
    columns = ['*']
  }) {
    var result = {
      code: $ErrorCode.FAILED,
      rows: []
    }
    try {
      let rv = await $utils.formatSQL(searchs, []);
      let whereraw = rv[0];
      if (limit == 0) { //未使用分页
        await this.knexPool.select(columns).from('user as u').whereRaw(whereraw).orderBy(sorts).then(res => {
          result.rows = res;
          result.total = res.length;
          result.code = $ErrorCode.SUCCESS;
        }).catch(err => {
          $logger.error(err);
        });
      } else { // 使用分页
        await this.knexPool.select(columns).from('user as u').whereRaw(whereraw).limit(limit).offset(offset).orderBy(sorts).then(res => {
          result.rows = res;
          result.code = $ErrorCode.SUCCESS;
        }).catch(err => {
          $logger.error(err);
        });

        await this.knexPool.from('user as u').whereRaw(whereraw).count('u.index as total').then(res => {
          result.total = res[0].total;
          result.code = $ErrorCode.SUCCESS;
        }).catch(err => {
          $logger.error(err);
        });
      }


    } catch (e) {
      $logger.error(e);
    } finally {
      return result;
    }
  }
}

module.exports = new User();