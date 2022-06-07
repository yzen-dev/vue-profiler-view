<template>
  <div v-if="activeUrl !== null" class="http-data">
    <button
      @click="exportRequest"
      class="button-open-full-data"
    >
      Export request
    </button>
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';

export default {
  name: 'ExportTab',
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
  methods:{
    exportRequest(){
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.activeUrlData)));
      element.setAttribute('download', 'request.json');
  
      element.style.display = 'none';
      document.body.appendChild(element);
  
      element.click();
  
      document.body.removeChild(element);
    }
  }
};
</script>

<style lang="scss" scoped>
.button-open-full-data {
  border: 1px solid #74b666;
  border-radius: 3px;
  background-color: rgba(116, 182, 102, 0.3);
  color: #d7d7d7;
  padding: 0 15px;
  height: 40px;
  width: 200px;
  
  &:hover {
    color: white;
    background-color: rgba(116, 182, 102, 1);
  }
}
</style>
