import Foundation




public struct LTHostLatency {
    public let hostname: String
    public var latency: Int
}

public let kPingDidUpdate = "kPingDidUpdate"
public let kPingDidComplete = "kPingDidComplete"

private let kPingTimeout: TimeInterval = 5

open class LTPingOperation : NSObject, SimplePingDelegate {
    
    open var hostLatency: LTHostLatency
    open var ping: SimplePing?
    open var completed = false
    
    fileprivate var startTimeInterval: TimeInterval?
    
    init(hostname: String) {
        hostLatency = LTHostLatency(hostname: hostname, latency: -1)
    }
    
    deinit {
        ping?.delegate = nil
    }
    
    open func start() {
        completed = false
        ping = SimplePing(hostName: hostLatency.hostname)
        if let p = ping {
            p.delegate = self
            
            DispatchQueue.main.asyncAfter(deadline: .now() + kPingTimeout) {[weak self] in
                self?.stop()
            }
            p.start()

        }
    }
    
    @objc open func stop() {
        if completed{
            return
        }
        ping?.stop()
        ping = nil
        startTimeInterval = nil
        completed = true
        
        NotificationCenter.default.post(name: Notification.Name(rawValue: kPingDidUpdate), object:[hostLatency.hostname:hostLatency.latency])
    }
    
    // MARK: - SimplePingDelegate
    
    /**
     Called after the SimplePing has successfully started up.  After this callback, you
     can start sending pings via -sendPingWithData:
     */
    open func simplePing(_ pinger: SimplePing!, didStartWithAddress address: Data!) {
        startTimeInterval = Date.timeIntervalSinceReferenceDate
        pinger.send(with: nil)
    }
    
    /**
     If this is called, the SimplePing object has failed.  By the time this callback is
     called, the object has stopped (that is, you don't need to call -stop yourself).
     
     IMPORTANT: On the send side the packet does not include an IP header.
     On the receive side, it does.  In that case, use +[SimplePing icmpInPacket:]
     to find the ICMP header within the packet.
     */
    open func simplePing(_ pinger: SimplePing!, didFailWithError error: Error!) {
        stop()
    }
    
    /**
     Called whenever the SimplePing object has successfully sent a ping packet.
     */
    open func simplePing(_ pinger: SimplePing!, didSendPacket packet: Data!) {
        
    }
    
    /**
     Called whenever the SimplePing object tries and fails to send a ping packet.
     */
    open func simplePing(_ pinger: SimplePing!, didFailToSendPacket packet: Data!, error: Error!) {
        stop()
    }
    
    /**
     Called whenever the SimplePing object receives an ICMP packet that looks like
     a response to one of our pings (that is, has a valid ICMP checksum, has
     an identifier that matches our identifier, and has a sequence number in
     the range of sequence numbers that we've sent out).
     public */
    open func simplePing(_ pinger: SimplePing!, didReceivePingResponsePacket packet: Data!) {
        if let startTime = startTimeInterval {
            let latency = Date.timeIntervalSinceReferenceDate - startTime
            hostLatency.latency = Int(latency * 1000)
        }
        stop()
    }
    
    open func simplePing(_ pinger: SimplePing!, didReceiveUnexpectedPacket packet: Data!) {
        print("--->simplePing.didReceiveUnexpectedPacket,hostip--->",self.hostLatency.hostname)
//        stop()
        
    }
}



@objc(Ltping)
open class LTPingQueue : RCTEventEmitter, SimplePingDelegate {
    
    open override class func requiresMainQueueSetup() -> Bool {
        return false
    }
    open  override func supportedEvents() -> [String]! {
        return [ "singlePingDidUpdate","batchPingDidComplete"]
    }
    
    
    lazy var operations: [LTPingOperation] = {
        return [LTPingOperation]()
    }()
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(LTPingQueue.pingDidUpdate(_:)),
            name: NSNotification.Name(rawValue: kPingDidUpdate),
            object: nil)
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(rawValue: kPingDidUpdate), object: nil)
    }
    
    func latencyForHostname(_ hostname: String) -> Int {
        if let pinger = (operations.filter { $0.hostLatency.hostname == hostname }.first) {
            return pinger.hostLatency.latency
        }
        
        let pingOperation = LTPingOperation(hostname: hostname)
        pingOperation.start()
        operations.append(pingOperation)
        return -1
    }
    
    
    @objc
    open func batchPing(_ hostList: Array<String>,resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void{
        
        var retMaps:[String:Int] = [:]
        hostList.forEach {[weak self] host in
            let latency = self?.latencyForHostname(host)
            retMaps[host] = latency
        }
        resolve(retMaps)
        
    }
    
    @objc
    open func restartAppPing() {
        operations.forEach {
            $0.hostLatency.latency = -1
            $0.start()
        }
    }
    
    open func clean() {
        operations.forEach { $0.stop() }
        operations.removeAll(keepingCapacity: false)
    }
    
    @objc open func pingDidUpdate(_ notification: Notification) {
        
        self.sendEvent(withName: "singlePingDidUpdate", body:notification.object)
        
        if operations.count != 0 && operations.filter({ !$0.completed }).count == 0 {
            NotificationCenter.default.post(name: Notification.Name(rawValue: kPingDidComplete), object: nil)
            self.sendEvent(withName: "batchPingDidComplete", body: nil)
            
        }
    }
    
}
