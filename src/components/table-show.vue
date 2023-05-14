<template>
  <el-table :data="data" :width="700" :height="400" fixed>
    <el-table-column prop="symbol" label="股票代码">
      <template #default="scope">{{ scope.row.date || "1111" }}</template>
    </el-table-column>
    <el-table-column prop="name" label="股票名称"> </el-table-column>
    <el-table-column prop="current" label="当前价"> </el-table-column>
    <el-table-column prop="chg" label="涨跌额"> </el-table-column>
    <el-table-column prop="percent" label="涨跌幅"> </el-table-column>
    <el-table-column prop="current_year_percent" label="年初至今">
    </el-table-column>
    <el-table-column prop="volume" label="成交量"> </el-table-column>
    <el-table-column prop="amount" label="成交额"> </el-table-column>
    <el-table-column prop="turnover_rate" label="换手率"> </el-table-column>
    <el-table-column prop="pe_ttm" label="市盈率(TTM)"> </el-table-column>
    <el-table-column prop="dividend_yield" label="股息率"> </el-table-column>
    <el-table-column prop="market_capital" label="市值"> </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
const data = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>
