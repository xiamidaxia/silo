
## flatdoc

### Support Schema type

- Collection: 表结构，会初始化为表
- 基础数据:
  - String: range, match, max, min, uppercase, lowercase, trim
  - Password
  - Number: range
  - Date: range, defaultNow,
  - ID: ObjectID
  - Enum: enums
  - Array: itemType range
  - Boolean
  - Buffer: 可扩展 // todo
- 基础数据通用方法
  - required
  - defaultValue


### TODO

- alias
- validator支持promise
- array schema