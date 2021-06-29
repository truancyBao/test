<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="上报监考人员"
        title="上报监考人员"
      />
      <div class="operation-bar">
        <span>
          <template v-if="hasSelected">
            {{ `已选 ${selectedRowKeys.length} 项` }}
          </template>
        </span>
        <a-select default-value="选择考试" style="width: 150px" @change="taskChange">
          <a-select-option
            v-for="item in allocatedTask"
            :key="item.examId"
            :value="item.examId"
            :title="item.examName"
          >{{ item.examName }}
          </a-select-option>
        </a-select>
        <a-popconfirm
          title="确认通过？"
          ok-text="Yes"
          cancel-text="No"
          :disabled="!hasSelected"
          @confirm="checkReportedTeacherList"
          @cancel="cancel"
        >
          <a-button class="header-button" type="primary" :disabled="!hasSelected">批量审核</a-button>
        </a-popconfirm>
        <a-popconfirm
          title="确认删除？"
          ok-text="Yes"
          cancel-text="No"
          :disabled="!hasSelected"
          @confirm="deleteRecordList"
          @cancel="cancel"
        >
          <a-button class="header-button" type="danger" :disabled="!hasSelected">批量删除</a-button>
        </a-popconfirm>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="reportedTeachers"
      @change="handleTableChange"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :pagination="this.pagination"
    >
      <span slot="checked" slot-scope="checked">
        <a-tag color="green" v-if="checked===1">通过</a-tag>
        <a-tag color="yellow" v-if="checked===0">未审核</a-tag>
      </span>
      <span slot="operation" slot-scope="text, record, index">
        <a-popover title="信息">
          <template slot="content">
            <p>编码: {{ teacherInfo.code }}</p>
            <p>身份证号: {{ teacherInfo.identityCardNumber }}</p>
            <p>姓名: {{ teacherInfo.name }}</p>
            <p>性别: {{ teacherInfo.gender }}</p>
            <p>手机: {{ teacherInfo.phone }}</p>
            <p>生日: {{ teacherInfo.birth }}</p>
            <p>年级: {{ teacherInfo.grade }}</p>
            <p>科目: {{ teacherInfo.subject }}</p>
          </template>
          <a @mouseenter="getTeacherInfo(record.invigilatorId)">详细信息</a>
        </a-popover>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确认删除?"
          ok-text="是"
          cancel-text="否"
          @confirm="deleteRecord(record.id)"
          @cancel="cancel"
        >
        <a href="#">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '姓名',
    dataIndex: 'invigilatorName',
    scopedSlots: {customRender: 'invigilatorName'}
  },
  {
    title: '性别',
    dataIndex: 'gender',
    scopedSlots: {customRender: 'gender'}
  },
  {
    title: '授课年级',
    dataIndex: 'teachGrade',
    scopedSlots: {customRender: 'teachGrade'}
  },
  {
    title: '是否审核',
    dataIndex: 'checked',
    scopedSlots: {customRender: 'checked'}
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '20%',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  name: 'SchoolAuditTeacher',
  data () {
    return {
      allocatedTask: [],
      selectedExamId: null,
      reportedTeachers: [],
      reportedTeachersInfo: [],
      teacherInfo: {},
      columns,
      editingKey: '',
      selectedRowKeys: [],
      loading: false,
      pagination: {
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
    this.getReportedTeacher()
    this.getAllocatedTask()
  },
  methods: {
    // 页码变化触发
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
    },
    // 选择考试
    taskChange (value) {
      this.selectedExamId = value
      this.getReportedTeacher()
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取分配的考试列表
    async getAllocatedTask () {
      const {data: res} = await this.$http.get('examinationTaskAllocated/listByExamPlace')
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.allocatedTask = res.data
      this.$message.success('获取考试任务成功')
    },
    // 获取人员列表
    async getReportedTeacher () {
      if (this.selectedExamId === null) {
        return this.$message.info('请选择考试')
      }
      const hide = this.$message.loading('加载中', 0)
      const {data: res} = await this.$http.get('ExaminationInvigilatorReported/listByExamAndExamPlace?examinationId=' + this.selectedExamId)
      setTimeout(hide, 0)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.reportedTeachers = res.data
      // await this.getTeacherInfoList()
      return this.$message.success('获取成功')
    },
    // 根据id获取教师信息
    async getTeacherInfo (id) {
      const {data: res} = await this.$http.get('examPlaceInvigilator/get?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error('获取详细信息失败')
      }
      this.teacherInfo = res.data
    },
    // 根据id获取教师全部信息
    async getTeacherInfoList () {
      this.reportedTeachersInfo = []
      for (let i = 0; i < this.reportedTeachers.length; i++) {
        const {data: res} = await this.$http.get('examPlaceInvigilator/get?id=' + this.reportedTeachers[i].invigilatorId)
        if (res.code !== 10000) {
          return this.$message.error('获取详细信息失败')
        }
        // 注意id转化
        res.data.id = this.reportedTeachers[i].id
        this.reportedTeachersInfo.push(res.data)
      }
    },
    // 单个删除
    async deleteRecord (id) {
      const {data: res} = await this.$http.delete('ExaminationInvigilatorReported/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      await this.getReportedTeacher()
      return this.$message.success('删除成功')
    },
    // 批量删除
    async deleteRecordList () {
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.reportedTeachers[this.selectedRowKeys[i] + (this.pagination.current - 1) * this.pagination.pageSize].id)
      }
      const {data: res} = await this.$http.post('ExaminationInvigilatorReported/deleteBatch', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.selectedRowKeys = []
      await this.getReportedTeacher()
      return this.$message.success('删除成功')
    },
    // 批量审核
    async checkReportedTeacherList () {
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.reportedTeachers[this.selectedRowKeys[i] + (this.pagination.current - 1) * this.pagination.pageSize].id)
      }
      const {data: res} = await this.$http.post('ExaminationInvigilatorReported/checkBatch', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.selectedRowKeys = []
      await this.getReportedTeacher()
      return this.$message.success('审核状态更新成功')
    }
  },

  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  }
}
</script>

<style scoped></style>
