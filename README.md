# huawei-bonus-seckill
华为云码豆商城秒杀

使用方法：
首先下载node 直接去node中文网下载最新版即可 安装一路默认即可
安装并
下载脚本后 在脚本当前文件夹打开cmd
执行 npm i
下载模块 

准备工作 打开码豆商城并登陆 https://devcloud.huaweicloud.com/bonususer/home/costbonus?from_region=undefined
点击f12 打开调试工具 切换到network
刷新一下 找到类似于 https://devcloud.huaweicloud.com/bonususer/home/costbonus?from_region=undefined 的请求 点一下 看header里有一项cookie
cookie类似于这样 
```
deviceid=vxKT8CBY; _ga=GA1.2.1033081026.1607608201; es_uid=b3a58f32-c7a1-4fcb-b616-355e93f23342; Hm_lvt_e7a90fbb918d40aec64d1170a5ca608f=1608015640,1609xxxx310,160932xxxx; hw322xxxx_hw3220xxxx_cfProjectName=cn-north-4; _frid=e57791c3bf0b4e4cbaxxxx56c; ua=09b9cab34280xxxx0ff0c01e8798b760; events_share_key=0a020xxxx8b95b77f2f; SessionID=949db760-9a0xxxxe8e7b2c9; ad_adp=; HWWAFSESID=8ce8vee7d5d; HWWAFSESTIME=161xxxx1811; _gid=GA1.2.1294460021.1610544033; user_tag=09b9cab42c00f3axxxx0ace1; masked_domain=xxxx; masked_user=xxxx; masked_phone=xxxx; usite=cn; popup_max_time=60; x-framework-ob=""; ad_sc=wechat; ad_mdm=mkp; ad_cmp=marketplace_live; ad_ctt=lb; ad_tm=xxxx; cf=wechat; LastAdSource=wechat; a3ps_1d41_saltkey=xxxx; a3ps_1d41_lastvisit=xxxx; HWS_ID=X5JhCxAQZrFaejyGE-PHbg.._-xxxx-xxxx.; a3ps_1d41_atarget=1; a3ps_1d41_auth=xxxx%26f75ca7e382d0a5e9; a3ps_1d41_csrftoken=2db9e08a8c39469ccf77; FORUM_ID=X5JhCxAQZrFaejyGE-PHbg..; vk=acbe0076-11ab-483d-bdd7-c095866bf4e1; a3ps_1d41_st_t=334932%7C1610595455%xxxx; a3ps_1d41_forum_lastvisit=D_1080_1610595455; a3ps_1d41_ulastactivity=xxxx%260bb4ba29f13f6e1d; a3ps_1d41_clearUserdata=forum; a3ps_1d41_sid=hlXZ5j; a3ps_1d41_lip=125.93.252.188%2C1610595455; a3ps_1d41_st_p=334932%7C1610611670%xxxx; a3ps_1d41_visitedfid=923D1080; a3ps_1d41_lastact=1610611676%09forum.php%09ajax; locale=zh-cn; __ozlvd1791=1610617695; domain_tag=xxxx; devclouddevui420J_SESSION_ID="{xxxx}"; devclouddevui420cftk=SH17-xxxx-642B-TRSI-xxxx-UM3Mxxxx-P27D-FGAJ
```
关键词已打码 前后顺序可能不同 
将这一段cookie放入文件夹的hwck.txt中
ck 一行一个  多个账号就自己获取后一行一个放置即可

然后用编辑器打开madou.js 修改最上方的配置项
修改完毕后在cmd输入 node madou.js 并回车 抢购脚本即可正常启动

停止脚本：ctrl+c 按住ctrl键再按c即可停止 没反应多按几次
停止后重新运行还是 node madou.js
