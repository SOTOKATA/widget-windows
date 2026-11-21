import { todoColors } from '../../typescript/todoColors'

export function relativeTypeButtonClass(type, itemType): string {
  if (type !== itemType) return ''

  function getColors(itemType: string): string | undefined {
    // if (itemType === 'neutral') return todoColors.normal
    if (itemType === 'accent') return todoColors.accent
    else if (itemType === 'important') return todoColors.important
    else if (itemType === 'critical') return todoColors.critical
    else return undefined
  }

  const colors = getColors(itemType)
  return colors ? `${colors} shadow-none` : ''
}
