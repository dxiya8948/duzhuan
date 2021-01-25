<template>
	<view class="container">
		<view class="Article">
			<text v-for="text in Article" :key="text.key" class="Article-main">{{ text.content }}</text>
			<uni-easyinput type="textarea" v-model="inputV" class="Article-input" maxlength="-1"></uni-easyinput>
			<button size="default" type="primary" @click="sublimt()">确认</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			Article: [
				{
					content:
						'首善之区的西城的一条马路上，这时候什么扰攘也没有。火焰焰的太阳虽然还未直照，但路上的沙土仿佛已是闪烁地生光；酷热满和在空气里面，到处发挥着盛夏的威力。许多狗都拖出舌头来，连树上的乌老鸦也张着嘴喘气，——但是，自然也有例外的。远处隐隐有两个铜盏相击的声音，使人忆起酸梅汤，依稀感到凉意，可是那懒懒的单调的金属音的间作，却使那寂静更其深远了。',
					key: 0
				}
			],
			inputV: ''
		};
	},
	methods: {
		sublimt: function() {
			const newArticle = [
				...this.Article,
				{
					content: this.inputV,
					key: this.Article.length
				}
			];
			this.Article = newArticle;
			this.inputV = '';
		}
	}
};
</script>

<style lang="less">
.container {
	width: 650rpx;
	margin: 25rpx auto;
	font-size: 28rpx;

	.Article {
		.Article-main {
			width: 650rpx;
			display: block;
			overflow: hidden;
			margin-bottom: 20rpx;
			word-break: break-all;
		}

		.Article-input {
			width: 650rpx;
			/deep/ .uni-easyinput__content-textarea {
				height: 400rpx;
			}
		}
	}
}
</style>
