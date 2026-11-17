export interface MarkdownSettingItemData {
  range: string[]
  markdownPreview: string
}

export const headingData: MarkdownSettingItemData = {
  range: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  markdownPreview: `
# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6
`
}

export const listData: MarkdownSettingItemData = {
  range: ['ol', 'ul', 'li'],
  markdownPreview: `
1. Ordered item
2. Ordered item

- Unordered item
- Unordered item
`
}

export const otherData: MarkdownSettingItemData = {
  range: ['blockquote', 'table', 'p'],
  markdownPreview: `
> Blockquote example

| Place      | Time  | Number of people |
| ---------- | ----- | ---------------- |
| Restaurant | 14:00 | 3                |
| Park       | 16:00 | 4                |

Paragraph example.
`
}
