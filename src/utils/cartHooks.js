import { format, isAfter, isWithinInterval } from 'date-fns';
import { setCartCache, getConfigCache } from './customHook';
import { stockLocation } from './Constants';

import { useState, useEffect } from 'react';

// rules
const deliveryFeeType = "dynamic" // static / dynamic
const minPurchases = 0;
const baseWeight = 200;
const minWeight = 0;
const maxWeight = 2000;
const placeOrderConditions = [
    {
      type: 'range',
      property: 'weight',
      min: minWeight,
      max: maxWeight
    }
]
const deliveryFeeMethods = {
    static: {
        code: 'deliveryFee',
        type: 'static',
        defaultValue: 220
    },
    dynamic: {
        code: 'deliveryFee',
        type: 'dynamic',
        defaultValue: 220,
        conditions: [
            {
                type: 'range',
                property: 'weight',
                min: 0,
                max: 1000,
                value: 160
            }, 
            {
                type: 'range',
                property: 'weight',
                min: 1000,
                max: 1500,
                value: 190
            },
            {
                type: 'range',
                property: 'weight',
                min: 1500,
                max: 2000,
                value: 220
            }
        ]
    }
}
export const useCartCalculation = (items=[], promotions=[]) => {
    let result = {
        type: stockLocation,
        items: items,
        deliveryFee: 0,
        charges: [],
        total: 0,
        subTotal: 0,
        allowOrder: false,
        totalWeight: baseWeight
    }
    let configCache = getConfigCache() && getConfigCache().config ? getConfigCache().config : {};
    const {
        delivery: fixedDeliveryFee = 0
    } = configCache;

    if (configCache && items.length > 0) {

        let totalWeight = baseWeight;
        let subTotal = 0;
        let deliveryFee = 0;
        let allowPlacingOrder = true;
        let message = "";
    
        // get total weight & subTotal
        items.forEach((anItem)=>{
            let checkedSalePrice = anItem.onSale && anItem.salePrice != null ? anItem.salePrice : anItem.price;
            subTotal += (checkedSalePrice * anItem.qty);
            // if (anItem.onSale) {
            //     let checkedSalePrice = anItem.salePrice ? anItem.salePrice : anItem.price;
            //     subTotal += (checkedSalePrice * anItem.qty);
            // }
            // else {
            //     subTotal += (anItem.price * anItem.qty);
            // }
            totalWeight += (anItem.weight * anItem.qty);
        });

        // check whether passed basic conditions or not to place order
        if (placeOrderConditions.length != 0) {
            let checkedOrderResult = conditionRangeChecker(totalWeight, placeOrderConditions[0]);
            if (checkedOrderResult != null && !checkedOrderResult.success) {
                allowPlacingOrder = false;
                message += '\n' + checkedOrderResult.message;
            }
        }

        let allExtras = [];
        if (deliveryFeeType == 'dynamic') {
            // custom shipping fee based on weights
            let foundMethod = deliveryFeeMethods[deliveryFeeType]
            if (foundMethod) {
                let conditionMatchedValue = null;
                foundMethod.conditions && foundMethod.conditions.forEach((aCondition)=>{
                    let compareResult = isBetween(totalWeight, aCondition.min, aCondition.max);
                    if (compareResult) {
                        conditionMatchedValue = aCondition.value;
                    }
                });
                if (conditionMatchedValue == null) {
                    conditionMatchedValue = foundMethod.defaultValue;
                }
                deliveryFee = conditionMatchedValue;
                allExtras.push({
                    code: 'deliveryFee',
                    name: '邮费',
                    value: conditionMatchedValue
                })
                // conditions's order affect the result, should arrange from lower range to higher range (deliveryFeeMethods[1].conditions)
                // foundMethod.conditions && foundMethod.conditions.forEach((aCondition)=>{
                //     let checkResult = conditionRangeChecker(totalWeight, aCondition);
                //     if (checkResult != null && checkResult.success) {
                //         deliveryFee = checkResult.value;
                //         allExtras.push({
                //             code: 'deliveryFee',
                //             name: '邮费',
                //             value: checkResult.value
                //         })
                //     }
                // })
            }
        }
        else {
            deliveryFee = fixedDeliveryFee;
            allExtras.push({
                code: 'deliveryFee',
                name: '邮费',
                value: fixedDeliveryFee
            })
        }
        
        let finalSubtotal = subTotal;
        let finalDeliveryFee = deliveryFee;
        promotions.forEach((aPromotion)=>{
            let discountValue = aPromotion.discountValue ? parseFloat(aPromotion.discountValue) : 0;
            let value = discountValue;
            if (aPromotion.rewardType == 'percentage') {
                value = finalSubtotal * discountValue / 100;
                finalSubtotal = finalSubtotal - (finalSubtotal * discountValue / 100)
                if (finalSubtotal < 0) {
                    finalSubtotal = 0;
                }
            }
            else if (aPromotion.rewardType == 'fixedAmount') {
                finalSubtotal = finalSubtotal - discountValue;
                if (finalSubtotal < 0) {
                    finalSubtotal = 0;
                }
            }
            else if (aPromotion.rewardType == 'freeShipping') {
                value = deliveryFee;
                finalDeliveryFee = 0;
    
            }
            else if (aPromotion.rewardType == 'charges') {
                finalSubtotal += discountValue;
                if (finalSubtotal < 0) {
                    finalSubtotal = 0;
                }
            }
    
            allExtras.push({
                promotionId: aPromotion._id,
                name: aPromotion.name,
                description: aPromotion.description,
                type: aPromotion.type,
                rewardType: aPromotion.rewardType,
                discountValue: aPromotion.discountValue,
                value: value
            })
        })
    
        let total = 0;
        total = finalSubtotal + finalDeliveryFee;
        let allowOrder = totalWeight >= minWeight && totalWeight <= maxWeight && subTotal >= minPurchases;
        result = {
            type: stockLocation,
            items: items,
            deliveryFee: finalDeliveryFee,
            charges: allExtras,
            total: total,
            subTotal: subTotal,
            allowOrder: allowOrder,
            totalWeight: totalWeight
        }
        
    }
    return result;
}

const getTotalFromItems = (items, property, initial = 0) => {
  let total = initial;
  items.forEach((anItem)=>{
    if (property == 'weight') {
      total += (anItem[property] * anItem['qty']);
    }
    else {
      total += anItem[property];
    }
  });
  return total;
}

const isBetween = (value, min, max) => {
    let result = false;
    if (value > min && value <= max) {
        result = true;
    }
    return result;
}
export const isBetween2 = (min = null, max = null, value = null, type = 'includeMin') => {
  // include min -> value >= min && value < max
  // include max -> value > min && value <= max

  let result = false;
  if (value && !(min == null && max == null)) {
    let passedMin = min == null ? true : false;
    let passedMax = max == null ? true : false;

    if (!passedMin) {
      if (type == 'includeMin') {
        passedMin = value >= min;
      }
      else if (type == 'includeMax') {
        passedMin = value > min;
      }
    }

    if (!passedMax) {
      if (type == 'includeMin') {
        passedMax = value < max;

      }
      else if (type == 'includeMax') {
        passedMax = value <= max;
      }
    }

    result = passedMin && passedMax;
  }
  return result;
}

const conditionRangeChecker = (total, condition = null) => {
  let checkedConditionResult = null;

  if (condition != null) {
    if (condition.type == 'range') {
      let minValue = condition.min ? condition.min : null;
      let maxValue = condition.max ? condition.max : null;
  
      let passedMin = minValue == null ? true : false;
      let passedMax = maxValue == null ? true : false;
  
      if (minValue > maxValue && (minValue != null && maxValue != null)) {
        passedMin = false;
        passedMax = false;
      }
      else {
        if (minValue != null && total > minValue) {
          passedMin = true;
        }
        if (maxValue != null && total <= maxValue) {
          passedMax = true;
        }
      }
  
      let success = passedMin && passedMax;
      checkedConditionResult = {
        ...condition,
        success: success,
        message: !success ? condition.property + " not within range" : ""
      };
    }

  }

  return checkedConditionResult;
}

/*
  check:
  published
  date (expired/onGoing)
  conditions (all minimums)

  */

 const groupPromotions = (promotions=[]) => {
  let allPromotions = promotions
  let activePromotions = []
  let passivePromotions = []
  allPromotions.forEach((aPromotion)=>{
    let validPromotion = checkPromotionStatus(aPromotion.startDate, aPromotion.endDate) && aPromotion.published;
    if (validPromotion) {
      if (aPromotion.type == 'active') {
        activePromotions.push(aPromotion)
      }
      else if (aPromotion.type == 'passive') {
        passivePromotions.push(aPromotion)
      }
    }
  })

  return {
    activePromotions,
    passivePromotions
  }
}

const checkPromotionStatus = (start, end) => {
  let started = isAfter(new Date(), new Date(start));
  let expired = isAfter(new Date(), new Date(end));

  return expired ? false : (started ? true : false) 
}

const checkPromotionConditions = (cartItems, promotion) => {
  let totalPurchases = 0;
  let totalQuantity = 0;
  let totalWeight = 0;

  let selectedPromotionProducts = promotion.products;
  let selectedPromotionCategories = promotion.categories;

  cartItems.forEach((aCartItem)=>{
    let passedProducts = false;
    if (aCartItem.product && aCartItem.product._id) {
      passedProducts = selectedPromotionProducts.length > 0 ? selectedPromotionProducts.indexOf(aCartItem.product._id) >= 0 : true;
    }
    let passedCategories = false;
    if (aCartItem.product && aCartItem.product.categoryId) {
      passedCategories = selectedPromotionCategories.length > 0 ? selectedPromotionCategories.indexOf(aCartItem.product.categoryId) >= 0 : true;
    }

    if (passedProducts && passedCategories) {
      let price = aCartItem.onSale && aCartItem.salePrice ? aCartItem.salePrice : aCartItem.price;
      totalPurchases += (price * aCartItem.qty);
      totalQuantity += aCartItem.qty;
      if (aCartItem.weight) {
        totalWeight += (aCartItem.weight * aCartItem.qty);
      }
    }
  });

  let minPurchases = promotion.minPurchases;
  let minQuantity = promotion.minQuantity;
  let minWeight = promotion.minWeight;

  let passedPurchases = true;
  if (minPurchases) {
    passedPurchases = totalPurchases >= minPurchases
  }
  let passedQuantity = true;
  if (minQuantity) {
    passedQuantity = totalQuantity >= minQuantity 
  }
  let passedWeight = true;
  if (minWeight) {
    passedWeight = totalWeight >= minWeight
  }

  let result = null;

  if (passedPurchases && passedQuantity && passedWeight) {
    result = promotion
  }
  
  return result;
}

const checkPassivePromotions = (cartItems=[], promotions=[]) => {
  let availablePromotions = [];
  promotions.forEach(aPromotion=>{
    let passed = checkPromotionConditions(cartItems, aPromotion)
    if (passed) {
      availablePromotions.push(passed);
    }
  });
  return availablePromotions;
}

export const checkActivePromotions = (cartItems=[], promotions=[], promoCode=null) => {
  let result = [];
  if (promoCode) {
    let foundPromotion = promotions.find((aPromotion)=>{
      if (aPromotion.code) {
        let isWithinPeriod = isWithinInterval(new Date(), {
          start: new Date(aPromotion.startDate),
          end: new Date(aPromotion.endDate)
        })
        return isWithinPeriod && aPromotion.code == promoCode
      }
      return false;
    });

    if (foundPromotion) {
      let passed = checkPromotionConditions(cartItems, foundPromotion);
      if (passed) {
        result.push(passed);
      }
    }
  }

  return result;
}

export const handlePromotionsChecking = (cartItems, promotionsData=[], promoCode=null) => {
  let { activePromotions, passivePromotions } = groupPromotions(promotionsData);
  let passedPassive = checkPassivePromotions(cartItems, passivePromotions);
  let passedActive = checkActivePromotions(cartItems, activePromotions, promoCode);

  let allPassed = [...passedPassive, ...passedActive]
  // console.log('allPassed',allPassed)
  // console.log('activePromotions',activePromotions)
  // console.log('passivePromotions',passivePromotions)
  return allPassed;
}