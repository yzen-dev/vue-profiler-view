<template>
  <div>
    <template
      v-for="(item, key) in node.breadcrumbs"
    >
      <div>
        <h6>{{ item.title }}</h6>
        <div>
          <pipeline-branch
            v-if="item.type ==='branch'"
            :key="key"
            :activeUrl="activeUrl"
            :node="item"
          />
          <pipeline-item
            v-else
            :key="key"
            :activeUrl="activeUrl"
            :node="item"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import PipelineItem from './PipelineItem';

export default {
  name: 'PipelineBranch',
  components: { PipelineItem },
  props: ['node', 'activeUrl'],
  methods: {
    getRandomColor() {
      let colors = ['#4a9ebb', '#2c66ed', '#8318bc', '#b52eb0',
        '#bc281b', '#e1673e', '#e5c451', '#93d754',
        '#67cba1', '#b4dafc', '#bbbbf9', '#cca4fd',
        '#ad8cfc', '#7f51fd', '#fc6434', '#fea722',
        '#bde500', '#5ebb05', '#058264', '#ff8cd1',
        '#feccff', '#f23fa0', '#ae04b3', '#ffff8f',
        '#a5024b', '#41fd90', '#03cdff', '#6e9cfe',
      ];
      return colors[Math.floor(Math.random() * colors.length)];
      
      /*let letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;*/
    },
  },
};
</script>

<style scoped>

</style>
