<template>
  <div v-if="activeUrl !== null" class="http-data">
    <a :href="'https://git.tag24.ru/tag/assist24/-/tree/'+activeUrlData.debug.git.branch" class="git-row" target="_blank">
      <div class="git-row-title">Branch</div>
      <div class="git-row-value">{{ activeUrlData.debug.git.branch }}</div>
    </a>
    <a :href="'https://git.tag24.ru/tag/assist24/-/blob/'+activeUrlData.debug.git.hash" class="git-row" target="_blank">
      <div class="git-row-title">Commit Hash</div>
      <div class="git-row-value">{{ activeUrlData.debug.git.hash }}</div>
    </a>
    <a :href="'https://git.tag24.ru/tag/assist24/-/blob/'+activeUrlData.debug.git.hash" class="git-row" target="_blank">
      <div class="git-row-title">Commit name</div>
      <div class="git-row-value">{{ activeUrlData.debug.git.name }}</div>
    </a>
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';

export default {
  name: 'GitTab',
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

.git-row {
  border: 1px solid #5b86f7;
  border-radius: 3px;
  background-color: rgba(91, 134, 247, 0.3);
  color: #d7d7d7;
  padding: 15px;
  display: flex;
  margin-top: 15px;
  text-decoration: none;
  &:hover{
    background-color: rgba(91, 134, 247, 0.6);
  }
  
  .git-row-title {
    color: #adadad;
    width: 150px;
  }
  
  .git-row-value {
  }
}
</style>
