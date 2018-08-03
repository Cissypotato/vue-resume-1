var app = new Vue({
    el: '#app',
    data: {
        editingName:false,
        loginVisible:false,
        registerVisible:false,
        currentUser:{email:undefined,objectId:undefined},
        resume:{
            name:"姓名",
            jobIntention:"求职意向",
            birthday:"1995",
            gender:"性别",
            email:"邮箱",
            phone:"手机"
        },
        login:{
            email:'',
            password:''
        },
        register:{
            email:'',
            password:''
        }
    },
    methods:{
        y(key,value){
            this.resume[key]=value
        },
        hasLogin(){
            return !!this.currentUser.objectId
            
        },
        onLogin(e){
            AV.User.logIn(this.login.email, this.login.password).then( (user)=> {
                user=user.toJSON()
                console.log(user)
                this.currentUser.objectId=user.objectId
                this.currentUser.email=user.email
                this.loginVisible=false
              }, function (error) {
                  if(error.code===211){
                      alert("该邮箱没有被注册")
                  }else if (error.code===210){
                      alert('密码与邮箱不匹配')
                  }
              })
        },
        onRegister(e){
            var user = new AV.User();
            // 设置用户名
            user.setUsername(this.register.email);
            // 设置密码
            user.setPassword(this.register.password);
            // 设置邮箱
            user.setEmail(this.register.email);
            user.signUp().then( (loggedInUser)=> {
                user=user.toJSON()
                console.log(user)
                this.currentUser.objectId=user.objectId
                this.currentUser.email=user.email

                this.registerVisible=false
                alert('注册成功，并且已登录')
            }, function (error) {
                alert(error.rawMessage)
            })
        },
        handleSave(){
            var currentUser = AV.User.current();
            if (currentUser) {
                this.saveResume()
            }else {
               this.showLogin()
            }
        },
        showLogin(){
            this.loginVisible=true;
        },
        saveResume(){
           
            let objectId=AV.User.current().toJSON().objectId;
            var user = AV.Object.createWithoutData('User', objectId);
            // 修改属性
            user.set('resume', this.resume);
            // 保存到云端
            user.save().then(()=>{
                alert('保存成功')
            },(error)=>{
                consol.log(error)
                alert('保存失败')
            });
        },
        getResume(){
            var query = new AV.Query('User');
            query.get(this.currentUser.objectId).then( (user)=> {
                user=user.toJSON() 
                this.resume=user.resume
            }, function (error) {
                // 异常处理
            });

        },
        logout(){
            AV.User.logOut();
            // 现在的 currentUser 是 null 了
            var currentUser = AV.User.current();
            this.currentUser={email:undefined,objectId:undefined}
            alert("退出成功")
        }

    },
   
})

let currentUser=AV.User.current()

if (currentUser){
    app.currentUser=currentUser.toJSON()
    app.getResume()
    console.log(app.currentUser)
}