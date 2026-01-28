import request from "../../../utils/request"
import type { AllRoleResponseData, User, UserResponseData } from "./type"

enum Api {
  //获取全部已有用户账号信息
  ALLUSER_URL = '/admin/acl/user/',
  //添加一个新的用户账号
  ADDUSER_URL = '/admin/acl/user/save',
  //更新已有的用户账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取全部职位、当前账号拥有的职位接口
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  //给已有的用户分配角色接口
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  //删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //批量删除的接口
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}

export const reqUserInfo = (page: number, limit: number, username: string) => request.get<any, UserResponseData>(Api.ALLUSER_URL + `${page}/${limit}?username=${username}`)
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(Api.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(Api.ADDUSER_URL, data)
  }
}
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(Api.ALLROLE_URL + userId)
export const reqSetUserRole = (data: any) => request.post<any, any>(Api.SETROLE_URL, data)
export const reqRemoveUser = (userId: number) => request.delete<any, any>(Api.DELETEUSER_URL + userId)
export const reqSelectUser = (idList: number[]) => request.delete(Api.DELETEALLUSER_URL, { data: idList })