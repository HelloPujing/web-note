# 会员支付
> 创建订单(发起支付) -> 订单状态's轮询检测
> 用户交互数据变更 -> 重新创建订单 -> 重新检测状态

- pay/createMemberOrder // 创建订单
    - 【参数】：
    - productId
    - count
    - discountType
    - useBalance
    - from: web
    - payType: 13
    - (width)
    - 【返回】：
    - allUseBalance false
    - content 二维码支付体
    - orderId 订单号
    - payStatus 支付状态，不管还是重新请求订单状态查询接口
    - thirdPayAmount：第三方支付金额

- /trade/checkOrderStatus // 订单状态's轮询检测
    - 【参数】：id 订单号
    - 【返回】：状态码




# 刷新二维码（创建会员订单）
注意：改余额check，如果是全额抵扣，不会自动创建订单
- 被动：改数量、改优惠、改余额check、改支付宝/微信
- 被动：1小时超时
- 主动：全部余额抵扣，点击支付按钮

# 自动检测
- 创建订单成功就会自动检测

# 抖动操作
为了实时性，区分操作，有些立即生效，有些节流，有些防抖
- 余额支付按钮，立即生效，防抖，5秒
- 上报修改数量，延迟生效，防抖，1秒
