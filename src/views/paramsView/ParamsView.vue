<template>
  <div id="ParamsView">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <el-alert
        :closable="false"
        title="注意：只允许为三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-form label-width="120px">
        <el-form-item label="选择商品分类：">
          <el-cascader
            :clearable="true"
            :props="cateDetailProps"
            v-model="selectKeys"
            :options="parentCateList"
            @change="cateListChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 导航栏切换 -->
      <el-tabs :value="'activeParams'" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="activeParams">
          <el-button
            @click="paramsDialogVisible = true"
            :disabled="disabled"
            type="primary"
            >添加参数</el-button
          >
          <!-- 数据表格 -->
          <el-table :data="activeParamsData" border style="width: 100%">
            <el-table-column type="expand" width="60">
              <!-- tag属性标签 -->
              <template slot-scope="scope">
                <div
                  style="display: inline; margin-left: 15px"
                  v-for="tag in scope.row.attr_vals"
                  :key="tag">
                  <el-tag
                    v-if="tag != ''"
                    closable
                    :disable-transitions="false">
                    {{ tag }}
                  </el-tag>
                </div>
                <div style="display: inline; margin-left: 15px">
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >添加参数</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="60">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button @click="deleteParams(scope.row)" size="mini" type="danger" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="staticParams">
          <el-button
            @click="paramsDialogVisible = true"
            :disabled="disabled"
            type="primary"
            >添加属性</el-button
          >
          <!-- 数据表格 -->
          <el-table :data="staticParamsData" border style="width: 100%">
            <el-table-column type="expand" width="60">
              <!-- tag属性标签 -->
              <template slot-scope="scope">
                <div
                  style="display: inline; margin-left: 15px"
                  v-for="tag in scope.row.attr_vals"
                  :key="tag"
                >
                  <el-tag
                    v-if="tag != ''"
                    closable
                    :disable-transitions="false"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <div style="display: inline; margin-left: 15px">
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >添加属性</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="60">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button @click="deleteParams(scope.row)" size="mini" type="danger" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性/参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="paramsDialogVisible"
      width="40%"
    >
      <el-form
        :model="paramsForm"
        :rules="paramsRulesForm"
        ref="paramsForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="name">
          <el-input v-model="paramsForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import { getGoodsCategory } from "network/category";
import { 
  getCateParams, 
  addCateParams, 
  deleteCateParams, 
  addCateParamsTag } from "network/params";

export default {
  name: "ParamsView",
  data() {
    return {
      crumbList: [],
      selectKeys: [], // 已选中项数组
      parentCateList: [], // 分类数据
      cateDetailProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "", // 当前激活的item
      disabled: true, // 是否禁用按钮
      activeParamsData: [], // 动态表格数据
      staticParamsData: [], // 静态表格数据
      navItem: "many", // 动态参数
      inputVisible: false, // 添加参数
      inputValue: "", // 输入框内容
      paramsDialogVisible: false, // 对话框显示/隐藏
      paramsForm: {
        // 添加参数/属性表单
        name: "",
        id: "",
      },
      paramsRulesForm: {
        name: [
          { required: true, message: "请输入内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取分类数据
    getCateList() {
      getGoodsCategory().then((res) => {
        this.parentCateList = res.data.data;
      });
    },

    // 选中下拉列表触发事件
    cateListChange() {
      if (this.selectKeys.length == 3) {
        // 必须要设置三级数据
        this.getParamsData();
        this.disabled = false; // 禁用按钮
      } else {
        // 否则清空keys数组
        this.selectKeys = [];
        this.disabled = true; // 禁用按钮
        this.activeParamsData = []; // 清除数据
        this.staticParamsData = [];
      }
    },

    // 导航栏切换
    handleClick(tab) {
      if (this.selectKeys.length == 3) {
        if (tab.paneName == "activeParams") {
          this.navItem = "many";
          this.getParamsData(); // 获取数据
        } else {
          this.navItem = "only";
          this.getParamsData(); // 获取数据
        }
      }
    },

    // 获取分类参数
    getParamsData() {
      getCateParams(
        this.selectKeys[this.selectKeys.length - 1],
        this.navItem
      ).then((res) => {
        for (const item of res.data.data) {
          if (item.attr_vals != "") {  // 判断属性值是否为空
            // 遍历属性
            item.attr_vals = item.attr_vals.split(","); // 字符串切割
          } else {
            item.attr_vals = []
          }
        }
        if (this.navItem == "many") {
          this.activeParamsData = res.data.data;
        } else {
          this.staticParamsData = res.data.data;
        }
      });
    },

    // 隐藏输入框  添加tag
    handleInputConfirm(paramsInfo) {
      if (this.inputValue.trim().length != 0) {  // 去除前后空格 判断输入内容是否为空
        paramsInfo.attr_vals.push(this.inputValue.trim())
        addCateParamsTag(
          paramsInfo.cat_id, 
          paramsInfo.attr_id,
          paramsInfo.attr_name,
          this.navItem,
          paramsInfo.attr_vals.toString()).then(res => {
            if (res.data.meta.status == 200) {
              return this.$message.success("添加商品属性成功")
            } 
            this.$message.success("添加商品属性失败")
        })
      }
      this.inputValue = '';  // 清空输入框
      this.inputVisible = false;
    },

    // 显示输入框
    showInput() {
      this.inputVisible = true;  // 隐藏按钮
      this.$nextTick(() => {  // dom节点挂载完成回调函数
        this.$refs.saveTagInput.$refs.input.focus()  // 自动获取焦点
      })
    },

    // 添加参数/属性
    addParams() {
      this.$refs.paramsForm.validate((result) => {
        if (result) {
          if (this.navItem == "many") {
            this.sendAddCateParams()
          } else {
            this.sendAddCateParams()
          }
        } else {
          this.$message.error(this.titleText + "不能为空");
        }
      });
    },

    // 封装请求
    sendAddCateParams() {
      addCateParams(
        this.selectKeys[this.selectKeys.length - 1],
        this.paramsForm.name,
        this.navItem
      ).then((res) => {
        if (res.data.meta.status == 201) {
          this.$message.success("添加" + this.titleText + "成功");
          this.getParamsData(); // 刷新数据
          this.paramsDialogVisible = false;
          this.paramsForm.name = ""; // 清空数据
        } else {
          this.$message.error("添加" + this.titleText + "失败");
        }
      });
    },

    // 删除属性/参数
    deleteParams(paramsInfo) {
      this.$confirm('此操作将永久删除'+this.titleText+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCateParams(paramsInfo.cat_id, paramsInfo.attr_id).then(res => {
          if (res.data.meta.status == 200) {
            this.getParamsData();  // 刷新数据
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message({
              type: 'errpr',
              message: '删除失败'
            });
          }
        })
      }).catch();
    }
  },
  computed: {
    titleText() {
      if (this.navItem == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  components: {
    BrandCrumb,
  },
  // 页面渲染完成生命周期函数
  created() {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName")); // 获取储存数据
    this.getCateList();
  },
};
</script>
<style scoped>
.box-card {
  margin-top: 20px;
}
.el-form {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
}
.input-new-tag {
  width: 80px;
}
</style>