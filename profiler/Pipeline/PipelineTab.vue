<template>
  <div v-if="activeUrl !== null" class="http-data">
    <pipeline-branch
      v-if="activeUrlData"
      :activeUrl="activeUrl"
      :node="activeUrlData.debug.breadcrumbs.main"
    />
  
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';
import PipelineBranch from './PipelineBranch';

export default {
  name: 'PipelineTab',
  components: { PipelineBranch },
  props: {
    activeUrl: {
      default: null,
    },
  },
  data() {
    return {
      profiler: ProfilerService.instance,
    };
  },
  computed: {
    activeUrlData() {
      return this.profiler.httpRequests[this.activeUrl];
    },
    bootTimePercent() {
      ((activeUrlData.debug.executedTime / activeUrlData.debug.executedTime) * activeUrlData.debug.executedTime) / 100;
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border: 1px solid black;
  
  td {
    padding: 10px 15px;
  }
  
  thead tr {
    background: #36304a;
  }
  
  tbody tr {
    
    &:nth-child(even) {
      background-color: #00498b;
    }
    
  }
}
</style>
