# 会员购买接口字段
```
- 服务端字段
{
    "_id" : 102,//付费会员充值产品id 主键
    "payTitle" : "美间专业版12个月", //标题 用作支付标题 后台编辑的标题 购买方案 以及会员订单展示用
    // "subTitle" : "0.54元/天",//废弃 不要
    "amount" : 199,//原价 单位元
    ~ "days" : 365,//购买后 增加会员天数多少天 后台前端编辑的时候不管
    // "discount" : 0,//废弃 老的折扣
    "title" : "12个月",//标题 只在购买页 展示的标题 后台编辑前端写死12个月传过来
    "createTime" : 1466782496178,//创建时间
    "updateTime" : 1494056207672,//最后更新时间
    // "limitCount" : 0,//终身购买限制 为0 不限购  现在去掉  后台编辑前端不管
    ~ "buyLimitCount" : 1,//非团购，没用每次购买限制 非团购商品写死1  后台编辑前端不管
    "minBuyLimitCount" : 1,//团购最小，每次最少购买现在 非团购商品写死1  后台编辑前端不管
    "maxBuyLimitCount" : 1,//团购最大，每次最大购买现在 非团购商品写死1 后台编辑前端不管
    "type" : 0,//类型 0:非团购商品 1:团购商品 后台编辑前端不管
    "status" : 1//状态 1:开启 0:关闭  购买时和后台编辑的时候只展示开启的  后台编辑前端不管
    "discounts":[//促销数组
         {
            "type":0,
            "name":"不使用优惠",
            "value":amount,
            "$discount": 10
         },
         {
            "type":1,//促销类型 1:活动价折扣 2:会员有效期内续费折扣 3:团购折扣 目前 团购商品只有3  非团购商品只有1 2
            "name":"活动名称",//这个后台前端编辑传
            "value":"99",// 促销价
            "$discount": 5
         },
         {
            "type":2,//促销类型 1:活动价折扣 2:会员有效期内续费折扣 3:团购折扣 目前 团购商品只有3  非团购商品只有1 2
            "name":"会员有效期内续费",//type==2 的时候 那么前端不要管 这个字段
            "value":"99",// 促销价
             "$discount": 3.9
         }
    ]
 }
```

```
/* solution新增字段 */
$isGroup // 是否团购方案

/* solution.discounts新增字段 */
$discount
```

```html
<!-- alipay content -->
<form 
    name="punchout_form" 
    method="post" 
    action="https://openapi.alipay.com/gateway.do?charset=utf-8&method=alipay.trade.page.pay&sign=m56oo1%2FleNuX1j%2FYcQbSLLCv2JquKk8EXrnce4tps%2FoRZ4Ec7V4StZzkkSj3scll80YZOx4%2BzISqXSbxHTPpfiW9ihOEGXm0dQYPysvkDDTm4mokq%2FwGODdO07IJZ%2Bs%2FpMNqSJcDlm9Rf%2F3cHx4CVz4jOSvVyMBd9vr03QuaXMWHnd%2FhpAmN9MIzeh3tbrTMyZlib8keTlOc%2BS6sue6LjSfqDZ4ihOiL3SFu%2B1mG20k0DxZPHDvfGOXJFOENfcf%2FlSlkfObFc8QnA4bci1JpRn4UtC4bwWL1ITBeuU7tyXfg9MqiMMREEBojh6k5UQCIkfY2vp57PToavxAJedGL2A%3D%3D&notify_url=http%3A%2F%2Fp.t.imeijian.cn%3A7011%2Fpay%2F2018102261810483%2Fnotify&version=1.0&app_id=2018102261810483&sign_type=RSA2&timestamp=2019-11-21+14%3A27%3A06&alipay_sdk=alipay-sdk-java-3.7.110.ALL&format=json"
>
    <input 
        type="hidden" 
        name="biz_content" 
        value="{&quot;out_trade_no&quot;:&quot;2019112114270686400c728dd76cdd81&quot;,&quot;total_amount&quot;:397.0,&quot;subject&quot;:&quot;美间会员个人版12个月&quot;,&quot;timeout_express&quot;:&quot;59m&quot;,&quot;qr_pay_mode&quot;:4,&quot;qrcode_width&quot;:208,&quot;body&quot;:&quot;美间会员个人版12个月&quot;,&quot;product_code&quot;:&quot;FAST_INSTANT_TRADE_PAY&quot;}"
    >
    <input 
        type="submit" 
        value="立即支付" 
        style="display:none" 
    >
</form>
<script>document.forms[0].submit();</script>
```

```javascript
 wechatContent = 'weixin://wxpay/bizpayurl?pr=06FM7EG'
```
