$(function () {
  //  1-4-4 用获取id实现 点击两个链接跳转到不同页面
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

   $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  
  // 1-10 自定义表单密码框校验规则 原来的只是必填项不能空
  // 1-10-1 现在加入控制在6-12位

  // 从layui中获取form对象 语法类似jq 只有导入js文件 可全局使用layui
  const form=layui.form

// 1-11-2 本来注册成功或失败是在打印框打印的 若需要用户看到 
// 就用到了layui的内置模块的弹出层 内置方法的msg选项
// 同样需要申明layer对象
 const layer=layui.layer
  

  // 这段复制
  form.verify({
  // 校验规则名字是pwd
  pwd: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'
  ] ,
// 1-10-2 此时发现需要添加一个两次密码需输入一致的规则
repwd:function(value){
  // 通过形参拿到的是确认密码框的内容 再拿到密码框的内容
  // 进行一次等于判断  若判断错误就把return 提示消息
// []是属性选择器
  var pwd=$('.reg-box [name=password]').val()
      if(pwd!==value){
        return '两次密码输入不一致'
      }
}
  });   

  // 1-11 监听注册表单的提交事件
  // 阻止默认提交行为 发起ajax请求 
// 1-11-1
  $('#form-reg').on('submit',function(e){
    e.preventDefault()
    $.ajax({
      type:'post',
      url:'/api/reguser',
        // 这里也可以把data宅出去 var data={} ,这里只要写data,
      data:{
        username:$('#form-reg [name=username]').val(),
        password:$('#form-reg [name=password]').val()
      },
      success:function(res){
    
             if(res.status!==0){
              //  1-11-2
                return layer.msg(res.message);
             }
            //  1-11-2
            layer.msg('注册成功,请登录'); //这里不能写return 不然下面代码无法执行了
            
          // 1-11-3 模拟人的点击行为 可以在注册成功后自动跳到登录界面
            $('#link_login').click()
      }
    })
  })

   // 1-12 监听登录表单的提交事件
  // 阻止默认提交行为 发起ajax请求 
// 1-12 -1
  $('#form-login').submit(function (e) {
    e.preventDefault()

  $.post('/api/login',
    
    // {
    $(this).serialize(), //这样可以快速获取表单中的数据
  // username: $('#form-login [name=username]').val(), 
//     password: $('#form-login [name=password]').val()
  // }
  function (res) {
  //  console.log(res);
    if (res.status !== 0) {
      return layer.msg('登录失败')
    }
    layer.msg('登录成功')
    console.log(res.token);
    // 1-12-3 将登录成功后的token字符串保存到localStorage中
    // 此时浏览器应用下就存了token 后面有权限的接口都得有token才能成功
    // token怎么用？ 在postman中 header：Authorization：token值
    localStorage.setItem('token',res.token)
    // 1-12-2 跳转到后台主页
    // location.href='/index.html'
 })
})
  


 })
