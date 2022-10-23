class MysqlDBInterfaceClass{

  /**
   * fetch 
   * @param {string} table
   * @param {string} searchs 
   * @param {string} sorts 
   * @param {object} columns
   * @return {code,rows} result
   */
  async fetch (knexPool,from,searchs, sorts,columns){
      var result = {
          code: $ErrorCode.FAILED,
          rows: []
      }
      try {
          // let rv = await $utils.formatSelectSql(searchs,sorts);
          let rv = await $utils.formatSQL(searchs,[]);
          $logger.debug(rv);
          let whereraw = rv[0];
          // let sortraw = rv[1];
          // let sortraw = rv[2];
          
          if(!columns || columns.length <= 0){
              columns = ['*'];
          }

          // await knexPool.select(columns).from(from).whereRaw(whereraw.join(' and '),paramsvalue).then(res =>{
          await knexPool.select(columns).from(from).whereRaw(whereraw).orderBy(sorts).then(res =>{
              //$logger.debug(res);
              result.rows = res;
              result.code = $ErrorCode.SUCCESS;
          }).catch(err => {
              $logger.error(err);
          });
      } catch (e) {
          $logger.error(e);
      } finally {
          return result;
      }
  }

  /**
   * fetch 
   * @param {string} table
   * @param {int} offset 
   * @param {int} limit 
   * @param {string} searchs 
   * @param {string} sorts 
   * @param {object} columns
   * @return {code,rows} result
   */
  async fetchByPage (knexPool,from,offset,limit,searchs, sorts,columns){
      var result = {
          code: $ErrorCode.FAILED,
          rows: []
      }
      try {
          offset = offset || 0;
          limit = limit || 0;
          // let rv = await $utils.formatSelectSql(searchs,sorts);
          // $logger.debug(rv);
          // let whereraw = rv[0];
          // let paramsvalue = rv[1];
          let whereraw= "";
          // let paramsvalue= "";
          let rv = await $utils.formatSQL(searchs, []);
          $logger.info(rv);
          if (rv.length) {
              whereraw = rv[0];
              // paramsvalue = rv[1];
          }

          let sortraw = rv[2];
          
          if(!columns || columns.length <= 0){
              columns = ['*'];
          }
          
          await knexPool.select(columns).from(from).whereRaw(whereraw).limit(limit).offset(offset).then(res =>{
              // $logger.debug(res);
              result.rows = res;
              result.code = $ErrorCode.SUCCESS;
          }).catch(err => {
              $logger.error(err);
          });
          
          await knexPool.from(from).whereRaw(whereraw).count('index as total').then(res =>{
              // $logger.debug(res);
              result.total = res[0].total;
              result.code = $ErrorCode.SUCCESS;
          }).catch(err => {
              $logger.error(err);
          });

      } catch (e) {
          $logger.error(e);
      } finally {
          return result;
      }
  }

  /**
   * 增加记录
   * @param {string} table
   * @param {object} columns
   */
  async add(knexPool,table,columns){
      var result = {
          code: $ErrorCode.ADD_FAILED,
          index:-1
      }
      try{
          columns.modifytime = columns.modifytime || knexPool.fn.now();

          await knexPool(table).returning("index").insert(columns).then(res=>{
              
              if(res && res.length > 0) result.index = res[0];
              result.code = $ErrorCode.SUCCESS;
          }).catch(err=>{
              $logger.error(err);
          });
      }catch(e){
          $logger.error(e);

      }finally{
          return result;
      }

  }

  /**
   * 批量添加
   * @param {*} knexPool 
   * @param {*} table 
   * @param {*} datalist 
   * @returns 
   */
  async adds(knexPool,table,datalist){
      var result = {
          code: $ErrorCode.ADD_FAILED,
          indexs:null
      }
      try{
          if(!datalist.length) return ;
          // columns.modifytime = columns.modifytime || knexPool.fn.now();

          await knexPool(table).returning("index").insert(datalist).then(res=>{
              if(res && res.length > 0) result.indexs = res;
              result.code = $ErrorCode.SUCCESS;
          }).catch(err=>{
              $logger.error(err);
          });
      }catch(e){
          $logger.error(e);

      }finally{
          return result;
      }

  }

  /**
   * 根据索引更新记录
   * @param {string} table
   * @param {object} columns
   */
  async set(knexPool,table,columns){
      var result = {
          code: $ErrorCode.SET_FAILED
      }
      try{
        if(!columns.index){
          result.code = $ErrorCode.PARAMS_FAILED;
          return;
          }
          
          columns.modifytime = knexPool.fn.now();
          let whereraw = {index:columns.index};
          delete columns.index;
          
          // await knexPool(table).returning("index").whereIn("index",indexs).update(columns)
          await knexPool(table).returning("index").where(whereraw).update(columns).then(res=>{
              $logger.debug(res);
              if(res && res.length > 0) result.index = res[0];
              result.code = $ErrorCode.SUCCESS;
          }).catch(err=>{
              $logger.error(err);
          });

      }catch(e){
          $logger.error(e);

      }finally{
          return result;
      }
  }

  /**
   * 根据索引批量更新记录
   * @param {string} table
   * @param {object} columns
   */
  async sets (knexPool,table,columns){
      var result = {
          code: $ErrorCode.SET_FAILED
      }
      try{
        if(!columns.indexs){
          result.code = $ErrorCode.PARAMS_FAILED;
          return;
          }
          
          columns.modifytime = knexPool.fn.now();
          let indexs = columns.indexs;
          delete columns.indexs;
          
          await knexPool(table).returning("index").whereIn("index",indexs).update(columns).then(res=>{
              $logger.debug(res);
              if(res && res.length > 0) result.indexs = res;
              result.code = $ErrorCode.SUCCESS;
          }).catch(err=>{
              $logger.error(err);
          });

      }catch(e){
          $logger.error(e);

      }finally{
          return result;
      }
  }

  async setsByWhere(knexPool,table,searchs,columns){
      var result = {
          code: $ErrorCode.FAILED,
          rows: []
      }
      try {
          let rv = await $utils.formatSQL(searchs,[]);
          $logger.debug(rv);
          let whereraw = rv[0];

          await knexPool(table).returning("index").whereRaw(whereraw).update(columns).then(res =>{
              $logger.debug(res);
              if(res && res.length > 0) result.rows = res;
              result.code = $ErrorCode.SUCCESS;
          }).catch(err=>{
              $logger.error(err);
          });

      } catch (e) {
          $logger.error(e);
      } finally {
          return result;
      }
  }

  
  /**
   * 更新记录,有唯一键,如果已经存在就更新
   * @param {object} mysqlPool
   * @param {string} table
   * @param {object} columns
   */
  async duplicate (knexPool,table,columns,updateColumns){
      let result = {
          code: $ErrorCode.SET_FAILED
      };
      try {
          let keys = [];
          let values = [];
          let valueparams = [];
          let upatevalues = [];
          for (var k in columns) {
              let v = columns[k];
              keys.push('`' + k + '`');
              valueparams.push(v);
          }

          keys.push('`modifytime`');
          valueparams.push(knexPool.fn.now());

          for (var k in updateColumns) {
              let v = updateColumns[k];
              if (v === null) {
                  upatevalues.push('`' + k + '`=' + v);
              } else {
                  upatevalues.push('`' + k + '`=\'' + v + '\'');
              }
          }

          if (keys.length > 0 && upatevalues.length>0) {
              let sql = 'insert into '+table+'(' + keys.join(',') + ') values(' + valueparams.map(_ => '?').join(',') + ') ON DUPLICATE KEY UPDATE ' + upatevalues.join(',') ;
              // $logger.info(sql,valueparams);
              await knexPool.raw(sql,valueparams).then(res =>{
                  // result.index = res[0].insertId;
                  result.code = $ErrorCode.SUCCESS;
              }).catch(err => {
                  $logger.error(err);
              });
              // await knexPool.raw(sql,valueparams).returning('index').then(res =>{
              //     result.index = res[0].insertId;
              //     result.code = $ErrorCode.SUCCESS;
              // }).catch(err => {
              //     $logger.error(err);
              // });
          }
      } catch (e) {
          result.code = $ErrorCode.SET_FAILED;
          $logger.error(e);
      } finally {
          return result;
      }
  }


  /**
   * 通过索引批量删除记录
   * @param {string} table
   * @param {object} columns
   */
  async remove(knexPool,table,indexs){
    $logger.debug(indexs);
      let result = {
          code: $ErrorCode.DEL_FAILED
      }
      try {
          await knexPool(table).whereIn("index",indexs).del().then(res=>{
              $logger.debug(res);
              result.code = $ErrorCode.SUCCESS;
          }).catch(err=>{
              $logger.error(err);
          });
          // result.code = $ErrorCode.SUCCESS;
      } catch (e) {
          $logger.error(e);
      } finally {
          return result;
      }
  }

  /**
   * 条件删除
   * @param knexPool
   * @param table
   * @param searchs
   * @param limit
   * @returns {Promise<{code: number, rows: []}>}
   */
  async removeByWhere(knexPool,table,searchs,limit){

      var result = {
          code: $ErrorCode.FAILED,
          rows: []
      }
      try {
          let rv = await $utils.formatSQL(searchs,[]);
          $logger.debug(rv);
          let whereraw = rv[0];

          if(limit){
              // var subquery = knexPool.select('index').from(table).whereRaw(whereraw).limit(limit).as('t1');

              await knexPool(table).whereIn('index',function(){

                  this.select('index').from(function(){
                      this.select('index').from(table).whereRaw(whereraw).limit(limit).as('t1');
                  });
              }).del().then(res =>{
                  $logger.debug(res);
                  result.code = $ErrorCode.SUCCESS;
              }).catch(err=>{
                  $logger.error(err);
              });

          }else{
              await knexPool(table).whereRaw(whereraw).del().then(res =>{
                  $logger.debug(res);
                  result.code = $ErrorCode.SUCCESS;
              }).catch(err=>{
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

module.exports = MysqlDBInterfaceClass;