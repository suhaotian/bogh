import { CheckIcon, InfoIcon } from '@chakra-ui/icons';
import { Badge, Spinner } from '@chakra-ui/react';

import { useStore } from '../logs';

export function LogList() {
  const [state] = useStore();
  if (state.logs.length === 0) return null;
  return (
    <div className="text-xs py-4 max-h-24 overflow-y-auto">
      {state.logs.map((item, idx) => {
        let status = null;
        if (item.status === 'pending') {
          status = <Spinner size="xs" colorScheme="blue" />;
        } else if (item.status === 'success') {
          status = <CheckIcon color="green" />;
        } else {
          status = <InfoIcon color="red" />;
        }
        return (
          <div key={item.id} className="flex gap-1">
            <span>{status}</span>
            <Badge size={'xs'}>{item.type}</Badge>
            <span className="bold">{item.title}</span>
            <span>{item.message}</span>
          </div>
        );
      })}
    </div>
  );
}
