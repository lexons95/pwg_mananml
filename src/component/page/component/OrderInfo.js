import React, { useState } from 'react';
import { Modal, Divider, Descriptions, List, Avatar, Button } from 'antd';
import { format } from 'date-fns';
import {
  RedoOutlined
} from '@ant-design/icons';

import { defaultImage_system } from '../../../utils/Constants';
import { useConfigCache } from '../../../utils/customHook';

const OrderInfo = (props) => {
  const { order, closeModal, visible, ...restProps } = props;
  const configCache = useConfigCache();

  const [ imageVersion, setImageVersion ] = useState((new Date()).getTime())
  const orderItems = (item) => {
    let title = item.product.name;
    let variant = "";
    if (item.variant) {
      let variantKeys = Object.keys(item.variant);
      variantKeys.map((aKey, index)=>{
        variant += `${item.variant[aKey].name}: ${item.variant[aKey].value}${index == variantKeys.length -1 ? "" : ", "}`
      })
    }

    let imageSrc = defaultImage_system;
    if (configCache && item.product.image) {
      imageSrc = configCache.imageSrc + item.product.image;
    }
    return (
      <List.Item
        actions={[
          item.onSale && item.salePrice ? item.salePrice : item.price,
          "x" + item.qty
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar shape="square" src={imageSrc} />
          }
          title={title}
          description={variant}
        />
      </List.Item>
    )
  }

  let extraCharges = order && order.charges && order.charges.length > 0 ? order.charges : []
  // let foundDutyTaxInsurance = order && order.charges && order.charges.length > 0 ? order.charges.find((aCharge)=>{return aCharge.code && aCharge.code == "dutyTaxInsurance"}) : null
  // if (foundDutyTaxInsurance != null) {
  //   extraCharges.push(foundDutyTaxInsurance)
  // }

  const refreshImage = () => {
    let currentTime = (new Date()).getTime()
    setImageVersion(currentTime)
  }

  return (
    <Modal
      title={"Order"}
      width={'95%'}
      visible={visible}
      onCancel={closeModal}
      footer={null}
      //destroyOnClose
      wrapClassName={'orderInfo-modalWrapper'}
      style={{overflow:"hidden"}}
    >
    {
      order ?
      <React.Fragment>
        <Divider orientation="left">订单</Divider>
        <Descriptions
            size="small"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
        >
            <Descriptions.Item label="编号">{order._id}</Descriptions.Item>
            <Descriptions.Item label="订购日期">{format(new Date(order.createdAt), "MM/dd/yyyy hh:mm:ss aa")}</Descriptions.Item>
            <Descriptions.Item label="付款状态">
                {
                  order.paid ?
                    <span style={{"color":"green"}}>已付款</span> : <span style={{"color":"red"}}>待付款</span>
                }
            </Descriptions.Item>
            <Descriptions.Item label="货物状态">{order.sentOut ? <span style={{"color":"green"}}>已出货 <small> (运单号: {order.trackingNum})</small></span>:<span style={{"color":"red"}}>未出货</span>}</Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">收件人</Divider>
        <Descriptions
            id="buyerInfoTable"
            size="small"
            bordered
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
            <Descriptions.Item label="名字">{order.customer.name}</Descriptions.Item>
            <Descriptions.Item label="电话号码">{order.customer.contact}</Descriptions.Item>
            <Descriptions.Item label="收件地址">{order.customer.address}</Descriptions.Item>
            <Descriptions.Item label="邮编">{order.customer.postcode}</Descriptions.Item>
            <Descriptions.Item label="省份">{order.customer.province}</Descriptions.Item>
            <Descriptions.Item label="备注"><pre>{order.remark ? order.remark : '-'}</pre></Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">购买列表</Divider>
        <List
          itemLayout="horizontal"
          dataSource={order.items}
          renderItem={orderItems}
          //bordered
          footer={(
            <div className="orderInfo-item-summary">
              <Descriptions
                bordered={true}
                size="small"
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                style={{maxWidth:"100%"}}
              >
                {/* <Descriptions.Item label={"邮费"}>{order.deliveryFee ? order.deliveryFee : 0}</Descriptions.Item> */}
                {
                  extraCharges.length > 0 ? 
                  extraCharges.map((aCharge, index)=>{
                    let deduct = false;
                    if (aCharge.rewardType == 'percentage' || aCharge.rewardType == 'fixedAmount' || aCharge.rewardType == 'freeShipping') {
                      deduct = true
                    }
                    return <Descriptions.Item key={index} label={aCharge.name}>{deduct ? "-" : ""}{aCharge.value ? aCharge.value : ""}</Descriptions.Item>
                  }) : null
                }
                <Descriptions.Item label="总计">{order.total}</Descriptions.Item>
              </Descriptions>
            </div>
          )}
        />

        <div style = {{textAlign:'center'}}>
          <h1>扫码付款后记得备注名字，后台需要确认订单</h1>
          <Button onClick={refreshImage} icon={(<RedoOutlined/>)} />
        </div>

        <div className="orderInfo-extra">
          {
            configCache.paymentQRImage ?
            <div className="orderInfo-paymentQR" style={{textAlign:'center',flexGrow:1}}>
              <img src={configCache.imageSrc + configCache.paymentQRImage + "?v=" + imageVersion} />
            </div>
            : null
          }
          {
            order.sentOut && order.trackingNum ? (
              <div style={{textAlign:'center',flexGrow:1}}>
                <iframe src={`https://m.kuaidi100.com/app/query/?coname=indexall&nu=${order.trackingNum}`} style={{border:'none', maxWidth:'400px', height: '600px', textAlign:'center'}}></iframe>
              </div>
            ) : null
          }
        </div>
      </React.Fragment>
      : "Not found"
    }

    </Modal>
  )
}

export default OrderInfo;
