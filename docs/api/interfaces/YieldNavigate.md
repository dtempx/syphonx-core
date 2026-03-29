[syphonx-core](../README.md) / YieldNavigate

# Interface: YieldNavigate

Payload for a host-side navigation yield. The host navigates to `url` and
waits for the page to reach the load state specified by `YieldParams.waitUntil`
before re-entering the engine.

## Table of contents

### Properties

- [url](YieldNavigate.md#url)

## Properties

### url

• **url**: `string`

The URL the host should navigate to.

#### Defined in

[package/public/Yield.ts:133](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L133)
