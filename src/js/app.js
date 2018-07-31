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
        onLogin(e){
            AV.User.logIn(this.login.email, this.login.password).then( (user)=> {
                this.currentUser.objectId=user.Id
                this.currentUser.email=user.attributes.email
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
            user.signUp().then(function (loggedInUser) {
            }, function (error) {
                console.log(error)
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
           
            let {objectId}=AV.User.current().Id;
            var user = AV.Object.createWithoutData('User', objectId);
            // 修改属性
            user.set('resume', this.resume);
            // 保存到云端
            user.save();
        },
        logout(){
            AV.User.logOut();
            // 现在的 currentUser 是 null 了
            var currentUser = AV.User.current();
            console.log(currentUser)
            alert("退出成功")
        }

    },
   
})

let currentUser=AV.User.current()

if (currentUser){
    app.currentUser=currentUser.toJSON()
}