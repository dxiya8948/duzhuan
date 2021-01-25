'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	const collection = db.collection('uni-id-users') // 获取user表的集合对象
	let user

	if (event.openid) {
		// 微信登录
		user = await collection.where({
			wx_openid: {
				'mp-weixin': event.openid
			}
		}).get()

		if (user.affectedDocs < 1) {
			// const res = await uniID.register({
			// 	event.openid,
			// 	event.password,
			// })
			// 没有就新增
			await collection.add({
				// openid: event.openid,
				wx_openid: {
					'mp-weixin': event.openid
				}, // wx -- openid
				avatar: event.wxInfo.avatarUrl, // 微信头像
				gender: event.wxInfo.gender, // 微信性别
				nickName: event.wxInfo.nickName, // 微信昵称
				status: 0, // 用户状态
				username: event.username,
				password: event.password,
			})
		}

		return {
			code: 0,
			msg: 'success'
		}
	} else {
		user = await collection.where({
			username: event.username,
			password: event.password
		}).get()

		// 分析结果
		if (user.affectedDocs < 1) {
			return {
				code: -1,
				msg: '用户名或密码错误！'
			}
		} else {
			return {
				code: 0,
				msg: 'success'
			}
		}
	}
	//返回数据给客户端
	return event
};
