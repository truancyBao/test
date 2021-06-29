<template>
  <div class="page">
    <div class="page-header">
      <a-page-header
        @back="() => this.$router.push('/teacherHome')"
        sub-title="管理个人信息"
        title="个人信息"
      />
    </div>
    <a-form-model
      :label-col="labelCol"
      :model="form"
      :rules="rules"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="照片" prob="photo">
        <a-upload
          :file-list="fileList"
          @change="handleChange"
          @preview="handlePreview"
          action="http://127.0.0.1:3331/api/photo/upload"
          :headers="headers"
          list-type="picture-card"
        >
          <img :src="imageUrl" alt="example" style="width: 100%"/>
        </a-upload>
        <a-modal
          :footer="null"
          :visible="previewVisible"
          @cancel="handleCancel"
        >
          <img :src="imageUrl" alt="example" style="width: 100%"/>
        </a-modal>
      </a-form-model-item>

      <a-form-model-item label="编码" prob="code">
        <a-input
          @blur="
            () => {
              $refs.name.onFieldBlur();
            }
          "
          style="width: 50%"
          v-model="form.code"
          disabled="true"
        />
      </a-form-model-item>

      <a-form-model-item label="身份证号" prob="identityCardNumber">
        <a-input
          @blur="
            () => {
              $refs.name.onFieldBlur();
            }
          "
          style="width: 50%"
          v-model="form.identityCardNumber"
        />
      </a-form-model-item>

      <a-form-model-item label="姓名" prop="name">
        <a-input
          @blur="
            () => {
              $refs.name.onFieldBlur();
            }
          "
          style="width: 50%"
          v-model="form.name"
        />
      </a-form-model-item>

      <a-form-model-item label="性别" prop="gender">
        <a-radio-group v-model="form.gender">
          <a-radio value="男">男</a-radio>
          <a-radio value="女">女</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item label="出生日期" prop="birth">
        <a-input type="date" style="width: 50%" v-model="form.birth"></a-input>
      </a-form-model-item>

      <a-form-model-item label="学校" prop="examPlaceId" ref="school">
        <a-select
          placeholder="请选择学校"
          style="width: 50%"
          v-model="form.examPlaceId"
        >
          <a-select-option
            v-for="item in examPlaceInfo"
            :key="item.id"
          >{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="手机" prop="phone">
        <a-input
          @blur="
            () => {
              $refs.name.onFieldBlur();
            }
          "
          style="width: 50%"
          v-model="form.phone"
        />
      </a-form-model-item>

      <a-form-model-item label="授课年级" ref="grade" prob="grade">
        <a-select
          placeholder="请选择授课年级"
          style="width: 50%"
          v-model="form.grade"
        >
          <a-select-option value="初一">
            初一
          </a-select-option>
          <a-select-option value="初二">
            初二
          </a-select-option>
          <a-select-option value="初三">
            初三
          </a-select-option>
          <a-select-option value="高一">
            高一
          </a-select-option>
          <a-select-option value="高二">
            高二
          </a-select-option>
          <a-select-option value="高三">
            高三
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="授教科目" ref="subject" prob="subject">
        <a-select
          placeholder="请选择授教科目"
          style="width: 50%"
          v-model="form.subject"
        >
          <a-select-option value="语文">
            语文
          </a-select-option>
          <a-select-option value="数学">
            数学
          </a-select-option>
          <a-select-option value="英语">
            英语
          </a-select-option>
          <a-select-option value="物理">
            物理
          </a-select-option>
          <a-select-option value="化学">
            化学
          </a-select-option>
          <a-select-option value="生物">
            生物
          </a-select-option>
          <a-select-option value="政治">
            政治
          </a-select-option>
          <a-select-option value="历史">
            历史
          </a-select-option>
          <a-select-option value="地理">
            地理
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="是否回避" ref="avoid" prob="avoid">
        <a-radio-group v-model="form.avoid">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item label="回避理由" ref="avoidReason" prob="avoidReason">
        <a-textarea style="width: 50%" placeholder="若回避，请填写回避理由" v-model="form.avoidReason"></a-textarea>
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button @click="onSubmit" type="primary">
          保存
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  name: 'TeacherManageInfo',
  data () {
    return {
      // 图片上传的请求头对象
      headers: {
        Authorization: window.sessionStorage.getItem('eastoken')
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      form: {},
      rules: {
        photo: [
          {required: true, message: '请上传照片', trigger: 'change'}
        ],
        identityCardNumber: [
          {required: true, message: '请输入身份证号', trigger: 'blur'}
        ],
        name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        gender: [{required: true, message: '请选择性别', trigger: 'change'}],
        birth: [
          {required: true, message: '请输入出生日期', trigger: 'blur'}
        ],
        examPlaceId: [{required: true, message: '请选择学校', trigger: 'change'}],
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
        grade: [
          {required: true, message: '请选择授课年级', trigger: 'change'}
        ],
        subject: [
          {required: true, message: '请选择授教科目', trigger: 'change'}
        ],
        avoid: [
          {required: true, message: '是否回避', trigger: 'change'}
        ],
        avoidReason: [
          {required: true, message: '回避理由', trigger: 'change'}
        ]
      },
      loading: false,
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      examPlaceInfo: {},
      imageUrl: ''
    }
  },
  created () {
    this.getTeacherInfo()
    this.getExamPlace()
  },
  methods: {
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({fileList}) {
      this.fileList = fileList
    },
    async onSubmit () {
      const editInfo = {
        identityCardNumber: this.form.identityCardNumber,
        name: this.form.name,
        gender: this.form.gender,
        birth: this.form.birth,
        phone: this.form.phone,
        examPlaceId: this.form.examPlaceId,
        grade: this.form.grade,
        subject: this.form.subject,
        avoid: this.form.avoid,
        avoidReason: this.form.avoidReason
        // signature: this.form.signature
      }
      const {data: res} = await this.$http.put('examPlaceInvigilator/modify', editInfo)
      localStorage.setItem('name', this.form.name)
      if (res.code !== 10000) {
        return this.$message.error('修改信息失败')
      }
      this.$message.success(res.data)
      await this.getTeacherInfo()
    },
    async getTeacherInfo () {
      const {data: res} = await this.$http.get(`examPlaceInvigilator/get?id=` + window.localStorage.getItem('id'))
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.form = res.data
      this.imageUrl = this.imageBaseUrl + this.form.avatar
      console.log(this.form)
    },
    async getExamPlace () {
      const {data: res} = await this.$http.get('examPlace/list')
      if (res.code !== 10000) {
        return this.$message.error(res.data)
      }
      this.examPlaceInfo = res.data
      console.log(this.examPlaceInfo)
    }
  }
}
</script>

<style scoped>
.form {
  padding: 12px 0;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
