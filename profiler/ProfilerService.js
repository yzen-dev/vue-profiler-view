export class ProfilerService {
  
    constructor()
    {
        if (!!ProfilerService.instance) {
            return ProfilerService.instance;
        }
        ProfilerService.instance = this;
        this.httpRequests = [];
        this.unread = 0;
        return this;
    }
  
    push(url, status, data)
    {
        this.unread++;
        let exception = null;
        if (status !== 200 && data.exception){
            exception = data.exception;
        }
        this.httpRequests.push({
            url,
            status,
            exception,
            debug: data.debug ?? null,
        });
    }
  
    resetUnread()
    {
        this.unread = 0;
    }
    
    resetRequests()
    {
        this.httpRequests = [];
    }
}
