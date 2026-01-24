import request from "../../../utils/request"
import type { SkuInfoData, SkuResponseData } from "./type"
enum API {
  //获取已有的商品的数据SKU
  SKU_URL = '/admin/product/list/',
  //上架
  SALE_URL = '/admin/product/onsale/',
  //下架
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //获取商品详细接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  //删除已有的商品
  DELETESKU_URL = '/admin/product/deleteSku/'
}

export const reqSkuList = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)
export const reqCanCelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
export const reqRemoveSku = (skuId: number) => request.get<any, any>(API.DELETESKU_URL + skuId)