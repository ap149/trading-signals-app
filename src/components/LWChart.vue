<template>
  <div class="bg-gray-400 h-full w-full">
    <div class="lw-chart" ref="chartContainer"></div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  defineExpose,
  defineProps,
} from "vue";
import { getTimeFromUTC, getChartTimeFromUTC } from "../utils";
import {
  createChart,
  CandlestickStyleOptions,
  CrosshairMode,
} from "lightweight-charts";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  lines: {
    type: Array,
  },
});

let series;
let chart;

const chartContainer = ref();

const fitContent = () => {
  if (!chart) return;
  chart.timeScale().fitContent();
};

const getChart = () => {
  return chart;
};

defineExpose({ fitContent, getChart });

const chartOptions = {
  wickUpColor: "rgb(0,0,0)",
  wickDownColor: "rgb(0,0,0)",
  borderUpColor: "rgb(0,0,0)",
  borderDownColor: "rgb(0,0,0)",
};

const processLine = (line) => {
  const start = line.start_utc;
  const end = props.data[props.data.length - 1].time;
  const periods =
    props.data.length - props.data.map((e) => e.time).indexOf(line.start_utc);
  const d1 = line.b * periods + line.c;
  const d0 = line.c;
  const data = [
    { time: start, value: d0 },
    { time: end, value: d1 },
  ];
  return data;
};

const addSeriesAndData = (props) => {
  series = chart["addCandlestickSeries"](chartOptions);
  series.setData(props.data);
  props.lines.forEach((element) => {
    const data = processLine(element);
    let line = chart.addLineSeries({
      color: "rgb(0,0,0)",
      lineWidth: 2,
      // disabling built-in price lines
      lastValueVisible: false,
      priceLineVisible: false,
    });

    line.setData(data);
  });
};

onMounted(() => {
  // Create the Lightweight Charts Instance using the container ref.
  // console.log("Moountesd");

  chart = createChart(chartContainer.value);
  addSeriesAndData(props);
  chart.applyOptions({
    crosshair: {
      // Change mode from default 'magnet' to 'normal'.
      // Allows the crosshair to move freely without snapping to datapoints
      mode: CrosshairMode.Normal,
    },
  });
  chart.timeScale().fitContent();
});

onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }
  if (series) {
    series = null;
  }
});
</script>

<style>
.lw-chart {
  height: 100%;
}
</style>