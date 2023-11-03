

#import "SimplePingRN.h"

@interface RCT_EXTERN_MODULE(Ltping, RCTEventEmitter)


RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(batchPing:(NSArray * )hostList resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(restartAppPing)

@end
