import React from 'react';
import ColorPanel from "../common/colorPanel";

const TestIframe = ({}) => {
  const onClick = () => {
    const frame = window.frames['vipPop'];
    console.log(frame);
    console.log(frame.document.head);
    console.log(frame.document.body);
  };

  return (
    <ColorPanel color={'green'}>
      <div style={{position: 'relative'}}>
        <iframe
          src="http://192.168.1.21/design"
          name="vipPop"
          width={800}
          height={400}
        >
        </iframe>
        <span style={{position: 'absolute'}}>关闭</span>
      </div>
      <div onClick={onClick}>get frame</div>
    </ColorPanel>
  );
};

export default TestIframe;

/*
* 跨域会报错
* SecurityError: Blocked a frame with origin "http://localhost:3000"
* from accessing a cross-origin frame.
*
* */

/*
*
* X-Frame-Options="SAMEORIGIN"
*
* */

