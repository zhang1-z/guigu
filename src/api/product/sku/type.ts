export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

//定义SKU对象的ts类型
export interface Attr {
  attrId: number | string,
  valueId: number | string,
  id?: number
}
export interface saleArr {
  saleAttrId: number | string,
  saleAttrValueId: number | string,
  id?: number
}
export interface SkuData {
  category3Id?: string | number,
  spuId?: string | number,
  tmId?: number | string,
  skuName?: string,
  price?: string | number,
  weight?: string | number,
  skuDesc?: string,
  skuAttrValueList?: Attr[],
  skuSaleAttrValueList?: saleArr[],
  skuDefaultImg?: string,
  isSale?: number,
  id?: number
}

//获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[],
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
  }
}
export interface SkuInfoData extends ResponseData {
  data: SkuData
}