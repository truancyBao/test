<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/schoolHome')"
        sub-title="新建校内考试"
        title="校内考试"
      />
    </div>

    <a-form-model
      :label-col="labelCol"
      :model="form"
      :rules="rules"
      :wrapper-col="wrapperCol"
      class="form"
      ref="ruleForm"
    >
      <a-form-model-item
        label="考试名称"
        prop="examName"
        ref="examName"
        required
      >
        <a-input
          @blur="
            () => {
              $refs.examName.onFieldBlur();
            }
          "
          style="width: 40%"
          v-model="form.examName"
        />
      </a-form-model-item>

      <a-form-model-item
        label="发起人"
        prop="initiator"
        ref="initiator"
        required
      >
        <a-input
          @blur="
            () => {
              $refs.initiator.onFieldBlur();
            }
          "
          style="width: 40%"
          v-model="form.initiator"
        />
      </a-form-model-item>

      <a-form-model-item label="考生数量" required>
        <a-input-number
          min="0"
          placeholder="理科考生数"
          style="margin-right:12px; width:160px"
          v-model="form.scienceStudentNumber"
        />
        <a-input-number
          min="0"
          placeholder="文科考生数"
          style="margin-right:12px; width:160px"
          v-model="form.liberalStudentNumber"
        />
      </a-form-model-item>

      <a-form-model-item label="考场数量" required>
        <a-input-number
          min="0"
          placeholder="理科考场数"
          style="margin-right:12px; width:160px"
          v-model="form.scienceExamRoomNumber"
        />
        <a-input-number
          min="0"
          placeholder="文科考场数"
          style="margin-right:12px; width:160px"
          v-model="form.liberalExamRoomNumber"
        />
      </a-form-model-item>

      <a-form-model-item label="起止日期" required>
        <a-date-picker
          @change="onChange"
          placeholder="开始日期"
          style="margin-right:12px; width:160px"
          v-model="form.startDate"
        />
        <a-date-picker
          @change="onChange"
          placeholder="结束日期"
          style="margin-right:12px; width:160px"
          v-model="form.endDate"
        />
      </a-form-model-item>

      <a-form-model-item
        :key="exam.key"
        :label="'考试时间'"
        :prop="'exams.' + index + '.value'"
        v-bind="index === 0 ? formItemLayout : {}"
        v-for="(exam, index) in form.exams"
      >
        <a-input
          placeholder="考试科目"
          style="width: 332px"
          v-model="exam.value"
        />
        <a-icon
          :disabled="form.exams.length === 0"
          @click="removeExam(exam)"
          class="dynamic-delete-button"
          type="minus-circle-o"
          v-if="form.exams.length > 0"
        />
        <div>
          <a-space>
            <a-date-picker @change="onChange" placeholder="考试日期"/>
            <a-time-picker
              format="h:mm a"
              placeholder="开始时间"
              use12-hours
              v-model="form.startDate"
            />
            <a-time-picker
              format="h:mm a"
              placeholder="开始时间"
              use12-hours
              v-model="form.startDate"
            />
          </a-space>
        </div>
      </a-form-model-item>
      <a-form-model-item v-bind="formItemLayoutWithOutLabel">
        <a-button @click="addExam" style="width: 50%" type="dashed">
          <a-icon type="plus"/>
          添加科目
        </a-button>
      </a-form-model-item>

      <a-form-model-item v-bind="formItemLayoutWithOutLabel">
        <a-button @click="submitForm('form')" html-type="submit" type="primary">
          新建考试
        </a-button>
        <a-button @click="resetForm('form')" style="margin-left: 12px">
          重置信息
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'SchoolAddExam',
  data () {
    return {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      formItemLayout: {
        labelCol: {
          xs: {span: 24},
          sm: {span: 4}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 20}
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: {span: 24, offset: 0},
          sm: {span: 20, offset: 4}
        }
      },
      form: {
        examName: '',
        initiator: '',
        scienceStudentNumber: null,
        liberalStudentNumber: null,
        scienceExamRoomNumber: null,
        liberalExamRoomNumber: null,
        startDate: '',
        endDate: '',
        exams: []
      },
      rules: {
        examName: [
          {
            required: true,
            message: '请输入考试名称',
            trigger: 'blur'
          }
        ],
        initiator: [
          {
            required: true,
            message: '请输入发起人',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm () {
      this.$refs.ruleForm.resetFields()
    },

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    removeExam (item) {
      let index = this.form.exams.indexOf(item)
      if (index !== -1) {
        this.form.exams.splice(index, 1)
      }
    },

    addExam () {
      this.form.exams.push({
        value: '',
        key: Date.now()
      })
    }
  }
}
</script>

<style scoped>
  .form {
    margin-top: 12px;
  }

  .dynamic-delete-button {
    margin-left: 105px;
    cursor: pointer;
    font-size: 18px;
    color: #b4b4b4;
    transition: all 0.3s;
  }

  .dynamic-delete-button:hover {
    color: #767676;
  }

  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
