<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="管理本校考场分布平面图"
        title="考点平面图"
      />
      <a-button class="header-button">
        重新上传
      </a-button>
    </div>

    <div>
      <img
        alt="ichnography"
        class="ichnography"
        src="../../assets/Ichnography.png"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SchoolManageIchnography',
  data () {
    return {}
  }
}
</script>

<style scoped>
  .ichnography {
    width: 100%;
  }
</style>
