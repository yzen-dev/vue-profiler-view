<template>
  <div class="stacktrace">
    <h5>Stacktrace</h5>
    <ul class="stacktrace-list">
      <li v-for="trace in stacktrace">
        <template v-if="trace.file && trace.line">
          <a
            v-if="!isVendorFile(trace.file)"
            :href="'https://git.tag24.ru/tag/assist24/-/blob/'+activeUrlData.debug.git.hash + prepareFile(trace.file)+'#L'+trace.line"
            class="stacktrace-file"
            target="_blank"
          >
            {{ prepareFile(trace.file) }}:{{ trace.line }}
          </a>
          <a v-else class="stacktrace-file vendor-class">
            {{ prepareFile(trace.file) }}:{{ trace.line }}
          </a>
        </template>
        <a
          v-else-if="trace.class && trace.function"
          class="stacktrace-file"
        >
          {{ prepareFile(trace.class) }}::{{ trace.function }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';

export default {
  name: 'StackTraceTable',
  props: ['stacktrace', 'activeUrl'],
  computed: {
    activeUrlData() {
      return this.profiler.httpRequests[this.activeUrl];
    },
  },
  data() {
    return {
      profiler: ProfilerService.instance,
    };
  },
  methods:{
    isVendorFile(file){
      return file.includes(this.activeUrlData.debug.projectDir+'/vendor')
    },
    prepareFile(file){
      return file.replace(this.activeUrlData.debug.projectDir, '').replace('\\', '/')
    }
  }
};
</script>

<style lang="scss" scoped>
.stacktrace {
  border: 1px solid #445688;
  border-radius: 3px;
  background-color: rgba(68, 86, 136, 0.3);
  color: #d7d7d7;
  padding: 15px;
  margin-top: 15px;
  
  .stacktrace-list {
    text-decoration: none;
    list-style: none;
    
    li {
      padding: 10px 0;
      
      .stacktrace-file {
        color: #adadad;
        
        &:not(.vendor-class):hover {
          color: rgba(91, 134, 247, 0.6);
        }
        
        &.vendor-class {
          cursor: not-allowed;
        }
      }
    }
  }
  
}
</style>
