import { Message, type Snowflake, SnowflakeUtil } from 'discord.js'

// from https://github.com/AnswerOverflow/AnswerOverflow/blob/main/LICENSE.md

export function getRandomTime (start?: Date, end?: Date) {
  if (!start) {
    start = new Date(2015, 0, 1)
  }
  if (!end) {
    end = new Date()
  }
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

export function randomSnowflake (start?: Date, end?: Date) {
  return SnowflakeUtil.generate({ timestamp: getRandomTime(start, end) })
}

export function randomSnowflakeLargerThan (start: Snowflake) {
  return SnowflakeUtil.generate({
    timestamp: new Date(SnowflakeUtil.timestampFrom(start) + 1000)
  })
}

export function isSnowflakeLargerAsInt (a: Snowflake, b: Snowflake) {
  return isSnowflakeLarger(a, b) ? (isSnowflakeLarger(a, b) ? 1 : 0) : -1
}

export function isSnowflakeLarger (a: Snowflake, b: Snowflake) {
  const aAsBigInt = BigInt(a)
  const bAsBigInt = BigInt(b)
  return aAsBigInt > bAsBigInt
}

export function sortMessagesById<T extends Message> (messages: T[]) {
  return messages.sort((a, b) => isSnowflakeLargerAsInt(a.id, b.id))
}
