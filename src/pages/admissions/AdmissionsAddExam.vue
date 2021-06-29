<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsManageExam/addBasic')"
        sub-title="填写新建考试信息"
        title="新建考试"
      />
    </div>

    <template>
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
      </a-steps>
      <a-row v-if="current===0" style="margin-top: 5%" type="flex" justify="center">
        <a-form-model
          :label-col="{span: 8}"
          :wrapper-col="{span: 16}"
          :model="form"
        >
          <a-form-model-item
            v-for="item in selectedStudentKind"
            :key="item"
            :label="item"
          >
            <a-input-number style="width: 100%" :placeholder="item"></a-input-number>
          </a-form-model-item>
        </a-form-model>
      </a-row>
      <a-row v-if="current===1" style="margin-top: 5%" type="flex" justify="center">
        <a-form-model
          :label-col="{span: 8}"
          :wrapper-col="{span: 16}"
          :model="form">
          <a-form-model-item
            v-for="item in selectedRole"
            :key="item"
            :label="item"
          >
            <a-input-number style="width: 100%" :placeholder="item"></a-input-number>
          </a-form-model-item>
        </a-form-model>
      </a-row>
      <a-row v-if="current===2" style="margin-top: 5%" type="flex" justify="center">
        <a-form-model
          :label-col="{span: 8}"
          :wrapper-col="{span: 16}"
          :model="form">
          <a-form-model-item
            v-for="item in selectedRoomKind"
            :key="item"
            :label="item"
          >
            <a-input-number style="width: 100%" :placeholder="item"></a-input-number>
          </a-form-model-item>
        </a-form-model>
      </a-row>
      <a-row v-if="current===3" style="margin-top: 5%" type="flex" justify="center">
        <a-form-model
          :label-col="{span: 4}"
          :wrapper-col="{span: 20}"
        >
          <a-form-model-item label="起止日期">
            <a-date-picker
              placeholder="开始日期"
              style="width: 44%; margin-right: 2%"
              v-model="form.startTime"
              value-format="YYYY-MM-DD"
            />
            <a-date-picker
              placeholder="结束日期"
              style="width: 44%"
              v-model="form.endTime"
              value-format="YYYY-MM-DD"
            />
          </a-form-model-item>

          <a-form-model-item
            :key="exam.key"
            :label="'考试科目'"
            :prop="'exams.' + index + '.value'"
            v-bind="index === 0 ? formItemLayout : {}"
            v-for="(exam, index) in form.exams"
          >
            <a-input
              placeholder="考试科目"
              style="width: 150px"
              v-model="exam.name"
            />
            <a-icon
              :disabled="form.exams.length === 0"
              @click="removeExamSubject(exam)"
              class="dynamic-delete-button"
              type="minus-circle-o"
              v-if="form.exams.length > 0"
            />
            <div>
              <a-space>
                <a-date-picker
                  placeholder="考试日期"
                  value-format="YYYY-MM-DD"
                  v-model="exam.date"
                  style="width: 150px"
                />
                <a-time-picker
                  placeholder="开始时间"
                  value-format="HH:mm:ss"
                  v-model="exam.startTime"
                />
                <a-time-picker
                  placeholder="结束时间"
                  value-format="HH:mm:ss"
                  v-model="exam.endTime"
                />
              </a-space>
            </div>
          </a-form-model-item>
          <a-form-model-item v-bind="formItemLayoutWithOutLabel">
            <a-button @click="addExamSubject" style="width: 100%" type="dashed">
              <a-icon type="plus"/>
              添加科目
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-row>
      <a-row type="flex" justify="center">
        <a-space>
          <a-button type="default" @click="previousStep()">上一步</a-button>
          <a-button type="primary" @click="nextStep()" v-if="current!==3">下一步</a-button>
          <a-button type="primary" @click="addExam()" v-if="current===3">添加考试</a-button>
        </a-space>
      </a-row>
    </template>

    <a-form-model
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="form"
      :rules="rules"
      class="form"
      ref="form"
      v-if="false"
    >
      <a-form-model-item label="学生数量">
        <div style="display: flex; flex-wrap: wrap; width: 51%">
          <a-input-number
            v-for="item in studentKindInfos"
            :key="item.key"
            min=0
            :placeholder="item.name"
            style="flex-basis: 47%; margin-right: 3%; margin-bottom: 3%"
            v-model="item.value"
          ></a-input-number>
        </div>
      </a-form-model-item>

      <a-form-model-item label="人员数量">
        <div style="display: flex; flex-wrap: wrap; width: 51%">
          <a-input-number
            v-for="item in roleInfos"
            :key="item.key"
            min=0
            :placeholder="item.name"
            style="flex-basis: 47%; margin-right: 3%; margin-bottom: 3%"
            v-model="item.value"
          ></a-input-number>
        </div>
      </a-form-model-item>

      <a-form-model-item label="考场数量">
        <a-form-model-item
          style="margin: 0"
        >
          <div style="display: flex; flex-wrap: wrap; width: 51%">
            <a-input-number
              v-for="item in roomKindInfos"
              :key="item.key"
              min="0"
              :placeholder="item.name"
              style="flex-basis: 47%; margin-right: 3%; margin-bottom: 3%"
              v-model="item.value"
            ></a-input-number>
          </div>
        </a-form-model-item>
      </a-form-model-item>

      <a-form-model-item label="参与考点数">
        <a-input-number
          min="0"
          placeholder="参与考点数"
          style="width: 50%; margin-right: 2%"
          v-model="form.examPlaceNumber"
        ></a-input-number>
      </a-form-model-item>

      <a-form-model-item label="起止日期">
        <a-date-picker
          placeholder="开始日期"
          style="width: 24%; margin-right: 2%"
          v-model="form.startTime"
          value-format="YYYY-MM-DD"
        />
        <a-date-picker
          placeholder="结束日期"
          style="width: 24%"
          v-model="form.endTime"
          value-format="YYYY-MM-DD"
        />
      </a-form-model-item>

      <a-form-model-item
        :key="exam.key"
        :label="'考试科目'"
        :prop="'exams.' + index + '.value'"
        v-bind="index === 0 ? formItemLayout : {}"
        v-for="(exam, index) in form.exams"
      >
        <a-input
          placeholder="考试科目"
          style="width: 50%"
          v-model="exam.name"
        />
        <a-icon
          :disabled="form.exams.length === 0"
          @click="removeExamSubject(exam)"
          class="dynamic-delete-button"
          type="minus-circle-o"
          v-if="form.exams.length > 0"
        />
        <div>
          <a-space>
            <a-date-picker
              placeholder="考试日期"
              value-format="YYYY-MM-DD"
              v-model="exam.date"
            />
            <a-time-picker
              placeholder="开始时间"
              value-format="HH:mm:ss"
              v-model="exam.startTime"
            />
            <a-time-picker
              placeholder="结束时间"
              value-format="HH:mm:ss"
              v-model="exam.endTime"
            />
          </a-space>
        </div>
      </a-form-model-item>
      <a-form-model-item v-bind="formItemLayoutWithOutLabel">
        <a-button @click="addExamSubject" style="width: 65%" type="dashed">
          <a-icon type="plus"/>
          添加科目
        </a-button>
      </a-form-model-item>

      <a-form-model-item v-bind="formItemLayoutWithOutLabel">
        <a-space>
          <a-button @click="addExam" type="primary">
            新建考试
          </a-button>
          <a-button @click="resetForm('form')">
            重置信息
          </a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'AdmissionsAddExam',
  data () {
    return {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      formItemLayout: {
        labelCol: {span: 4},
        wrapperCol: {span: 14}
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {span: 14, offset: 4}
      },
      current: 0,
      steps: [
        {
          title: '学生信息'
        },
        {
          title: '人员信息'
        },
        {
          title: '考室信息'
        },
        {
          title: '时间信息'
        }
      ],
      examName: '',
      sponsor: '',
      form: {
        scienceExamineeNumber: null,
        liberalArtsExamineeNumber: null,
        scienceRoomNumber: null,
        liberalArtsRoomNumber: null,
        invigilatorNumber: null,
        otherStaffsNumber: null,
        specialRoomNumber: null,
        standbyRoomNumber: null,
        examPlaceNumber: null,
        startTime: '',
        endTime: '',
        exams: [
          {
            name: '语文',
            date: '',
            startTime: '08:30:00',
            endTime: '11:00:00'
          },
          {
            name: '数学',
            date: '',
            startTime: '14:30:00',
            endTime: '17:00:00'
          },
          {
            name: '英语',
            date: '',
            startTime: '08:30:00',
            endTime: '11:00:00'
          },
          {
            name: '综合',
            date: '',
            startTime: '14:30:00',
            endTime: '17:00:00'
          }
        ]
      },
      selectedRoomKind: [],
      selectedUnit: [],
      selectedRole: [],
      selectedStudentKind: [],
      roomKindInfos: [],
      unitInfos: [],
      roleInfos: [],
      studentKindInfos: []
    }
  },
  created () {
    this.examName = this.$route.query.examName
    this.sponsor = this.$route.query.sponsor
    this.selectedRoomKind = this.$route.query.roomKindsSelect
    this.selectedUnit = this.$route.query.unitsSelect
    this.selectedRole = this.$route.query.rolesSelect
    this.selectedStudentKind = this.$route.query.studentKindsSelect
    this.roomKindInfos = []
    this.unitInfos = []
    this.roleInfos = []
    this.studentKindInfos = []
    // 获取基础信息
    for (let i = 0; i < this.selectedRoomKind.length; i++) {
      let roomKindInfo = {
        name: this.selectedRoomKind[i],
        value: ''
      }
      this.roomKindInfos.push(roomKindInfo)
    }
    for (let i = 0; i < this.selectedUnit.length; i++) {
      let unitInfo = {
        name: this.selectedUnit[i],
        value: '1'
      }
      this.unitInfos.push(unitInfo)
    }
    for (let i = 0; i < this.selectedRole.length; i++) {
      let roleInfo = {
        name: this.selectedRole[i],
        value: ''
      }
      this.roleInfos.push(roleInfo)
    }
    for (let i = 0; i < this.selectedStudentKind.length; i++) {
      let studentKindInfo = {
        name: this.selectedStudentKind[i],
        value: ''
      }
      this.studentKindInfos.push(studentKindInfo)
    }
  },
  methods: {
    async addExam () {
      let addExam = {
        exam: {
          name: this.examName,
          sponsor: this.sponsor,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          scienceExamineeNumber: parseInt(this.form.scienceExamineeNumber),
          liberalArtsExamineeNumber: parseInt(this.form.liberalArtsExamineeNumber),
          invigilatorNumber: this.roleInfos[0].value,
          examPlaceNumber: this.form.examPlaceNumber
        },
        subjects: this.form.exams,
        basicInfos: {
          roomKinds: this.roomKindInfos,
          units: this.unitInfos,
          roles: this.roleInfos,
          studentKinds: this.studentKindInfos
        }
      }
      // 获取基础信息
      const {data: res} = await this.$axios.post('recordExam/save', addExam)
      if (res.code === 10000) {
        this.$message.success('发起考试成功！')
      } else {
        this.$message.error(res.data)
      }
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    removeExamSubject (item) {
      let index = this.form.exams.indexOf(item)
      if (index !== -1) {
        this.form.exams.splice(index, 1)
      }
    },
    addExamSubject () {
      this.form.exams.push({
        name: '',
        date: '',
        startTime: '',
        endTime: ''
      })
    },
    previousStep () {
      if (this.current === 0) {
        this.$router.push({
          path: 'addBasic',
          query: {
            examName: this.examName,
            sponsor: this.sponsor,
            roomKindsSelect: this.selectedRoomKind,
            unitsSelect: this.selectedUnit,
            rolesSelect: this.selectedRole,
            studentKindsSelect: this.selectedStudentKind
          }
        })
        return
      }
      this.current--
    },
    nextStep () {
      if (this.current === 3) {
        return
      }
      this.current++
    }
  }
}
</script>

<style scoped>
.form {
  margin-top: 12px;
}

.dynamic-delete-button {
  margin-left: 85px;
  cursor: pointer;
  font-size: 18px;
  color: #d9d9d9;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #ff0000;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
