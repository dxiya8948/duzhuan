import Vue from 'vue'

Vue.prototype.$upload = async (filePath, name) => {
	try {
		let res = await uniCloud.uploadFile({
			filePath: filePath,
			cloudPath: name,
			onUploadProgress: function(progressEvent) {
				console.log(that, progressEvent);
				// this.percentCompleted = Math.round(
				// 	(progressEvent.loaded * 100) / progressEvent.total
				// );
			},
		})
		return res
	} catch (e) {
		return e
	} finally {
		// uni.hideLoading()
	}
}
