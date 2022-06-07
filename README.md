# vue-profiler-view

```js
import { ProfilerService } from './profiler/ProfilerService.js';

new Vue({
    async created() {
        window.profiler = new ProfilerService();
    }
});
```

```js
// axios

function runDebugMode() {
    axios.interceptors.response.use((response) => {
        if (response.data && response.data.debug) {
            (new ProfilerService()).push(response.config.url, response.status, response.data)
        }
        return Promise.resolve(response)
    }, (error) => {
        if (error.response.data && error.response.data.debug) {
            (new ProfilerService()).push(error.response.config.url, error.response.status, error.response.data)
        }
        return Promise.reject(error)
    });
}

function stopDebugMode() {
    axios.interceptors.response.use((response) => {
        return response;
    }, (response) => {
        return response;
    });
}
```

Run `showDebugBar()` in browser console

![image](https://user-images.githubusercontent.com/24630195/172348111-940201c7-5aaf-4c8d-926e-ce46be5e3400.png)

