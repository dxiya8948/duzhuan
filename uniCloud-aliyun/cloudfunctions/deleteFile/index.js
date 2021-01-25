'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	const filesCollection = db.collection('uni-id-users-files');
	
	// 全部清空---------------------------⬇
	// 获取所有的files，整合为一个，传入删除数组中
	const all = await filesCollection.field({
		'files': true
	}).get()
	
	// console.log(all.data[0].files)  // all.data[0].files为选择到的文件ID列表
	
	const res = await uniCloud.deleteFile({
		fileList: all.data[0].files
	})
	
	const userFiles = await filesCollection.field({
		'files': true
	}).update({
		files: []
	})
	
	//返回数据给客户端
	return userFiles
};
