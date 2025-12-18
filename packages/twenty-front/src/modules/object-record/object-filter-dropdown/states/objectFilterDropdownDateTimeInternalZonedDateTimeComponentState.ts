import { ObjectFilterDropdownComponentInstanceContext } from '@/object-record/object-filter-dropdown/states/contexts/ObjectFilterDropdownComponentInstanceContext';
import { createComponentState } from '@/ui/utilities/state/component-state/utils/createComponentState';
import { type Temporal } from 'temporal-polyfill';

export const objectFilterDropdownDateTimeInternalZonedDateTimeComponentState =
  createComponentState<Temporal.ZonedDateTime | undefined | null>({
    key: 'objectFilterDropdownDateTimeInternalZonedDateTimeComponentState',
    defaultValue: undefined,
    componentInstanceContext: ObjectFilterDropdownComponentInstanceContext,
  });
