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
        <el-table-column prop="role_name" label="用户角色"></el-table-column>
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
            <el-tooltip :enterable="false" class="item" effect="dark" content="修改" placement="top">
              <el-button @click="editUser(scope.row)" size="small" type="primary" icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" class="item" effect="dark" content="删除" placement="top">
              <el-button @click="deleteUser(scope.row)" size="small" type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" class="item" effect="dark" content="设置权限" placement="top">
              <el-button @click="setPower(scope.row)" size="small" type="warning" icon="el-icon-setting" circle></el-button>  
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
    <!-- 修改用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogEdit"
      width="40%"
      @close="closeDialogEdit">
      <el-form ref="editform" :model="editForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="用户名称：">
          <el-input :disabled="true" v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="用户邮箱：">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="用户手机：">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUserDetail">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置权限对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogSet"
      width="40%"
      @close="closeDialogSet">
      <div class="dialoItem userName">用户名称：<span>{{userInfo.username}}</span></div>
      <div class="dialoItem userRole">当前角色：<span>{{userInfo.role_name}}</span></div>
      <div class="">分配角色：
        <el-select v-model="selectValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSet = false">取 消</el-button>
        <el-button type="primary" @click="saveUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb"
import { 
  getUsers, 
  setUserState, 
  addUserDetail,
  editUserDetail,
  deleteUserDetail } from "network/users"
import {getRolesList, setUserRole} from "network/roles"

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
      dialogVisible: false,  // 添加用户对话框
      dialogEdit: false,  // 修改用户对话框
      dialogSet: false,  // 设置权限对话框
      userInfo: {},  // 用户信息
      selectValue: '',  // 下拉列表值
      options: [],  // 下拉列表
      addForm: {   // 用户表单数据
        userName: '',
        password: '',
        email: '',
        phone: ''
      },
      editForm: {  // 修改表单数据
        id: '',
        userName: '',
        email: '',
        phone: ''
      },
      userInput: {   // 用户原数据
        email: '',
        phone: ''
      },
      addFormRules: {  // 匹配规则
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
      },
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
    },

    // 修改用户对话框
    editUser(userDetail) {
      this.dialogEdit = true
      this.userInput.email = userDetail.email
      this.userInput.phone = userDetail.mobile
      this.editForm.id = userDetail.id
      this.editForm.userName = userDetail.username
      this.editForm.email = userDetail.email
      this.editForm.phone = userDetail.mobile
    },

    // 修改用户信息
    editUserDetail() {
      this.$refs.editform.validate((result) => {
        if (result) {   // 判断表单验证
          // 判断是否进行了修改
          if (this.userInput.email != this.editForm.email || this.userInput.phone != this.editForm.phone) {   
            editUserDetail(this.editForm.id, this.editForm.email, this.editForm.phone).then(res => {
              if (res.data.meta.status == 200) {         
                this.getUsersDetail(this.queryInfo.pagenum, this.queryInfo.size)  // 刷新数据
                this.$message.success("更新用户数据成功")
                this.dialogEdit = false;  // 隐藏对话框
                return
              }
              this.$message.error("更新用户数据失败")
            })
          }
          this.dialogEdit = false;  // 隐藏对话框
        }
      })
    },

    // 监听对话框是否关闭
    closeDialogEdit(){
      this.$refs.editform.resetFields();  // 清空数据
    },

    // 删除用户数据
    deleteUser(userDetail) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '信息提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteUserDetail(userDetail.id).then(res => {
          if (res.data.meta.status == 200) {  // 判断请求是否成功
            this.getUsersDetail(this.queryInfo.pagenum, this.queryInfo.size)  // 刷新数据
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            return
          }
          this.$message({
            type: 'error',
            message: '网络出错删除失败'
          });
        })
      }).catch(() => {});
    },

    // 设置用户权限
    setPower(userInfo) {
      this.dialogSet = true;  // 显示对话框
      this.userInfo = userInfo;
      getRolesList().then(res => {
        this.options = res.data.data.map( function(item,index,ary){
          return {
            id: item.id, 
            roleName:item.roleName
          }
        })
      })
    },

    // 保存用户角色
    saveUserRole() {
      if (!this.selectValue) {
        return this.$message.error("请选择角色");
      }
      setUserRole(this.userInfo.id, this.selectValue).then(res => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.getUsersDetail(this.queryInfo.pagenum, this.queryInfo.size)
          this.$message.success("设置用户角色成功");
          this.dialogSet = false  // 隐藏对话框
        } else {
          this.$message.error("设置角色失败，请重试")
        }
      })
    },

    // 关闭对话框
    closeDialogSet() {
      this.selectValue = ''
      this.userInfo = {}
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
.dialoItem{
  height: 40px;
  display: flex;
  align-items: center;
  color: rgb(119, 119, 119);
}
.dialoItem span {
  font-weight: 550;
  color: rgb(95, 95, 95);
}
</style>