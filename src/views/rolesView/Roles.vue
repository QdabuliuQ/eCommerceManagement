<template>
  <div id="Roles">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <el-button @click="addRole" type="primary">添加角色</el-button>
      <el-table border :data="tableData" stripe style="width: 100%">
        <el-table-column type="expand" width="60">
          <template slot-scope="scope">
            <!-- 权限行 -->
            <el-row class="Firstrow" :class="index == scope.row.children.length - 1 ? 'bottomBor' : ''" v-for="(roleRow, index) in scope.row.children" :key="index">
              <!-- 第一权限 -->
              <el-col :span="5">
                <el-tag @close="deletePower(scope.row, roleRow.id)" :type="''" closable>
                  {{roleRow.authName}}
                </el-tag>
                <i style="color: #409EFF" class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row 
                class="Secondrow" 
                :class="index2 != 0 ? 'topBor' : ''"
                v-for="(secondItem, index2) in roleRow.children" :key="index2">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag @close="deletePower(scope.row, secondItem.id)" :type="'success'" closable>
                      {{secondItem.authName}}
                    </el-tag>
                    <i style="color: #67c23a" class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag @close="deletePower(scope.row, thirdItem.id)" :type="'warning'" closable v-for="(thirdItem, index3) in secondItem.children" :key="index3">
                      {{thirdItem.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="setRoleDetail(scope.row)" size="small" icon="el-icon-edit" type="primary">编辑</el-button>
            <el-button @click="deleteRole(scope.row)" size="small" icon="el-icon-delete" type="danger">删除</el-button>
            <el-button @click="setUserPower(scope.row)" size="small" icon="el-icon-setting" type="warning">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      width="40%"
      title="分配权限"
      :visible.sync="showUserPower"
      append-to-body
      @close="closeUserPowerTree">
      <!-- 树状图 -->
      <el-tree 
        :node-key="'id'"
        :default-expand-all="true"
        :default-checked-keys="selectList"
        :data="rightsList"
        show-checkbox
        :props="defaultProps"
        ref="treeRights">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUserPower = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="showDialogRole"
      width="40%"
      @close="closeAddRoleDialog">
      <el-form ref="addRoleForm" :rules="addRoleRules" :model="addRoleDetail" label-width="100px">
        <el-form-item prop="name" label="角色名称：">
          <el-input v-model="addRoleDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="addRoleDetail.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogRole = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="setRoleDialog"
      width="40%">
      <el-form ref="settingRoleForm" :rules="addRoleRules" :model="RoleDetail" label-width="100px">
        <el-form-item prop="name" label="角色名称：">
          <el-input v-model="RoleDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="RoleDetail.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="settingRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {
  getRolesList, 
  deleteUserPower, 
  setUserPower, 
  addRoleInformation,
  deleteRoleInformation,
  settingRoleInformation} from "network/roles"
import {getPowerList} from "network/power"

export default {
  name: "Roles",
  data() {
    return {
      crumbList: [],
      tableData: [],  // 角色数据
      showUserPower: false,  // 分配权限
      rightsList: [],  // 全部权限列表
      defaultProps: {  // 树形图数据字段
        children: 'children',
        label: 'authName'
      },
      selectList: [],  // 目前以拥有的权限id
      roleId: '',  // 用户id
      showDialogRole: false,  // 添加角色对话框
      setRoleDialog: false,  // 编辑角色对话框
      addRoleDetail: {  // 添加角色信息
        name: '',
        desc: ''
      },
      RoleDetail: {  // 编辑角色信息
        name: '',
        desc: ''
      },
      userInput: {
        id: '',
        name: '',
        desc: ''
      },
      addRoleRules: {  // 命名规则
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      }
    };
  },

  // 页面渲染完成生命周期函数
  created() {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName")); // 获取储存数据
    this.rolesList();
  },

  methods: {
    // 删除权限
    deletePower(rowDetail, powerId) {
      this.$confirm('此操作将永久删除该用户权限, 是否继续?', '信息提示', {  // 弹窗提示
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserPower(rowDetail.id, powerId).then(res => {  // 发送请求删除权限
          if (res.data.meta.status == 200) {  
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            rowDetail.children = res.data.data  // 刷新数据
          } else {
            this.$message.error("取消权限失败")
          }
        })
      }).catch();
    },

    // 获取数据
    rolesList() {
      getRolesList().then(res => {
        this.tableData = res.data.data
      })
    },

    // 分配权限
    setUserPower(selectList) {
      this.roleId = selectList.id
      this.showUserPower = true
      getPowerList("tree").then(res => {  // 获取所有的权限列表数据
        this.rightsList = res.data.data
        this.getLeafKey(selectList, this.selectList)
      })
    },

    // 通过递归获取已有的权限节点id
    getLeafKey(node, arr) {
      if (!node.children) {  // 最后一个子节点是没有children节点  进入判断条件
        return arr.push(node.id)  // 将id添加到数组中
      }
      // 通过遍历node的children的子节点 将 item 作为 getLeafKey 方法的node形成传递进去
      // 进行下一步判断遍历
      node.children.forEach( item => this.getLeafKey(item, arr))
    },

    // 关闭分配权限弹窗回调
    closeUserPowerTree() {
      this.selectList = []  // 清空数组
    },

    // 设置权限
    allotRights() {
      // 通过数组解构的方式
      // getCheckedKeys 获取的是最底层的节点key
      // getHalfCheckedKeys 获取的是除了最底层节点，其他的节点key
      const keys = [...this.$refs.treeRights.getCheckedKeys(),...this.$refs.treeRights.getHalfCheckedKeys()]
      setUserPower(this.roleId, keys.toString()).then(res => {
        if (res.data.meta.status == 200) {
          this.$message.success("修改用户权限成功")
          this.showUserPower = false;  // 隐藏对话框
          this.rolesList();  // 刷新数据
        } else {
          this.$message.error("修改用户权限失败")
        }
      })
    },

    // 添加角色
    addRole() {
      this.showDialogRole = true
    },

    // 提交角色
    submitRole() {
      this.$refs.addRoleForm.validate(result => {
        if (result) {
          addRoleInformation(this.addRoleDetail.name, this.addRoleDetail.desc).then(res => {
            if (res.data.meta.status == 201) {
              this.rolesList();  // 刷新数据
              this.$message.success("添加角色成功");
              this.showDialogRole = false
              return
            }
            this.$message.error("添加角色失败，请重试")
          })
          return
        }
        this.$message.warning("角色名称不能为空")
      })
    },

    // 删除角色
    deleteRole(roleInfo) {
      this.$confirm('此操作将永久删除角色信息, 是否继续?', '信息提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleInformation(roleInfo.id).then(res => {  // 发送请求
          if (res.data.meta.status == 200) {  // 判断状态码
            this.rolesList();  // 刷新数据
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '删除失败，请重试'
            });
          }
        })  
      }).catch();
    },

    // 编辑角色对话框
    setRoleDetail(roleInfo) {
      this.setRoleDialog = true
      console.log(roleInfo);
      this.RoleDetail.name = roleInfo.roleName
      this.RoleDetail.desc = roleInfo.roleDesc
      this.userInput.name = roleInfo.roleName
      this.userInput.desc = roleInfo.roleDesc
      this.userInput.id = roleInfo.id
    },

    // 编辑角色
    settingRole() {
      this.$refs.settingRoleForm.validate(result => {
        if (result) {
          // 判断内容是否进行修改
          if (this.userInput.name != this.RoleDetail.name || this.userInput.desc != this.RoleDetail.desc) {
            settingRoleInformation(this.userInput.id, this.RoleDetail.name, this.RoleDetail.desc).then(res =>{
              console.log(res);
              if (res.data.meta.status == 200) {
                this.rolesList();  // 刷新数据
                this.$message.success("编辑角色信息成功")
                this.setRoleDialog = false  // 隐藏对话框
                this.RoleDetail.name = ''
                this.RoleDetail.desc = ''
                this.userInput.name = ''
                this.userInput.desc = ''
                this.userInput.id = ''
                return
              } else {
                this.$message.error("编辑角色信息失败")
              }
            })
          }
          this.setRoleDialog = false  // 隐藏对话框
        } else {
          this.$message.warning("角色名称不能为空")
        }
      })
    },

    // 关闭添加角色对话框
    closeAddRoleDialog() {
      this.addRoleDetail.name = ''
      this.addRoleDetail.desc = ''
    }
  },

  components: {
    BrandCrumb,
  },
};
</script>
<style scoped>
.box-card {
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
.Firstrow{
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}
.Secondrow{
  padding: 4px 0 4px;
  display: flex;
  align-items: center;
}
.el-tag{
  margin: 6px;
}
.bottomBor {
  border-bottom: 1px solid #f0f0f0;
}
.topBor {
  border-top: 1px solid #f0f0f0;
}
.el-form-item__label{
  text-align: left;
}
</style>