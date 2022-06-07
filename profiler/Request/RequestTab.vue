<template>
  <div v-if="activeUrl !== null" class="http-data">
    <table>
      <thead>
        <tr>
          <td>Key</td>
          <td>Value</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in requestKeys">
          <td>{{ key }}</td>
          <td>{{ activeUrlData.debug.request[key] }}</td>
        </tr>
      </tbody>
    </table>
  
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';

export default {
  name: 'RequestTab',
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
    requestKeys() {
      return Object.keys(this.activeUrlData.debug.request);
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
    background: #445688;
  }
  
  tbody tr {
    
    &:nth-child(even) {
      background-color: #292a31;
    }
    
  }
}
</style>
