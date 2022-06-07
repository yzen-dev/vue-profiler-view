<template>
  <div class="breadcrumbs-branch">
    <div class="breadcrumbs-branch-wrapper" :style="{color: getRandomColor()}">
      <div class="branch-header">
        <button @click="showDetails = !showDetails" class="toggle-branch-btn">
          <template v-if="showDetails">
            -
          </template>
          <template v-else>
            +
          </template>
        </button>
        <div class="branch-header-title">
          <h4>{{ node.title }}</h4>
          <div class="branch-header-badges">
            <i class="http-badge" :class="getTimeLevel(node.time)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ getTime(node.time) }}
            </i>
            <i class="http-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
              {{ getMemory(node.memory) }}
            </i>
            <i class="http-badge">
              SQL: {{ node.stats.sql }}
            </i>
            <i class="http-badge">
              HTTP: {{ node.stats.http }}
            </i>
          </div>
        </div>
      </div>
      <div v-show="showDetails" class="breadcrumbs-list">
        <template
          v-for="(item, key) in node.breadcrumbs"
        >
          <branch-breadcrumbs
            v-if="item.type ==='branch'"
            :key="key"
            :activeUrl="activeUrl"
            :node="item"
          />
          <breadcrumbs-item
            v-else
            :key="key"
            :activeUrl="activeUrl"
            :node="item"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import BreadcrumbsItem from './BreadcrumbsItem';
import { ProfilerService } from '../ProfilerService';

export default {
  name: 'BranchBreadcrumbs',
  components: { BreadcrumbsItem },
  props: ['node', 'activeUrl'],
  data() {
    return {
      profiler: ProfilerService.instance,
      showDetails: false,
    };
  },
  computed: {
    activeUrlData() {
      return this.profiler.httpRequests[this.activeUrl];
    },
  },
  methods: {
    uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
      );
    },
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
    getTime(time, title = false) {
      let icon = '';
      if (title) {
        icon += 'Time ' + this.formattedTime(time) + ' (' + this.getPercent(time) + ')';
      } else {
        icon += this.formattedTime(time) + ' (' + this.getPercent(time) + ')';
      }
      return icon;
      
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
    getMemory(memory, title) {
      let icon = '';
      if (title) {
        icon += 'Memory ' + memory;
      } else {
        icon += memory;
      }
      return icon;
    },
  },
};
</script>

<style scoped>

</style>
