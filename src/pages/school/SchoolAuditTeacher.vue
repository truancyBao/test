<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="审核教师注册申请"
        title="教师审核"
      />
      <div class="operation-bar">
        <span>
          <template v-if="hasSelected">
            {{ `已选 ${selectedRowKeys.length} 项` }}
          </template>
        </span>
        <a-button
          :disabled="!hasSelected"
          :loading="loading"
          @click="start"
          class="header-button"
          type="primary"
        >
          批量通过
        </a-button>
        <a-button
          :disabled="!hasSelected"
          :loading="loading"
          @click="start"
          class="header-button"
          type="danger"
        >
          批量不通过
        </a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="data"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :pagination="this.Common.paginationProps"
    >
      <span slot="operation">
        <a>通过</a>
        <a-divider type="vertical"/>
        <a>不通过</a>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: '10%',
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
    title: '操作',
    dataIndex: 'operation',
    width: '20%',
    scopedSlots: {customRender: 'operation'}
  }
]

const data = []
for (let i = 0; i < 20; i++) {
  data.push({
    key: i.toString(),
    name: `张三`,
    gender: `男`,
    grade: `高一`,
    subject: `语文`,
    phone: `12345678910`
  })
}

export default {
  name: 'SchoolAuditTeacher',
  data () {
    this.cacheData = data.map(item => ({...item}))
    return {
      data,
      columns,
      editingKey: '',
      selectedRowKeys: [],
      loading: false
    }
  },

  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
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
