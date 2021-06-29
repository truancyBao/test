<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsManageExam/exam')"
        sub-title="预览并批量生成监考证"
        title="生成监考证"
      />
      <a-button class="header-button" @click="showModal" type="primary"
      >生成监考证
      </a-button
      >
    </div>
    <a-modal
      v-model="modalVisible"
      class="card-modal"
      title="监考证批量预览"
      @ok="generateAllCard"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      width="60%"
      cancelText="取消"
      okText="批量生成"
    >
      <div class="card-content">
        <div
          class="invigilation-card"
          v-for="card in recordInfos"
          :key="card.invigilatorId"
          :id="'ic' + card.invigilatorId"
        >
          <div class="card">
            <div class="exam-name">{{ card.examinationName }}</div>
            <img :src="card.invigilatorPhoto" alt="" class="photo"/>
            <div class="name">{{ card.invigilatorName }}</div>
            <div style="font-size: 15px">
              <span v-if="card.mainInvigilator">主监考</span>
              <span v-else>副监考</span>
            </div>
            <div class="exam-site">{{ card.examPlaceName }}</div>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="visible"
      class="card-modal"
      title="监考证预览"
      @ok="generateCard"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      width="60%"
      cancelText="取消"
      okText="下载"
    >
      <div class="card-content">
        <div
          class="invigilation-card"
          :key="selectRecord.invigilatorId"
          :id="'ic' + selectRecord.invigilatorId"
        >
          <div class="card">
            <div class="exam-name">{{ selectRecord.examinationName }}</div>
            <img :src="selectRecord.invigilatorPhoto" alt="" class="photo"/>
            <div class="name">{{ selectRecord.invigilatorName }}</div>
            <div style="font-size: 15px">
              <span v-if="card.mainInvigilator">主监考</span>
              <span v-else>副监考</span>
            </div>
            <div class="exam-site">{{ selectRecord.examPlaceName }}</div>
          </div>
        </div>
      </div>
    </a-modal>
    <a-table
      :columns="columns"
      :data-source="recordInfos"
      @change="handleTableChange"
      :pagination="pagination"
    >
      <span slot="mainInvigilator" slot-scope="mainInvigilator">
        <a-tag :visible="mainInvigilator" color="green">是</a-tag>
        <a-tag :visible="!mainInvigilator">否</a-tag>
      </span>
      <span slot="operation" slot-scope="text, record">
        <a @click="showSingleModal(record)">生成监考证</a>
      </span>
    </a-table>
  </div>
</template>

<script>
import html2Canvas from 'html2canvas'

function saveFile (data, filename) {
  let saveLink = document.createElement('a')
  saveLink.href = data
  saveLink.download = filename
  let event = new MouseEvent('click')
  saveLink.dispatchEvent(event)
}

const columns = [
  {
    title: '监考人员编号',
    dataIndex: 'invigilatorId',
    scopedSlots: {customRender: 'invigilatorId'}
  },
  {
    title: '监考人员姓名',
    dataIndex: 'invigilatorName',
    scopedSlots: {customRender: 'invigilatorName'}
  },
  {
    title: '是否主监考',
    dataIndex: 'mainInvigilator',
    scopedSlots: {customRender: 'mainInvigilator'}
  },
  {
    title: '考试名',
    dataIndex: 'examinationName',
    scopedSlots: {customRender: 'examinationName'}
  },
  {
    title: '考点名',
    dataIndex: 'examPlaceName',
    scopedSlots: {customRender: 'examPlaceName'}
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'}
  }
]

export default {
  name: 'AdmissionsGenerateInvigilationCard',
  data () {
    return {
      examInfo: this.$route.query.examInfo,
      modalVisible: false,
      visible: false,
      recordInfos: [],
      imageBase64: [],
      selectRecord: {
        invigilatorName: '',
        mainInvigilator: '',
        examPlaceName: ''
      },
      columns,
      card: {
        teacherId: '教师编号',
        teacherName: '教师姓名',
        examName: '考试名称',
        examSiteName: '考点名称',
        qualification: '主监考',
        photo: '../../assets/photoBackgroud.png'
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
    this.getRecordList()
  },
  methods: {
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.getRecordList()
    },
    async getRecordList () {
      const {data: res} = await this.$axios.get(
        `examinationInvigilatorRecord/getCards/${this.pagination.current}/${this.pagination.pageSize}?examId=` + this.examInfo.id
      )
      if (res.code === 10000) {
        this.recordInfos = res.data.record
        this.pagination.total = res.data.total
        // 转化base64
        await this.imageToBase64()
        this.$message.success('获取监考证信息成功')
      } else {
        this.$message.error('获取监考证信息失败')
      }
    },
    generateAllCard () {
      for (let item in this.recordInfos) {
        let itemId = 'ic' + this.recordInfos[item].invigilatorId
        html2Canvas(document.getElementById(itemId), {}).then(canvas => {
          let dataURL = canvas.toDataURL('image/jpeg')
          saveFile(dataURL, this.recordInfos[item].invigilatorName + '.jpg')
        })
      }
    },
    generateCard () {
      let itemId = 'ic' + this.selectRecord.invigilatorId
      html2Canvas(document.getElementById(itemId), {}).then(canvas => {
        let dataURL = canvas.toDataURL('image/jpeg')
        saveFile(dataURL, this.selectRecord.invigilatorName + '.jpg')
      })
    },
    // 把所有网络图片转为base64格式
    async imageToBase64 () {
      for (let i = 0; i < this.recordInfos.length; i++) {
        let that = this
        let image = new Image()
        image.crossOrigin = ''
        image.src = this.imageBaseUrl + this.recordInfos[i].invigilatorPhoto
        image.onload = function () {
          that.recordInfos[i].invigilatorPhoto = that.$getBase64Image(image)
        }
      }
    },
    showModal () {
      this.modalVisible = true
    },
    showSingleModal (record) {
      this.visible = true
      this.selectRecord = record
    },
    handleOk () {
      this.modalVisible = false
    }
  }
}
</script>

<style scoped>
.card-content {
  height: 410px;
  overflow: scroll;
}

.invigilation-card {
  margin: 0 30px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.card {
  width: 267px;
  height: 383px;
  background: url("../../assets/invigilationCardBackground.png");
  border: 2px #bed6f0 solid;
  border-radius: 8px;
  margin: 10px;
  text-align: center;
}

.exam-name,
.exam-site {
  margin: 16px 0;
  font-size: 20px;
}

.qualification {
  font-size: 42px;
  font-weight: bold;
  width: 42px;
  margin: auto;
}

.photo {
  height: 160px;
  border-radius: 5px;
  margin: 5px auto 5px;
}

.name,
.teacher-id {
  font-size: 17px;
  margin: 10px;
}
</style>
