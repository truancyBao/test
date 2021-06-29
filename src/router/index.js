import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: () => import('../pages/login/Login'),
      meta: {
        title: '中高考考务管理系统'
      }
    },
    {
      path: '/',
      name: '教师',
      redirect: '/login',
      component: () => import('../pages/teacher/TeacherFrame'),
      children: [
        {
          path: 'teacherHome',
          name: '教师首页',
          component: () => import('../pages/teacher/TeacherHome')
        },
        {
          path: 'teacherManageInfo',
          name: '个人信息',
          component: () => import('../pages/teacher/TeacherManageInfo')
        },
        {
          path: 'teacherCheckArrange',
          name: '监考任务',
          component: () => import('../pages/teacher/TeacherTaskArrange')
        },
        {
          path: 'teacherCheckHistory',
          name: '监考记录',
          component: () => import('../pages/teacher/TeacherRecordHistory')
        }
      ]
    },
    {
      path: '/',
      name: '学校',
      redirect: '/login',
      component: () => import('../pages/school/SchoolFrame'),
      children: [
        {
          path: 'schoolHome',
          name: '学校首页',
          component: () => import('../pages/school/SchoolHome')
        },
        {
          path: 'schoolManageExam',
          name: '考试管理',
          component: () => import('../components/BlankView'),
          children: [
            {
              path: 'check',
              name: '查看考试',
              component: () => import('../pages/school/SchoolCheckExam')
            },
            {
              path: 'add',
              name: '新建考试',
              component: () => import('../pages/school/SchoolAddExam')
            },
            {
              path: 'examRecord',
              name: '考试记录',
              component: () => import('../pages/school/SchoolExamRecord')
            }
          ]
        },
        {
          path: 'schoolManageStaff',
          name: '人员管理',
          component: () => import('../components/BlankView'),
          children: [
            {
              path: 'audit',
              name: '审核教师',
              component: () => import('../pages/school/SchoolAuditTeacher')
            },
            {
              path: 'report',
              name: '上报教师',
              component: () => import('../pages/school/SchoolReportedTeacher')
            },
            {
              path: 'teacher',
              name: '所有教师',
              component: () => import('../pages/school/SchoolManageTeacher')
            }
          ]
        },
        {
          path: 'schoolManageExamRoom',
          name: '考场管理',
          component: () => import('../components/BlankView'),
          children: [
            {
              path: 'building',
              name: '楼栋管理',
              component: () => import('../pages/school/SchoolManageBuilding')
            },
            {
              path: 'reportedRoom',
              name: '上报考场',
              component: () => import('../pages/school/SchoolReportedRoom')
            },
            {
              path: 'examRoom',
              name: '所有考场',
              component: () => import('../pages/school/SchoolManageExamRoom')
            },
            {
              path: 'ichnography',
              name: '考点平面图',
              component: () => import('../pages/school/SchoolManageIchnography')
            }
          ]
        }
      ]
    },
    {
      path: '/',
      name: '招生办',
      redirect: '/login',
      component: () => import('../pages/admissions/AdmissionsFrame'),
      children: [
        {
          path: 'admissionsHome',
          name: '招生办首页',
          component: () => import('../pages/admissions/AdmissionsHome')
        },
        {
          path: 'admissionsManageExam',
          name: '考试管理',
          component: () => import('../components/BlankView'),
          children: [
            {
              path: 'addBasic',
              name: '新建考试基础信息',
              component: () => import('../pages/admissions/AdmissionsAddExamBasic')
            },
            {
              path: 'add',
              name: '新建考试',
              component: () => import('../pages/admissions/AdmissionsAddExam')
            },
            {
              path: 'exam',
              name: '管理考试',
              component: () => import('../pages/admissions/AdmissionsManageExam')
            },
            {
              path: 'arrangeTask',
              name: '分配任务',
              component: () => import('../pages/admissions/AdmissionsArrangeTask')
            },
            {
              path: 'generateInvigilationCard',
              name: '生成监考证',
              component: () => import('../pages/admissions/AdmissionsGenerateInvigilationCard')
            },
            {
              path: 'examRecord',
              name: '考试记录',
              component: () => import('../pages/admissions/AdmissionsManageExamRecord')
            }
          ]
        },
        {
          path: 'admissionsManageExamSite',
          name: '考点管理',
          component: () => import('../pages/admissions/AdmissionsManageExamSite')
        },

        {
          path: 'admissionsManageStaff',
          name: '人员管理',
          component: () => import('../components/BlankView'),
          children: [
            {
              path: 'examSiteManager',
              name: '考点管理员',
              component: () => import('../pages/admissions/AdmissionsManageExamSiteManager')
            },
            {
              path: 'teacher',
              name: '所有教师',
              component: () => import('../pages/admissions/AdmissionsManageTeacher')
            }
          ]
        },

        {
          path: 'admissionsManageParticipant',
          name: '参与角色',
          component: () => import('../components/BlankView'),
          children: [
            {
              path: 'department',
              name: '参与单位',
              component: () => import('../pages/admissions/AdmissionsManageParticipantDepartment')
            },
            {
              path: 'staff',
              name: '参与人员',
              component: () => import('../pages/admissions/AdmissionsManageParticipantStaff')
            }
          ]
        }

      ]
    }
  ]
})
