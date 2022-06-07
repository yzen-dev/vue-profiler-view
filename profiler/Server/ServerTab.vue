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
        <tr v-for="key in serverKeys">
          <td>{{ key }}</td>
          <td>{{ activeUrlData.debug.server[key] }}</td>
        </tr>
      </tbody>
    </table>
  
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';

export default {
  name: 'ServerTab',
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
    serverKeys() {
      return Object.keys(this.activeUrlData.debug.server);
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
