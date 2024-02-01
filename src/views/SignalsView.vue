<template>
  <div class="h-screen w-screen bg-black grid grid-cols-12">
    <div class="col-span-3 bg-gray-800">
      <div class="" v-for="ticker in tickers" :key="ticker">
        <div
          class="px-4 py-2 bg-slate-100 cursor-pointer border-b hover:bg-white"
          @click="get_signals_history_handler(ticker)"
        >
          {{ ticker }}
        </div>
      </div>
    </div>
    <div class="col-span-9 w-full h-full flex flex-col">
      <div class="bg-white flex-grow max-h-96 min-h-96 p-8">
        <div class="" v-if="!reloadChart"></div>
        <LWChart v-if="isData() && !reloadChart" :data="data" :lines="lines" />
      </div>
      <div class="bg-gray-600">
        <div class="" v-for="(item, index) in signals" :key="index">
          <div
            class="bg-slate-100 cursor-pointer border-b hover:bg-white py-2"
            @click="setSignal(index)"
          >
            Signal: {{ item.info.pattern }}, {{ item.detected_date_utc }},
            {{ getDateString(item.detected_date_utc) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { get_signals_history, get_price_data } from "../db/firebase";
import { ref, reactive, defineExpose } from "vue";
import { getDateString } from "../utils";

import LWChart from "@/components/LWChart.vue";

const tickers = ["ICICIBANK", "BOSCHLTD", "BAJFINANCE"];
const data = ref([]);
const signals = ref([]);
const signal = ref();
const lines = ref([]);
const reloadChart = ref(false);
const setSignal = (index) => {
  console.log("set signal");
  reloadChart.value = true;
  signal.value = signals.value[index];
  lines.value = [];
  lines.value.push(signal.value.highs);
  lines.value.push(signal.value.lows);
  setTimeout(() => {
    reloadChart.value = false;
  }, 250);
};
const get_signals_history_handler = async (ticker) => {
  signals.value = [];
  data.value = [];
  lines.value = [];
  const res = await get_signals_history(ticker);
  console.log("fetched");
  res.forEach((item) => {
    signals.value.unshift(item);
  });
  // lines.value = [signals.value[signals.value.length - 1]];
  setSignal(0);
  let px = await get_price_data(ticker);
  data.value = px;
};

const isData = () => {
  console.log("checking data...");
  return data.value.length > 0;
};
defineExpose({ getDateString });
</script>