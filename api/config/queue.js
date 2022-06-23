let Queue = require('bull');
class RedisQueue {
    constructor(redisUri) {        
        console.log("REDIS_URI", redisUri);
        this.teamQueue =  new Queue('team', redisUri, {
            limiter: {
                max: 5,
                duration: 39000
            }});
        RedisQueue._instance = this;
    }
    static getInstance() {
        if (!RedisQueue.instance) {
            RedisQueue.instance=new RedisQueue();
        }
        return RedisQueue.instance;
      }
}

module.exports = RedisQueue;
