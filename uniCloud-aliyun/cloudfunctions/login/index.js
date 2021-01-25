'use strict';

const uniID = require('uni-id')
// const db = uniCloud.database()

exports.main = async (event, context) => {
	// uni的wx登录API
	const res = await uniID.loginByWeixin({
		code: event.code
	})
	
	// const collection = db.collection('uni-id-users') // 获取user表的集合对象
	// let user = await collection.where({
	// 	wx_openid: {
	// 		'mp-weixin': res.openid
	// 	}
	// }).get()
	
	// if (user.affectedDocs < 1) {
	// 	await collection.add({
	// 		ok: 'fuck no',
	// 	})
	// }else{
	// 	await collection.update({
	// 		avatar: event.wxInfo.avatarUrl, // 微信头像
	// 		gender: event.wxInfo.gender, // 微信性别
	// 		nickName: event.wxInfo.nickName, // 微信昵称
	// 	})
	// }
	
	//返回数据给客户端
	return res
};
