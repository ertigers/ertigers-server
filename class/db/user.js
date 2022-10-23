
class AuthClass {
  /**
   * 鉴权
   * @param  {object} params 请求参数对象
   */
  static async auth(params) {
    let result = {
      code: $ErrorCode.FAILED,
      msg: ''
    }
    try {
 
      let knexPool = $dbClient.fetchMysqlPool(params.epid);
      if (!knexPool) {
        result.code = $ErrorCode.OBJECT_NOEXISTS;
        result.msg = " db connect no exists";
        return;
      }
      let searchs = {};
      searchs.logicdel = {
        $e: 0,
        table: 'e'
      };
 
      let dbi = new hrEmployeeDBI(knexPool);

      let rv = await dbi.fetch({
        searchs,
        columns: ['e.index', 'e.name', 'e.jobnumber', 'e.mode', 'e.attendanceid', 'e.mobile', 'e.email', 'e.password', 'e.department_index', 'e.department_title_index', 'e.department_position', 'e.entrytime', 'e.positivetime', 'e.departuretime', 'e.jobcategory', 'e.gender', 'e.birthday', 'e.remark', 'dt.name as department_title', 'd.name as department_name']
      });

      if (rv.code != $ErrorCode.SUCCESS) {
        result.code = rv.code;
        return;
      }

      result = {
        code: $ErrorCode.SUCCESS,
        employee: employee
      };

    } catch (ex) {
      $logger.error(ex);
    } finally {
      return result;
    }
  }
  
  static async getUser(params) {
    let result = { code: $ErrorCode.FAILED, }
    try {
 
      let searchs = {};
      searchs.logicdel = {
        $e: 0,
        table: 'e'
      };
 
      let dbi = new hrEmployeeDBI(knexPool);

      let rv = await dbi.fetch({
        searchs,
        columns: ['e.index', 'e.name', 'e.jobnumber', 'e.mode', 'e.attendanceid', 'e.mobile', 'e.email', 'e.password', 'e.department_index', 'e.department_title_index', 'e.department_position', 'e.entrytime', 'e.positivetime', 'e.departuretime', 'e.jobcategory', 'e.gender', 'e.birthday', 'e.remark', 'dt.name as department_title', 'd.name as department_name']
      });

      result = {
        code: $ErrorCode.SUCCESS,
        employee: employee
      };

    } catch (ex) {
      $logger.error(ex);
    } finally {
      return result;
    }
  }
}

module.exports = new User();