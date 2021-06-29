<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsHome')"
        sub-title="查看所有教师信息"
        title="所有教师"
      />
      <div style="margin-top: 1%; margin-right: 2%">
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
          @confirm="deleteTeacherList"
          @cancel="cancel"
        >
          <a-button type="danger" :disabled="!hasSelected">批量删除</a-button>
        </a-popconfirm>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="teacherInfos"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <span slot="operation" slot-scope="text, record">
        <a-popconfirm
          title="确认删除?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="deleteTeacher(record.id)"
          @cancel="cancel"
        >
          <a>删除</a>
        </a-popconfirm>
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
    title: '考点',
    dataIndex: 'examPlaceName',
    scopedSlots: {customRender: 'examPlaceName'}
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    scopedSlots: {customRender: 'roleName'}
  },
  {
    title: '电话',
    dataIndex: 'phone',
    scopedSlots: {customRender: 'phone'}
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    scopedSlots: {customRender: 'email'}
  },
  {
    title: '地址',
    dataIndex: 'position',
    scopedSlots: {customRender: 'position'}
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '10%',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  name: 'AdmissionsManageTeacher',
  data () {
    return {
      teacherInfos: [],
      current: 1,
      pageSize: 10,
      total: 1,
      columns,
      editingKey: '',
      selectedRowKeys: [],
      loading: false,
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
    this.getTeacherList()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    changePage (current) {
      this.current = current
      this.getTeacherList()
    },
    // 页码变化
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getTeacherList()
    },
    // 获取教师信息
    async getTeacherList () {
      const {data: res} = await this.$axios.get(
        `examPlaceInvigilator/get/${this.pagination.current}/${this.pagination.pageSize}`
      )
      if (res.code === 10000) {
        this.teacherInfos = res.data.page
        this.pagination.total = res.data.total
        this.$message.success('获取教师信息成功')
      } else {
        this.$message.error(res.data)
      }
    },
    // 删除教师
    async deleteTeacher (id) {
      const {data: res} = await this.$http.delete('examPlaceInvigilator/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      await this.getTeacherList()
      this.$message.success('删除成功')
    },
    // 删除教师列表
    async deleteTeacherList () {
      let idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.teacherInfos[this.selectedRowKeys[i]].id)
      }
      const {data: res} = await this.$http.post('examPlaceInvigilator/remove', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.selectedRowKeys = []
      await this.getTeacherList()
      this.$message.success('删除成功')
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
