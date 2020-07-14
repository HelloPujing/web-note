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
