import { _decorator, assetManager, Component, ImageAsset, Node, randomRangeInt, SpriteFrame, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FbSdk')
export class FbSdk extends Component {
    public static ins: FbSdk
    private localeURL = 'https://www.cloudflare.com/cdn-cgi/trace23';
    private FBInstant;
    public fbLocation = ''

    public fbLanguage = ''
    private base64: string = 'data base 64 cua anh';
    public rewardAd;

    public dataFb = {
        fbId: "",
        sender: "UserName",
        locale: this.fbLocation,
        photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
    }
    public static getInstance() {
        if (this.ins == null)
            this.ins = new FbSdk();
        return this.ins;
    }


    public async loginGame() {

        this.FBInstant = (typeof FBInstant !== 'undefined') ? FBInstant : null;
        //
        if (this.FBInstant != null) {
            this.FBInstant.setLoadingProgress(100); // Hoặc từng bước preload
            await this.FBInstant.startGameAsync();
            //     const entryPointData = this.FBInstant.getEntryPointData();
            //     if (entryPointData) {
            //         console.log('Entry', entryPointData.deepLinkTo);
            //     }
            // }
            // this.getLocaleManual((data) => {
            //     let startIndex = data.search('loc');
            //     let loc = data.substring(startIndex + 4, startIndex + 6).toLowerCase();
            //     //convert from location to language
            //     var countryCode = loc;
            //     var lang = 'en';
            //     if (countryCode == null || countryCode == undefined || countryCode.length == 0 || countryCode == 'undefined') {
            //         countryCode = 'us';
            //     }
            //     if (countryCode == 'vn') {
            //         lang = 'vi'
            //     }

            //     this.dataFb.locale = countryCode
            // })


            // this.fbLanguage = this.FBInstant.getLocale().toString().split("_")[0];

            // this.dataFb.fbId = this.FBInstant.player.getID();
            // this.dataFb.sender = this.FBInstant.player.getName();
            // this.dataFb.photoURL = this.FBInstant.player.getPhoto();

            // this.preloadRewardAd()
            // this.PreloadInterstitial()
            // this.sendFirstNotification('chibidoll', false)
            // this.onSendUserID()
            // this.scheduleOnce(() => {
            //     FbSdk.ins.SubscribeBot()
            // }, 3)


        }
    }

    public SetDataUser(data) {
        if (this.FBInstant == null) return;
        this.FBInstant.player
            .setDataAsync(data)
            .then(() => {
                console.log(data)
            });
    }
    private getLocaleManual(callback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
        }
        xhr.open('GET', this.localeURL, true);
        xhr.send('');
    }

    public GetDataUser(parameter, callback) {
        if (this.FBInstant == null) return;
        this.FBInstant.player
            .getDataAsync(parameter)
            .then((data) => {
                callback(data);
            });
    }
    //
    //load banner
    //share and invite friends
    public Share(base64Img, textMess: string, callback = null) {
        if (this.FBInstant == null) {
            if (callback != null) {
                callback()
            }
            return;
        }

        this.FBInstant.shareAsync({
            intent: 'REQUEST',
            image: base64Img,
            text: textMess,
            data: { myReplayData: '...' },
        }).then((result) => {
            if (callback != null) {
                callback()
            }
        }).catch((err) => {
            if (callback != null) {
                callback()
            }
        })

    }

    public joinGroup() {
        console.log('Start join group');
        if (this.FBInstant == null) return;

        const follow = () => {
            this.FBInstant.community.joinOfficialGroupAsync().then((data) => {
                console.log('Data:', data);
            }).catch((e) => {
                console.log('Err:', e);
            })
        }

        this.FBInstant.community.canJoinOfficialGroupAsync()
            .then(function (data) {
                console.log(data);
                follow();
            });
    }
    public inviteFriend() {
        if (this.FBInstant == null) return;
        const invite = (base64) => {
            this.FBInstant.inviteAsync({
                image: base64,
                text: {
                    default: "Let's play with me!",
                    localizations: {
                        vi_VN: 'Chơi với mình nào! 😍',
                        en_US: "Play with me 😍",
                    }
                },
                data: { myReplayData: "roomID: 123" }
            }).then(function () {
                // continue with the game.
            });
        }

        this.LoadBannerGame((base64) => {

            invite(base64)
        })

    }
    private ChoosePlayer(callback = null, err = null) {
        if (this.FBInstant != null) {
            this.FBInstant.context
                .chooseAsync({
                    minSize: 2,
                })
                .then(() => {
                    if (callback != null) {
                        callback.apply();
                    }
                })
                .catch(() => {
                    if (err != null) {
                        err.apply();
                    }
                });
        }
    }

    setLocale(locale) {
        let subString = locale.split('_');
        return subString[1].toLowerCase()
    }

    private LoadBannerGame(callback) {
        this.ToDataURL("https://i.imgur.com/Yme0HLR.jpg", (base64) => {
            callback(base64)
        }, null);
    }

    private ToDataURL(url, callback, error) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    private preloadRewardedVideo = null;
    reward_id = "622862352994499_653544436592957"
    public preloadRewardAd() {
        console.log('Preload reward ads');
        if (this.FBInstant == null) {
            return;
        }
        if (this.preloadRewardedVideo != null) {
            return;
        }
        let self = this;
        this.FBInstant.getRewardedVideoAsync(
            self.reward_id
        ).then(function (rewarded) {
            // Load the Ad asynchronously
            self.preloadRewardedVideo = rewarded;
            return self.preloadRewardedVideo.loadAsync();
        }).then(function () {
            console.log('Rewarded video preloaded');
        }).catch(function (err) {
            console.error('Rewarded video failed to preload: ' + err.message);
        });
    }

    public AD_NOT_COMPLETED: string = "not completed";
    public showRewardAd(callback = null) {
        console.log('Show item ad');

        const rewardAd = () => {
            //video ad reward
            if (this.preloadRewardedVideo == null) {
                callback(false, 'Ad is not ready');
                return;
            }
            this.preloadRewardedVideo.showAsync()
                .then(function () {
                    // Perform post-ad success operation
                    console.log('Rewarded video watched successfully');
                    //
                    if (callback != null)
                        callback(true);
                    self.preloadRewardedVideo = null;
                    self.preloadRewardAd();
                }).catch(function (e) {
                    self.preloadRewardedVideo = null;
                    self.preloadRewardAd();
                    let message: string = e.message;
                    if (callback != null) {
                        if (message.includes(self.AD_NOT_COMPLETED)) {
                            //default reward
                            //callback(false, 'Please watch the AD to the end (30s) to get Rewards');
                            callback(false, self.AD_NOT_COMPLETED);
                        } else {
                            callback(false, 'Ad is not ready');
                        }

                    }


                });
        }
        var self = this;
        if (this.FBInstant == null) {
            if (callback != null)
                callback(true);
            return;
        }
        rewardAd();
    }

    public checkCanSubscribeBot(callback) {
        if (this.FBInstant == null) {
            callback(false);
            return;
        }
        //
        console.log('Check can subscribe');
        //this.sendLocaleSessionData();
        this.FBInstant.player.canSubscribeBotAsync().then((can_subscribe) => {
            if (can_subscribe) {
                console.log('Bot', 'can subscribe');
                callback(true);
            } else {
                console.log('Bot', 'can not subscribe');
                callback(false);
            }
        }).catch((e) => {
            console.log('err', e);
            callback(false);
        });
        //
    }
    public sendFirstNotification(gameName: string = 'chibidoll', firstTime: boolean = false) {
        console.log('First time....')
        if (this.FBInstant == null) return;
        this.FBInstant.setSessionData({
            isFirstPlay: firstTime,
            game_name: gameName,
        });
    }
    interAdsInstance = null
    public interstitial_ads_id: string = "622862352994499_660870785860322"
    //FIRST ADS ========================================
    public PreloadInterstitial() {
        console.log('Preload inter ad');
        if (this.FBInstant == null) {
            return;
        }
        if (this.interAdsInstance != null) {
            return;
        }
        let self = this;
        this.FBInstant.getInterstitialAdAsync(
            self.interstitial_ads_id
        ).then((interstitial) => {
            // Load the Ad asynchronously
            //self.attemp = 0;
            self.interAdsInstance = interstitial;
            return self.interAdsInstance.loadAsync();

        }).then(() => {
            console.log('Interstitial preloaded')
        }).catch((err) => {
            console.log('Ads', err);
            self.interAdsInstance = null;

        });
    }

    showInterstitialAds() {
        let self = this
        if (this.interAdsInstance != null) {
            console.log('inter', 'ad x');
            this.interAdsInstance.showAsync()
                .then(() => {
                    self.interAdsInstance = null
                    self.PreloadInterstitial();

                })
                .catch((e) => {
                    //ad error
                    console.log(e)
                });
        }
    }

    public CreateShortcutGame() {
        if (this.FBInstant != null) {
            this.FBInstant.canCreateShortcutAsync()
                .then((canCreateShortcut) => {
                    if (canCreateShortcut) {
                        this.FBInstant.createShortcutAsync()
                            .then(() => {
                            })
                            .catch(() => {
                            });
                    }
                });
        }
    }

    public SubscribeBot() {
        if (this.FBInstant == null) return;
        let self = this;
        //this.sendLocaleSessionData();
        this.FBInstant.player.canSubscribeBotAsync().then((can_subscribe) => {
            if (can_subscribe) {
                this.FBInstant.player.subscribeBotAsync().then(() => {
                    console.log('subscribe');
                    this.sendFirstNotification('chibidoll', true);
                }).catch((e) => {
                    // Handle subscription failure
                });
            }
        }).catch((e) => {
            console.log('Already subcribe');
        });
    }

    onSendUserID() {
        if (this.FBInstant == null) return;

        if (this.FBInstant.player.getID()) {
            // console.log('You send me your fb id:', this.FBInstant.player.getID());
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://chibipush.vxh87.online/api/data");
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            const body = JSON.stringify({
                type: 'a2u',
                gameName: 'chibidoll',
                userId: this.FBInstant.player.getID(),
            });
            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 201) {
                    console.log(JSON.parse(xhr.responseText));
                } else {
                    console.log(`Error: ${xhr.status}`);
                }
            };
            xhr.send(body);
        } else {
            console.log('You have no facebook id');
        }

    }
}


