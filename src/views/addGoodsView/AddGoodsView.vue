<template>
  <div id="AddGoodsView">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <el-alert
        :closable="false"
        title="添加商品信息"
        type="info"
        center
        show-icon
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        process-status="finish"
        align-center
        :space="400"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
        ref="addGoodsForm"
        label-width="100px"
      >
        <!-- tab栏 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClickEvent"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称：" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量：" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" prop="goods_cate">
              <!-- 联动下拉列表 -->
              <el-cascader
                v-model="addForm.goods_cate"
                :props="cateDetailProps"
                :options="parentCateList"
                @change="cateListChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <div v-for="(item, index) in checkboxGroup" :key="index" class="checkbox_list_area">
              <div class="checkbox_list_area_title">商品参数名称：{{item.attr_name}}</div>
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox  v-for="(tagItem, index2) in item.attr_vals" :key="index2"  :label="tagItem" border></el-checkbox>
              </el-checkbox-group>
            </div>
            
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性"></el-tab-pane>
          <el-tab-pane name="3" label="商品图片"></el-tab-pane>
          <el-tab-pane name="4" label="商品内容"></el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {getGoodsCategory} from "network/category"
import {getCateParams} from "network/params"

export default {
  name: "AddGoodsView",
  data() {
    return {
      crumbList: ["商品管理", "添加商品"],
      activeIndex: '0', // 步骤激活索引
      addForm: {  // 添加商品表单
        // goods_name: '',
        // goods_price: null,
        // goods_weight: null,
        // goods_number: null,
        goods_name: '',
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cate: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cate: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ]
      },
      cateDetailProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      parentCateList: [],  // 商品分类数据
      checkboxGroup: [],  // 参数多选框
    };
  },
  methods: {
    // 判断tab切换
    beforeTabLeave(activeName, oldActiveName) {
      let flag = false;
      this.$refs.addGoodsForm.validate(res => {
        if (res) {
          flag = res
        } 
        flag = res
      });
      return flag
    },

    // 选择器发送改变回调函数
    cateListChange() {
      if (this.addForm.goods_cate.length == 3) {  // 必须选中三级
        
      } else {
        this.addForm.goods_cate = []
      }
    },

    // tab栏点击事件
    tabClickEvent() {
      if (this.activeIndex == 1) {  // 进入了商品参数页面
        getCateParams(this.addForm.goods_cate[this.addForm.goods_cate.length - 1], 'many').then(res => {
          console.log(res);
          for (const item of res.data.data) {
            if (item.attr_vals != "") {
            // 判断属性值是否为空
            // 遍历属性
              item.attr_vals = item.attr_vals.split(","); // 字符串切割
            } else {
              item.attr_vals = [];
            }
          }
          this.checkboxGroup = res.data.data
        })
      }
    }
  },

  components: {
    BrandCrumb,
  },

  // 页面渲染完成生命周期函数
  created() {
    getGoodsCategory().then(res => {
      this.parentCateList = res.data.data
    })
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.el-steps {
  margin: 20px 0;
}
.el-form-item{
  margin-left: 10px;
}
.el-checkbox{
  margin-right: 5px;
  width: auto;
  /* float: left; */
}
.checkbox_list_area{
  margin-bottom: 20px;
}
.checkbox_list_area_title{
  /* width: 100%; */
  font-size: 13px;
  margin-bottom: 10px;
  color: rgb(143, 143, 143);
}
</style>