<template>
  <div class="profiler-body">
    <div class="http-links" :class="{'http-links__hide':!showUrlList}">
      <div class="http-links-header">
        <div class="tracked-head">
          <button @click="toggleUrlList" class="http-links-hide">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div v-if="showUrlList" class="tracked-head-title">
            Tracked links <span class="tracked-url-count">{{ breadcrumbs.length }}</span>
          </div>
        </div>
        <div v-if="showUrlList">
          <button @click="resetRequests" class="http-links-trash">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="http-links-list">
        <div
          v-for="(section, key) in breadcrumbs"
          @click="openLink(key)"
          class="http-links-item"
          :class="{'http-link-active' : activeUrl === key, 'http-link-imported' : section.status === 0, 'http-link-error' : section.status > 200}"
        >
          <div class="link-index" v-tooltip="section.url">
            {{ key + 1 }}
          </div>
          <div class="link-eye">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div class="link-url">
            {{ section.url }}
          </div>
        </div>
      </div>
      <div class="import">
        <input @change="importRequest" type="file" ref="requestUpload" id="requestUpload" style="display: none">
        <button
          @click="$refs.requestUpload.click()"
          class="button-open-full-data"
        >
          Import request
        </button>
      </div>
    </div>
    
    <div v-if="activeUrl !== null" class="http-data">
      <div class="http-data-header">
        <div class="http-header-badges">
          <span class="http-badge" v-html="getSvgTime(activeUrlData.debug.executedTime, true)"/>
          <span class="http-badge" v-html="getSvgMemory(activeUrlData.debug.memoryPeakUsage, true)"/>
        </div>
        <div class="http-header-badges">
          <span class="http-badge">PHP {{ activeUrlData.debug.php }}</span>
          <span class="http-badge">Laravel {{ activeUrlData.debug.laravel }}</span>
        </div>
        <div class="http-header-badges">
          <span class="http-badge">{{ activeUrlData.debug.request.method }}</span>
          <span> {{ activeUrlData.debug.request.path }}</span>
        </div>
      </div>
      <div class="http-data-tabs">
        <div v-if="activeUrlData.exception" @click="activeTab = 0" class="http-tabs-item" :class="{'http-tabs-item__active' : activeTab === 0}">Exception</div>
        <div @click="activeTab = 1" class="http-tabs-item" :class="{'http-tabs-item__active' : activeTab === 1}">Breadcrumbs</div>
        <div @click="activeTab = 2" class="http-tabs-item" :class="{'http-tabs-item__active' : activeTab === 2}">Pipeline</div>
        <div @click="activeTab = 3" class="http-tabs-item" :class="{'http-tabs-item__active' : activeTab === 3}">Server</div>
        <div @click="activeTab = 4" class="http-tabs-item" :class="{'http-tabs-item__active' : activeTab === 4}">Request</div>
        <!--<div @click="activeTab = 5" class="http-tabs-item"  :class="{'http-tabs-item__active' : activeTab === 5}">Session</div>-->
        <div @click="activeTab = 6" class="http-tabs-item" :class="{'http-tabs-item__active' : activeTab === 6}">Auth</div>
        <div @click="activeTab = 7" class="http-tabs-item" :class="{'http-tabs-item__active' : activeTab === 7}">Git</div>
        <div @click="activeTab = 100" class="http-tabs-item" :class="{'http-tabs-item__active' : activeTab === 100}">Export</div>
      </div>
      <div class="http-data-body">
        <exception-tab v-if="activeTab === 0" :activeUrl="activeUrl"/>
        <breadcrumbs-tab v-if="activeTab === 1" :activeUrl="activeUrl"/>
        <pipeline-tab v-if="activeTab === 2" :activeUrl="activeUrl"/>
        <server-tab v-if="activeTab === 3" :activeUrl="activeUrl"/>
        <request-tab v-if="activeTab === 4" :activeUrl="activeUrl"/>
        <auth-tab v-if="activeTab === 6" :activeUrl="activeUrl"/>
        <git-tab v-if="activeTab === 7" :activeUrl="activeUrl"/>
        <export-tab v-if="activeTab === 100" :activeUrl="activeUrl"/>
      </div>
    </div>
    <div v-else class="http-data-empty">
      <h3>URL not selected</h3>
    </div>
  
  </div>
</template>

<script>
import Modal from '../ui/Modals/Modal';
import { ProfilerService } from './ProfilerService';
import BreadcrumbsTab from './Breadcrumbs/BreadcrumbsTab';
import ServerTab from './Server/ServerTab';
import RequestTab from './Request/RequestTab';
import AuthTab from './Auth/AuthTab';
import GitTab from './Git/GitTab';
import ExceptionTab from './Exception/Exception';
import PipelineTab from './Pipeline/PipelineTab';
import ExportTab from './Export/ExportTab';

export default {
  name: 'ProfilerBody',
  components: {
    ExportTab,
    PipelineTab,
    ExceptionTab,
    GitTab,
    AuthTab,
    RequestTab,
    ServerTab,
    BreadcrumbsTab,
    Modal,
  },
  data() {
    return {
      profiler: ProfilerService.instance,
      activeTab: 1,
      activeUrl: null,
      showUrlList: true,
    };
  },
  methods: {
    openLink(key) {
      if (this.profiler.httpRequests[key].exception) {
        this.activeTab = 0;
      } else {
        this.activeTab = 1;
      }
      this.activeUrl = key;
    },
    toggleUrlList() {
      this.showUrlList = !this.showUrlList;
    },
    resetRequests() {
      if (confirm('Сбросить сохраненную историю?')) {
        this.activeTab = 1;
        this.activeUrl = null;
        this.profiler.resetRequests();
      }
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
    getSvgTime(time, title = false) {
      let icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline></svg>';
      if (title) {
        icon += 'Time ' + this.formattedTime(time);
      } else {
        icon += this.formattedTime(time);
      }
      return icon;
      
    },
    getSvgMemory(memory, title) {
      let icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>';
      if (title) {
        icon += 'Memory ' + memory;
      } else {
        icon += memory;
      }
      return icon;
    },
    async importRequest(el) {
      let file = el.target.files[0];
      const fileContent = await file.text();
      (new ProfilerService()).push('imported', 0, JSON.parse(fileContent));
    },
  },
  created() {
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

.profiler-body {
  display: flex;
  height: 100%;
  
  * {
    transition: all .15s;
  }
  
  .http-links {
    display: flex;
    height: 100%;
    flex-direction: column;
    width: 200px;
    min-width: 200px;
    background-color: #292a31;
    border-right: #101113;
    font-size: 12px;
    
    &.http-links__hide {
      width: 50px;
      min-width: 50px;
      
      .http-links-header {
        
        .tracked-head {
          justify-content: center;
          
          .http-links-hide {
            margin-right: 0;
            
            svg {
              transform: scale(-1, -1);
            }
          }
          
          .tracked-head-title {
            display: none;
          }
        }
        
        
      }
      
      .http-links-list {
        .http-links-item {
          justify-content: center;
          
          .link-url, .link-eye {
            display: none;
          }
          
          .link-index {
            display: block;
          }
        }
      }
    }
    
    .http-links-header {
      background-color: #3d424c;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      color: #cfd0d3;
      font-weight: 900;
      
      .tracked-head {
        display: flex;
        
        .tracked-url-count {
          margin-left: 7px;
          font-size: 14px;
          color: #4a9ebb;
        }
        
        .http-links-hide {
          border-radius: 100%;
          background-color: #ced0d1;
          color: #3d424c;
          margin-right: 10px;
          width: 20px;
          height: 20px;
          padding: 0;
          border: none;
        }
      }
      
      .http-links-trash {
        padding: 0;
        border: none;
        color: #cfd0d3;
        background-color: inherit;
        
        &:hover {
          color: #d93c3c;
        }
      }
    }
    
    .http-links-list {
      display: flex;
      flex-direction: column;
      overflow: scroll;
      padding-top: 10px;
      flex: 1;
      
      .http-links-item {
        padding: 5px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        
        .link-index {
          display: none;
        }
        
        .link-eye {
          color: #74b565;
          opacity: 0;
          margin-right: 10px;
        }
        
        
        &.http-link-active {
          background-color: #3f5441;
        }
        
        &.http-link-error {
          background-color: #d93c3c7a;
        }
        
        &.http-link-imported {
          background-color: #bf91167a;
        }
        
        &:hover {
          background-color: #2d3444;
          
          .link-eye {
            opacity: 1;
          }
        }
      }
    }
    
    .import {
      padding: 5px 10px;
    }
  }
  
  .http-data-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #1c1e23;
    color: #8f8f8f;
  }
  
  .http-data {
    display: flex;
    flex-direction: column;
    width: 100%;
    
    
    .http-data-header {
      display: flex;
      background-color: #292a31;
      border-bottom: 1px solid #34373e;
      
      .http-header-badges {
        padding: 10px;
        border-right: 1px solid #34383e;
      }
    }
    
    .http-data-tabs {
      display: flex;
      background-color: #282a30;
      
      .http-tabs-item {
        padding: 10px;
        cursor: pointer;
        color: white;
        
        &:hover {
          background-color: #34373e;
        }
        
        &__active {
          background-color: #1c1e23;
        }
      }
    }
    
    .http-data-body {
      padding: 15px;
      font-size: 14px;
      overflow: scroll;
      background-color: #1c1e23;
      
      .branch-header {
        display: flex;
        align-items: flex-end;
        padding-left: 30px;
        position: relative;
        
        &:before {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: -8px;
          width: 20px;
          height: 100%;
          border-color: currentColor;
          border-right: 2px solid;
          border-top: 2px solid;
          border-top-right-radius: 10px;
        }
        
        &-title {
          display: flex;
          flex-direction: column;
          color: #cfd0d3;
          
          h4 {
            margin-right: 20px;
            margin-bottom: 0;
          }
          
          .branch-header-badges {
            margin-top: 10px;
          }
        }
        
      }
      
      .section-close-branch {
        position: absolute;
        bottom: 30px;
        left: 0;
      }
      
      .toggle-branch-btn {
        width: 25px;
        min-width: 25px;
        height: 25px;
        background-color: rgb(44, 90, 224, .5);
        color: white;
        border: 1px solid #445587;
        border-radius: 3px;
        font-size: 16px;
        font-weight: 900;
        margin-right: 10px;
        margin-top: 30px;
        
        
        &:hover {
          background-color: rgb(44, 90, 224, 1);
        }
      }
      
      .breadcrumbs-list.main-branch {
        padding-left: 0;
        
        > .breadcrumbs-branch {
          &:after,
          &:before {
            display: none;
          }
        }
      }
      
      .breadcrumbs-list {
        display: flex;
        flex-direction: column;
        padding-left: 30px;
        
        
        .breadcrumbs-branch {
          padding-bottom: 15px;
          position: relative;
          
          &:before,
          &:after {
            content: "";
            display: block;
            position: absolute;
            top: -2px;
            /*left: -35px;*/
            left: -20px;
            width: 15px;
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
            height: 29px;
            border-left-style: solid;
            border-left-width: 2px;
            border-bottom-style: solid;
            border-bottom-width: 2px;
            border-bottom-left-radius: 15px;
          }
          
          .breadcrumbs-branch-wrapper {
            padding-top: 25px;
          }
        }
        
        
      }
    }
  }
}

.http-badge-list {
  margin-bottom: 8px;
}

.http-data {
  color: #cfd0d3;
}

.http-badge {
  background-color: #445688;
  color: #cfd0d3;
  padding: 3px 5px;
  margin-right: 10px;
  border-radius: 3px;
  font-size: 13px;
  font-style: normal;
  width: fit-content;
  
  &__level_1 {
    background-color: #987f03;
  }
  
  &__level_2 {
    background-color: #cb8605;
  }
  
  &__level_3 {
    background-color: #cd4d07;
  }
  &__level_4 {
    background-color: #aa1f00;
  }
  
  svg {
    margin-right: 5px;
  }
}

.button-open-full-data {
  border: 1px solid #bf9116;
  border-radius: 3px;
  background-color: #ffce424d;
  color: #d7d7d7;
  padding: 0 15px;
  height: 30px;
  width: 100%;
  
  &:hover {
    color: white;
    background-color: #bf9116;
  }
}

</style>
