<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="查看本校所有教师信息"
        title="本校教师"
      />
      <div class="operation-bar">
        <span>
          <template v-if="hasSelected">
            {{ `已选 ${selectedRowKeys.length} 项` }}
          </template>
        </span>
        <a-select default-value="选择考试" style="width: 120px" @change="taskChange">
          <a-select-option
            v-for="item in allocatedTask"
            :key="item.examId"
            :value="item.examId"
            :title="item.examName"
          >{{ item.examName }}
          </a-select-option>
        </a-select>
        <a-button
          :disabled="!hasSelected"
          :loading="loading"
          @click="reportTeachers"
          class="header-button"
          type="primary"
        >
          上报监考人员
        </a-button>
        <a-button
          :disabled="!hasSelected"
          :loading="loading"
          @click="checkSuccessTeacherBatch"
          class="header-button"
          type="primary"
        >
          批量通过
        </a-button>
        <a-button
          :disabled="!hasSelected"
          :loading="loading"
          @click="checkFailTeacherBatch"
          class="header-button"
          type="danger"
        >
          批量不通过
        </a-button>
        <a-popconfirm
          title="确认删除？"
          ok-text="Yes"
          cancel-text="No"
          :disabled="!hasSelected"
          @confirm="deleteTeacherBatch"
          @cancel="cancel"
        >
          <a-button type="danger" :disabled="!hasSelected">批量删除</a-button>
        </a-popconfirm>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="teacherList"
      @change="handleTableChange"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :pagination="pagination"
    >
      <span slot="avoid" slot-scope="text, record">
        <a-popover title="回避理由">
          <template slot="content">
            <p>{{ record.avoidReason }}</p>
          </template>
          <a-tag color="red" :visible="record.avoid">回避</a-tag>
        </a-popover>
        <a-tag color="green" :visible="!record.avoid">不回避</a-tag>
      </span>
      <span slot="checked" slot-scope="checked">
        <a-tag color="green" :visible="checked===1">通过</a-tag>
        <a-tag color="red" :visible="checked===2">不通过</a-tag>
        <a-tag color="yellow" :visible="checked===0">未审核</a-tag>
      </span>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a-popover title="信息">
          <template slot="content">
            <p>编码: {{ record.code }}</p>
            <p>身份证号: {{ record.identityCardNumber }}</p>
            <p>姓名: {{ record.name }}</p>
            <p>性别: {{ record.gender }}</p>
            <p>手机: {{ record.phone }}</p>
            <p>生日: {{ record.birth }}</p>
            <p>年级: {{ record.grade }}</p>
            <p>科目: {{ record.subject }}</p>
          </template>
          <a>详细信息</a>
          </a-popover>
        </template>
        <a-divider type="vertical"/>
        <template>
          <a-popconfirm
            title="确认删除？"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteTeacher(record.id)"
            @cancel="cancel"
          >
          <a href="">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '性别',
    dataIndex: 'gender',
    scopedSlots: {customRender: 'gender'}
  },
  {
    title: '授课年级',
    dataIndex: 'grade',
    scopedSlots: {customRender: 'grade'}
  },
  {
    title: '授课科目',
    dataIndex: 'subject',
    scopedSlots: {customRender: 'subject'}
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    scopedSlots: {customRender: 'phone'}
  },
  {
    title: '是否回避',
    dataIndex: 'avoid',
    scopedSlots: {customRender: 'avoid'}
  },
  {
    title: '审核状态',
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
  name: 'SchoolManageTeacher',
  data () {
    return {
      name: '',
      adminInfo: {},
      teacherList: [],
      checkList: [],
      allocatedTask: [],
      selectedExam: null,
      columns,
      editingKey: '',
      selectedRowKeys: [],
      drawerVisible: false,
      modalVisible: false,
      loading: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: {
        name: '',
        gender: '',
        grade: '',
        subject: '',
        phone: '',
        avoid: '',
        checked: '',
        invigilateExperience: ''
      },
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
    this.getAdminInfo()
    this.getAllTeacher()
    this.getAllocatedTask()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleOk (e) {
      this.loading = true
      setTimeout(() => {
        this.modalVisible = false
        this.loading = false
      }, 1000)
    },
    handleCancel (e) {
      this.modalVisible = false
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getAllTeacher()
    },
    // 获取该管理员信息
    async getAdminInfo () {
      const {data: res} = await this.$http.get('examPlaceAdmin/get?id=' + window.localStorage.getItem('id'))
      if (res.code !== 10000) {
        return this.$message.error('管理员状态异常')
      }
      this.adminInfo = res.data
    },
    // 分页获取该考点所有考务人员
    async getAllTeacher () {
      await this.getAdminInfo()
      const {data: res} = await this.$http.get('examPlaceInvigilator/listByExamPlaceAndPage?examPlaceId=' + this.adminInfo.examPlaceId + '&current=' + this.queryParam.page + '&size=' + this.queryParam.size)
      if (res.code !== 10000) {
        return this.$message.error('获取监考人员失败')
      }
      this.pagination.total = res.data.total
      this.teacherList = res.data.page
      return this.$message.success('获取监考人员成功')
    },
    // 删除考务人员
    async deleteTeacher (id) {
      const {data: res} = await this.$http.delete('examPlaceInvigilator/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error('删除失败')
      }
      await this.getAllTeacher()
      this.$message.success('删除成功')
    },
    // 批量删除考务人员
    async deleteTeacherBatch () {
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.teacherList[this.selectedRowKeys[i]].id)
      }
      const {data: res} = await this.$http.post('examPlaceInvigilator/remove', idList)
      if (res.code !== 10000) {
        return this.$message.error('删除失败')
      }
      this.selectedRowKeys = []
      await this.getAllTeacher()
      this.$message.success('删除成功')
    },
    // 批量通过审核人员
    async checkSuccessTeacherBatch () {
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        this.checkList.push(this.teacherList[this.selectedRowKeys[i]].id)
      }
      const {data: res} = await this.$http.post('examPlaceInvigilator/checkBatch?status=1', this.checkList)
      if (res.code !== 10000) {
        return this.$message.error('更新状态失败')
      }
      this.checkList = []
      this.selectedRowKeys = []
      this.$message.success('更新状态成功')
      await this.getAllTeacher()
    },
    // 批量打回审核人员
    async checkFailTeacherBatch () {
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        this.checkList.push(this.teacherList[this.selectedRowKeys[i]].id)
      }
      const {data: res} = await this.$http.post('examPlaceInvigilator/checkBatch?status=2', this.checkList)
      if (res.code !== 10000) {
        return this.$message.error('更新状态失败')
      }
      this.checkList = []
      this.selectedRowKeys = []
      this.$message.success('更新状态成功')
      await this.getAllTeacher()
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
    // 选择考试
    taskChange (value) {
      this.selectedExam = value
    },
    // 上报人员
    async reportTeachers () {
      if (this.selectedExam === null) {
        return this.$message.info('请先选择考试再上报人员')
      }
      // 校验是否审核以及是否回避
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        if (this.teacherList[this.selectedRowKeys[i]].checked !== 1) {
          return this.$message.warning('不能选择未审核人员')
        }
        if (this.teacherList[this.selectedRowKeys[i]].avoid) {
          return this.$message.warning('不能选择回避人员')
        }
      }
      let reportedList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        let reportedInfo = {}
        reportedInfo.examinationId = this.selectedExam
        reportedInfo.examPlaceId = this.teacherList[this.selectedRowKeys[i]].examPlaceId
        reportedInfo.invigilatorId = this.teacherList[this.selectedRowKeys[i]].id
        reportedInfo.gender = this.teacherList[this.selectedRowKeys[i]].gender
        reportedInfo.teachGrade = this.teacherList[this.selectedRowKeys[i]].grade
        reportedList.push(reportedInfo)
      }
      const {data: res} = await this.$http.post('ExaminationInvigilatorReported/reportBatch', reportedList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.selectedRowKeys = []
      return this.$message.success('上报成功')
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
