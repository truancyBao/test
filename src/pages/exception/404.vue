<template>
  <a-result
    status="404"
    sub-title="Sorry, the page you visited does not exist."
    title="404"
  >
    <template #extra>
      <a-button type="primary">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exp404',
  data () {
    return {}
  }
}
</script>

<style scoped></style>
