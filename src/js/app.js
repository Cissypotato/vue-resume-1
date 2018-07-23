var app = new Vue({
    el: '#app',
    data: {
        editingName:false,
        resume:{
            name:"姓名",
            jobIntention:"求职意向",
            birthday:"1995",
            gender:"性别",
            email:"邮箱",
            phone:"手机"
        },

    },
    methods:{
        y(key,value){
            this.resume[key]=value
        }
    }
})