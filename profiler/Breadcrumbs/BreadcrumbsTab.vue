<template>
  <div class="breadcrumbs-list main-branch">
    <branch-breadcrumbs
      v-if="activeUrlData"
      :activeUrl="activeUrl"
      :node="activeUrlData.debug.breadcrumbs.main"
    />
  </div>
  <!--  <div
      class="breadcrumbs-list main-branch"
      v-html="renderProfilerTree(activeUrlData.debug.breadcrumbs.main)"
    />-->
</template>

<script>
import Modal from '../../ui/Modals/Modal';
import { ProfilerService } from '../ProfilerService';
import BranchBreadcrumbs from './BranchBreadcrumbs';

export default {
  name: 'BreadcrumbsTab',
  components: {
    BranchBreadcrumbs,
    Modal,
  },
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
  methods: {
    uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
      );
    },
    getRandomColor() {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    getUnitByType(row) {
      if (row.type === 'sql') {
        return row.data.query;
      }
      if (row.type === 'http') {
        return row.data.url;
      }
      return row.title;
    },
    renderProfilerUnit(row) {
      let profilerUnit = '';
      profilerUnit +=
        '<div> ' +
        '<div class="http-badge-list"> ' +
        '<span class="http-badge">' + row.type + '</span> ' +
        '<span class="http-badge"> ' + this.getSvgTime(row.time) + '</span>' +
        '</span>' +
        '</div> ' +
        '<div> ' +
        this.getUnitByType(row) +
        '</div> ' +
        '</div> ';
      return profilerUnit;
    },
    hideBranch(id) {
      console.log('kek!');
    },
    renderProfilerTree(section) {
      let profilerTree = '<div class="breadcrumbs-item"><div class="breadcrumbs-item-wrapper">';
      if (section.type === 'section') {
        let id = this.uuidv4();
        profilerTree += '' +
          '<div class="section-header">' +
          '<h3>' + section.title + '</h3>' +
          '<span class="http-badge"> ' +
          this.getSvgTime(section.time) +
          '</span> ' +
          '<span class="http-badge"> ' +
          this.getSvgMemory(section.memory) +
          '</span> ' +
          '<button @click="hideBranch(1)" class="btn btn_info btn_sm">Свернуть</button> ' +
          '</div> ' +
          
          
          '<div class="breadcrumbs-list" id="' + id + '" style="color: ' + this.getRandomColor() + '">';
        
        Object.values(section.breadcrumbs).forEach(item => {
          if (section.type === 'section') {
            profilerTree += this.renderProfilerTree(item);
          } else {
            profilerTree += this.renderProfilerUnit(item);
          }
        });
        profilerTree += '</div>';
        
      } else {
        profilerTree += this.renderProfilerUnit(section);
      }
      profilerTree += '</div></div>';
      
      return profilerTree;
    },
    
  },
  computed: {
    breadcrumbs() {
      return this.profiler.httpRequests;
    },
    activeUrlData() {
      return this.profiler.httpRequests[this.activeUrl];
    },
  },
};
</script>

<style lang="scss">

</style>
