<template>
  <div class="http-data mt-4">
    <div class="http-data-tabs">
      <div
        v-if="node.meta.data.query"
        @click="activeTab = 1"
        class="http-tabs-item"
        :class="{'http-tabs-item__active' : activeTab === 1}"
      >
        Query params
      </div>
      <div
        v-if="node.meta.data.body"
        @click="activeTab = 2"
        class="http-tabs-item"
        :class="{'http-tabs-item__active' : activeTab === 2}"
      >
        Form params
      </div>
      <div
        v-if="node.meta.response"
        @click="activeTab = 3"
        class="http-tabs-item"
        :class="{'http-tabs-item__active' : activeTab === 3}"
      >
        Response
      </div>
    </div>
    <div class="http-data-body">
      <div v-if="activeTab === 1" class="full-data-table">
        <h5>Query params</h5>
        <table>
          <thead>
            <tr>
              <td>Key</td>
              <td>Value</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dataKey in Object.keys(node.meta.data.query)">
              <td>{{ dataKey }}</td>
              <td>{{ node.meta.data.query[dataKey] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="activeTab === 2" class="full-data-table">
        <h5>Form params</h5>
        <table>
          <thead>
            <tr>
              <td>Key</td>
              <td>Value</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dataKey in Object.keys(node.meta.data.body)">
              <td>{{ dataKey }}</td>
              <td>{{ node.meta.data.body[dataKey] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="activeTab === 3" class="full-data-table">
        <h5>Response</h5>
        <table>
          <thead>
            <tr>
              <td>Key</td>
              <td>Value</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dataKey in Object.keys(node.meta.response)">
              <td>{{ dataKey }}</td>
              <td>{{ node.meta.response[dataKey] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
  </div>
</template>

<script>
export default {
  name: 'HttpUnit',
  props: ['node'],
  data() {
    return {
      activeTab: 1,
    };
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
