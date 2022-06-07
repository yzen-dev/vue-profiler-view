<template>
  <div v-if="showDebugBar" class="debug-block" :class="{'full-size' : fullSize, 'mini-size' : !profileHeader}">
    <div class="debug-header">
      <div class="debug-button">
        <button v-if="!debugMode" @click="runDebug" class="profiler-button" :class="{'btn-icon': !profileHeader}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <template v-if="profileHeader">
            Run debug
          </template>
        </button>
        <button v-else @click="stopDebug" class="profiler-button profiler-button__danger" :class="{'btn-icon': !profileHeader}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
          <template v-if="profileHeader">
            Stop debug
          </template>
        </button>
      </div>
      
      <div>
        <template v-if="profileHeader">
          <button @click="openFullSize" class="profiler-button">
            <svg v-if="!fullSize" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round" class="feather feather-minimize-2">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
          <button @click="openDetailsBlock" class="profiler-button">
            <svg v-if="openDetails" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </template>
        <button @click="toggleProfilerHeader" class="profiler-button">
          <svg v-if="profileHeader" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round"
               stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
    <div
      v-show="profileHeader"
      class="debug-body"
      :class="{'debug-body_hide' : !openDetails}"
      id="debug-body"
    >
      <profiler-body/>
    </div>
    
    <div v-if="profileHeader" id="debug-block-resize-handle" class="debug-block-resize-handle"></div>
  
  </div>
</template>

<script>
import SvgTool from '../svg/SvgTool';
import Cookies from 'js-cookie';
import ProfilerBody from './ProfilerBody';

export default {
  name: 'Profiler',
  components: {
    ProfilerBody,
    SvgTool,
  },
  data() {
    return {
      showDebugBar: false,
      debugMode: false,
      openDetails: false,
      profileHeader: true,
      fullSize: false,
      clientY: 0,
      startHeight: 0,
    };
  },
  created() {
    this.debugMode = Cookies.get('debug-mode') ? Cookies.get('debug-mode') === 'true' : false;
    if (this.debugMode) {
      this.showDebugBar = true;
      this.$server.runDebugMode();
    }
    
    window.showDebugBar = () => {
      this.showDebugBar = true;
      this.$nextTick(() => {
        this.initDebugging();
      });
      return 'Debug mode started!';
    };
  },
  mounted() {
    if (this.debugMode) {
      this.initDebugging();
      this.startHeight = parseInt(document.defaultView.getComputedStyle(document.getElementById('debug-body')).height, 10);
    }
  },
  
  methods: {
    openFullSize() {
      this.openDetails = true;
      this.fullSize = !this.fullSize;
    },
    openDetailsBlock() {
      this.openDetails = !this.openDetails;
    },
    toggleProfilerHeader() {
      this.profileHeader = !this.profileHeader;
      if (!this.profileHeader){
        this.fullSize = false;
      }
    },
    runDebug() {
      this.debugMode = true;
      Cookies.set('debug-mode', true);
      this.$server.runDebugMode();
    },
    stopDebug() {
      this.debugMode = false;
      Cookies.set('debug-mode', false);
      this.$server.stopDebugMode();
    },
    
    initDebugging() {
      const debugBlock = document.getElementById('debug-body');
      const resizeElement = document.getElementById('debug-block-resize-handle');
      resizeElement.addEventListener('mousedown',
        (e) => {
          console.log('initDrag');
          this.startY = e.clientY;
          this.startHeight = parseInt(document.defaultView.getComputedStyle(document.getElementById('debug-body')).height, 10);
          document.documentElement.addEventListener('mousemove', this.doDrag, false);
          document.documentElement.addEventListener('mouseup', this.stopDrag, false);
        }
        , false);
      
    },
    doDrag(e) {
      this.openDetails = true;
      document.getElementById('app').style.userSelect = 'none';
      document.getElementById('debug-body').style.height = (this.startHeight + e.clientY - this.startY) + 'px';
    },
    
    stopDrag(e) {
      document.getElementById('app').style.userSelect = 'auto';
      document.documentElement.removeEventListener('mousemove', this.doDrag, false);
      document.documentElement.removeEventListener('mouseup', this.stopDrag, false);
    },
  },
}
;
</script>

<style scoped lang="scss">
.debug-block {
  display: flex;
  flex-direction: column;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  
  &.mini-size {
    right: auto;
    opacity: .8;
    .debug-header{
      border-bottom-right-radius: 10px;
    }
    
    &:hover {
      opacity: 1;
    }
  }
  
  &.full-size {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99999;
    height: 100%;
    
    .debug-body {
      height: 100% !important;
    }
  }
}

.debug-header {
  background-color: #2b2d33;
  display: flex;
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid #34373e;
  
  .profiler-button{
    background-color: inherit;
    color: white;
    padding: 0 15px;
    border: none;
    height: 100%;
    
    &__danger{
      color: #d93c3c;
    }
    
    &:hover{
      background-color: #1c1e23;
    }
  }
}

.debug-body {
  height: 300px;
  overflow: scroll;
  transition: height .3s;
  background-color: #1c1e23;
  
  &_hide {
    height: 0 !important;
  }
}

.debug-block-resize-handle {
  display: block !important;
  height: 3px;
  margin-bottom: -4 px;
  width: 100%;
  background: none;
  cursor: ns-resize;
  border-top: none;
  border-bottom: 0px;
  background-color: #fa5661;
}

</style>
