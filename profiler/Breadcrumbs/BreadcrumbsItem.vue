<template>
  <div class="breadcrumbs-branch-node">
    <div class="branch-node-wrapper">
      <div class="http-badge-list">
        <span class="http-badge">{{ node.type }}</span>
        <span class="http-badge" :class="getTimeLevel(node.time)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round"> <circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline></svg>
              {{ getTime(node.time) }}
        </span>
      </div>
      <div class="http-data">
        <template v-if="node.type === 'sql'">
          {{ node.meta.query }}
        </template>
        <template v-else-if="node.type === 'http'">
          <div class="d-flex">
            <span class="http-badge">{{ node.method }}</span>
            {{ node.meta.url }}
          </div>
        </template>
        <template v-else>
          {{ node.title }}
        </template>
        <div v-if="issetOtherData" class="full-data">
          <button
            @click="showFull=!showFull"
            class="button-open-full-data"
          >
            Open full data
          </button>
          <div v-if="showFull">
            <stack-trace-table
              :activeUrl="activeUrl"
              :stacktrace="node.stacktrace"
            />
            
            <http-unit
              v-if="node.type==='http'"
              :node="node"
              />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';
import StackTraceTable from '../_components/StackTraceTable';
import HttpUnit from './units/HttpUnit';

export default {
  name: 'BreadcrumbsItem',
  components: { HttpUnit, StackTraceTable },
  props: ['node', 'activeUrl'],
  data() {
    return {
      profiler: ProfilerService.instance,
      showFull: false,
      otherInfoMap: {
        'http': [
          {
            title: 'Query params',
            key: 'query',
          },
          {
            title: 'Form params',
            key: 'body',
          },
          {
            title: 'Response',
            key: 'response',
          },
        ],
      },
    };
  },
  computed: {
    activeUrlData() {
      return this.profiler.httpRequests[this.activeUrl];
    },
    issetOtherData() {
      return this.node.stacktrace || this.node.meta.data;
    },
  },
  methods: {
    roundValue(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    },
    formattedTime(time) {
      let t = parseFloat(time);
      if (t < 1) {
        return this.roundValue((t * 1000)) + ' ms';
      }
      return this.roundValue(t) + ' sec';
    },
    getPercent(time) {
      let percent = (parseFloat(time) / parseFloat(this.activeUrlData.debug.executedTime)) * 100;
      return this.roundValue(percent) + '%';
    },
    getTimeLevel(time) {
      if (time > 1 && time <=3){
        return 'http-badge__level_1'
      }
      if (time > 3 && time <=5){
        return 'http-badge__level_2'
      }
    
      if (time > 5 && time <=10){
        return 'http-badge__level_3'
      }
    
      if (time > 10){
        return 'http-badge__level_4'
      }
    
    },
    getTime(time, title = false) {
      let icon = '';
      if (title) {
        icon += 'Time ' + this.formattedTime(time) + ' (' + this.getPercent(time) + ')';
      } else {
        icon += this.formattedTime(time) + ' (' + this.getPercent(time) + ')';
      }
      return icon;
      
    },
  },
};
</script>

<style scoped lang="scss">
.full-data {
  margin-top: 15px;
  
  .full-data-table {
    margin-top: 10px;
  }
}

.button-open-full-data {
  border: 1px solid #74b666;
  border-radius: 3px;
  background-color: rgba(116, 182, 102, 0.3);
  color: #d7d7d7;
  padding: 0 15px;
  height: 100%;
  width: 200px;
  
  &:hover {
    color: white;
    background-color: rgba(116, 182, 102, 1);
  }
}

.breadcrumbs-branch-node {
  padding-top: 15px;
  padding-bottom: 15px;
  position: relative;
  
  &:first-child {
    padding-top: 25px;
  }
  
  .branch-node-wrapper {
    border-left: 1px solid currentColor;
    margin-left: 10px;
    padding: 10px;
  }
  
  &:before,
  &:after {
    content: "";
    display: block;
    position: absolute;
    top: -2px;
    /*left: -35px;*/
    left: -20px;
    width: 30px;
    border-color: currentColor;
  }
  
  &:before {
    height: 100%;
    border-left-style: solid;
    border-left-width: 2px;
  }
  
  &:last-child:before {
    height: 0;
  }
  
  &:after {
    height: 50%;
    border-left-style: solid;
    border-left-width: 2px;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-left-radius: 15px;
  }
  
}



</style>
