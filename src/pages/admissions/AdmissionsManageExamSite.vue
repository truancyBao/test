<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsHome')"
        sub-title="管理各个考点信息"
        title="考点管理"
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
          @confirm="deleteExamSiteBatch"
          @cancel="cancel"
        >
          <a-button type="danger" :disabled="!hasSelected">批量删除考点</a-button>
        </a-popconfirm>
        <a-button class="header-button" @click="showAddDrawer">添加考点</a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="examSiteInfos"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      @change="handleTableChange"
      :pagination="pagination"
    >
      <span slot="operation" slot-scope="text, record">
        <a @click="showEditDrawer(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确认删除?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="deleteExamSite(record.id)"
          @cancel="cancel"
        >
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-drawer
      title="添加考点"
      placement="right"
      width="30%"
      :visible="addDrawerVisible"
      @close="closeAddDrawer"
    >
      <a-form :form="addExamSiteForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
        <a-form-item label="考点名">
          <a-input type="text" v-model="addExamSiteForm.name"></a-input>
        </a-form-item>
        <a-form-item label="考点描述">
          <a-input type="text" v-model="addExamSiteForm.description"></a-input>
        </a-form-item>
        <a-form-item label="地区">
          <a-select style="width: 33%" v-model="selectArea.province" placeholder="省份" @change="getCity">
            <a-select-option v-for="item in provinceList" :key="item.province" :value="item.province">
              {{ item.province }}
            </a-select-option>
          </a-select>
          <a-select style="width: 33%" v-model="selectArea.city" placeholder="城市" @change="getArea">
            <a-select-option v-for="item in cityList" :key="item.city">{{ item.city }}</a-select-option>
          </a-select>
          <a-select style="width: 33%" v-model="addExamSiteForm.areaId" placeholder="区域">
            <a-select-option v-for="item in areaList" :key="item.id">{{ item.area }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="详细地址">
          <a-input type="text" v-model="addExamSiteForm.position"></a-input>
        </a-form-item>
        <a-form-item label="最大考场数">
          <a-input type="text" v-model="addExamSiteForm.maxRoom"></a-input>
        </a-form-item>
        <div style="text-align: center">
          <a-space :size="50">
            <a-button type="primary" @click="addExamSite">添加</a-button>
            <a-button type="primary" @click="resetExamSiteForm">重置</a-button>
          </a-space>
        </div>
      </a-form>
    </a-drawer>

    <a-drawer
      title="修改考点"
      placement="right"
      width="30%"
      :visible="editDrawerVisible"
      @close="closeEditDrawer"
    >
      <a-form :form="editExamSiteForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
        <a-form-item label="考点名">
          <a-input type="text" v-model="editExamSiteForm.name"></a-input>
        </a-form-item>
        <a-form-item label="考点描述">
          <a-input type="text" v-model="editExamSiteForm.description"></a-input>
        </a-form-item>
        <a-form-item label="地区">
          <a-select style="width: 33%" v-model="selectArea.province" placeholder="省份" @change="getCity">
            <a-select-option v-for="item in provinceList" :key="item.province" :value="item.province">
              {{ item.province }}
            </a-select-option>
          </a-select>
          <a-select style="width: 33%" v-model="selectArea.city" placeholder="城市" @change="getArea">
            <a-select-option v-for="item in cityList" :key="item.city">{{ item.city }}</a-select-option>
          </a-select>
          <a-select style="width: 33%" v-model="editExamSiteForm.areaId" placeholder="区域">
            <a-select-option v-for="item in areaList" :key="item.id">{{ item.area }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="详细地址">
          <a-input type="text" v-model="editExamSiteForm.position"></a-input>
        </a-form-item>
        <a-form-item label="最大考场数">
          <a-input type="text" v-model="editExamSiteForm.maxRoom"></a-input>
        </a-form-item>
        <div style="text-align: center">
          <a-space :size="50">
            <a-button type="primary" @click="editExamSite">修改</a-button>
            <a-button type="primary" @click="resetExamSiteForm">重置</a-button>
          </a-space>
        </div>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  {
    title: '考点名称',
    dataIndex: 'name',
    width: '12%',
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '考点描述',
    dataIndex: 'description',
    width: '20%',
    scopedSlots: {customRender: 'description'}
  },
  {
    title: '考点所在区域',
    dataIndex: 'areaName',
    width: '15%',
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
    width: '10%',
    scopedSlots: {customRender: 'maxRoom'}
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '15%',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  name: 'AdmissionsManageExamSite',
  data () {
    return {
      addDrawerVisible: false,
      editDrawerVisible: false,
      examSiteInfos: [],
      addExamSiteForm: {},
      editExamSiteForm: {},
      provinceList: [],
      cityList: [],
      areaList: [],
      selectArea: {},
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
    this.getExamSiteList()
    this.getProvince()
  },
  methods: {
    showAddDrawer () {
      this.addDrawerVisible = true
    },
    closeAddDrawer () {
      this.addDrawerVisible = false
    },
    showEditDrawer (examSite) {
      this.editDrawerVisible = true
      this.editExamSiteForm = examSite
      this.editExamSiteForm.gmtCreate = null
      this.editExamSiteForm.gmtUpdate = null
    },
    closeEditDrawer () {
      this.editDrawerVisible = false
    },
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
      this.getExamSiteList()
    },
    // 分页获取考点列表
    async getExamSiteList () {
      const {data: res} = await this.$axios.get(`examPlace/get/${this.queryParam.page}/${this.queryParam.size}`)
      if (res.code === 10000) {
        this.pagination.total = res.data.total
        this.examSiteInfos = res.data.page
        this.$message.success('获取考点信息成功')
      } else {
        this.$message.error('获取考点信息失败')
      }
    },
    // 获取省列表
    async getProvince () {
      const {data: res} = await this.$http.get('area/provinceList')
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.provinceList = res.data
    },
    // 获取市列表
    async getCity () {
      const {data: res} = await this.$http.get('area/cityList?province=' + this.selectArea.province)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.cityList = res.data
    },
    // 获取区域列表
    async getArea () {
      const {data: res} = await this.$http.get('area/areaList?province=' + this.selectArea.province + '&city=' + this.selectArea.city)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.areaList = res.data
    },
    // 添加考点
    async addExamSite () {
      const {data: res} = await this.$http.post('examPlace/save', this.addExamSiteForm)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      return this.$message.success('添加成功')
    },
    // 重置添加考点信息
    resetExamSiteForm () {
      this.selectArea = {}
      this.addExamSiteForm = {}
      this.editExamSiteForm = {}
    },
    // 修改考点信息
    async editExamSite () {
      const {data: res} = await this.$http.put('examPlace/update', this.editExamSiteForm)
      if (res.code !== 10000) {
        return this.$message.info(res.data)
      }
      return this.$message.info('修改成功')
    },
    // 删除考点
    async deleteExamSite (id) {
      const {data: res} = await this.$http.delete('examPlace/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      await this.getExamSiteList()
      return this.$message.success('删除成功')
    },
    // 批量删除考点
    async deleteExamSiteBatch () {
      const idList = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        idList.push(this.examSiteInfos[this.selectedRowKeys[i]].id)
      }
      const {data: res} = await this.$http.post('examPlace/deleteBatch', idList)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.selectedRowKeys = []
      await this.getExamSiteList()
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
