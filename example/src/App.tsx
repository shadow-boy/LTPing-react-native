import * as React from 'react';

import { View, Text, FlatList, TouchableOpacity, SafeAreaView, type EmitterSubscription } from 'react-native';
import { batchPing, restartAppPing, onPingDidCompletedListener, onPingDidUpdateListener, getSyncLatencyForHost, cleanPing } from 'react-native-ltping';


interface State {
  extraData: boolean
  currentIndex: number | null,
  hostList: Array<string>

}

export default class App extends React.Component<{}, State>{
  pingResultomMap = new Map()
  listRef = React.createRef<FlatList>()

  sub1: any = null
  sub2: any = null


  constructor(props: any) {
    super(props)

    this.state = {
      extraData: false,
      currentIndex: null,
      hostList: ["95.179.254.53", "95.179.230.211", "45.32.78.62", "95.179.166.91", "149.28.49.39", "78.141.234.137", "217.69.9.129", "207.148.78.149", "95.179.210.148", "216.128.131.65", "95.179.138.218", "45.77.152.123", "149.28.77.119", "45.32.230.6", "144.202.22.127", "149.28.134.97", "45.32.47.44", "108.61.166.188", "207.246.64.166", "80.240.29.4", "136.244.92.168", "149.28.254.44", "78.141.222.58", "207.148.126.182", "140.82.24.140", "108.61.217.149", "217.69.3.32", "136.244.95.54", "45.77.226.32", "92.223.30.55", "92.38.149.76", "205.185.119.188", "45.65.9.20", "45.79.22.46", "45.56.73.9", "139.144.21.181", "139.144.21.11", "143.42.120.169", "143.42.120.205", "67.205.146.238", "167.71.182.205", "143.110.192.42", "164.92.96.64", "109.166.37.94", "5.180.77.104", "172.105.224.94", "172.105.224.126", "172.233.93.114", "139.144.120.76", "45.118.134.147", "45.118.134.74", "45.118.134.64", "192.53.174.30", "146.190.94.149", "139.144.151.161", "139.144.151.162", "213.168.250.17", "176.58.120.251", "178.79.176.31", "5.8.33.52", "46.101.8.153", "172.104.144.9", "192.46.235.237", "139.162.152.119", "134.122.74.139", "172.233.255.222", "172.232.54.177", "172.232.63.136", "172.105.22.247", "172.105.6.131", "172.105.22.74", "172.105.103.11", "138.197.130.14", "172.105.254.79", "172.105.191.245", "170.64.182.118", "172.233.32.96", "134.209.81.80", "170.187.235.61", "170.187.235.137", "170.187.235.31", "192.46.214.249", "45.79.127.155", "159.65.156.153", "45.136.244.46", "45.140.169.198", "5.188.6.46", "95.85.72.219", "95.85.72.215", "95.85.72.218", "95.174.68.172", "95.174.68.220", "172.232.194.240", "172.232.194.241", "172.232.194.238", "172.232.146.8", "172.232.146.9", "172.232.147.142", "172.233.24.246", "172.233.24.241", "172.233.24.240", "172.233.24.238"]
    };
    // this.hostList = ['136.244.95.54', '78.141.234.137', '149.28.77.119', '136.244.92.168', '95.179.210.148', '207.148.126.182', '217.69.3.32', '149.28.254.44']
    // this.hostList = ['136.244.95.54', '217.69.3.32']

  };
  componentDidMount(): void {


    this.sub1 = onPingDidCompletedListener(() => {
      console.log("ping.onPingDidCompletedListener--->");

    })

    this.sub2 = onPingDidUpdateListener((state) => {
      console.log(`ping.onPingDidUpdateListener--->`);
      state.forEach((value, key) => {
        console.log(`key--->${key},value--->${value}`);
        // this.pingResultomMap.set(key, value)

      })

      this.setState({
        extraData: !this.state.extraData
      })

    })


    // batchPing(this.hostList).then(res => {
    //   console.log("batchPing.res--->", res);

    // })
  }

  render(): React.ReactNode {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ref={this.listRef}
          style={{ flex: 1 }} data={this.state.hostList}
          extraData={this.state.extraData}
          ItemSeparatorComponent={() => {
            return <View style={{ backgroundColor: "transparent", height: 15 }}></View>
          }}
          renderItem={(info) => {
            return (
              <TouchableOpacity onPress={() => {
                this.setState({
                  currentIndex: info.index
                })
              }}>
                <Text style={{
                  height: 50,
                  textAlign: 'center',
                  color: "blue",
                  backgroundColor: info.index == this.state.currentIndex ? "green" : "yellow",
                  verticalAlign: "middle"
                }}>{info.item}---{'>'}{this.getPing(info.item)}ms</Text>
              </TouchableOpacity>
            )
          }}></FlatList>

        <TouchableOpacity
          style={{
            width: 60, height: 60,
            borderRadius: 30,
            backgroundColor: "blue",
            justifyContent: 'center',
            alignItems: 'center',
            position: "absolute",
            left: 20,
            bottom: 20,
          }}
          onPress={() => {
            restartAppPing()
            // cleanPing()
            // this.setState({
            //   hostList: [...this.state.hostList]
            // })

          }}>
          <Text style={{ color: "red" }}>restartPing</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
  getPing(ip: string) {
    let ping = getSyncLatencyForHost(ip)
    if (ping > 0) {
      return ping
    }
    return null
  }

}
