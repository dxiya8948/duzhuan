<template>
	<view id="login">
		<uni-popup ref="popup" type="message"><uni-popup-message :type="type" :message="msg" :duration="2000"></uni-popup-message></uni-popup>
		<!-- <form @submit="login" @reset="formReset">
			<view class="uni-form-item">
				<view class="title">账号：</view>
				<input class="uni-input" name="username" placeholder="请输入账号" v-model="form.username" />
			</view>
			<view class="uni-form-item">
				<view class="title">密码：</view>
				<input class="uni-input" name="password" placeholder="请输入密码" v-model="form.password" />
			</view>
			<view class="uni-btn-v">
				<button form-type="submit" style="margin-bottom: 10px;">登录</button>
				<button type="default" style="margin-bottom: 10px;" form-type="reset">注册</button>
			</view>
		</form> -->
		<view class="img_box">
			<uni-transition :mode-class="['fade']" :show="loadingOver" duration="800"><image src="../../static/logo.png" class="logo"></image></uni-transition>
			<uni-transition :mode-class="['fade']" :show="!loadingOver" duration="1000"><image :src="wxInfo.avatarUrl" class="logo2"></image></uni-transition>
		</view>
		<uni-transition :mode-class="['slide-top']" :show="!loadingOver">
			<text class="nick">{{ wxInfo.nickName }}</text>
			<text class="welcome">欢迎登录</text>
		</uni-transition>
		<uni-transition :mode-class="['fade', 'slide-bottom']" :show="loadingOver">
			<button type="primary" open-type="getUserInfo" @click="loginWithWechat" class="login_btn" @getuserinfo="getuserinfo">微信一键登录</button>
		</uni-transition>
	</view>
</template>

<script>
import uniTransition from '@/components/uni-transition/uni-transition.vue';

export default {
	components: {
		uniTransition
	},
	data() {
		return {
			type: 'success', // 消息提示主题，可选值： success/warn/info/error
			msg: '登录成功', // 消息提醒内容
			loadingOver: true,
			form: { username: 'admin', password: 'admin' },
			code: '',
			wxInfo: null
		};
	},
	methods: {
		// 消息类型
		sendMessage(type, msg) {
			this.type = type;
			this.msg = msg;
			this.$refs.popup.open();
		},

		// 获取用户信息
		getuserinfo(event) {
			console.log(event.detail.userInfo);
			this.wxInfo = event.detail.userInfo;
			if (event.detail.userInfo) {
				this.login();
			}
		},

		// 微信登录
		loginWithWechat() {
			let _this = this;
			uni.login({
				provider: 'weixin',
				async success(res) {
					// 获取用户信息（旧版）
					// uni.getUserInfo({
					// 	provider: 'weixin',
					// 	success: function(infoRes) {
					// 		_this.wxInfo = infoRes.userInfo;
					// 		console.log(_this.wxInfo);
					// 	}
					// });

					// 调起云函数
					// let result = await _this.$uniCloud('loginWithWechat', {
					// 	js_code: res.code
					// });

					// _this.openid = result.result.data.openid;
					_this.code = res.code;
				}
			});
		},

		// 用户登录
		async login() {
			let res = await this.$uniCloud('login', { code: this.code });
			if (res.result.code === 0) {
				uni.setStorageSync('uni_id_token', res.result.token); // 获取token之后应进行持久化存储
				uni.setStorageSync('uid', res.result.uid); // 获取userID之后应进行持久化存储
				this.sendMessage('success', '登陆成功');
				this.toPage();
				console.log(res);
			} else {
				this.sendMessage('error', res.result.msg);
			}
		},

		// 跳转到page
		toPage: function() {
			this.loadingOver = false;
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/index/index',
					fail: function(reason) {
						console.log(reason);
					}
				});
			}, 1000);
		}
	},
	onLoad() {
		//默认加载
		console.log(this);
	}
};
</script>

<style lang="less">
#login {
	margin: 90rpx auto 0rpx;
	padding: 20rpx 20rpx;
	border: 1px solid #ccc;
	text-align: center;
	width: 650rpx;
	height: 400rpx;
	border-radius: 10rpx;

	.img_box {
		width: 100%;
		height: 200rpx;
		position: relative;

		.logo {
			transition: all 1s ease;
			position: absolute;
			top: 0rpx;
			left: 225rpx;
			width: 200rpx;
			height: 200rpx;
		}

		.logo2 {
			position: absolute;
			width: 185rpx;
			height: 185rpx;
			top: 20rpx;
			left: 235rpx;
			border-radius: 50%;
		}
	}

	.nick {
		display: block;
		font-size: 20px;
		margin-top: 50rpx;
	}

	.welcome {
		display: block;
		font-size: 16px;
		margin-top: 20rpx;
	}

	.login_btn {
		margin-top: 80rpx;
	}
}
</style>
