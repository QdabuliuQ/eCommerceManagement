import {request} from './request'

export function getNavitem(type) {
  return request({
    url: 'menus',
  })
}