<template>
  <div v-if="activeUrl !== null" class="http-data">
    <h3 class="exception-title">
      {{ activeUrlData.exception.error }} - {{ activeUrlData.exception.message }}
    </h3>
    <a
      :href="'https://git.tag24.ru/tag/assist24/-/blob/'+activeUrlData.debug.git.hash + activeUrlData.exception.file+'#L'+activeUrlData.exception.line"
      class="file-error"
    >
      {{ activeUrlData.exception.file }}:{{ activeUrlData.exception.line }}
    </a>
    <stack-trace-table :activeUrl="activeUrl" :stacktrace="activeUrlData.exception.trace"/>
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';
import StackTraceTable from '../_components/StackTraceTable';

export default {
  name: 'ExceptionTab',
  components: { StackTraceTable },
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
    
  },
};
</script>

<style lang="scss" scoped>

.exception-title {
  width: 100%;
  color: #c7c7c7;
}

.file-error {
  border: 1px solid #d93c3c;
  border-radius: 3px;
  background-color: rgba(217, 60, 60, 0.3);
  color: #d7d7d7;
  padding: 15px;
  display: flex;
  margin-top: 15px;
  text-decoration: none;
}
</style>
