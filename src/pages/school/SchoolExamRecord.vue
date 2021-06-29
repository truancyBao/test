<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="添加和管理监考记录"
        title="监考记录"
      />
      <div>
        <a-select style="width: 150px" default-value="选择考试" @change="getRecordsByExam">
          <a-select-option v-for="exam in examTasks" :key="exam.examinationId">{{
              exam.examinationName
            }}
          </a-select-option>
        </a-select>
        <a-button class="header-button" @click="showModal">添加监考记录</a-button>
      </div>
      <a-modal
        title="添加监考记录"
        :visible="modalVisible"
        :confirm-loading="confirmLoading"
        @cancel="handleCancel"
      >
        <template slot="footer">
          <a-button key="back" @click="handleCancel">
            取消
          </a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOk"
          >
            保存
          </a-button>
        </template>
        <a-form-model
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="考试">
            <a-input v-model="form.exam"/>
          </a-form-model-item>
          <a-form-model-item label="考场">
            <a-input v-model="form.examRoom"/>
          </a-form-model-item>
          <a-form-model-item label="科目">
            <a-input v-model="form.subject"/>
          </a-form-model-item>
          <a-form-model-item label="日期">
            <a-date-picker v-model="form.time"/>
          </a-form-model-item>
          <a-form-model-item label="时间">
            <a-time-picker use12-hours v-model="form.time"/>
          </a-form-model-item>
          <a-form-model-item label="人员">
            <a-input v-model="form.people"/>
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-textarea v-model="form.describe" :auto-size="{ minRows: 3 }"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>

    <a-table
      :columns="columns"
      :data-source="recordInfo"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <span slot="mainInvigilator" slot-scope="mainInvigilator">
        <a-tag :visible="mainInvigilator" color="green">是</a-tag>
        <a-tag :visible="!mainInvigilator">否</a-tag>
      </span>
      <span slot="record" slot-scope="record">
        <a-tag
          :key="record"
          @click="showRecordDrawer(record)"
        >
          {{ record }}
        </a-tag>
      </span>
      <span slot="operation" slot-scope="text, record">
        <a @click="showViolateModal(record)">编辑记录</a>
      </span>
    </a-table>

    <a-modal
      title="添加异常记录"
      :visible="violateModalVisible"
      :confirm-loading="confirmLoading"
      @ok="editRecord"
      @cancel="handleCancel"
    >
      <a-textarea v-model="editRecordInfo.record"></a-textarea>
    </a-modal>

  </div>
</template>

<script>
const columns = [
  {
    title: '记录id',
    dataIndex: 'id',
    scopedSlots: {customRender: 'id'}
  },
  {
    title: '考试名称',
    dataIndex: 'examinationName',
    scopedSlots: {customRender: 'examinationName'}
  },
  {
    title: '姓名',
    dataIndex: 'invigilatorName',
    scopedSlots: {customRender: 'invigilatorName'}
  },
  {
    title: '是否主监考',
    dataIndex: 'mainInvigilator',
    scopedSlots: {customRender: 'mainInvigilator'}
  },
  {
    title: '科目',
    dataIndex: 'subject',
    scopedSlots: {customRender: 'subject'}
  },
  {
    title: '楼栋名',
    dataIndex: 'examPlaceBuildingName',
    scopedSlots: {customRender: 'examPlaceBuildingName'}
  },
  {
    title: '考场名',
    dataIndex: 'examPlaceRoomName',
    scopedSlots: {customRender: 'examPlaceRoomName'}
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
  },
  {
    title: '操作',
    key: 'operation',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    width: 150
  }
]

export default {
  name: 'SchoolExamRecord',
  data () {
    return {
      recordInfo: [],
      selectedExam: '',
      columns,
      modalVisible: false,
      violateModalVisible: false,
      editRecordInfo: {},
      loading: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: {
        exam: '',
        examRoom: '',
        subject: '',
        date: '',
        time: '',
        people: '',
        describe: ''
      },
      examTasks: [],
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
  methods: {
    showModal () {
      this.modalVisible = true
    },
    showViolateModal (info) {
      this.violateModalVisible = true
      this.editRecordInfo.id = info.id
      this.editRecordInfo.record = info.record
      console.log(this.editRecordInfo.id)
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
      this.violateModalVisible = false
    },
    // 页码变化
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
    },
    // 获取本考点的记录
    async getRecords () {
      const {data: res} = await this.$http.get('examinationInvigilatorRecord/listByExamPlaceId')
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.recordInfo = res.data
      return this.$message.success('获取本考点记录成功')
    },
    // 获取分配到的考试任务
    async getAllocatedExam () {
      const {data: res} = await this.$http.get('examinationTaskAllocated/listByExamPlace')
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.examTasks = res.data
      return this.$message.success('获取考试成功')
    },
    // 获取指定考试的记录
    async getRecordsByExam (selectedExam) {
      const {data: res} = await this.$http.get('examinationInvigilatorRecord/listByExamAndExamPlaceId?examId=' + selectedExam)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.recordInfo = res.data
      return this.$message.success('获取指定考试记录成功')
    },
    // 编辑记录
    async editRecord () {
      const {data: res} = await this.$http.put('examinationInvigilatorRecord/update', this.editRecordInfo)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      return this.$message.success('添加异常成功')
    }
  },
  mounted () {
    this.getRecords()
    this.getAllocatedExam()
  }
}
</script>

<style scoped></style>
