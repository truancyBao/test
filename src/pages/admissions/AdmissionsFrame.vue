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
          欢迎招办工作人员登录！
        </h1>
      </div>

      <a-menu :default-selected-keys="['1']" mode="inline" router theme="dark">
        <a-menu-item key="1">
          <a-icon type="home"/>
          <span>首页</span>
          <router-link to="/admissionsHome"></router-link>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <span slot="title">
            <a-icon type="container"/>
            <span>考试管理</span>
          </span>
          <a-menu-item key="2">
            <a-icon type="plus"/>
            <span>新建考试</span>
            <router-link
              to="/admissionsManageExam/addBasic"
            ></router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="container"/>
            <span>管理考试</span>
            <router-link
              to="/admissionsManageExam/exam"
            ></router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <a-icon type="file-text"/>
            <span>考试记录</span>
            <router-link
              to="/admissionsManageExam/examRecord"
            ></router-link>
          </a-menu-item>
        </a-sub-menu>

        <a-menu-item key="5">
          <a-icon type="bank"/>
          <span>考点管理</span>
          <router-link to="/admissionsManageExamSite"></router-link>
        </a-menu-item>

        <a-sub-menu key="sub2">
          <span slot="title">
            <a-icon type="team"/>
            <span>人员管理</span>
          </span>
          <a-menu-item key="6">
            <a-icon type="user"/>
            <span>考点管理员</span>
            <router-link
              to="/admissionsManageStaff/examSiteManager"
            ></router-link>
          </a-menu-item>
          <a-menu-item key="7">
            <a-icon type="user"/>
            <span>所有教师</span>
            <router-link
              to="/admissionsManageStaff/teacher"
            ></router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <span slot="title">
            <a-icon type="link"/>
            <span>参与角色</span>
          </span>
          <a-menu-item key="8">
            <a-icon type="bank"/>
            <span>参与单位</span>
            <router-link
              to="/admissionsManageParticipant/department"
            ></router-link>
          </a-menu-item>
          <a-menu-item key="9">
            <a-icon type="user"/>
            <span>参与人员</span>
            <router-link
              to="/admissionsManageParticipant/staff"
            ></router-link>
          </a-menu-item>
        </a-sub-menu>
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
  name: 'AdmissionsFrame',
  data () {
    return {
      collapsed: false
    }
  },
  methods: {
    onSearch () {
    }
  }
}
</script>

<style scoped>
</style>
