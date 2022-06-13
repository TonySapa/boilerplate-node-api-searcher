import * as apiMessages from '../../labels/api_messages/firms'
import * as devTips from '../../labels/dev_tips/firms'
import { ApiResponse } from '../../types'

export const noMatches: ApiResponse = {
  message_code: 4041,
  message_text: apiMessages.noMatches,
  dev_tip: devTips.noMatches
}

export const noFromDate: ApiResponse = {
  message_code: 4001,
  message_text: apiMessages.noFromDate,
  dev_tip: devTips.noFromDate
}

export const wrongFirmId = (id?: string) => ({
  message_code: 4042,
  message_text: apiMessages.wrongFirmId(id),
  dev_tip: devTips.wrongFirmId
})

export const missingErrorType: ApiResponse = {
  message_code: 4221,
  message_text: apiMessages.missingErrorType,
  dev_tip: apiMessages.missingErrorType
}
