import request from "../../../utils/request"
import type { MenuResponseData, RoleData, RoleResponseData } from "./type"

enum API {
  //获取全部的职位接口
  ALLROLE_URL = '/admin/acl/role/',
  //新增岗位的接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  //更新已有的职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  //获取全部的菜单与按钮的数据
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  //给相应的职位分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign?',
  //删除已有职位
  REMOVEROLE_URL = '/admin/acl/role/remove/'
}

export const reqAllRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`)
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)
export const reqSetPermission = (roleId: number, permissionId: number[]) => request.post<any, any>(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(API.REMOVEROLE_URL + roleId)