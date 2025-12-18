import { ObjectFilterDropdownComponentInstanceContext } from '@/object-record/object-filter-dropdown/states/contexts/ObjectFilterDropdownComponentInstanceContext';
import { createComponentState } from '@/ui/utilities/state/component-state/utils/createComponentState';
import { type Temporal } from 'temporal-polyfill';

export const objectFilterDropdownDateInternalZonedDateTimeComponentState =
  createComponentState<Temporal.ZonedDateTime | undefined | null>({
    key: 'objectFilterDropdownDateInternalZonedDateTimeComponentState',
    defaultValue: undefined,
    componentInstanceContext: ObjectFilterDropdownComponentInstanceContext,
  });
