<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/teacherHome')"
        sub-title="负责监考的考试安排记录"
        title="监考记录"
      />
    </div>
    <a-table :columns="columns" :data-source="recordsInfo" :pagination="this.Common.paginationProps">
      <span slot="mainInvigilator" slot-scope="mainInvigilator">
        <a-tag :visible="mainInvigilator" color="green">是</a-tag>
        <a-tag :visible="!mainInvigilator">否</a-tag>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '考试',
    dataIndex: 'examinationName',
    scopedSlots: {customRender: 'examinationName'}
  },
  {
    title: '主监考',
    dataIndex: 'mainInvigilator',
    scopedSlots: {customRender: 'mainInvigilator'}
  },
  {
    title: '考点名',
    dataIndex: 'examPlaceName',
    scopedSlots: {customRender: 'examPlaceName'}
  },
  {
    title: '楼栋名',
    dataIndex: 'examPlaceBuildingName',
    scopedSlots: {customRender: 'examPlaceBuildingName'}
  },
  {
    title: '考室',
    dataIndex: 'examPlaceRoomName',
    scopedSlots: {customRender: 'examPlaceRoomName'}
  },
  {
    title: '科目',
    dataIndex: 'subject',
    scopedSlots: {customRender: 'subject'}
  },
  {
    title: '开始时间',
    dataIndex: 'timeStart',
    scopedSlots: {customRender: 'timeStart'}
  },
  {
    title: '结束时间',
    dataIndex: 'timeEnd',
    scopedSlots: {customRender: 'timeEnd'}
  },
  {
    title: '监考记录',
    key: 'record',
    dataIndex: 'record',
    scopedSlots: {customRender: 'record'},
    width: 150
  }
]

export default {
  name: 'TeacherRecordHistory',
  data () {
    return {
      recordsInfo: [],
      columns,
      visible: false
    }
  },
  methods: {
    // 获取考试记录
    async getRecords () {
      let id = window.localStorage.getItem('id')
      const {data: res} = await this.$http.get('examinationInvigilatorRecord/listByInvigilator?invigilatorId=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.recordsInfo = res.data
      return this.$message.success('获取记录成功')
    }
  },
  mounted () {
    this.getRecords()
  }
}
</script>

<style scoped></style>
