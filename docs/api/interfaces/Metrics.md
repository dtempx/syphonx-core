[syphonx-core](../README.md) / Metrics

# Interface: Metrics

Performance and diagnostic metrics collected during a template extraction run.
Provides insight into how the extraction engine executed, including timing breakdowns,
action counts, and error/retry statistics useful for debugging and optimization.

## Table of contents

### Properties

- [actions](Metrics.md#actions)
- [clicks](Metrics.md#clicks)
- [elapsed](Metrics.md#elapsed)
- [errors](Metrics.md#errors)
- [navigate](Metrics.md#navigate)
- [queries](Metrics.md#queries)
- [renavigations](Metrics.md#renavigations)
- [retries](Metrics.md#retries)
- [skipped](Metrics.md#skipped)
- [snooze](Metrics.md#snooze)
- [steps](Metrics.md#steps)
- [timeouts](Metrics.md#timeouts)
- [waitfor](Metrics.md#waitfor)
- [yields](Metrics.md#yields)

## Properties

### actions

• **actions**: `number`

Total number of actions in the template, counted recursively across all nested action groups.

#### Defined in

[package/public/Metrics.ts:8](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L8)

___

### clicks

• **clicks**: `number`

Number of click actions that were executed during the extraction run.

#### Defined in

[package/public/Metrics.ts:10](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L10)

___

### elapsed

• **elapsed**: `number`

Total wall-clock time for the entire extraction run. (milliseconds)

#### Defined in

[package/public/Metrics.ts:12](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L12)

___

### errors

• **errors**: `number`

Total number of errors encountered during extraction, including selector failures and action errors.

#### Defined in

[package/public/Metrics.ts:14](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L14)

___

### navigate

• **navigate**: `number`

Cumulative time spent waiting for page navigations to complete. (milliseconds)

#### Defined in

[package/public/Metrics.ts:16](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L16)

___

### queries

• **queries**: `number`

Total number of DOM queries (CSS, jQuery, and XPath selectors) executed against the document.

#### Defined in

[package/public/Metrics.ts:18](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L18)

___

### renavigations

• **renavigations**: `number`

Number of times the engine re-navigated to a URL, typically due to a page redirect or reload action.

#### Defined in

[package/public/Metrics.ts:20](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L20)

___

### retries

• **retries**: `number`

Number of navigation retry attempts triggered by failed or incomplete page loads.

#### Defined in

[package/public/Metrics.ts:22](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L22)

___

### skipped

• **skipped**: `number`

Number of action steps skipped due to an unsatisfied `when` condition.

#### Defined in

[package/public/Metrics.ts:24](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L24)

___

### snooze

• **snooze**: `number`

Cumulative time spent paused in snooze actions. (milliseconds)

#### Defined in

[package/public/Metrics.ts:26](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L26)

___

### steps

• **steps**: `number`

Total number of action steps executed during the extraction run.

#### Defined in

[package/public/Metrics.ts:28](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L28)

___

### timeouts

• **timeouts**: `number`

Number of times a waitfor action exceeded its timeout threshold without the condition being met.

#### Defined in

[package/public/Metrics.ts:30](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L30)

___

### waitfor

• **waitfor**: `number`

Cumulative time spent waiting in waitfor actions for a DOM condition to be satisfied. (milliseconds)

#### Defined in

[package/public/Metrics.ts:32](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L32)

___

### yields

• **yields**: `number`

Number of times the engine yielded control back to the host for an external operation (navigate, click, screenshot, etc.).

#### Defined in

[package/public/Metrics.ts:34](https://github.com/dtempx/syphonx-core/blob/main/package/public/Metrics.ts#L34)
