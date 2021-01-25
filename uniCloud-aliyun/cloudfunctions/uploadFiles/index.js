'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('uid : ', event.uid)
	// const usersCollection = db.collection('uni-id-users');
	const filesCollection = db.collection('uni-id-users-files');

	const fileList = await filesCollection.where({
		_id: event.uid
	}).get()

	if (fileList.affectedDocs < 1) {
		// 新增用户文件列表
		filesCollection.doc(event.uid).set({
			files: [event.files],
			uid: event.uid
		})
		
		//返回数据给客户端
		return {
			code: 1,
			msg: '新增用户列表'
		}
	}
	 else {
		// 将新文件ID存入
		let userFiles = filesCollection.where({
			_id: event.uid
		})
		let oldarr = fileList.data[0].files
		userFiles.update({
			files: [...oldarr, event.files]
		})
	

	//返回数据给客户端
	return {
		code: 1,
		msg: '用户上传完毕'
	}
	}
};
