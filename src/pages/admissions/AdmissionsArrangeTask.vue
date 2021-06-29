<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsManageExam/exam')"
        sub-title="向各个考点分配考场和考务人员任务"
        title="分配任务"
      />
    </div>
    <div class="exam-card">
      <div class="exam-card-header">
        <h1>{{ examInfo.name }}</h1>
        <p>{{ examInfo.startTime }} - {{ examInfo.endTime }}</p>
      </div>
      <hr color="#eeeeee"/>
      <div class="exam-card-content">
        <div class="content-synopsis">
          <a-statistic
            v-for="item in restInfo.restStudent"
            :key="item"
            :value="item.rest"
            :title="'待分配' + item.type"
            class="statistic"
          />
          <a-statistic
            v-for="item in restInfo.restRoom"
            :key="item"
            :value="item.rest"
            :title="'待分配' + item.type"
            class="statistic"
          />
          <a-statistic
            v-for="item in restInfo.restRole"
            :key="item"
            :value="item.rest"
            :title="'待分配' + item.type"
            class="statistic"
          />
        </div>
      </div>
    </div>
    <!--    <a-divider style="font-weight:bold">-->
    <!--      考点列表-->
    <!--    </a-divider>-->
    <!--    <div class="exam-site-list">-->
    <!--      <admissions-exam-site-card-->
    <!--        :key="examSiteInfo"-->
    <!--        v-for="examSiteInfo in examSiteInfos"-->
    <!--        :examId="examInfo.id"-->
    <!--        :examName="examInfo.name"-->
    <!--        :examSiteId="examSiteInfo.id"-->
    <!--        :examSiteName="examSiteInfo.name"-->
    <!--      ></admissions-exam-site-card>-->
    <!--    </div>-->
    <a-table
      :columns="columns"
      :data-source="examSiteInfos"
      @change="handleTableChange"
      :pagination="pagination"
      :scroll="{ y: 300 }"
    >
      <span slot="allocated" slot-scope="text, record">
        <a-tag :color="allocatedSites.indexOf(record.id) > -1 ? 'blue':''">{{
            allocatedSites.indexOf(record.id) > -1 ? '是' : '否'
          }}</a-tag>
      </span>
      <span slot="operation" slot-scope="text, record">
        <a @click="showArrangeModal(record.id)">分配任务</a>
        <a-divider type="vertical"/>
        <a @click="showArrangeInfoDrawer(record.id)">查看任务</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="是否撤销？"
          ok-text="确认"
          ok-type="danger"
          cancel-text="取消"
          @confirm="recallTask(record.id)"
          @cancel="cancel"
        >
          <a>撤销任务</a>
        </a-popconfirm>
      </span>
    </a-table>
    <a-modal
      title="分配任务"
      :visible="arrangeModalVisible"
      :confirm-loading="confirmLoading"
      ok-text="分配"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        // 考生信息
        <a-form-model-item
          v-for="item in arrangeStudentInfos"
          :key="item"
          :label="item.type"
        >
          <a-input-number
            :min="0"
            style="width: 80%"
            v-model="item.value"
          />
        </a-form-model-item>
        // 考室信息
        <a-form-model-item
          v-for="item in arrangeRoomInfos"
          :key="item"
          :label="item.type"
        >
          <a-input-number
            :min="0"
            style="width: 80%"
            v-model="item.value"
          />
        </a-form-model-item>
        // 角色信息
        <a-form-model-item label="分配监考人员数量">
          <a-input-number
            :min="0"
            style="width: 80%"
            v-model="form.invigilatorAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="分配男监考数量">
          <a-input-number
            :min="0"
            style="width: 80%"
            v-model="form.invigilatorManAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="分配女监考数量">
          <a-input-number
            :min="0"
            style="width: 80%"
            v-model="form.invigilatorWomanAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item
          v-for="item in arrangeRoleInfos"
          :key="item"
          :label="item.type"
          v-if="item.type!=='监考人员'"
        >
          <a-input-number
            :min="0"
            style="width: 80%"
            v-model="item.value"
          />
        </a-form-model-item>
        <a-form-model-item label="开始时间">
          <a-date-picker
            v-model="form.timeStart"
            value-format="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="结束时间">
          <a-date-picker
            v-model="form.timeEnd"
            value-format="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-textarea :disabled="disabled" v-model="form.remark" auto-size/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-drawer
      title="查看任务"
      placement="right"
      width="30%"
      :closable="false"
      :visible="arrangeInfoDrawerVisible"
      @close="closeArrangeInfoDrawer"
    >
      <a-descriptions title="学生信息">
        <a-descriptions-item
        v-for="item in arrangedTaskInfo.studentInfos"
        :key="item"
        :label="item.type"
        >{{item.value}}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="监考人员">
        <a-descriptions-item label="总人数">{{arrangedTaskInfo.invigilatorAllocatedNumber}}</a-descriptions-item>
        <a-descriptions-item label="男监考人数">{{arrangedTaskInfo.invigilatorManAllocatedNumber}}</a-descriptions-item>
        <a-descriptions-item label="女监考人数">{{arrangedTaskInfo.invigilatorWomanAllocatedNumber}}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="考室信息">
        <a-descriptions-item
          v-for="item in arrangedTaskInfo.roomInfos"
          :key="item"
          :label="item.type"
        >{{item.value}}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="其它角色信息">
        <a-descriptions-item
          v-for="item in arrangedTaskInfo.roleInfos"
          :key="item"
          :label="item.type"
        >{{item.value}}</a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </div>
</template>

<script>

import AdmissionsExamSiteCard from '../../components/AdmissionsExamSiteCard.vue'

const columns = [
  {
    title: '考点名字',
    dataIndex: 'name',
    width: 150,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '是否已分配',
    dataIndex: 'allocated',
    width: 120,
    scopedSlots: {customRender: 'allocated'}
  },
  {
    title: '考点所在区域',
    dataIndex: 'areaName',
    width: 200,
    scopedSlots: {customRender: 'areaName'}
  },
  {
    title: '考点详细地址',
    dataIndex: 'position',
    scopedSlots: {customRender: 'position'}
  },
  {
    title: '考场数',
    dataIndex: 'maxRoom',
    width: 150,
    scopedSlots: {customRender: 'maxRoom'}
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '22%',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  inject: ['reload'],
  components: {AdmissionsExamSiteCard},
  name: 'AdmissionsArrangeTask',
  data () {
    return {
      labelCol: {span: 8},
      wrapperCol: {span: 12},
      columns,
      examInfo: {
        examId: '',
        examName: '',
        examSiteId: ''
      },
      studentInfos: [],
      roomInfos: [],
      roleInfos: [],
      arrangeStudentInfos: [],
      arrangeRoomInfos: [],
      arrangeRoleInfos: [],
      roomKinds: [],
      roleKinds: [],
      studentKinds: [],
      examSiteInfos: [],
      allocatedSites: [],
      restInfo: {
        restScienceExamineeNumber: '',
        restLiberalExamineeNumber: '',
        restScienceRoomNumber: '',
        restLiberalRoomNumber: '',
        restInvigilatorNumber: ''
      },
      arrangedTaskInfo: '',
      arrangeModalVisible: false,
      arrangeInfoDrawerVisible: false,
      form: {},
      selectedExamId: '',
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
    this.examInfo = this.$route.query.examInfo
    this.roomInfos = this.$route.query.roomInfos
    this.roleInfos = this.$route.query.roleInfos
    this.studentInfos = this.$route.query.studentInfos
    this.initTaskInfo()
  },
  mounted () {
    this.getAllocatedExamPlace()
    this.getExamSiteList()
    this.getRestTask()
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
    // 打开分配表单
    showArrangeModal (id) {
      this.arrangeModalVisible = true
      this.selectedExamId = id
      // 初始化时间
      this.form.timeStart = this.examInfo.startTime
      this.form.timeEnd = this.examInfo.endTime
    },
    // 打开详情抽屉
    showArrangeInfoDrawer (examPlaceId) {
      this.arrangeInfoDrawerVisible = true
      this.getTaskInfoByExamPlace(examPlaceId)
    },
    closeArrangeInfoDrawer () {
      this.arrangeInfoDrawerVisible = false
    },
    handleOk () {
      this.arrange()
      // this.arrangeModalVisible = false
    },
    handleCancel () {
      this.arrangeModalVisible = false
    },
    async getExamSiteList () {
      const {data: res} = await this.$axios.get('examPlace/list')
      if (res.code === 10000) {
        this.examSiteInfos = res.data
        this.$message.success('获取考点信息成功')
      } else {
        this.$message.error('获取考点信息失败')
      }
    },
    // 初始化任务
    initTaskInfo () {
      // 学生
      for (let i = 0; i < this.studentInfos.length; i++) {
        let info = {
          type: this.studentInfos[i].type,
          value: ''
        }
        this.arrangeStudentInfos.push(info)
      }
      // 角色
      for (let i = 0; i < this.roleInfos.length; i++) {
        let info = {
          type: this.roleInfos[i].type,
          value: ''
        }
        this.arrangeRoleInfos.push(info)
      }
      // 考室
      for (let i = 0; i < this.roomInfos.length; i++) {
        let info = {
          type: this.roomInfos[i].type,
          value: ''
        }
        this.arrangeRoomInfos.push(info)
      }
    },
    // 获取剩余任务
    async getRestTask () {
      const {data: res} = await this.$http.get('recordExam/rest?examinationId=' + this.examInfo.id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.restInfo = res.data
      return this.$message.success('获取剩余任务成功')
    },
    // 获取已分配考点
    async getAllocatedExamPlace () {
      const {data: res} = await this.$http.get('examinationTaskAllocated/listByExam?examId=' + this.examInfo.id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      for (let i = 0; i < res.data.length; i++) {
        this.allocatedSites.push(res.data[i].examPlaceId)
      }
      return this.$message.success('获取已分配考点成功')
    },
    // 获取指定考场任务
    async getTaskInfoByExamPlace (examPlaceId) {
      const {data: res} = await this.$http.get('examinationTaskAllocated/getByExamAndExamPlace?examId=' + this.examInfo.id + '&examPlaceId=' + examPlaceId)
      if (res.code !== 10000) {
        this.arrangeInfoDrawerVisible = false
        return this.$message.error(res.data)
      }
      this.arrangedTaskInfo = res.data
      console.log(this.arrangedTaskInfo)
    },
    // 分配任务
    async arrange () {
      const taskInfo = {
        task: {
          examinationId: this.examInfo.id,
          examinationName: this.examInfo.name,
          examPlaceId: this.selectedExamId,
          timeStart: this.form.timeStart,
          timeEnd: this.form.timeEnd,
          // liberalStudentAllocatedNumber: this.form.liberalStudentAllocatedNumber,
          // scienceStudentAllocatedNumber: this.form.scienceStudentAllocatedNumber,
          // liberalRoomAllocatedNumber: this.form.liberalRoomAllocatedNumber,
          // liberalRoomNumberMin: this.form.liberalRoomNumberMin,
          // scienceRoomAllocatedNumber: this.form.scienceRoomAllocatedNumber,
          // scienceRoomNumberMin: this.form.scienceRoomNumberMin,
          // specialRoomAllocatedNumber: this.form.specialRoomAllocatedNumber,
          // standbyRoomAllocatedNumber: this.form.standbyRoomAllocatedNumber,
          invigilatorAllocatedNumber: this.form.invigilatorAllocatedNumber,
          invigilatorManAllocatedNumber: this.form.invigilatorManAllocatedNumber,
          invigilatorWomanAllocatedNumber: this.form.invigilatorWomanAllocatedNumber,
          // otherStaffsAllocatedNumber: this.form.otherStaffsAllocatedNumber,
          remark: this.form.remark
        },
        basicInfos: {
          studentInfos: this.arrangeStudentInfos,
          roomInfos: this.arrangeRoomInfos,
          roleInfos: this.arrangeRoleInfos
        }
      }
      // 单独处理监考人员
      taskInfo.basicInfos.roleInfos[0].value = taskInfo.task.invigilatorAllocatedNumber
      const {data: res} = await this.$axios.post('examinationTaskAllocated/allocate', taskInfo)
      if (res.code === 10000) {
        this.arrangeModalVisible = false
        this.$message.success('分配成功')
        this.reload()
      } else {
        this.$message.error(res.data)
      }
    },
    // 撤销任务
    async recallTask (examPlaceId) {
      const {data: res} = await this.$http.delete('examinationTaskAllocated/recall?examId=' + this.examInfo.id + '&examPlaceId=' + examPlaceId)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.$message.success('撤回成功')
      this.reload()
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

.exam-card {
  background-color: #ffffff;
  padding: 16px 24px;
  margin-bottom: 12px;
  border-radius: 4px;
}

h1 {
  font-weight: bold;
  font-size: 20px;
}

p {
  font-size: 16px;
}

.exam-card-header,
.content-synopsis {
  display: flex;
  justify-content: space-between;
}

.statistic {
  margin-top: 12px;
  margin-right: 36px;
}

.exam-site-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
