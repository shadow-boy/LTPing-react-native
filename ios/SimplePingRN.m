

#import "SimplePingRN.h"

@interface RCT_EXTERN_MODULE(Ltping, RCTEventEmitter)


RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(batchPing:(NSArray * )hostList resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(restartAppPing)

RCT_EXTERN_METHOD(clean)


RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(getSyncLatencyForHost:(NSString *)host)

@end
