export interface MarkdownSettings {
  h1: string
  h2: string
  h3: string
  h4: string
  h5: string
  h6: string

  p: string
  blockquote: string
  table: string
  ul: string
  ol: string
  li: string
}

interface MarkdownSettingsArgs {
  h1?: string
  h2?: string
  h3?: string
  h4?: string
  h5?: string
  h6?: string

  p?: string
  blockquote?: string
  table?: string
  ul?: string
  ol?: string
  li?: string
}

export function createMarkdownSettings(data?: MarkdownSettingsArgs): MarkdownSettings {
  return {
    h1: data?.h1 ?? 'text-2xl font-bold mt-1 mb-2',
    h2: data?.h2 ?? 'text-xl font-semibold mt-1 mb-2',
    h3: data?.h3 ?? 'text-lg font-semibold mt-1 mb-2',
    h4: data?.h4 ?? 'text-base font-medium mt-1 mb-2',
    h5: data?.h5 ?? 'text-base font-medium mt-1 mb-2',
    h6: data?.h6 ?? 'text-base font-medium mt-1 mb-2',

    table: data?.table ?? 'table table-sm',

    blockquote: data?.blockquote ?? 'border-s border-s-2 rounded-sm ps-2.5 mt-1 mb-2',

    p: data?.p ?? '',

    ul: data?.ul ?? 'list-disc',
    ol: data?.ol ?? 'list-decimal',
    li: data?.li ?? 'list-disc ms-5'
  }
}
