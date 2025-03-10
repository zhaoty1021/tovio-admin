import { PINIA_PREFIX } from "@/config";
// @ts-ignore
import cookies from "js-cookie";

/**
 * 封装获取用户信息的方法
 */
export const getToken = () => {
  const koiUser = window.localStorage.getItem(PINIA_PREFIX + "user");
  if (koiUser != null && koiUser != "" && koiUser != undefined) {
    const parseKoiUser = JSON.parse(koiUser);
    // console.log("parseKoiUser",parseKoiUser)
    const keys = Object.keys(parseKoiUser);
    if (keys.includes("token")) {
      return parseKoiUser.token;
    } else {
      return "";
    }
  } else {
    return "";
  }
};

/**
 * 各个小仓库之间进行数据交互使用 OR 页面获取storge值使用
 * window.sessionStorage
 * @method set 设置会话缓存
 * @method get 获取会话缓存
 * @method remove 移除会话缓存
 * @method clear 移除全部会话缓存
 */
export const koiSessionStorage = {
  put(key: string, value: any) {
    window.sessionStorage.setItem(PINIA_PREFIX + key, value);
  },
  set(key: string, value: any) {
    window.sessionStorage.setItem(PINIA_PREFIX + key, value);
  },
  get(key: string) {
    const value: any = window.sessionStorage.getItem(PINIA_PREFIX + key);
    return value;
  },
  remove(key: string) {
    window.sessionStorage.removeItem(PINIA_PREFIX + key);
  },
  clear() {
    window.sessionStorage.clear();
  },
  putJSON(key: string, jsonValue: any) {
    window.sessionStorage.put(PINIA_PREFIX + key, JSON.stringify(jsonValue));
  },
  setJSON(key: string, jsonValue: any) {
    window.sessionStorage.put(PINIA_PREFIX + key, JSON.stringify(jsonValue));
  },
  getJSON(key: string) {
    const jsonValue: any = window.sessionStorage.get(PINIA_PREFIX + key);
    return JSON.parse(jsonValue);
  }
};

/**
 * window.localStorage
 * @method set 设置
 * @method get 获取
 * @method remove 移除
 * @method clear 移除全部
 */
export const koiLocalStorage = {
  put(key: string, value: any) {
    window.localStorage.setItem(PINIA_PREFIX + key, value);
  },
  set(key: string, value: any) {
    window.localStorage.setItem(PINIA_PREFIX + key, value);
  },
  get(key: string) {
    const value: any = window.localStorage.getItem(PINIA_PREFIX + key);
    return value;
  },
  remove(key: string) {
    window.localStorage.removeItem(PINIA_PREFIX + key);
  },
  clear() {
    window.localStorage.clear();
  },
  putJSON(key: string, jsonValue: any) {
    window.localStorage.put(PINIA_PREFIX + key, JSON.stringify(jsonValue));
  },
  setJSON(key: string, jsonValue: any) {
    window.localStorage.put(PINIA_PREFIX + key, JSON.stringify(jsonValue));
  },
  getJSON(key: string) {
    const jsonValue: any = window.localStorage.get(PINIA_PREFIX + key);
    return JSON.parse(jsonValue);
  }
};

/**
 * cookies
 * @method set 设置
 * @method get 获取
 * @method remove 移除
 */
export const koiCookie = {
  put(key: string, value: any) {
    cookies.set(PINIA_PREFIX + key, value);
  },
  set(key: string, value: any) {
    cookies.set(PINIA_PREFIX + key, value);
  },
  get(key: string) {
    const value: any = cookies.get(PINIA_PREFIX + key);
    return value;
  },
  remove(key: string) {
    cookies.remove(PINIA_PREFIX + key);
  }
};
