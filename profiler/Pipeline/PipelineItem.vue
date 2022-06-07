<template>
  <div>
    <h6>{{ node.title }}</h6>
    <div
      :style="{width:getWidth,marginLeft:getOffset}"
      class="pipeline-item"
    />
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';

export default {
  name: 'PipelineItem',
  props: ['node', 'activeUrl'],
  data() {
    return {
      profiler: ProfilerService.instance,
    }
  },
  computed: {
    activeUrlData() {
      return this.profiler.httpRequests[this.activeUrl];
    },
    getWidth() {
      return '10%';
    },
    getOffset() {
      
      return '10%';
    },
  },
  methods: {
    roundValue(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    },
    getPercent(time, timeStart) {
      let percent = (parseFloat(time) / parseFloat(timeStart)) * 100;
      return this.roundValue(percent);
    },
  },
};
</script>

<style scoped>
.pipeline-item {
  background-color: rebeccapurple;
  height: 10px;
}
</style>
