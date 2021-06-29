<template>
  <div class="exam-card">
    <div class="exam-card-header">
      <h1>{{ taskInfo.examName }}</h1>
      <p>{{ taskInfo.timeStart }} - {{ taskInfo.timeEnd }}</p>
    </div>
    <hr color="#eeeeee"/>
    <div class="exam-card-content">
      <div class="content-synopsis">
        <a-statistic
          class="statistic"
          v-for="item in taskInfo.studentInfos"
          :key="item.value"
          :title="item.type"
          :value="item.value"
        ></a-statistic>
        <!--        <a-statistic-->
        <!--          class="statistic"-->
        <!--          v-for="item in roomInfos"-->
        <!--          :key="item"-->
        <!--          :title="item.type"-->
        <!--          :value="item.value"-->
        <!--        ></a-statistic>-->
        <!--        <a-statistic-->
        <!--          class="statistic"-->
        <!--          v-for="item in roleInfos"-->
        <!--          :key="item"-->
        <!--          :title="item.type"-->
        <!--          :value="item.value"-->
        <!--        ></a-statistic>-->
      </div>
      <div class="content-button">
        <a-button class="button" @click="showTaskDrawer">查看任务详情</a-button>
        <a-drawer
          title="任务详情"
          placement="right"
          width="480"
          :closable="false"
          :visible="taskDrawerVisible"
          @close="taskDrawerClose"
        >
          <a-card>
            <h1>{{ taskInfo.examName }}</h1>
            <a-descriptions title="分配学生">
              <a-descriptions-item
                v-for="item in taskInfo.studentInfos"
                :key="item"
                :label="item.type"
              >{{ item.value }}
              </a-descriptions-item>
            </a-descriptions>
            <a-descriptions title="分配考室">
              <a-descriptions-item
                v-for="item in taskInfo.roomInfos"
                :key="item"
                :label="item.type"
              >{{ item.value }}
              </a-descriptions-item>
            </a-descriptions>
            <a-descriptions title="分配角色">
              <a-descriptions-item
                v-for="item in taskInfo.roleInfos"
                :key="item"
                :label="item.type"
              >{{ item.value }}
              </a-descriptions-item>
            </a-descriptions>
            <a-descriptions title="考试时间">
              <a-descriptions-item label="开始时间">{{ taskInfo.timeStart }}</a-descriptions-item>
              <br/>
              <a-descriptions-item label="结束时间">{{ taskInfo.timeEnd }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-drawer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SchoolExamCard',
  props: ['taskInfo'],
  data () {
    return {
      detailDrawerVisible: false,
      taskDrawerVisible: false,
      studentInfos: [],
      roomInfos: [],
      roleInfos: []
    }
  },
  created () {
    console.log(this.taskInfo)
  },
  methods: {
    showDetailDrawer () {
      this.detailDrawerVisible = true
    },
    showTaskDrawer () {
      this.taskDrawerVisible = true
    },
    detailDrawerClose () {
      this.detailDrawerVisible = false
    },
    taskDrawerClose () {
      this.taskDrawerVisible = false
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
</style>
