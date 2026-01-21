import request from "../../../utils/request"
import type { HasSpuResponseData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, SpuData, SkuData, SkuInfoData } from "./type"
enum API {
  //获取已有的SPU数据
  HASSPU_URL = '/admin/product/',
  //获取全部品牌的数据
  AllTradeMark_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个SPU下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某一个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性【原色、版本、尺码】
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新增的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某一个已有SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/'
}
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
export const reqAllTradeMark = () => request.get<any, AllTradeMark>(API.AllTradeMark_URL)
export const reqSpuImageList = (spuId: number) => request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
//添加一个新的SPU
//更新已有的SPU接口
//data：即为新增的SPU或者已有的SPU对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVESPU_URL + spuId)