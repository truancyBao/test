<template>
  <div>
    <a-row>
      <a-col :span="14" class="login-side">
        <div>
          <h1 class="login-text">登录</h1>
          <a-form ref="loginFormRef" @submit="submitLoginForm('loginForm')" class="login-form">
            <p>账号</p>
            <a-form-item>
              <a-input
                size="large"
                v-decorator="[
                  'account',
                  {
                    rules: [{ required: true, message: '请输入账号' }]
                  }
                ]"
                v-model="loginForm.account"
              >
                <a-icon
                  slot="prefix"
                  style="color: rgba(0,0,0,.25)"
                  type="user"
                />
              </a-input>
            </a-form-item>
            <p>密码</p>
            <a-form-item>
              <a-input
                size="large"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: '请输入密码' }]
                  }
                ]"
                v-model="loginForm.password"
              >
                <a-icon
                  slot="prefix"
                  style="color: rgba(0,0,0,.25)"
                  type="lock"
                />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button
                class="login-form-button"
                html-type="submit"
                size="large"
                type="primary"
              >
                登录
              </a-button>
            </a-form-item>
            <a-form-item>
              <a class="login-form-forgot" href="">
                忘记密码
              </a>
              <a class="login-form-register" @click="showRegisterDrawer" style="float:right">
                教师账号注册
              </a>
            </a-form-item>
          </a-form>
          <a-drawer
            title="教师注册"
            :width="360"
            :visible="visible"
            :body-style="{ paddingBottom: '80px' }"
            @close="onClose"
          >
            <a-form :form="registerForm" layout="vertical">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="邮箱">
                    <a-input type="text" v-model="registerForm.email" style="width: 120%" placeholder="请输入邮箱"/>
                  </a-form-item>
                  <a-form-item label="密码">
                    <a-input-password v-model="registerForm.password" style="width: 120%"
                                      autocomplete="new-password" placeholder="请输入密码"/>
                  </a-form-item>
                  <a-form-item label="确认密码">
                    <a-input-password v-model="registerForm.repassword" style="width: 120%"
                                      autocomplete="new-password" placeholder="请再次输入密码"/>
                  </a-form-item>
                  <a-space :size="50">
                    <a-button type="primary" @click="teacherRegister">注册</a-button>
                    <a-button type="primary" @click="resetRegister">重置</a-button>
                  </a-space>
                </a-col>
              </a-row>
            </a-form>
          </a-drawer>
        </div>
      </a-col>
      <a-col :span="10" class="image-side">
        <div>
          <img class="image" src="../../assets/side.jpg"/>
          <h1 class="title">中高考<br/>考务管理系统</h1>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        account: '',
        password: ''
      },
      registerForm: {
        email: '',
        password: '',
        repassword: ''
      },
      visible: false
    }
  },
  created () {

  },
  methods: {
    // 注册
    showRegisterDrawer () {
      this.visible = true
    },
    // 关闭注册
    onClose () {
      this.visible = false
    },
    // 注册
    async teacherRegister () {
      if (this.registerForm.password !== this.registerForm.repassword) {
        return this.$message.error('密码不一致')
      }
      const _register = {}
      _register.email = this.registerForm.email
      _register.password = this.registerForm.password
      const {data: res} = await this.$http.post('examPlaceInvigilator/register', _register)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      return this.$message.success('注册成功')
    },
    // 重置注册框
    resetRegister () {
      this.registerForm.email = ''
      this.registerForm.password = ''
      this.registerForm.repassword = ''
    },
    /**
     * 登录
     * @param formName
     */
    submitLoginForm (formName) {
      const _this = this
      const loginRequest = {email: this.loginForm.account, password: this.loginForm.password}
      this.$http.post('login', loginRequest).then(function (response) {
        if (response.data.code === 10000) {
          _this.$message.success('登录成功')
          /**
           * 1.将登录成功之后的令牌token，保存到客户端的sessionStorage中
           *   1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
           *   1.2 将token存储在sessionStorage中，登录成功会每次发起请求都在http header中携带JWT令牌
           * 2.通过编程式导航跳转到后台主页路由地址是 /home
           */
          window.sessionStorage.setItem('eastoken', response.data.data.token)
          if (response.data.data.login.roleId === 1) {
            _this.$router.push('/AdmissionsHome')
          }
          if (response.data.data.login.roleId === 2) {
            _this.$router.push('/admissionsHome')
          }
          if (response.data.data.login.roleId === 3) {
            _this.$router.push('/schoolHome')
          }
          if (response.data.data.login.roleId === 4) {
            _this.$router.push('/teacherHome')
          }
          localStorage.setItem('name', response.data.data.login.name)
          localStorage.setItem('id', response.data.data.login.id)
          localStorage.setItem('roleId', response.data.data.login.roleId)
          localStorage.setItem('avatar', response.data.data.login.avatar)
        } else {
          _this.$message.error(response.data.message)
        }
      })
    }

  }
}
</script>

<style scoped>
.login-side {
  padding: 150px 30px;
  height: 100vh;
  display: flex;
  justify-content: center;
}

.login-text {
  font-weight: bold;
  font-size: 36px;
}

.login-form-button {
  width: 300px;
  margin-top: 20px;
}

.image-side {
  overflow: hidden;
}

.image {
  height: 100vh;
}

.title {
  z-index: 2;
  text-align: left;
  position: absolute;
  background: none;
  top: 100px;
  left: 60px;
  color: #ffffff;
  font-weight: bold;
  font-size: 60px;
}
</style>
