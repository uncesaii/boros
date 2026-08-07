import { TextAttributes } from "@opentui/core"
import { useTheme } from "../context/theme"

export function Logo() {
  const { theme } = useTheme()
  return (
    <box flexDirection="row" alignItems="center" gap={1}>
      <text fg={theme.accent} attributes={TextAttributes.BOLD} selectable={false}>
        ◈
      </text>
      <text fg={theme.text} attributes={TextAttributes.BOLD} selectable={false}>
        boros
      </text>
    </box>
  )
}
