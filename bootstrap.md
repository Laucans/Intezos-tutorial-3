When you are working on a blockchain like Tezos, communication with a wallet is something necessary. Beacon-sdk is using `stream` to interoperate with it, to make packages lighter on browser, `stream` which is not common in webapp is not natively packaged by builders. 

In our case we need it, so we are using [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) in our vite configuration to bring it. 


If you check `vite.config.ts` file you will see 
```typescript
resolve: {
  alias: {
    // polyfills
    "readable-stream": "vite-compatible-readable-stream",
    stream: "vite-compatible-readable-stream"
  }
}
```

If this config is not setup and you try to connect your wallet, you will see : 
```
Uncaught (in promise) TypeError: Transform is undefined
```

When you work with blockchain, it is possible that other polyfills are needed, now you know how to manage them.
