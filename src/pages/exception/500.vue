<template>
  <a-result status="500" sub-title="Sorry, the server is wrong." title="500">
    <template #extra>
      <a-button type="primary">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exp500',
  data () {
    return {}
  }
}
</script>

<style scoped></style>
