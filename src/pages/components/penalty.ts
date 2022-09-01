import { ListField } from 'components/TableList/types'

export const PENALTY_LIST_FIELD_MAP: Record<string, ListField> = {
  proposalId: {
    label: 'Proposal #',
    value: 'proposalId',
    type: 'number',
  },
  commision: {
    label: 'Commission',
    value: 'commision',
    type: 'change',
    neutral: true,
  },
  chagned: {
    label: 'Commission changed date',
    value: 'chagned',
  },
  percentage: {
    label: 'Block missing',
    value: 'percentage',
    type: 'change',
    neutral: true,
  },
  missing_block: {
    label: 'Missed block',
    value: 'missing_block',
    type: 'number',
  },
  last_height: {
    label: 'Last signed height',
    value: 'last_height',
  },
  height: {
    label: 'height',
    value: 'height',
  },
  link: {
    label: 'Reference',
    value: 'link',
  },
  desc: {
    label: 'Description',
    value: 'desc',
  },
  dataDesc: {
    label: 'Description',
    value: 'dataDesc',
  },
}
