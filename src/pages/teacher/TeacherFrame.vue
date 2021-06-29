<template>
  <a-layout class="frame">
    <a-layout-sider
      :trigger="null"
      class="side"
      collapsible
      v-model="collapsed"
      width="240"
    >
      <div class="title">
        <h1 class="title-text" v-if="!collapsed">
          欢迎监考人员登录
        </h1>
      </div>

      <a-menu :default-selected-keys="['1']" mode="inline" router theme="dark">
        <a-menu-item key="1">
          <a-icon type="home"/>
          <span>首页</span>
          <router-link to="/teacherHome"></router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="user"/>
          <span>个人信息</span>
          <router-link to="/TeacherManageInfo"></router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="solution"/>
          <span>监考任务</span>
          <router-link to="/teacherCheckArrange"></router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="history"/>
          <span>监考记录</span>
          <router-link to="/teacherCheckHistory"></router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <a-icon
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
          class="trigger"
        />
        <div class="header-right">
          <a-input-search
            @search="onSearch"
            class="search-input"
            placeholder="搜索"
          />
          <header-avatar></header-avatar>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import HeaderAvatar from '../../components/HeaderAvatar.vue'

export default {
  components: {HeaderAvatar},
  name: 'TeacherFrame',
  data () {
    return {
      collapsed: false
    }
  }
}
</script>

<style scoped></style>
