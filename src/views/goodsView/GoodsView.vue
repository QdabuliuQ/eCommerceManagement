<template>
  <div id="GoodsView">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="pageInfo.query"
            class="input-with-select"
            :clearable='true'
            @clear="clearSearchValue"
          >
            <el-button @click="searchGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button @click="goAddView" class="addGoodsBtn" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品数据表格 -->
      <el-table :data="goodsListDate" border style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="480">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120" >
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageInfo.pagesize"
        layout="total, prev, pager, next"
        :total="pageInfo.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {getGoodsDate} from "network/goods"

export default {
  name: "GoodsView",
  data() {
    return {
      crumbList: [],
      goodsListDate: [],  // 商品数据
      pageInfo: {  // 分页信息
        query: '',  // 搜索内容
        pagenum: 1,  // 页码
        pagesize: 6,  // 条数
        total: 0,  // 总条数
      }
    };
  },
  // 页面渲染完成生命周期函数
  created() {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName")); // 获取储存数据
    this.goodsDate();
  },
  methods: {
    goodsDate() {
      getGoodsDate(
        this.pageInfo.query, 
        this.pageInfo.pagenum, 
        this.pageInfo.pagesize).then(res => {
        this.goodsListDate = res.data.data.goods
        this.pageInfo.total = res.data.data.total
      }) 
    },
    
    // 页面发生改变
    handleCurrentChange(newValue) {
      console.log(newValue);
    },

    // 搜索商品
    searchGoodsList() {
      if (this.pageInfo.query.trim().length != 0) {
        this.goodsDate()
      }
    },

    // 清空搜索内容
    clearSearchValue() {
      this.goodsDate()
    },

    // 路由跳转
    goAddView() {
      const arrName = ["商品管理","添加商品"]
      window.sessionStorage.setItem("menuName", JSON.stringify(arrName))
      this.$router.push('/addGoods')
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
.addGoodsBtn {
  margin-left: 15px;
}
.el-table{
  margin-top: 20px;
}
.el-pagination{
  margin-top: 15px;
}
</style>