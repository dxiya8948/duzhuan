<template>
	<view class="container">
		<uni-popup ref="message" type="message"><uni-popup-message type="success" message="上传成功" :duration="1200"></uni-popup-message></uni-popup>
		<view class="Article">
			<view :class="[state ? 'usb_ready' : 'usb']" @click="openOptionsModal">
				<image class="usb_img" src="/static/usb/usb_none.png" mode="aspectFit" ref="input"></image>
				<uni-transition :mode-class="['fade']" :show="uploadState" duration="1000">
					<view class="propress"><cmd-progress stroke-width="2" width="240" type="circle" :percent="percentCompleted" :showInfo="false"></cmd-progress></view>
				</uni-transition>
			</view>
			<view class="uploadtitle">点击选择文件</view>
			<!-- 上传的文件列表展示 -->
			<view class="filesBox" v-if="fileList.length > 0">
				<view class="fileslist" v-for="(item, i) in fileList">
					<image src="/static/usb/file.png" class="upfileico"></image>
					<text class="upname" @click="previewImage(i)">{{ item.name }}</text>
					<image src="/static/usb/del.png" class="upclose" @click="delImage(i)"></image>
				</view>
			</view>
			<!-- 我的文件 -->
			<view class="filesBox myfiles" v-if="myfiles.length > 0">
				<view class="fileslist" v-for="(item, i) in myfiles">
					<image src="/static/usb/file.png" class="upfileico"></image>
					<text class="upname" @click="previewMyImage(i)">{{ item.name }}</text>
					<!-- <image src="/static/usb/del.png" class="upclose" @click="delImage(i)"></image> -->
				</view>
			</view>
		</view>
		<button type="primary" class="upload" @click="confirmUpload" :disabled="!state">上传</button>

		<!-- 选择框 -->
		<uni-popup ref="popup" type="center">
			<view class="mainArea">
				<button type="primary" plain class="picture" @click="getPicture">图片</button>
				<button type="primary" class="wxFile" @click="getWxFile">微信聊天文件</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import cmdProgress from '@/components/cmd-progress/cmd-progress.vue';

export default {
	components: {
		cmdProgress
	},
	data() {
		return {
			fileList: [],
			myfiles: [],
			state: false,
			percentCompleted: 0.0, // 上传进度
			uploadState: false // 上传状态
		};
	},
	watch: {
		// 监控文件列表
		fileList: function(vnew, vold) {
			if (vnew.length > 0) {
				this.state = true;
			} else {
				this.state = false;
			}
		},
		percentCompleted: function(vnew) {
			if (vnew === 100) {
				setTimeout(() => {
					this.uploadState = false;
				}, 1200);
			}
		}
	},
	methods: {
		// 上传类型选择
		openOptionsModal: function() {
			this.$refs.popup.open();
		},
		// 选择图片
		getPicture: function() {
			uni.chooseImage({
				success: res => {
					let pictures = res.tempFiles.map(item => {
						item.name = item.path.slice(-8);
						return item;
					});
					this.fileList.push(...pictures);
					this.$refs.popup.close();
					// console.log(JSON.stringify(pictures));
				}
			});
		},
		// 上传微信文件
		getWxFile: function() {
			wx.chooseMessageFile({
				success: res => {
					const files = res.tempFiles;
					this.fileList.push(...files);
					this.$refs.popup.close();
					// console.log(JSON.stringify(files));
				}
			});
		},
		// 预览图片
		previewImage: function(index) {
			var reg = /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/;
			const urls = this.fileList
				.map(item => {
					if (reg.test(item.name)) {
						return item.path;
					}
				})
				.filter(item => item);
			// console.log('urls',urls)
			uni.previewImage({
				current: index,
				urls: urls,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						// console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		// 预览我的图片
		previewMyImage: function(index) {
			var reg = /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/;
			const urls = this.myfiles
				.map(item => {
					if (reg.test(item.name)) {
						return item.path;
					}
				})
				.filter(item => item);
			uni.previewImage({
				current: index,
				urls: urls,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						// console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		// 删除
		delImage: function(index) {
			const newarr = this.fileList.filter((item, i) => {
				if (index !== i) {
					return item;
				}
			});
			this.fileList = newarr;
			// console.log('删除后', this.fileList)
		},
		// 上传到云存储
		upload: async function(filePath, name, num) {
			try {
				let res = await uniCloud.uploadFile({
					filePath: filePath,
					cloudPath: name,
					onUploadProgress: progressEvent => {
						this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					},
					success: async function(res) {
						// res.fileID 文件ID（每次上传一个）
						const uid = uni.getStorageSync('uid');
						// 设置延时确保记录
						setTimeout(async function() {
							const final = await uniCloud.callFunction({
								name: 'uploadFiles', // 云函数名字
								data: {
									files: res.fileID,
									uid: uid
								} // 传输数据
							});
							console.log(final);
						}, 500 * num);
					}
				});
				return res;
			} catch (e) {
				return e;
			} finally {
				return {
					code: 1,
					msg: 'ok'
				};
			}
		},
		// 确认上传
		confirmUpload: function() {
			this.uploadState = true;
			this.fileList.forEach((item, index) => {
				const res = this.upload(item.path, item.name, index);
				res.then(res => {
					// 上传完成删除本地文件
					if (res.code === 1) {
						this.myfiles.push(item);
						this.delImage(0);
						if (index === this.fileList.length - 1) {
							// 最后一个文件上传成功
							this.$refs.message.open();
						}
					} else {
						console.log('上传失败');
					}
				});
			});
		}
	},
	// 分享
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: '时光盘',
			path: '/pages/index/index?id=123'
		};
	},
	async onLoad() {},
	mounted() {}
};
</script>

<style lang="less">
.container {
	width: 650rpx;
	margin: 0rpx auto;
	font-size: 28rpx;

	.Article {
		padding: 10px;
		margin-top: 80rpx;

		.usb,
		.usb_ready {
			background-color: #656d78;
			width: 215px;
			height: 215px;
			margin: 0 auto;
			border-radius: 50%;
			position: relative;

			.usb_img {
				margin: 0 auto;
				display: block;
				width: 215px;
				height: 215px;
			}

			// 进度条
			.propress {
				position: absolute;
				top: -24rpx;
				left: -24rpx;
			}
		}

		.usb_ready {
			background-color: #0f9f50;
		}

		.uploadtitle {
			margin-top: 40rpx;
			text-align: center;
			color: #c0c0c0;
			font-size: 26rpx;
		}

		.addBox {
			width: 100%;
			height: 30px;
			text-align: center;
			// background: url(/static/images/upload.png) no-repeat center center;
			position: relative;
			border: 1px dashed #656d78;
			margin: 0 auto;
			border-radius: 8px;
			background-color: #fafafa;
			margin-top: 10px;
		}

		// 文件列表
		.filesBox {
			margin-top: 28rpx;

			.fileslist {
				margin-top: 8px;
				line-height: 42rpx;

				.upfileico {
					width: 42rpx;
					height: 40rpx;
					display: inline-block;
					vertical-align: top;
					margin-right: 10rpx;
				}

				.upname {
					font-size: 26rpx;
					height: 42rpx;
					line-height: 42rpx;
					color: #333333;
					width: 80%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: inline-block;
				}

				.upclose {
					width: 40rpx;
					height: 40rpx;
					display: inline-block;
					float: right;
					position: relative;
					top: 3px;
				}
			}
		}

		// 我的文件
		.myfiles {
			margin-top: 30rpx;
			padding: 8rpx;
			border: 1px solid #cfcfcf;
			border-radius: 20rpx;
		}
	}

	.upload {
		margin-top: 30rpx;
	}

	// 模态框css
	.mainArea {
		width: 500rpx;
		height: 300rpx;
		background-color: #fff;
		border-radius: 34rpx;
		padding: 20rpx;

		.picture {
			width: 60%;
			margin-top: 60rpx;
			font-size: 30rpx;
		}

		.wxFile {
			width: 60%;
			margin-top: 40rpx;
			font-size: 30rpx;
		}
	}
}
</style>
