<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="管理本校楼栋信息"
        title="本校楼栋"
      />
      <div class="operation-bar">
        <span>
          <template v-if="hasSelected">
            {{ `已选 ${selectedRowKeys.length} 项` }}
          </template>
        </span>
        <a-popconfirm
          title="确认删除？"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteBuildingList"
          @cancel="cancel"
        >
          <a-button
            :disabled="!hasSelected"
            :loading="loading"
            class="header-button"
            type="danger"
          >
            批量删除
          </a-button>
        </a-popconfirm>
        <a-button class="button" @click="showAddDraw()">
          添加楼栋
        </a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="buildingList"
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
          @confirm="deleteBuilding(record.id)"
          @cancel="cancel"
        >
          <a href="">删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-drawer
      title="添加楼栋"
      :width="360"
      :visible="addFormVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="closeAddDraw"
    >
      <a-form :form="addForm">
        <a-form-item label="楼栋名" prob="name">
          <a-input style="width: 50%" v-model="addForm.name"></a-input>
        </a-form-item>
        <a-form-item label="楼层数" prob="floorNumber">
          <a-input style="width: 50%" v-model="addForm.floorNumber"></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" @click="addBuilding">
            添加
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>

    <a-drawer
      title="修改楼栋"
      :width="360"
      :visible="editFormVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="closeEditDraw"
    >
      <a-form :form="editForm">
        <a-form-item label="楼栋id" prob="id">
          <a-input style="width: 50%" v-model="editForm.id" disabled="true"></a-input>
        </a-form-item>
        <a-form-item label="楼栋名" prob="name">
          <a-input style="width: 50%" v-model="editForm.name"></a-input>
        </a-form-item>
        <a-form-item label="楼层数" prob="floorNumber">
          <a-input style="width: 50%" v-model="editForm.floorNumber"></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" @click="updateBuilding">
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
    title: '楼栋id',
    dataIndex: 'id',
    scopedSlots: {customRender: 'id'}
  },
  {
    title: '楼栋名',
    dataIndex: 'name',
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '楼层数',
    dataIndex: 'floorNumber',
    scopedSlots: {customRender: 'floorNumber'}
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '15%',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  name: 'SchoolManageBuilding',
  data () {
    return {
      buildingList: [],
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
      addFormVisible: false,
      editFormVisible: false,
      allocatedTask: [],
      selectedExam: null,
      columns,
      editingKey: '',
      selectedRowKeys: [],
      loading: false
    }
  },
  created () {
    this.getExamPlaceBuilding()
    this.getAllocatedTask()
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
      this.getExamPlace()
    },
    // 选择变化
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 选择考试
    taskChange (value) {
      this.selectedExam = value
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
    // 获取当前考点楼栋
    async getExamPlaceBuilding () {
      const {data: res} = await this.$http.get(`examPlaceBuilding/listByExamPlace`)
      if (res.code !== 10000) {
        return this.$message.error('获取楼栋失败,由于' + res.data)
      }
      this.buildingList = res.data
      return this.$message.success('获取楼栋成功')
    },
    // 添加楼栋
    async addBuilding () {
      const addInfo = {
        name: this.addForm.name,
        floorNumber: this.addForm.floorNumber
      }
      const {data: res} = await this.$http.post('examPlaceBuilding/save', addInfo)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      await this.getExamPlaceBuilding()
      return this.$message.success('添加成功')
    },
    // 删除楼栋
    async deleteBuilding (id) {
      const {data: res} = await this.$http.delete('examPlaceBuilding/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.$message.success('删除成功')
      this.selectedRowKeys = []
      await this.getExamPlaceBuilding()
    },
    // 批量删除
    async deleteBuildingList () {
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.buildingList[this.selectedRowKeys[i] + (this.pagination.current - 1) * this.pagination.pageSize].id)
      }
      const {data: res} = await this.$http.post('examPlaceBuilding/deleteBatch', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.$message.success('删除成功')
      this.selectedRowKeys = []
      await this.getExamPlaceBuilding()
    },
    // 修改楼栋
    async updateBuilding () {
      const editInfo = {
        id: this.editForm.id,
        name: this.editForm.name,
        floorNumber: this.editForm.floorNumber
      }
      const {data: res} = await this.$http.put('examPlaceBuilding/update', editInfo)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.$message.success('修改成功')
      await this.getExamPlaceBuilding()
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
