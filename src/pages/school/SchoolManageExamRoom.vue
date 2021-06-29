<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="管理本校考场信息"
        title="本校考场"
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
        <a-select default-value="选择上报类型" style="width: 120px" @change="roomChange">
          <a-select-option
            v-for="item in selectedExam.roomInfos"
            :key="item.type"
            :value="item.type"
          >{{ item.type }}
          </a-select-option>
        </a-select>
        <a-button
          :disabled="!hasSelected"
          :loading="loading"
          @click="reportRooms"
          class="header-button"
          type="primary"
        >
          上报考场
        </a-button>
        <a-button
          :disabled="!hasSelected"
          :loading="loading"
          @click="deleteRoomList"
          class="header-button"
          type="danger"
        >
          批量删除
        </a-button>
        <a-button class="button" @click="showAddDraw()">
          添加考场
        </a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="roomList"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      @change="handleTableChange"
      :pagination="pagination"
    >
      <span slot="operation" slot-scope="text, record">
        <a @click="showEditDraw(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确认删除？"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteRoom(record.id)"
          @cancel="cancel"
        >
          <a href="">删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-drawer
      title="添加考场"
      :width="360"
      :visible="addFormVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="closeAddDraw"
    >
      <a-form :form="addForm">
        <a-form-item label="楼栋" prob="examPlaceBuildingId">
          <a-select v-model="addForm.examPlaceBuildingId">
            <a-select-option
              v-for="building in buildingList" :key="building"
            >{{ building.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="考场名" prob="name">
          <a-input style="width: 50%" v-model="addForm.name"></a-input>
        </a-form-item>
        <a-form-item label="编码" prob="examRoomSerialNumber">
          <a-input style="width: 50%" v-model="addForm.examRoomSerialNumber"></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" @click="addRoom">
            添加
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>

    <a-drawer
      title="修改考场"
      :width="360"
      :visible="editFormVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="closeEditDraw"
    >
      <a-form :form="editForm">
        <a-form-item label="考场id" prob="id">
          <a-input style="width: 50%" v-model="editForm.id" disabled="true"></a-input>
        </a-form-item>
        <a-form-item label="楼栋" prob="examPlaceBuildingId">
          <a-select v-model="editForm.examPlaceBuildingId">
            <a-select-option
              v-for="building in buildingList"
              :key="building"
            >{{ building.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="考场名" prob="name">
          <a-input style="width: 50%" v-model="editForm.name"></a-input>
        </a-form-item>
        <a-form-item label="编码" prob="examRoomSerialNumber">
          <a-input style="width: 50%" v-model="editForm.examRoomSerialNumber"></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" @click="updateRoom">
            修改
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  {
    title: '考场编码',
    dataIndex: 'examRoomSerialNumber',
    scopedSlots: {customRender: 'examRoomSerialNumber'}
  },
  {
    title: '楼栋名',
    dataIndex: 'examPlaceBuildingName',
    scopedSlots: {customRender: 'examPlaceBuildingName'}
  },
  {
    title: '考室名',
    dataIndex: 'name',
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '15%',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  name: 'SchoolManageExamRoom',
  data () {
    return {
      roomList: [],
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
      },
      addForm: {},
      editForm: {},
      buildingList: [],
      addFormVisible: false,
      editFormVisible: false,
      allocatedTask: [],
      selectedExam: '',
      selectedExamId: '',
      selectedRoomType: '',
      columns,
      editingKey: '',
      selectedRowKeys: [],
      loading: false
    }
  },
  created () {
    this.getExamPlaceRoom()
    this.getAllocatedTask()
    this.getBuildingList()
  },
  methods: {
    showAddDraw () {
      this.addFormVisible = true
    },
    showEditDraw (record) {
      this.editForm = record
      this.editFormVisible = true
    },
    closeAddDraw () {
      this.addFormVisible = false
    },
    closeEditDraw () {
      this.editFormVisible = false
    },
    // 页码变化
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getExamPlaceRoom()
    },
    // 选择变化
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 选择考试
    taskChange (value) {
      this.selectedExamId = value
      // 获取考室种类
      for (let i = 0; i < this.allocatedTask.length; i++) {
        if (this.allocatedTask[i].examId === value) {
          this.selectedExam = this.allocatedTask[i]
          break
        }
      }
    },
    // 选择考室类型
    roomChange (type) {
      this.selectedRoomType = type
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
    // 分页获取当前考点考场
    async getExamPlaceRoom () {
      const {data: res} = await this.$http.get(`examPlaceRoom/get/${this.queryParam.page}/${this.queryParam.size}`)
      if (res.code !== 10000) {
        return this.$message.error('获取考场失败,由于' + res.data)
      }
      this.pagination.total = res.data.total
      this.roomList = res.data.page
      return this.$message.success('获取考场成功')
    },
    // 获取当前考点楼栋
    async getBuildingList () {
      const {data: res} = await this.$http.get('examPlaceBuilding/listByExamPlace')
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.buildingList = res.data
      return this.$message.success('获取楼栋成功')
    },
    // 添加考场
    async addRoom () {
      const addInfo = {
        name: this.addForm.name,
        examRoomSerialNumber: this.addForm.examRoomSerialNumber
      }
      const {data: res} = await this.$http.post('examPlaceRoom/save', addInfo)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      return this.$message.success('添加成功')
    },
    // 删除考场
    async deleteRoom (id) {
      const {data: res} = await this.$http.delete('examPlaceRoom/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.$message.success('删除成功')
      this.selectedRowKeys = []
      await this.getExamPlaceRoom()
    },
    // 批量删除
    async deleteRoomList () {
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.roomList[i].id)
      }
      const {data: res} = await this.$http.post('examPlaceRoom/remove', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.$message.success('删除成功')
      this.selectedRowKeys = []
      await this.getExamPlaceRoom()
    },
    // 修改考场
    async updateRoom () {
      const editInfo = {
        id: this.editForm.id,
        examPlaceBuildingId: this.editForm.examPlaceBuildingId,
        examRoomSerialNumber: this.editForm.examRoomSerialNumber,
        name: this.editForm.name
      }
      const {data: res} = await this.$http.put('examPlaceRoom/update', editInfo)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.$message.success('修改成功')
      await this.getExamPlaceRoom()
    },
    // 批量上报考场
    async reportRooms () {
      if (this.selectedExam === '') {
        return this.$message.info('请先选择考试')
      }
      if (this.selectedRoomType === '') {
        return this.$message.info('请先选择考室类型')
      }
      let reportedRooms = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        let reportRoomInfo = {}
        reportRoomInfo.examinationId = this.selectedExam.examId
        reportRoomInfo.examPlaceId = this.selectedExam.examPlaceId
        reportRoomInfo.examPlaceRoomId = this.roomList[this.selectedRowKeys[i]].id
        reportedRooms.push(reportRoomInfo)
      }
      const {data: res} = await this.$http.post('ExaminationRoomReported/reportList?type=' + this.selectedRoomType, reportedRooms)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.selectedRowKeys = []
      this.$message.success('上报成功')
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
