<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="查看大型考试信息和分配任务"
        title="查看考试"
      />
    </div>
    <div :key="taskInfo" v-for="taskInfo in taskInfos">
      <school-exam-card :task-info="taskInfo"></school-exam-card>
    </div>
  </div>
</template>

<script>
import SchoolExamCard from '../../components/SchoolExamCard'

export default {
  name: 'SchoolCheckExam',
  components: {SchoolExamCard},
  data () {
    return {
      taskInfos: []
    }
  },
  created () {
    this.getAllocatedTask()
  },
  methods: {
    async getAllocatedTask () {
      const {data: res} = await this.$http.get('examinationTaskAllocated/listByExamPlace')
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.taskInfos = res.data
      this.$message.success('获取考试任务成功')
    }
  }
}
</script>

<style scoped>
.page {
  background: none;
  box-shadow: none;
  padding: 0;
}
</style>
