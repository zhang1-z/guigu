//服务器全部接口返回的数据类型
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

//SPU数据的ts类型
export interface SpuData {
  id?: number,
  spuName: string,
  description: string,
  category3Id: string | number,
  tmId: number | string,
  spuSaleAttrList: null | SaleAttr[],
  spuImageList: null | SpuImg[]
}
//数组：元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
  }
}

export interface Trademark {
  id: number,
  tmName: string
  logoUrl: string
}
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

export interface SpuImg {
  id?: number,
  createTime?: string,
  updateTime?: string,
  spuId?: number,
  imgName?: string,
  imgUrl?: string,
  name?: string,
  url?: string
}
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}
export interface SaleAttrValue {
  id?: number,
  createTime?: null,
  updateTime?: null,
  spuId?: number,
  baseSaleAttrId: number | string,
  saleAttrValueName: string,
  saleAttrName?: string,
  isChecked?: null
}
export type SpuSaleAttrValueList = SaleAttrValue[]
export interface SaleAttr {
  id?: number,
  createTime?: null,
  updateTime?: null,
  spuId?: number,
  baseSaleAttrId: number | string,
  saleAttrName: string | undefined,
  spuSaleAttrValueList: SpuSaleAttrValueList,
  flag?: boolean,
  saleAttrValue?: string,
}
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}
export interface HasSaleAttr {
  id: number,
  name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
export interface Attr {
  attrId: number | string,
  valueId: number | string,
}
export interface saleArr {
  saleAttrId: number | string,
  saleAttrValueId: number | string,
}
export interface SkuData {
  category3Id: string | number,
  spuId: string | number,
  tmId: number | string,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  skuAttrValueList?: Attr[],
  skuSaleAttrValueList?: saleArr[],
  skuDefaultImg: string,
}
//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}