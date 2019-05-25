const NodeMediaServer = require('node-media-server');
const appConfig = require('./module/config');
const md5 = require('md5');

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        mediaroot: 'media',
        allow_origin: '*'
    },
    auth: {
        play: true, // 拉流开启权限验证
        publish: true, // 推流开启权限验证
        secret: appConfig.secret
    },
     trans: {
        // ffmpeg 安装地址 https://www.jianshu.com/p/73441acf7815
        ffmpeg: '/usr/local/bin/ffmpeg',
        tasks: [
            {
                app: 'live',
                mp4: true,
                mp4Flags: '[movflags=faststart]',
            }
        ]
    }
};

var nms = new NodeMediaServer(config)
nms.run();

var streamName = "laoyu";
var expireDate = parseInt((Date.now()+1000000)/1000);
var HashValue = md5(`/live/${streamName}-${expireDate}-${appConfig.secret}`);

var sign = `${expireDate}-${HashValue}`;

var rtmplUrl = `rtmp://127.0.0.1/live/${streamName}?sign=${sign}`;

console.log(rtmplUrl);