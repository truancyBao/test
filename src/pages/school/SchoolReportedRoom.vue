<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="上报考场"
        title="上报考场"
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
        <a-popconfirm
          title="确认通过?"
          ok-text="是"
          cancel-text="否"
          :disabled="!hasSelected"
          @confirm="checkRoomBatch"
          @cancel="cancel"
        >
          <a-button class="header-button" type="primary" :disabled="!hasSelected">批量审核</a-button>
        </a-popconfirm>
        <a-popconfirm
          title="确认删除?"
          ok-text="是"
          cancel-text="否"
          :disabled="!hasSelected"
          @confirm="deleteReportedRoomBatch"
          @cancel="cancel"
        >
          <a-button
            :disabled="!hasSelected"
            class="header-button"
            type="danger"
          >
            批量删除
          </a-button>
        </a-popconfirm>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="reportedRooms"
      @change="handleTableChange"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :pagination="pagination"
    >
      <span slot="checked" slot-scope="checked">
        <a-tag color="green" v-if="checked">通过</a-tag>
        <a-tag color="yellow" v-if="!checked">未审核</a-tag>
      </span>
      <span slot="operation" slot-scope="text, record">
        <a>通过</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确认删除?"
          ok-text="是"
          cancel-text="否"
          @confirm="deleteReportedRoom(record.id)"
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
    title: '考场类型',
    dataIndex: 'type',
    scopedSlots: {customRender: 'type'}
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
      selectedExam: null,
      reportedRooms: [],
      reportedRoomsInfo: [],
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
    this.getAllocatedTask()
  },
  methods: {
    // 选择变化
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 页码变化
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
    },
    // 选择考试
    taskChange (value) {
      this.selectedExam = value
      this.getReportedRooms()
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
    // 根据选择的考试获取上报的考点
    async getReportedRooms () {
      if (this.selectedExam === null) {
        return this.$message.info('请先选择考试')
      }
      const {data: res} = await this.$http.get('ExaminationRoomReported/getListByExamIdAndExamPlaceId?examinationId=' + this.selectedExam)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.reportedRooms = res.data
      // await this.getReportedRoomsInfo()
      return this.$message.success('获取上报考场成功')
    },
    // 转化为可视信息
    // async getReportedRoomsInfo () {
    //   // 注意每次先清空列表
    //   this.reportedRoomsInfo = []
    //   for (let i = 0; i < this.reportedRooms.length; i++) {
    //     let {data: res} = await this.$http.get('examPlaceRoom/get?id=' + this.reportedRooms[i].examPlaceRoomId)
    //     if (res.code !== 10000) {
    //       return this.$message.error(res.data)
    //     }
    //     // id转化
    //     res.data.id = this.reportedRooms[i].id
    //     this.reportedRoomsInfo.push(res.data)
    //   }
    // },
    // 删除单个上报信息
    async deleteReportedRoom (id) {
      let {data: res} = await this.$http.delete('ExaminationRoomReported/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      await this.getReportedRooms()
      return this.$message.success('删除成功')
    },
    // 批量删除
    async deleteReportedRoomBatch () {
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.reportedRooms[this.selectedRowKeys[i] + (this.pagination.current - 1) * this.pagination.pageSize].id)
      }
      let {data: res} = await this.$http.post('ExaminationRoomReported/deleteList', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.selectedRowKeys = []
      this.$message.success('删除成功')
      await this.getReportedRooms()
    },
    // 批量审核考室
    async checkRoomBatch () {
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.reportedTeachers[this.selectedRowKeys[i] + (this.pagination.current - 1) * this.pagination.pageSize].id)
      }
      const {data: res} = await this.$http.post('ExaminationRoomReported/checkBatch', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      await this.getReportedRooms()
      return this.$message.success('更新审核状态成功')
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
