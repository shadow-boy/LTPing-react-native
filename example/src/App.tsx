import * as React from 'react';

import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { batchPing, restartAppPing, onPingDidCompletedListener, onPingDidUpdateListener } from 'react-native-ltping';


interface State {
  extraData: boolean
}

export default class App extends React.Component<{}, State>{
  hostList = ['136.244.95.54', '78.141.234.137', '149.28.77.119', '136.244.92.168', '45.76.167.201', '45.77.226.32', '95.179.210.148', '207.148.126.182', '217.69.3.32', '149.28.254.44', '78.141.222.58', '45.77.98.222', '108.61.217.149', '45.32.230.6', '144.202.22.127', '139.180.216.34', '45.77.25.146', '108.61.166.188', '140.82.24.140', '80.240.19.231', '45.76.81.58', '216.128.131.65', '136.244.105.232', '45.32.119.194', '45.77.73.146', '45.32.78.62', '217.69.9.129', '95.179.247.47', '95.179.230.211', '45.65.9.82', '45.65.9.139', '205.185.116.48', '95.174.71.151', '88.210.37.3', '172.104.212.180', '172.233.198.243', '139.162.73.91', '172.233.67.60', '5.183.102.23', '176.58.112.221', '5.8.33.52', '172.105.244.12', '172.233.255.214', '172.233.253.133', '172.232.43.13', '38.111.114.207', '38.111.114.91', '38.111.114.66', '172.105.103.129', '172.105.189.92', '194.195.248.95', '194.195.248.218', '88.119.169.168', '172.233.32.86', '170.187.237.40', '45.79.127.130', '46.17.45.96', '213.183.53.196', '213.183.53.247', '5.188.6.46', '95.85.72.220', '5.188.6.219', '95.174.68.170', '172.232.194.97', '172.232.158.37', '172.233.24.245', '172.233.24.244', '172.233.24.243', '172.233.24.242']
  pingResultomMap = new Map()
  listRef = React.createRef<FlatList>()
  constructor(props: any) {
    super(props)

    this.state = {
      extraData: false
    };
    // this.hostList = ['136.244.95.54', '78.141.234.137', '149.28.77.119', '136.244.92.168', '95.179.210.148', '207.148.126.182', '217.69.3.32', '149.28.254.44']
    // this.hostList = ['136.244.95.54', '217.69.3.32']

  };
  componentDidMount(): void {


    onPingDidCompletedListener(() => {
      console.log("ping.onPingDidCompletedListener--->");

    })

    onPingDidUpdateListener((state) => {
      console.log(`ping.onPingDidUpdateListener--->\n`);
      state.forEach((value, key) => {
        console.log(`key--->${key},value--->${value}`);
        this.pingResultomMap.set(key, value)
        this.setState({
          extraData: !this.state.extraData
        })
        // this.listRef.current?.forceUpdate


      })

    })


    batchPing(this.hostList).then(res => {
      console.log("batchPing.res--->", res);

    })
  }

  render(): React.ReactNode {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ref={this.listRef}
          style={{ flex: 1 }} data={this.hostList}
          extraData={this.state.extraData}
          ItemSeparatorComponent={() => {
            return <View style={{ backgroundColor: "transparent", height: 15 }}></View>
          }}
          renderItem={(info) => {
            return (
              <TouchableOpacity onPress={() => {
                restartAppPing()
              }}>
                <Text style={{ height: 50, textAlign: 'center', color: "blue", backgroundColor: "yellow", verticalAlign: "middle" }}>{info.item} ping==={this.pingResultomMap.get(info.item)}ms</Text>
              </TouchableOpacity>
            )
          }}></FlatList>
      </SafeAreaView>
    )
  }

}
