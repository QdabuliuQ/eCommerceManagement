<template>
  <div id="CategoryView">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card>
      <el-button @click="showAddCate" type="primary">添加分类</el-button>
      <tree-table
      style="margin-top: 20px; font-size: 13px"
      :selection-type="false"
      :expand-type="false"
      :show-index="true"
      :border="true"
      :data="cateList"
      :columns="columns">
        <!-- 定义模板插槽 -->
        <template slot="isOk" slot-scope="scope">
          <i class="isOkIcon" :class="scope.row.cat_deleted ? 'el-icon-error' : 'el-icon-success'"></i>
        </template>
        <template slot="rank" slot-scope="scope">
          <el-tag size="small" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag size="small" type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag size="small" type="warning" v-else-if="scope.row.cat_level == 2">三级</el-tag>
        </template>
        <template slot="setting" slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="warning">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateInfo.pagenum"
        :page-sizes="[6, 16, 26, 36]"
        :page-size="cateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialog"
      width="40%"
      @close="addCateDialogClose">
      <el-form :model="cateForm" :rules="addCateRules" ref="addCateCuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="cat_name" label="分类名称：">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
          :clearable="true"
          :props="cateDetailProps"
          v-model="cateValue"
          :options="parentCateList"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCateDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {getGoodsCategory, postAddCateDetail} from "network/category"

export default {
  name: "CategoryView",
data() {
    return {
      crumbList: [],
      cateList: [],  // 分类数据
      cateInfo: {  // 分页信息
        pagenum: 1,
        pagesize: 6
      },
      total: 0,  // 总条数
      columns: [
        {label: '名称', prop: 'cat_name'},
        {label: '是否有货', prop:'cat_deleted', type: 'template', template: 'isOk'},
        {label: '货物等级', prop:'cat_level', type: 'template', template: 'rank'},
        {label: '操作', type: 'template', template: 'setting'}
      ],
      addCateDialog: false,  // 添加分类对话框
      cateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      cateValue: [],  // 以选中数组
      parentCateList: [],  // 分类数据
      cateDetailProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      }
    };
  },
  methods: {
    goodsCategory(){
      getGoodsCategory("", this.cateInfo.pagenum, this.cateInfo.pagesize).then(res => {
        this.cateList = res.data.data.result
        this.total = res.data.data.total
      })
    },

    // 条数发生改变
    handleSizeChange(newValue) {
      this.cateInfo.pagesize = newValue;
      this.goodsCategory()
    },

    // 页码发生改变
    handleCurrentChange(newValue) {
      this.cateInfo.pagenum = newValue;
      this.goodsCategory()  // 获取父级列表
    },

    // 显示添加分类对话框
    showAddCate() {
      this.getCateList()
      this.addCateDialog = true
    },

    // 获取分类数据
    getCateList() {
      getGoodsCategory(2).then(res => {
        this.parentCateList = res.data.data
      })
    },

    // 提交分类按钮
    addCateDetail() {
      this.$refs.addCateCuleForm.validate(result => {  // 调用函数进行表单验证
        if (result) {  // 验证通过
          if (this.cateValue.length > 0) {  // 说明添加的分类不是一级分类
            this.cateForm.cat_pid = this.cateValue[this.cateValue.length - 1];  // 保存最后一个元素，即父类id
            this.cateForm.cat_level = this.cateValue.length;  // 保存等级
            this.sendNetworkCate(this.cateForm.cat_pid, this.cateForm.cat_name, this.cateForm.cat_level)
          } else {  // 进入一级分类判断
            this.sendNetworkCate(this.cateForm.cat_pid, this.cateForm.cat_name, this.cateForm.cat_level)
          }
        } else {
          this.$message.error("分类名称不能为空")
        }
      })
    },

    // 发送添加分类网络请求
    sendNetworkCate(cat_pid, cat_name, cat_level) {
      postAddCateDetail(cat_pid, cat_name, cat_level).then(res => {
        if (res.data.meta.status == 201) {
          this.goodsCategory();  // 刷新数据
          this.$message.success("添加分类成功")
          this.cateForm.cat_pid = 0;  // 重置数据
          this.cateForm.cat_level = 0;  // 重置数据
          this.addCateDialog = false  // 隐藏对话框
        } else {
          this.$message.error("添加分类失败")
        }
      })
    },

    // 添加分类对话框关闭
    addCateDialogClose() {
      this.cateForm.cat_name = ""
      this.cateForm.cat_pid = 0;  // 重置数据
      this.cateForm.cat_level = 0;  // 重置数据
    }
  },
  components: {
    BrandCrumb,
  },

  // 页面渲染完成生命周期函数
  created() {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName")); // 获取储存数据
    this.goodsCategory()
  },
};
</script>
<style scoped>
.el-card {
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
.el-pagination{
  margin-top: 10px;
}
.isOkIcon{
  color: rgb(41, 168, 226);
  font-size: 16px;
  position: relative;
  top: 2px;
}
.el-cascader{
  width: 100%;
}
</style>