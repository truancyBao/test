<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsHome')"
        sub-title="查看管理参与单位"
        title="参与人员"
      />
      <a-button class="header-button">添加参与人员</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdmissionsManageParticipantStaff',
  data () {
    return {}
  }
}
</script>

<style scoped></style>
