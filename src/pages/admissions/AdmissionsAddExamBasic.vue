<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/admissionsHome')"
        sub-title="基础信息"
        title="基础信息"
      />
    </div>
    <div>
      <a-form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="form"
        ref="form"
      >
        <a-form-item label="考试名称">
          <a-input style="width: 50%" v-model="examName"></a-input>
        </a-form-item>
        <a-form-item label="发起人">
          <a-input style="width: 50%" v-model="sponsor"></a-input>
        </a-form-item>
        <a-form-item label="考室种类">
          <a-checkbox :indeterminate="roomKindsIndeter" :checked="checkRoomKindAll" @change="selectAllRoomKind">
            全选
          </a-checkbox>
          <br/>
          <a-checkbox-group v-model="roomKindsSelect" :options="roomKinds" @change="changeRoomKind"/>
          <a-icon type="plus-circle-o" @click="showAddRoomModal"/>
        </a-form-item>
        <a-form-item label="参与单位">
          <a-checkbox :indeterminate="unitsIndeter" :checked="checkUnitsAll" @change="selectAllUnits">
            全选
          </a-checkbox>
          <br/>
          <a-checkbox-group v-model="unitsSelect" :options="units" @change="changeUnit"/>
          <a-icon type="plus-circle-o" @click="showAddUnitModal"/>
        </a-form-item>
        <a-form-item label="参与角色">
          <a-checkbox :indeterminate="rolesIndeter" :checked="checkRolesAll" @change="selectAllRoles">
            全选
          </a-checkbox>
          <br/>
          <a-checkbox-group v-model="rolesSelect" :options="roles" @change="changeRole"/>
          <a-icon type="plus-circle-o" @click="showAddRoleModal"/>
        </a-form-item>
        <a-form-item label="学生种类">
          <a-checkbox :indeterminate="studentKindsIndeter" :checked="checkStudentKindsAll" @change="selectAllStudentKinds">
            全选
          </a-checkbox>
          <br/>
          <a-checkbox-group v-model="studentKindsSelect" :options="studentKinds" @change="changeStudentKinds"/>
          <a-icon type="plus-circle-o" @click="showAddStudentKindsModal"/>
        </a-form-item>
        <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-space>
            <a-button type="primary" @click="routeToExam">下一步</a-button>
            <a-button @click="resetInfo">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <a-modal
      title="添加考室种类"
      :visible="addRoomKindVisible"
      @ok="addRoomKind"
      @cancel="handleCancel"
    >
      <a-input v-model="optionInfo" placeholder="请输入选项名"></a-input>
    </a-modal>
    <a-modal
      title="添加单位种类"
      :visible="addUnitVisible"
      @ok="addUnit"
      @cancel="handleCancel"
    >
      <a-input v-model="optionInfo" placeholder="请输入选项名"></a-input>
    </a-modal>
    <a-modal
      title="添加角色种类"
      :visible="addRoleVisible"
      @ok="addRole"
      @cancel="handleCancel"
    >
      <a-input v-model="optionInfo" placeholder="请输入选项名"></a-input>
    </a-modal>
    <a-modal
      title="添加考生种类"
      :visible="addStudentKindsVisible"
      @ok="addStudentKind"
      @cancel="handleCancel"
    >
      <a-input v-model="optionInfo" placeholder="请输入选项名"></a-input>
    </a-modal>
  </div>
</template>

<script>

const roomKinds = ['标准考室', '隔离考室', '备用考室']
const units = ['招生办', '学校', '派出所', '交通部门']
const roles = ['监考人员', '保安', '交警']
const studentKinds = ['文科考生', '理科考生']

export default {
  name: 'AdmissionsAddExamBasic',
  data () {
    return {
      roomKinds,
      units,
      roles,
      studentKinds,
      examName: '',
      sponsor: '',
      roomKindsSelect: ['标准考室'],
      roomKindsIndeter: false,
      checkRoomKindAll: false,
      unitsSelect: ['招生办', '学校'],
      unitsIndeter: false,
      checkUnitsAll: false,
      rolesSelect: ['监考人员'],
      rolesIndeter: false,
      checkRolesAll: false,
      studentKindsSelect: ['文科考生', '理科考生'],
      studentKindsIndeter: false,
      checkStudentKindsAll: false,
      addRoomKindVisible: false,
      addUnitVisible: false,
      addRoleVisible: false,
      addStudentKindsVisible: false,
      optionInfo: '',
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      formItemLayout: {
        labelCol: {span: 4},
        wrapperCol: {span: 14}
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {span: 14, offset: 6}
      }
    }
  },
  mounted () {
    if (this.$route.query.examName !== undefined) {
      this.examName = this.$route.query.examName
      this.sponsor = this.$route.query.sponsor
      this.roomKindsSelect = this.$route.query.roomKindsSelect
      this.unitsSelect = this.$route.query.unitsSelect
      this.rolesSelect = this.$route.query.rolesSelect
      this.studentKindsSelect = this.$route.query.studentKindsSelect
    }
  },
  methods: {
    routeToExam () {
      if (this.examName === '') {
        return this.$message.warning('考试名不能为空')
      }
      if (this.sponsor === '') {
        return this.$message.warning('发起人不能为空')
      }
      if ((this.roomKindsSelect.indexOf('标准考室') === -1)) {
        return this.$message.warning('标准考室必选')
      }
      if (this.rolesSelect.indexOf('监考人员') === -1) {
        return this.$message.warning('监考人员必选')
      }
      this.$router.push({
        path: 'add',
        query: {
          examName: this.examName,
          sponsor: this.sponsor,
          roomKindsSelect: this.roomKindsSelect,
          unitsSelect: this.unitsSelect,
          rolesSelect: this.rolesSelect,
          studentKindsSelect: this.studentKindsSelect
        }
      }
      )
    },
    showAddRoomModal () {
      this.addRoomKindVisible = true
    },
    showAddUnitModal () {
      this.addUnitVisible = true
    },
    showAddRoleModal () {
      this.addRoleVisible = true
    },
    showAddStudentKindsModal () {
      this.addStudentKindsVisible = true
    },
    handleCancel () {
      this.addRoomKindVisible = false
      this.addUnitVisible = false
      this.addRoleVisible = false
      this.addStudentKindsVisible = false
    },
    // 考室种类操作
    selectAllRoomKind (e) {
      Object.assign(this, {
        roomKindsSelect: e.target.checked ? roomKinds : [],
        roomKindsIndeter: false,
        checkRoomKindAll: e.target.checked
      })
    },
    changeRoomKind (checkedList) {
      this.roomKindsIndeter = !!checkedList.length && checkedList.length < roomKinds.length
      this.checkRoomKindAll = checkedList.length === roomKinds.length
    },
    // 参与单位操作
    selectAllUnits (e) {
      Object.assign(this, {
        unitsSelect: e.target.checked ? units : [],
        unitsIndeter: false,
        checkUnitsAll: e.target.checked
      })
    },
    changeUnit (checkedList) {
      this.unitsIndeter = !!checkedList.length && checkedList.length < units.length
      this.checkUnitsAll = checkedList.length === units.length
    },
    // 参与角色操作
    selectAllRoles (e) {
      Object.assign(this, {
        rolesSelect: e.target.checked ? roles : [],
        rolesIndeter: false,
        checkRolesAll: e.target.checked
      })
    },
    changeRole (checkedList) {
      this.rolesIndeter = !!checkedList.length && checkedList.length < roles.length
      this.checkRolesAll = checkedList.length === roles.length
    },
    // 学生类型操作
    selectAllStudentKinds (e) {
      Object.assign(this, {
        studentKindsSelect: e.target.checked ? studentKinds : [],
        studentKindsIndeter: false,
        checkStudentKindsAll: e.target.checked
      })
    },
    changeStudentKinds (checkedList) {
      this.studentKindsIndeter = !!checkedList.length && checkedList.length < studentKinds.length
      this.checkStudentKindsAll = checkedList.length === studentKinds.length
    },
    addRoomKind () {
      this.roomKinds.push(this.optionInfo)
      this.addRoomKindVisible = false
    },
    addUnit () {
      this.units.push(this.optionInfo)
      this.addUnitVisible = false
    },
    addRole () {
      this.roles.push(this.optionInfo)
      this.addRoleVisible = false
    },
    addStudentKind () {
      this.studentKinds.push(this.optionInfo)
      this.addStudentKindsVisible = false
    },
    resetInfo () {
      this.$router.go(0)
    }
  }
}
</script>

<style scoped></style>
