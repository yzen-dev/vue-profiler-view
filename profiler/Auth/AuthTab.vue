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
        <tr v-for="key in userKeys">
          <td>{{ key }}</td>
          <td>{{ activeUrlData.debug.user[key] }}</td>
        </tr>
      </tbody>
    </table>
  
  </div>
</template>

<script>
import { ProfilerService } from '../ProfilerService';

export default {
  name: 'AuthTab',
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
    userKeys() {
      return Object.keys(this.activeUrlData.debug.user);
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
