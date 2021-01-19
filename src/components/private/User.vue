<template>
  <div id="User">
    <brand-crumb :crumbList="menuList"></brand-crumb>
    <!-- 卡片容器 -->
    <el-card class="user_container">
      <!-- layout栅格 -->
      <el-row :gutter="30">
        <el-col :span="7">
          <!-- 输入框 -->
          <el-input @clear="clearInput" :clearable="true" v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select">
            <el-button @click="getUsersDetail(queryInfo.pagenum, queryInfo.size, queryInfo.query)" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addUserView" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户数据表 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
        <el-table-column prop="email" label="电子邮箱"></el-table-column>
        <el-table-column prop="role_name" label="用户权限"></el-table-column>
        <el-table-column label="用户状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 通过scope拿到当前该行的数据 -->
            <el-switch
              @change="toggleSwitch(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#cdcdcd">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip @click="editBtn(scope.row)" :enterable="false" class="item" effect="dark" content="修改" placement="top">
              <el-button size="small" type="primary" icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" class="item" effect="dark" content="删除" placement="top">
              <el-button size="small" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" class="item" effect="dark" content="设置权限" placement="top">
              <el-button size="small" type="warning" icon="el-icon-setting" circle></el-button>  
            </el-tooltip>
          </template>        
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[6, 15, 20, 25]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      @close="clearDetail">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="userName" label="用户名称：">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="用户密码：">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="用户邮箱：">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="用户手机：">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb"
import { getUsers, setUserState, addUserDetail } from "network/users"

export default {
  name: 'User',
  data () {
    return {
      menuList: [],
      pagenum: 1,   // 页数
      tableData: [],   // 用户数据
      queryInfo: {
        total: 0,  // 总条数
        pagenum: 1,  // 页面数
        size: 6,  // 页面数据数量
        query: '',  // 输入框的内容
      },
      dialogVisible: true,  // 添加用户对话框
      addForm: {   // 用户表单数据
        userName: '',
        password: '',
        email: '',
        phone: ''
      },
      addFormRules: {
        userName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名在2-10个字符直接', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '用户密码在6-15个字符直接', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '用户邮箱不能为空', trigger: 'blur' },
          { pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, message: '电子邮箱有误' }
        ],
        phone: [
          { required: true, message: '用户手机不能为空', trigger: 'blur' },
          { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '手机号码有误' }
        ],

      }
    }
  },

  methods: {
    // 每页数量切换
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.getUsersDetail(this.queryInfo.pagenum, this.queryInfo.size)
    },

    // 页数切换
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getUsersDetail(this.queryInfo.pagenum, this.queryInfo.size)
    },

    // 获取数据
    getUsersDetail(pagenum, pagecount, query) {
      getUsers(pagenum, pagecount, query).then(res => {
        this.queryInfo.total = res.data.data.total  // 总条数
        this.queryInfo.pagenum = res.data.data.pagenum  // 当前页面
        this.tableData = res.data.data.users
      })
    },

    // 状态改变事件
    toggleSwitch(userDetail) {
      setUserState(userDetail.id, userDetail.mg_state).then(res => {
        if (res.data.meta.status != 200) {
          this.$message.error("更新用户信息失败");
          userDetail.mg_state = !userDetail.mg_state   // 重新修改回来
        } else {
          this.$message.success("更新用户信息成功");
        }
      })
    },

    // 清空输入框
    clearInput() {
      this.getUsersDetail(this.queryInfo.pagenum, this.queryInfo.size)   // 重新请求数据
    },

    // 添加用户按钮
    addUserView() {
      this.dialogVisible = true
    },

    // 关闭对话框事件
    clearDetail() {
      this.$refs.addForm.resetFields()  // 重置表单数据
    },

    // 添加用户信息
    addUser() {
      // 调用api进行表单信息验证
      this.$refs.addForm.validate((result) => {
        if (result) {
          addUserDetail(this.addForm.userName, this.addForm.password, this.addForm.email, this.addForm.phone).then(res => {
            if (res.data.meta.status == 201) {  // 对请求结果进行判断
              this.$message.success("添加用户成功")
              this.getUsersDetail(this.queryInfo.pagenum, this.queryInfo.size)  // 重新获取数据
              this.dialogVisible = false  // 隐藏对话框
            } else {
              this.$message.error("添加失败，请重新添加");
            }
          })
        }
      })
    }
   },

  // 页面渲染完成生命周期函数
  created () {
    this.menuList = JSON.parse(window.sessionStorage.getItem("menuName"))   // 获取储存数据
    this.getUsersDetail(1, 7)  // 获取用户数据
  },

  // 注册组件
  components: {
    BrandCrumb
  }
}

</script>
<style scoped>
.user_container{
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
.el-pagination{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.el-form-item__label{
  text-align: left;
}
.el-dialog__footer{
  padding-top: 0 !important;
}
</style>