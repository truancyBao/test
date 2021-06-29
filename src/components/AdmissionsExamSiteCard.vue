<template>
  <div class="exam-site-card">
    <div class="exam-site-card-header">
      <h1>{{ examSiteName }}</h1>
    </div>
    <hr color="#eeeeee" />
    <div class="exam-site-card-content">
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="分配文科考生人数">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.liberalStudentAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="分配理科考生人数">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.scienceStudentAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="分配文科考室数量">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.liberalRoomAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="最小文科考室编码">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.liberalRoomNumberMin"
          />
        </a-form-model-item>
        <a-form-model-item label="分配理科考室数量">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.scienceRoomAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="最小理科考室编码">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.scienceRoomNumberMin"
          />
        </a-form-model-item>
        <a-form-model-item label="分配特殊考室数量">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.specialRoomAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="分配备用考室数量">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.standbyRoomAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="分配监考人员数量">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.invigilatorAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="分配男监考数量">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.invigilatorManAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="分配女监考数量">
          <a-input-number
            :min="0"
            :disabled="disabled"
            style="width: 80%"
            v-model="form.invigilatorWomanAllocatedNumber"
          />
        </a-form-model-item>
        <a-form-model-item label="开始时间">
          <a-date-picker
            :disabled="disabled"
            v-model="form.timeStart"
            value-format="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="结束时间">
          <a-date-picker
            :disabled="disabled"
            v-model="form.timeEnd"
            value-format="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-textarea :disabled="disabled" v-model="form.remark" auto-size />
        </a-form-model-item>
        <a-form-model-item class="button-group">
          <a-space>
            <a-button @click="modify">编辑</a-button>
            <a-button @click="arrange" type="primary">分配</a-button>
          </a-space>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdmissionsExamSiteCard',
  props: ['examId', 'examName', 'examSiteId', 'examSiteName'],
  data () {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      disabled: true,
      form: {
        type: '',
        liberalStudentAllocatedNumber: 0,
        scienceStudentAllocatedNumber: 0,
        liberalRoomAllocatedNumber: 0,
        liberalRoomNumberMin: 0,
        scienceRoomAllocatedNumber: 0,
        scienceRoomNumberMin: 0,
        specialRoomAllocatedNumber: 0,
        standbyRoomAllocatedNumber: 0,
        invigilatorAllocatedNumber: 0,
        invigilatorManAllocatedNumber: 0,
        invigilatorWomanAllocatedNumber: 0,
        otherStaffsAllocatedNumber: 0,
        timeStart: null,
        timeEnd: null,
        remark: ''
      }
    }
  },
  methods: {
    changeType (e) {
      this.form.type = e.target.value
    },
    modify () {
      this.disabled = false
    },
    async arrange () {
      const taskInfo = {
        examinationId: this.examId,
        examinationName: this.examName,
        examPlaceId: this.examSiteId,
        timeStart: this.form.timeStart,
        timeEnd: this.form.timeEnd,
        liberalStudentAllocatedNumber: this.form.liberalStudentAllocatedNumber,
        scienceStudentAllocatedNumber: this.form.scienceStudentAllocatedNumber,
        liberalRoomAllocatedNumber: this.form.liberalRoomAllocatedNumber,
        liberalRoomNumberMin: this.form.liberalRoomNumberMin,
        scienceRoomAllocatedNumber: this.form.scienceRoomAllocatedNumber,
        scienceRoomNumberMin: this.form.scienceRoomNumberMin,
        specialRoomAllocatedNumber: this.form.specialRoomAllocatedNumber,
        standbyRoomAllocatedNumber: this.form.standbyRoomAllocatedNumber,
        invigilatorAllocatedNumber: this.form.invigilatorAllocatedNumber,
        invigilatorManAllocatedNumber: this.form.invigilatorManAllocatedNumber,
        invigilatorWomanAllocatedNumber: this.form.invigilatorWomanAllocatedNumber,
        otherStaffsAllocatedNumber: this.form.otherStaffsAllocatedNumber,
        remark: this.form.remark
      }
      const { data: res } = await this.$axios.post('examinationTaskAllocated/allocate', taskInfo)
      if (res.code === 10000) {
        this.$message.success('分配成功')
        this.disabled = true
      } else {
        this.$message.error(res.data)
      }
    }
  }
}
</script>

<style scoped>
.exam-site-card {
  background-color: #ffffff;
  width: calc(33% - 4px);
  padding: 16px 24px;
  margin: 6px 0;
  border-radius: 4px;
}

h1 {
  font-weight: bold;
  font-size: 20px;
}

.exam-site-card-content {
  padding: 6px 0;
}

.button-group {
  float: right;
}
</style>
