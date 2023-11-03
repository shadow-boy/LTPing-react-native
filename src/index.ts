import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-ltping' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Ltping = NativeModules.Ltping
  ? NativeModules.Ltping
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );


/**
 * 开始批量ping
 * @param hostList 
 * @returns  返回结果的map pingMs = .get(host)
 */
export async function batchPing(hostList: Array<string>): Promise<Map<string, number>> {
  let result = await Ltping.batchPing(hostList)
  let map = new Map<string, number>()
  Object.keys(result).forEach(key => {
    map.set(key, result[key])
  })
  return map
}

/**
 * 重启ping，不带缓存的ping
 */
export function restartAppPing() {
  Ltping.restartAppPing()
}


// ping事件监听器
const pingStateListener: NativeEventEmitter = new NativeEventEmitter(Ltping);

/**
 * 事件名称
 */
export enum PingEventCons {
  pingDidUpdate = "singlePingDidUpdate",
  pingDidComplete = "batchPingDidComplete"
}


/**
 * 每次ping返回结果的回调
 * @param callback 
 * @returns 
 */
export const onPingDidUpdateListener = (callback: (state: Map<string, number>) => void) => {
  return pingStateListener.addListener(PingEventCons.pingDidUpdate, body => {
    if (callback) {
      let m = new Map<string, number>()
      Object.keys(body).forEach(key => {
        m.set(key, body[key])
      })
      callback(m)
    }

  });

}

/**
 * ping全部结束的回调
 * @param callback 
 * @returns 
 */
export const onPingDidCompletedListener = (callback: () => void) => {
  return pingStateListener.addListener(PingEventCons.pingDidComplete, callback);

}

export default Ltping