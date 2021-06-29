<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsHome')"
        sub-title="管理考试信息和分配结果"
        title="管理考试"
      />
    </div>
    <div v-if="examInfos.length === 0" class="empty">
      <a-empty>
        <span slot="description">目前没有考试</span>
      </a-empty>
    </div>
    <div v-else>
      <a-tabs style="padding: 0 8px">
        <a-tab-pane  v-for="year in years" :key="year" :tab="year">
          <div :key="examInfo" v-for="examInfo in examInfos">
            <admissions-exam-card
              v-if="examInfo.startTime.slice(0, 4) === year"
              :exam-info="examInfo"
            ></admissions-exam-card>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import AdmissionsExamCard from '../../components/AdmissionsExamCard'

export default {
  name: 'AdmissionsManageExam',
  components: { AdmissionsExamCard },
  data () {
    return {
      examInfos: [],
      years: []
    }
  },
  created () {
    this.getExamList()
  },
  methods: {
    async getExamList () {
      const { data: res } = await this.$axios.get('recordExam/list')
      if (res.code === 10000) {
        this.examInfos = res.data.reverse()
        let exams = res.data
        let len = exams.length
        let years = []
        for (let i = 0; i < len; i++) {
          let exam = exams[i]
          years.push(exam.startTime.slice(0, 4))
        }
        this.years = [...new Set(years)].sort().reverse()
        console.log(this.years)
        this.$message.success('获取考试信息成功')
      } else {
        this.$message.error(res.data)
      }
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

.empty {
  padding-top: 100px;
}
</style>
