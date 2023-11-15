# react-native-ltping

simple ping module for react-native applicaiton support ios only

## Installation

```sh
npm install react-native-ltping
```

## Usage

```js
import { batchPing,onPingDidCompletedListener ,onPingDidUpdateListener} from 'react-native-ltping';

// ...

 componentDidMount(): void {



    batchPing(this.hostList).then(res => {
      console.log("batchPing.res--->", res);

    })

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
  }


```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
