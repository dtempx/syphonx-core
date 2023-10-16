[syphonx-core](../README.md) / [Exports](../modules.md) / Metrics

# Interface: Metrics

Returns extraction metrics.

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

Number of actions in the template. (recursive)

#### Defined in

extract/public/Metrics.ts:6

___

### clicks

• **clicks**: `number`

Number of clicks that occurred.

#### Defined in

extract/public/Metrics.ts:8

___

### elapsed

• **elapsed**: `number`

Total elapsed run time. (milliseconds)

#### Defined in

extract/public/Metrics.ts:10

___

### errors

• **errors**: `number`

Number of errors that occurred.

#### Defined in

extract/public/Metrics.ts:12

___

### navigate

• **navigate**: `number`

Amount of time spent navigating. (milliseconds)

#### Defined in

extract/public/Metrics.ts:14

___

### queries

• **queries**: `number`

Count of DOM queries run.

#### Defined in

extract/public/Metrics.ts:16

___

### renavigations

• **renavigations**: `number`

Count of renavigations that occurred.

#### Defined in

extract/public/Metrics.ts:18

___

### retries

• **retries**: `number`

Count of navigation retries that occurred.

#### Defined in

extract/public/Metrics.ts:20

___

### skipped

• **skipped**: `number`

Number of steps skipped. A skip occurs on an unsatisfied `when` condition.

#### Defined in

extract/public/Metrics.ts:22

___

### snooze

• **snooze**: `number`

Amount of time spent in a snooze action. (milliseconds)

#### Defined in

extract/public/Metrics.ts:24

___

### steps

• **steps**: `number`

Number of steps run.

#### Defined in

extract/public/Metrics.ts:26

___

### timeouts

• **timeouts**: `number`

Count of timeouts that occurred in a waitfor action.

#### Defined in

extract/public/Metrics.ts:28

___

### waitfor

• **waitfor**: `number`

Amount of time spent in a waitfor action. (milliseconds)

#### Defined in

extract/public/Metrics.ts:30

___

### yields

• **yields**: `number`

Count of yield actions that occurred.

#### Defined in

extract/public/Metrics.ts:32