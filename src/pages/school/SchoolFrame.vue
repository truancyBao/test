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
          欢迎{{ schoolName }}！
        </h1>
      </div>

      <a-menu :default-selected-keys="['1']" mode="inline" router theme="dark">
        <a-menu-item key="1">
          <a-icon type="home"/>
          <span>首页</span>
          <router-link to="/schoolHome"></router-link>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <span slot="title">
            <a-icon type="form"/>
            <span>考试管理</span>
          </span>
          <a-menu-item key="2">
            <a-icon type="form"/>
            <span>新建考试</span>
            <router-link to="/schoolManageExam/add"></router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="book"/>
            <span>查看考试</span>
            <router-link to="/schoolManageExam/check"></router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <a-icon type="history"/>
            <span>考试记录</span>
            <router-link to="/schoolManageExam/examRecord"></router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title">
            <a-icon type="team"/>
            <span>人员管理</span>
          </span>
          <a-menu-item key="5">
            <a-icon type="user"/>
            <span>管理教师</span>
            <router-link to="/schoolManageStaff/teacher"></router-link>
          </a-menu-item>
          <a-menu-item key="6">
            <a-icon type="user"/>
            <span>查看上报</span>
            <router-link to="/schoolManageStaff/report"></router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <span slot="title">
            <a-icon type="home"/>
            <span>考场管理</span>
          </span>
          <a-menu-item key="7">
            <a-icon type="bank"/>
            <span>楼栋管理</span>
            <router-link to="/schoolManageExamRoom/building"></router-link>
          </a-menu-item>
          <a-menu-item key="8">
            <a-icon type="shop"/>
            <span>考场管理</span>
            <router-link to="/schoolManageExamRoom/examRoom"></router-link>
          </a-menu-item>
          <a-menu-item key="9">
            <a-icon type="shop"/>
            <span>查看上报</span>
            <router-link to="/schoolManageExamRoom/reportedRoom"></router-link>
          </a-menu-item>
          <a-menu-item key="10">
            <a-icon type="shop"/>
            <span>考点平面图</span>
            <router-link to="/schoolManageExamRoom/ichnography"></router-link>
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
  name: 'SchoolFrame',
  data () {
    return {
      collapsed: false,
      schoolName: ''
    }
  },
  methods: {
    onSearch () {
    },
    async getSchoolName () {
      let adminId = localStorage.getItem('id')
      const {data: res} = await this.$http.get('examPlaceAdmin/get?id=' + adminId)
      this.schoolName = res.data.examPlaceName
      this.$message.info(res.data)
    }
  },
  mounted () {
    this.getSchoolName()
  }
}
</script>

<style scoped>
</style>
