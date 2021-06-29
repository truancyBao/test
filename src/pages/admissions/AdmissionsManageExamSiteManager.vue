<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsHome')"
        sub-title="查看各个考点的管理员"
        title="考点管理员"
      />
      <div class="operation-bar">
        <span>
          <template v-if="hasSelected">
            {{ `已选 ${selectedRowKeys.length} 项` }}
          </template>
        </span>
        <a-popconfirm
          title="确认删除?"
          ok-text="确认"
          cancel-text="取消"
          :disabled="!hasSelected"
          @confirm="deleteExamSiteManagerBatch"
          @cancel="cancel"
        >
          <a-button type="danger" :disabled="!hasSelected">批量删除</a-button>
        </a-popconfirm>
        <a-button class="header-button" @click="showAddDrawer">添加考点管理员</a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="examSiteManagerInfos"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      @change="handleTableChange"
      :pagination="pagination"
    >
      <span slot="operation" slot-scope="text, record">
        <a @click="showResetPasswordModal(record.id)">重置密码</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确认删除?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="deleteExamSiteManager(record.id)"
          @cancel="cancel"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal
      title="重置密码"
      :visible="resetPasswordVisible"
      :confirm-loading="confirmLoading"
      @ok="resetPassword"
      @cancel="handleCancel"
    >
      <a-input placeholder="请输入密码" v-model="password.password"></a-input>
    </a-modal>

    <a-drawer
      title="添加考点管理员"
      placement="right"
      width="30%"
      :visible="addDrawerVisible"
      @close="closeAddDrawer"
    >
      <a-form :form="addManagerForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-form-item label="邮箱">
          <a-input v-model="addManagerForm.email" placeholder="请输入邮箱"></a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-model="addManagerForm.password" placeholder="请输入密码"></a-input>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model="addManagerForm.name" placeholder="请输入姓名"></a-input>
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model="addManagerForm.gender">
            <a-radio value="男">男</a-radio>
            <a-radio value="女">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker v-model="addManagerForm.birth"></a-date-picker>
        </a-form-item>
        <a-form-item label="号码">
          <a-input v-model="addManagerForm.phone" placeholder="请输入手机号码"></a-input>
        </a-form-item>
        <a-form-item label="考点">
          <a-select v-model="addManagerForm.examPlaceId">
            <a-select-option v-for="item in examSiteInfos" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <div style="text-align: center">
          <a-space :size="50">
            <a-button type="primary" @click="addExamSiteManager">添加</a-button>
            <a-button type="primary" @click="resetAddManagerForm">重置</a-button>
          </a-space>
        </div>
      </a-form>
    </a-drawer>
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
    title: '考点',
    dataIndex: 'examPlaceName',
    scopedSlots: {customRender: 'examSite'}
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    scopedSlots: {customRender: 'email'}
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    scopedSlots: {customRender: 'phone'}
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '20%',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  name: 'AdmissionsManageExamSiteManager',
  data () {
    return {
      examSiteManagerInfos: [],
      examSiteInfos: [],
      addManagerForm: {},
      editManagerForm: {},
      addDrawerVisible: false,
      resetPasswordVisible: false,
      password: {
        id: '',
        password: ''
      },
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
    this.getExamSiteManagerList()
  },
  methods: {
    // 页码变化
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getExamSiteManagerList()
    },
    // 选择变化
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    showAddDrawer () {
      this.addDrawerVisible = true
      this.getExamSite()
    },
    closeAddDrawer () {
      this.addDrawerVisible = false
    },
    showResetPasswordModal (id) {
      this.resetPasswordVisible = true
      this.password.id = id
    },
    handleCancel () {
      this.resetPasswordVisible = false
    },
    // 获取所有考点
    async getExamSite () {
      const {data: res} = await this.$http.get('examPlace/list')
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.examSiteInfos = res.data
      return this.$message.success('获取考点列表成功')
    },
    // 分页获取考点管理员
    async getExamSiteManagerList () {
      const {data: res} = await this.$axios.get(`examPlaceAdmin/get/${this.queryParam.page}/${this.queryParam.size}`)
      if (res.code === 10000) {
        this.pagination.total = res.data.total
        this.examSiteManagerInfos = res.data.page
        this.$message.success('获取考点管理员信息成功')
      } else {
        this.$message.error('获取考点管理信息失败')
      }
    },
    // 添加考点管理员信息
    async addExamSiteManager () {
      const {data: res} = await this.$http.post('examPlaceAdmin/save', this.addManagerForm)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      return this.$message.success('添加成功')
    },
    // 重置输入框
    resetAddManagerForm () {
      this.addManagerForm = {}
    },
    // 修改考点管理员信息
    async updateExamSiteManager () {
      const {data: res} = await this.$http.put('examPlaceAdmin/update', this.editManagerForm)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      return this.$message.success('修改成功')
    },
    // 重置密码
    async resetPassword () {
      const {data: res} = await this.$http.patch('examPlaceAdmin/reset', this.password)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      return this.$message.success('密码重置成功')
    },
    // 删除
    async deleteExamSiteManager (id) {
      const {data: res} = await this.$http.delete('examPlaceAdmin/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      await this.getExamSiteManagerList()
      return this.$message.success('删除成功')
    },
    // 批量删除
    async deleteExamSiteManagerBatch () {
      if (this.selectedRowKeys.length === 0) {
        return this.$message.info('列表为空')
      }
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.examSiteManagerInfos[this.selectedRowKeys[i]].id)
      }
      const {data: res} = await this.$http.post('examPlaceAdmin/deleteBatch', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.selectedRowKeys = []
      await this.getExamSiteManagerList()
      return this.$message.success('删除成功')
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
