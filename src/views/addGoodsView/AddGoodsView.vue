<template>
  <div id="AddGoodsView">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <el-alert
        :closable="false"
        :title="title"
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
            <el-form-item label="商品分类：" prop="goods_cate">
              <!-- 联动下拉列表 -->
              <el-cascader
                v-model="addForm.goods_cate"
                :props="cateDetailProps"
                :options="parentCateList"
                @change="cateListChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <!-- 复选框组 -->
            <div v-for="(item, index) in checkboxGroup" :key="index" class="checkbox_list_area">
              <div class="checkbox_list_area_title">商品参数名称：{{item.attr_name}}</div>
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox v-for="(tagItem, index2) in item.attr_vals" :key="index2"  :label="tagItem" border></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item v-for="(item, index) in onlyDate" :key="index" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              class="upload-demo"
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="successRespon"
              :headers="headerObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button @click="submitGoodsDetail" class="submit" type="primary">提交商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览提示框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="picVisible"
      width="50%">
      <img style="width: 100%; height: 100%" :src="picUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {getGoodsCategory} from "network/category"
import {getCateParams} from "network/params"
import {addGoodsDetail, getGoodsDetail, editGoodsDetail} from "network/goods"
import _ from "lodash"  // 引入依赖

export default {
  name: "AddGoodsView",
  data() {
    return {
      crumbList: [],
      activeIndex: '0', // 步骤激活索引
      addForm: {  // 添加商品表单
        goods_name: '1',
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cate: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
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
      onlyDate: [],  // 商品参数
      headerObj: {  // 图片上传请求
        Authorization: window.sessionStorage.getItem("token")
      },
      picVisible: false,  // 图片预览
      picUrl: '',  // 预览图片路径
      isAddGoods: true,  // 是否添加商品
      title: '添加商品信息',
    };
  },
  methods: {
    // 判断tab切换
    beforeTabLeave() {
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
        getCateParams(this.addForm.goods_cate[this.addForm.goods_cate.length - 1], 'many').then(res => {
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
          // 参数请求
          getCateParams(this.addForm.goods_cate[this.addForm.goods_cate.length - 1], 'only').then(res => {
            this.onlyDate = res.data.data
          })
        })
      } else {
        this.addForm.goods_cate = []
      }
    },  

    // 图片预览事件
    handlePreview(res) {
      this.picVisible = true
      this.picUrl = res.response.data.url
    },

    // 图片移除事件
    handleRemove(res) {
      const index = this.addForm.pics.findIndex(item => item.pic == res.response.data.tmp_path);
      this.addForm.pics.splice(index, 1)
    },

    // 上传图片成功回调
    successRespon(res) {
      const pirObj = { pic: res.data.tmp_path }
      this.addForm.pics.push(pirObj)
    },

    // 提交商品信息
    submitGoodsDetail() {
      const formInfo = _.cloneDeep(this.addForm)  // 深拷贝
      formInfo.goods_cat = formInfo.goods_cate.toString()
      
      this.checkboxGroup.forEach(item => {
        formInfo.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')
        })
      })
      this.onlyDate.forEach(item => {
        formInfo.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        })
      })
      if (this.$route.params.id == 0) {
        addGoodsDetail(formInfo).then(res =>{
          if (res.data.meta.status == 201) {
            this.$message.success("添加商品成功")
            this.$router.push("/goods")
          } else {
            this.$message.error("添加商品失败")
          }
        })
      } else {
        editGoodsDetail(
          this.$route.params.id,
          formInfo.goods_name,
          formInfo.goods_price,
          formInfo.goods_number,
          formInfo.goods_weight,
          formInfo.goods_introduce,
          formInfo.pics,
          formInfo.attrs,
          formInfo.goods_cat
        ).then(res => {
          if (res.data.meta.status == 200) {
            this.$message.success("修改商品成功")
            this.$router.push("/goods")
          } else {
            this.$message.error("修改商品失败")
          }
        })
      }
    }
  },

  components: {
    BrandCrumb,
  },

  // 页面渲染完成生命周期函数
  created() {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName"))
    getGoodsCategory().then(res => {  // 分类请求
      this.parentCateList = res.data.data
    })

    if (this.$route.params.id != 0) {  // 如果不是添加商品
      this.title = "编辑商品信息"
      getGoodsDetail(this.$route.params.id).then(res => {
        this.addForm.goods_name = res.data.data.goods_name
        this.addForm.goods_price = res.data.data.goods_price
        this.addForm.goods_weight = res.data.data.goods_weight
        this.addForm.goods_number = res.data.data.goods_number
        this.addForm.goods_introduce = res.data.data.goods_introduce
      })
      this.isAddGoods = false  // 隐藏商品属性选项
    } else {
      this.title = "添加商品信息"
    }
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
  margin-left: 0px;
  margin-right: 15px;
  margin-bottom: 10px;
  width: auto;
  /* float: left; */
}
.checkbox_list_area{
  margin-bottom: 20px;
}
.checkbox_list_area_title{
  font-size: 13px;
  margin-bottom: 10px;
  color: rgb(143, 143, 143);
}
.submit{
  margin-top: 15px;
}
</style>