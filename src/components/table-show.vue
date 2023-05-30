<template>
  <el-form :model="formState" :inline="true">
    <el-form-item label="市值范围(亿)">
      <el-input-number
        v-model="formState.marketLeft"
        :step="1"
        :controls="false"
        placeholder="请输入"
      />
      <span>&nbsp;至&nbsp;</span>
      <el-input-number
        v-model="formState.marketRight"
        :controls="false"
        :step="1"
        placeholder="请输入"
      />
    </el-form-item>
    <el-form-item label="股票名称">
      <el-input v-model="formState.name" />
    </el-form-item>
    <el-form-item label="股票代码">
      <el-input v-model="formState.symbol" />
    </el-form-item>
    <el-form-item label="市盈率(*以下)">
      <el-input v-model="formState.peTTM" />
    </el-form-item>
    <el-form-item label="股息率(*以上)">
      <el-input v-model="formState.dividendYield" />
    </el-form-item>
    <el-form-item label="时间">
      <el-date-picker
        v-model="formState.time"
        type="date"
        label="Pick a date"
        placeholder="Pick a date"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">Query</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="data" fixed>
    <el-table-column prop="symbol" label="股票代码" width="150">
      <template #default="scope">
        <a :href="`https://xueqiu.com/S/${scope.row.symbol}`" target="_blank">{{
          scope.row.symbol
        }}</a>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="股票名称" width="150">
      <template #default="scope">
        <a :href="`https://xueqiu.com/S/${scope.row.symbol}`" target="_blank">{{
          scope.row.name
        }}</a>
      </template>
    </el-table-column>
    <el-table-column prop="current" label="当前价" width="150">
      <template #default="scope">
        <span
          :class="{
            'default-txt': true,
            'red-txt': scope.row.current > 0,
            'green-txt': scope.row.current < 0,
          }"
          >{{ scope.row.current }}</span
        >
      </template>
    </el-table-column>
    <el-table-column prop="chg" label="涨跌额" width="150">
      <template #default="scope">
        <span
          :class="{
            'default-txt': true,
            'red-txt': scope.row.chg > 0,
            'green-txt': scope.row.chg < 0,
          }"
          >{{ scope.row.chg }}</span
        >
      </template>
    </el-table-column>
    <el-table-column prop="percent" label="涨跌幅" width="150">
      <template #default="scope">
        <span
          :class="{
            'default-txt': true,
            'red-txt': scope.row.percent > 0,
            'green-txt': scope.row.percent < 0,
          }"
          >{{ scope.row.percent }}%</span
        >
      </template>
    </el-table-column>
    <el-table-column prop="current_year_percent" label="年初至今" width="150">
      <template #default="scope">
        <span
          :class="{
            'default-txt': true,
            'red-txt': scope.row.current_year_percent > 0,
            'green-txt': scope.row.current_year_percent < 0,
          }"
          >{{ scope.row.current_year_percent }}%</span
        >
      </template>
    </el-table-column>
    <el-table-column prop="volume" label="成交量" width="150">
      <template #default="scope">
        <span>{{ getMoneyToText(scope.row.volume) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="amount" label="成交额" width="150">
      <template #default="scope">
        <span>{{ getMoneyToText(scope.row.amount) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="turnover_rate" label="换手率" width="150">
      <template #default="scope">
        <span>{{ getPercentage(scope.row.turnover_rate) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="pe_ttm" label="市盈率(TTM)" width="150">
      <template #default="scope">
        <span>{{ getPeTTM(scope.row.pe_ttm) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="dividend_yield" label="股息率" width="150">
      <template #default="scope">
        <span>{{ getPercentage(scope.row.dividend_yield) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="market_capital"
      label="市值(亿)"
      width="150"
      fixed="right"
    >
      <template #default="scope">
        <span>{{ Math.ceil(scope.row.market_capital / 100000000) }}亿</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pageInfo.page"
    v-model:page-size="pageInfo.size"
    hide-on-single-page
    style="justify-content: center; padding-top: 20px"
    :page-sizes="[10, 50, 100, 200, 300]"
    layout="prev, pager, next, sizes"
    :total="pageInfo.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "tabelShow",
  components: {},
  filters: {
    getWan: (num) => {
      return Math.ceil(num / 10000);
    },
  },
  data() {
    return {
      data: [],
      formState: {
        name: "",
        time: "",
        symbol: "",
        peTTM: null,
        marketLeft: null,
        marketRight: null,
        dividendYield: null,
      },
      pageInfo: {
        total: 0,
        size: 10,
        page: 1,
      },
      rules: [],
    };
  },
  async created() {
    this.findFileDir(this.formState);
  },
  methods: {
    getMoneyToText(num) {
      console.log(num);
      if (num > 100000000) {
        return `${(num / 100000000).toFixed(2)}亿`;
      } else if (num > 10000000) {
        return `${(num / 10000).toFixed(2)}万`;
      }
      return `${(num / 10000).toFixed(2)}万`;
    },
    getPercentage(num) {
      if (!num) {
        return "-";
      }
      return `${num}%`;
    },
    getPeTTM (ttm) {
      if (ttm > 0) {
        return ttm.toFixed(2)
      }else if (ttm < 0) {
        return '亏损'
      }
      return '-'
    },
    momentTime(times) {
      return times
        ? moment(times).format("YYYY-M-D")
        : moment().format("YYYY-M-D");
    },
    handleSubmit() {
      this.findFileDir(this.formState);
    },
    resetForm() {},
    async findFileDir() {
      const params = Object.assign({}, this.formState, {
        page: this.pageInfo.page,
        size: this.pageInfo.size,
        time: this.momentTime(this.formState.time),
      });
      const {
        data: { code, data },
      } = await axios.get("http://localhost:3000/get-json", { params });
      this.data = [];
      if (code === 0) {
        const { record, page, size, total } = data;
        this.data = record;
        Object.assign(this.pageInfo, {
          page: Number(page),
          size: Number(size),
          total,
        });
      }
    },
    handleSizeChange(size) {
      console.log(size);
      console.log(this.pageInfo);
      this.findFileDir(this.formState);
    },
    handleCurrentChange(page) {
      console.log(page);
      console.log(this.pageInfo);
      this.findFileDir(this.formState);
    },
  },
};
</script>
<style scoped>
.default-txt {
  color: #000;
}
.red-txt {
  color: red;
}
.green-txt {
  color: green;
}
</style>
