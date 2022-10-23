const $ErrorCode = require('../tools/error');
const User = require('../class/db/user');
const userController = {}

// 用户登录
userController.login = async function (req, res) {
  try {
    let body = req.body;
    let loginid = body.loginid || "";
    let password = body.password || "";
    let result = { code: $ErrorCode.U_NOEXISTS };

    if ($validator.isEmpty(loginid)) {
      result.msg = 'empty login id ';
      return;
    }

    if (!$validator.isMD5(password.toLowerCase()) && !$validator.isMD5(password.substr(16, 32).toLowerCase())) {
      result.msg = 'empty password ';
      return;
    }

    result = await Auth.auth(params);
    if (result.code === $ErrorCode.SUCCESS) {

    }

  } catch (ex) {
    $logger.error(ex);
  } finally {
    res.json(result);
  }
}
// getUser 获取用户数据
userController.getUser = async function (req, res) {
  try {
    let body = req.body;
    let result = { code: $ErrorCode.U_NOEXISTS };
    let user = new User()
    result = await user.getUser()
    res.json(result)
  } catch (e) {
    res.json({ code: 0, message: "操作失败", data: e })
  }
}

module.exports = userController;