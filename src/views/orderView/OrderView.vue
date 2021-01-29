<template>
  <div id="OrderView">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <el-input class="searchInput" placeholder="请输入内容" v-model="networkInfo.query">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table :data="orderData" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="#" >
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="360" >
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120"> 
        </el-table-column>
        <el-table-column prop="" label="是否付款" width="120"> 
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.pay_status == 1" type="success">已付款</el-tag>
            <el-tag size="small" v-else type="warning">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editAddress(scope.row)" size="mini" icon="el-icon-edit" type="primary"></el-button>
            <el-button @click="showProgress(scope.row)" size="mini" icon="el-icon-location-outline" type="success"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="networkInfo.pagenum"
        :page-sizes="[6, 15, 20, 25]"
        :page-size="networkInfo.pagesize"
        layout="total, sizes, prev, pager, next"
        :total="networkInfo.total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialog"
      width="40%"
      @close="addressDialogClose">
      <el-form :model="addressForm" :rules="addressRules" ref="addressRulesForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县：" prop="address">
          <el-cascader :options="cityData" v-model="addressForm.address"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="detailedAddress">
          <el-input v-model="addressForm.detailedAddress"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px" label="是否发货：">
          <el-radio v-model="editOrderData.is_send" label='0'>未发货</el-radio>
          <el-radio v-model="editOrderData.is_send" label='1'>已发货</el-radio>
        </el-form-item>
        <el-form-item label="支付方式：">
          <el-radio @change="payMethod" v-model="editOrderData.order_pay" label='0'>未支付</el-radio>
          <el-radio @change="payMethod" v-model="editOrderData.order_pay" label='1'>支付宝</el-radio>
          <el-radio @change="payMethod" v-model="editOrderData.order_pay" label='2'>微信</el-radio>
          <el-radio @change="payMethod" v-model="editOrderData.order_pay" label='3'>银行卡</el-radio>
        </el-form-item>
        <el-form-item label="订单价格：">
          <el-input type="number" v-model="editOrderData.order_price"></el-input>
        </el-form-item>
        <el-form-item label="订单数量：">
          <el-input type="number" v-model="editOrderData.order_number"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px" label="支付状态：">
          <el-radio v-model="editOrderData.pay_status" label='0'>未付款</el-radio>
          <el-radio :disabled="editOrderData.order_pay == '0'" v-model="editOrderData.pay_status" label='1'>已付款</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialog"
      width="40%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in propressData"
            :key="index"
            :timestamp="activity.time"
            :color="activity.color">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {getOrderData, getProgressData, editOrderData} from "network/order"
import cityData from "common/cityData"

export default {
  name: "OrderView",
  data() {
    return {
      crumbList: [],
      orderData: [],  // 订单数据
      networkInfo: {
        query: "", // 搜索文本
        pagenum: 1,
        pagesize: 6,
        total: 0
      },
      editAddressDialog: false,  // 修改订单对话框
      addressForm: {
        address: [],
        detailedAddress: ''
      },
      addressRules: {
        address: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        detailedAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
      },
      cityData,  // 城市数据
      progressDialog: false,  // 物流进度对话框
      propressData: [],
      editOrderData: {
        is_send: '0',  // 是否发货
        order_pay: '0',  // 是否支付
        order_price: null,
        order_number: null,
        pay_status: '0',  // 支付状态
        order_id: '',  // 订单id
      }
    };
  },

  methods: {
    // 获取数据
    OrderData() {
      getOrderData(
        this.networkInfo.query, 
        this.networkInfo.pagenum, 
        this.networkInfo.pagesize
      ).then(res => {
        
        this.orderData = res.data.data.goods
        console.log(this.orderData);
        this.networkInfo.total = res.data.data.total
      })
    },

    // 页数切换
    handleCurrentChange(value) {
      this.networkInfo.pagenum = value
      this.OrderData()
    },

    // 数量切换
    handleSizeChange(value) {
      this.networkInfo.pagesize = value
      this.OrderData()
    },

    // 修改地址
    editAddress(orderInfo) {
      this.editAddressDialog = true
      this.editOrderData.order_id = orderInfo.order_id
    },

    // 监听对话框的关闭
    addressDialogClose() {
      this.$refs.addressRulesForm.resetFields();  // 重置数据
    },

    // 修改地址
    submitAddress() {
      this.$refs.addressRulesForm.validate(res => {
        if (res) {
          editOrderData(
            this.editOrderData.order_id,
            this.editOrderData.is_send,
            this.editOrderData.order_pay,
            this.editOrderData.order_price,
            this.editOrderData.order_number,
            this.editOrderData.pay_status,
          ).then(res2 => {
            console.log(res2);
            console.log(this.editOrderData);
            if (res2.data.meta.status == 201) {
              this.OrderData()
              this.$message.success("修改订单信息成功")
              this.editAddressDialog = false
            } else {
              this.$message.error("修改订单信息失败")
            }
          })
        } else {
          this.$message.error("地址信息不能为空")
        }
      })
    },

    // 显示物流信息对话框
    showProgress(goodsInfo) {
      this.progressDialog = true;
    },

    // 支付方式切换
    payMethod(value) {
      if (value == 0) {
        this.editOrderData.pay_status = '0'
      }
    }
  },

  // 页面渲染完成生命周期函数
  created() {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName")); // 获取储存数据
    this.OrderData()
    getProgressData('1106975712662').then(res => {
      res.data.data[0].color = '#0bbd87'
      this.propressData = res.data.data
    })
  },
  // 注册组件
  components: {
    BrandCrumb,
  },
};
</script>
<style scoped>
.box-card {
  margin-top: 20px;
}
.searchInput {
  width: 30%;
}
.el-pagination{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>