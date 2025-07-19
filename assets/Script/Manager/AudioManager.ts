import { _decorator, AudioClip, AudioSource, Component, director, game, Node } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { DataManager } from './DataManager';
import { SFXType } from '../Enum/Enum';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends BaseSingleton<AudioManager> {
    @property(AudioSource)
    musicSource: AudioSource = null;

    @property(AudioSource)
    sfxSource: AudioSource = null;

    @property([AudioClip])
    sfxClips: AudioClip[] = [];


    stateCurrentSound: boolean = false
    stateCurrentMusic: boolean = false




    LoadMusicSource() {
        if (this.musicSource != null) return;
        this.musicSource = this.node.getChildByName('MusicSource').getComponent(AudioSource);
    }

    LoadSfxSource() {
        if (this.sfxSource != null) return;
        this.sfxSource = this.node.getChildByName('SfxSource').getComponent(AudioSource);
    }

    protected LoadComponent(): void {

    }

    protected onLoad(): void {
        super.onLoad();
        director.addPersistRootNode(this.node) // giữ lại khi đổi scene
        this.LoadState()
    }

    async LoadState() {
        this.stateCurrentSound = await DataManager.getInstance().GetDataSound()
        this.stateCurrentMusic = await DataManager.getInstance().GetDataMusic()
    }

    start() {
        this.playMusic();
    }

    playMusic() {
        if (this.stateCurrentMusic) {
            this.musicSource?.play();
        }
    }

    stopMusic() {
        this.musicSource?.stop();
    }

    setMusicStatus(on: boolean) {
        this.stateCurrentMusic = on;
        on ? this.playMusic() : this.stopMusic();
    }

    getMusicStatus(): boolean {
        return this.stateCurrentMusic;
    }

    setSFXStatus(on: boolean) {
        this.stateCurrentSound = on;
    }

    getSFXStatus(): boolean {
        return this.stateCurrentSound;
    }

    playSFX(type: SFXType) {
        if (!this.stateCurrentSound) return;

        const clip = this.sfxClips[type];
        if (clip) {
            this.sfxSource?.playOneShot(clip);
        }
    }

    StopEffMusic() {
        this.setMusicStatus(false);
        this.setSFXStatus(false);
    }

    ResumeEffMusic() {
        this.setMusicStatus(true);
        this.setSFXStatus(true);
        this.playSFX(SFXType.Spawn);
    }

    public SaveState() {
        DataManager.getInstance().SetDataMusic(this.stateCurrentMusic)
        DataManager.getInstance().SetDataSound(this.stateCurrentSound)
    }
}


