<template>
  <div id="Roles">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
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
            <el-button size="small" icon="el-icon-edit" type="primary">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" type="danger">删除</el-button>
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
      append-to-body>
      <!-- 树状图 -->
      <el-tree 
        :node-key="'id'"
        :default-expand-all="true"
        :default-checked-keys="selectList"
        :data="rightsList"
        show-checkbox
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUserPower = false">取 消</el-button>
        <el-button type="primary" @click="showUserPower = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {getRolesList, deleteUserPower} from "network/roles"
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
      selectList: [142,143],  // 目前以拥有的权限id
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
</style>