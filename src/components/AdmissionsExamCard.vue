<template>
  <div class="exam-card">
    <div class="exam-card-header">
      <h1>{{ examInfo.name }}</h1>
      <p>{{ examInfo.startTime }} - {{ examInfo.endTime }}</p>
    </div>
    <hr color="#eeeeee"/>
    <div class="exam-card-content">
      <div class="content-synopsis">
        <a-statistic
          v-for="item in studentInfos"
          :key="item"
          :title="item.type + '数量'"
          :value="item.value"
          style="margin-right: 15px"
        />
      </div>
      <div class="content-button">
        <a-button class="button" @click="showDetailDrawer">查看详情</a-button>
        <a-drawer
          title="考试详情"
          placement="right"
          width="500"
          :closable="false"
          :visible="detailDrawerVisible"
          @close="detailDrawerClose"
        >
          <p class="subordinate-info-title">基本信息</p>
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="考试名称">
              {{ examInfo.name }}
            </a-descriptions-item>
            <a-descriptions-item label="发起人">
              {{ examInfo.sponsor }}
            </a-descriptions-item>
            <a-descriptions-item label="开始日期">
              {{ examInfo.startTime }}
            </a-descriptions-item>
            <a-descriptions-item label="结束日期">
              {{ examInfo.endTime }}
            </a-descriptions-item>
          </a-descriptions>

          <p class="subordinate-info-title">考生信息</p>
          <a-descriptions :column="1" bordered>
            <a-descriptions-item
              v-for="item in studentInfos"
              :key="item"
              :label="item.type + '数量'"
            >{{ item.value }}
            </a-descriptions-item>
          </a-descriptions>
          <!--            <a-descriptions-item label="监考人员数量">-->
          <!--              {{ examInfo.invigilatorNumber }}-->
          <!--            </a-descriptions-item>-->
          <p class="subordinate-info-title">参与角色信息</p>
          <a-descriptions :column="1" bordered>
            <a-descriptions-item
              v-for="item in roleInfos"
              :key="item"
              :label="item.type + '数量'"
            >{{ item.value }}
            </a-descriptions-item>
          </a-descriptions>

          <p class="subordinate-info-title">考室信息</p>
          <a-descriptions :column="1" bordered>
            <a-descriptions-item
              v-for="item in roomInfos"
              :key="item"
              :label="item.type + '数量'"
            >{{ item.value }}
            </a-descriptions-item>
          </a-descriptions>

          <p class="subordinate-info-title">考试科目信息</p>
          <div
            class="subordinate-info-item"
            :key="subject"
            v-for="subject in examInfo.recordExamSubjectDTOList"
          >
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="科目">
                {{ subject.name }}
              </a-descriptions-item>
              <a-descriptions-item label="日期">
                {{ subject.date }}
              </a-descriptions-item>
              <a-descriptions-item label="开始时间">
                {{ subject.start }}
              </a-descriptions-item>
              <a-descriptions-item label="结束时间">
                {{ subject.end }}
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <p class="subordinate-info-title">参与单位</p>
          <a-descriptions :column="1" bordered>
            <a-descriptions-item
              v-for="item in unitInfos"
              :key="item"
              :label="item.type"
            ></a-descriptions-item>
          </a-descriptions>
        </a-drawer>
        <a-drawer
          title="上报进度"
          placement="right"
          width="500"
          :closable="false"
          :visible="progressDrawerVisible"
          @close="progressDrawerClose"
        >
          <div v-for="progress in progressInfos" :key="progress.examPlaceId" style="float: left">
            <h1>{{ progress.examPlaceName }}</h1>
            <h2>监考人员信息</h2>
            总人数
            <a-progress type="circle" :percent="Math.floor(progress.invigilatorReported/progress.invigilatorTotal*100)"
                        :width="50"></a-progress>
            男监考
            <a-progress type="circle" :percent="Math.floor(progress.manReported/progress.manTotal*100)"
                        :width="50"></a-progress>
            女监考
            <a-progress type="circle" :percent="Math.floor(progress.womanReported/progress.womanTotal*100)"
                        :width="50"></a-progress>
            <h2>考室信息</h2>
            <div
              v-for="room in progress.roomInfos"
              :key="room.name"
              style="float: left"
            >
              {{ room.name }}
              <a-progress
                :percent="Math.floor(room.reported/room.total*100)"
                type="circle"
                :width="50"
              ></a-progress>
            </div>
          </div>
        </a-drawer>

        <a-popconfirm
          title="确认通过审核?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="checkExam(examInfo.id)"
          @cancel="cancel"
        >
          <a-button class="button" type="primary" v-if="examInfo.checked===0"
          >审核
          </a-button>
        </a-popconfirm>

        <a-popconfirm
          title="确认删除?"
          ok-text="确认"
          ok-type="danger"
          cancel-text="取消"
          @confirm="deleteExam(examInfo.id)"
          @cancel="cancel"
        >
          <a-button class="button" type="danger" v-if="!(examInfo.checked===1)"
          >删除考试
          </a-button>
        </a-popconfirm>

        <a-button class="button" v-if="examInfo.checked===1" @click="arrangeTask(examInfo)"
        >分配任务
        </a-button>
        <a-button class="button" v-if="examInfo.checked===1" @click="showProgressDrawer(examInfo)"
        >查看进度
        </a-button>
        <a-button class="button" v-if="examInfo.checked===1" @click="generateExamGroup(examInfo)"
        >生成监考组
        </a-button>
        <a-button class="button" v-if="examInfo.checked===1" @click="generateInvigilationCard(examInfo)"
        >监考证件
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'AdmissionsExamCard',
  props: ['examInfo'],
  data () {
    return {
      detailDrawerVisible: false,
      progressDrawerVisible: false,
      progressInfos: [],
      restInfo: {},
      studentInfos: [],
      roomInfos: [],
      roleInfos: [],
      unitInfos: []
    }
  },
  created () {
    // 解析基础信息
    let examBasicList = this.examInfo.recordExamBasicList
    for (let i = 0; i < examBasicList.length; i++) {
      let info = {
        type: examBasicList[i].optionName,
        value: examBasicList[i].optionValue
      }
      if (examBasicList[i].optionType === '考室信息') {
        this.roomInfos.push(info)
      } else if (examBasicList[i].optionType === '考生信息') {
        this.studentInfos.push(info)
      } else if (examBasicList[i].optionType === '角色信息') {
        this.roleInfos.push(info)
      } else if (examBasicList[i].optionType === '单位信息') {
        this.unitInfos.push(info)
      }
    }
  },
  methods: {
    arrangeTask (_examInfo) {
      this.$router.push({
        path: '/admissionsManageExam/arrangeTask',
        query: {
          examInfo: _examInfo,
          studentInfos: this.studentInfos,
          roomInfos: this.roomInfos,
          roleInfos: this.roleInfos
        }
      })
    },
    generateInvigilationCard (_examInfo) {
      this.$router.push({
        path: '/admissionsManageExam/generateInvigilationCard',
        query: {
          examInfo: _examInfo
        }
      })
    },
    showDetailDrawer () {
      this.detailDrawerVisible = true
    },
    detailDrawerClose () {
      this.detailDrawerVisible = false
    },
    showProgressDrawer (examInfo) {
      this.progressDrawerVisible = true
      this.getProgress(examInfo)
    },
    progressDrawerClose () {
      this.progressDrawerVisible = false
    },
    // 审核考试
    async checkExam (id) {
      const {data: res} = await this.$http.get('recordExam/check?examId=' + id + '&status=1')
      if (res.code !== 10000) {
        return this.message.error(res.data)
      }
      this.reload()
      return this.$message.success('审核状态更新成功')
    },
    // 删除考试
    async deleteExam (id) {
      const {data: res} = await this.$http.delete('recordExam/delete?id=' + id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.reload()
      return this.$message.success('删除成功')
    },
    // 生成考试组
    async generateExamGroup (examInfo) {
      const hide = this.$message.loading('生成监考组', 0)
      const {data: res} = await this.$http.get('examinationGroup/generate?examinationId=' + examInfo.id)
      setTimeout(hide, 1)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      return this.$message.success(res.data)
    },
    // 获取上报进度
    async getProgress (examInfo) {
      const {data: res} = await this.$http.get('examinationTaskAllocated/progress?examinationId=' + examInfo.id)
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.progressInfos = res.data
      return this.$message.success('获取进度成功')
    }
  }
}
</script>

<style scoped>
.exam-card {
  background-color: #ffffff;
  padding: 16px 24px;
  margin-bottom: 12px;
  border-radius: 4px;
}

h1 {
  font-weight: bold;
  font-size: 20px;
}

p {
  font-size: 16px;
}

.exam-card-header,
.exam-card-content,
.content-synopsis {
  display: flex;
  justify-content: space-between;
}

.statistic {
  margin-top: 12px;
  margin-right: 36px;
}

.button {
  margin-top: 24px;
  margin-left: 6px;
}

.subordinate-info-title {
  margin: 18px 0 6px;
  padding: 4px 12px;
  border-left: 4px solid #1890ff;
}

.subordinate-info-item {
  margin: 12px 0;
}
</style>
