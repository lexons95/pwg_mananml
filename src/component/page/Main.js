import React, {useState} from 'react';
import { configId } from '../../utils/Constants';
import { useConfigCache } from '../../utils/customHook';

import { List, Typography, Divider } from 'antd';
import { Table, Tag, Space } from 'antd';
import wallpaper from '../../img/wallpaper.jpg';
import background from '../../img/plane-background.jpg'


const { Paragraph } = Typography;

const Main = (props) => {
  const configCache = useConfigCache();
  const data = [
  '斯坦尼斯烟斗草是捷克烟斗收藏大师Dr.Josef Stanislav的得意杰作，他推出飞机系列的初衷是为了纪念自己的爸爸和爷爷，因为他们参与了第一次世界大战（1914-1918），并在战后成立的捷克斯洛伐克共和国担任战斗机飞行员，保卫共和国。',
  '此次活动中，只要下单斗草的客户都可以获赠2种口味的斗草试抽包，口味任选。此外，鉴于年中的皇室活动圆满结束，但是活动结束不代表给予粉丝们的实惠就次止步，马男决定网站所有手卷草降价3-9ASd元asd，具体价格以网站显示为主。'
];

const des1 = [
'（1）邮费：1公斤以内邮费80人民币，1公斤到2公斤邮费96人民币，2公斤到3公斤邮费116人民币，单个包裹重量不得超过3公斤。',
'（2）下单后48小时内出国际快递单号，鉴于目前疫情还未平息，本地国际物流每周五运输。',
'（3）物流时间大概10-15个工作日，网站可以自行查询快递状态，当快递到达中国之后，是由中国邮政投递，在中国大陆运输的状态可以在中国邮政官网查询。',
'（4）当顾客在本网站下单时，即被视为该产品的进口者，所以需要承担进口产品的关税，进口税，商品以及服务税（GST），增值税（VAT）或其他进口销售税项。有关进口税项等事宜，请直接与您当地的海关部门联络。',
'（5）网站目前可以通过搜索用户手机号码来查询订单，订单页面还能查询订单的状态。'
];

const des2 = [
  '(1) 如果包裹被海关退运，需要客户承担退运运费。其次，等到包裹确认退运并且在我方收到之后，方可再次给客户补发包裹。'
];

const des3 = [
  '（1）以下情况我们会按照退货方式处理，如产品出现损坏（海关拆包检验不算在退货情况内），发霉，退货方式可以选择返还客户购买金额或者补发货物。',
  '（2）非产品质量问题，不接受客户退货退款请求。'
];

const des4 = `
开春海淘季
 
海淘活动宗旨 share&enjoy
因为疫情影响，网站休业，开春之际，网站重新启航
同时为大家带来了部分新品
Stanislaw为马男的主打斗草
独家的 “四季” 和 “四元素” 欢迎大家品鉴
Colts，Bison，马男德国.. .. 大家喜欢的RYO也一并上线
欢迎和您身边的朋友分享，一起享受
 
快递说明 
此次快递为国际快递，周期为2周左右
发货周期为一周左右

 
share&enjoy
`
//
// const dataSource = [
//   {
//     key: '1',
//     package: 'A （5+1）包',
//     tax: 60,
//     fee: 15,
//   },
//   {
//     key: '2',
//     package: 'B （10+2）包',
//     tax: 120,
//     fee: 30,
//   },
//   {
//     key: '3',
//     package: 'C （15+3）包',
//     tax: 180,
//     fee: 55,
//   },
//   {
//     key: '4',
//     package: 'D （20+4）包',
//     tax: 240,
//     fee: 70,
//   },
//   {
//     key: '5',
//     package: 'E （25+5）包',
//     tax: 300,
//     fee: 90,
//   },
// ];
//
// const columns = [
//   {
//     title: '套餐',
//     dataIndex: 'package',
//     key: 'package',
//     width: '130px'
//   },
//   {
//     title: '未参保预计缴纳税费',
//     dataIndex: 'tax',
//     key: 'tax',
//   },
//   {
//     title: '税险包价格',
//     dataIndex: 'fee',
//     key: 'fee',
//   },
// ];

    return (
      <div style ={{padding: '35px'}}>
        <div>
          {/* <h1>斯坦尼斯斗草狂欢节</h1> */}
          {/* <div>活动时间2020年7月8日-2020年7月31日</div> */}
          {/* <img src={wallpaper} className = 'main-wallpaper' /> */}
          <pre>{des4}</pre>
        </div>

        {/* <div style = {{textAlign: 'left', marginTop: '40px'}}>
          <Divider orientation="left">活动明细</Divider>

          <div className="main-section-container">

              <div className = "main-style">

              </div>

              <List
                size="small"
                header={<div style = {{fontWeight: 'bold'}}></div>}
                footer={<div style = {{textAlign: 'center'}}>Share & Enjoy</div>}
                dataSource={data}
                renderItem={item => <List.Item className = "main-activityItem">{item}</List.Item>}
              />
          </div>

            <Divider orientation="left" style = {{marginTop: '40px'}}>海淘小贴士</Divider>
            <List
              size="small"
              header={<div style = {{fontWeight: 'bold', textAlign:'left'}}>一. 关于邮费和运输</div>}
              dataSource={des1}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
            <List
              size="small"
              header={<div style = {{fontWeight: 'bold'}}>二. 关于退运</div>}
              dataSource = {des2}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
            <List
              size="small"
              header={<div style = {{fontWeight: 'bold'}}>三. 关于退货</div>}
              dataSource = {des3}
              renderItem={item => <List.Item>{item}</List.Item>}
            />

            <Divider orientation="left" style = {{marginTop: '40px'}}>关于我们</Divider>
            <div>
              <p>我们是东南亚成长最快的烟草和烟斗代理商和零售商，市场遍布亚洲。我们的理念是给我们的客户带来世界上最好的烟草和独一无二的品吸体验。</p>
              <p>我们十分注重圈子文化的培养，成为我们圈子的一员，分享你觉得好的东西，让四海之内志同道合的人成为好友；一切产品，一切的热爱都是载体，这是形成圈子的基石，彼此珍惜圈子群，共同维护圈子内良好的环境，多交流多沟通，和平共处，营造良好氛围。</p>
            </div>
          </div> */}

          {/*<div style = {{marginTop: '40px'}}>
            <Divider orientation="left" >海关税费</Divider>
            <Table dataSource={dataSource} columns={columns} pagination = {false}/>
          </div>*/}


      </div>
    );
    // return (
    //   <div style ={{padding: '35px'}}>
    //     <div>
    //       <h1>斯坦尼斯斗草狂欢节</h1>
    //       <div>活动时间2020年7月8日-2020年7月31日</div>
    //       <img src = {wallpaper} className = 'main-wallpaper' />
    //     </div>

    //     <div style = {{textAlign: 'left', marginTop: '40px'}}>
    //       <Divider orientation="left">活动明细</Divider>

    //       <div className="main-section-container">

    //           <div className = "main-style">
    //             {/*<img src = {background} className = 'main-background' /> */}
    //           </div>

    //           <List
    //             size="small"
    //             header={<div style = {{fontWeight: 'bold'}}></div>}
    //             footer={<div style = {{textAlign: 'center'}}>Share & Enjoy</div>}
    //             dataSource={data}
    //             renderItem={item => <List.Item className = "main-activityItem">{item}</List.Item>}
    //           />
    //       </div>

    //         <Divider orientation="left" style = {{marginTop: '40px'}}>海淘小贴士</Divider>
    //         <List
    //           size="small"
    //           header={<div style = {{fontWeight: 'bold', textAlign:'left'}}>一. 关于邮费和运输</div>}
    //           dataSource={des1}
    //           renderItem={item => <List.Item>{item}</List.Item>}
    //         />
    //         <List
    //           size="small"
    //           header={<div style = {{fontWeight: 'bold'}}>二. 关于退运</div>}
    //           dataSource = {des2}
    //           renderItem={item => <List.Item>{item}</List.Item>}
    //         />
    //         <List
    //           size="small"
    //           header={<div style = {{fontWeight: 'bold'}}>三. 关于退货</div>}
    //           dataSource = {des3}
    //           renderItem={item => <List.Item>{item}</List.Item>}
    //         />

    //         <Divider orientation="left" style = {{marginTop: '40px'}}>关于我们</Divider>
    //         <div>
    //           <p>我们是东南亚成长最快的烟草和烟斗代理商和零售商，市场遍布亚洲。我们的理念是给我们的客户带来世界上最好的烟草和独一无二的品吸体验。</p>
    //           <p>我们十分注重圈子文化的培养，成为我们圈子的一员，分享你觉得好的东西，让四海之内志同道合的人成为好友；一切产品，一切的热爱都是载体，这是形成圈子的基石，彼此珍惜圈子群，共同维护圈子内良好的环境，多交流多沟通，和平共处，营造良好氛围。</p>
    //         </div>
    //       </div>

    //       {/*<div style = {{marginTop: '40px'}}>
    //         <Divider orientation="left" >海关税费</Divider>
    //         <Table dataSource={dataSource} columns={columns} pagination = {false}/>
    //       </div>*/}


    //   </div>
    // );
}

export default Main
