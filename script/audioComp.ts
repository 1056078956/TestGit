

const {ccclass, property} = cc._decorator;

@ccclass
export default class audioComp extends cc.Component {
    private musicId: number = -1; // native 下可能为0
    private soundId: number = -1;
    private curMusicPath = null;
    private curMusicLoop = false;
    private regConfig: object;
    private isPlay = false;
    onLoad () {
        //this.initVal();
        cc.log('tttes1');
        this.isPlay = true;
        this.playMusic('sound/pray/bg');
    }

    click () {
        this.stopBgMusic();
    }
    //音效
    clickAdToggle (){
        this.isPlay = !this.isPlay;
        cc.log('play ' + this.isPlay);
        // if(!this.isPlay){
        //     cc.audioEngine.stop(this.musicId);
        // }else{
        //     this.curMusicPath = 'sound/pray/bg';
        // }
        this.controlMusic(this.isPlay);
    }

    // 背景音, 播放时要把上一个停止
    public async playMusic(path: string, loop: boolean = true) {
       // cc.log('playMusic: bgMusic:' + SS.bgMusic);
        try {
            // 马上pause 无效
            if (path) {
                this.curMusicPath = null;
                this.musicId = await this.play(path, loop, true);
                cc.log('play music:' + this.musicId);
            } else {
                this.curMusicPath = path;
                this.curMusicLoop = loop;
            }
        } catch (e) {
            cc.error(e);
        }
    }

    public pauseMusic() {
        cc.log('[audio] pauseMusic:' + this.musicId);
        cc.audioEngine.pause(this.musicId);
    }

    public resumeMusic() {
        cc.log('[audio] resumeMusic');
        //if (SS.bgMusic) {
            if (this.curMusicPath) {
                this.playMusic(this.curMusicPath, this.curMusicLoop);
            } else {
                cc.audioEngine.resume(this.musicId);
            }
        //}
    }


    public stopAll() {
        cc.audioEngine.stopAll();
        this.curMusicPath = null;
        this.musicId = -1;
    }

    private async play(path: string, loop: boolean = false, isMusic = false): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            cc.loader.loadRes(path, (err, audio) => {
                if (!err) {
                    if (isMusic) {
                        // 播放之前停止上一个music
                        cc.audioEngine.stop(this.musicId);
                    }
                    let id = cc.audioEngine.play(audio, loop, 1);
                    //let length = audio.getDuration();
                    resolve(id);
                } else {
                    cc.error(err);
                    reject(err);
                }
            });
        });
    }

    // controlMusic
    public controlMusic(on: boolean) {
    
        if (on) {
            this.resumeMusic();
        } else {
            this.pauseMusic();
        }
    }
    //防止切换背景音 播放以前的
    public stopBgMusic(){
        this.controlMusic(false);
        
        cc.audioEngine.stop(this.musicId);
        this.musicId =-1;
        this.curMusicPath = null;
    }
}
