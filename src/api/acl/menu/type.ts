export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}
export interface Permisstion {
  id: number,
  createTime: string,
  updateTime: string,
  pid: number,
  name: string,
  code: null,
  toCode: null,
  type: number,
  status: null,
  level: number,
  children: Permisstion[],
  select: boolean
}
export interface PermisstionResponseData extends ResponseData {
  data: Permisstion[]
}
export interface MenuParams {
  id?: number,
  code: string,
  level: number,
  name: string,
  pid: number,
}