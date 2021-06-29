<template>
  <a-dropdown>
    <div class="header-avatar">
      <a-avatar class="avatar" icon="user"/>
      <span class="name">{{ name }}</span>
    </div>
    <a-menu slot="overlay">
      <a-menu-item>
        <a-icon type="user"/>
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting"/>
        <span>设置中心</span>
      </a-menu-item>
      <a-menu-divider/>
      <a-menu-item @click="logout">
        <a-icon type="poweroff"/>
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
  name: 'HeaderAvatar',
  data () {
    return {
      name: '无名'
    }
  },
  created () {
    this.getName()
  },
  methods: {
    logout () {
      this.$router.push('/login')
    },
    // 获取当前姓名
    async getName () {
      let id = window.localStorage.getItem('id')
      let roleId = window.localStorage.getItem('roleId')
      if (roleId === '2') {
        const {data: res} = await this.$http.get('recruitApprover/get?id=' + id)
        this.name = res.data.name
      } else if (roleId === '3') {
        const {data: res} = await this.$http.get('examPlaceAdmin/get?id=' + id)
        this.name = res.data.name
      } else if (roleId === '4') {
        const {data: res} = await this.$http.get('examPlaceInvigilator/get?id=' + id)
        this.name = res.data.name
      }
    }
  }
}
</script>

<style scoped>
.header-avatar {
  cursor: pointer;
  margin: 0 16px;
}

.avatar {
  margin-bottom: 6px;
  background: #1890ff;
}

.name {
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
}
</style>
