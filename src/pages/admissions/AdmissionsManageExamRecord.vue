<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsHome')"
        sub-title="添加和管理监考记录"
        title="监考记录"
      />
    </div>

    <a-table
      :columns="columns"
      :data-source="recordInfos"
      @change="handleTableChange"
      :pagination="pagination"
    >
      <span slot="mainInvigilator" slot-scope="mainInvigilator">
        <a-tag v-if="mainInvigilator" color="green">是</a-tag>
        <a-tag v-else>否</a-tag>
      </span>
    </a-table>
  </div>
</template>

<script>

const columns = [
  {
    title: '记录id',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '考试名',
    dataIndex: 'examinationName',
    scopedSlots: { customRender: 'examinationName' }
  },
  {
    title: '监考人员姓名',
    dataIndex: 'invigilatorName',
    scopedSlots: { customRender: 'invigilatorName' }
  },
  {
    title: '是否主监考',
    dataIndex: 'mainInvigilator',
    scopedSlots: { customRender: 'mainInvigilator' }
  },
  {
    title: '考点名',
    dataIndex: 'examPlaceName',
    scopedSlots: { customRender: 'examPlaceName' }
  },
  {
    title: '楼栋名',
    dataIndex: 'examPlaceBuildingName',
    scopedSlots: { customRender: 'examPlaceBuildingName' }
  },
  {
    title: '考室名',
    dataIndex: 'examPlaceRoomName',
    scopedSlots: { customRender: 'examPlaceRoomName' }
  },
  {
    title: '科目',
    dataIndex: 'subject',
    scopedSlots: { customRender: 'subject' }
  },
  {
    title: '开始时间',
    dataIndex: 'timeStart',
    scopedSlots: { customRender: 'timeStart' }
  },
  {
    title: '结束时间',
    dataIndex: 'timeEnd',
    scopedSlots: { customRender: 'timeEnd' }
  },
  {
    title: '记录',
    dataIndex: 'record',
    scopedSlots: { customRender: 'record' }
  }
]
export default {
  name: 'AdmissionsManageExamRecord',
  data () {
    return {
      recordInfos: [],
      columns,
      drawerVisible: false,
      modalVisible: false,
      confirmLoading: false,
      pagination: {
        showQuickJumper: true,
        total: 0,
        pageSize: 10, // 每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, // 分页中显示总的数据
        current: 1
      },
      queryParam: {
        page: 1, // 第几页
        size: 10 // 每页中显示数据的条数
      }
    }
  },
  created () {
    this.getRecordList()
  },
  methods: {
    // 页码变化
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getRecordList()
    },
    async getRecordList () {
      const { data: res } = await this.$axios.get(
        `examinationInvigilatorRecord/listByPage/${this.pagination.current}/${this.pagination.pageSize}`
      )
      if (res.code === 10000) {
        this.recordInfos = res.data.record
        this.pagination.total = res.data.total
        this.$message.success('获取考试记录信息成功')
      } else {
        this.$message.error('获取考试记录信息失败')
      }
    }
  }
}
</script>

<style scoped></style>
